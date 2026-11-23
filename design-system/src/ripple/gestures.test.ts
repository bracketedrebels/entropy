import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { listenForRipple } from './gestures'

let detach: () => void
beforeEach(() => {
  // jsdom has no pseudo-element styles or CSS transitions.
  const computed = window.getComputedStyle.bind(window)
  vi.spyOn(window, 'getComputedStyle').mockImplementation(element => computed(element))
  detach = listenForRipple(document)
})
afterEach(() => {
  detach()
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

function button(parent: HTMLElement = document.body) {
  const target = document.createElement('button')
  target.className = 'neui-ripple'
  parent.append(target)
  vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(new DOMRect(10, 20, 200, 40))
  return target
}

function pointer(target: EventTarget, type: string, id = 1) {
  const event = new MouseEvent(type, { bubbles: true, composed: true, clientX: 60, clientY: 30 })
  Object.assign(event, { isPrimary: true, pointerId: id })
  target.dispatchEvent(event)
}

it('delegates to new nested targets and clears a cancelled touch outside the target', () => {
  const outer = document.createElement('section')
  outer.className = 'neui-ripple'
  document.body.append(outer)
  const inner = button(outer)
  pointer(inner, 'pointerdown')
  expect(inner.dataset.neuiPress).toBe('held')
  expect(inner.style.getPropertyValue('--neui-press-x')).toBe('25%')
  expect(inner.style.getPropertyValue('--neui-press-y')).toBe('25%')
  expect(outer.dataset.neuiPress).toBeUndefined()
  expect(inner.childNodes).toHaveLength(0)
  pointer(window, 'pointercancel', 2)
  expect(inner.dataset.neuiPress).toBe('held')
  pointer(window, 'pointercancel')
  expect(inner.dataset.neuiPress).toBeUndefined()
  expect(inner.style.getPropertyValue('--neui-press-x')).toBe('')
})

it('lets a quick release finish growing and ignores stale completions after another press', async () => {
  const target = button()
  let finish!: () => void
  const finished = new Promise<void>(resolve => { finish = resolve })
  Object.defineProperty(target, 'getAnimations', { value: () => [
    { transitionProperty: '--neui-ripple-progress', effect: { target }, finished },
  ] })
  pointer(target, 'pointerdown')
  pointer(window, 'pointerup')
  expect(target.dataset.neuiPress).toBe('held')
  pointer(target, 'pointerdown', 2)
  finish()
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(target.dataset.neuiPress).toBe('held')
  pointer(window, 'pointerup', 2)
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(target.dataset.neuiPress).toBeUndefined()
})

it('handles keyboard activation, window blur, disabled labels and prevented presses', async () => {
  const target = button()
  target.click()
  expect(target.style.getPropertyValue('--neui-press-x')).toBe('50%')
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(target.dataset.neuiPress).toBeUndefined()
  pointer(target, 'pointerdown')
  window.dispatchEvent(new Event('blur'))
  expect(target.dataset.neuiPress).toBeUndefined()
  const label = document.createElement('label')
  label.className = 'neui-ripple'
  label.innerHTML = '<input type="checkbox" disabled>'
  document.body.append(label)
  pointer(label, 'pointerdown')
  expect(label.dataset.neuiPress).toBeUndefined()
  target.addEventListener('click', event => event.preventDefault())
  target.click()
  expect(target.dataset.neuiPress).toBeUndefined()
})
