import { followExpansion } from './followExpansion'
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

function Panel({ visible, children, returnFocusRef }: Omit<RevealProps, 'open'> & { visible: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const panel = ref.current
    if (!panel) return
    if (!visible && panel.contains(panel.ownerDocument.activeElement)) returnFocusRef?.current?.focus({ preventScroll: true })
    panel.toggleAttribute('inert', !visible)
    if (visible) panel.removeAttribute('aria-hidden')
    else panel.setAttribute('aria-hidden', 'true')
  }, [visible, returnFocusRef])
  return <div className="tn-reveal" ref={ref} data-open={visible}>
    <div className="tn-reveal-clip">{children}</div>
  </div>
}

/** Controlled in-flow disclosure. Both branches retain their local state. */
export function Reveal({ open, id, collapsed, children, returnFocusRef, followViewport = false }: RevealProps) {
  const host = useRef<HTMLDivElement>(null)
  const previous = useRef(open)
  useLayoutEffect(() => {
    const opening = open && !previous.current
    previous.current = open
    if (!opening || !followViewport || !host.current) return
    return followExpansion(host.current.closest<HTMLElement>('.tn-ridge') ?? host.current, host.current)
  }, [open, followViewport])
  return <div id={id} ref={host}>
    {collapsed != null && <Panel visible={!open} returnFocusRef={returnFocusRef}>{collapsed}</Panel>}
    <Panel visible={open} returnFocusRef={returnFocusRef}>{children}</Panel>
  </div>
}
