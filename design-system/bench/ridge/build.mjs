import { copyFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { build } from 'vite'
import { transformHosts } from './experiment/reactHosts.mjs'
import { neui } from '../../vite/index.mjs'

const base = fileURLToPath(new URL('.', import.meta.url))
const outDir = resolve(base, '../../storybook-static/bench/ridge')
// This alternative is deliberately local to the benchmark. Application builds use the kit plugin.
const reactRegistration = {
  name: 'neui-bench:react-registration',
  enforce: 'pre',
  transformIndexHtml: {
    order: 'pre',
    handler() {
      return [{ tag: 'script', attrs: { type: 'module' }, children: "import '@neui/kit/ripple'", injectTo: 'head-prepend' }]
    },
  },
  transform(code, id) {
    if (/\.[jt]sx$/.test(id) && !id.includes('/node_modules/') && /neui-(?:ridge|track-focus)\b/.test(code)) {
      return transformHosts(code, id)
    }
  },
}

await mkdir(outDir, { recursive: true })
for (const registration of ['dom', 'react']) {
  await build({
    root: resolve(base, 'fixture'), base: './', configFile: false,
    resolve: { alias: { 'neui-bench:host': resolve(base, 'experiment/reactHost.ts') } },
    plugins: [registration === 'react' ? reactRegistration : neui()], esbuild: { jsx: 'automatic' },
    css: { postcss: { plugins: [] } },
    build: { outDir: resolve(outDir, registration), emptyOutDir: true },
  })
}
for (const asset of ['index.html', 'runner.mjs']) {
  await copyFile(resolve(base, asset), resolve(outDir, asset))
}
