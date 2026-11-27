import { useState } from 'react'
import { calendarRangeValue, calendarValue, initialView, selectPart } from './model'
import type { CalendarPart, CalendarRangeDraft, RangeEndpoint } from './model'
import { useCalendar } from './useCalendar'
import type { CalendarOptions } from './useCalendar'

export interface CalendarRangeOptions extends Pick<CalendarOptions, 'locale' | 'today'> {
  draft: CalendarRangeDraft
  onChange: (draft: CalendarRangeDraft) => void
}

/** Two independently editable endpoints share a single visible assistant. */
export function useCalendarRange({ draft, onChange, ...options }: CalendarRangeOptions) {
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start')
  const [previous, setPrevious] = useState<CalendarRangeDraft | null>(null)
  function change(key: RangeEndpoint, next: CalendarRangeDraft[RangeEndpoint]) {
    setPrevious(null)
    onChange({ ...draft, [key]: next })
  }
  const start = useCalendar({ ...options, draft: draft.start, onChange: next => change('start', next) })
  const end = useCalendar({ ...options, draft: draft.end, onChange: next => change('end', next) })
  const controls = { start, end }

  function forEndpoint(key: RangeEndpoint) {
    const current = controls[key]
    const otherKey = key === 'start' ? 'end' : 'start'
    const other = controls[otherKey]
    function open(part: CalendarPart) {
      other.close()
      setEndpoint(key)
      current.open(part, current.isOpen ? undefined : initialView(other.draft, current.today))
    }
    function choose(part: CalendarPart, number: number, fromGrid = true) {
      // Typing just the opposite day uses the month already shown by the assistant.
      const useView = fromGrid || (part === 'day' && !!other.value && !current.draft.year && !current.draft.month)
      const next = selectPart(current.draft, part, number, useView ? current.view : undefined)
      const iso = calendarValue(next)
      if (fromGrid && part === 'day' && iso && other.value &&
          (key === 'end' ? iso < other.value : iso > other.value)) return
      current.choose(part, number, useView)
      if ((part === 'day' || !fromGrid) && iso && !other.value) {
        current.close()
        setEndpoint(otherKey)
        other.open('day', initialView(next, current.view))
        return otherKey
      }
    }
    return { ...current, open, choose }
  }
  const endpoints = { start: forEndpoint('start'), end: forEndpoint('end') }
  function reset() {
    setPrevious(draft)
    start.close()
    end.close()
    setEndpoint('start')
    onChange({ start: {}, end: {} })
  }
  function undo() {
    if (previous) onChange(previous)
    setPrevious(null)
  }
  return { endpoints, endpoint, calendar: endpoints[endpoint], range: { draft, endpoint },
    value: calendarRangeValue(draft), reset, undo, canUndo: previous !== null }
}
