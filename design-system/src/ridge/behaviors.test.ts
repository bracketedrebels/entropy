import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import './index'
import { attachFocusAnchor } from './focusAnchor'

const settle = () => new Promise(resolve => setTimeout(resolve, 0))
const signal = (element: HTMLElement) => element.style.getPropertyValue('--neui-focus-active')

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
})
afterEach(async () => {
  document.body.replaceChildren()
  await settle()
  vi.unstubAllGlobals()
})

it('projects the original form controls, supports dynamic activation, and leaves the material independent of focus', async () => {
  const form = document.createElement('form')
  form.innerHTML = '<section><label slot="label" for="city">Город</label><input name="city" id="city"></section>'
  document.body.append(form)
  const host = form.querySelector('section')!, input = form.querySelector('input')!
  input.value = 'Сочи'
  host.classList.add('neui-ridge')
  await settle()
  const frame = host.shadowRoot!
  expect(frame.querySelector<HTMLSlotElement>('slot:not([name])')!.assignedElements()).toEqual([input])
  input.focus()
  expect(signal(host)).toBe('')
  host.classList.add('neui-track-focus')
  await settle()
  expect(signal(host)).toBe('1')
  expect(input.labels?.[0]).toBe(host.firstElementChild)
  expect(new FormData(form).get('city')).toBe('Сочи')
  host.classList.remove('neui-ridge')
  await settle()
  expect(frame.querySelector('svg')).toBeNull()
  expect(host.querySelector('input')).toBe(input)
  host.classList.add('neui-ridge')
  await settle()
  expect(frame.querySelectorAll('svg')).toHaveLength(3)
  host.remove()
  await settle()
  expect(signal(host)).toBe('')
})

it('allows a standalone tracker, caret overrides, and changing focus scopes while the input stays focused', async () => {
  const outer = document.createElement('div')
  outer.className = 'neui-track-focus'
  outer.innerHTML = '<div><textarea></textarea></div>'
  const inner = outer.firstElementChild as HTMLElement
  const input = inner.querySelector('textarea')!
  const stop = attachFocusAnchor(input, () => 74)
  document.body.append(outer)
  await settle()
  input.focus()
  expect(outer.style.getPropertyValue('--neui-focus-y')).toBe('74px')
  expect(outer.shadowRoot).toBeNull()
  inner.classList.add('neui-track-focus')
  await settle()
  expect(signal(outer)).toBe('')
  expect(signal(inner)).toBe('1')
  inner.classList.remove('neui-track-focus')
  await settle()
  expect(signal(inner)).toBe('')
  expect(signal(outer)).toBe('1')
  input.blur()
  await settle()
  expect(signal(outer)).toBe('')
  stop()
})
