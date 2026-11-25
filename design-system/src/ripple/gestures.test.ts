import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { listenForRipple } from './gestures'

let detach: () => void
let duration: string
const tracks: { finish: () => void; cancel: ReturnType<typeof vi.fn>; frames: Keyframe[]; options: KeyframeAnimationOptions }[] = []
beforeEach(() => {
  duration = '1s, 0.8s'
  tracks.length = 0
  const computed = window.getComputedStyle.bind(window)
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudo) => pseudo
    ? { transitionDuration: duration, animationDuration: duration.split(',')[0] } as CSSStyleDeclaration : computed(element))
  vi.stubGlobal('CSS', { registerProperty: vi.fn() })
  detach = listenForRipple(document)
})
afterEach(() => {
  detach()
  document.body.replaceChildren()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function button(parent: HTMLElement = document.body) {
  const target = document.createElement('button')
  target.className = 'neui-ripple'
  parent.append(target)
  vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(new DOMRect(10, 20, 200, 40))
  Object.defineProperty(target, 'animate', { value: (frames: Keyframe[], options: KeyframeAnimationOptions) => {
    let finish!: () => void
    const finished = new Promise<void>(resolve => { finish = resolve })
    const cancel = vi.fn(finish)
    tracks.push({ finish, cancel, frames, options })
    return { finished, cancel }
  } })
  return target
}

function pointer(target: EventTarget, type: string, id = 1, x = 60) {
  const event = new MouseEvent(type, { bubbles: true, composed: true, clientX: x, clientY: 30 })
  Object.assign(event, { pointerId: id })
  target.dispatchEvent(event)
}
const samples = (target: HTMLElement) => target.style.getPropertyValue('--neui-live-waves')

it('delegates to nested targets, cancels just the touched wave and never adds DOM', () => {
  const outer = button()
  const inner = button(outer)
  pointer(inner, 'pointerdown')
  pointer(inner, 'pointerdown', 2, 160)
  expect(samples(inner)).toContain('25% 25%')
  expect(samples(inner)).toContain('75% 25%')
  expect(samples(outer)).toBe('')
  expect(inner.childNodes).toHaveLength(0)
  pointer(window, 'pointercancel', 2)
  expect(samples(inner)).toContain('25% 25%')
  expect(samples(inner)).not.toContain('75% 25%')
  expect(tracks[0].cancel).not.toHaveBeenCalled()
  pointer(window, 'pointercancel')
  expect(samples(inner)).toBe('')
})

it('retains overlapping taps and releases each track independently, including a reused slot', async () => {
  const target = button()
  pointer(target, 'pointerdown')
  pointer(window, 'pointerup')
  pointer(target, 'pointerdown', 1, 160)
  pointer(window, 'pointerup')
  expect(samples(target).split(',')).toHaveLength(2)
  expect(tracks[0].cancel).not.toHaveBeenCalled()
  tracks[0].finish()
  await Promise.resolve()
  expect(samples(target)).toMatch(/^75% 25% var\(--neui-front-1\)/)
  pointer(target, 'pointerdown', 1, 110)
  tracks[1].finish()
  await Promise.resolve()
  expect(samples(target)).toMatch(/^50% 25% var\(--neui-front-0\)/)
  tracks[2].finish()
  await Promise.resolve()
  expect(target.dataset.neuiPress).toBeUndefined()
  expect(samples(target)).toBe('')
})

it('uses the CSS duration and fades the crest during travel, even when the finger stays down', async () => {
  const target = button()
  duration = '0.5s, 400ms'
  pointer(target, 'pointerdown')
  const { frames, options, finish } = tracks[0]
  expect(options.duration).toBe(500)
  expect(frames[0]).toMatchObject({ '--neui-front-0': 0, easing: 'ease-out' })
  expect(Number(frames[1].offset)).toBeCloseTo(.2)
  expect(frames[2]).toMatchObject({ '--neui-front-0': 1, '--neui-energy-0': 0 })
  finish()
  await Promise.resolve()
  expect(samples(target)).toBe('')
  duration = '0s, 0s'
  pointer(target, 'pointerdown')
  expect(samples(target)).toBe('')
  expect(tracks).toHaveLength(1)
})

it('supports successive keyboard activations, blur, disabled labels and prevented presses', () => {
  const target = button()
  target.click()
  target.click()
  expect(samples(target).split(',')).toHaveLength(2)
  expect(samples(target)).toContain('50% 50%')
  window.dispatchEvent(new Event('blur'))
  expect(samples(target)).toBe('')
  expect(tracks.every(track => track.cancel.mock.calls.length === 1)).toBe(true)
  const label = document.createElement('label')
  label.className = 'neui-ripple'
  label.innerHTML = '<input type="checkbox" disabled>'
  document.body.append(label)
  pointer(label, 'pointerdown')
  expect(label.dataset.neuiPress).toBeUndefined()
  target.addEventListener('click', event => event.preventDefault())
  target.click()
  expect(samples(target)).toBe('')
})

it('keeps gradients valid while a browser without registered properties adds or cancels a wave', () => {
  vi.stubGlobal('CSS', {})
  const pending = new Map<number, FrameRequestCallback>()
  let next = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    pending.set(++next, callback)
    return next
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => pending.delete(id))
  const target = button()
  pointer(target, 'pointerdown')
  pointer(target, 'pointerdown', 2, 160)
  expect(pending.size).toBe(2)
  expect(target.style.getPropertyValue('--neui-front-1')).toBe('0')
  expect(target.style.getPropertyValue('--neui-energy-1')).toBe('1')
  pointer(window, 'pointercancel', 2)
  expect(pending.size).toBe(1)
  expect(target.style.getPropertyValue('--neui-energy-1')).toBe('')
  window.dispatchEvent(new Event('blur'))
  expect(pending.size).toBe(0)
  expect(samples(target)).toBe('')
})


it('shares one travel track for the crest and focus fill and leaves the acquired focus intact on a repeat tap', async () => {
  const field = button()
  field.classList.add('neui-focus')
  pointer(field, 'pointerdown', 1, 30)
  const front = 'var(--neui-front-0)'
  expect(field.style.getPropertyValue('--neui-focus-origin-x')).toBe('10%')
  expect(field.style.getPropertyValue('--neui-focus-progress')).toBe(front)
  expect(samples(field)).toContain('10% 25% ' + front)
  expect(tracks).toHaveLength(1)
  field.focus()
  pointer(field, 'pointerdown', 2, 180)
  expect(field.style.getPropertyValue('--neui-focus-progress')).toBe(front)
  expect(tracks).toHaveLength(2)
  tracks[0].finish()
  await Promise.resolve()
  expect(field.style.getPropertyValue('--neui-focus-progress')).toBe('')
  expect(samples(field)).toContain('--neui-front-1')
})

it('reveals focus by itself, freezes a partial reveal on blur, and restores the full surface on keyboard focus', () => {
  const field = button()
  field.className = 'neui-focus'
  pointer(field, 'pointerdown')
  field.focus()
  expect(field.dataset.neuiPress).toBeUndefined()
  expect(samples(field)).toBe('')
  expect(tracks[0].frames).toHaveLength(2)
  field.style.setProperty('--neui-front-0', '.35')
  field.blur()
  expect(field.style.getPropertyValue('--neui-focus-progress')).toBe('.35')
  field.focus()
  expect(field.style.getPropertyValue('--neui-focus-progress')).toBe('')
  expect(tracks).toHaveLength(1)
})

it('uses independent nested targets and cancels both tracks on a cancelled touch', () => {
  const outer = button()
  outer.className = 'neui-focus'
  const inner = button(outer)
  pointer(inner, 'pointerdown')
  expect(samples(inner)).not.toBe('')
  expect(inner.hasAttribute('data-neui-focus')).toBe(false)
  expect(outer.hasAttribute('data-neui-press')).toBe(false)
  expect(outer.style.getPropertyValue('--neui-focus-progress')).toBe('var(--neui-front-0)')
  pointer(window, 'pointercancel')
  expect(tracks.every(track => track.cancel.mock.calls.length === 1)).toBe(true)
})

it('shows the full surface for a CSS opt-in with zero duration, then releases the runtime marker on blur', async () => {
  duration = '0s, 0s'
  const field = button()
  field.className = 'editor'
  field.style.setProperty('--neui-focus-target', '1')
  pointer(field, 'pointerdown')
  field.focus()
  expect(tracks).toHaveLength(0)
  expect(field.hasAttribute('data-neui-focus')).toBe(true)
  expect(field.style.getPropertyValue('--neui-focus-progress')).toBe('')
  field.blur()
  await Promise.resolve()
  expect(field.hasAttribute('data-neui-focus')).toBe(false)
})
