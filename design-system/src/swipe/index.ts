import { listenForSwipe } from './gesture'

const installed = Symbol.for('neui.swipe.installed')
type SwipeDocument = Document & { [installed]?: () => void }
if (typeof document !== 'undefined') {
  const doc: SwipeDocument = document
  doc[installed] ??= listenForSwipe(doc)
  if (import.meta.hot) import.meta.hot.dispose(() => { doc[installed]?.(); delete doc[installed] })
}
