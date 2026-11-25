import { Fragment, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Locale } from 'date-fns'
import { useCalendar } from '@neui/kit/react'
import type { CalendarDraft, CalendarPart } from '@neui/kit/react'
import { Field } from '../../recipes/Field'
import { Reveal } from '../../recipes/Reveal'
import { CalendarPanel, partNames } from './CalendarPanel'

interface Props {
  id: string
  name: string
  label: string
  draft: CalendarDraft
  onChange: (next: CalendarDraft) => void
  locale?: Locale
}

export function CalendarField({ id, name, label, draft, onChange, locale }: Props) {
  const calendar = useCalendar({ draft, onChange, locale })
  const { isOpen, part } = calendar
  const [visited, setVisited] = useState(false)
  const [validate, setValidate] = useState(false)
  const entry = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const buffer = useRef({ key: '', text: '', time: 0 })
  const present = Object.values(draft).some(Boolean)
  const parts = Object.keys(partNames) as CalendarPart[]
  const missing = parts.filter(key => !calendar.partValue(key))
  const invalid = parts.find(key => draft[key]?.length === (key === 'year' ? 4 : 2) &&
    (!calendar.partValue(key) || (key === 'day' && Number(draft.day) > calendar.maxDay)))
  const error = invalid ? 'Укажите ' + partNames[invalid].toLowerCase() + ' от 1 до ' +
    (invalid === 'day' ? calendar.maxDay : invalid === 'month' ? 12 : 9999) + '.'
    : validate && present && missing.length ? 'Дополните дату. Укажите ' + missing.map(key => partNames[key].toLowerCase()).join(', ') + '.' : ''
  const focus = (key: CalendarPart) => entry.current?.querySelector<HTMLElement>('[data-segment="' + key + '"]')?.focus({ preventScroll: true })
  function open(key: CalendarPart) { setVisited(true); calendar.open(key) }
  function close() { calendar.close(); setValidate(true); focus(part) }
  function keys(event: KeyboardEvent<HTMLButtonElement>, key: CalendarPart) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      open(key)
      requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('[data-level="' + key + '"] [tabindex="0"]')?.focus({ preventScroll: true }))
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
        calendar.choose(key, number, false)
        if (key !== 'day') focus(key === 'year' ? 'month' : 'day')
      } else calendar.edit(key, raw)
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      buffer.current.text = ''
      calendar.edit(key, '')
    }
  }
  const action = (present || calendar.canUndo) && <button type="button" className="neui-pill"
    aria-label={(calendar.canUndo ? 'Вернуть' : 'Сбросить') + ' дату'} onClick={() => {
      if (calendar.canUndo) calendar.undo()
      else calendar.reset()
      buffer.current.text = ''
      setValidate(false)
      focus('day')
    }}>{calendar.canUndo ? 'Вернуть' : 'Сбросить'}</button>
  const masks = calendar.locale.code.startsWith('ru') ? { day: 'ДД', month: 'ММ', year: 'ГГГГ' } : { day: 'DD', month: 'MM', year: 'YYYY' }
  return <div className="neui-date-field" onBlur={e => {
    if (!e.currentTarget.contains(e.relatedTarget)) setValidate(true)
  }} onKeyDown={e => {
    if (e.key === 'Escape' && isOpen) { e.preventDefault(); close() }
  }}>
    <Field id={id} label={label} meta={isOpen && <>
      <button type="button" className="neui-pill" aria-expanded={true} aria-label="Свернуть календарь"
        aria-controls={id + '-assistant'} onClick={close}>Свернуть</button>{action}
    </>}>
      <div ref={entry} className="neui-row neui-date-entry">
        <span aria-hidden="true" className="neuicon-calendar neui-row-area-leading place-self-center" />
        <div className="neui-date-segments neui-row-area-content">
          {calendar.pattern.map(({ type, value }, i) => {
            if (type === 'literal') return <Fragment key={i}>{value}</Fragment>
            const key = type as CalendarPart
            return <button key={key} type="button" data-segment={key} className="neui-date-segment neui-ripple"
              aria-expanded={isOpen && part === key} aria-controls={id + '-assistant'}
              aria-label={partNames[key] + ', ' + (draft[key] || 'выбрать')}
              aria-invalid={error && (invalid === key || missing.includes(key)) ? true : undefined}
              aria-describedby={error ? id + '-error' : undefined} onKeyDown={e => keys(e, key)}
              onBlur={() => {
                const raw = buffer.current.key === key ? buffer.current.text : ''
                buffer.current.text = ''
                if (key !== 'year' && /^[1-9]$/.test(raw)) calendar.edit(key, raw.padStart(2, '0'))
              }}
              onClick={() => isOpen && key === part ? close() : open(key)}>{draft[key] || masks[key]}</button>
          })}
        </div>
        {!isOpen && action}
      </div>
      {error && <p id={id + '-error'} className="neui-note neui-error" role="status">{error}</p>}
      <Reveal.Group open={isOpen} followViewport id={id + '-assistant'} onCollapsed={() => setVisited(false)}>
        <CalendarPanel calendar={calendar} panelRef={panel} mounted={visited}>
          {!present && <p className="neui-note">Без даты отправка начнётся с ближайшего выпуска.</p>}
        </CalendarPanel>
      </Reveal.Group>
      <input type="hidden" name={name} disabled={!calendar.value} value={calendar.value ?? ''} />
    </Field>
  </div>
}
