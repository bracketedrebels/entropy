import { useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent, MutableRefObject, ReactNode, RefObject } from 'react'
import { useCalendarDrag } from './useCalendarDrag'
import { calendarValue, useCalendarGrid, useReveal } from '@neui/kit/react'
import type { CalendarPart, CalendarRangeContext, useCalendar } from '@neui/kit/react'

export const endpointNames = { start: 'Начало периода', end: 'Конец периода' }
type Calendar = ReturnType<typeof useCalendar>
export const partNames = { year: 'Год', month: 'Месяц', day: 'День' }
const levels = ['year', 'month', 'day'] as const
const layout = { day: 'neui-calendar-days', month: 'neui-calendar-months', year: 'neui-calendar-years' }
const paging = { day: ['Предыдущий месяц', 'Следующий месяц'], month: ['Предыдущий год', 'Следующий год'],
  year: ['Предыдущие 35 лет', 'Следующие 35 лет'] }

function CalendarScreen({ calendar, part, focusNext, range }: {
  calendar: Calendar; part: CalendarPart; focusNext: MutableRefObject<boolean>; range?: CalendarRangeContext
}) {
  const { view, page: changePage } = calendar
  const { current, pages, canBack, canForward } = useCalendarGrid({ ...calendar, part, range })
  const active = part === calendar.part && calendar.isOpen
  const strip = useRef<HTMLDivElement>(null)
  const drag = useCalendarDrag()
  const screen = useRef<HTMLDivElement>(null)
  const gridFocus = useRef(false)
  const [cursor, setCursor] = useState<number | null>(null)
  const chosen = current.cells.find(cell => cell.selected)
  const boundary = range?.draft[range.endpoint === 'start' ? 'end' : 'start']
  const otherDay = part === 'day' && boundary && Number(boundary.year) === view.getFullYear() &&
    Number(boundary.month) === view.getMonth() + 1 ? Number(boundary.day) : undefined
  const fallback = chosen?.value ?? otherDay ?? (part === 'year' ? view.getFullYear() : part === 'month' ? view.getMonth() + 1 : 1)
  const available = current.cells.filter(cell => !cell.disabled)
  const preferred = available.find(cell => cell.value === fallback)?.value ?? available[0]?.value
  const focusValue = cursor !== null && available.some(cell => cell.value === cursor) ? cursor : preferred
  const pageKey = part + current.caption + (range?.endpoint ?? '')

  useLayoutEffect(() => {
    if (!active) return
    setCursor(null)
    if (focusNext.current || gridFocus.current) {
      screen.current?.querySelector<HTMLButtonElement>('[data-current="true"] [data-value="' + preferred + '"]')?.focus({ preventScroll: true })
      focusNext.current = false
      gridFocus.current = false
    }
  }, [active, pageKey])

  // Keep the arriving grid mounted throughout the gesture. Recenter the three-page
  // window only after native snapping finishes, including on trackpads and touch.
  useLayoutEffect(() => {
    const track = strip.current
    if (!active || !track) return
    const currentPage = track.querySelector<HTMLElement>('[data-current="true"]')
    if (!currentPage) return
    let width = track.clientWidth
    let pending: ReturnType<typeof setTimeout> | undefined
    let committed = false
    const align = () => { track.scrollLeft = currentPage.offsetLeft }
    const settle = () => {
      if (committed || !track.clientWidth || track.hasAttribute('data-dragging')) return
      const delta = track.scrollLeft - currentPage.offsetLeft
      const direction = delta < 0 ? -1 : 1
      const neighbor = direction < 0 ? currentPage.previousElementSibling : currentPage.nextElementSibling
      if (!(neighbor instanceof HTMLElement) || Math.abs(delta) < track.clientWidth / 2 ||
          Math.abs(track.scrollLeft - neighbor.offsetLeft) > 1) return
      committed = true
      gridFocus.current ||= currentPage.contains(document.activeElement)
      changePage(direction)
    }
    const afterScroll = () => {
      clearTimeout(pending)
      pending = setTimeout(settle, 120)
    }
    align()
    const observer = new ResizeObserver(() => {
      if (width === track.clientWidth) return
      width = track.clientWidth
      align()
    })
    observer.observe(track)
    track.addEventListener('scrollend', settle)
    if (!('onscrollend' in window)) track.addEventListener('scroll', afterScroll, { passive: true })
    return () => {
      observer.disconnect()
      clearTimeout(pending)
      track.removeEventListener('scrollend', settle)
      track.removeEventListener('scroll', afterScroll)
    }
  }, [active, current.pageIndex, range?.endpoint, changePage])

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
      if (!available.length) return
      const first = current.cells.indexOf(available[0]), last = current.cells.indexOf(available[available.length - 1])
      const value = current.cells[Math.max(first, Math.min(last, next[event.key]))].value
      setCursor(value)
      screen.current?.querySelector<HTMLButtonElement>('[data-current="true"] [data-value="' + value + '"]')?.focus({ preventScroll: true })
    }
  }
  const grids = pages.map(page => {
    const visible = page === current
    return <div key={page.pageIndex} data-current={visible} data-page={page.pageIndex} role="radiogroup"
      aria-label={(range ? endpointNames[range.endpoint] + ', ' : '') + partNames[part] + ', ' + page.caption} aria-hidden={!visible || undefined}
      {...(!visible ? { inert: '' } : {})} className={'neui-calendar-grid ' + layout[part]}>
      {page.cells.map((cell, index) => <button key={cell.value} type="button" role="radio"
        className={'neui-date-cell neui-ripple' + (range && part === 'day' ? ' neui-calendar-range-day' : '')}
        data-value={cell.value} disabled={cell.disabled}
        data-in-range={cell.inRange || undefined} data-band-start={cell.bandStart || undefined} data-band-end={cell.bandEnd || undefined}
        data-endpoint={cell.rangeStart || cell.rangeEnd || undefined}
        aria-label={[cell.accessibleLabel, cell.rangeStart && 'начало периода', cell.rangeEnd && 'конец периода'].filter(Boolean).join(', ')} aria-checked={cell.selected}
        aria-current={cell.today ? 'date' : undefined} tabIndex={active && visible && cell.value === focusValue ? 0 : -1}
        style={{ gridColumnStart: cell.column }} onKeyDown={e => keys(e, index)} onClick={e => {
          if (!active || !visible) return
          if (part !== 'day' || (range && !calendarValue(range.draft[range.endpoint === 'start' ? 'end' : 'start']))) focusNext.current = true
          calendar.choose(part, cell.value)
          if (e.detail === 0 && part === 'day') setCursor(cell.value)
        }}>
        <span>{cell.label}</span><span aria-hidden="true" className={range ? 'neui-check-box' : 'neui-check-radio'} />
      </button>)}
    </div>
  })
  const distance = levels.indexOf(part) - levels.indexOf(calendar.part)
  return <section ref={screen} data-level={part} data-direction={Math.sign(distance)} aria-hidden={!active || undefined}
    {...(!active ? { inert: '' } : {})} className="neui-date-screen">
    <div className="neui-date-nav">
      <small aria-live={active ? 'polite' : 'off'}>{range && <>{endpointNames[range.endpoint]} · </>}{part === 'year' ? <>Годы<span className="sr-only">, {current.caption}</span></> : current.caption}</small>
      {([-1, 1] as const).map((step, i) => <button type="button" key={step} className="neui-date-page neui-ripple"
        aria-label={paging[part][i]} disabled={step < 0 ? !canBack : !canForward} onClick={() => turn(step)}>
        <span aria-hidden="true">{step < 0 ? '‹' : '›'}</span>
      </button>)}
    </div>
    {part === 'day' && <div aria-hidden="true" className="neui-calendar-grid neui-calendar-days neui-date-week">
      {current.weekdays.map((day, i) => <span key={i} title={day.fullLabel} data-weekend={day.weekend || undefined}>{day.label}</span>)}
    </div>}
    <div ref={strip} {...drag} className="neui-calendar-pager" dir="ltr">{grids}</div>
  </section>
}

export function CalendarPanel({ calendar, panelRef, mounted, children, range }: {
  calendar: Calendar; panelRef: RefObject<HTMLDivElement>; mounted: boolean; children?: ReactNode; range?: CalendarRangeContext
}) {
  const focusNext = useRef(false)
  const disclosure = useReveal(calendar.isOpen)
  useLayoutEffect(() => {
    const inner = panelRef.current
    if (!inner) return
    const disclosure = inner.parentElement!
    const measure = () => disclosure.style.setProperty('--neui-calendar-height', inner.offsetHeight + 'px')
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [mounted, calendar.part, panelRef])
  return <div className="neui-date-disclosure" {...disclosure}>
    {mounted && <div ref={panelRef} className="neui-date-content">
      {children}
      <div className="neui-date-stack">
        {levels.map(part => <CalendarScreen key={part} part={part} range={range} calendar={calendar} focusNext={focusNext} />)}
      </div>
    </div>}
  </div>
}
