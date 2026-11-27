// @vitest-environment node
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { build, createServer } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import postcss from 'postcss'
import { neui } from '@neui/kit/vite'

const kit = fileURLToPath(new URL('../', import.meta.url))
const runtime = '/src/ripple/index.ts'
let root

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'neui-vite-'))
  await mkdir(join(root, 'node_modules/@neui'), { recursive: true })
  await symlink(kit, join(root, 'node_modules/@neui/kit'), 'dir')
  await symlink(join(kit, 'node_modules/tailwindcss'), join(root, 'node_modules/tailwindcss'), 'dir')
  await writeFile(join(root, 'index.html'), '<section class="neui-ridge neui-track-focus neui-ridge-radius-[1.5rem] neui-ridge-inset-[12px] neui-focus-band-[32px] neui-ridge-depth-0 neui-ridge-depth-[0.5] neui-focus-strength-[1.8]"><button class="action">Press</button></section><script type="module" src="./client.tsx"></script>')
  await writeFile(join(root, 'client.tsx'), `import './app.css'
    const h = (tag: string, props: object) => Object.assign(document.createElement(tag), props)
    document.body.append(<button className={location.hash ? 'neui-ripple' : 'neui-pill'} />)`)
  await writeFile(join(root, 'app.css'), '@import "tailwindcss"; @import "@neui/kit/tailwind.css"; .action { @apply neui-ripple neui-focus duration-500 ease-linear; }')
})
afterEach(() => rm(root, { recursive: true, force: true }))

function config(options) {
  return {
    root, configFile: false, base: './', logLevel: 'silent',
    esbuild: { jsxFactory: 'h' },
    css: { postcss: { plugins: [] } },
    plugins: [tailwindcss(), neui(options)],
  }
}

it('bundles one runtime and its worklet for an HTML app with Tailwind and no React', async () => {
  const { output } = await build({ ...config(), build: { write: false, minify: false, cssMinify: false } })
  const modules = output.filter(file => file.type === 'chunk').flatMap(chunk => Object.keys(chunk.modules))
  expect(modules.filter(id => id.endsWith('/src/grain/index.ts'))).toHaveLength(1)
  expect(modules.filter(id => id.endsWith(runtime))).toHaveLength(1)
  expect(modules.filter(id => id.endsWith('/src/swipe/index.ts'))).toHaveLength(1)
  expect(modules.filter(id => id.endsWith('/src/ridge/index.ts'))).toHaveLength(1)
  expect(modules.some(id => id.includes('/node_modules/react/'))).toBe(false)
  expect(output.some(file => /ripple\.paint-.+\.js$/.test(file.fileName))).toBe(true)
  const css = output.find(file => file.fileName.endsWith('.css')).source
  expect(css).toMatch(/--neui-row-radius:\s*1.5rem/)
  expect(css).toMatch(/--neui-inset:\s*12px/)
  expect(css).toMatch(/--neui-band:\s*32px/)
  expect(css).toMatch(/--neui-ridge-depth:\s*0;/)
  expect(css).toMatch(/--neui-ridge-depth:\s*0?\.5;/)
  expect(css).toMatch(/--neui-focus-strength:\s*1\.8;/)
  expect(css).toMatch(/mix-blend-mode:\s*overlay/)
  const surfaces = postcss.parse(css)
  const themeValue = (selector, name) => {
    let value
    surfaces.walkRules(selector, rule => rule.walkDecls(name, decl => { value = decl.value }))
    return value
  }
  expect(themeValue(':where(.neui-surface)', '-webkit-tap-highlight-color')).toBe('transparent')
  expect(themeValue(':where(.neui-surface)', '--_neui-ridge-halo-filter')).toBe('none')
  expect(themeValue(/:where\(\.neui-surface\[data-theme=["']?dark/, '--_neui-ridge-halo-filter')).toBe('initial')
  const action = css.match(/\.action\s*\{([^}]+)\}/)?.[1]
  expect(action).toMatch(/--neui-ripple-target:\s*1/)
  expect(action).toMatch(/--neui-focus-target:\s*1/)
  expect(action).toMatch(/--tw-ease:\s*linear/)
  // The NEUI bridge reads this non-inheriting value on the target, before styling ::after.
  expect(action).toMatch(/--tw-duration:\s*(?:500ms|0?\.5s);/)
  expect(css).toMatch(/--neui-utility-duration:\s*var\(--tw-duration\)/)
})

it('builds signed relief with an integrated counter-curved face and continuous corners', async () => {
  await writeFile(join(root, 'app.css'), `@import "tailwindcss";
    @plugin "@neui/kit/relief";
    @source inline("neui-relief neui-extruded neui-intruded neui-depth-0 neui-depth-[-2.5px] active:-neui-depth-4 hover:neui-depth-8");`)
  const { output } = await build({
    ...config(), plugins: [tailwindcss()], build: { write: false, minify: false, cssMinify: false },
  })
  const css = output.find(file => file.fileName.endsWith('.css')).source
  expect(css).toMatch(/@property --neui-depth\s*\{[^}]*initial-value: 8px/s)
  const sheet = postcss.parse(css)
  const declarations = name => {
    const values = {}
    sheet.walkRules('.' + name, rule => rule.walkDecls(decl => { values[decl.prop] = decl.value }))
    return values
  }
  const signed = declarations('neui-relief')
  expect(signed['--_neui-recess']).toBe('max(0px, 0px - var(--neui-depth))')
  expect(signed['--_neui-rise']).toBe('max(0px, var(--neui-depth))')
  expect(declarations('neui-intruded')['--neui-depth']).toBe('-8px')
  expect(signed['corner-shape']).toBe('squircle')
  expect(signed['border-image-source']).toBeUndefined()
  expect(signed['--_neui-face-offset']).toBe('calc(var(--neui-depth) - var(--_neui-recess))')
  const faceOffsets = [...signed['box-shadow'].matchAll(/inset 0 calc\(var\(--_neui-face-offset\) \* ([-.\d]+)\)/g)]
  expect(faceOffsets.map(match => Math.sign(Number(match[1])))).toEqual([1, -1])
  expect(css).toContain('active\\:-neui-depth-4')
  for (const value of ['0px', '-2.5px', '8px']) expect(css).toContain(`--neui-depth: ${value}`)
  expect(css).toContain('prefers-reduced-motion')
  expect(output.filter(file => file.type === 'chunk').flatMap(file => Object.keys(file.modules))
    .some(id => id.includes('/src/relief/'))).toBe(false)
})

it('injects into the custom TSX client entry and leaves the SSR entry free of browser behavior', async () => {
  const clientEntry = 'client.tsx'
  const input = join(root, clientEntry)
  const shared = config({ clientEntry })
  const client = await build({ ...shared, build: { write: false, rollupOptions: { input } } })
  expect(client.output.some(file => file.type === 'chunk' && Object.keys(file.modules).some(id => id.endsWith(runtime)))).toBe(true)
  const server = await build({ ...config({ clientEntry }), build: { write: false, ssr: input } })
  expect(server.output.filter(file => file.type === 'chunk').map(file => file.code).join('')).not.toMatch(/@neui\/kit\/ripple|neui\.ripple\.installed/)
  expect(server.output.every(file => file.type !== 'chunk' || !Object.keys(file.modules).some(id => id.endsWith('/src/ridge/index.ts')))).toBe(true)
  expect(server.output.some(file => file.fileName.includes('ripple.paint'))).toBe(false)
})

it('resolves the injected HTML import in the Vite dev server', async () => {
  const server = await createServer({ ...config(), server: { middlewareMode: true, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true } })
  try {
    const html = await server.transformIndexHtml('/index.html', '<html><head></head><body></body></html>')
    const bootstrapUrls = [...html.matchAll(/src="([^"]*html-proxy[^"]*)"/g)].map(match => match[1].replaceAll('&amp;', '&'))
    expect(bootstrapUrls).toHaveLength(1)
    const bootstrap = await server.transformRequest(bootstrapUrls[0])
    expect(bootstrap.code).toContain('/src/ripple/index.ts')
    expect(bootstrap.code).toContain('/src/ridge/index.ts')
  } finally {
    await server.close()
  }
})

it('connects a custom client module in dev while preserving its raw source and HTML', async () => {
  const server = await createServer({ ...config({ clientEntry: 'client.tsx' }),
    server: { middlewareMode: true, ws: false, watch: null }, optimizeDeps: { noDiscovery: true } })
  try {
    const client = await server.transformRequest('/client.tsx')
    expect(client.code).toContain('/src/ripple/index.ts')
    const raw = await server.transformRequest('/client.tsx?raw')
    expect(raw.code).not.toMatch(/@neui\/kit\/ripple|\/src\/ripple\/index/)
    const html = await server.transformIndexHtml('/index.html', '<html><head></head><body></body></html>')
    expect(html).not.toContain('html-proxy')
  } finally {
    await server.close()
  }
})

it('resolves transitive @apply aliases before JSX in dev and SSR and refreshes on stylesheet edits', async () => {
  const style = join(root, 'shared.css')
  await writeFile(style, '@utility middle { @apply neui-collapse-inline; }')
  await writeFile(join(root, 'app.css'), '@import "tailwindcss"; @import "@neui/kit/tailwind.css"; @import "./shared.css"; .toolbar { @apply middle; }')
  await writeFile(join(root, 'panel.tsx'), 'export const Panel = ({ open }) => open && <div className="toolbar" />')
  const server = await createServer({ ...config({ leavingStyles: ['app.css'] }), server: { middlewareMode: true, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true } })
  try {
    for (const ssr of [false, true]) {
      const transformed = await server.transformRequest('/panel.tsx', { ssr })
      expect(transformed.code).toContain('presence')
      expect(transformed.code).not.toContain('leaving:')
    }
    await writeFile(style, '@utility middle { @apply block; }')
    const plugin = server.config.plugins.find(plugin => plugin.name === 'neui:client')
    await plugin.hotUpdate({ file: style, server })
    const updated = await server.transformRequest('/panel.tsx')
    expect(updated.code).not.toContain('presence')
    await writeFile(style, '@utility middle { @apply neui-collapse-block; }')
    await plugin.hotUpdate({ file: style, server })
    expect((await server.transformRequest('/panel.tsx')).code).toContain('presence')
  } finally { await server.close() }
})

it('builds aliased starting and leaving styles without rewriting the host class', async () => {
  await writeFile(join(root, 'app.css'), `@import "tailwindcss"; @import "@neui/kit/tailwind.css";
    @utility compressed { @apply neui-collapse-inline; }
    .toolbar { @apply compressed duration-500; }`)
  await writeFile(join(root, 'client.tsx'), `import './app.css'
    import { createElement as h } from 'react'
    export const Toolbar = ({open}) => open && <div className="toolbar"><button>Collapse</button></div>
    console.log(Toolbar)`)
  // Resolve React for this consumer fixture, as it would be installed in an application.
  await symlink(join(kit, 'node_modules/react'), join(root, 'node_modules/react'), 'dir')
  const { output } = await build({ ...config(), build: { write: false, minify: false, cssMinify: false } })
  const chunks = output.filter(file => file.type === 'chunk')
  expect(chunks.some(file => Object.keys(file.modules).some(id => id.endsWith('/src/reveal/presence.tsx')))).toBe(true)
  const css = output.find(file => file.fileName.endsWith('.css')).source
  expect(css).toMatch(/\.toolbar\s*\{/)
  expect(css).toContain('@starting-style')
  expect(css).toContain('data-leaving')
  expect(chunks.map(file => file.code).join('')).toMatch(/className: "toolbar"/)
})
