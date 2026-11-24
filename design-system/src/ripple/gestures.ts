// Only active gestures retain targets. Newly mounted rows need no registration.
interface Wave {
  target: HTMLElement
  pointerId?: number
}

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

function reset(target: HTMLElement) {
  target.dataset.neuiPress = 'reset'
  // Commit the zero frame so a second press restarts even during the fade.
  getComputedStyle(target, '::after').getPropertyValue('--neui-ripple-progress')
}

function transitions(target: HTMLElement, property: string) {
  // getAnimations flushes styles, including a press and release in the same frame.
  return (target.getAnimations?.({ subtree: true }) ?? []).filter(animation =>
    'transitionProperty' in animation && animation.transitionProperty === property &&
    (animation.effect as KeyframeEffect | null)?.target === target)
}

export function listenForRipple(doc: Document) {
  const win = doc.defaultView!
  const events = new AbortController()
  const active = new Map<HTMLElement, Wave>()
  const options = { signal: events.signal }

  function clear(wave: Wave) {
    const target = wave.target
    if (active.get(target) !== wave) return
    active.delete(target)
    target.removeAttribute('data-neui-press')
    target.style.removeProperty('--neui-press-x')
    target.style.removeProperty('--neui-press-y')
  }

  function start(target: HTMLElement, x: number, y: number, pointerId?: number) {
    const wave = { target, pointerId }
    active.set(target, wave)
    target.style.setProperty('--neui-press-x', x + '%')
    target.style.setProperty('--neui-press-y', y + '%')
    reset(target)
    target.dataset.neuiPress = 'held'
    return wave
  }

  async function release(wave: Wave) {
    const target = wave.target
    wave.pointerId = undefined
    await Promise.allSettled(transitions(target, '--neui-ripple-progress').map(animation => animation.finished))
    if (active.get(target) !== wave) return
    target.dataset.neuiPress = 'fading'
    await Promise.allSettled(transitions(target, 'opacity').map(animation => animation.finished))
    clear(wave)
  }

  function press(event: PointerEvent) {
    if (event.button !== 0 || !event.isPrimary) return
    const target = targetOf(event)
    if (!target) return
    const rect = target.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    start(target, (event.clientX - rect.left) * 100 / rect.width, (event.clientY - rect.top) * 100 / rect.height, event.pointerId)
  }

  function keyboardClick(event: MouseEvent) {
    if (event.detail !== 0) return
    const target = targetOf(event)
    if (!target || active.has(target)) return
    const rect = target.getBoundingClientRect()
    const marker = target.querySelector(':scope > :is(.neui-row-leading,.neui-row-area-leading,.neui-mark)')?.getBoundingClientRect()
    const x = rect.width && marker ? (marker.left + marker.width / 2 - rect.left) * 100 / rect.width : 50
    void release(start(target, x, 50))
  }

  function finish(event: PointerEvent) {
    for (const wave of active.values()) {
      if (wave.pointerId !== event.pointerId) continue
      if (event.type === 'pointerup') void release(wave)
      else clear(wave)
    }
  }
  const clearAll = () => { for (const wave of active.values()) clear(wave) }
  doc.addEventListener('pointerdown', press, options)
  doc.addEventListener('click', keyboardClick, options)
  win.addEventListener('pointerup', finish, { ...options, capture: true })
  win.addEventListener('pointercancel', finish, { ...options, capture: true })
  win.addEventListener('blur', clearAll, options)
  win.addEventListener('pagehide', clearAll, options)
  return () => { events.abort(); clearAll() }
}
