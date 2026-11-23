import { listenForRipple } from './gestures'

const installed = Symbol.for('neui.ripple.installed')
type RippleDocument = Document & { [installed]?: boolean }
type PaintCSS = typeof CSS & { paintWorklet?: { addModule(url: URL): Promise<void> } }

function register(doc: RippleDocument) {
  if (doc[installed]) return
  doc[installed] = true
  listenForRipple(doc)
  const worklet = (globalThis.CSS as PaintCSS | undefined)?.paintWorklet
  if (worklet) {
    const painter = new URL('./ripple.paint.js?no-inline', import.meta.url)
    void worklet.addModule(painter).then(() => {
      doc.documentElement.style.setProperty('--neui-ripple-painter', 'paint(neui-ripple)')
    }).catch(() => { /* The CSS gradient remains active, including under restrictive CSPs. */ })
  }
}

if (typeof document !== 'undefined') register(document)
