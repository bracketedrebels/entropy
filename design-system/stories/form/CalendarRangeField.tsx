import { useRef, useState } from 'react'
import { useCalendarRange, useRevealGroup } from '@neui/kit/react'
import type { CalendarPart, CalendarRangeOptions, RangeEndpoint } from '@neui/kit/react'
import { Field } from '../../recipes/Field'
import { CalendarPanel, endpointNames } from './CalendarPanel'
import { DateSegments, segmentValidation } from './DateSegments'

const bounds = ['start', 'end'] as const

export function CalendarRangeField({ id, name, label, ...options }: CalendarRangeOptions & {
  id: string; name: string; label: string
}) {
  const picker = useCalendarRange(options)
  const { calendar, endpoints, endpoint } = picker
  const group = useRevealGroup(calendar.isOpen, { followViewport: true })
  const entry = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [validate, setValidate] = useState(false)
  const present = bounds.some(key => Object.values(options.draft[key]).some(Boolean))
  const validation = { start: segmentValidation(endpoints.start, validate), end: segmentValidation(endpoints.end, validate) }
  const reversed = !!endpoints.start.value && !!endpoints.end.value && endpoints.start.value > endpoints.end.value
  const missing = bounds.find(key => !endpoints[key].value)
  const errors = bounds.filter(key => validation[key].error)
  const error = reversed ? 'Конец периода должен совпадать с началом или быть позже.'
    : errors.length ? errors.map(key => endpointNames[key] + '. ' + validation[key].error).join(' ')
    : validate && present && missing ? (missing === 'end' ? 'Выберите конец периода.' : 'Выберите начало периода.') : ''
  function focus(key: RangeEndpoint, part: CalendarPart = 'day') {
    entry.current?.querySelector<HTMLElement>('[data-endpoint-entry="' + key + '"] [data-segment="' + part + '"]')?.focus({ preventScroll: true })
  }
  function close() {
    calendar.close()
    setValidate(true)
    focus(endpoint, calendar.part)
  }
  return <div className="neui-date-field" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setValidate(true)
  }} onKeyDown={event => {
    if (event.key === 'Escape' && calendar.isOpen) { event.preventDefault(); close() }
  }}>
    <Field id={id} label={label} meta={(calendar.isOpen || present || picker.canUndo) && <>
      {calendar.isOpen && <button type="button" className="neui-pill" aria-expanded="true" aria-controls={id + '-assistant'}
        aria-label="Свернуть календарь периода" onClick={close}>Свернуть</button>}
      {(present || picker.canUndo) && <button type="button" className="neui-pill"
        aria-label={picker.canUndo ? 'Вернуть период' : 'Сбросить период'} onClick={() => {
          if (picker.canUndo) picker.undo()
          else picker.reset()
          setValidate(false)
          focus('start')
        }}>{picker.canUndo ? 'Вернуть' : 'Сбросить'}</button>}
    </>}>
      <div ref={entry} className="neui-row neui-date-entry">
        <span aria-hidden="true" className="neuicon-calendar neui-row-area-leading place-self-center" />
        <div className="neui-date-pair neui-row-area-content">
          {bounds.map(key => <div key={key} className="neui-date-bound">
            {key === 'end' && <span aria-hidden="true" className="neui-date-separator">—</span>}
            <DateSegments id={id} endpoint={key} calendar={endpoints[key]} panelRef={panel}
              validation={validation[key]} errorId={error ? id + '-error' : undefined}
              focusEndpoint={focus} open={part => { endpoints[key].open(part) }} close={close} />
          </div>)}
        </div>
      </div>
      {error && <p id={id + '-error'} className="neui-note neui-error" role="status">{error}</p>}
      <div ref={group} id={id + '-assistant'}>
        {calendar.isOpen && <div className="neui-collapse-block">
          <CalendarPanel calendar={calendar} range={picker.range} panelRef={panel} />
        </div>}
      </div>
      {bounds.map(key => <input key={key} type="hidden" name={name + '.' + key} disabled={!picker.value}
        value={picker.value?.[key] ?? ''} />)}
    </Field>
  </div>
}
