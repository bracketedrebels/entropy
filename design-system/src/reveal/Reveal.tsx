import { useLayoutEffect, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'

export interface RevealProps {
  open: boolean
  id?: string
  collapsed?: ReactNode
  children: ReactNode
  /** Receives focus if the panel being hidden contains the active element. */
  returnFocusRef?: RefObject<HTMLElement>
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
export function Reveal({ open, id, collapsed, children, returnFocusRef }: RevealProps) {
  return <div id={id}>
    {collapsed != null && <Panel visible={!open} returnFocusRef={returnFocusRef}>{collapsed}</Panel>}
    <Panel visible={open} returnFocusRef={returnFocusRef}>{children}</Panel>
  </div>
}
