// Only the active pointer owns move/up listeners. Rows can mount and unmount freely.
export function listenForSwipe(doc: Document) {
  const win = doc.defaultView!
  const lifetime = new AbortController()
  const capture = { capture: true, signal: lifetime.signal }
  let cancel: (() => void) | undefined
  let suppress: number | undefined
  const rowFor = (event: Event) => event.composedPath().find(
    (node): node is HTMLElement => node instanceof HTMLElement && node.matches('.neui-swipe-right'),
  )
  function measure(row: HTMLElement, action: HTMLButtonElement) {
    const width = action.offsetWidth
    row.style.setProperty('--neui-swipe-travel', width + 'px')
    return width
  }
  doc.addEventListener('focusin', event => {
    const row = rowFor(event)
    const action = row?.querySelector<HTMLButtonElement>(':scope > button.neui-swipe-action')
    if (row && action) measure(row, action)
  }, capture)
  doc.addEventListener('click', event => {
    // The browser may retarget its compatibility click after the row is removed.
    // A keyboard click or the action.click() issued below must still pass.
    if (suppress === undefined || !event.detail ||
      ('pointerId' in event && event.pointerId !== suppress)) return
    suppress = undefined
    event.preventDefault()
    event.stopImmediatePropagation()
  }, capture)
  doc.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return
    cancel?.()
    suppress = undefined
    const row = rowFor(event)
    if (!row || event.defaultPrevented || event.composedPath().some(node =>
      node instanceof Element && node.matches(':disabled,[inert],[aria-disabled=true]'))) return
    const action = row.querySelector<HTMLButtonElement>(':scope > button.neui-swipe-action')
    if (!action || action.disabled) return
    const width = measure(row, action)
    if (!width) return
    const initial = row.dataset.neuiSwipeOpen === 'true'
      ? Number(getComputedStyle(row).getPropertyValue('--neui-swipe-progress')) * width : 0
    const id = event.pointerId, x = event.clientX, y = event.clientY
    const listeners = new AbortController()
    const options = { capture: true, signal: listeners.signal }
    let dragging = false
    const stop = () => {
      listeners.abort()
      if (row.hasPointerCapture?.(id)) row.releasePointerCapture(id)
      row.removeAttribute('data-neui-swiping')
      row.style.removeProperty('--neui-swipe-progress')
      row.style.removeProperty('--neui-swipe-tension')
      cancel = undefined
    }
    cancel = stop
    const track = (e: PointerEvent) => {
      const dx = e.clientX - x, dy = e.clientY - y
      if (!dragging) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return false
        if (Math.abs(dx) <= Math.abs(dy) || (dx < 0 && !initial)) { suppress = id; stop(); return false }
        dragging = true
        row.setAttribute('data-neui-swiping', '')
        if (row.isConnected && row.setPointerCapture) {
          // A synthetic event, or a pointer already cancelled by the UA, has no capture target.
          try { row.setPointerCapture(id) } catch (error) {
            if (!(error instanceof DOMException && error.name === 'NotFoundError')) throw error
          }
        }
      }
      const distance = initial + dx
      const progress = Math.max(0, Math.min(1, distance / width))
      const tension = -Math.expm1(-Math.max(0, distance - width) / 32)
      row.style.setProperty('--neui-swipe-progress', String(progress))
      row.style.setProperty('--neui-swipe-tension', String(tension))
      return progress === 1 && dx > 0
    }
    win.addEventListener('pointermove', e => { if (e.pointerId === id) track(e) }, options)
    win.addEventListener('pointerup', e => {
      if (e.pointerId !== id) return
      const armed = track(e)
      if (dragging) suppress = id
      stop()
      if (armed && row.isConnected && action.parentElement === row &&
        !action.matches(':disabled') && !action.closest('[inert],[aria-disabled=true]')) action.click()
    }, options)
    function interrupt(e: PointerEvent) { if (e.pointerId === id) { suppress = id; stop() } }
    win.addEventListener('pointercancel', interrupt, options)
    // Implicit capture on a touch target is lost when capture transfers to the row.
    row.addEventListener('lostpointercapture', e => { if (e.target === row) interrupt(e) }, options)
    win.addEventListener('blur', stop, { signal: listeners.signal })
    win.addEventListener('pagehide', stop, options)
  }, { signal: lifetime.signal })
  return () => { cancel?.(); lifetime.abort() }
}
