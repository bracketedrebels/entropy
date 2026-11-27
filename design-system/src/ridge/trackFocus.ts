import { retain } from './retain'
import { focusCentre } from './focusAnchor'

const scopes = new WeakMap<Element, () => void>()

// A renderer can project the same measurement into its own moving coordinate space.
type FocusSample = (target: Element | null, viewportY: number) => void
const projections = new WeakMap<HTMLElement, FocusSample>()

export function refreshFocusScope(scope: Element) {
  scopes.get(scope)?.()
}

export function projectFocus(scope: HTMLElement, sample: FocusSample) {
  projections.set(scope, sample)
  scopes.get(scope)?.()
  return () => { projections.delete(scope) }
}

function nearestScope(element: Element | null) {
  while (element && !scopes.has(element)) element = element.parentElement
  return element
}

/** Publish the focused anchor's centre in local CSS pixels. Any CSS consumer can use the signal. */
export const trackFocus = retain((scope: HTMLElement) => {
  const doc = scope.ownerDocument
  const win = doc.defaultView!
  const events = new AbortController()
  const options = { signal: events.signal }
  let watching: AbortController | undefined
  let size: ResizeObserver | undefined
  let target: Element | null = null
  let stopped = false

  function measure() {
    if (!target) return
    const centre = focusCentre(target, scope)
    if (!Number.isFinite(centre)) return
    const y = centre - scope.getBoundingClientRect().top
    scope.style.setProperty('--neui-focus-y', y + 'px')
    projections.get(scope)?.(target, centre)
  }
  function release() {
    watching?.abort()
    size?.disconnect()
    target = null
    scope.style.removeProperty('--neui-focus-y')
    scope.style.removeProperty('--neui-focus-active')
  }
  function sync() {
    if (stopped) return
    const active = doc.activeElement
    const within = scope.classList.contains('neui-track-focus-within')
    const next = (within ? scope.contains(active) : nearestScope(active) === scope) ? active : null
    if (target !== next) {
      release()
      target = next
      if (next) {
        watching = new AbortController()
        const listen = { signal: watching.signal }
        doc.addEventListener('selectionchange', measure, listen)
        win.addEventListener('scroll', measure, { ...listen, passive: true, capture: true })
        size = new ResizeObserver(measure)
        size.observe(scope)
        size.observe(next.closest('.neui-focus-anchor,.neui-row,.neui-pill') ?? next)
        scope.style.setProperty('--neui-focus-active', '1')
      }
    }
    if (target) measure()
    else projections.get(scope)?.(null, 0)
  }
  // Touch engines can drag a native range without focusing its input.
  scope.addEventListener('pointerdown', event => {
    const input = event.target
    if (event.isPrimary && event.button === 0 && input instanceof HTMLInputElement &&
        input.matches('input[type="range"]:enabled') && nearestScope(input) === scope)
      input.focus({ preventScroll: true })
  }, { ...options, capture: true })
  scope.addEventListener('focusin', sync, options)
  scope.addEventListener('focusout', () => queueMicrotask(sync), options)
  for (const type of ['input', 'keyup', 'pointerup', 'selectionchange']) scope.addEventListener(type, measure, options)
  const parent = nearestScope(scope.parentElement)
  scopes.set(scope, sync)
  if (parent) scopes.get(parent)?.()
  sync()
  return () => {
    stopped = true
    events.abort()
    scopes.delete(scope)
    release()
    projections.get(scope)?.(null, 0)
    const owner = nearestScope(doc.activeElement)
    if (owner) scopes.get(owner)?.()
  }
})
