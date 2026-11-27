const anchors = new WeakMap<Element, () => number>()

export function attachFocusAnchor(node: Element, measure: () => number) {
  anchors.set(node, measure)
  return () => {
    if (anchors.get(node) === measure) anchors.delete(node)
  }
}

export function focusCentre(active: Element, scope: HTMLElement) {
  const measure = anchors.get(active)
  if (measure) return measure()
  const anchor = active.closest('.neui-focus-anchor,.neui-row,.neui-pill')
  const rect = (anchor && scope.contains(anchor) ? anchor : active).getBoundingClientRect()
  return rect.top + rect.height / 2
}
