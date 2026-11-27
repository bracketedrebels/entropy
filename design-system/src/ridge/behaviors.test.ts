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

it('lets an aggregate ridge follow a nested control while ordinary scopes stay local', async () => {
  const outer = document.createElement('section')
  outer.className = 'neui-ridge neui-track-focus'
  outer.innerHTML = '<h1 slot="label"><a href="#home">NEUI</a></h1><div class="neui-ridge neui-track-focus"><input></div>'
  document.body.append(outer)
  await settle()
  const inner = outer.querySelector('div')!
  inner.querySelector('input')!.focus()
  expect(signal(outer)).toBe('')
  outer.classList.add('neui-track-focus-within')
  await settle()
  expect(signal(outer)).toBe('1')
  expect(signal(inner)).toBe('1')
  outer.classList.remove('neui-track-focus-within')
  await settle()
  expect(signal(outer)).toBe('')
  outer.querySelector('a')!.focus()
  await settle()
  expect(signal(inner)).toBe('')
  expect(signal(outer)).toBe('1')
})

it('keeps the light in the focused sticky panel’s coordinates across scroll reversals and releases it on blur', async () => {
  const shell = document.createElement('section')
  shell.className = 'neui-ridge neui-track-focus'
  shell.innerHTML = '<div slot="header"><input></div><button>Row</button><div slot="meta"><button>More</button></div>'
  document.body.append(shell)
  await settle()
  const frame = shell.shadowRoot!
  const head = frame.querySelector<HTMLElement>('.neui-head')!
  const foot = frame.querySelector<HTMLElement>('.neui-foot')!
  const pill = shell.querySelector<HTMLElement>('[slot="meta"] button')!
  const search = shell.querySelector('input')!
  let panelTop = 350
  let shellTop = 100
  const geometry = (node: Element, top: () => number, height: number) =>
    vi.spyOn(node, 'getBoundingClientRect').mockImplementation(() => DOMRect.fromRect({ y: top(), height }))
  geometry(shell, () => shellTop, 1200)
  geometry(foot, () => panelTop, 60)
  geometry(pill, () => panelTop + 10, 28)
  geometry(head, () => 8, 90)
  geometry(search, () => 38, 32)
  Object.defineProperty(shell, 'clientWidth', { value: 320 })
  shell.style.setProperty('--neui-row-radius', '24px')
  frame.querySelector<HTMLElement>('.neui-body')!.style.paddingLeft = '11px'
  frame.dispatchEvent(new Event('slotchange'))
  const textures = [...frame.querySelectorAll<SVGGElement>('.neui-texture')]
  const local = () => shell.style.getPropertyValue('--neui-cap-light-y')
  pill.focus()
  expect(local()).toBe('24px')
  for (const [field, panel] of [[-450, 350], [-850, 290], [-300, 350]]) {
    shellTop = field
    panelTop = panel
    window.dispatchEvent(new Event('scroll'))
    expect(local()).toBe('24px')
    expect(shell.style.getPropertyValue('--neui-focus-y')).toBe(panel - field + 24 + 'px')
    expect(foot.querySelectorAll('.neui-base + .neui-cap-lamp .neui-light')).toHaveLength(1)
    expect(textures.every(texture => texture.style.display === 'none')).toBe(true)
  }
  search.focus()
  expect(local()).toBe('46px')
  expect(head.querySelectorAll('.neui-upper + .neui-cap-lamp .neui-light')).toHaveLength(1)
  expect(foot.querySelector('.neui-cap-lamp')).toBeNull()
  shell.querySelector('button')!.focus()
  expect(local()).toBe('')
  expect(frame.querySelector('.neui-cap-lamp')).toBeNull()
  expect(textures.every(texture => texture.style.display === '')).toBe(true)
  pill.focus()
  const band = foot.querySelector('.neui-cap-lamp .neui-light')!
  let finish!: () => void
  const finished = new Promise<void>(resolve => { finish = resolve })
  Object.defineProperty(band, 'getAnimations', { value: () => [{ transitionProperty: 'opacity', finished }] })
  pill.blur()
  await settle()
  expect(signal(shell)).toBe('')
  expect(local()).toBe('24px')
  expect(foot.querySelector('.neui-cap-lamp .neui-light')).toBe(band)
  search.focus()
  finish()
  await settle()
  expect(local()).toBe('46px')
  expect(head.querySelector('.neui-cap-lamp .neui-light')).toBe(band)
  search.blur()
  await settle()
  expect(local()).toBe('')
  expect(frame.querySelector('.neui-cap-lamp')).toBeNull()
})

it('focuses a native range on touch down and projects the light at the track height', async () => {
  const host = document.createElement('div')
  host.className = 'neui-track-focus'
  host.innerHTML = '<input type="text"><input type="range">'
  document.body.append(host)
  await settle()
  const range = host.querySelector<HTMLInputElement>('[type=range]')!
  vi.spyOn(range, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ y: 40, height: 48 }))
  host.querySelector('input')!.focus()
  const touch = Object.assign(new Event('pointerdown', { bubbles: true }), { isPrimary: true, button: 0, pointerType: 'touch' })
  range.dispatchEvent(touch)
  expect(document.activeElement).toBe(range)
  expect(signal(host)).toBe('1')
  expect(host.style.getPropertyValue('--neui-focus-y')).toBe('64px')
})
