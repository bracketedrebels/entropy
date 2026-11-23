import { useLayoutEffect, useRef, useState } from 'react'

/** Keep the form's own scroll. Only the catalogue rows near its viewport need native controls. */
export function useChoiceWindow(enabled: boolean, open: boolean, count: number) {
  const list = useRef<HTMLDivElement>(null)
  const probe = useRef<HTMLDivElement>(null)
  const [range, setRange] = useState({ first: 0, end: 16 })
  useLayoutEffect(() => {
    const host = list.current, ruler = probe.current
    if (!enabled || !open || !host || !ruler) return
    let frame = 0
    const update = () => {
      frame = 0
      const pitch = ruler.getBoundingClientRect().height
      if (!pitch) return
      const top = host.getBoundingClientRect().top
      const first = Math.max(0, Math.floor(-top / pitch) - 6)
      const end = Math.min(count, Math.ceil((window.innerHeight - top) / pitch) + 6)
      setRange(old => old.first === first && old.end === end ? old : { first, end })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    const observer = new ResizeObserver(schedule)
    observer.observe(host)
    observer.observe(ruler)
    observer.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true, capture: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
    }
  }, [enabled, open, count])
  return { list, probe, range }
}
