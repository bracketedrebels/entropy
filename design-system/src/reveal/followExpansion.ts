export function scrollContainer(region: HTMLElement) {
  let container: HTMLElement | null = region.parentElement
  while (container && !/^(auto|scroll|overlay)$/.test(getComputedStyle(container).overflowY)) {
    container = container.parentElement
  }
  return container
}

export function revealTransitions(panel: HTMLElement) {
  return (panel.getAnimations?.({ subtree: true }) ?? []).filter(animation =>
    'transitionProperty' in animation && (animation.transitionProperty === 'grid-template-rows' ||
      animation.transitionProperty === 'grid-template-columns' ||
      (animation.transitionProperty === 'height' && (animation.effect as KeyframeEffect | null)?.target?.hasAttribute('data-open'))))
}

/** Only an explicit opening gesture may advance the containing scroller. */
export function followExpansion(region: HTMLElement, panel: HTMLElement, motions?: readonly Animation[]) {
  const container = scrollContainer(region)
  const scroller = container ?? document.scrollingElement
  if (!scroller) return () => {}
  const controller = new AbortController()
  const head = region.querySelector('.neui-head'), foot = region.querySelector('.neui-foot')
  const topInset = head ? parseFloat(getComputedStyle(head).top) || 0 : 0
  const bottomInset = foot ? parseFloat(getComputedStyle(foot).bottom) || 0 : 0
  function follow() {
    const box = region.getBoundingClientRect()
    const bounds = container?.getBoundingClientRect()
    const viewport = window.visualViewport
    const top = Math.max(bounds?.top ?? 0, viewport?.offsetTop ?? 0) + topInset
    const bottom = Math.min(bounds?.bottom ?? Infinity, (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight)) - bottomInset
    const delta = Math.min(top < box.top ? box.top - top : 0, Math.max(0, box.bottom - bottom))
    if (delta >= 0.5) scroller!.scrollTop += delta
  }
  // ResizeObserver follows real intermediate heights, including soft wraps.
  const observer = new ResizeObserver(follow)
  const stop = () => { controller.abort(); observer.disconnect() }
  observer.observe(region)
  const options = { signal: controller.signal, passive: true, capture: true }
  for (const event of ['pointerdown', 'touchmove', 'wheel', 'keydown', 'input']) window.addEventListener(event, stop, options)
  follow()
  void Promise.allSettled((motions ?? revealTransitions(panel)).map(animation => animation.finished)).then(() => {
    if (!controller.signal.aborted) { follow(); stop() }
  })
  return stop
}
