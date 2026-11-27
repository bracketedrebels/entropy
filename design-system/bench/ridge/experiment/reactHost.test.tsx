import { createRef, StrictMode } from 'react'
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { forTag } from './reactHost'
import { mountRidge } from '../../../src/ridge/frame'
import { trackFocus } from '../../../src/ridge/trackFocus'

vi.mock('../../../src/ridge/frame', () => ({ mountRidge: vi.fn(() => vi.fn()) }))
vi.mock('../../../src/ridge/trackFocus', () => ({ trackFocus: vi.fn(() => vi.fn()) }))
afterEach(() => { cleanup(); vi.clearAllMocks() })

it('keeps the original host, changes user refs and toggles the behaviors independently', () => {
  const Host = forTag('section')
  const first = createRef<HTMLElement>()
  const second = vi.fn()
  const view = render(<Host ref={first} className="neui-ridge"><input /></Host>)
  const element = first.current!
  expect(element.tagName).toBe('SECTION')
  expect(view.container.firstElementChild).toBe(element)
  expect(mountRidge).toHaveBeenCalledWith(element)
  view.rerender(<Host ref={second} className="neui-ridge neui-track-focus"><input /></Host>)
  expect(first.current).toBeNull()
  expect(second).toHaveBeenCalledWith(element)
  expect(mountRidge).toHaveBeenCalledTimes(1)
  expect(trackFocus).toHaveBeenCalledWith(element)
  view.rerender(<Host ref={second} className="neui-track-focus"><input /></Host>)
  expect(vi.mocked(mountRidge).mock.results[0].value).toHaveBeenCalledTimes(1)
  expect(trackFocus).toHaveBeenCalledTimes(1)
  view.unmount()
  expect(vi.mocked(trackFocus).mock.results[0].value).toHaveBeenCalledTimes(1)
  expect(second).toHaveBeenLastCalledWith(null)
})

it('balances every registration under StrictMode and keyed virtualization', () => {
  const Host = forTag('article')
  const rows = (ids: number[]) => <StrictMode>{ids.map(id =>
    <Host key={id} className="neui-ridge neui-track-focus" aria-label={String(id)} />)}</StrictMode>
  const view = render(rows([1, 2]))
  const survivor = view.getByLabelText('2')
  const mounts = vi.mocked(mountRidge).mock.calls.filter(([el]) => el === survivor).length
  view.rerender(rows([2, 3]))
  expect(view.getByLabelText('2')).toBe(survivor)
  expect(vi.mocked(mountRidge).mock.calls.filter(([el]) => el === survivor)).toHaveLength(mounts)
  view.unmount()
  for (const fn of [mountRidge, trackFocus]) {
    for (const result of vi.mocked(fn).mock.results) expect(result.value).toHaveBeenCalledTimes(1)
  }
})
