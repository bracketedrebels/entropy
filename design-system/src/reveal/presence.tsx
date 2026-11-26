import { cloneElement, createElement, Fragment, isValidElement, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, version } from 'react'
import type { ReactElement, ReactNode, Ref } from 'react'

const useCommit = typeof document === 'undefined' ? useEffect : useLayoutEffect
const inertValue = Number.parseInt(version, 10) >= 19 ? true : ''
type Host = ReactElement<Record<string, unknown>, string>
interface Entry { id: string; element: Host; leaving: boolean }

function incoming(children: ReactNode) {
  const nodes = Array.isArray(children) ? children : [children]
  const entries: Entry[] = []
  for (const element of nodes) {
    if (!isValidElement(element) || typeof element.type !== 'string') continue
    // A colon cannot occur in a supported intrinsic tag name.
    entries.push({ id: element.type + ':' + (element.key ?? ''), element: element as Host, leaving: false })
  }
  return entries
}

// Retiring siblings stay immediately before their next surviving sibling. Live siblings
// always follow the caller's new order, including when a key is restored mid-exit.
function reconcile(previous: Entry[], next: Entry[]) {
  const live = new Set(next.map(item => item.id))
  const before = new Map<string | null, Entry[]>()
  let anchor: string | null = null
  for (let i = previous.length - 1; i >= 0; i--) {
    const item = previous[i]
    if (live.has(item.id)) { anchor = item.id; continue }
    const group = before.get(anchor) ?? []
    group.push(item.leaving ? item : { ...item, leaving: true })
    before.set(anchor, group)
  }
  if (!before.size) return next
  return [...next.flatMap(item => [...(before.get(item.id)?.reverse() ?? []), item]), ...(before.get(null)?.reverse() ?? [])]
}

function milliseconds(css: string) {
  return css.split(',').map(raw => Number.parseFloat(raw) * (raw.trim().endsWith('ms') ? 1 : 1000))
}

function waitForExit(node: Element, done: () => void) {
  let live = true
  if (typeof node.getAnimations === 'function') {
    // The browser resolves the leaving style, including delayed and reversed transitions.
    const transitions = node.getAnimations().filter(animation => 'transitionProperty' in animation &&
      (animation.effect as KeyframeEffect | null)?.target === node)
    if (transitions.length) {
      void Promise.allSettled(transitions.map(animation => animation.finished)).then(() => { if (live) done() })
    } else done()
    return () => { live = false }
  }
  const style = getComputedStyle(node)
  const durations = milliseconds(style.transitionDuration), delays = milliseconds(style.transitionDelay)
  const timeout = Math.max(0, ...style.transitionProperty.split(',').map((property, i) =>
    property.trim() === 'none' ? 0 : durations[i % durations.length] + delays[i % delays.length]))
  if (!timeout) { done(); return }
  const timer = setTimeout(done, timeout)
  return () => clearTimeout(timer)
}

function RetainedHost({ entry, remove }: { entry: Entry; remove: (entry: Entry) => void }) {
  const node = useRef<HTMLElement>(null)
  const { element, leaving } = entry
  // In React 19 ref is a prop. Reading the old accessor logs a deprecation warning.
  const userRef: Ref<HTMLElement> | undefined = Object.getOwnPropertyDescriptor(element.props, 'ref')?.value ??
    Object.getOwnPropertyDescriptor(element, 'ref')?.value
  useImperativeHandle(userRef, () => node.current!, [userRef])
  const exit = leaving ? entry : undefined
  useCommit(() => {
    if (exit && node.current) return waitForExit(node.current, () => remove(exit))
  }, [exit, remove])
  return cloneElement(element, { ref: node, ...(leaving ? { 'data-leaving': 'true', inert: inertValue, 'aria-hidden': true } : {}) })
}

function Presence({ children }: { children?: ReactNode }) {
  const [state, setState] = useState(() => ({ input: children, entries: incoming(children) }))
  let entries = state.entries
  if (state.input !== children) {
    entries = reconcile(entries, incoming(children))
    setState({ input: children, entries })
  }
  const remove = useCallback((entry: Entry) => setState(current => current.entries.includes(entry)
    ? { ...current, entries: current.entries.filter(item => item !== entry) } : current), [])
  const hosts = entries.map(entry => createElement(RetainedHost, { key: entry.id, entry, remove }))
  return createElement(Fragment, null, hosts, typeof children === 'number' || typeof children === 'string' ? children : null)
}

/** Emitted at statically marked JSX render sites. Adds no DOM wrapper. */
export function presence(children: ReactNode) {
  return createElement(Presence, { children })
}
