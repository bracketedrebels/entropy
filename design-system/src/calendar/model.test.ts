import { expect, it } from 'vitest'
import { enUS } from 'date-fns/locale/en-US'
import { ru } from 'date-fns/locale/ru'
import { calendarDraft, calendarGrid, calendarValue, monthStart, pageView, selectPart } from './model'

it('round-trips civil dates, validates leap centuries and preserves early years', () => {
  for (const iso of ['0001-01-01', '0099-12-31', '2000-02-29', '2024-03-31', '9999-12-31'])
    expect(calendarValue(calendarDraft(iso))).toBe(iso)
  for (const iso of ['0000-01-01', '1900-02-29', '2023-02-29', '2024-04-31', '2024-01-01T00:00:00Z'])
    expect(calendarDraft(iso)).toEqual({})
  expect(selectPart(calendarDraft('2024-02-29'), 'year', 2025)).toEqual({ year: '2025', month: '02' })
})
it('places days using the locale and supports months occupying four or six weeks', () => {
  const may = monthStart(2021, 5)
  const grid = (view: Date, locale = ru) => calendarGrid('day', view, {}, locale, may)
  expect(grid(may).cells[0].column).toBe(6)
  expect(grid(may, enUS).cells[0].column).toBe(7)
  expect(grid(monthStart(2021, 2)).cells).toHaveLength(28)
  expect(grid(monthStart(2021, 2)).cells[0].column).toBe(1)
  expect(grid(may).cells.at(-1)?.value).toBe(31)
  expect(grid(may).weekdays).toHaveLength(7)
})
it('limits year pages to the civil range and keeps chronological order', () => {
  const last = monthStart(9999, 12)
  const cells = calendarGrid('year', last, {}, ru, last).cells
  expect(cells.length).toBeLessThanOrEqual(35)
  expect(cells.at(-1)?.value).toBe(9999)
  for (const part of ['year', 'month', 'day'] as const) {
    expect(pageView(last, part, 1)).toBeNull()
    expect(pageView(monthStart(1, 1), part, -1)).toBeNull()
  }
  expect(calendarGrid('year', monthStart(2026, 1), {}, ru, last).cells.map(c => c.value))
    .toEqual(Array.from({ length: 35 }, (_, i) => 1996 + i))
})

it('enumerates every civil day even in a month with an international date-line change', () => {
  const grid = calendarGrid('day', new Date(2011, 11, 15), {}, enUS, new Date(2011, 11, 1))
  expect(grid.cells[29].accessibleLabel).toContain('December 30')
  expect(grid.cells[30].accessibleLabel).toContain('December 31')
  expect(grid.weekdays.filter(day => day.weekend).map(day => day.fullLabel)).toEqual(['Sunday', 'Saturday'])
})

it('marks inclusive civil days, both bounds and week breaks across New Year', () => {
  const draft = { start: calendarDraft('2023-12-30'), end: calendarDraft('2024-01-08') }
  const days = (year: number, month: number) => {
    const view = monthStart(year, month)
    return calendarGrid('day', view, draft.end, ru, view, { draft, endpoint: 'end' }).cells
  }
  const december = days(2023, 12), january = days(2024, 1)
  expect(december[28].disabled).toBe(true)
  expect(december[29]).toMatchObject({ rangeStart: true, inRange: true, bandStart: true, disabled: false })
  expect(december[30].bandEnd).toBe(true)
  expect(january.slice(0, 8).every(cell => cell.inRange)).toBe(true)
  expect(january[0].bandStart).toBe(true)
  expect(january[6].bandEnd).toBe(true)
  expect(january[7]).toMatchObject({ bandStart: true, bandEnd: true, rangeEnd: true })
  expect(january[8].inRange).toBe(false)
})

it('keeps open bounds distinct from a one-day or inverted interval', () => {
  const leap = calendarDraft('2024-02-29'), view = monthStart(2024, 2)
  const cells = (start: typeof leap, end: typeof leap) =>
    calendarGrid('day', view, start, ru, view, { draft: { start, end }, endpoint: 'start' }).cells
  expect(cells(leap, {}).at(-1)).toMatchObject({ inRange: false, rangeStart: true, rangeEnd: false })
  expect(cells(leap, leap).at(-1)).toMatchObject({ inRange: true, rangeStart: true, rangeEnd: true, bandStart: true, bandEnd: true })
  expect(cells(leap, calendarDraft('2024-02-28')).some(cell => cell.inRange)).toBe(false)
})
