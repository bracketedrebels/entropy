import { resolve } from 'node:path'
import { normalizePath } from 'vite'

const runtimes = ['@neui/kit/ripple', '@neui/kit/ridge', '@neui/kit/swipe']
const bootstrap = runtimes.map(runtime => `import '${runtime}';`).join('\n')

/** @type {typeof import('./index.d.mts').neui} */
export function neui({ clientEntry } = {}) {
  let entry

  return {
    name: 'neui:client',
    // The worklet URL is relative to its module. Let Vite process it as an asset in dev as in build.
    config: () => ({ optimizeDeps: { exclude: runtimes } }),
    configResolved(config) {
      if (clientEntry) entry = normalizePath(resolve(config.root, clientEntry))
    },
    applyToEnvironment: environment => environment.config.consumer === 'client',
    transformIndexHtml: {
      order: 'pre',
      handler() {
        if (entry) return
        return [{ tag: 'script', attrs: { type: 'module' }, children: bootstrap, injectTo: 'head-prepend' }]
      },
    },
    transform(code, id, options) {
      if (id !== entry || options?.ssr) return
      // Appending a static import preserves directives, original line positions and existing source maps.
      return { code: code + '\n' + bootstrap + '\n', map: null }
    },
  }
}
