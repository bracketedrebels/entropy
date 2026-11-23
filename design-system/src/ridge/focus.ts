import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

import { attachFocusAnchor } from './focusAnchor'

/** Override an editor's focus centre. The result is a Y coordinate in viewport pixels. */
export function useFocusAnchor<T extends HTMLElement>(ref: RefObject<T>, measure: (node: T) => number) {
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    return attachFocusAnchor(node, () => measure(node))
  }, [ref, measure])
}
