import { createContext, useContext, useLayoutEffect, useRef } from 'react'
import { presence } from '@neui/kit/presence'
import type { ReactNode, RefObject } from 'react'
import { useRevealGroup } from '@neui/kit/react'

export interface RevealProps {
  open: boolean
  axis?: 'block' | 'inline'
  id?: string
  collapsed?: ReactNode
  children: ReactNode
  /** Receives focus if the panel being hidden contains the active element. */
  returnFocusRef?: RefObject<HTMLElement>
  /** Scroll only as far as the top of the containing field on explicit expansion. */
  followViewport?: boolean
}

// Existing recipe callers can update disabled/checked props while their row exits.
const Content = createContext<ReactNode>(null)
function CurrentContent() { return <>{useContext(Content)}</> }

function Item({ open, axis, children, returnFocusRef }: Pick<RevealProps, 'open' | 'axis' | 'children' | 'returnFocusRef'>) {
  const ownedFocus = useRef(false)
  useLayoutEffect(() => {
    if (!open && ownedFocus.current) {
      returnFocusRef?.current?.focus({ preventScroll: true })
      ownedFocus.current = false
    }
  }, [open, returnFocusRef])
  return <Content.Provider value={children}>{presence(open && <div
    data-open={true} className={axis === 'inline' ? 'neui-reveal neui-reveal-inline neui-collapse-inline' : 'neui-reveal neui-collapse-block'}
    onFocusCapture={() => { ownedFocus.current = true }}
    onBlurCapture={event => { ownedFocus.current = event.currentTarget.contains(event.relatedTarget) }}>
    <div className="neui-reveal-clip"><CurrentContent /></div>
  </div>)}</Content.Provider>
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

/** Controlled in-flow disclosure. Drafts and selection belong to the caller. */
export function Reveal({ open, axis, id, collapsed, children, returnFocusRef, followViewport }: RevealProps) {
  return <Group id={id} open={open} followViewport={followViewport}>
    {collapsed != null && <Item axis={axis} open={!open} returnFocusRef={returnFocusRef}>{collapsed}</Item>}
    <Item axis={axis} open={open} returnFocusRef={returnFocusRef}>{children}</Item>
  </Group>
}

Reveal.Group = Group
Reveal.Item = Item
