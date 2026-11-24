import { UTCDateMini } from '@date-fns/utc'
import { addDays, addMonths, format, getDaysInMonth, startOfWeek } from 'date-fns'
import type { Locale } from 'date-fns'

export type CalendarPart = 'year' | 'month' | 'day'
export type CalendarDraft = Partial<Record<CalendarPart, string>>
export interface CalendarCell {
  value: number
  label: string
  accessibleLabel: string
  selected: boolean
  today: boolean
  column?: number
}
export const yearsPerPage = 35
export const yearPage = (year: number) => 1 + Math.floor((year - 1) / yearsPerPage) * yearsPerPage
const pad = (n: number, width = 2) => String(n).padStart(width, '0')

/** Civil arithmetic must enumerate even dates skipped by a local clock change. */
export function monthStart(year: number, month: number) {
  const date = new UTCDateMini(2000, 0, 1, 12)
  date.setFullYear(year, month - 1, 1)
  return date
}

export function partNumber(draft: CalendarDraft, part: CalendarPart) {
  const raw = draft[part] ?? ''
  if (!(part === 'year' ? /^\d{4}$/ : /^\d{2}$/).test(raw)) return undefined
  const max = part === 'year' ? 9999 : part === 'month' ? 12 : 31
  const value = Number(raw)
  return value >= 1 && value <= max ? value : undefined
}

export function daysInDraft(draft: CalendarDraft) {
  const month = partNumber(draft, 'month')
  return month ? getDaysInMonth(monthStart(partNumber(draft, 'year') ?? 2000, month)) : 31
}

export function calendarValue(draft: CalendarDraft): string | null {
  const day = partNumber(draft, 'day')
  return day && day <= daysInDraft(draft) && partNumber(draft, 'month') && partNumber(draft, 'year')
    ? [draft.year, draft.month, draft.day].join('-') : null
}

export function calendarDraft(iso: unknown): CalendarDraft {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return {}
  const [year, month, day] = iso.split('-')
  const draft = { year, month, day }
  return calendarValue(draft) ? draft : {}
}

export function initialView(draft: CalendarDraft, today: Date) {
  return monthStart(partNumber(draft, 'year') ?? today.getFullYear(), partNumber(draft, 'month') ?? today.getMonth() + 1)
}

export function pageView(view: Date, part: CalendarPart, direction: -1 | 1) {
  const year = view.getFullYear()
  if (part === 'year') {
    const start = yearPage(year) + direction * yearsPerPage
    return start >= 1 && start <= 9999 ? monthStart(start, view.getMonth() + 1) : null
  }
  const next = addMonths(view, direction * (part === 'month' ? 12 : 1))
  return next.getFullYear() >= 1 && next.getFullYear() <= 9999 ? next : null
}

export function selectPart(draft: CalendarDraft, part: CalendarPart, value: number, view?: Date): CalendarDraft {
  const next = { ...draft }
  if (view && part !== 'year') next.year = pad(view.getFullYear(), 4)
  if (view && part === 'day') next.month = pad(view.getMonth() + 1)
  next[part] = pad(value, part === 'year' ? 4 : 2)
  if (part !== 'day' && Number(next.day) > daysInDraft(next)) delete next.day
  return next
}

export function calendarGrid(part: CalendarPart, dateInView: Date, draft: CalendarDraft, locale: Locale, today: Date) {
  const year = dateInView.getFullYear(), month = dateInView.getMonth() + 1
  const view = monthStart(year, month)
  const first = part === 'year' ? yearPage(year) : 1
  const end = part === 'year' ? Math.min(first + yearsPerPage - 1, 9999) : part === 'month' ? 12 : getDaysInMonth(view)
  const firstDay = startOfWeek(view, { locale })
  const offset = (view.getDay() - firstDay.getDay() + 7) % 7
  const selected = (part === 'year' || draft.year === pad(year, 4)) && (part !== 'day' || draft.month === pad(month))
    ? partNumber(draft, part) : undefined
  const number = new Intl.NumberFormat(locale.code, { useGrouping: false, minimumIntegerDigits: part === 'year' ? 4 : 1 })
  const cells: CalendarCell[] = Array.from({ length: end - first + 1 }, (_, i) => {
    const value = first + i
    const date = part === 'month' ? monthStart(year, value) : part === 'day' ? addDays(view, i) : view
    const label = part === 'month' ? format(date, 'LLLL', { locale }) : number.format(value)
    return { value, label, selected: selected === value, today: part === 'day' && year === today.getFullYear() && month === today.getMonth() + 1 && value === today.getDate(),
      accessibleLabel: part === 'day' ? format(date, 'PPPP', { locale }) : label,
      column: part === 'day' && i === 0 ? offset + 1 : undefined }
  })
  const weekdays = part === 'day' ? weekHeaders(firstDay, locale) : []
  const caption = part === 'year' ? number.format(first) + ' – ' + number.format(end)
    : format(view, part === 'day' ? 'LLLL yyyy' : 'yyyy', { locale })
  return { first, cells, weekdays, caption, columns: part === 'year' ? 5 : part === 'month' ? 3 : 7 }
}

function weekHeaders(start: Date, locale: Locale) {
  const region = new Intl.Locale(locale.code) as Intl.Locale & {
    getWeekInfo?: () => { weekend: number[] }; weekInfo?: { weekend: number[] }
  }
  const weekend = region.getWeekInfo?.().weekend ?? region.weekInfo?.weekend ?? [6, 7]
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i)
    return { label: format(date, 'EEEEEE', { locale }), fullLabel: format(date, 'EEEE', { locale }),
      weekend: weekend.includes(date.getDay() || 7) }
  })
}
