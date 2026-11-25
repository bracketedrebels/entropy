import { compose, play, type Wave } from './waves'
import { pressTargets } from './targets'
import { revealRing, ringBlur, ringFocus } from './focusRing'

export function listenForRipple(doc: Document) {
  const win = doc.defaultView!
  const events = new AbortController()
  const active = new Map<HTMLElement, Map<number, Wave>>()
  const pointers = new Map<number, Set<() => void>>()
  const options = { signal: events.signal }
  const forwarded = new WeakSet<HTMLLabelElement>()

  function start(target: HTMLElement, x: number, y: number, crest: boolean, ring: boolean, pointerId?: number) {
    const reveal = ring && !target.matches(':focus-within')
    if (!crest && !reveal) return
    const pressed = pointerId === undefined ? undefined : pointers.get(pointerId) ?? new Set<() => void>()
    const waves = active.get(target) ?? new Map<number, Wave>()
    let slot = 0
    while (waves.has(slot)) slot++
    const wave: Wave = { x, y, progress: '--neui-front-' + slot, energy: crest ? '--neui-energy-' + slot : undefined, cancel: () => {}, stop: () => {} }
    const finishRing = reveal ? revealRing(target, x, y, wave.progress) : undefined
    const clear = () => {
      if (waves.get(slot) !== wave) return
      waves.delete(slot)
      pressed?.delete(clear)
      if (pointerId !== undefined && !pressed?.size && pointers.get(pointerId) === pressed) pointers.delete(pointerId)
      finishRing?.()
      wave.cancel()
      if (crest) {
        compose(target, waves.values())
        if (![...waves.values()].some(item => item.energy)) target.removeAttribute('data-neui-press')
      }
      if (!waves.size) active.delete(target)
    }

    if (pointerId !== undefined && pressed) {
      pressed.add(clear)
      pointers.set(pointerId, pressed)
    }
    wave.stop = clear
    waves.set(slot, wave)
    active.set(target, waves)
    if (crest) {
      target.dataset.neuiPress = 'active'
      compose(target, waves.values())
    }
    play(target, wave, clear)
  }

  function press(event: PointerEvent) {
    if (event.button !== 0) return
    const { ripple, ring } = pressTargets(event)
    for (const target of new Set([ripple, ring])) {
      if (!target) continue
      const rect = target.getBoundingClientRect()
      if (!rect.width || !rect.height) continue
      start(target, (event.clientX - rect.left) * 100 / rect.width,
        (event.clientY - rect.top) * 100 / rect.height, target === ripple, target === ring, event.pointerId)
    }
  }

  function keyboardClick(event: MouseEvent) {
    const { ripple: target } = pressTargets(event)
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
    start(target, x, 50, true, false)
  }

  function finish(event: PointerEvent) {
    if (event.type === 'pointercancel') pointers.get(event.pointerId)?.forEach(cancel => cancel())
    pointers.delete(event.pointerId)
  }

  function clearAll() {
    pointers.clear()
    for (const waves of active.values()) for (const wave of waves.values()) wave.stop()
  }
  win.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
    if (event.matches) clearAll()
  }, options)
  doc.addEventListener('focusin', event => {
    const { ring } = pressTargets(event, true)
    if (ring) ringFocus(ring)
  }, options)
  doc.addEventListener('focusout', event => {
    const ring = event.composedPath().find(node => node instanceof HTMLElement && node.matches('.neui-focus-ring,[data-neui-ring]')) as HTMLElement | undefined
    if (ring && !(event.relatedTarget instanceof Node && ring.contains(event.relatedTarget))) ringBlur(ring)
  }, options)
  doc.addEventListener('pointerdown', press, options)
  doc.addEventListener('click', keyboardClick, options)
  win.addEventListener('pointerup', finish, { ...options, capture: true })
  win.addEventListener('pointercancel', finish, { ...options, capture: true })
  win.addEventListener('blur', clearAll, options)
  win.addEventListener('pagehide', clearAll, options)
  return () => { events.abort(); clearAll() }
}
