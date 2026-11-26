import { createRef, StrictMode } from 'react'
import { act, cleanup, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

afterEach(cleanup)

it('keeps the native node and ref through exit, cancels stale removal and waits for every root transition', async () => {
  const ref = createRef<HTMLInputElement>()
  const view = (open: boolean) => <StrictMode>{open ? <input className="leaving:opacity-0" ref={ref} /> : null}</StrictMode>
  const app = render(view(true))
  const node = ref.current!
  const transitions: (() => void)[] = []
  const transition = () => ({ transitionProperty: 'opacity', effect: { target: node },
    finished: new Promise<void>(resolve => transitions.push(resolve)) })
  Object.defineProperty(node, 'getAnimations', { value: () => [transition(), transition()] })
  app.rerender(view(false))
  expect(node.dataset.leaving).toBe('true')
  expect(node.hasAttribute('inert')).toBe(true)
  expect(node.getAttribute('aria-hidden')).toBe('true')
  expect(ref.current).toBe(node)
  app.rerender(view(true))
  await act(async () => transitions.splice(0).forEach(finish => finish()))
  expect(ref.current).toBe(node)
  expect(node.hasAttribute('data-leaving')).toBe(false)
  app.rerender(view(false))
  await act(async () => transitions.shift()!())
  expect(ref.current).toBe(node)
  await act(async () => transitions.shift()!())
  expect(ref.current).toBeNull()
  expect(app.container.childElementCount).toBe(0)
})

it('retains the right keyed exit through reorder and undo without restarting it', async () => {
  const view = (ids: string[]) => <ul>{ids.map(id => <li className="leaving:opacity-0" key={id}>{id}</li>)}</ul>
  const app = render(view(['A', 'B', 'C']))
  const b = app.getByText('B')
  let finish!: () => void
  const finished = new Promise<void>(resolve => { finish = resolve })
  const read = vi.fn(() => [{ transitionProperty: 'opacity', effect: { target: b }, finished }])
  Object.defineProperty(b, 'getAnimations', { value: read })
  app.rerender(view(['A', 'C']))
  app.rerender(view(['C', 'A']))
  expect(app.container.textContent).toBe('BCA')
  expect(read).toHaveBeenCalledTimes(1)
  app.rerender(view(['C', 'B', 'A']))
  await act(async () => finish())
  expect(app.getByText('B')).toBe(b)
  expect(app.container.textContent).toBe('CBA')
})

it('removes immediately when no transitions run', () => {
  const Form = ({ open }: { open: boolean }) => <section>{open && <b className="leaving:opacity-0">Текст</b>}</section>
  const app = render(<Form open />)
  Object.defineProperty(app.getByText('Текст'), 'getAnimations', { value: () => [] })
  app.rerender(<Form open={false} />)
  expect(app.queryByText('Текст')).toBeNull()
})

it('combines each fallback duration with its own delay and cancels the old timer on re-entry', () => {
  vi.useFakeTimers()
  try {
    const view = (show: boolean) => <section>{show && <span className="leaving:opacity-0"
      style={{ transitionProperty: 'opacity, transform', transitionDuration: '300ms, 0.1s', transitionDelay: '-200ms, 0.4s' }}>Канал</span>}</section>
    const app = render(view(true))
    const node = app.getByText('Канал')
    app.rerender(view(false))
    act(() => vi.advanceTimersByTime(250))
    app.rerender(view(true))
    act(() => vi.advanceTimersByTime(500))
    expect(app.getByText('Канал')).toBe(node)
    app.rerender(view(false))
    act(() => vi.advanceTimersByTime(499))
    expect(node.isConnected).toBe(true)
    act(() => vi.advanceTimersByTime(1))
    expect(node.isConnected).toBe(false)
  } finally { vi.useRealTimers() }
})
