import { mountRidge } from './frame'
import { refreshFocusScope, trackFocus } from './trackFocus'

type Attach = (element: HTMLElement) => void | (() => void)

/** Mount literal behavior classes on current and future nodes, without moving application DOM. */
export function observeBehaviors(doc: Document) {
  function binding(name: string, attach: Attach) {
    const mounted = new Map<HTMLElement, void | (() => void)>()
    function update(el: HTMLElement) {
      const enabled = el.isConnected && el.ownerDocument === doc && el.classList.contains(name)
      if (enabled && !mounted.has(el)) mounted.set(el, attach(el))
      if (!enabled && mounted.has(el)) { mounted.get(el)?.(); mounted.delete(el) }
    }
    return { selector: '.' + name, update, mounted }
  }
  const bindings = [binding('neui-ridge', mountRidge), binding('neui-track-focus', trackFocus)]
  const selector = bindings.map(b => b.selector).join(',')
  function scan(node: Node) {
    if (!(node instanceof Element)) return
    if (node.matches(selector)) update(node)
    node.querySelectorAll(selector).forEach(update)
  }
  function update(node: Element) {
    if (node instanceof HTMLElement) for (const b of bindings) b.update(node)
  }
  const observer = new MutationObserver(records => {
    let removed = false
    for (const record of records) {
      if (record.type === 'attributes') {
        const element = record.target as Element
        update(element)
        refreshFocusScope(element)
      }
      else {
        record.addedNodes.forEach(scan)
        if (record.removedNodes.length) removed = true
      }
    }
    if (removed) for (const b of bindings) for (const node of b.mounted.keys()) b.update(node)
  })
  observer.observe(doc, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] })
  scan(doc.documentElement)
  return () => {
    observer.disconnect()
    for (const b of bindings) { for (const stop of b.mounted.values()) stop?.(); b.mounted.clear() }
  }
}

const key = Symbol.for('neui.ridge.behaviors')
type ClientDocument = Document & { [key]?: () => void }
if (typeof document !== 'undefined') {
  const doc: ClientDocument = document
  doc[key] ??= observeBehaviors(doc)
  if (import.meta.hot) import.meta.hot.dispose(() => { doc[key]?.(); delete doc[key] })
}
