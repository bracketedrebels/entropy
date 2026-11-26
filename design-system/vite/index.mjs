import { resolve } from 'node:path'
import { normalizePath } from 'vite'
import { transformLeaving } from './leaving.mjs'

const runtimes = ['@neui/kit/ripple', '@neui/kit/ridge', '@neui/kit/swipe']
const bootstrap = runtimes.map(runtime => `import '${runtime}';`).join('\n')

/** @type {typeof import('./index.d.mts').neui} */
export function neui({ clientEntry, leaving = true } = {}) {
  let entry

  return {
    name: 'neui:client',
    enforce: 'pre',
    // The worklet URL is relative to its module. Let Vite process it as an asset in dev as in build.
    config: () => ({ optimizeDeps: { exclude: runtimes } }),
    configResolved(config) {
      if (clientEntry) entry = normalizePath(resolve(config.root, clientEntry))
    },
    transformIndexHtml: {
      order: 'pre',
      handler() {
        if (entry) return
        return [{ tag: 'script', attrs: { type: 'module' }, children: bootstrap, injectTo: 'head-prepend' }]
      },
    },
    transform(code, id, options) {
      const transformed = leaving ? transformLeaving(code, id) : undefined
      if (id !== entry || options?.ssr || this.environment?.config.consumer === 'server') return transformed
      return { code: (transformed?.code ?? code) + '\n' + bootstrap + '\n', map: transformed?.map ?? null }
    },
  }
}
