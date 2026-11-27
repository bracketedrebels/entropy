import{j as r,r as t}from"./iframe-jnNrxMJ8.js";import{c as d,C as c,r as l,e as o,a as p}from"./CalendarField-Cp0YAt_n.js";import"./preload-helper-PPVm8Dsz.js";import"./presence-BcgZgrm1.js";import"./mini-PomufWgy.js";import"./Field-Cc630tkK.js";import"./Ridge-BgGbeQ1Z.js";const u=`import { useRef, useState } from 'react'
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
      {calendar.isOpen && <span className="neui-collapse-inline">
        <span className="neui-reveal-clip">
          <button type="button" className="neui-pill" aria-expanded="true" aria-controls={id + '-assistant'}
            aria-label="Свернуть календарь периода" onClick={close}>Свернуть</button>
        </span>
      </span>}
      {(present || picker.canUndo) && <span className="neui-collapse-inline">
        <span className="neui-reveal-clip">
          <button type="button" className="neui-pill" aria-label={picker.canUndo ? 'Вернуть период' : 'Сбросить период'}
            onClick={() => {
              if (picker.canUndo) picker.undo()
              else picker.reset()
              setValidate(false)
              focus('start')
            }}>{picker.canUndo ? 'Вернуть' : 'Сбросить'}</button>
        </span>
      </span>}
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
      {error && <div className="neui-collapse-block"><div className="neui-reveal-clip">
        <p id={id + '-error'} className="neui-note neui-error" role="status">{error}</p>
      </div></div>}
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
`,m=`import { useRef, useState } from 'react'
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
`;function v({language:e}){const[s,i]=t.useState(()=>d("2024-02-29"));return r.jsx(c,{id:t.useId(),name:"date",label:"Дата первой сводки",draft:s,onChange:i,locale:e==="ru"?l:o})}const D={id:"neui-calendar",title:"Примитивы/Calendar",component:v,args:{language:"ru"},argTypes:{language:{control:"select",options:["ru","en-US"]}},tags:["autodocs"],parameters:{docs:{source:{code:m},description:{component:"Выберите сегмент даты. Локаль задаёт порядок частей, названия месяцев и начало недели. Дни листаются по месяцам, месяцы — по годам, годы — по 35 лет за раз."}}}},a={name:"Выбор даты"};function f({language:e}){const[s,i]=t.useState({start:{},end:{}});return r.jsx("div",{className:"neui-example",children:r.jsx(p,{id:t.useId(),name:"period",label:"Период событий",draft:s,onChange:i,locale:e==="ru"?l:o})})}const n={name:"Диапазон дат",render:e=>r.jsx(f,{...e}),parameters:{docs:{source:{code:u}}}},S=["DatePicker","DateRange"];a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: 'Выбор даты'
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: 'Диапазон дат',
  render: args => <RangeExample {...args} />,
  parameters: {
    docs: {
      source: {
        code: rangeSource
      }
    }
  }
}`,...n.parameters?.docs?.source}}};export{a as DatePicker,n as DateRange,S as __namedExportsOrder,D as default};
