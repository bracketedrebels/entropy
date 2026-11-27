import { useLayoutEffect, useMemo, useRef, useState } from 'react'

/** Cards in the same grid row share a stop, as do anchors clamped at the end of the page. */
export function currentStop(stops: number[], y: number, preferred: number) {
  let first = 0
  for (let i = 1; i < stops.length && stops[i] <= y + 1; i++) {
    if (stops[i] > stops[first] + 1) first = i
  }
  return preferred >= 0 && Math.abs(stops[preferred] - stops[first]) <= 1 ? preferred : first
}

export function LocalNavigation({ content, section, detail }: {
  content: HTMLElement; section: string; detail?: string
}) {
  const items = useMemo(() => Array.from(content.querySelectorAll<HTMLElement>('[data-nav-label][id]')), [content])
  const strip = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const target = section === 'css' && (detail === 'intruded' || detail === 'extruded') ? 'relief' : detail
  const preferred = items.findIndex(item => item.id === section + '/' + target)

  useLayoutEffect(() => {
    if (!items.length) return
    const documentRoot = document.scrollingElement ?? document.documentElement
    let frame = 0
    let stops: number[] = []
    let maxScroll = 0
    let previous = -1

    function sync() {
      frame = 0
      const y = Math.max(0, window.scrollY)
      const atEnd = maxScroll > 0 && y >= maxScroll - 1
      const hint = atEnd && !(stops[preferred] >= maxScroll - 1) ? items.length - 1 : preferred
      const index = currentStop(stops, y, hint)
      if (previous !== index) { previous = index; setCurrent(index) }
      if (bar.current) bar.current.style.transform = 'scaleX(' + (maxScroll ? Math.min(y / maxScroll, 1) : 1) + ')'
    }
    function measure() {
      maxScroll = Math.max(0, documentRoot.scrollHeight - documentRoot.clientHeight)
      stops = items.map(item => Math.min(maxScroll, Math.max(0, window.scrollY +
        item.getBoundingClientRect().top - (parseFloat(getComputedStyle(item).scrollMarginBlockStart) || 0))))
      cancelAnimationFrame(frame)
      sync()
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(sync)
    }

    // Also handles deep links on the first load of the lazy recipe page.
    if (preferred >= 0) items[preferred].scrollIntoView({ block: 'start', behavior: 'instant' })
    measure()
    const observer = new ResizeObserver(measure)
    for (const node of [content, ...items]) observer.observe(node)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', schedule)
    }
  }, [items, content, preferred])

  useLayoutEffect(() => {
    const rail = strip.current
    const link = rail?.children[current]
    if (!rail || !link) return
    const follow = () => {
      const box = link.getBoundingClientRect(), view = rail.getBoundingClientRect()
      if (box.left >= view.left + 6 && box.right <= view.right - 6) return
      rail.scrollTo({ left: rail.scrollLeft + box.left - view.left + (box.width - view.width) / 2,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    }
    follow()
    window.addEventListener('resize', follow)
    return () => window.removeEventListener('resize', follow)
  }, [items, current])

  if (!items.length) return null
  return <nav className="local-dock" key={section} aria-label="На этой странице">
    <div className="local-strip" ref={strip}>
      {items.map((item, i) => <a key={item.id} href={'#' + item.id} className="local-pill neui-pill neui-ripple"
        aria-current={i === current ? 'location' : undefined}>{item.dataset.navLabel}</a>)}
    </div>
    <div className="reading-track" aria-hidden="true"><div ref={bar} /></div>
  </nav>
}
