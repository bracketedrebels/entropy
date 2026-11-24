import { compose, play, type Wave } from './waves'

function targetOf(event: Event) {
  if (event.defaultPrevented) return
  for (const element of event.composedPath()) {
    if (!(element instanceof Element)) continue
    if (element.matches(':disabled,[aria-disabled="true"],[inert]')) return
    if (!(element instanceof HTMLElement)) continue
    if (!element.matches('.neui-ripple') && getComputedStyle(element).getPropertyValue('--neui-ripple-target').trim() !== '1') continue
    if (element.closest('[inert],[aria-disabled="true"]') || (element instanceof HTMLLabelElement && element.control?.matches(':disabled'))) return
    return element
  }
}

export function listenForRipple(doc: Document) {
  const win = doc.defaultView!
  const events = new AbortController()
  const active = new Map<HTMLElement, Map<number, Wave>>()
  const pointers = new Map<number, () => void>()
  const options = { signal: events.signal }
  const forwarded = new WeakSet<HTMLLabelElement>()

  function start(target: HTMLElement, x: number, y: number, pointerId?: number) {
    const waves = active.get(target) ?? new Map<number, Wave>()
    let slot = 0
    while (waves.has(slot)) slot++
    const wave: Wave = { x, y, progress: '--neui-front-' + slot, energy: '--neui-energy-' + slot, cancel: () => {} }
    const clear = () => {
      if (waves.get(slot) !== wave) return
      waves.delete(slot)
      wave.cancel()
      if (pointerId !== undefined && pointers.get(pointerId) === clear) pointers.delete(pointerId)
      compose(target, waves.values())
      if (!waves.size) {
        active.delete(target)
        target.removeAttribute('data-neui-press')
      }
    }

    waves.set(slot, wave)
    active.set(target, waves)
    if (pointerId !== undefined) pointers.set(pointerId, clear)
    target.dataset.neuiPress = 'active'
    compose(target, waves.values())
    play(target, wave, clear)
  }

  function press(event: PointerEvent) {
    if (event.button !== 0) return
    const target = targetOf(event)
    if (!target) return
    const rect = target.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    start(target, (event.clientX - rect.left) * 100 / rect.width, (event.clientY - rect.top) * 100 / rect.height, event.pointerId)
  }

  function keyboardClick(event: MouseEvent) {
    const target = targetOf(event)
    if (!target) return
    // A label forwards its click to its control, sometimes with detail zero.
    if (target instanceof HTMLLabelElement && event.target !== target.control) {
      forwarded.add(target)
      win.setTimeout(() => forwarded.delete(target), 0)
    } else if (target instanceof HTMLLabelElement && forwarded.has(target)) return
    if (event.detail !== 0) return
    const rect = target.getBoundingClientRect()
    const marker = target.querySelector(':scope > :is(.neui-row-leading,.neui-row-area-leading,.neui-mark)')?.getBoundingClientRect()
    const x = rect.width && marker ? (marker.left + marker.width / 2 - rect.left) * 100 / rect.width : 50
    start(target, x, 50)
  }

  function finish(event: PointerEvent) {
    if (event.type === 'pointercancel') pointers.get(event.pointerId)?.()
    pointers.delete(event.pointerId)
  }

  function clearAll() {
    pointers.clear()
    for (const [target, waves] of active) {
      for (const wave of waves.values()) wave.cancel()
      waves.clear()
      target.removeAttribute('data-neui-press')
      compose(target, waves.values())
    }
    active.clear()
  }
  win.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
    if (event.matches) clearAll()
  }, options)
  doc.addEventListener('pointerdown', press, options)
  doc.addEventListener('click', keyboardClick, options)
  win.addEventListener('pointerup', finish, { ...options, capture: true })
  win.addEventListener('pointercancel', finish, { ...options, capture: true })
  win.addEventListener('blur', clearAll, options)
  win.addEventListener('pagehide', clearAll, options)
  return () => { events.abort(); clearAll() }
}
