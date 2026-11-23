import { followExpansion, revealTransitions } from './followExpansion'
import { useLayoutEffect, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'

export interface RevealProps {
  open: boolean
  id?: string
  collapsed?: ReactNode
  children: ReactNode
  /** Receives focus if the panel being hidden contains the active element. */
  returnFocusRef?: RefObject<HTMLElement>
  /** Scroll only as far as the top of the containing field on explicit expansion. */
  followViewport?: boolean
}

function Item({ open, children, returnFocusRef }: Pick<RevealProps, 'open' | 'children' | 'returnFocusRef'>) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const panel = ref.current
    if (!panel) return
    if (!open && panel.contains(panel.ownerDocument.activeElement)) returnFocusRef?.current?.focus({ preventScroll: true })
    panel.toggleAttribute('inert', !open)
    if (open) panel.removeAttribute('aria-hidden')
    else panel.setAttribute('aria-hidden', 'true')
  }, [open, returnFocusRef])
  return <div className="tn-reveal" ref={ref} data-open={open}>
    <div className="tn-reveal-clip">{children}</div>
  </div>
}

/** Follow one explicit expansion, even when several sibling items change height. */
type GroupProps = Pick<RevealProps, 'open' | 'id' | 'children' | 'followViewport'> & {
  /** Runs after an uninterrupted close, immediately when motion is reduced. */
  onCollapsed?: () => void
}

function Group({ open, id, children, followViewport = false, onCollapsed }: GroupProps) {
  const host = useRef<HTMLDivElement>(null)
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
  return <div id={id} ref={host}>{children}</div>
}

/** Controlled in-flow disclosure. Both branches retain their local state. */
export function Reveal({ open, id, collapsed, children, returnFocusRef, followViewport }: RevealProps) {
  return <Group id={id} open={open} followViewport={followViewport}>
    {collapsed != null && <Item open={!open} returnFocusRef={returnFocusRef}>{collapsed}</Item>}
    <Item open={open} returnFocusRef={returnFocusRef}>{children}</Item>
  </Group>
}

Reveal.Group = Group
Reveal.Item = Item
