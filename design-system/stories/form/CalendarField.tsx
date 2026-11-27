import { useRef, useState } from 'react'
import type { Locale } from 'date-fns'
import { useCalendar, useRevealGroup } from '@neui/kit/react'
import type { CalendarDraft, CalendarPart } from '@neui/kit/react'
import { Field } from '../../recipes/Field'
import { CalendarPanel } from './CalendarPanel'
import { DateSegments, segmentValidation } from './DateSegments'

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
  const group = useRevealGroup(isOpen, { followViewport: true })
  const [validate, setValidate] = useState(false)
  const entry = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const present = Object.values(draft).some(Boolean)
  const validation = segmentValidation(calendar, validate)
  const { error } = validation
  const focus = (key: CalendarPart) => entry.current?.querySelector<HTMLElement>('[data-segment="' + key + '"]')?.focus({ preventScroll: true })
  function open(key: CalendarPart) { calendar.open(key) }
  function close() { calendar.close(); setValidate(true); focus(part) }
  const action = (present || calendar.canUndo) && <button type="button" className="neui-pill"
    aria-label={(calendar.canUndo ? 'Вернуть' : 'Сбросить') + ' дату'} onClick={() => {
      if (calendar.canUndo) calendar.undo()
      else calendar.reset()
      setValidate(false)
      focus('day')
    }}>{calendar.canUndo ? 'Вернуть' : 'Сбросить'}</button>
  return <div className="neui-date-field" onBlur={e => {
    if (!e.currentTarget.contains(e.relatedTarget)) setValidate(true)
  }} onKeyDown={e => {
    if (e.key === 'Escape' && isOpen) { e.preventDefault(); close() }
  }}>
    <Field id={id} label={label} meta={isOpen && <>
      <button type="button" className="neui-pill" aria-expanded={true} aria-label="Свернуть календарь"
        aria-controls={id + '-assistant'} onClick={close}>Свернуть</button>
      {action && <span className="neui-collapse-inline"><span className="neui-reveal-clip">{action}</span></span>}
    </>}>
      <div ref={entry} className="neui-row neui-date-entry">
        <span aria-hidden="true" className="neuicon-calendar neui-row-area-leading place-self-center" />
        <DateSegments calendar={calendar} id={id} panelRef={panel} open={open} close={close}
          validation={validation} errorId={error ? id + '-error' : undefined} />
        {!isOpen && action && <span className="neui-collapse-inline neui-date-action">
          <span className="neui-reveal-clip">{action}</span>
        </span>}
      </div>
      {error && <div className="neui-collapse-block"><div className="neui-reveal-clip">
        <p id={id + '-error'} className="neui-note neui-error" role="status">{error}</p>
      </div></div>}
      <div ref={group} id={id + '-assistant'}>
        {calendar.isOpen && <div className="neui-collapse-block">
          <CalendarPanel calendar={calendar} panelRef={panel}>
            {!present && <div className="neui-collapse-block">
              <div className="neui-reveal-clip"><p className="neui-note">Без даты отправка начнётся с ближайшего выпуска.</p></div>
            </div>}
          </CalendarPanel>
        </div>}
      </div>
      <input type="hidden" name={name} disabled={!calendar.value} value={calendar.value ?? ''} />
    </Field>
  </div>
}
