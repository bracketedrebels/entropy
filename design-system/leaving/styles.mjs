import { readFile } from 'node:fs/promises'
import { dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import { glob } from 'tinyglobby'

const presets = fileURLToPath(new URL('./tailwind.css', import.meta.url))
const ignore = ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/storybook-static/**', '**/coverage/**']
const namePattern = /^[a-zA-Z_][\w-]*$/

// Colons inside arbitrary Tailwind values/selectors do not separate variants.
export function candidate(token) {
  const parts = token.replace(/!$/, '').split(/:(?![^\[\]]*\])/)
  return { utility: parts.pop(), leaving: parts.includes('leaving') }
}

function targets(at) {
  for (let owner = at.parent; owner; owner = owner.parent) {
    if (owner.type === 'rule') {
      // Tailwind permits a self variant inside a named utility. Descendant selectors
      // have their own lifetime and must not opt the containing class into presence.
      if (/^&(?::[\w-]+)+$/.test(owner.selector)) continue
      return owner.selectors.map(s => s.trim()).filter(s => s.startsWith('.') && namePattern.test(s.slice(1))).map(s => s.slice(1))
    }
    if (owner.type === 'atrule' && owner.name === 'utility') return namePattern.test(owner.params) ? [owner.params] : []
  }
  return []
}

export async function leavingStyles(root, styles, resolveImport) {
  const files = new Set()
  const parents = new Map()
  const aliases = new Set()
  async function read(file) {
    if (files.has(file) || !file.endsWith('.css') || file.endsWith('.module.css')) return
    files.add(file)
    const source = await readFile(file, 'utf8')
    if (!/@(?:apply|import|reference|variant)\b/.test(source)) return
    const sheet = postcss.parse(source, { from: file })
    const imports = []
    sheet.walkAtRules(at => {
      if (at.name === 'import' || at.name === 'reference') {
        const spec = at.params.match(/^(?:url\(\s*)?["']([^"']+)["']/)?.[1]
          ?? at.params.match(/^url\(\s*([^"'\s)]+)\s*\)/)?.[1]
        if (spec && !/^(?:[a-z]+:|\/\/)/i.test(spec)) imports.push(spec)
        return
      }
      if (at.name !== 'apply' && !(at.name === 'variant' && at.params === 'leaving')) return
      const owners = targets(at)
      if (at.name === 'variant') { for (const name of owners) aliases.add(name); return }
      for (const token of at.params.split(/\s+/)) {
        const { utility, leaving } = candidate(token)
        for (const name of owners) {
          if (leaving) aliases.add(name)
          let refs = parents.get(utility)
          if (!refs) parents.set(utility, refs = new Set())
          refs.add(name)
        }
      }
    })
    await Promise.all(imports.map(async spec => {
      const id = await resolveImport(spec, file)
      if (id && isAbsolute(id)) await read(id)
    }))
  }
  const paths = await glob(styles, { cwd: root, absolute: true, dot: true, ignore })
  await Promise.all([presets, ...paths].map(read))
  // Set iteration visits newly discovered aliases, including across files.
  for (const alias of aliases) for (const owner of parents.get(alias) ?? []) aliases.add(owner)
  return { aliases, files }
}

export function leavingIndex(styles = ['**/*.css']) {
  let config, resolveCss, current, pending
  let revision = 0
  const versions = new Map()
  async function rebuild() {
    const next = await leavingStyles(config.root, styles, async (spec, file) =>
      (await resolveCss(spec, file)) ?? (spec.startsWith('.') ? resolve(dirname(file), spec) : undefined))
    const changed = !current || current.aliases.size !== next.aliases.size || [...current.aliases].some(k => !next.aliases.has(k))
    if (changed) revision++
    current = next
    return changed
  }
  function refresh() {
    const task = (pending ?? Promise.resolve()).then(rebuild)
    pending = task
    task.finally(() => { if (pending === task) pending = undefined }).catch(() => {})
    return task
  }
  return {
    configure(configValue) {
      config = configValue
      resolveCss = config.createResolver({ extensions: ['.css'], mainFields: ['style'], conditions: ['style'], tryIndex: false })
    },
    async start(ctx) {
      await refresh()
      for (const file of current.files) ctx.addWatchFile(file)
    },
    async aliases(id) {
      if (pending) await pending
      if (!current) await refresh()
      versions.set(id, revision)
      return current.aliases
    },
    stale(id) { return versions.has(id) && versions.get(id) !== revision },
    async hot(ctx) {
      if (!ctx.file.endsWith('.css')) return
      const changed = await refresh()
      ctx.server.watcher.add([...current.files])
      if (!changed) return
      // A CSS-only edit can change which already served JSX modules need boundaries.
      for (const id of versions.keys()) {
        const module = ctx.server.moduleGraph.getModuleById(id)
        if (module) ctx.server.moduleGraph.invalidateModule(module)
      }
      ctx.server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}
