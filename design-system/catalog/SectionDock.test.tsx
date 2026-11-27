import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { SectionDock } from './SectionDock'

afterEach(() => { cleanup(); history.replaceState(null, '', location.pathname) })

function setup(active: 'css' | 'vite' | 'philosophy') {
  location.hash = active
  render(<SectionDock active={active} />)
  const dock = screen.getByRole('navigation')
  dock.setPointerCapture = vi.fn()
  const link = screen.getByRole('link', { current: 'page' })
  function pointer(type: string, x: number, y: number) {
    const e = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y })
    Object.assign(e, { pointerId: 1, isPrimary: true, pointerType: 'touch' })
    fireEvent(link, e)
  }
  return { link, pointer }
}

it.each([
  ['vite', 160, 3, '#react'], ['vite', -150, 1, '#css'],
  ['css', -160, 4, '#css'], ['philosophy', 160, 1, '#philosophy'],
  ['vite', 10, 72, '#vite'], ['vite', 12, 0, '#vite'],
] as const)('handles a stroke from %s by (%i, %i)', (active, dx, dy, hash) => {
  const { pointer, link } = setup(active)
  pointer('pointerdown', 180, 10)
  pointer('pointermove', 180 + dx, 10 + dy)
  pointer('pointerup', 180 + dx, 10 + dy)
  expect(location.hash).toBe(hash)
  expect(fireEvent.click(link, { detail: 1 })).toBe(false)
})

it('keeps a cancelled gesture on the current section and accepts the next tap', () => {
  const { pointer, link } = setup('vite')
  pointer('pointerdown', 18, 10); pointer('pointermove', 120, 10); pointer('pointercancel', 120, 10)
  pointer('pointerup', 140, 10)
  expect(location.hash).toBe('#vite')
  pointer('pointerdown', 18, 10); pointer('pointerup', 18, 10)
  expect(fireEvent.click(link, { detail: 1 })).toBe(true)
})
