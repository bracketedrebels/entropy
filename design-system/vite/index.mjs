import { resolve } from 'node:path'
import { normalizePath } from 'vite'
import { leavingIndex } from './leaving-styles.mjs'
import { transformLeaving } from './leaving.mjs'

const runtimes = ['@neui/kit/ripple', '@neui/kit/ridge', '@neui/kit/swipe']
const bootstrap = runtimes.map(runtime => `import '${runtime}';`).join('\n')

/** @type {typeof import('./index.d.mts').neui} */
export function neui({ clientEntry, leaving = true, leavingStyles } = {}) {
  const exits = leaving && neuiLeaving({ styles: leavingStyles })
  let entry

  return {
    ...exits,
    name: 'neui:client',
    enforce: 'pre',
    // The worklet URL is relative to its module. Let Vite process it as an asset in dev as in build.
    config: () => ({ optimizeDeps: { exclude: runtimes } }),
    configResolved(config) {
      if (exits) exits.configResolved(config)
      if (clientEntry) entry = normalizePath(resolve(config.root, clientEntry))
    },
    transformIndexHtml: {
      order: 'pre',
      handler() {
        if (entry) return
        return [{ tag: 'script', attrs: { type: 'module' }, children: bootstrap, injectTo: 'head-prepend' }]
      },
    },
    async transform(code, id, options) {
      const transformed = exits ? await exits.transform(code, id) : undefined
      if (id !== entry || options?.ssr || this.environment?.config.consumer === 'server') return transformed
      return { code: (transformed?.code ?? code) + '\n' + bootstrap + '\n', map: transformed?.map ?? null }
    },
  }
}


/** Standalone Tailwind/React presence transform, also included in neui(). */
export function neuiLeaving({ styles } = {}) {
  const index = leavingIndex(styles)
  return {
    name: 'neui:leaving',
    enforce: 'pre',
    configResolved: config => index.configure(config),
    buildStart() { return index.start(this) },
    shouldTransformCachedModule: ({ id }) => index.stale(id) || null,
    hotUpdate(ctx) { return index.hot(ctx) },
    async transform(code, id) {
      if (!/\.[jt]sx$/.test(id) || id.includes('/node_modules/')) return
      return transformLeaving(code, id, await index.aliases(id))
    },
  }
}
