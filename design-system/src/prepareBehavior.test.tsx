import { fireEvent, render } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { prepareBehavior, useRipple } from './behaviors'

it('attaches once per native element, cleans up replacements and isolates hook instances', () => {
  const cleanups: HTMLElement[] = []
  const attach = vi.fn((element: HTMLElement) => () => { cleanups.push(element) })
  const useTestBehavior = prepareBehavior(attach)
  function Action({ link }: { link?: boolean }) {
    const ref = useTestBehavior()
    return link ? <a ref={ref}>A</a> : <button ref={ref}>A</button>
  }
  const first = render(<Action />)
  const second = render(<Action />)
  const old = first.container.firstElementChild!
  first.rerender(<Action />)
  expect(attach).toHaveBeenCalledTimes(2)
  first.rerender(<Action link />)
  expect(cleanups).toEqual([old])
  expect(attach).toHaveBeenCalledTimes(3)
  const replacement = first.container.firstElementChild!
  first.unmount()
  expect(cleanups).toEqual([old, replacement])
  const other = second.container.firstElementChild!
  second.unmount()
  expect(cleanups).toEqual([old, replacement, other])
})

it('animates the authored element from the pointer and cancels without adding children', () => {
  function Action() {
    const ripple = useRipple()
    return <button ref={ripple} className="tn-ripple"><em>Действие</em></button>
  }
  const { container, unmount } = render(<Action />)
  const node = container.querySelector('button')!
  const content = node.firstChild
  const cancel = vi.fn()
  const animate = vi.fn(() => ({ cancel, finished: new Promise<void>(() => {}) }))
  vi.stubGlobal('matchMedia', () => ({ matches: false }))
  Object.defineProperty(node, 'animate', { value: animate })
  try {
    const down = new MouseEvent('pointerdown', { bubbles: true, clientX: 26, clientY: 14 })
    Object.assign(down, { pointerId: 3, isPrimary: true })
    fireEvent(node, down)
    expect(animate).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ '--tn-ripple-x': '26px', '--tn-ripple-y': '14px' }),
    ]), expect.anything())
    expect(node.childNodes).toHaveLength(1)
    expect(node.firstChild).toBe(content)
    const cancelled = new Event('pointercancel', { bubbles: true })
    Object.assign(cancelled, { pointerId: 3 })
    fireEvent(window, cancelled)
    expect(cancel).toHaveBeenCalledTimes(1)
    node.disabled = true
    fireEvent(node, down)
    expect(animate).toHaveBeenCalledTimes(1)
  } finally {
    unmount()
    vi.unstubAllGlobals()
  }
})
