import { leavingIndex } from './styles.mjs'
import { transformLeaving } from './transform.mjs'

/** Standalone Tailwind/React presence transform. */
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

export default neuiLeaving
