import { Fragment, useRef } from 'react'
import type { KeyboardEvent, RefObject } from 'react'
import type { CalendarPart, RangeEndpoint, useCalendar } from '@neui/kit/react'
import { endpointNames, partNames } from './CalendarPanel'

type Calendar = Omit<ReturnType<typeof useCalendar>, 'choose'> & {
  choose: (part: CalendarPart, value: number, fromGrid?: boolean) => RangeEndpoint | void
}

export function segmentValidation(calendar: Calendar, validate: boolean) {
  const { draft } = calendar
  const present = Object.values(draft).some(Boolean)
  const parts = Object.keys(partNames) as CalendarPart[]
  const missing = parts.filter(key => !calendar.partValue(key))
  const invalid = parts.find(key => draft[key]?.length === (key === 'year' ? 4 : 2) &&
    (!calendar.partValue(key) || (key === 'day' && Number(draft.day) > calendar.maxDay)))
  const error = invalid ? 'Укажите ' + partNames[invalid].toLowerCase() + ' от 1 до ' +
    (invalid === 'day' ? calendar.maxDay : invalid === 'month' ? 12 : 9999) + '.'
    : validate && present && missing.length ? 'Дополните дату. Укажите ' + missing.map(key => partNames[key].toLowerCase()).join(', ') + '.' : ''
  return { error, invalid, missing }
}

export function DateSegments({ calendar, id, errorId, validation, panelRef, open, close, endpoint, focusEndpoint }: {
  calendar: Calendar; id: string; validation: ReturnType<typeof segmentValidation>; errorId?: string
  panelRef: RefObject<HTMLDivElement>; open: (part: CalendarPart) => void; close: () => void
  endpoint?: RangeEndpoint; focusEndpoint?: (endpoint: RangeEndpoint) => void
}) {
  const { draft, isOpen, part } = calendar
  const { error, invalid, missing } = validation
  const entry = useRef<HTMLDivElement>(null)
  const buffer = useRef({ key: '', text: '', time: 0 })
  const focus = (key: CalendarPart) => entry.current?.querySelector<HTMLElement>('[data-segment="' + key + '"]')?.focus({ preventScroll: true })
  function keys(event: KeyboardEvent<HTMLButtonElement>, key: CalendarPart) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      open(key)
      requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>('[data-level="' + key + '"] [tabindex="0"]')?.focus({ preventScroll: true }))
    } else if (/^\d$/.test(event.key) && !event.altKey && !event.metaKey && !event.ctrlKey) {
      event.preventDefault()
      open(key)
      const now = Date.now(), last = buffer.current
      const width = key === 'year' ? 4 : 2
      const raw = (last.key === key && now - last.time < 1800 && last.text.length < width ? last.text : '') + event.key
      buffer.current = { key, text: raw, time: now }
      const number = Number(raw)
      const max = key === 'year' ? 9999 : key === 'month' ? 12 : calendar.maxDay
      if (raw.length === width && number >= 1 && number <= max) {
        buffer.current.text = ''
        const nextEndpoint = calendar.choose(key, number, false)
        if (nextEndpoint) focusEndpoint?.(nextEndpoint)
        else if (key !== 'day') focus(key === 'year' ? 'month' : 'day')
      } else calendar.edit(key, raw)
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      buffer.current.text = ''
      calendar.edit(key, '')
    }
  }
  const masks = calendar.locale.code.startsWith('ru') ? { day: 'ДД', month: 'ММ', year: 'ГГГГ' } : { day: 'DD', month: 'MM', year: 'YYYY' }
  return <div ref={entry} className="neui-date-segments" role={endpoint ? 'group' : undefined}
    aria-label={endpoint && endpointNames[endpoint]} data-endpoint-entry={endpoint}>
    {calendar.pattern.map(({ type, value }, i) => {
      if (type === 'literal') return <Fragment key={i}>{value}</Fragment>
      const key = type as CalendarPart
      return <button key={key} type="button" data-segment={key} className="neui-date-segment neui-ripple"
        aria-expanded={isOpen && part === key} aria-controls={id + '-assistant'}
        aria-label={(endpoint ? endpointNames[endpoint] + ', ' : '') + partNames[key] + ', ' + (draft[key] || 'выбрать')}
        aria-invalid={error && (invalid === key || missing.includes(key)) ? true : undefined}
        aria-describedby={errorId} onKeyDown={e => keys(e, key)}
        onBlur={() => {
          const raw = buffer.current.key === key ? buffer.current.text : ''
          buffer.current.text = ''
          if (key !== 'year' && /^[1-9]$/.test(raw)) calendar.edit(key, raw.padStart(2, '0'))
        }}
        onClick={() => isOpen && key === part ? close() : open(key)}>{draft[key] || masks[key]}</button>
    })}
  </div>
}
