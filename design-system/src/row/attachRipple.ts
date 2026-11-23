/** The native element owns activation. Only animated CSS properties change. */
export function attachRipple(node: HTMLElement) {
  let stop: (() => void) | undefined

  function start(x: number, y: number, bounds: DOMRect, pointerId?: number) {
    if (!node.animate) return
    stop?.()
    const radius = Math.max(1, Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y)))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const origin = { '--tn-ripple-x': x + 'px', '--tn-ripple-y': y + 'px', '--tn-ripple-alpha': '1' }
    const grow = node.animate([
      { ...origin, '--tn-ripple-size': Math.min(radius, 16) + 'px' },
      { ...origin, '--tn-ripple-size': radius + 'px' },
    ], { duration: reduced ? 0 : 240, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' })
    const events = new AbortController()
    let fade: Animation | undefined
    function clear() {
      events.abort()
      grow.cancel()
      fade?.cancel()
      if (stop === clear) stop = undefined
    }
    async function release() {
      events.abort()
      try {
        await grow.finished
        if (stop !== clear) return
        fade = node.animate([{ '--tn-ripple-alpha': '1' }, { '--tn-ripple-alpha': '0' }],
          { duration: reduced ? 0 : 170, fill: 'forwards' })
        await fade.finished
      } catch { /* A newer press, cancellation or unmount interrupted the wave. */ }
      finally { clear() }
    }
    stop = clear
    if (pointerId === undefined) { void release(); return }
    const options = { signal: events.signal, capture: true }
    window.addEventListener('pointerup', event => { if (event.pointerId === pointerId) void release() }, options)
    window.addEventListener('pointercancel', event => { if (event.pointerId === pointerId) clear() }, options)
    window.addEventListener('blur', clear, options)
  }

  function accepts(event: Event) {
    return !event.defaultPrevented && event.target instanceof Element && event.target.closest('.tn-ripple') === node
      && !node.matches(':disabled,[aria-disabled=true]') && !(node instanceof HTMLLabelElement && node.control?.matches(':disabled'))
  }
  function press(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0 || !accepts(event)) return
    const bounds = node.getBoundingClientRect()
    start(event.clientX - bounds.left, event.clientY - bounds.top, bounds, event.pointerId)
  }
  function activate(event: MouseEvent) {
    if (event.detail !== 0 || stop || !accepts(event)) return
    const bounds = node.getBoundingClientRect()
    const leading = node.querySelector(':scope > :is(.tn-row-leading,.row-area-leading):not(:empty), :scope > .tn-mark')?.getBoundingClientRect()
    start(leading ? leading.left - bounds.left + leading.width / 2 : bounds.width / 2, bounds.height / 2, bounds)
  }
  node.addEventListener('pointerdown', press)
  node.addEventListener('click', activate)
  return () => {
    node.removeEventListener('pointerdown', press)
    node.removeEventListener('click', activate)
    stop?.()
  }
}
