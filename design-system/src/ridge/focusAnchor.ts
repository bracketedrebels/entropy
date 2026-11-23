const anchors = new WeakMap<Element, () => number>()

export function attachFocusAnchor(node: Element, measure: () => number) {
  anchors.set(node, measure)
  return () => {
    if (anchors.get(node) === measure) anchors.delete(node)
  }
}

export function focusCentre(shell: HTMLElement) {
  const active = shell.ownerDocument.activeElement
  if (!active || active.closest('.tn-ridge') !== shell) return null
  const measure = anchors.get(active)
  if (measure) return measure()
  const rect = (active.closest('.tn-row,.tn-pill') ?? active).getBoundingClientRect()
  return rect.top + rect.height / 2
}
