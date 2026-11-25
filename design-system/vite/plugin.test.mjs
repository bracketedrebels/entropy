// @vitest-environment node
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { build, createServer } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { neui } from '@neui/kit/vite'

const kit = fileURLToPath(new URL('../', import.meta.url))
const runtime = '/src/ripple/index.ts'
let root

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'neui-vite-'))
  await mkdir(join(root, 'node_modules/@neui'), { recursive: true })
  await symlink(kit, join(root, 'node_modules/@neui/kit'), 'dir')
  await symlink(join(kit, 'node_modules/tailwindcss'), join(root, 'node_modules/tailwindcss'), 'dir')
  await writeFile(join(root, 'index.html'), '<section class="neui-ridge neui-track-focus neui-ridge-radius-[1.5rem] neui-ridge-inset-[12px] neui-focus-band-[32px]"><button class="action">Press</button></section><script type="module" src="./client.tsx"></script>')
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
  expect(modules.filter(id => id.endsWith(runtime))).toHaveLength(1)
  expect(modules.filter(id => id.endsWith('/src/ridge/index.ts'))).toHaveLength(1)
  expect(modules.some(id => id.includes('/node_modules/react/'))).toBe(false)
  expect(output.some(file => /ripple\.paint-.+\.js$/.test(file.fileName))).toBe(true)
  const css = output.find(file => file.fileName.endsWith('.css')).source
  expect(css).toMatch(/--neui-row-radius:\s*1.5rem/)
  expect(css).toMatch(/--neui-inset:\s*12px/)
  expect(css).toMatch(/--neui-band:\s*32px/)
  const action = css.match(/\.action\s*\{([^}]+)\}/)?.[1]
  expect(action).toMatch(/--neui-ripple-target:\s*1/)
  expect(action).toMatch(/--neui-focus-target:\s*1/)
  expect(action).toMatch(/--tw-ease:\s*linear/)
  // The NEUI bridge reads this non-inheriting value on the target, before styling ::after.
  expect(action).toMatch(/--tw-duration:\s*(?:500ms|0?\.5s);/)
  expect(css).toMatch(/--neui-utility-duration:\s*var\(--tw-duration\)/)
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
