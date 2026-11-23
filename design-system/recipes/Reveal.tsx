import type { ReactNode, RefObject } from 'react'
import { useReveal, useRevealGroup } from '@trinet/design-system/behaviors'

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
  const panel = useReveal(open, returnFocusRef)
  return <div className="tn-reveal" {...panel}>
    <div className="tn-reveal-clip">{children}</div>
  </div>
}

/** Follow one explicit expansion, even when several sibling items change height. */
type GroupProps = Pick<RevealProps, 'open' | 'id' | 'children' | 'followViewport'> & {
  /** Runs after an uninterrupted close, immediately when motion is reduced. */
  onCollapsed?: () => void
}

function Group({ open, id, children, followViewport = false, onCollapsed }: GroupProps) {
  const host = useRevealGroup(open, { followViewport, onCollapsed })
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
