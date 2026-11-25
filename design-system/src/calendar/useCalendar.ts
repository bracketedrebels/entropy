import { useCallback, useMemo, useState } from 'react'
import type { Locale } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import { calendarGrid, calendarValue, daysInDraft, initialView, monthStart, pageView, partNumber, selectPart, yearPage, yearsPerPage } from './model'
import type { CalendarDraft, CalendarPart } from './model'

export interface CalendarOptions {
  draft: CalendarDraft
  onChange: (next: CalendarDraft) => void
  locale?: Locale
  today?: Date
}

/** Generates the current grid and at most two adjacent year pages, independent of the DOM. */
export function useCalendarGrid({ part, view, draft, locale, today }: {
  part: CalendarPart; view: Date; draft: CalendarDraft; locale: Locale; today: Date
}) {
  return useMemo(() => {
    const current = calendarGrid(part, view, draft, locale, today)
    const previous = pageView(view, part, -1), next = pageView(view, part, 1)
    const adjacent = (date: Date | null) => part === 'year' && date ? [calendarGrid(part, date, draft, locale, today)] : []
    return { current, pages: [...adjacent(previous), current, ...adjacent(next)], canBack: !!previous, canForward: !!next }
  }, [part, view, draft, locale, today])
}

/** The caller owns the draft and its storage. Browsing alone never commits a date. */
export function useCalendar({ draft, onChange, locale = ru, today: reference }: CalendarOptions) {
  const [mountedToday] = useState(() => new Date())
  const today = reference ?? mountedToday
  const [part, setPart] = useState<CalendarPart>('day')
  const [isOpen, setOpen] = useState(false)
  const [view, setView] = useState<Date>(() => initialView(draft, today))
  const [previous, setPrevious] = useState<CalendarDraft | null>(null)
  const pattern = useMemo(() => new Intl.DateTimeFormat(locale.code, {
    calendar: 'gregory', timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(monthStart(2006, 11)).filter(item => ['year', 'month', 'day', 'literal'].includes(item.type)), [locale])

  function open(target: CalendarPart) {
    if (!isOpen) setView(initialView(draft, today))
    setPart(target)
    setOpen(true)
  }
  function edit(target: CalendarPart, raw: string) {
    if (!/^\d*$/.test(raw) || raw.length > (target === 'year' ? 4 : 2)) return
    setPrevious(null)
    onChange({ ...draft, [target]: raw })
  }
  function choose(target: CalendarPart, number: number, fromGrid = true) {
    if (!Number.isInteger(number) || number < 1 || number > (target === 'year' ? 9999 : target === 'month' ? 12 : 31)) return
    const next = selectPart(draft, target, number, fromGrid ? view : undefined)
    if (target === 'day' && number > daysInDraft(next)) return
    setPrevious(null)
    onChange(next)
    if (target !== 'day') {
      setView(monthStart(target === 'year' ? number : view.getFullYear(), target === 'month' ? number : view.getMonth() + 1))
      setPart(target === 'year' ? 'month' : 'day')
    }
  }
  function reset() {
    setPrevious(draft)
    onChange({})
    setOpen(false)
    setView(initialView({}, today))
  }
  function undo() {
    if (!previous) return
    onChange(previous)
    setView(initialView(previous, today))
    setPrevious(null)
  }
  const page = useCallback((step: -1 | 1) => setView(old => pageView(old, part, step) ?? old), [part])
  const goToYearPage = useCallback((index: number) => {
    const first = 1 + index * yearsPerPage
    if (!Number.isInteger(index) || first < 1 || first > 9999) return
    setView(old => yearPage(old.getFullYear()) === first ? old : monthStart(first, old.getMonth() + 1))
  }, [])
  return { part, isOpen, view, today, locale, pattern, draft, value: calendarValue(draft), canUndo: previous !== null,
    maxDay: daysInDraft(draft), partValue: (key: CalendarPart) => partNumber(draft, key),
    open, close: () => setOpen(false), edit, choose, reset, undo,
    page, goToYearPage }
}
