import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { listenForSwipe } from './gesture'

let stop: () => void
beforeEach(() => { stop = listenForSwipe(document) })
afterEach(() => { stop(); document.body.replaceChildren() })
function fixture(width = 84) {
  const row = document.createElement('div')
  row.className = 'neui-swipe-right'
  row.innerHTML = '<button class="neui-swipe-content">Tag</button><button class="neui-swipe-action">Remove</button>'
  document.body.append(row)
  const [content, action] = row.querySelectorAll('button')
  Object.defineProperty(action, 'offsetWidth', { value: width })
  const commit = vi.fn()
  action.onclick = commit
  return { row, content, action, commit }
}
function pointer(target: EventTarget, type: string, x: number, y = 0, id = 1) {
  const e = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0, cancelable: true })
  Object.assign(e, { pointerId: id, isPrimary: true, pointerType: 'touch' })
  target.dispatchEvent(e)
}
it('measures the native action, tracks the finger, caps the spring and disarms on reversal', () => {
  const { row, content, commit } = fixture(90)
  pointer(content, 'pointerdown', 17)
  pointer(window, 'pointermove', 62)
  expect(row.style.getPropertyValue('--neui-swipe-travel')).toBe('90px')
  expect(row.style.getPropertyValue('--neui-swipe-progress')).toBe('0.5')
  pointer(window, 'pointermove', 200)
  expect(Number(row.style.getPropertyValue('--neui-swipe-tension'))).toBeGreaterThan(.9)
  expect(Number(row.style.getPropertyValue('--neui-swipe-tension'))).toBeLessThan(1)
  expect(commit).not.toHaveBeenCalled()
  pointer(window, 'pointerup', 90)
  expect(commit).not.toHaveBeenCalled()
  expect(row.hasAttribute('data-neui-swiping')).toBe(false)
})
it('activates once on release and suppresses the compatibility click even after removal', () => {
  const { row, content, commit, action } = fixture()
  action.addEventListener('click', () => row.remove())
  const stray = vi.fn()
  document.body.onclick = stray
  pointer(content, 'pointerdown', 0)
  pointer(window, 'pointerup', 85)
  expect(commit).toHaveBeenCalledOnce()
  stray.mockClear()
  document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
  expect(stray).not.toHaveBeenCalled()
  document.body.onclick = null
})
it('abandons vertical, cancelled, disabled and disconnected gestures', () => {
  const { row, content, commit, action } = fixture()
  pointer(content, 'pointerdown', 0); pointer(window, 'pointermove', 12, 30); pointer(window, 'pointerup', 130)
  pointer(content, 'pointerdown', 0); pointer(window, 'pointermove', 95); pointer(window, 'pointercancel', 95)
  pointer(window, 'pointerup', 95)
  pointer(content, 'pointerdown', 0); action.disabled = true; pointer(window, 'pointerup', 100)
  action.disabled = false
  pointer(content, 'pointerdown', 0); row.remove(); pointer(window, 'pointerup', 100)
  expect(commit).not.toHaveBeenCalled()
})
