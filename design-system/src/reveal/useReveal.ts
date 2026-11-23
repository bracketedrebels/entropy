import { useCallback, useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { followExpansion, revealTransitions } from './followExpansion'

export function useReveal<T extends HTMLElement = HTMLDivElement>(open: boolean, returnFocusRef?: RefObject<HTMLElement>) {
  const ref = useCallback((panel: T | null) => {
    if (!panel) return
    if (!open && panel.contains(panel.ownerDocument.activeElement)) returnFocusRef?.current?.focus({ preventScroll: true })
    panel.toggleAttribute('inert', !open)
    if (open) panel.removeAttribute('aria-hidden')
    else panel.setAttribute('aria-hidden', 'true')
  }, [open, returnFocusRef])
  return { ref, 'data-open': open }
}

interface RevealGroupOptions {
  followViewport?: boolean
  onCollapsed?: () => void
}

export function useRevealGroup<T extends HTMLElement = HTMLDivElement>(open: boolean, { followViewport = false, onCollapsed }: RevealGroupOptions = {}) {
  const host = useRef<T>(null)
  const previous = useRef(open)
  const settled = useRef(onCollapsed)
  useLayoutEffect(() => { settled.current = onCollapsed }, [onCollapsed])
  useLayoutEffect(() => {
    if (!host.current || previous.current === open) return
    previous.current = open
    if (open) {
      if (followViewport) return followExpansion(host.current.closest<HTMLElement>('.tn-ridge') ?? host.current, host.current)
      return
    }
    if (!settled.current) return
    const motions = revealTransitions(host.current)
    if (!motions.length) { settled.current(); return }
    let cancelled = false
    void Promise.allSettled(motions.map(motion => motion.finished)).then(() => {
      if (!cancelled) settled.current?.()
    })
    return () => { cancelled = true }
  }, [open, followViewport])
  return host
}
