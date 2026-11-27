import { trackGrainViewport } from './viewport'

const installed = Symbol.for('neui.grain.installed')
type GrainDocument = Document & { [installed]?: () => void }

if (typeof document !== 'undefined' && document.documentElement.classList.contains('neui-grain')) {
  const doc: GrainDocument = document
  doc[installed] ??= trackGrainViewport(window)
  if (import.meta.hot) import.meta.hot.dispose(() => { doc[installed]?.(); delete doc[installed] })
}
