import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

const anchors = new WeakMap<Element, () => number>()

/** Override an editor's focus centre. The result is a Y coordinate in viewport pixels. */
export function useFocusAnchor<T extends HTMLElement>(ref: RefObject<T>, measure: (node: T) => number) {
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    anchors.set(node, () => measure(node))
    return () => { anchors.delete(node) }
  }, [ref, measure])
}

export function focusCentre(shell: HTMLElement) {
  const active = shell.ownerDocument.activeElement
  if (!active || active.closest('.tn-ridge') !== shell) return null
  const measure = anchors.get(active)
  if (measure) return measure()
  const rect = (active.closest('.tn-row,.tn-pill') ?? active).getBoundingClientRect()
  return rect.top + rect.height / 2
}
