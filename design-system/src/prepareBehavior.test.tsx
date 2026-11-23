import { render } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { prepareBehavior } from './behaviors'

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
