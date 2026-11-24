import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent, MutableRefObject, RefObject } from 'react'
import { useYearDrag } from './useYearDrag'
import { useCalendarGrid } from '@neui/kit/react'
import type { CalendarPart, useCalendar } from '@neui/kit/react'

type Calendar = ReturnType<typeof useCalendar>
export const partNames = { year: 'Год', month: 'Месяц', day: 'День' }
const levels = ['year', 'month', 'day'] as const
const layout = { day: 'neui-calendar-days', month: 'neui-calendar-months', year: 'neui-calendar-years' }
const paging = { day: ['Предыдущий месяц', 'Следующий месяц'], month: ['Предыдущий год', 'Следующий год'],
  year: ['Предыдущие 35 лет', 'Следующие 35 лет'] }

function CalendarScreen({ calendar, part, focusNext }: {
  calendar: Calendar; part: CalendarPart; focusNext: MutableRefObject<boolean>
}) {
  const { view } = calendar
  const { current, pages, canBack, canForward } = useCalendarGrid({ ...calendar, part })
  const active = part === calendar.part && calendar.isOpen
  const strip = useRef<HTMLDivElement>(null)
  const drag = useYearDrag()
  const screen = useRef<HTMLDivElement>(null)
  const gridFocus = useRef(false)
  const [cursor, setCursor] = useState<number | null>(null)
  const chosen = current.cells.find(cell => cell.selected)
  const preferred = chosen?.value ?? (part === 'year' ? view.getFullYear() : part === 'month' ? view.getMonth() + 1 : 1)
  const focusValue = cursor !== null && current.cells.some(cell => cell.value === cursor) ? cursor : preferred
  const pageKey = part + current.caption

  useLayoutEffect(() => {
    if (!active) return
    const track = strip.current
    const page = track?.querySelector<HTMLElement>('[data-current="true"]')
    if (track && page) track.scrollLeft = page.offsetLeft
    setCursor(null)
    if (focusNext.current || gridFocus.current) {
      screen.current?.querySelector<HTMLButtonElement>('[data-current="true"] [data-value="' + preferred + '"]')?.focus({ preventScroll: true })
      focusNext.current = false
      gridFocus.current = false
    }
  }, [active, pageKey])

  // Rebase the three native snap pages only after the arriving page has actually settled.
  useEffect(() => {
    const track = strip.current
    if (!track || !active) return
    let timer: ReturnType<typeof setTimeout>
    function settle() {
      if (!track?.clientWidth || track.hasAttribute('data-dragging')) return
      const snapped = Array.from(track.children).find(node => Math.abs((node as HTMLElement).offsetLeft - track.scrollLeft) < 2)
      if (!snapped) return
      const first = Number((snapped as HTMLElement).dataset.first)
      if (first !== current.first) calendar.page(first > current.first ? 1 : -1)
    }
    const scroll = () => { clearTimeout(timer); timer = setTimeout(settle, 120) }
    track.addEventListener('scroll', scroll, { passive: true })
    track.addEventListener('scrollend', settle)
    return () => {
      clearTimeout(timer)
      track.removeEventListener('scroll', scroll)
      track.removeEventListener('scrollend', settle)
    }
  }, [active, current.first, calendar.page])

  function turn(direction: -1 | 1) {
    if (direction < 0 ? !canBack : !canForward) return
    const track = strip.current
    const target = track?.children[pages.indexOf(current) + direction] as HTMLElement | undefined
    if (target && track?.clientWidth) {
      track.scrollTo({ left: target.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    } else calendar.page(direction)
  }
  function keys(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const end = current.cells.length - 1
    const next: Record<string, number> = {
      ArrowRight: index + 1, ArrowLeft: index - 1, ArrowUp: index - current.columns,
      ArrowDown: index + current.columns, Home: 0, End: end,
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault()
      gridFocus.current = true
      turn(event.key === 'PageUp' ? -1 : 1)
    } else if (event.key in next) {
      event.preventDefault()
      const value = current.cells[Math.max(0, Math.min(end, next[event.key]))].value
      setCursor(value)
      screen.current?.querySelector<HTMLButtonElement>('[data-current="true"] [data-value="' + value + '"]')?.focus({ preventScroll: true })
    }
  }
  const grids = pages.map(page => {
    const visible = page === current
    return <div key={page.first} data-current={visible} data-first={page.first} role="radiogroup"
      aria-label={partNames[part] + ', ' + page.caption} aria-hidden={!visible || undefined}
      className={'neui-calendar-grid ' + layout[part]}>
      {page.cells.map((cell, index) => <button key={cell.value} type="button" role="radio" className="neui-date-cell neui-ripple"
        data-value={cell.value} aria-label={cell.accessibleLabel} aria-checked={cell.selected}
        aria-current={cell.today ? 'date' : undefined} tabIndex={active && visible && cell.value === focusValue ? 0 : -1}
        style={{ gridColumnStart: cell.column }} onKeyDown={e => keys(e, index)} onClick={e => {
          if (!active || !visible) return
          if (part !== 'day') focusNext.current = true
          calendar.choose(part, cell.value)
          if (e.detail === 0 && part === 'day') setCursor(cell.value)
        }}>
        <span>{cell.label}</span><span aria-hidden="true" className="neui-check-radio" />
      </button>)}
    </div>
  })
  const distance = levels.indexOf(part) - levels.indexOf(calendar.part)
  return <section ref={screen} data-level={part} data-direction={Math.sign(distance)} aria-hidden={!active || undefined}
    {...(!active ? { inert: '' } : {})} className="neui-date-screen">
    <div className="neui-date-nav">
      <small aria-live={active ? 'polite' : 'off'}>{part === 'year' ? <>Годы<span className="sr-only">, {current.caption}</span></> : current.caption}</small>
      {([-1, 1] as const).map((step, i) => <button type="button" key={step} className="neui-date-page neui-ripple"
        aria-label={paging[part][i]} disabled={step < 0 ? !canBack : !canForward} onClick={() => turn(step)}>
        <span aria-hidden="true">{step < 0 ? '‹' : '›'}</span>
      </button>)}
    </div>
    {part === 'day' && <div aria-hidden="true" className="neui-calendar-grid neui-calendar-days neui-date-week">
      {current.weekdays.map((day, i) => <span key={i} title={day.fullLabel} data-weekend={day.weekend || undefined}>{day.label}</span>)}
    </div>}
    {part === 'year' ? <div ref={strip} {...drag} className="neui-date-years" dir="ltr">{grids}</div> : grids}
  </section>
}

export function CalendarPanel({ calendar, panelRef }: { calendar: Calendar; panelRef: RefObject<HTMLDivElement> }) {
  const focusNext = useRef(false)
  useLayoutEffect(() => {
    const host = panelRef.current
    const current = host?.querySelector<HTMLElement>('[data-level="' + calendar.part + '"]')
    if (!host || !current) return
    const measure = () => { host.style.height = current.offsetHeight + 'px' }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(current)
    return () => observer.disconnect()
  }, [calendar.part, panelRef])
  return <div ref={panelRef} className="neui-date-screens">
    {levels.map(part => <CalendarScreen key={part} part={part} calendar={calendar} focusNext={focusNext} />)}
  </div>
}
