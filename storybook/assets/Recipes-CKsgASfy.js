import{r as m,a as Kt,j as r,p as O,I as Ut,C as zt,b as Xt}from"./index-DrYyIryX.js";const Qt=`import { useId, useState } from 'react'
import { calendarDraft } from '@neui/kit/react'
import { CalendarField } from '../../stories/form/CalendarField'

export default function DateDemo() {
  const [draft, setDraft] = useState(() => calendarDraft('2026-11-26'))
  return <CalendarField id={useId()} name="date" label="Дата первой сводки"
    draft={draft} onChange={setDraft} />
}
`,Jt=`import { useId, useState } from 'react'
import type { CalendarRangeDraft } from '@neui/kit/react'
import { CalendarRangeField } from '../../stories/form/CalendarRangeField'

export default function PeriodDemo() {
  const [draft, setDraft] = useState<CalendarRangeDraft>({ start: {}, end: {} })
  return <CalendarRangeField id={useId()} name="period" label="Период событий"
    draft={draft} onChange={setDraft} />
}
`,Zt=`import { useId, useState } from 'react'
import { ChoicePicker } from '../../stories/form/ChoicePicker'
import { projects } from '../../stories/form/options'

export default function ProjectsDemo() {
  const [selected, setSelected] = useState([projects[0][0]])
  return <ChoicePicker id={useId()} name="projects" label="Проекты в сводке" multiple
    options={projects} selected={selected} searchLabel="Поиск проектов"
    emptyLabel="Выбрать проекты" onChange={setSelected} />
}
`,en=`import { useState } from 'react'

const projects = [
  { id:'core', name:'Ядро', channels:3 },
  { id:'design', name:'Дизайн-система', channels:2 },
  { id:'search', name:'Поиск', channels:1 },
]

export default function TableDemo() {
  const [selected, setSelected] = useState(['design'])
  return <section className="neui-ridge neui-track-focus">
    <span slot="label">Проекты в сводке</span>
    <table className="w-full text-left">
      <caption className="sr-only">Каналы и выбранные проекты</caption>
      <thead className="text-sm text-muted"><tr><th scope="col">Проект</th><th scope="col">Каналы</th></tr></thead>
      <tbody>{projects.map(p => <tr key={p.id}>
        <th scope="row"><label className="neui-row neui-ripple cursor-pointer">
          <input type="checkbox" className="neui-row-area-leading neui-check-box appearance-none checked:[--neui-check-level:1]"
            checked={selected.includes(p.id)} onChange={e => setSelected(e.target.checked
              ? [...selected, p.id] : selected.filter(id => id !== p.id))} />
          <span className="neui-row-area-content">{p.name}</span>
        </label></th>
        <td>{p.channels}</td>
      </tr>)}</tbody>
    </table>
    <output slot="meta" className="neui-pill">Выбрано {selected.length} из {projects.length}</output>
  </section>
}
`,tn=`import { useId, useState } from 'react'
import { TagField } from '../../stories/form/TagField'

export default function TagsDemo() {
  const [tags, setTags] = useState(['potential', 'frequently_used'])
  const [draft, setDraft] = useState('')
  return <TagField id={useId()} name="tags" label="Теги сводки"
    tags={tags} draft={draft} onChange={(values, text) => { setTags(values); setDraft(text) }} />
}
`,nn=`import type { ReactNode } from 'react'
import { Ridge } from './Ridge'
import type { RidgeProps } from './Ridge'

export interface FieldProps extends RidgeProps {
  id: string
  description?: ReactNode
  error?: ReactNode
}

export function Field({ frame: Frame = Ridge, id, label, header, meta, description, error, children }: FieldProps & { frame?: typeof Ridge }) {
  const descriptionIds = [description && id + '-description', error && id + '-error'].filter(Boolean).join(' ') || undefined
  return <Frame id={id} label={label} header={header} meta={meta}>
    <fieldset className="neui-group" aria-labelledby={id + '-label'} aria-describedby={descriptionIds}>
      {children}
      {description && <div className="neui-collapse-block"><div className="neui-reveal-clip">
        <p id={id + '-description'} className="neui-note">{description}</p>
      </div></div>}
      {error && <div className="neui-collapse-block"><div className="neui-reveal-clip">
        <p id={id + '-error'} className="neui-note neui-error" role="status">{error}</p>
      </div></div>}
    </fieldset>
  </Frame>
}
`,an=`import { Field as FieldRecipe, type FieldProps } from './Field'
import { Ridge } from './LegacyRidge'

export function Field(props: FieldProps) {
  return <FieldRecipe {...props} frame={Ridge} />
}
`,rn=`import { useRidge } from '@neui/kit/react'
import type { RidgeProps } from './Ridge'

// Decorative SVG belongs to this recipe. The hook measures and updates the marked parts.
function Groove({ id, part }: { id: string; part: string }) {
  const mask = id + '-' + part + '-mask'
  const gradient = id + '-' + part + '-light'
  return <svg className={'neui-groove neui-' + part} aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="var(--neui-halo)" stopOpacity="0" />
        <stop offset=".3" stopColor="var(--neui-halo)" stopOpacity=".65" />
        <stop offset=".5" stopColor="var(--neui-core)" />
        <stop offset=".7" stopColor="var(--neui-halo)" stopOpacity=".65" />
        <stop offset="1" stopColor="var(--neui-halo)" stopOpacity="0" />
      </linearGradient>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="110%">
        <path fill="none" stroke="white" strokeWidth="2" />
      </mask>
    </defs>
    <path className="neui-cut" transform="translate(-.35 -.55)" />
    <path className="neui-lip" transform="translate(.35 .65)" />
    <path className="neui-floor" />
    <g mask={'url(#' + mask + ')'}><g className="neui-texture">
      <rect width="100%" className="neui-light" fill={'url(#' + gradient + ')'} />
    </g></g>
  </svg>
}

export function Ridge({ id, label, header, meta, children }: RidgeProps) {
  const shell = useRidge()
  return <div id={id} className="neui-ridge" ref={shell}>
    <div className="neui-top-track"><div className="neui-head">
      <Groove id={id} part="upper" />
      <span id={id + '-label'} className="neui-caption">{label}<i aria-hidden="true" className="neui-baseline" /></span>
      <div className="neui-header-slot">{header}</div>
    </div></div>
    <div className="neui-aperture"><div className="neui-top-clip"><div className="neui-bottom-clip"><div className="neui-ink">
      <div className="neui-body">{children}</div><div className="neui-rails"><Groove id={id} part="walls" /></div>
    </div></div></div></div>
    <div className="neui-bottom-track"><div className="neui-foot"><Groove id={id} part="base" />
      <div className="neui-meta">{meta}</div>
    </div></div>
  </div>
}
`,sn=`import { createContext, useContext, useLayoutEffect, useRef } from 'react'
import { presence } from '@neui/kit/presence'
import type { ReactNode, RefObject } from 'react'
import { useRevealGroup } from '@neui/kit/react'

export interface RevealProps {
  open: boolean
  axis?: 'block' | 'inline'
  id?: string
  collapsed?: ReactNode
  children: ReactNode
  /** Receives focus if the panel being hidden contains the active element. */
  returnFocusRef?: RefObject<HTMLElement>
  /** Scroll only as far as the top of the containing field on explicit expansion. */
  followViewport?: boolean
}

// Existing recipe callers can update disabled/checked props while their row exits.
const Content = createContext<ReactNode>(null)
function CurrentContent() { return <>{useContext(Content)}</> }

function Item({ open, axis, children, returnFocusRef }: Pick<RevealProps, 'open' | 'axis' | 'children' | 'returnFocusRef'>) {
  const ownedFocus = useRef(false)
  useLayoutEffect(() => {
    if (!open && ownedFocus.current) {
      returnFocusRef?.current?.focus({ preventScroll: true })
      ownedFocus.current = false
    }
  }, [open, returnFocusRef])
  return <Content.Provider value={children}>{presence(open && <div
    data-open={true} className={axis === 'inline' ? 'neui-reveal neui-reveal-inline neui-collapse-inline' : 'neui-reveal neui-collapse-block'}
    onFocusCapture={() => { ownedFocus.current = true }}
    onBlurCapture={event => { ownedFocus.current = event.currentTarget.contains(event.relatedTarget) }}>
    <div className="neui-reveal-clip"><CurrentContent /></div>
  </div>)}</Content.Provider>
}

/** Follow one explicit expansion, even when several sibling items change height. */
type GroupProps = Pick<RevealProps, 'open' | 'id' | 'children' | 'followViewport'> & {
  /** Runs after an uninterrupted close, immediately when motion is reduced. */
  onCollapsed?: () => void
}

function Group({ open, id, children, followViewport = false, onCollapsed }: GroupProps) {
  const host = useRevealGroup(open, { followViewport, onCollapsed })
  return <div id={id} ref={host}>{children}</div>
}

/** Controlled in-flow disclosure. Drafts and selection belong to the caller. */
export function Reveal({ open, axis, id, collapsed, children, returnFocusRef, followViewport }: RevealProps) {
  return <Group id={id} open={open} followViewport={followViewport}>
    {collapsed != null && <Item axis={axis} open={!open} returnFocusRef={returnFocusRef}>{collapsed}</Item>}
    <Item axis={axis} open={open} returnFocusRef={returnFocusRef}>{children}</Item>
  </Group>
}

Reveal.Group = Group
Reveal.Item = Item
`,on=`import type { ReactNode } from 'react'

export interface RidgeProps {
  /** Unique HTML id, also used by the label. */
  id: string
  label: ReactNode
  header?: ReactNode
  meta?: ReactNode
  children: ReactNode
}

/** This recipe owns the semantic content. The same classes and slots work in plain HTML. */
export function Ridge({ id, label, header, meta, children }: RidgeProps) {
  return <div id={id} className="neui-ridge neui-track-focus">
    <span slot="label" id={id + '-label'}>{label}</span>
    {header && <div slot="header">{header}</div>}
    {children}
    {meta && <div slot="meta" className="neui-collapse-block neui-meta-panel">
      <div className="neui-reveal-clip neui-meta-actions">{meta}</div>
    </div>}
  </div>
}
`,ln=`.neui-canvas { min-height:100svh; padding:clamp(20px, 5vw, 56px) clamp(18px, 5vw, 40px) }
.docs-story .neui-canvas { min-height:200px }
.neui-example { width:min(100%, 430px); margin-inline:auto }
.neui-example h1 { margin:0 0 26px; font-size:clamp(1.6rem, 5vw, 2rem); line-height:1.2; font-weight:300; letter-spacing:-.025em }
.neui-example .neui-ridge + .neui-ridge { margin-top:30px }
.neui-choice { min-height:var(--neui-choice-height); border-radius:var(--neui-choice-radius) }
.neui-ridge:has(.neui-choice) { --neui-row-radius:var(--neui-choice-radius) }
.neui-option { position:absolute; width:1px; height:1px; opacity:0 }
.neui-chev { display:inline-block; margin-inline-start:6px; vertical-align:-2px; transition:transform .2s }
.neui-chev[data-open=true] { transform:rotate(180deg) }
.neui-after { color:var(--neui-muted); margin:18px 0 0 }
.neui-edit { display:block; padding:0; overflow:hidden }
.neui-edit .neui-row-leading { position:absolute; inset-inline-start:6px; top:17px; pointer-events:none }
.neui-edit .neui-row-copy { display:block }
.neui-editor,.neui-caret-mirror { min-height:var(--neui-hit); margin:0; padding:12px 15px 12px 6px; width:100%;
  font:inherit; line-height:24px; letter-spacing:inherit; text-indent:28px; color:inherit; background:transparent;
  white-space:pre-wrap; overflow-wrap:anywhere; border:0; outline:none; display:block; resize:none; overflow:hidden }
.neui-caret-mirror { visibility:hidden; pointer-events:none; position:absolute; inset:0 0 auto; }
.neui-editor::placeholder { color:var(--neui-muted) }
.neui-count { color:color-mix(in srgb,var(--neui-muted), var(--neui-danger) var(--urgency,0%)) }
.neui-example .neui-field-input { font:inherit; width:100%; color:inherit; border:0; background:transparent; margin:0; outline:none }
.neui-example .neui-field-input::placeholder { color:var(--neui-muted) }
@media(prefers-reduced-motion:reduce) { .neui-chev { transition:none } }


.neui-settings > .neui-ridge:not(:first-child) { margin-top:30px }
.neui-conditional-field { padding-top:30px }
.neui-catalog { position:relative; overflow:clip; overflow-anchor:none; --neui-project-height:4rem }
/* The first viewport resizes in flow. Extra offscreen space is released immediately
   on shrink and becomes available once expansion reaches the viewport. */
.neui-catalog {
  --catalog-height:calc(var(--neui-catalog-rows) * var(--neui-project-height));
  --catalog-window:calc(100dvh + 2 * var(--neui-project-height));
  --catalog-tail:max(0px, var(--catalog-height) - var(--catalog-window));
}
.neui-catalog-window {
  height:min(var(--catalog-height),var(--catalog-window));
  transition:height var(--neui-disclosure-duration,240ms) var(--neui-disclosure-ease,ease-in-out);
}
.neui-catalog::after {
  content:""; display:block; height:var(--catalog-tail); max-height:var(--catalog-tail);
  transition:max-height var(--neui-disclosure-duration,240ms) step-end;
}
@media(prefers-reduced-motion:reduce) { .neui-catalog-window,.neui-catalog::after { transition:none } }
.neui-catalog-row { position:absolute; inset-inline:0; top:0 }
.neui-catalog .neui-choice,.neui-pitch { height:var(--neui-project-height); min-height:0 }
.neui-pitch { position:absolute; width:1px; visibility:hidden; pointer-events:none }
.neui-entry { cursor:text }
.neui-entry .neui-row-trailing:empty { display:none }
.neui-field-input[type=search] { appearance:none }
.neui-field-input[type=search]::-webkit-search-cancel-button { appearance:none }
.neui-clear { display:grid; place-items:center; width:44px; height:44px; border:0; border-radius:50%; color:inherit; background:transparent; cursor:pointer }
.neui-entry:has(input[type=search]) { padding-block:0 }
.neui-editor[readonly] { color:var(--neui-muted) }
.neui-settings .neui-option { scroll-margin-block:100px 64px }

.neui-settings > .neui-date-field { margin-top:30px }
.neui-date-entry { grid-template-columns:6px minmax(0,1fr) auto; column-gap:12px; padding-block:0 }
.neui-date-segments { display:flex; align-items:center; width:max-content; font-variant-numeric:tabular-nums }
.neui-date-action { grid-area:trailing }
.neui-meta-actions .neui-pill, .neui-date-action .neui-pill { white-space:nowrap }
.neui-date-cell,.neui-date-page,.neui-date-segment {
  position:relative; isolation:isolate; border:0; color:inherit;
  font:inherit; cursor:pointer; padding:2px; min-width:0; min-height:44px;
}
.neui-date-segment,.neui-date-page,.neui-date-cell:not([data-in-range=true]) { border-radius:999px; background:transparent }
.neui-date-segment { padding-inline:4px }
.neui-date-segment[aria-expanded=true] { background:var(--neui-pill-bg) }
.neui-date-segment[aria-invalid=true] { text-decoration:underline dotted var(--neui-danger) }
.neui-date-viewport { overflow:clip; transition:height 240ms ease-in-out }
.neui-date-stack { position:relative }
.neui-date-content { display:flow-root }
.neui-date-screen[data-direction="0"] { position:relative }
.neui-date-screen { position:absolute; inset:0 0 auto; transition:transform 240ms ease-out,visibility 0s; font-variant-numeric:tabular-nums }
.neui-date-screen[data-direction="-1"],.neui-date-screen[data-direction="1"] { visibility:hidden; transition-delay:0s,240ms }
.neui-date-screen[data-direction="-1"] { transform:translateX(-100%) }
.neui-date-screen[data-direction="1"] { transform:translateX(100%) }
.neui-date-nav { display:grid; grid-template-columns:minmax(0,1fr) 44px 44px; align-items:center; color:var(--neui-muted) }
.neui-date-field { --neui-date-caption-start: 5px }
.neui-date-nav small, .neui-date-field .neui-note { padding-inline-start:var(--neui-date-caption-start,5px) }
.neui-date-page { font-size:1.4rem }
.neui-date-page:disabled { opacity:.35 }
.neui-date-week { text-align:center; font-size:.8125rem; color:var(--neui-muted) }
.neui-date-cell { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; line-height:1.2 }
.neui-date-cell[aria-checked=true] { --neui-check-level:1 }
.neui-date-cell[aria-current=date] > :first-child { text-decoration:underline; text-underline-offset:3px }
.neui-calendar-pager { position:relative; display:grid; grid-auto-columns:100%; overflow-x:auto; scroll-snap-type:x mandatory; overscroll-behavior-x:contain; scrollbar-width:none; overflow-anchor:none }
.neui-calendar-pager > * { grid-row:1; scroll-snap-align:start; scroll-snap-stop:always; align-content:start; grid-auto-rows:minmax(44px,auto) }
@media(prefers-reduced-motion:reduce) { .neui-date-screen,.neui-date-viewport { transition:none } }
.neui-date-week [data-weekend] { font-style:italic }
.neui-calendar-pager { user-select:none }
.neui-calendar-pager[data-dragging] { scroll-snap-type:none; cursor:grabbing }

.neui-step-actions { display:flex; flex-wrap:wrap; gap:0 4px; padding-inline:8px }
.neui-step-actions :disabled { opacity:.45; cursor:default }
.neui-scale-example { padding:0 12px 4px }
.neui-scale-example > input { display:block }
.neui-scale-example .neui-range-ticks { margin-block-start:-12px }
.neui-scale-labels { display:flex; justify-content:space-between; margin-top:4px; color:var(--neui-muted); font-size:.875rem; font-variant-numeric:tabular-nums }
.neui-number-entry { display:flex; align-items:center }
.neui-number-entry > label { flex:1; min-width:0; padding-block:0 }
.neui-number-entry .neui-pill { margin-inline-start:var(--neui-inset,11px); white-space:nowrap; max-inline-size:none }
.neui-quantity { display:flex; align-items:baseline; gap:.3em; min-width:0; font-variant-numeric:tabular-nums }
.neui-quantity-value { position:relative; min-width:1ch; padding-inline-end:1px; overflow:hidden }
.neui-quantity-value > span { visibility:hidden; white-space:pre }
.neui-quantity-value > input { position:absolute; inset:0; padding:0; min-width:0; font-variant-numeric:inherit }

.neui-date-entry > .neui-date-segments { grid-area:content }
.neui-date-pair { display:flex; flex-wrap:wrap; align-items:center; gap:0 .3em; font-variant-numeric:tabular-nums }
.neui-date-bound { display:inline-flex; align-items:center; gap:.3em }
.neui-date-pair .neui-date-segment { padding-inline:.12em }
.neui-date-separator { color:var(--neui-muted) }
.neui-date-cell[data-endpoint] { --neui-check-level:1 }
.neui-date-cell:disabled { opacity:.38; cursor:default }
`,cn=`import { useId, useState } from 'react'

export function RangeExample() {
  const id = useId()
  const [value, setValue] = useState(0.5)
  return <div className="neui-example">
    <div className="neui-ridge neui-track-focus" id={id}>
      <label slot="label" htmlFor={id + '-value'}>Громкость сигнала</label>
      <div className="neui-scale-example">
        <input id={id + '-value'} className="neui-range" type="range" min="0" max="1" step="0.25" value={value}
          aria-valuetext={Math.round(value * 100) + '%'} onChange={event => setValue(event.currentTarget.valueAsNumber)} />
        <div className="neui-range-ticks" aria-hidden="true">
          {[0, 0.25, 0.5, 0.75, 1].map(tick => <i key={tick} />)}
        </div>
        <div className="neui-scale-labels" aria-hidden="true"><span>0%</span><span>100%</span></div>
      </div>
      <output slot="meta" className="neui-pill" htmlFor={id + '-value'}>{Math.round(value * 100)}%</output>
    </div>
  </div>
}
`,un=`import { useRef, useState } from 'react'
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
`,dn=`import { useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent, MutableRefObject, ReactNode, RefObject } from 'react'
import { useCalendarDrag } from './useCalendarDrag'
import { calendarValue, useCalendarGrid } from '@neui/kit/react'
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

export function CalendarPanel({ calendar, panelRef, children, range }: {
  calendar: Calendar; panelRef: RefObject<HTMLDivElement>; children?: ReactNode; range?: CalendarRangeContext
}) {
  const focusNext = useRef(false)
  const viewport = useRef<HTMLDivElement>(null)
  // The outer grid handles entry/exit. Inner pages also change height when switching level.
  useLayoutEffect(() => {
    const content = panelRef.current, box = viewport.current
    if (!content || !box) return
    const size = () => { box.style.height = content.offsetHeight + 'px' }
    size()
    const observer = new ResizeObserver(size)
    observer.observe(content)
    return () => observer.disconnect()
  }, [panelRef])
  return <div className="neui-reveal-clip">
    <div ref={viewport} className="neui-date-viewport">
      <div className="neui-date-content" ref={panelRef}>
        {children}
        <div className="neui-date-stack">
          {levels.map(part => <CalendarScreen key={part} part={part} range={range} calendar={calendar} focusNext={focusNext} />)}
        </div>
      </div>
    </div>
  </div>
}
`,pn=`import { useRef, useState } from 'react'
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
`,mn=`import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode, RefObject } from 'react'
import { scrollContainer } from '../../src/reveal/followExpansion'
import { Field } from '../../recipes/Field'
import { Reveal } from '../../recipes/Reveal'
import { Mark, OptionRow } from './OptionRow'
import type { Option } from './options'
import { useChoiceWindow } from './useChoiceWindow'

const fold = (s: string) => s.trim().toLocaleLowerCase('ru').replaceAll('ё', 'е')
const plural = new Intl.PluralRules('ru')
const forms: Record<string, string> = { one: 'вариант', few: 'варианта' }

interface ChoicePickerProps {
  id: string
  name: string
  label: string
  actionLabel?: string
  options: readonly Option[]
  selected: readonly string[]
  multiple?: boolean
  emptyLabel: string
  searchLabel?: string
  description?: string
  recovery?: ReactNode
  triggerRef?: RefObject<HTMLButtonElement>
  onChange: (selected: string[]) => void
}

export function ChoicePicker({ id, name, label, actionLabel = label, options, selected, multiple = false,
  emptyLabel, searchLabel, description, recovery, triggerRef, onChange }: ChoicePickerProps) {
  const [open, setOpen] = useState(false)
  const [settled, setSettled] = useState(true)
  const [session, setSession] = useState(options)
  const [query, setQuery] = useState('')
  const [focusKey, setFocusKey] = useState<string | null>(null)
  const nextFocus = useRef<string | null>(null)
  const search = useRef<HTMLInputElement>(null)
  const localTrigger = useRef<HTMLButtonElement>(null)
  const trigger = triggerRef ?? localTrigger
  const optionsId = id + '-options'
  const searchable = options.length > 6
  const windowed = options.length > 40
  const catalog = useMemo(() => new Map(options.map(option => [option[0], option])), [options])
  const chosen = selected.map(key => catalog.get(key)).filter((option): option is Option => option !== undefined)
  const preview = chosen.length > 2 ? chosen.slice(0, 1) : chosen
  const order = settled ? [...chosen, ...options.filter(([key]) => !selected.includes(key))] : session
  const terms = fold(query).split(/\\s+/).filter(Boolean)
  const matches = open && terms.length
    ? order.filter(([, title, detail]) => terms.every(term => fold(title + ' ' + (detail ?? '')).includes(term))) : order
  const { list, probe, range } = useChoiceWindow(windowed, open, matches.length)
  const rowCount = open ? matches.length : multiple ? preview.length : 1
  function filter(value: string) {
    returnToStart()
    setQuery(value)
  }
  const total = options.length + ' ' + (forms[plural.select(options.length)] ?? 'вариантов')
  const caption = open && multiple ? 'Выбрано ' + chosen.length + ' из ' + options.length
    : !open && chosen.length > 2 ? 'Ещё ' + (chosen.length - 1) + ' из ' + options.length + ' вариантов' : total

  useLayoutEffect(() => {
    const target = nextFocus.current
    if (!open || !target) return
    nextFocus.current = null
    if (target === 'search') search.current?.focus({ preventScroll: true })
    else document.getElementById(id + '-' + target)?.focus({ preventScroll: true })
  }, [id, open, focusKey])

  function expand(target?: string) {
    if (settled) setSession(order)
    nextFocus.current = target ?? null
    setFocusKey(target ?? null)
    setSettled(false)
    setOpen(true)
  }
  function returnToStart() {
    const field = document.getElementById(id)
    if (!field) return
    const top = scrollContainer(field)?.getBoundingClientRect().top ?? 0
    if (field.getBoundingClientRect().top < top) field.scrollIntoView({ block: 'start', behavior: 'instant' })
  }
  function close() {
    trigger.current?.focus({ preventScroll: true })
    if (windowed) returnToStart()
    setOpen(false)
    setQuery('')
  }
  function choose(key: string) {
    if (!multiple) { onChange([key]); return }
    const next = new Set(selected)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onChange(order.map(([value]) => value).filter(value => next.has(value)))
  }
  function focusOption(index: number) {
    const key = matches[index]?.[0]
    if (!key) return
    const pitch = probe.current?.getBoundingClientRect().height ?? 0
    if (windowed && list.current && pitch) {
      const top = list.current.getBoundingClientRect().top + index * pitch
      const container = scrollContainer(list.current)
      const viewport = container?.getBoundingClientRect()
      const scroller = container ?? window
      const ceiling = Math.max(viewport?.top ?? 0, search.current?.closest('[slot="header"]')?.getBoundingClientRect().bottom ?? 0)
      const floor = Math.min(viewport?.bottom ?? window.innerHeight, trigger.current?.getBoundingClientRect().top ?? window.innerHeight)
      if (top < ceiling) scroller.scrollBy(0, top - ceiling)
      else if (top + pitch > floor) scroller.scrollBy(0, top + pitch - floor)
    }
    const element = document.getElementById(id + '-' + key)
    if (element) element.focus({ preventScroll: windowed })
    else nextFocus.current = key
    setFocusKey(key)
  }
  function navigate(event: KeyboardEvent, index: number) {
    if (event.key === 'Escape') { event.preventDefault(); close(); return }
    if (!open || !windowed) return
    const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1
      : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0
    let target = index + delta
    if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = matches.length - 1
    else if (event.key === 'Tab' && multiple) target = index + (event.shiftKey ? -1 : 1)
    else if (!delta) return
    if (target < 0 || target >= matches.length) return
    event.preventDefault()
    focusOption(target)
    if (!multiple && delta) choose(matches[target][0])
  }

  // Keep the summary and the focused input mounted even outside the overscan window.
  const rows: ReactNode[] = []
  const visibleControls = new Set<string>()
  function optionRow(option: Option, index: number) {
    const key = option[0]
    if (open && !multiple) visibleControls.add(key)
    return <div onKeyDown={event => navigate(event, index)} onFocus={() => { if (windowed && open) setFocusKey(key) }}>
      <OptionRow id={id + '-' + key} name={name} option={option} multiple={multiple} selected={selected.includes(key)}
        onChoose={() => choose(key)} disclosure={open ? undefined : { controls: optionsId, expand: () => expand(key) }} />
    </div>
  }
  // A single-value summary owns one row of permanent height, even when its value is empty.
  // On expansion the first result occupies that slot; only the remaining rows unfold.
  if (!multiple) {
    const value = chosen[0]
    rows.push(<div key="single-summary" className={windowed ? 'neui-catalog-row' : undefined}>
      {open ? matches[0] && optionRow(matches[0], 0) :
        <button type="button" className="neui-row neui-ripple neui-choice" aria-controls={optionsId} aria-expanded={false}
          onClick={() => expand(value?.[0] ?? (searchable ? 'search' : order[0]?.[0]))}>
          {value ? <Mark selected round /> : <span aria-hidden="true" className="neuicon-project neui-row-area-leading place-self-center" />}
          <span className="neui-row-copy">{value?.[1] ?? emptyLabel}{value?.[2] && <small>{value[2]}</small>}</span>
        </button>}
    </div>)
  }
  for (let index = multiple ? 0 : 1; index < matches.length; index++) {
    const option = matches[index]
    const key = option[0], inPreview = multiple && preview.includes(option)
    if (windowed) {
      // Keep geometry independent of the mounted window. Closing clips the first
      // viewport of rows until the list has contracted to its selection summary.
      const inWindow = open ? index >= range.first && index < range.end
        : !settled && index < Math.max(16, range.end - range.first)
      if (!inWindow && !inPreview && !(open && key === focusKey)) continue
      const slot = !open && settled ? preview.indexOf(option) : index
      const retiring = !open && !inPreview
      rows.push(<div key={key} className="neui-catalog-row"
        style={{ top: 'calc(' + slot + ' * var(--neui-project-height))' }}
        {...(retiring ? { inert: '', 'aria-hidden': true } : {})}>
        {optionRow(option, index)}
      </div>)
    } else {
      rows.push(<Reveal.Item key={key} open={open || inPreview} returnFocusRef={trigger}>
        {optionRow(option, index)}
      </Reveal.Item>)
    }
  }

  return <Field id={id} label={label} description={description} header={searchable && <Reveal open={open} returnFocusRef={trigger}>
    <div className="neui-row neui-ripple neui-focus neui-entry">
      <span aria-hidden="true" className="neuicon-search neui-row-area-leading place-self-center" />
      <input ref={search} type="search" className="neui-field-input neui-row-area-content" aria-label={searchLabel} placeholder={searchLabel}
        disabled={!open} aria-controls={optionsId} value={query} onChange={e => filter(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Escape') { e.preventDefault(); close() }
          if (matches.length && (e.key === 'ArrowDown' || e.key === 'Enter')) { e.preventDefault(); focusOption(0) }
        }} />
      {query && <span className="neui-collapse-inline neui-row-area-trailing">
        <span className="neui-reveal-clip">
          <button className="neui-clear" type="button" aria-label="Очистить поиск"
            onClick={() => { filter(''); search.current?.focus({ preventScroll: true }) }}>
            <span aria-hidden="true" className="neuicon-clear" />
          </button>
        </span>
      </span>}
    </div>
  </Reveal>} meta={<>
    <button type="button" className="neui-pill" ref={trigger} aria-controls={optionsId} aria-expanded={open}
      aria-label={(open ? 'Свернуть' : 'Раскрыть') + ' ' + actionLabel + '. ' + caption}
      onClick={e => open ? close() : expand(e.detail === 0 ? (searchable ? 'search' : order[0]?.[0]) : undefined)}>
      {caption}<svg className="neui-chev" data-open={open} width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
        <path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
    </button>
    {recovery && <span className="neui-collapse-inline"><span className="neui-reveal-clip">{recovery}</span></span>}
  </>}>
    <Reveal.Group followViewport open={open} id={optionsId} onCollapsed={() => setSettled(true)}>
      <div ref={list} className={windowed ? 'neui-catalog' : undefined}
        style={windowed ? { '--neui-catalog-rows': rowCount } as CSSProperties : undefined}>
        {windowed && <>
          <div className="neui-catalog-window" data-open={open} aria-hidden="true" />
          <div ref={probe} className="neui-pitch" aria-hidden="true" />
        </>}
        {rows}
      </div>
      {open && !!terms.length && <div className="neui-collapse-block"><div className="neui-reveal-clip">
        <p className="neui-note" role="status">{matches.length
          ? 'Найдено: ' + matches.length : 'Совпадений нет. Попробуйте другой запрос.'}</p>
      </div></div>}
      {multiple && <Reveal.Item open={!open && !chosen.length} returnFocusRef={trigger}>
        <button type="button" className="neui-row neui-ripple"
          onClick={() => expand(searchable ? 'search' : order[0]?.[0])}>
          <span aria-hidden="true" className={\`neui-row-area-leading place-self-center \${name === 'delivery' ? 'neuicon-mail' : 'neuicon-project'}\`} />
          <span className="neui-row-copy">{emptyLabel}</span>
        </button>
      </Reveal.Item>}
    </Reveal.Group>
    {!multiple && !selected.length && <input type="hidden" name={name} value="" />}
    {selected.filter(key => !visibleControls.has(key)).map(key => <input key={key} type="hidden" name={name} value={key} />)}
  </Field>
}
`,fn=`import { Fragment, useRef } from 'react'
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
    } else if (/^\\d$/.test(event.key) && !event.altKey && !event.metaKey && !event.ctrlKey) {
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
`,gn=`import { useLayoutEffect, useRef, useState } from 'react'
import { Field } from '../../recipes/Field'
import { useRevealGroup } from '@neui/kit/react'
import { channels } from './options'
import type { DeliveryStep } from './retries'
import './tags.css'

const titles = new Map(channels.map(([key, title]) => [key, title]))
type Props = { id: string; steps: DeliveryStep[]; onChange: (steps: DeliveryStep[]) => void }

type RemovedStep = { step: DeliveryStep; next?: string; index: number }

function restoreStep(steps: DeliveryStep[], removed: RemovedStep) {
  if (steps.some(item => item.id === removed.step.id)) return steps
  const next = steps.slice()
  const anchor = next.findIndex(item => item.id === removed.next)
  next.splice(anchor < 0 ? Math.min(removed.index, next.length) : anchor, 0, removed.step)
  return next
}

function ChannelButtons({ onChoose }: { onChoose: (channel: string) => void }) {
  return channels.map(([key, title]) => <button type="button" key={key} className="neui-row neui-ripple neui-focus"
    onClick={() => onChoose(key)}><span aria-hidden="true" className="neui-row-area-leading place-self-center">+</span>
    <span className="neui-row-copy">{title}</span></button>)
}

export function DeliveryOrderField({ id, steps, onChange }: Props) {
  const [panel, setPanel] = useState<string | null>(null)
  const addGroup = useRevealGroup(panel === 'add', { followViewport: true })
  const [removed, setRemoved] = useState<RemovedStep>()
  const [status, setStatus] = useState('')
  const addButton = useRef<HTMLButtonElement>(null)
  const rows = useRef(new Map<string, HTMLButtonElement>())
  const pendingFocus = useRef<string | null>(null)
  useLayoutEffect(() => {
    const target = pendingFocus.current
    if (target) (rows.current.get(target) ?? addButton.current)?.focus()
    pendingFocus.current = null
  }, [steps])
  function toggle(target: string) {
    setPanel(panel === target ? null : target)
  }
  function move(index: number, offset: number) {
    const target = index + offset
    if (target < 0 || target >= steps.length) return
    const next = steps.slice()
    const step = steps[index]
    next.splice(index, 1)
    next.splice(target, 0, step)
    pendingFocus.current = step.id
    onChange(next)
    setStatus(\`Шаг \${target + 1}. \${titles.get(step.channel)}.\`)
  }
  function remove(index: number) {
    const step = steps[index]
    const deletion = { step, index, next: steps[index + 1]?.id }
    setRemoved(deletion)
    pendingFocus.current = steps[index + 1]?.id ?? steps[index - 1]?.id ?? 'add'
    setPanel(null)
    onChange(steps.filter(item => item.id !== step.id))
    setStatus(\`Удалён шаг \${index + 1}. \${titles.get(step.channel)}.\`)
  }
  function restore() {
    if (!removed) return
    pendingFocus.current = removed.step.id
    onChange(restoreStep(steps, removed))
    setRemoved(undefined)
    setStatus('Шаг восстановлен.')
  }
  return <Field id={id} label="Порядок повторной доставки"
    description="После сбоя пробуем каналы по очереди. Один канал можно повторить."
    meta={<>
      {removed && <span className="neui-collapse-inline">
        <span className="neui-reveal-clip"><button type="button" className="neui-pill" onClick={restore}>Вернуть шаг</button></span>
      </span>}
      <button ref={addButton} type="button" className="neui-pill" aria-expanded={panel === 'add'}
        aria-controls={id + '-add'} onClick={() => toggle('add')}>{panel === 'add' ? 'Свернуть каналы' : 'Добавить шаг'}</button>
    </>}>
    <span className="sr-only" id={id + '-help'}>Нажмите на шаг для изменения порядка. Для удаления потяните вправо или нажмите Delete.</span>
    <ol className="neui-tags" aria-label="Попытки доставки">
      {steps.map((step, index) => {
        const ordinal = index + 1
        const open = panel === step.id
        const actions = id + '-' + step.id
        return <li key={step.id} className="neui-collapse-block">
          <div className="neui-reveal-clip">
            <div className="neui-swipe-right neui-tag neui-focus-anchor neui-focus neui-ripple" data-neui-swipe-open={open}>
              <button type="button" className="neui-swipe-content neui-tag-name" aria-expanded={open} aria-controls={actions}
                ref={el => { if (el) rows.current.set(step.id, el); else rows.current.delete(step.id) }}
                aria-label={ordinal + '. ' + titles.get(step.channel)} aria-describedby={id + '-help'}
                aria-keyshortcuts="Delete Backspace" onClick={() => toggle(step.id)}
                onKeyDown={e => {
                  if (e.key === 'Delete' || e.key === 'Backspace') {
                    e.preventDefault()
                    if (!e.repeat) remove(index)
                  } else if (e.key === 'Escape') setPanel(null)
                }}>{titles.get(step.channel)}</button>
              <button type="button" className="neui-swipe-action" aria-label={'Удалить попытку ' + ordinal}
                aria-hidden={!open} tabIndex={open ? 0 : -1} onClick={() => remove(index)}>
                <span className="neui-tag-word"><span>Удалить</span></span>
              </button>
              <span className="neui-tag-icon neui-step-icon" aria-hidden="true">
                <span className="neui-step-number">{ordinal}.</span>
                <span className="neuicon-transition neuicon-to-trash duration-0" />
              </span>
            </div>
            {open && <div id={actions} className="neui-collapse-block"><div className="neui-reveal-clip">
              <div className="neui-step-actions">
                <button type="button" className="neui-pill" disabled={index <= 0} onClick={() => move(index, -1)}>Вверх</button>
                <button type="button" className="neui-pill" disabled={index === steps.length - 1} onClick={() => move(index, 1)}>Вниз</button>
              </div>
            </div></div>}
          </div>
        </li>
      })}
    </ol>
    {steps.map(step => <input key={step.id} type="hidden" name="retryRoute" value={step.channel} />)}
    {!steps.length && <div className="neui-collapse-block">
      <div className="neui-reveal-clip"><p className="neui-note">Повторных попыток пока нет.</p></div>
    </div>}
    <div ref={addGroup} id={id + '-add'}>
      {panel === 'add' && <div className="neui-collapse-block"><div className="neui-reveal-clip">
        {steps.length > 0 && <hr className="neui-divider" />}
        <div role="group" aria-label="Каналы для добавления">
          <ChannelButtons onChoose={channel => {
            onChange([...steps, { id: crypto.randomUUID(), channel }])
            setStatus(\`Добавлен шаг \${steps.length + 1}. \${titles.get(channel)}.\`)
          }} />
        </div>
      </div></div>}
    </div>
    <span className="sr-only" role="status">{status}</span>
  </Field>
}
`,hn=`import { useEffect, useRef, useState } from 'react'
import { Field } from '../../recipes/Field'

export function EmailField({ id, value, applied, onChange }: {
  id: string; value: string; applied: string; onChange: (text: string, applied: string) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [reviewed, setReviewed] = useState(Boolean(value && value !== applied))
  const [invalid, setInvalid] = useState(false)
  useEffect(() => { setInvalid(Boolean(input.current?.validity.typeMismatch)) }, [value])
  const error = reviewed && invalid
    ? 'Проверьте адрес, например name@example.com. Пока используется ' + (applied || 'адрес из профиля') + '.' : undefined
  return <Field id={id} label="Адрес для сводки" error={error}>
    <div className="neui-row neui-ripple neui-focus neui-entry">
      <span aria-hidden="true" className="neuicon-mail neui-row-area-leading place-self-center" />
      <input type="email" ref={input} className="neui-field-input neui-row-area-content" autoComplete="email" placeholder="Адрес из профиля"
        aria-labelledby={id + '-label'} aria-invalid={Boolean(error)} aria-describedby={error ? id + '-error' : undefined}
        value={value} onBlur={() => setReviewed(true)} onChange={e => {
          const { value, validity } = e.currentTarget
          onChange(value, validity.valid ? value.trim() : applied)
        }} />
    </div>
  </Field>
}
`,vn=`import { useId, useState } from 'react'
import { CalendarRangeField } from './CalendarRangeField'
import { CalendarField } from './CalendarField'
import { ChoicePicker } from './ChoicePicker'
import { DeliveryOrderField } from './DeliveryOrderField'
import { RetryIntervalField } from './RetryIntervalField'
import { EmailField } from './EmailField'
import { RadioField } from './OptionRow'
import { TagField } from './TagField'
import { TextField } from './TextField'
import { channels, emptyDigest, format, frequency, projects } from './options'
import { useSettings } from './settings'

export function NotificationSettings({ embedded = false }: { embedded?: boolean } = {}) {
  const id = useId().replace(/:/g, '')
  const { state, setState, saved } = useSettings()
  const [previousProject, setPreviousProject] = useState('')
  const emailEnabled = state.delivery.includes('email')
  function setText(key: 'frequency' | 'format' | 'emptyDigest' | 'subject' | 'introText', value: string) {
    setState(old => ({ ...old, [key]: value }))
  }
  function setPriority(key: string) {
    setPreviousProject('')
    setState(old => ({ ...old, primaryProject: key,
      projects: key ? [key, ...old.projects.filter(value => value !== key)] : old.projects }))
  }
  const recovery = (state.primaryProject || previousProject) && <button type="button" className="neui-pill"
    aria-label={(previousProject ? 'Вернуть' : 'Сбросить') + ' первый проект'}
    onClick={() => {
      if (previousProject) setPriority(previousProject)
      else { setPreviousProject(state.primaryProject); setState(old => ({ ...old, primaryProject: '' })) }
    }}>{previousProject ? 'Вернуть' : 'Сбросить'}</button>

  const Container = embedded ? 'div' : 'main'
  return <Container className="neui-example" lang="ru">{!embedded && <h1>Настройки сводки</h1>}
    <form className="neui-settings" onSubmit={e => e.preventDefault()}>
      <RadioField id={id + '-frequency'} name="frequency" label="Как часто присылать сводку?" options={frequency}
        value={state.frequency} onChange={value => setText('frequency', value)} />
      <CalendarField id={id + '-date'} name="firstDigestDate" label="Дата первой сводки" draft={state.dateDraft}
        onChange={dateDraft => setState(old => ({ ...old, dateDraft }))} />
      <CalendarRangeField id={id + '-period'} name="digestPeriod" label="Период событий" draft={state.periodDraft}
        onChange={periodDraft => setState(old => ({ ...old, periodDraft }))} />
      <RadioField id={id + '-format'} name="format" label="В каком формате?" options={format}
        value={state.format} onChange={value => setText('format', value)} />
      <ChoicePicker id={id + '-delivery'} name="delivery" label="Куда доставлять сводку?" actionLabel="каналы доставки"
        options={channels} multiple selected={state.delivery} emptyLabel="Доставка выключена"
        onChange={delivery => setState(old => ({ ...old, delivery }))} />
      {emailEnabled && <div className="neui-collapse-block"><div className="neui-reveal-clip">
        <div className="neui-conditional-field">
          <EmailField id={id + '-email'} value={state.emailText} applied={state.emailAddress}
            onChange={(emailText, emailAddress) => setState(old => ({ ...old, emailText, emailAddress }))} />
        </div>
      </div></div>}
      <input type="hidden" name="emailAddress" disabled={!emailEnabled} value={state.emailAddress} />
      <DeliveryOrderField id={id + '-retry-route'} steps={state.retryRoute}
        onChange={retryRoute => setState(old => ({ ...old, retryRoute }))} />
      <RetryIntervalField id={id + '-retry-minutes'} draft={state.retryDraft} applied={state.retryMinutes}
        onChange={(retryDraft, retryMinutes) => setState(old => ({ ...old, retryDraft, retryMinutes }))} />
      <ChoicePicker id={id + '-projects'} name="projects" label="Проекты в сводке" options={projects} multiple
        searchLabel="Поиск проектов" emptyLabel="Выбрать проекты" selected={state.projects} onChange={projects => {
          setState(old => {
            const primary = projects.includes(old.primaryProject) ? old.primaryProject : ''
            return { ...old, primaryProject: primary, projects: primary ? [primary, ...projects.filter(key => key !== primary)] : projects }
          })
        }} />
      <ChoicePicker id={id + '-priority'} name="primaryProject" label="Первым в сводке" options={projects}
        description="Выбранный проект включается в сводку и показывается первым."
        searchLabel="Поиск первого проекта" emptyLabel="Выбрать первый проект" recovery={recovery}
        selected={state.primaryProject ? [state.primaryProject] : []} onChange={values => setPriority(values[0] ?? '')} />
      <RadioField id={id + '-empty'} name="emptyDigest" label="Если событий нет" options={emptyDigest}
        value={state.emptyDigest} onChange={value => setText('emptyDigest', value)} />
      <TextField id={id + '-subject'} name="subject" label="Тема сводки" icon="pencil" value={state.subject}
        placeholder="Введите тему" limit={120} onChange={value => setText('subject', value)} />
      <TagField id={id + '-tags'} name="tags" label="Теги сводки" tags={state.tags} draft={state.tagDraft}
        onChange={(tags, tagDraft) => setState(old => ({ ...old, tags, tagDraft }))} />
      <TextField id={id + '-intro'} name="introText" label="Вступительный текст" icon="text" value={state.introText}
        limit={300} onChange={value => setText('introText', value)} />
      <TextField id={id + '-sender'} name="senderName" label="Имя отправителя" icon="person" value="Trinet"
        description="Имя задано профилем отправителя." readOnly />
    </form>
    <p className="neui-after" role="status">{saved ? 'Настройки и черновики сохраняются на этом устройстве.'
      : 'Не удалось сохранить на устройстве. Изменения пока доступны в этой вкладке.'}</p>
  </Container>
}
`,yn=`import { Field } from '../../recipes/Field'
import type { Option } from './options'

export function Mark({ selected, round = false }: { selected: boolean; round?: boolean }) {
  const shape = round ? 'neui-check-radio' : 'neui-check-box'
  return <span aria-hidden="true" className={\`neui-row-area-leading place-self-center \${shape} \${selected ? '[--neui-check-level:1]' : ''}\`} />
}

type Props = {
  option: Option
  id: string
  name: string
  multiple?: boolean
  selected: boolean
  onChoose: () => void
  disclosure?: { controls: string; expand: () => void }
}

export function OptionRow({ option: [key, label, description, disabled], id, name, multiple, selected, onChoose, disclosure }: Props) {
  return <label htmlFor={id} className="neui-row neui-ripple neui-choice">
    {disclosure
      ? <button id={id} type="button" className="neui-option" aria-expanded={false}
          aria-controls={disclosure.controls} onClick={disclosure.expand} />
      : <input id={id} name={multiple ? undefined : name} className="neui-option" type={multiple ? 'checkbox' : 'radio'}
          value={key} disabled={disabled} checked={selected} onChange={onChoose} />}
    <Mark selected={selected} round={!multiple} />
    <span className="neui-row-copy">{label}{description && <small>{description}</small>}</span>
  </label>
}

export function RadioField({ id, name, label, options, value, onChange }: {
  id: string; name: string; label: string; options: readonly Option[]; value: string; onChange: (value: string) => void
}) {
  return <Field id={id} label={label}>
    {options.map(option => <OptionRow key={option[0]} option={option} id={id + '-' + option[0]}
      name={name} selected={value === option[0]} onChoose={() => onChange(option[0])} />)}
  </Field>
}
`,bn=`import { useRef, useState } from 'react'
import { Field } from '../../recipes/Field'
import { useRevealGroup } from '@neui/kit/react'
import { interval, retryMinutes } from './retries'

const marks = Array.from({ length: 1 + (interval.max - interval.min) / interval.step }, (_, i) => interval.min + i * interval.step)
type Props = { id: string; draft: string; applied: number; onChange: (draft: string, applied: number) => void }

export function RetryIntervalField({ id, draft, applied, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const group = useRevealGroup(open, { followViewport: true })
  const editor = useRef<HTMLInputElement>(null)
  const returning = useRef(false)
  function close() {
    returning.current = true
    editor.current?.focus({ preventScroll: true })
    returning.current = false
    setOpen(false)
  }
  const error = retryMinutes(draft) === undefined
    ? \`Введите чётное число от \${interval.min} до \${interval.max}. Сейчас используется \${applied} мин.\` : undefined
  return <Field id={id} label="Интервал между попытками" error={error}>
    <div onKeyDown={e => { if (e.key === 'Escape' && open) { e.preventDefault(); close() } }}>
      <div className="neui-number-entry">
        <label className="neui-row neui-entry neui-ripple neui-focus">
          <span aria-hidden="true" className="neuicon-clock neui-row-area-leading place-self-center" />
          <span className="neui-quantity neui-row-area-content">
            <span className="neui-quantity-value">
              <span aria-hidden="true">{draft || '0'}</span>
              <input ref={editor} type="text" inputMode="decimal" className="neui-field-input" value={draft}
                aria-labelledby={id + '-label'} aria-describedby={[id + '-unit', error && id + '-error'].filter(Boolean).join(' ')}
                aria-invalid={!!error} aria-controls={id + '-scale'}
                onFocus={() => { if (!returning.current) setOpen(true) }} onClick={() => setOpen(true)}
                onChange={e => {
                  const text = e.currentTarget.value
                  setOpen(true)
                  onChange(text, retryMinutes(text) ?? applied)
                }} />
            </span>
            <span id={id + '-unit'} className="text-muted">мин</span>
          </span>
        </label>
        {open && <div className="neui-collapse-inline">
          <div className="neui-reveal-clip">
            <button type="button" className="neui-pill" aria-label="Свернуть шкалу" aria-expanded={open}
              aria-controls={id + '-scale'} onClick={close}>Свернуть</button>
          </div>
        </div>}
      </div>
      <input type="hidden" name="retryMinutes" value={applied} />
      <div ref={group} id={id + '-scale'}>
        {open && <div className="neui-collapse-block"><div className="neui-reveal-clip">
          <div className="neui-scale-example">
            <input type="range" className="neui-range" aria-label="Интервал по шкале, минуты"
              min={interval.min} max={interval.max} step={interval.step} value={applied}
              onChange={e => onChange(e.currentTarget.value, e.currentTarget.valueAsNumber)} />
            <div className="neui-range-ticks" aria-hidden="true">{marks.map(mark => <i key={mark} />)}</div>
            <div className="neui-scale-labels" aria-hidden="true"><span>{interval.min} мин</span><span>{interval.max} мин</span></div>
          </div>
        </div></div>}
      </div>
    </div>
  </Field>
}
`,xn=`import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Field } from '../../recipes/Field'
import './tags.css'

const guideKey = 'neui:tag-swipe-guide:v1'
let seenInMemory = false
function firstTouch() {
  try {
    if (sessionStorage.getItem(guideKey)) return false
    sessionStorage.setItem(guideKey, 'seen')
  } catch { if (seenInMemory) return false }
  seenInMemory = true
  return true
}

type Removed = { value: string; next?: string }
function restoreAt(tags: string[], { value, next }: Removed) {
  if (tags.includes(value)) return tags
  const index = next === undefined ? -1 : tags.indexOf(next)
  const at = index < 0 ? tags.length : index
  return [...tags.slice(0, at), value, ...tags.slice(at)]
}

export interface TagFieldProps {
  id: string
  label: string
  name: string
  tags: string[]
  draft: string
  onChange: (tags: string[], draft: string) => void
}

export function TagField({ id, label, name, tags, draft, onChange }: TagFieldProps) {
  const input = useRef<HTMLInputElement>(null)
  const buttons = useRef(new Map<string, HTMLButtonElement>())
  const [open, setOpen] = useState<string>()
  const [guide, setGuide] = useState<string>()
  const pointerType = useRef('')
  const dismissed = useRef(false)
  const [undo, setUndo] = useState<Removed>()
  function focusTag(value?: string) {
    (buttons.current.get(value ?? '') ?? input.current)?.focus({ preventScroll: true })
  }
  function erase(value: string) {
    const i = tags.indexOf(value)
    if (i < 0) return
    const removed = { value, next: tags[i + 1] }
    focusTag(removed.next ?? tags[i - 1])
    setOpen(undefined); setGuide(undefined)
    setUndo(removed)
    onChange(tags.filter(tag => tag !== value), draft)
  }
  function commit() {
    const value = draft.trim()
    if (!value) return
    if (!tags.includes(value)) setUndo(undefined)
    onChange(tags.includes(value) ? tags : [value, ...tags], '')
  }
  function edit(key: string, prevent: () => void) {
    if (key === 'Enter') { prevent(); commit() }
    if (key === 'Backspace' && tags.length && input.current?.selectionStart === 0 && input.current.selectionEnd === 0) {
      prevent(); focusTag(tags[0])
    }
  }
  // Mobile keyboards can edit through beforeinput without a useful keydown.
  useEffect(() => {
    const node = input.current
    if (!node) return
    function before(e: InputEvent) {
      if (e.isComposing || !e.cancelable) return
      if (e.inputType === 'deleteContentBackward') edit('Backspace', () => e.preventDefault())
      if (e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph') edit('Enter', () => e.preventDefault())
    }
    node.addEventListener('beforeinput', before)
    return () => node.removeEventListener('beforeinput', before)
  })
  function tagKey(event: KeyboardEvent, value: string) {
    const i = tags.indexOf(value)
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      if (!event.repeat) erase(value)
    } else if (event.key === 'Escape' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      focusTag(event.key === 'Escape' ? undefined : event.key === 'ArrowUp' ? tags[i - 1] : tags[i + 1] ?? value)
    }
  }
  const recovery = undo && <button className="neui-pill" type="button" aria-label="Вернуть удалённый тег" onClick={() => {
    onChange(restoreAt(tags, undo), draft); setUndo(undefined)
    input.current?.focus({ preventScroll: true })
  }}>Вернуть тег</button>

  return <Field id={id} label={label} meta={recovery}>
    <div className="neui-row neui-entry neui-ripple neui-focus">
      <span className="neuicon-tag neui-row-area-leading place-self-center" aria-hidden="true" />
      <input ref={input} type="text" enterKeyHint="enter" className="neui-field-input neui-row-area-content"
        aria-labelledby={id + '-label'} aria-describedby={id + '-help'} placeholder="Добавьте тег" value={draft}
        onChange={e => onChange(tags, e.target.value)} onKeyDown={e => {
          if (!e.nativeEvent.isComposing && e.nativeEvent.keyCode !== 229) edit(e.key, () => e.preventDefault())
        }} />
    </div>
    <span className="sr-only" id={id + '-help'}>Enter добавляет тег. Backspace в начале ввода выбирает последний добавленный тег.
      Выбранный тег можно удалить клавишей Delete или свайпом вправо.</span>
    <ul className="neui-tags" aria-labelledby={id + '-label'}>
      {tags.map(value => {
        const expanded = open === value, teaching = guide === value
        return <li key={value} className="neui-collapse-block">
          <div className="neui-reveal-clip">
            <div className="neui-swipe-right neui-tag neui-focus-anchor neui-focus neui-ripple"
              data-neui-swipe-open={expanded} data-guide={teaching || undefined}
              onBlur={e => {
                if (e.currentTarget.contains(e.relatedTarget)) return
                setOpen(old => old === value ? undefined : old)
                setGuide(old => old === value ? undefined : old)
              }}
              onPointerDownCapture={e => {
                pointerType.current = e.pointerType
                dismissed.current = teaching
                if (teaching) setGuide(undefined)
              }}>
              <button type="button" className="neui-swipe-content neui-tag-name"
                ref={node => { if (node) buttons.current.set(value, node); else buttons.current.delete(value) }}
                aria-expanded={expanded} aria-describedby={teaching ? id + '-hint' : id + '-help'}
                onKeyDown={e => { pointerType.current = ''; dismissed.current = false; tagKey(e, value) }}
                onClick={e => {
                  e.currentTarget.focus({ preventScroll: true })
                  if (dismissed.current) { dismissed.current = false; return }
                  if (e.detail && ['touch', 'pen'].includes(pointerType.current) && firstTouch()) {
                    setGuide(value); setOpen(undefined)
                  } else setOpen(expanded ? undefined : value)
                }}>{value}</button>
              <button type="button" className="neui-swipe-action" aria-label={'Удалить тег «' + value + '»'}
                aria-hidden={!expanded} tabIndex={expanded ? 0 : -1} onClick={() => erase(value)}>
                <span className="neui-tag-word"><span>Удалить</span></span>
              </button>
              <span aria-hidden="true" className="neui-tag-icon neuicon-transition neuicon-from-tag neuicon-to-trash duration-0" />
            </div>
            {teaching && <div className="neui-collapse-block">
              <div className="neui-reveal-clip">
                <p className="neui-note neui-tag-hint" id={id + '-hint'}>Потяни вправо для удаления</p>
              </div>
            </div>}
          </div>
        </li>
      })}
    </ul>
    {tags.map(value => <input key={value} type="hidden" name={name} value={value} />)}
  </Field>
}
`,wn=`import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useFocusAnchor } from '@neui/kit/react'
import { Field } from '../../recipes/Field'

const icons = { pencil: 'neuicon-pencil', text: 'neuicon-text', person: 'neuicon-person' } as const
const words = new Intl.PluralRules('ru')
const endings: Record<string, string> = { one: 'символ', few: 'символа', many: 'символов' }

type Props = {
  id: string; name: string; label: string; icon: 'pencil' | 'text' | 'person'; value: string
  limit?: number; description?: string; placeholder?: string; readOnly?: boolean; onChange?: (value: string) => void
}

export function TextField({ id, name, label, icon, value, limit, description, placeholder, readOnly, onChange }: Props) {
  const editor = useRef<HTMLTextAreaElement>(null)
  const mirror = useRef<HTMLDivElement>(null)
  const remaining = limit === undefined ? Infinity : limit - value.length
  useFocusAnchor(editor, node => {
    const content = mirror.current?.firstChild
    if (!content) return node.getBoundingClientRect().top + 24
    const range = document.createRange()
    const at = node.selectionDirection === 'backward' ? node.selectionStart : node.selectionEnd
    const offset = Math.min(at, Math.max(0, (content.textContent?.length ?? 1) - 1))
    range.setStart(content, offset)
    range.setEnd(content, offset + 1)
    const line = range.getBoundingClientRect()
    return line.top + line.height / 2 - node.scrollTop
  })
  useLayoutEffect(() => {
    const input = editor.current!, layout = mirror.current!
    function fit() { input.style.height = layout.getBoundingClientRect().height + 'px' }
    fit()
    const resize = new ResizeObserver(fit)
    resize.observe(layout)
    return () => resize.disconnect()
  }, [])
  const word = words.select(remaining)
  return <Field id={id} label={label} description={description} meta={remaining <= 50 &&
    <span id={id + '-count'} className="neui-pill neui-count" style={{ '--urgency': (50 - remaining) * 2 + '%' } as CSSProperties}>
      {word === 'one' ? 'Остался' : 'Осталось'} {remaining} {endings[word] ?? 'символа'}
    </span>}>
    <div className="neui-row neui-ripple neui-focus neui-edit">
      <span aria-hidden="true" className={\`neui-row-leading \${icons[icon]}\`} />
      <textarea ref={editor} className="neui-editor" name={name} placeholder={placeholder} readOnly={readOnly} aria-labelledby={id + '-label'}
        aria-describedby={[description && id + '-description', remaining <= 50 && id + '-count'].filter(Boolean).join(' ') || undefined} rows={1} value={value} maxLength={limit}
        onChange={event => onChange?.(event.target.value)} />
      <span className="neui-caret-mirror" aria-hidden="true" ref={mirror}>{value + '\\u200b'}</span>
    </div>
  </Field>
}
`,kn=`export type Option = readonly [id: string, title: string, description?: string, disabled?: boolean]

export const frequency = [
  ['instant', 'Сразу', 'Каждое важное событие'],
  ['daily', 'Раз в день', 'Одна сводка в конце дня'],
  ['weekly', 'Раз в неделю', 'Главное за последние семь дней'],
  ['custom', 'По расписанию', 'Индивидуальное расписание недоступно в прототипе', true],
] as const satisfies readonly Option[]

export const format = [
  ['brief', 'Коротко', 'Только заголовки событий'],
  ['details', 'С подробностями', 'Заголовки, авторы и описание изменений'],
] as const satisfies readonly Option[]

export const emptyDigest = [
  ['skip', 'Пропустить выпуск', 'Следующая сводка придёт, когда появятся события'],
  ['send', 'Прислать пустую сводку', 'Сообщить, что за период событий не было'],
] as const satisfies readonly Option[]

export const channels: readonly Option[] = [
  ['inbox', 'Входящие Trinet', 'Во вкладку уведомлений'],
  ['email', 'Электронная почта', 'На адрес профиля или другой указанный адрес'],
  ['mobile', 'Уведомления телефона', 'На экран мобильного устройства'],
  ['browser', 'Уведомления браузера', 'На рабочий стол через браузер'],
  ['chat', 'Личный чат', 'Сообщением от бота в мессенджере'],
  ['team', 'Канал команды', 'В общую ленту рабочего чата'],
]

const projectProducts = [
  ['trinet','Trinet'], ['entropy','Entropy'], ['atlas','Атлас'], ['orbit','Орбита'],
  ['north','Север'], ['vector','Вектор'], ['pulse','Пульс'], ['signal','Сигнал'],
  ['beacon','Маяк'], ['spectrum','Спектр'], ['rhythm','Ритм'], ['core','Ядро']
]
const projectAreas = [
  ['design','Дизайн-система'], ['search','Поиск'], ['automation','Автоматизация'],
  ['mobile','Мобильное приложение'], ['reports','Отчёты'], ['access','Управление доступом'],
  ['integrations','Интеграции'], ['events','Журнал событий'], ['docs','Документация'],
  ['notifications','Уведомления'], ['analytics','Аналитика'], ['import','Импорт данных']
]
export const projects: readonly Option[] = projectProducts.flatMap(([product, name]) =>
  projectAreas.map(([area, title]) => [product + '-' + area, name + ' · ' + title] as const)
)


export const initialIntro = \`Доброе утро, команда!
Вот новости проекта за неделю.

Мы выпустили обновление формы.
Теперь она запоминает черновики.
Поиск по задачам тоже готов.
Его уже можно попробовать.

Дальше займёмся уведомлениями.
В пятницу покажем первый вариант.
До встречи на демо!\`
`,Nn=`import { channels } from './options'

export type DeliveryStep = { id: string; channel: string }
const defaultChannels = ['mobile', 'email', 'mobile']

export function loadDeliverySteps(value: unknown): DeliveryStep[] {
  const values = Array.isArray(value) ? value : defaultChannels
  return values.filter((key): key is string => channels.some(([id]) => id === key))
    .map((channel, index) => ({ id: 'saved-' + index, channel }))
}

// Application policy for this field. The CSS utilities never interpret typed input.
export const interval = { min: 2, max: 30, step: 2, initial: 10 }

export function retryMinutes(text: string): number | undefined {
  if (!/^[+-]?\\d+(?:[.,]\\d+)?$/.test(text.trim())) return undefined
  const value = Number(text.trim().replace(',', '.'))
  if (!Number.isInteger(value) || value < interval.min || value > interval.max ||
      (value - interval.min) % interval.step !== 0) return undefined
  return value
}
`,jn=`import { useEffect, useState } from 'react'
import { calendarDraft, calendarRangeValue, calendarValue } from '@neui/kit/react'
import type { CalendarDraft, CalendarPart, CalendarRangeDraft } from '@neui/kit/react'
import { channels, emptyDigest, format, frequency, initialIntro, projects } from './options'
import type { Option } from './options'
import { interval, loadDeliverySteps, retryMinutes } from './retries'

const storageKey = 'trinet:storybook:notification-settings:v1'
const defaults = {
  retryRoute: loadDeliverySteps(undefined), retryMinutes: interval.initial, retryDraft: String(interval.initial),
  periodDraft: { start: {}, end: {} } as CalendarRangeDraft, dateDraft: {} as CalendarDraft, frequency: 'daily', format: 'brief', delivery: ['inbox'], emailText: '', emailAddress: '',
  projects: ['trinet-design', 'entropy-automation'], primaryProject: '', emptyDigest: 'skip',
  subject: '', introText: initialIntro, tags: ['potential', 'frequently_used'], tagDraft: '',
}
export type Settings = typeof defaults

function restoreDate(iso: unknown, rawDraft: unknown) {
  const dateDraft = calendarDraft(iso)
  if (!calendarValue(dateDraft) && rawDraft && typeof rawDraft === 'object') {
    for (const part of ['year', 'month', 'day'] as CalendarPart[]) {
      const raw: unknown = (rawDraft as Record<string, unknown>)[part]
      if (typeof raw === 'string' && /^\\d+$/.test(raw) && raw.length <= (part === 'year' ? 4 : 2)) dateDraft[part] = raw
    }
  }
  return dateDraft
}

function load(): Settings {
  try {
    const record = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (!record || typeof record !== 'object') return defaults
    const values = record.values ?? {}, draft = record.emailDraft ?? {}
    const text = (value: unknown, fallback: string) => typeof value === 'string' ? value : fallback
    const single = (options: readonly Option[], value: unknown, fallback: string) =>
      options.some(([key, , , disabled]) => key === value && !disabled) ? String(value) : fallback
    const many = (options: readonly Option[], value: unknown, fallback: string[]) => Array.isArray(value)
      ? [...new Set(value.filter((key): key is string => options.some(([id]) => id === key)))] : fallback
    const primary = single(projects, values.primaryProject, '')
    const included = many(projects, values.projects, defaults.projects)
    const dateDraft = restoreDate(values.firstDigestDate, record.dateDraft)
    const periodDraft = {
      start: restoreDate(values.digestPeriod?.start, record.periodDraft?.start),
      end: restoreDate(values.digestPeriod?.end, record.periodDraft?.end),
    }
    const minutes = retryMinutes(String(values.retryMinutes)) ?? interval.initial
    return {
      retryRoute: loadDeliverySteps(values.retryRoute), retryMinutes: minutes,
      retryDraft: text(record.retryDraft, String(minutes)),
      tags: Array.isArray(values.tags) ? [...new Set<string>(values.tags.filter((t: unknown): t is string =>
        typeof t === 'string' && !!t.trim()).map((t: string) => t.trim()))] : defaults.tags,
      tagDraft: text(record.tagDraft, ''),
      periodDraft, dateDraft, frequency: single(frequency, values.frequency, defaults.frequency),
      format: single(format, values.format, defaults.format),
      emptyDigest: single(emptyDigest, values.emptyDigest, defaults.emptyDigest),
      delivery: many(channels, values.delivery, defaults.delivery),
      projects: primary ? [primary, ...included.filter(key => key !== primary)] : included,
      primaryProject: primary,
      emailAddress: text(draft.applied, text(values.emailAddress, '')), emailText: text(draft.text, text(values.emailAddress, '')),
      subject: text(values.subject, '').slice(0, 120), introText: text(values.introText, initialIntro).slice(0, 300),
    }
  } catch { return defaults }
}

export function useSettings() {
  const [state, setState] = useState(load)
  const [saved, setSaved] = useState(true)
  useEffect(() => {
    const { emailText, emailAddress, dateDraft, periodDraft, tagDraft, retryRoute, retryDraft, ...fields } = state
    const iso = calendarValue(dateDraft)
    const period = calendarRangeValue(periodDraft)
    const values = { ...fields, ...(period ? { digestPeriod: period } : {}), retryRoute: retryRoute.map(step => step.channel), ...(iso ? { firstDigestDate: iso } : {}), senderName: 'Trinet', ...(fields.delivery.includes('email') ? { emailAddress } : {}) }
    try {
      localStorage.setItem(storageKey, JSON.stringify({ values, tagDraft, retryDraft, ...(!period ? { periodDraft } : {}), ...(!iso ? { dateDraft } : {}), emailDraft: { text: emailText, applied: emailAddress } }))
      setSaved(true)
    } catch { setSaved(false) }
  }, [state])
  return { state, setState, saved }
}
`,Cn=`.neui-tags { list-style:none; padding:0; margin:0 }
.neui-tag {
  min-height:var(--neui-hit); border-radius:var(--neui-row-radius);
  --neui-swipe-fill:color-mix(in srgb, var(--neui-danger) 18%, transparent);
}
.neui-tag-name {
  display:block; min-height:var(--neui-hit); width:100%; padding:8px 12px 8px 34px;
  font:inherit; color:inherit; text-align:start; border:0; background:transparent; cursor:pointer; overflow-wrap:anywhere;
}
.neui-tag-name:focus { outline:none }
.neui-tag-icon {
  position:absolute; left:calc(6px + var(--neui-swipe-progress) * var(--neui-swipe-inset)); top:50%;
  translate:0 -50%; z-index:2; pointer-events:none;
  --neuicon-progress:calc(var(--neui-swipe-progress) * .89 + var(--neui-swipe-tension) * .11);
}
.neui-tag .neui-swipe-action { padding-left:29px }
.neui-tag-word { display:block; overflow:clip; translate:calc(var(--neui-swipe-stretch) / 2) 0 }
.neui-tag-word > span { display:block; translate:calc((var(--neui-swipe-progress) - 1) * 100%) 0 }
.neui-tag[data-guide]:not([data-neui-swiping]) { animation:neui-tag-guide 2.2s ease-in-out infinite }
@keyframes neui-tag-guide {
  0%,15%,90%,100% { --neui-swipe-progress:0 }
  48%,58% { --neui-swipe-progress:.6 }
}
@media (prefers-reduced-motion:reduce) {
  .neui-tag[data-guide]:not([data-neui-swiping]) { animation:none; --neui-swipe-progress:.6 }
}
@media (forced-colors:active) { .neui-tag[data-neui-swipe-open=true] .neui-swipe-action { outline:1px solid ButtonText; outline-offset:-1px } }
.neui-step-icon { display:grid; place-items:center; width:1em }
.neui-step-icon > * { grid-area:1 / 1 }
.neui-step-icon .neui-step-number { font-variant-numeric:tabular-nums; color:var(--neui-muted); opacity:calc(1 - var(--neui-swipe-progress)) }
.neui-step-icon .neuicon-transition { --neuicon-progress:var(--neui-swipe-progress) }
`,Dn=`import { useRef } from 'react'
import type { MouseEvent, PointerEvent } from 'react'

// Touch and trackpads use the native snap scroller. Desktop mice can grab the same strip.
export function useCalendarDrag() {
  const origin = useRef<{ x: number; scroll: number; id: number } | null>(null)
  const suppressClick = useRef(false)
  function release(event: PointerEvent<HTMLDivElement>) {
    if (origin.current?.id !== event.pointerId) return
    const node = event.currentTarget
    origin.current = null
    if (!node.hasAttribute('data-dragging')) return
    const pages = Array.from(node.children, child => (child as HTMLElement).offsetLeft)
    const left = pages.reduce((best, x) => Math.abs(x - node.scrollLeft) < Math.abs(best - node.scrollLeft) ? x : best)
    node.removeAttribute('data-dragging')
    if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId)
    node.scrollTo({ left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return {
    onPointerDown(event: PointerEvent<HTMLDivElement>) {
      suppressClick.current = false
      if (event.pointerType === 'mouse' && event.button === 0)
        origin.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft, id: event.pointerId }
    },
    onPointerMove(event: PointerEvent<HTMLDivElement>) {
      const from = origin.current, node = event.currentTarget
      if (!from || from.id !== event.pointerId) return
      if (!event.buttons) { release(event); return }
      const distance = from.x - event.clientX
      if (!suppressClick.current && Math.abs(distance) < 5) return
      if (!suppressClick.current) {
        suppressClick.current = true
        node.setAttribute('data-dragging', '')
        node.setPointerCapture(event.pointerId)
      }
      node.scrollLeft = from.scroll + distance
    },
    onPointerUp: release, onPointerCancel: release, onLostPointerCapture: release,
    onClickCapture(event: MouseEvent<HTMLDivElement>) {
      if (suppressClick.current && event.detail) { event.stopPropagation(); suppressClick.current = false }
    },
  }
}
`,Sn=`import { useLayoutEffect, useRef, useState } from 'react'

/** Keep the form's own scroll. Only the catalogue rows near its viewport need native controls. */
export function useChoiceWindow(enabled: boolean, open: boolean, count: number) {
  const list = useRef<HTMLDivElement>(null)
  const probe = useRef<HTMLDivElement>(null)
  const [range, setRange] = useState({ first: 0, end: 16 })
  useLayoutEffect(() => {
    const host = list.current, ruler = probe.current
    if (!enabled || !open || !host || !ruler) return
    let frame = 0
    const update = () => {
      frame = 0
      const pitch = ruler.getBoundingClientRect().height
      if (!pitch) return
      const top = host.getBoundingClientRect().top
      const first = Math.max(0, Math.floor(-top / pitch) - 6)
      const end = Math.min(count, Math.ceil((window.innerHeight - top) / pitch) + 6)
      setRange(old => old.first === first && old.end === end ? old : { first, end })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    const observer = new ResizeObserver(schedule)
    observer.observe(host)
    observer.observe(ruler)
    observer.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true, capture: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
    }
  }, [enabled, open, count])
  return { list, probe, range }
}
`;function We(e){let t=e.parentElement;for(;t&&!/^(auto|scroll|overlay)$/.test(getComputedStyle(t).overflowY);)t=t.parentElement;return t}function yt(e){return(e.getAnimations?.({subtree:!0})??[]).filter(t=>"transitionProperty"in t&&(t.transitionProperty==="grid-template-rows"||t.transitionProperty==="grid-template-columns"||t.transitionProperty==="height"&&t.effect?.target?.hasAttribute("data-open")))}function Rn(e,t,n){const a=We(e),i=a??document.scrollingElement;if(!i)return()=>{};const o=new AbortController,s=e.querySelector(".neui-head"),d=e.querySelector(".neui-foot"),f=s&&parseFloat(getComputedStyle(s).top)||0,y=d&&parseFloat(getComputedStyle(d).bottom)||0;function h(){const x=e.getBoundingClientRect(),k=a?.getBoundingClientRect(),j=window.visualViewport,N=Math.max(k?.top??0,j?.offsetTop??0)+f,S=Math.min(k?.bottom??1/0,(j?.offsetTop??0)+(j?.height??window.innerHeight))-y,R=Math.min(N<x.top?x.top-N:0,Math.max(0,x.bottom-S));R>=.5&&(i.scrollTop+=R)}const u=new ResizeObserver(h),l=()=>{o.abort(),u.disconnect()};u.observe(e);const p={signal:o.signal,passive:!0,capture:!0};for(const x of["pointerdown","touchmove","wheel","keydown","input"])window.addEventListener(x,l,p);return h(),Promise.allSettled(yt(t).map(x=>x.finished)).then(()=>{o.signal.aborted||(h(),l())}),l}function ke(e,{followViewport:t=!1,onCollapsed:n}={}){const a=m.useRef(null),i=m.useRef(e),o=m.useRef(n);return m.useLayoutEffect(()=>{o.current=n},[n]),m.useLayoutEffect(()=>{if(!a.current||i.current===e)return;if(i.current=e,e)return t?Rn(a.current.closest(".neui-ridge")??a.current,a.current):void 0;if(!o.current)return;const s=yt(a.current);if(!s.length){o.current();return}let d=!1;return Promise.allSettled(s.map(f=>f.finished)).then(()=>{d||o.current?.()}),()=>{d=!0}},[e,t]),a}function Pn(e,t){m.useLayoutEffect(()=>{const n=e.current;if(n)return Kt(n,()=>t(n))},[e,t])}function ge(e,t){if(e.one!==void 0&&t===1)return e.one;const n=t%10,a=t%100;return n===1&&a!==11?e.singularNominative.replace("{{count}}",String(t)):n>=2&&n<=4&&(a<10||a>20)?e.singularGenitive.replace("{{count}}",String(t)):e.pluralGenitive.replace("{{count}}",String(t))}function Y(e){return(t,n)=>n?.addSuffix?n.comparison&&n.comparison>0?e.future?ge(e.future,t):"через "+ge(e.regular,t):e.past?ge(e.past,t):ge(e.regular,t)+" назад":ge(e.regular,t)}const Mn={lessThanXSeconds:Y({regular:{one:"меньше секунды",singularNominative:"меньше {{count}} секунды",singularGenitive:"меньше {{count}} секунд",pluralGenitive:"меньше {{count}} секунд"},future:{one:"меньше, чем через секунду",singularNominative:"меньше, чем через {{count}} секунду",singularGenitive:"меньше, чем через {{count}} секунды",pluralGenitive:"меньше, чем через {{count}} секунд"}}),xSeconds:Y({regular:{singularNominative:"{{count}} секунда",singularGenitive:"{{count}} секунды",pluralGenitive:"{{count}} секунд"},past:{singularNominative:"{{count}} секунду назад",singularGenitive:"{{count}} секунды назад",pluralGenitive:"{{count}} секунд назад"},future:{singularNominative:"через {{count}} секунду",singularGenitive:"через {{count}} секунды",pluralGenitive:"через {{count}} секунд"}}),halfAMinute:(e,t)=>t?.addSuffix?t.comparison&&t.comparison>0?"через полминуты":"полминуты назад":"полминуты",lessThanXMinutes:Y({regular:{one:"меньше минуты",singularNominative:"меньше {{count}} минуты",singularGenitive:"меньше {{count}} минут",pluralGenitive:"меньше {{count}} минут"},future:{one:"меньше, чем через минуту",singularNominative:"меньше, чем через {{count}} минуту",singularGenitive:"меньше, чем через {{count}} минуты",pluralGenitive:"меньше, чем через {{count}} минут"}}),xMinutes:Y({regular:{singularNominative:"{{count}} минута",singularGenitive:"{{count}} минуты",pluralGenitive:"{{count}} минут"},past:{singularNominative:"{{count}} минуту назад",singularGenitive:"{{count}} минуты назад",pluralGenitive:"{{count}} минут назад"},future:{singularNominative:"через {{count}} минуту",singularGenitive:"через {{count}} минуты",pluralGenitive:"через {{count}} минут"}}),aboutXHours:Y({regular:{singularNominative:"около {{count}} часа",singularGenitive:"около {{count}} часов",pluralGenitive:"около {{count}} часов"},future:{singularNominative:"приблизительно через {{count}} час",singularGenitive:"приблизительно через {{count}} часа",pluralGenitive:"приблизительно через {{count}} часов"}}),xHours:Y({regular:{singularNominative:"{{count}} час",singularGenitive:"{{count}} часа",pluralGenitive:"{{count}} часов"}}),xDays:Y({regular:{singularNominative:"{{count}} день",singularGenitive:"{{count}} дня",pluralGenitive:"{{count}} дней"}}),aboutXWeeks:Y({regular:{singularNominative:"около {{count}} недели",singularGenitive:"около {{count}} недель",pluralGenitive:"около {{count}} недель"},future:{singularNominative:"приблизительно через {{count}} неделю",singularGenitive:"приблизительно через {{count}} недели",pluralGenitive:"приблизительно через {{count}} недель"}}),xWeeks:Y({regular:{singularNominative:"{{count}} неделя",singularGenitive:"{{count}} недели",pluralGenitive:"{{count}} недель"}}),aboutXMonths:Y({regular:{singularNominative:"около {{count}} месяца",singularGenitive:"около {{count}} месяцев",pluralGenitive:"около {{count}} месяцев"},future:{singularNominative:"приблизительно через {{count}} месяц",singularGenitive:"приблизительно через {{count}} месяца",pluralGenitive:"приблизительно через {{count}} месяцев"}}),xMonths:Y({regular:{singularNominative:"{{count}} месяц",singularGenitive:"{{count}} месяца",pluralGenitive:"{{count}} месяцев"}}),aboutXYears:Y({regular:{singularNominative:"около {{count}} года",singularGenitive:"около {{count}} лет",pluralGenitive:"около {{count}} лет"},future:{singularNominative:"приблизительно через {{count}} год",singularGenitive:"приблизительно через {{count}} года",pluralGenitive:"приблизительно через {{count}} лет"}}),xYears:Y({regular:{singularNominative:"{{count}} год",singularGenitive:"{{count}} года",pluralGenitive:"{{count}} лет"}}),overXYears:Y({regular:{singularNominative:"больше {{count}} года",singularGenitive:"больше {{count}} лет",pluralGenitive:"больше {{count}} лет"},future:{singularNominative:"больше, чем через {{count}} год",singularGenitive:"больше, чем через {{count}} года",pluralGenitive:"больше, чем через {{count}} лет"}}),almostXYears:Y({regular:{singularNominative:"почти {{count}} год",singularGenitive:"почти {{count}} года",pluralGenitive:"почти {{count}} лет"},future:{singularNominative:"почти через {{count}} год",singularGenitive:"почти через {{count}} года",pluralGenitive:"почти через {{count}} лет"}})},Tn=(e,t,n)=>Mn[e](t,n);function ce(e){return(t={})=>{const n=t.width?String(t.width):e.defaultWidth;return e.formats[n]||e.formats[e.defaultWidth]}}const Fn={full:"EEEE, d MMMM y 'г.'",long:"d MMMM y 'г.'",medium:"d MMM y 'г.'",short:"dd.MM.y"},En={full:"H:mm:ss zzzz",long:"H:mm:ss z",medium:"H:mm:ss",short:"H:mm"},On={any:"{{date}}, {{time}}"},Ln={date:ce({formats:Fn,defaultWidth:"full"}),time:ce({formats:En,defaultWidth:"full"}),dateTime:ce({formats:On,defaultWidth:"any"})},bt=6048e5,_n=864e5,nt=Symbol.for("constructDateFrom");function $(e,t){return typeof e=="function"?e(t):e&&typeof e=="object"&&nt in e?e[nt](t):e instanceof Date?new e.constructor(t):new Date(t)}function xt(e,...t){const n=$.bind(null,e||t.find(a=>typeof a=="object"));return t.map(n)}let In={};function Fe(){return In}function A(e,t){return $(t||e,e)}function ae(e,t){const n=Fe(),a=t?.weekStartsOn??t?.locale?.options?.weekStartsOn??n.weekStartsOn??n.locale?.options?.weekStartsOn??0,i=A(e,t?.in),o=i.getDay(),s=(o<a?7:0)+o-a;return i.setDate(i.getDate()-s),i.setHours(0,0,0,0),i}function at(e,t,n){const[a,i]=xt(n?.in,e,t);return+ae(a,n)==+ae(i,n)}const He=["воскресенье","понедельник","вторник","среду","четверг","пятницу","субботу"];function Wn(e){const t=He[e];switch(e){case 0:return"'в прошлое "+t+" в' p";case 1:case 2:case 4:return"'в прошлый "+t+" в' p";case 3:case 5:case 6:return"'в прошлую "+t+" в' p"}}function rt(e){const t=He[e];return e===2?"'во "+t+" в' p":"'в "+t+" в' p"}function Bn(e){const t=He[e];switch(e){case 0:return"'в следующее "+t+" в' p";case 1:case 2:case 4:return"'в следующий "+t+" в' p";case 3:case 5:case 6:return"'в следующую "+t+" в' p"}}const An={lastWeek:(e,t,n)=>{const a=e.getDay();return at(e,t,n)?rt(a):Wn(a)},yesterday:"'вчера в' p",today:"'сегодня в' p",tomorrow:"'завтра в' p",nextWeek:(e,t,n)=>{const a=e.getDay();return at(e,t,n)?rt(a):Bn(a)},other:"P"},Gn=(e,t,n,a)=>{const i=An[e];return typeof i=="function"?i(t,n,a):i};function K(e){return(t,n)=>{const a=n?.context?String(n.context):"standalone";let i;if(a==="formatting"&&e.formattingValues){const s=e.defaultFormattingWidth||e.defaultWidth,d=n?.width?String(n.width):s;i=e.formattingValues[d]||e.formattingValues[s]}else{const s=e.defaultWidth,d=n?.width?String(n.width):e.defaultWidth;i=e.values[d]||e.values[s]}const o=e.argumentCallback?e.argumentCallback(t):t;return i[o]}}const qn={narrow:["до н.э.","н.э."],abbreviated:["до н. э.","н. э."],wide:["до нашей эры","нашей эры"]},Yn={narrow:["1","2","3","4"],abbreviated:["1-й кв.","2-й кв.","3-й кв.","4-й кв."],wide:["1-й квартал","2-й квартал","3-й квартал","4-й квартал"]},Vn={narrow:["Я","Ф","М","А","М","И","И","А","С","О","Н","Д"],abbreviated:["янв.","фев.","март","апр.","май","июнь","июль","авг.","сент.","окт.","нояб.","дек."],wide:["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"]},Hn={narrow:["Я","Ф","М","А","М","И","И","А","С","О","Н","Д"],abbreviated:["янв.","фев.","мар.","апр.","мая","июн.","июл.","авг.","сент.","окт.","нояб.","дек."],wide:["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"]},$n={narrow:["В","П","В","С","Ч","П","С"],short:["вс","пн","вт","ср","чт","пт","сб"],abbreviated:["вск","пнд","втр","срд","чтв","птн","суб"],wide:["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"]},Kn={narrow:{am:"ДП",pm:"ПП",midnight:"полн.",noon:"полд.",morning:"утро",afternoon:"день",evening:"веч.",night:"ночь"},abbreviated:{am:"ДП",pm:"ПП",midnight:"полн.",noon:"полд.",morning:"утро",afternoon:"день",evening:"веч.",night:"ночь"},wide:{am:"ДП",pm:"ПП",midnight:"полночь",noon:"полдень",morning:"утро",afternoon:"день",evening:"вечер",night:"ночь"}},Un={narrow:{am:"ДП",pm:"ПП",midnight:"полн.",noon:"полд.",morning:"утра",afternoon:"дня",evening:"веч.",night:"ночи"},abbreviated:{am:"ДП",pm:"ПП",midnight:"полн.",noon:"полд.",morning:"утра",afternoon:"дня",evening:"веч.",night:"ночи"},wide:{am:"ДП",pm:"ПП",midnight:"полночь",noon:"полдень",morning:"утра",afternoon:"дня",evening:"вечера",night:"ночи"}},zn=(e,t)=>{const n=Number(e),a=t?.unit;let i;return a==="date"?i="-е":a==="week"||a==="minute"||a==="second"?i="-я":i="-й",n+i},Xn={ordinalNumber:zn,era:K({values:qn,defaultWidth:"wide"}),quarter:K({values:Yn,defaultWidth:"wide",argumentCallback:e=>e-1}),month:K({values:Vn,defaultWidth:"wide",formattingValues:Hn,defaultFormattingWidth:"wide"}),day:K({values:$n,defaultWidth:"wide"}),dayPeriod:K({values:Kn,defaultWidth:"any",formattingValues:Un,defaultFormattingWidth:"wide"})};function U(e){return(t,n={})=>{const a=n.width,i=a&&e.matchPatterns[a]||e.matchPatterns[e.defaultMatchWidth],o=t.match(i);if(!o)return null;const s=o[0],d=a&&e.parsePatterns[a]||e.parsePatterns[e.defaultParseWidth],f=Array.isArray(d)?Jn(d,u=>u.test(s)):Qn(d,u=>u.test(s));let y;y=e.valueCallback?e.valueCallback(f):f,y=n.valueCallback?n.valueCallback(y):y;const h=t.slice(s.length);return{value:y,rest:h}}}function Qn(e,t){for(const n in e)if(Object.prototype.hasOwnProperty.call(e,n)&&t(e[n]))return n}function Jn(e,t){for(let n=0;n<e.length;n++)if(t(e[n]))return n}function wt(e){return(t,n={})=>{const a=t.match(e.matchPattern);if(!a)return null;const i=a[0],o=t.match(e.parsePattern);if(!o)return null;let s=e.valueCallback?e.valueCallback(o[0]):o[0];s=n.valueCallback?n.valueCallback(s):s;const d=t.slice(i.length);return{value:s,rest:d}}}const Zn=/^(\d+)(-?(е|я|й|ое|ье|ая|ья|ый|ой|ий|ый))?/i,ea=/\d+/i,ta={narrow:/^((до )?н\.?\s?э\.?)/i,abbreviated:/^((до )?н\.?\s?э\.?)/i,wide:/^(до нашей эры|нашей эры|наша эра)/i},na={any:[/^д/i,/^н/i]},aa={narrow:/^[1234]/i,abbreviated:/^[1234](-?[ыои]?й?)? кв.?/i,wide:/^[1234](-?[ыои]?й?)? квартал/i},ra={any:[/1/i,/2/i,/3/i,/4/i]},ia={narrow:/^[яфмаисонд]/i,abbreviated:/^(янв|фев|март?|апр|ма[йя]|июн[ья]?|июл[ья]?|авг|сент?|окт|нояб?|дек)\.?/i,wide:/^(январ[ья]|феврал[ья]|марта?|апрел[ья]|ма[йя]|июн[ья]|июл[ья]|августа?|сентябр[ья]|октябр[ья]|октябр[ья]|ноябр[ья]|декабр[ья])/i},sa={narrow:[/^я/i,/^ф/i,/^м/i,/^а/i,/^м/i,/^и/i,/^и/i,/^а/i,/^с/i,/^о/i,/^н/i,/^я/i],any:[/^я/i,/^ф/i,/^мар/i,/^ап/i,/^ма[йя]/i,/^июн/i,/^июл/i,/^ав/i,/^с/i,/^о/i,/^н/i,/^д/i]},oa={narrow:/^[впсч]/i,short:/^(вс|во|пн|по|вт|ср|чт|че|пт|пя|сб|су)\.?/i,abbreviated:/^(вск|вос|пнд|пон|втр|вто|срд|сре|чтв|чет|птн|пят|суб).?/i,wide:/^(воскресень[ея]|понедельника?|вторника?|сред[аы]|четверга?|пятниц[аы]|суббот[аы])/i},la={narrow:[/^в/i,/^п/i,/^в/i,/^с/i,/^ч/i,/^п/i,/^с/i],any:[/^в[ос]/i,/^п[он]/i,/^в/i,/^ср/i,/^ч/i,/^п[ят]/i,/^с[уб]/i]},ca={narrow:/^([дп]п|полн\.?|полд\.?|утр[оа]|день|дня|веч\.?|ноч[ьи])/i,abbreviated:/^([дп]п|полн\.?|полд\.?|утр[оа]|день|дня|веч\.?|ноч[ьи])/i,wide:/^([дп]п|полночь|полдень|утр[оа]|день|дня|вечера?|ноч[ьи])/i},ua={any:{am:/^дп/i,pm:/^пп/i,midnight:/^полн/i,noon:/^полд/i,morning:/^у/i,afternoon:/^д[ен]/i,evening:/^в/i,night:/^н/i}},da={ordinalNumber:wt({matchPattern:Zn,parsePattern:ea,valueCallback:e=>parseInt(e,10)}),era:U({matchPatterns:ta,defaultMatchWidth:"wide",parsePatterns:na,defaultParseWidth:"any"}),quarter:U({matchPatterns:aa,defaultMatchWidth:"wide",parsePatterns:ra,defaultParseWidth:"any",valueCallback:e=>e+1}),month:U({matchPatterns:ia,defaultMatchWidth:"wide",parsePatterns:sa,defaultParseWidth:"any"}),day:U({matchPatterns:oa,defaultMatchWidth:"wide",parsePatterns:la,defaultParseWidth:"any"}),dayPeriod:U({matchPatterns:ca,defaultMatchWidth:"wide",parsePatterns:ua,defaultParseWidth:"any"})},pa={code:"ru",formatDistance:Tn,formatLong:Ln,formatRelative:Gn,localize:Xn,match:da,options:{weekStartsOn:1,firstWeekContainsDate:1}};class kt extends Date{constructor(){super(),this.setTime(arguments.length===0?Date.now():arguments.length===1?typeof arguments[0]=="string"?+new Date(arguments[0]):arguments[0]:Date.UTC(...arguments))}getTimezoneOffset(){return 0}}const it=/^(get|set)(?!UTC)/;Object.getOwnPropertyNames(Date.prototype).forEach(e=>{if(it.test(e)){const t=Date.prototype[e.replace(it,"$1UTC")];t&&(kt.prototype[e]=t)}});function $e(e,t,n){const a=A(e,n?.in);return isNaN(t)?$(e,NaN):(t&&a.setDate(a.getDate()+t),a)}function ma(e,t,n){const a=A(e,n?.in);if(isNaN(t))return $(e,NaN);if(!t)return a;const i=a.getDate(),o=$(e,a.getTime());o.setMonth(a.getMonth()+t+1,0);const s=o.getDate();return i>=s?o:(a.setFullYear(o.getFullYear(),o.getMonth(),i),a)}function Me(e,t){return ae(e,{...t,weekStartsOn:1})}function Nt(e,t){const n=A(e,t?.in),a=n.getFullYear(),i=$(n,0);i.setFullYear(a+1,0,4),i.setHours(0,0,0,0);const o=Me(i),s=$(n,0);s.setFullYear(a,0,4),s.setHours(0,0,0,0);const d=Me(s);return n.getTime()>=o.getTime()?a+1:n.getTime()>=d.getTime()?a:a-1}function st(e){const t=A(e),n=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds()));return n.setUTCFullYear(t.getFullYear()),+e-+n}function ot(e,t){const n=A(e,t?.in);return n.setHours(0,0,0,0),n}function fa(e,t,n){const[a,i]=xt(n?.in,e,t),o=ot(a),s=ot(i),d=+o-st(o),f=+s-st(s);return Math.round((d-f)/_n)}function ga(e,t){const n=Nt(e,t),a=$(e,0);return a.setFullYear(n,0,4),a.setHours(0,0,0,0),Me(a)}function ha(e){return e instanceof Date||typeof e=="object"&&Object.prototype.toString.call(e)==="[object Date]"}function va(e){return!(!ha(e)&&typeof e!="number"||isNaN(+A(e)))}function ya(e,t){const n=A(e,t?.in);return n.setFullYear(n.getFullYear(),0,1),n.setHours(0,0,0,0),n}const ba={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},xa=(e,t,n)=>{let a;const i=ba[e];return typeof i=="string"?a=i:t===1?a=i.one:a=i.other.replace("{{count}}",t.toString()),n?.addSuffix?n.comparison&&n.comparison>0?"in "+a:a+" ago":a},wa={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},ka={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},Na={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},ja={date:ce({formats:wa,defaultWidth:"full"}),time:ce({formats:ka,defaultWidth:"full"}),dateTime:ce({formats:Na,defaultWidth:"full"})},Ca={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},Da=(e,t,n,a)=>Ca[e],Sa={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},Ra={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},Pa={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},Ma={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},Ta={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},Fa={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},Ea=(e,t)=>{const n=Number(e),a=n%100;if(a>20||a<10)switch(a%10){case 1:return n+"st";case 2:return n+"nd";case 3:return n+"rd"}return n+"th"},Oa={ordinalNumber:Ea,era:K({values:Sa,defaultWidth:"wide"}),quarter:K({values:Ra,defaultWidth:"wide",argumentCallback:e=>e-1}),month:K({values:Pa,defaultWidth:"wide"}),day:K({values:Ma,defaultWidth:"wide"}),dayPeriod:K({values:Ta,defaultWidth:"wide",formattingValues:Fa,defaultFormattingWidth:"wide"})},La=/^(\d+)(th|st|nd|rd)?/i,_a=/\d+/i,Ia={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},Wa={any:[/^b/i,/^(a|c)/i]},Ba={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},Aa={any:[/1/i,/2/i,/3/i,/4/i]},Ga={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},qa={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},Ya={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},Va={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},Ha={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},$a={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},Ka={ordinalNumber:wt({matchPattern:La,parsePattern:_a,valueCallback:e=>parseInt(e,10)}),era:U({matchPatterns:Ia,defaultMatchWidth:"wide",parsePatterns:Wa,defaultParseWidth:"any"}),quarter:U({matchPatterns:Ba,defaultMatchWidth:"wide",parsePatterns:Aa,defaultParseWidth:"any",valueCallback:e=>e+1}),month:U({matchPatterns:Ga,defaultMatchWidth:"wide",parsePatterns:qa,defaultParseWidth:"any"}),day:U({matchPatterns:Ya,defaultMatchWidth:"wide",parsePatterns:Va,defaultParseWidth:"any"}),dayPeriod:U({matchPatterns:Ha,defaultMatchWidth:"any",parsePatterns:$a,defaultParseWidth:"any"})},Ua={code:"en-US",formatDistance:xa,formatLong:ja,formatRelative:Da,localize:Oa,match:Ka,options:{weekStartsOn:0,firstWeekContainsDate:1}};function za(e,t){const n=A(e,t?.in);return fa(n,ya(n))+1}function Xa(e,t){const n=A(e,t?.in),a=+Me(n)-+ga(n);return Math.round(a/bt)+1}function jt(e,t){const n=A(e,t?.in),a=n.getFullYear(),i=Fe(),o=t?.firstWeekContainsDate??t?.locale?.options?.firstWeekContainsDate??i.firstWeekContainsDate??i.locale?.options?.firstWeekContainsDate??1,s=$(t?.in||e,0);s.setFullYear(a+1,0,o),s.setHours(0,0,0,0);const d=ae(s,t),f=$(t?.in||e,0);f.setFullYear(a,0,o),f.setHours(0,0,0,0);const y=ae(f,t);return+n>=+d?a+1:+n>=+y?a:a-1}function Qa(e,t){const n=Fe(),a=t?.firstWeekContainsDate??t?.locale?.options?.firstWeekContainsDate??n.firstWeekContainsDate??n.locale?.options?.firstWeekContainsDate??1,i=jt(e,t),o=$(t?.in||e,0);return o.setFullYear(i,0,a),o.setHours(0,0,0,0),ae(o,t)}function Ja(e,t){const n=A(e,t?.in),a=+ae(n,t)-+Qa(n,t);return Math.round(a/bt)+1}function E(e,t){const n=e<0?"-":"",a=Math.abs(e).toString().padStart(t,"0");return n+a}const ee={y(e,t){const n=e.getFullYear(),a=n>0?n:1-n;return E(t==="yy"?a%100:a,t.length)},M(e,t){const n=e.getMonth();return t==="M"?String(n+1):E(n+1,2)},d(e,t){return E(e.getDate(),t.length)},a(e,t){const n=e.getHours()/12>=1?"pm":"am";switch(t){case"a":case"aa":return n.toUpperCase();case"aaa":return n;case"aaaaa":return n[0];default:return n==="am"?"a.m.":"p.m."}},h(e,t){return E(e.getHours()%12||12,t.length)},H(e,t){return E(e.getHours(),t.length)},m(e,t){return E(e.getMinutes(),t.length)},s(e,t){return E(e.getSeconds(),t.length)},S(e,t){const n=t.length,a=e.getMilliseconds(),i=Math.trunc(a*Math.pow(10,n-3));return E(i,t.length)}},oe={midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},lt={G:function(e,t,n){const a=e.getFullYear()>0?1:0;switch(t){case"G":case"GG":case"GGG":return n.era(a,{width:"abbreviated"});case"GGGGG":return n.era(a,{width:"narrow"});default:return n.era(a,{width:"wide"})}},y:function(e,t,n){if(t==="yo"){const a=e.getFullYear(),i=a>0?a:1-a;return n.ordinalNumber(i,{unit:"year"})}return ee.y(e,t)},Y:function(e,t,n,a){const i=jt(e,a),o=i>0?i:1-i;if(t==="YY"){const s=o%100;return E(s,2)}return t==="Yo"?n.ordinalNumber(o,{unit:"year"}):E(o,t.length)},R:function(e,t){const n=Nt(e);return E(n,t.length)},u:function(e,t){const n=e.getFullYear();return E(n,t.length)},Q:function(e,t,n){const a=Math.ceil((e.getMonth()+1)/3);switch(t){case"Q":return String(a);case"QQ":return E(a,2);case"Qo":return n.ordinalNumber(a,{unit:"quarter"});case"QQQ":return n.quarter(a,{width:"abbreviated",context:"formatting"});case"QQQQQ":return n.quarter(a,{width:"narrow",context:"formatting"});default:return n.quarter(a,{width:"wide",context:"formatting"})}},q:function(e,t,n){const a=Math.ceil((e.getMonth()+1)/3);switch(t){case"q":return String(a);case"qq":return E(a,2);case"qo":return n.ordinalNumber(a,{unit:"quarter"});case"qqq":return n.quarter(a,{width:"abbreviated",context:"standalone"});case"qqqqq":return n.quarter(a,{width:"narrow",context:"standalone"});default:return n.quarter(a,{width:"wide",context:"standalone"})}},M:function(e,t,n){const a=e.getMonth();switch(t){case"M":case"MM":return ee.M(e,t);case"Mo":return n.ordinalNumber(a+1,{unit:"month"});case"MMM":return n.month(a,{width:"abbreviated",context:"formatting"});case"MMMMM":return n.month(a,{width:"narrow",context:"formatting"});default:return n.month(a,{width:"wide",context:"formatting"})}},L:function(e,t,n){const a=e.getMonth();switch(t){case"L":return String(a+1);case"LL":return E(a+1,2);case"Lo":return n.ordinalNumber(a+1,{unit:"month"});case"LLL":return n.month(a,{width:"abbreviated",context:"standalone"});case"LLLLL":return n.month(a,{width:"narrow",context:"standalone"});default:return n.month(a,{width:"wide",context:"standalone"})}},w:function(e,t,n,a){const i=Ja(e,a);return t==="wo"?n.ordinalNumber(i,{unit:"week"}):E(i,t.length)},I:function(e,t,n){const a=Xa(e);return t==="Io"?n.ordinalNumber(a,{unit:"week"}):E(a,t.length)},d:function(e,t,n){return t==="do"?n.ordinalNumber(e.getDate(),{unit:"date"}):ee.d(e,t)},D:function(e,t,n){const a=za(e);return t==="Do"?n.ordinalNumber(a,{unit:"dayOfYear"}):E(a,t.length)},E:function(e,t,n){const a=e.getDay();switch(t){case"E":case"EE":case"EEE":return n.day(a,{width:"abbreviated",context:"formatting"});case"EEEEE":return n.day(a,{width:"narrow",context:"formatting"});case"EEEEEE":return n.day(a,{width:"short",context:"formatting"});default:return n.day(a,{width:"wide",context:"formatting"})}},e:function(e,t,n,a){const i=e.getDay(),o=(i-a.weekStartsOn+8)%7||7;switch(t){case"e":return String(o);case"ee":return E(o,2);case"eo":return n.ordinalNumber(o,{unit:"day"});case"eee":return n.day(i,{width:"abbreviated",context:"formatting"});case"eeeee":return n.day(i,{width:"narrow",context:"formatting"});case"eeeeee":return n.day(i,{width:"short",context:"formatting"});default:return n.day(i,{width:"wide",context:"formatting"})}},c:function(e,t,n,a){const i=e.getDay(),o=(i-a.weekStartsOn+8)%7||7;switch(t){case"c":return String(o);case"cc":return E(o,t.length);case"co":return n.ordinalNumber(o,{unit:"day"});case"ccc":return n.day(i,{width:"abbreviated",context:"standalone"});case"ccccc":return n.day(i,{width:"narrow",context:"standalone"});case"cccccc":return n.day(i,{width:"short",context:"standalone"});default:return n.day(i,{width:"wide",context:"standalone"})}},i:function(e,t,n){const a=e.getDay(),i=a===0?7:a;switch(t){case"i":return String(i);case"ii":return E(i,t.length);case"io":return n.ordinalNumber(i,{unit:"day"});case"iii":return n.day(a,{width:"abbreviated",context:"formatting"});case"iiiii":return n.day(a,{width:"narrow",context:"formatting"});case"iiiiii":return n.day(a,{width:"short",context:"formatting"});default:return n.day(a,{width:"wide",context:"formatting"})}},a:function(e,t,n){const i=e.getHours()/12>=1?"pm":"am";switch(t){case"a":case"aa":return n.dayPeriod(i,{width:"abbreviated",context:"formatting"});case"aaa":return n.dayPeriod(i,{width:"abbreviated",context:"formatting"}).toLowerCase();case"aaaaa":return n.dayPeriod(i,{width:"narrow",context:"formatting"});default:return n.dayPeriod(i,{width:"wide",context:"formatting"})}},b:function(e,t,n){const a=e.getHours();let i;switch(a===12?i=oe.noon:a===0?i=oe.midnight:i=a/12>=1?"pm":"am",t){case"b":case"bb":return n.dayPeriod(i,{width:"abbreviated",context:"formatting"});case"bbb":return n.dayPeriod(i,{width:"abbreviated",context:"formatting"}).toLowerCase();case"bbbbb":return n.dayPeriod(i,{width:"narrow",context:"formatting"});default:return n.dayPeriod(i,{width:"wide",context:"formatting"})}},B:function(e,t,n){const a=e.getHours();let i;switch(a>=17?i=oe.evening:a>=12?i=oe.afternoon:a>=4?i=oe.morning:i=oe.night,t){case"B":case"BB":case"BBB":return n.dayPeriod(i,{width:"abbreviated",context:"formatting"});case"BBBBB":return n.dayPeriod(i,{width:"narrow",context:"formatting"});default:return n.dayPeriod(i,{width:"wide",context:"formatting"})}},h:function(e,t,n){if(t==="ho"){let a=e.getHours()%12;return a===0&&(a=12),n.ordinalNumber(a,{unit:"hour"})}return ee.h(e,t)},H:function(e,t,n){return t==="Ho"?n.ordinalNumber(e.getHours(),{unit:"hour"}):ee.H(e,t)},K:function(e,t,n){const a=e.getHours()%12;return t==="Ko"?n.ordinalNumber(a,{unit:"hour"}):E(a,t.length)},k:function(e,t,n){let a=e.getHours();return a===0&&(a=24),t==="ko"?n.ordinalNumber(a,{unit:"hour"}):E(a,t.length)},m:function(e,t,n){return t==="mo"?n.ordinalNumber(e.getMinutes(),{unit:"minute"}):ee.m(e,t)},s:function(e,t,n){return t==="so"?n.ordinalNumber(e.getSeconds(),{unit:"second"}):ee.s(e,t)},S:function(e,t){return ee.S(e,t)},X:function(e,t,n){const a=e.getTimezoneOffset();if(a===0)return"Z";switch(t){case"X":return ut(a);case"XXXX":case"XX":return se(a);default:return se(a,":")}},x:function(e,t,n){const a=e.getTimezoneOffset();switch(t){case"x":return ut(a);case"xxxx":case"xx":return se(a);default:return se(a,":")}},O:function(e,t,n){const a=e.getTimezoneOffset();switch(t){case"O":case"OO":case"OOO":return"GMT"+ct(a,":");default:return"GMT"+se(a,":")}},z:function(e,t,n){const a=e.getTimezoneOffset();switch(t){case"z":case"zz":case"zzz":return"GMT"+ct(a,":");default:return"GMT"+se(a,":")}},t:function(e,t,n){const a=Math.trunc(+e/1e3);return E(a,t.length)},T:function(e,t,n){return E(+e,t.length)}};function ct(e,t=""){const n=e>0?"-":"+",a=Math.abs(e),i=Math.trunc(a/60),o=a%60;return o===0?n+String(i):n+String(i)+t+E(o,2)}function ut(e,t){return e%60===0?(e>0?"-":"+")+E(Math.abs(e)/60,2):se(e,t)}function se(e,t=""){const n=e>0?"-":"+",a=Math.abs(e),i=E(Math.trunc(a/60),2),o=E(a%60,2);return n+i+t+o}const dt=(e,t)=>{switch(e){case"P":return t.date({width:"short"});case"PP":return t.date({width:"medium"});case"PPP":return t.date({width:"long"});default:return t.date({width:"full"})}},Ct=(e,t)=>{switch(e){case"p":return t.time({width:"short"});case"pp":return t.time({width:"medium"});case"ppp":return t.time({width:"long"});default:return t.time({width:"full"})}},Za=(e,t)=>{const n=e.match(/(P+)(p+)?/)||[],a=n[1],i=n[2];if(!i)return dt(e,t);let o;switch(a){case"P":o=t.dateTime({width:"short"});break;case"PP":o=t.dateTime({width:"medium"});break;case"PPP":o=t.dateTime({width:"long"});break;default:o=t.dateTime({width:"full"});break}return o.replace("{{date}}",dt(a,t)).replace("{{time}}",Ct(i,t))},er={p:Ct,P:Za},tr=/^D+$/,nr=/^Y+$/,ar=["D","DD","YY","YYYY"];function rr(e){return tr.test(e)}function ir(e){return nr.test(e)}function sr(e,t,n){const a=or(e,t,n);if(console.warn(a),ar.includes(e))throw new RangeError(a)}function or(e,t,n){const a=e[0]==="Y"?"years":"days of the month";return`Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${a} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`}const lr=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,cr=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,ur=/^'([^]*?)'?$/,dr=/''/g,pr=/[a-zA-Z]/;function ye(e,t,n){const a=Fe(),i=n?.locale??a.locale??Ua,o=n?.firstWeekContainsDate??n?.locale?.options?.firstWeekContainsDate??a.firstWeekContainsDate??a.locale?.options?.firstWeekContainsDate??1,s=n?.weekStartsOn??n?.locale?.options?.weekStartsOn??a.weekStartsOn??a.locale?.options?.weekStartsOn??0,d=A(e,n?.in);if(!va(d))throw new RangeError("Invalid time value");let f=t.match(cr).map(h=>{const u=h[0];if(u==="p"||u==="P"){const l=er[u];return l(h,i.formatLong)}return h}).join("").match(lr).map(h=>{if(h==="''")return{isToken:!1,value:"'"};const u=h[0];if(u==="'")return{isToken:!1,value:mr(h)};if(lt[u])return{isToken:!0,value:h};if(u.match(pr))throw new RangeError("Format string contains an unescaped latin alphabet character `"+u+"`");return{isToken:!1,value:h}});i.localize.preprocessor&&(f=i.localize.preprocessor(d,f));const y={firstWeekContainsDate:o,weekStartsOn:s,locale:i};return f.map(h=>{if(!h.isToken)return h.value;const u=h.value;(!n?.useAdditionalWeekYearTokens&&ir(u)||!n?.useAdditionalDayOfYearTokens&&rr(u))&&sr(u,t,String(e));const l=lt[u[0]];return l(d,u,i.localize,y)}).join("")}function mr(e){const t=e.match(ur);return t?t[1].replace(dr,"'"):e}function Dt(e,t){const n=A(e,t?.in),a=n.getFullYear(),i=n.getMonth(),o=$(n,0);return o.setFullYear(a,i+1,0),o.setHours(0,0,0,0),o.getDate()}function fr(e,t,n){const a=+A(e,n?.in),[i,o]=[+A(t.start,n?.in),+A(t.end,n?.in)].sort((s,d)=>s-d);return a>=i&&a<=o}const ue=35,Ke=e=>1+Math.floor((e-1)/ue)*ue,be=(e,t=2)=>String(e).padStart(t,"0");function z(e,t){const n=new kt(2e3,0,1,12);return n.setFullYear(e,t-1,1),n}function X(e,t){const n=e[t]??"";if(!(t==="year"?/^\d{4}$/:/^\d{2}$/).test(n))return;const a=t==="year"?9999:t==="month"?12:31,i=Number(n);return i>=1&&i<=a?i:void 0}function Te(e){const t=X(e,"month");return t?Dt(z(X(e,"year")??2e3,t)):31}function Q(e){const t=X(e,"day");return t&&t<=Te(e)&&X(e,"month")&&X(e,"year")?[e.year,e.month,e.day].join("-"):null}function St(e){if(typeof e!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(e))return{};const[t,n,a]=e.split("-"),i={year:t,month:n,day:a};return Q(i)?i:{}}function Rt(e){const t=Q(e.start),n=Q(e.end);return t&&n&&t<=n?{start:t,end:n}:null}function pt(e){return Q(e)?$e(z(Number(e.year),Number(e.month)),Number(e.day)-1):null}function ne(e,t){return z(X(e,"year")??t.getFullYear(),X(e,"month")??t.getMonth()+1)}function Be(e,t,n){const a=e.getFullYear();if(t==="year"){const o=Ke(a)+n*ue;return o>=1&&o<=9999?z(o,e.getMonth()+1):null}const i=ma(e,n*(t==="month"?12:1));return i.getFullYear()>=1&&i.getFullYear()<=9999?i:null}function Pt(e,t,n,a){const i={...e};return a&&t!=="year"&&(i.year=be(a.getFullYear(),4)),a&&t==="day"&&(i.month=be(a.getMonth()+1)),i[t]=be(n,t==="year"?4:2),t!=="day"&&Number(i.day)>Te(i)&&delete i.day,i}function mt(e,t,n,a,i,o){const s=t.getFullYear(),d=t.getMonth()+1,f=z(s,d),y=e==="year"?Ke(s):1,h=e==="year"?Math.min(y+ue-1,9999):e==="month"?12:Dt(f),u=ae(f,{locale:a}),l=(f.getDay()-u.getDay()+7)%7,p=(e==="year"||n.year===be(s,4))&&(e!=="day"||n.month===be(d))?X(n,e):void 0,x=new Intl.NumberFormat(a.code,{useGrouping:!1,minimumIntegerDigits:e==="year"?4:1}),k=o&&pt(o.draft.start),j=o&&pt(o.draft.end),N=k&&j&&k<=j?{start:k,end:j}:null,S=Array.from({length:h-y+1},(c,v)=>{const C=y+v,P=e==="month"?z(s,C):e==="day"?$e(f,v):f,F=e==="month"?ye(P,"LLLL",{locale:a}):x.format(C);let V;if(o&&e!=="day"){const B=o.endpoint==="end"?k:j;if(B){const w=e==="year"?C:s*12+C,T=e==="year"?B.getFullYear():B.getFullYear()*12+B.getMonth()+1;V={disabled:o.endpoint==="end"?w<T:w>T}}}if(o&&e==="day"){const B=!!k&&+P==+k,w=!!j&&+P==+j,T=!!N&&fr(P,N),M=(l+v)%7;V={rangeStart:B,rangeEnd:w,inRange:T,bandStart:T&&(B||v===0||M===0),bandEnd:T&&(w||C===h||M===6),disabled:o.endpoint==="end"?!!k&&P<k:!!j&&P>j}}return{...V,value:C,label:F,selected:p===C,today:e==="day"&&s===i.getFullYear()&&d===i.getMonth()+1&&C===i.getDate(),accessibleLabel:e==="day"?ye(P,"PPPP",{locale:a}):F,column:e==="day"&&v===0?l+1:void 0}}),R=e==="day"?gr(u,a):[],D=e==="year"?x.format(y)+" – "+x.format(h):ye(f,e==="day"?"LLLL yyyy":"yyyy",{locale:a});return{pageIndex:e==="year"?(y-1)/ue:e==="month"?s-1:(s-1)*12+d-1,first:y,cells:S,weekdays:R,caption:D,columns:e==="year"?5:e==="month"?3:7}}function gr(e,t){const n=new Intl.Locale(t.code),a=n.getWeekInfo?.().weekend??n.weekInfo?.weekend??[6,7];return Array.from({length:7},(i,o)=>{const s=$e(e,o);return{label:ye(s,"EEEEEE",{locale:t}),fullLabel:ye(s,"EEEE",{locale:t}),weekend:a.includes(s.getDay()||7)}})}function hr({part:e,view:t,draft:n,locale:a,today:i,range:o}){return m.useMemo(()=>{const s=mt(e,t,n,a,i,o),d=Be(t,e,-1),f=Be(t,e,1),y=h=>h?[mt(e,h,n,a,i,o)]:[];return{current:s,pages:[...y(d),s,...y(f)],canBack:!!d,canForward:!!f}},[e,t,n,a,i,o?.draft,o?.endpoint])}function Ae({draft:e,onChange:t,locale:n=pa,today:a}){const[i]=m.useState(()=>new Date),o=a??i,[s,d]=m.useState("day"),[f,y]=m.useState(!1),[h,u]=m.useState(()=>ne(e,o)),[l,p]=m.useState(null),x=m.useMemo(()=>new Intl.DateTimeFormat(n.code,{calendar:"gregory",timeZone:"UTC",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(z(2006,11)).filter(c=>["year","month","day","literal"].includes(c.type)),[n]);function k(c,v){v?u(ne(e,v)):f||u(ne(e,o)),d(c),y(!0)}function j(c,v){!/^\d*$/.test(v)||v.length>(c==="year"?4:2)||(p(null),t({...e,[c]:v}))}function N(c,v,C=!0){if(!Number.isInteger(v)||v<1||v>(c==="year"?9999:c==="month"?12:31))return;const P=Pt(e,c,v,C?h:void 0);if(!(c==="day"&&v>Te(P))&&(p(null),t(P),c!=="day")){const F=C?h:ne(P,h);u(z(c==="year"?v:F.getFullYear(),c==="month"?v:F.getMonth()+1)),d(c==="year"?"month":"day")}}function S(){p(e),t({}),y(!1),u(ne({},o))}function R(){l&&(t(l),u(ne(l,o)),p(null))}const D=m.useCallback(c=>u(v=>Be(v,s,c)??v),[s]),g=m.useCallback(c=>{const v=1+c*ue;!Number.isInteger(c)||v<1||v>9999||u(C=>Ke(C.getFullYear())===v?C:z(v,C.getMonth()+1))},[]);return{part:s,isOpen:f,view:h,today:o,locale:n,pattern:x,draft:e,value:Q(e),canUndo:l!==null,maxDay:Te(e),partValue:c=>X(e,c),open:k,close:()=>y(!1),edit:j,choose:N,reset:S,undo:R,page:D,goToYearPage:g}}function vr({draft:e,onChange:t,...n}){const[a,i]=m.useState("start"),[o,s]=m.useState(null);function d(k,j){s(null),t({...e,[k]:j})}const f=Ae({...n,draft:e.start,onChange:k=>d("start",k)}),y=Ae({...n,draft:e.end,onChange:k=>d("end",k)}),h={start:f,end:y};function u(k){const j=h[k],N=k==="start"?"end":"start",S=h[N];function R(g){S.close(),i(k),j.open(g,j.isOpen?void 0:ne(S.draft,j.today))}function D(g,c,v=!0){const C=v||g==="day"&&!!S.value&&!j.draft.year&&!j.draft.month,P=Pt(j.draft,g,c,C?j.view:void 0),F=Q(P);if(!(v&&g==="day"&&F&&S.value&&(k==="end"?F<S.value:F>S.value))&&(j.choose(g,c,C),(g==="day"||!v)&&F&&!S.value))return j.close(),i(N),S.open("day",ne(P,j.view)),N}return{...j,open:R,choose:D}}const l={start:u("start"),end:u("end")};function p(){s(e),f.close(),y.close(),i("start"),t({start:{},end:{}})}function x(){o&&t(o),s(null)}return{endpoints:l,endpoint:a,calendar:l[a],range:{draft:e,endpoint:a},value:Rt(e),reset:p,undo:x,canUndo:o!==null}}function yr({id:e,label:t,header:n,meta:a,children:i}){return r.jsxs("div",{id:e,className:"neui-ridge neui-track-focus",children:[r.jsx("span",{slot:"label",id:e+"-label",children:t}),n&&r.jsx("div",{slot:"header",children:n}),i,O(a&&r.jsx("div",{slot:"meta",className:"neui-collapse-block neui-meta-panel",children:r.jsx("div",{className:"neui-reveal-clip neui-meta-actions",children:a})}))]})}function J({frame:e=yr,id:t,label:n,header:a,meta:i,description:o,error:s,children:d}){const f=[o&&t+"-description",s&&t+"-error"].filter(Boolean).join(" ")||void 0;return r.jsx(e,{id:t,label:n,header:a,meta:i,children:r.jsxs("fieldset",{className:"neui-group","aria-labelledby":t+"-label","aria-describedby":f,children:[d,O(o&&r.jsx("div",{className:"neui-collapse-block",children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsx("p",{id:t+"-description",className:"neui-note",children:o})})})),O(s&&r.jsx("div",{className:"neui-collapse-block",children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsx("p",{id:t+"-error",className:"neui-note neui-error",role:"status",children:s})})}))]})})}function br(){const e=m.useRef(null),t=m.useRef(!1);function n(a){if(e.current?.id!==a.pointerId)return;const i=a.currentTarget;if(e.current=null,!i.hasAttribute("data-dragging"))return;const s=Array.from(i.children,d=>d.offsetLeft).reduce((d,f)=>Math.abs(f-i.scrollLeft)<Math.abs(d-i.scrollLeft)?f:d);i.removeAttribute("data-dragging"),i.hasPointerCapture(a.pointerId)&&i.releasePointerCapture(a.pointerId),i.scrollTo({left:s,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"})}return{onPointerDown(a){t.current=!1,a.pointerType==="mouse"&&a.button===0&&(e.current={x:a.clientX,scroll:a.currentTarget.scrollLeft,id:a.pointerId})},onPointerMove(a){const i=e.current,o=a.currentTarget;if(!i||i.id!==a.pointerId)return;if(!a.buttons){n(a);return}const s=i.x-a.clientX;!t.current&&Math.abs(s)<5||(t.current||(t.current=!0,o.setAttribute("data-dragging",""),o.setPointerCapture(a.pointerId)),o.scrollLeft=i.scroll+s)},onPointerUp:n,onPointerCancel:n,onLostPointerCapture:n,onClickCapture(a){t.current&&a.detail&&(a.stopPropagation(),t.current=!1)}}}const we={start:"Начало периода",end:"Конец периода"},xe={year:"Год",month:"Месяц",day:"День"},Ge=["year","month","day"],xr={day:"neui-calendar-days",month:"neui-calendar-months",year:"neui-calendar-years"},wr={day:["Предыдущий месяц","Следующий месяц"],month:["Предыдущий год","Следующий год"],year:["Предыдущие 35 лет","Следующие 35 лет"]};function kr({calendar:e,part:t,focusNext:n,range:a}){const{view:i,page:o}=e,{current:s,pages:d,canBack:f,canForward:y}=hr({...e,part:t,range:a}),h=t===e.part&&e.isOpen,u=m.useRef(null),l=br(),p=m.useRef(null),x=m.useRef(!1),[k,j]=m.useState(null),N=s.cells.find(w=>w.selected),S=a?.draft[a.endpoint==="start"?"end":"start"],R=t==="day"&&S&&Number(S.year)===i.getFullYear()&&Number(S.month)===i.getMonth()+1?Number(S.day):void 0,D=N?.value??R??(t==="year"?i.getFullYear():t==="month"?i.getMonth()+1:1),g=s.cells.filter(w=>!w.disabled),c=g.find(w=>w.value===D)?.value??g[0]?.value,v=k!==null&&g.some(w=>w.value===k)?k:c,C=t+s.caption+(a?.endpoint??"");m.useLayoutEffect(()=>{h&&(j(null),(n.current||x.current)&&(p.current?.querySelector('[data-current="true"] [data-value="'+c+'"]')?.focus({preventScroll:!0}),n.current=!1,x.current=!1))},[h,C]),m.useLayoutEffect(()=>{const w=u.current;if(!h||!w)return;const T=w.querySelector('[data-current="true"]');if(!T)return;let M=w.clientWidth,H,G=!1;const Z=()=>{w.scrollLeft=T.offsetLeft},I=()=>{if(G||!w.clientWidth||w.hasAttribute("data-dragging"))return;const ie=w.scrollLeft-T.offsetLeft,je=ie<0?-1:1,me=je<0?T.previousElementSibling:T.nextElementSibling;!(me instanceof HTMLElement)||Math.abs(ie)<w.clientWidth/2||Math.abs(w.scrollLeft-me.offsetLeft)>1||(G=!0,x.current||=T.contains(document.activeElement),o(je))},re=()=>{clearTimeout(H),H=setTimeout(I,120)};Z();const pe=new ResizeObserver(()=>{M!==w.clientWidth&&(M=w.clientWidth,Z())});return pe.observe(w),w.addEventListener("scrollend",I),"onscrollend"in window||w.addEventListener("scroll",re,{passive:!0}),()=>{pe.disconnect(),clearTimeout(H),w.removeEventListener("scrollend",I),w.removeEventListener("scroll",re)}},[h,s.pageIndex,a?.endpoint,o]);function P(w){if(w<0?!f:!y)return;const T=u.current,M=T?.children[d.indexOf(s)+w];M&&T?.clientWidth?T.scrollTo({left:M.offsetLeft,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"}):e.page(w)}function F(w,T){const M=s.cells.length-1,H={ArrowRight:T+1,ArrowLeft:T-1,ArrowUp:T-s.columns,ArrowDown:T+s.columns,Home:0,End:M};if(w.key==="PageUp"||w.key==="PageDown")w.preventDefault(),x.current=!0,P(w.key==="PageUp"?-1:1);else if(w.key in H){if(w.preventDefault(),!g.length)return;const G=s.cells.indexOf(g[0]),Z=s.cells.indexOf(g[g.length-1]),I=s.cells[Math.max(G,Math.min(Z,H[w.key]))].value;j(I),p.current?.querySelector('[data-current="true"] [data-value="'+I+'"]')?.focus({preventScroll:!0})}}const V=d.map(w=>{const T=w===s;return r.jsx("div",{"data-current":T,"data-page":w.pageIndex,role:"radiogroup","aria-label":(a?we[a.endpoint]+", ":"")+xe[t]+", "+w.caption,"aria-hidden":!T||void 0,...T?{}:{inert:""},className:"neui-calendar-grid "+xr[t],children:w.cells.map((M,H)=>r.jsxs("button",{type:"button",role:"radio",className:"neui-date-cell neui-ripple"+(a&&t==="day"?" neui-calendar-range-day":""),"data-value":M.value,disabled:M.disabled,"data-in-range":M.inRange||void 0,"data-band-start":M.bandStart||void 0,"data-band-end":M.bandEnd||void 0,"data-endpoint":M.rangeStart||M.rangeEnd||void 0,"aria-label":[M.accessibleLabel,M.rangeStart&&"начало периода",M.rangeEnd&&"конец периода"].filter(Boolean).join(", "),"aria-checked":M.selected,"aria-current":M.today?"date":void 0,tabIndex:h&&T&&M.value===v?0:-1,style:{gridColumnStart:M.column},onKeyDown:G=>F(G,H),onClick:G=>{!h||!T||((t!=="day"||a&&!Q(a.draft[a.endpoint==="start"?"end":"start"]))&&(n.current=!0),e.choose(t,M.value),G.detail===0&&t==="day"&&j(M.value))},children:[r.jsx("span",{children:M.label}),r.jsx("span",{"aria-hidden":"true",className:a?"neui-check-box":"neui-check-radio"})]},M.value))},w.pageIndex)}),B=Ge.indexOf(t)-Ge.indexOf(e.part);return r.jsxs("section",{ref:p,"data-level":t,"data-direction":Math.sign(B),"aria-hidden":!h||void 0,...h?{}:{inert:""},className:"neui-date-screen",children:[r.jsxs("div",{className:"neui-date-nav",children:[r.jsxs("small",{"aria-live":h?"polite":"off",children:[a&&r.jsxs(r.Fragment,{children:[we[a.endpoint]," · "]}),t==="year"?r.jsxs(r.Fragment,{children:["Годы",r.jsxs("span",{className:"sr-only",children:[", ",s.caption]})]}):s.caption]}),[-1,1].map((w,T)=>r.jsx("button",{type:"button",className:"neui-date-page neui-ripple","aria-label":wr[t][T],disabled:w<0?!f:!y,onClick:()=>P(w),children:r.jsx("span",{"aria-hidden":"true",children:w<0?"‹":"›"})},w))]}),t==="day"&&r.jsx("div",{"aria-hidden":"true",className:"neui-calendar-grid neui-calendar-days neui-date-week",children:s.weekdays.map((w,T)=>r.jsx("span",{title:w.fullLabel,"data-weekend":w.weekend||void 0,children:w.label},T))}),r.jsx("div",{ref:u,...l,className:"neui-calendar-pager",dir:"ltr",children:V})]})}function Mt({calendar:e,panelRef:t,children:n,range:a}){const i=m.useRef(!1),o=m.useRef(null);return m.useLayoutEffect(()=>{const s=t.current,d=o.current;if(!s||!d)return;const f=()=>{d.style.height=s.offsetHeight+"px"};f();const y=new ResizeObserver(f);return y.observe(s),()=>y.disconnect()},[t]),r.jsx("div",{className:"neui-reveal-clip",children:r.jsx("div",{ref:o,className:"neui-date-viewport",children:r.jsxs("div",{className:"neui-date-content",ref:t,children:[n,r.jsx("div",{className:"neui-date-stack",children:Ge.map(s=>r.jsx(kr,{part:s,range:a,calendar:e,focusNext:i},s))})]})})})}function qe(e,t){const{draft:n}=e,a=Object.values(n).some(Boolean),i=Object.keys(xe),o=i.filter(f=>!e.partValue(f)),s=i.find(f=>n[f]?.length===(f==="year"?4:2)&&(!e.partValue(f)||f==="day"&&Number(n.day)>e.maxDay));return{error:s?"Укажите "+xe[s].toLowerCase()+" от 1 до "+(s==="day"?e.maxDay:s==="month"?12:9999)+".":t&&a&&o.length?"Дополните дату. Укажите "+o.map(f=>xe[f].toLowerCase()).join(", ")+".":"",invalid:s,missing:o}}function Tt({calendar:e,id:t,errorId:n,validation:a,panelRef:i,open:o,close:s,endpoint:d,focusEndpoint:f}){const{draft:y,isOpen:h,part:u}=e,{error:l,invalid:p,missing:x}=a,k=m.useRef(null),j=m.useRef({key:"",text:"",time:0}),N=D=>k.current?.querySelector('[data-segment="'+D+'"]')?.focus({preventScroll:!0});function S(D,g){if(D.key==="ArrowDown")D.preventDefault(),o(g),requestAnimationFrame(()=>i.current?.querySelector('[data-level="'+g+'"] [tabindex="0"]')?.focus({preventScroll:!0}));else if(/^\d$/.test(D.key)&&!D.altKey&&!D.metaKey&&!D.ctrlKey){D.preventDefault(),o(g);const c=Date.now(),v=j.current,C=g==="year"?4:2,P=(v.key===g&&c-v.time<1800&&v.text.length<C?v.text:"")+D.key;j.current={key:g,text:P,time:c};const F=Number(P),V=g==="year"?9999:g==="month"?12:e.maxDay;if(P.length===C&&F>=1&&F<=V){j.current.text="";const B=e.choose(g,F,!1);B?f?.(B):g!=="day"&&N(g==="year"?"month":"day")}else e.edit(g,P)}else(D.key==="Backspace"||D.key==="Delete")&&(D.preventDefault(),j.current.text="",e.edit(g,""))}const R=e.locale.code.startsWith("ru")?{day:"ДД",month:"ММ",year:"ГГГГ"}:{day:"DD",month:"MM",year:"YYYY"};return r.jsx("div",{ref:k,className:"neui-date-segments",role:d?"group":void 0,"aria-label":d&&we[d],"data-endpoint-entry":d,children:e.pattern.map(({type:D,value:g},c)=>{if(D==="literal")return r.jsx(m.Fragment,{children:g},c);const v=D;return r.jsx("button",{type:"button","data-segment":v,className:"neui-date-segment neui-ripple","aria-expanded":h&&u===v,"aria-controls":t+"-assistant","aria-label":(d?we[d]+", ":"")+xe[v]+", "+(y[v]||"выбрать"),"aria-invalid":l&&(p===v||x.includes(v))?!0:void 0,"aria-describedby":n,onKeyDown:C=>S(C,v),onBlur:()=>{const C=j.current.key===v?j.current.text:"";j.current.text="",v!=="year"&&/^[1-9]$/.test(C)&&e.edit(v,C.padStart(2,"0"))},onClick:()=>h&&v===u?s():o(v),children:y[v]||R[v]},v)})})}function Ft({id:e,name:t,label:n,draft:a,onChange:i,locale:o}){const s=Ae({draft:a,onChange:i,locale:o}),{isOpen:d,part:f}=s,y=ke(d,{followViewport:!0}),[h,u]=m.useState(!1),l=m.useRef(null),p=m.useRef(null),x=Object.values(a).some(Boolean),k=qe(s,h),{error:j}=k,N=g=>l.current?.querySelector('[data-segment="'+g+'"]')?.focus({preventScroll:!0});function S(g){s.open(g)}function R(){s.close(),u(!0),N(f)}const D=(x||s.canUndo)&&r.jsx("button",{type:"button",className:"neui-pill","aria-label":(s.canUndo?"Вернуть":"Сбросить")+" дату",onClick:()=>{s.canUndo?s.undo():s.reset(),u(!1),N("day")},children:s.canUndo?"Вернуть":"Сбросить"});return r.jsx("div",{className:"neui-date-field",onBlur:g=>{g.currentTarget.contains(g.relatedTarget)||u(!0)},onKeyDown:g=>{g.key==="Escape"&&d&&(g.preventDefault(),R())},children:r.jsxs(J,{id:e,label:n,meta:d&&r.jsxs(r.Fragment,{children:[r.jsx("button",{type:"button",className:"neui-pill","aria-expanded":!0,"aria-label":"Свернуть календарь","aria-controls":e+"-assistant",onClick:R,children:"Свернуть"}),O(D&&r.jsx("span",{className:"neui-collapse-inline",children:r.jsx("span",{className:"neui-reveal-clip",children:D})}))]}),children:[r.jsxs("div",{ref:l,className:"neui-row neui-date-entry",children:[r.jsx("span",{"aria-hidden":"true",className:"neuicon-calendar neui-row-area-leading place-self-center"}),r.jsx(Tt,{calendar:s,id:e,panelRef:p,open:S,close:R,validation:k,errorId:j?e+"-error":void 0}),O(!d&&D&&r.jsx("span",{className:"neui-collapse-inline neui-date-action",children:r.jsx("span",{className:"neui-reveal-clip",children:D})}))]}),O(j&&r.jsx("div",{className:"neui-collapse-block",children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsx("p",{id:e+"-error",className:"neui-note neui-error",role:"status",children:j})})})),r.jsx("div",{ref:y,id:e+"-assistant",children:O(s.isOpen&&r.jsx("div",{className:"neui-collapse-block",children:r.jsx(Mt,{calendar:s,panelRef:p,children:O(!x&&r.jsx("div",{className:"neui-collapse-block",children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsx("p",{className:"neui-note",children:"Без даты отправка начнётся с ближайшего выпуска."})})}))})}))}),r.jsx("input",{type:"hidden",name:t,disabled:!s.value,value:s.value??""})]})})}function Nr(){const[e,t]=m.useState(()=>St("2026-11-26"));return r.jsx(Ft,{id:m.useId(),name:"date",label:"Дата первой сводки",draft:e,onChange:t})}const he=["start","end"];function Et({id:e,name:t,label:n,...a}){const i=vr(a),{calendar:o,endpoints:s,endpoint:d}=i,f=ke(o.isOpen,{followViewport:!0}),y=m.useRef(null),h=m.useRef(null),[u,l]=m.useState(!1),p=he.some(g=>Object.values(a.draft[g]).some(Boolean)),x={start:qe(s.start,u),end:qe(s.end,u)},k=!!s.start.value&&!!s.end.value&&s.start.value>s.end.value,j=he.find(g=>!s[g].value),N=he.filter(g=>x[g].error),S=k?"Конец периода должен совпадать с началом или быть позже.":N.length?N.map(g=>we[g]+". "+x[g].error).join(" "):u&&p&&j?j==="end"?"Выберите конец периода.":"Выберите начало периода.":"";function R(g,c="day"){y.current?.querySelector('[data-endpoint-entry="'+g+'"] [data-segment="'+c+'"]')?.focus({preventScroll:!0})}function D(){o.close(),l(!0),R(d,o.part)}return r.jsx("div",{className:"neui-date-field",onBlur:g=>{g.currentTarget.contains(g.relatedTarget)||l(!0)},onKeyDown:g=>{g.key==="Escape"&&o.isOpen&&(g.preventDefault(),D())},children:r.jsxs(J,{id:e,label:n,meta:(o.isOpen||p||i.canUndo)&&r.jsxs(r.Fragment,{children:[O(o.isOpen&&r.jsx("span",{className:"neui-collapse-inline",children:r.jsx("span",{className:"neui-reveal-clip",children:r.jsx("button",{type:"button",className:"neui-pill","aria-expanded":"true","aria-controls":e+"-assistant","aria-label":"Свернуть календарь периода",onClick:D,children:"Свернуть"})})})),O((p||i.canUndo)&&r.jsx("span",{className:"neui-collapse-inline",children:r.jsx("span",{className:"neui-reveal-clip",children:r.jsx("button",{type:"button",className:"neui-pill","aria-label":i.canUndo?"Вернуть период":"Сбросить период",onClick:()=>{i.canUndo?i.undo():i.reset(),l(!1),R("start")},children:i.canUndo?"Вернуть":"Сбросить"})})}))]}),children:[r.jsxs("div",{ref:y,className:"neui-row neui-date-entry",children:[r.jsx("span",{"aria-hidden":"true",className:"neuicon-calendar neui-row-area-leading place-self-center"}),r.jsx("div",{className:"neui-date-pair neui-row-area-content",children:he.map(g=>r.jsxs("div",{className:"neui-date-bound",children:[g==="end"&&r.jsx("span",{"aria-hidden":"true",className:"neui-date-separator",children:"—"}),r.jsx(Tt,{id:e,endpoint:g,calendar:s[g],panelRef:h,validation:x[g],errorId:S?e+"-error":void 0,focusEndpoint:R,open:c=>{s[g].open(c)},close:D})]},g))})]}),O(S&&r.jsx("div",{className:"neui-collapse-block",children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsx("p",{id:e+"-error",className:"neui-note neui-error",role:"status",children:S})})})),r.jsx("div",{ref:f,id:e+"-assistant",children:O(o.isOpen&&r.jsx("div",{className:"neui-collapse-block",children:r.jsx(Mt,{calendar:o,range:i.range,panelRef:h})}))}),he.map(g=>r.jsx("input",{type:"hidden",name:t+"."+g,disabled:!i.value,value:i.value?.[g]??""},g))]})})}function jr(){const[e,t]=m.useState({start:{},end:{}});return r.jsx(Et,{id:m.useId(),name:"period",label:"Период событий",draft:e,onChange:t})}const ft="neui:tag-swipe-guide:v1";let gt=!1;function Cr(){try{if(sessionStorage.getItem(ft))return!1;sessionStorage.setItem(ft,"seen")}catch{if(gt)return!1}return gt=!0,!0}function Dr(e,{value:t,next:n}){if(e.includes(t))return e;const a=n===void 0?-1:e.indexOf(n),i=a<0?e.length:a;return[...e.slice(0,i),t,...e.slice(i)]}function Ot({id:e,label:t,name:n,tags:a,draft:i,onChange:o}){const s=m.useRef(null),d=m.useRef(new Map),[f,y]=m.useState(),[h,u]=m.useState(),l=m.useRef(""),p=m.useRef(!1),[x,k]=m.useState();function j(c){(d.current.get(c??"")??s.current)?.focus({preventScroll:!0})}function N(c){const v=a.indexOf(c);if(v<0)return;const C={value:c,next:a[v+1]};j(C.next??a[v-1]),y(void 0),u(void 0),k(C),o(a.filter(P=>P!==c),i)}function S(){const c=i.trim();c&&(a.includes(c)||k(void 0),o(a.includes(c)?a:[c,...a],""))}function R(c,v){c==="Enter"&&(v(),S()),c==="Backspace"&&a.length&&s.current?.selectionStart===0&&s.current.selectionEnd===0&&(v(),j(a[0]))}m.useEffect(()=>{const c=s.current;if(!c)return;function v(C){C.isComposing||!C.cancelable||(C.inputType==="deleteContentBackward"&&R("Backspace",()=>C.preventDefault()),(C.inputType==="insertLineBreak"||C.inputType==="insertParagraph")&&R("Enter",()=>C.preventDefault()))}return c.addEventListener("beforeinput",v),()=>c.removeEventListener("beforeinput",v)});function D(c,v){const C=a.indexOf(v);c.key==="Backspace"||c.key==="Delete"?(c.preventDefault(),c.repeat||N(v)):(c.key==="Escape"||c.key==="ArrowUp"||c.key==="ArrowDown")&&(c.preventDefault(),j(c.key==="Escape"?void 0:c.key==="ArrowUp"?a[C-1]:a[C+1]??v))}const g=x&&r.jsx("button",{className:"neui-pill",type:"button","aria-label":"Вернуть удалённый тег",onClick:()=>{o(Dr(a,x),i),k(void 0),s.current?.focus({preventScroll:!0})},children:"Вернуть тег"});return r.jsxs(J,{id:e,label:t,meta:g,children:[r.jsxs("div",{className:"neui-row neui-entry neui-ripple neui-focus",children:[r.jsx("span",{className:"neuicon-tag neui-row-area-leading place-self-center","aria-hidden":"true"}),r.jsx("input",{ref:s,type:"text",enterKeyHint:"enter",className:"neui-field-input neui-row-area-content","aria-labelledby":e+"-label","aria-describedby":e+"-help",placeholder:"Добавьте тег",value:i,onChange:c=>o(a,c.target.value),onKeyDown:c=>{!c.nativeEvent.isComposing&&c.nativeEvent.keyCode!==229&&R(c.key,()=>c.preventDefault())}})]}),r.jsx("span",{className:"sr-only",id:e+"-help",children:"Enter добавляет тег. Backspace в начале ввода выбирает последний добавленный тег. Выбранный тег можно удалить клавишей Delete или свайпом вправо."}),r.jsx("ul",{className:"neui-tags","aria-labelledby":e+"-label",children:O(a.map(c=>{const v=f===c,C=h===c;return r.jsx("li",{className:"neui-collapse-block",children:r.jsxs("div",{className:"neui-reveal-clip",children:[r.jsxs("div",{className:"neui-swipe-right neui-tag neui-focus-anchor neui-focus neui-ripple","data-neui-swipe-open":v,"data-guide":C||void 0,onBlur:P=>{P.currentTarget.contains(P.relatedTarget)||(y(F=>F===c?void 0:F),u(F=>F===c?void 0:F))},onPointerDownCapture:P=>{l.current=P.pointerType,p.current=C,C&&u(void 0)},children:[r.jsx("button",{type:"button",className:"neui-swipe-content neui-tag-name",ref:P=>{P?d.current.set(c,P):d.current.delete(c)},"aria-expanded":v,"aria-describedby":C?e+"-hint":e+"-help",onKeyDown:P=>{l.current="",p.current=!1,D(P,c)},onClick:P=>{if(P.currentTarget.focus({preventScroll:!0}),p.current){p.current=!1;return}P.detail&&["touch","pen"].includes(l.current)&&Cr()?(u(c),y(void 0)):y(v?void 0:c)},children:c}),r.jsx("button",{type:"button",className:"neui-swipe-action","aria-label":"Удалить тег «"+c+"»","aria-hidden":!v,tabIndex:v?0:-1,onClick:()=>N(c),children:r.jsx("span",{className:"neui-tag-word",children:r.jsx("span",{children:"Удалить"})})}),r.jsx("span",{"aria-hidden":"true",className:"neui-tag-icon neuicon-transition neuicon-from-tag neuicon-to-trash duration-0"})]}),O(C&&r.jsx("div",{className:"neui-collapse-block",children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsx("p",{className:"neui-note neui-tag-hint",id:e+"-hint",children:"Потяни вправо для удаления"})})}))]})},c)}))}),a.map(c=>r.jsx("input",{type:"hidden",name:n,value:c},c))]})}function Sr(){const[e,t]=m.useState(["potential","frequently_used"]),[n,a]=m.useState("");return r.jsx(Ot,{id:m.useId(),name:"tags",label:"Теги сводки",tags:e,draft:n,onChange:(i,o)=>{t(i),a(o)}})}const Lt=m.createContext(null);function Rr(){return r.jsx(r.Fragment,{children:m.useContext(Lt)})}function Ye({open:e,axis:t,children:n,returnFocusRef:a}){const i=m.useRef(!1);return m.useLayoutEffect(()=>{!e&&i.current&&(a?.current?.focus({preventScroll:!0}),i.current=!1)},[e,a]),r.jsx(Lt.Provider,{value:n,children:O(e&&r.jsx("div",{"data-open":!0,className:t==="inline"?"neui-reveal neui-reveal-inline neui-collapse-inline":"neui-reveal neui-collapse-block",onFocusCapture:()=>{i.current=!0},onBlurCapture:o=>{i.current=o.currentTarget.contains(o.relatedTarget)},children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsx(Rr,{})})}))})}function _t({open:e,id:t,children:n,followViewport:a=!1,onCollapsed:i}){const o=ke(e,{followViewport:a,onCollapsed:i});return r.jsx("div",{id:t,ref:o,children:n})}function le({open:e,axis:t,id:n,collapsed:a,children:i,returnFocusRef:o,followViewport:s}){return r.jsxs(_t,{id:n,open:e,followViewport:s,children:[a!=null&&r.jsx(Ye,{axis:t,open:!e,returnFocusRef:o,children:a}),r.jsx(Ye,{axis:t,open:e,returnFocusRef:o,children:i})]})}le.Group=_t;le.Item=Ye;function It({selected:e,round:t=!1}){const n=t?"neui-check-radio":"neui-check-box";return r.jsx("span",{"aria-hidden":"true",className:`neui-row-area-leading place-self-center ${n} ${e?"[--neui-check-level:1]":""}`})}function Wt({option:[e,t,n,a],id:i,name:o,multiple:s,selected:d,onChoose:f,disclosure:y}){return r.jsxs("label",{htmlFor:i,className:"neui-row neui-ripple neui-choice",children:[y?r.jsx("button",{id:i,type:"button",className:"neui-option","aria-expanded":!1,"aria-controls":y.controls,onClick:y.expand}):r.jsx("input",{id:i,name:s?void 0:o,className:"neui-option",type:s?"checkbox":"radio",value:e,disabled:a,checked:d,onChange:f}),r.jsx(It,{selected:d,round:!s}),r.jsxs("span",{className:"neui-row-copy",children:[t,n&&r.jsx("small",{children:n})]})]})}function Le({id:e,name:t,label:n,options:a,value:i,onChange:o}){return r.jsx(J,{id:e,label:n,children:a.map(s=>r.jsx(Wt,{option:s,id:e+"-"+s[0],name:t,selected:i===s[0],onChoose:()=>o(s[0])},s[0]))})}function Pr(e,t,n){const a=m.useRef(null),i=m.useRef(null),[o,s]=m.useState({first:0,end:16});return m.useLayoutEffect(()=>{const d=a.current,f=i.current;if(!e||!t||!d||!f)return;let y=0;const h=()=>{y=0;const p=f.getBoundingClientRect().height;if(!p)return;const x=d.getBoundingClientRect().top,k=Math.max(0,Math.floor(-x/p)-6),j=Math.min(n,Math.ceil((window.innerHeight-x)/p)+6);s(N=>N.first===k&&N.end===j?N:{first:k,end:j})},u=()=>{y||(y=requestAnimationFrame(h))};h();const l=new ResizeObserver(u);return l.observe(d),l.observe(f),l.observe(document.body),window.addEventListener("scroll",u,{passive:!0,capture:!0}),window.addEventListener("resize",u),()=>{cancelAnimationFrame(y),l.disconnect(),window.removeEventListener("scroll",u,!0),window.removeEventListener("resize",u)}},[e,t,n]),{list:a,probe:i,range:o}}const ht=e=>e.trim().toLocaleLowerCase("ru").replaceAll("ё","е"),Mr=new Intl.PluralRules("ru"),Tr={one:"вариант",few:"варианта"};function Pe({id:e,name:t,label:n,actionLabel:a=n,options:i,selected:o,multiple:s=!1,emptyLabel:d,searchLabel:f,description:y,recovery:h,triggerRef:u,onChange:l}){const[p,x]=m.useState(!1),[k,j]=m.useState(!0),[N,S]=m.useState(i),[R,D]=m.useState(""),[g,c]=m.useState(null),v=m.useRef(null),C=m.useRef(null),P=m.useRef(null),F=u??P,V=e+"-options",B=i.length>6,w=i.length>40,T=m.useMemo(()=>new Map(i.map(b=>[b[0],b])),[i]),M=o.map(b=>T.get(b)).filter(b=>b!==void 0),H=M.length>2?M.slice(0,1):M,G=k?[...M,...i.filter(([b])=>!o.includes(b))]:N,Z=ht(R).split(/\s+/).filter(Boolean),I=p&&Z.length?G.filter(([,b,_])=>Z.every(L=>ht(b+" "+(_??"")).includes(L))):G,{list:re,probe:pe,range:ie}=Pr(w,p,I.length),je=p?I.length:s?H.length:1;function me(b){ze(),D(b)}const Ht=i.length+" "+(Tr[Mr.select(i.length)]??"вариантов"),Ue=p&&s?"Выбрано "+M.length+" из "+i.length:!p&&M.length>2?"Ещё "+(M.length-1)+" из "+i.length+" вариантов":Ht;m.useLayoutEffect(()=>{const b=v.current;!p||!b||(v.current=null,b==="search"?C.current?.focus({preventScroll:!0}):document.getElementById(e+"-"+b)?.focus({preventScroll:!0}))},[e,p,g]);function Ce(b){k&&S(G),v.current=b??null,c(b??null),j(!1),x(!0)}function ze(){const b=document.getElementById(e);if(!b)return;const _=We(b)?.getBoundingClientRect().top??0;b.getBoundingClientRect().top<_&&b.scrollIntoView({block:"start",behavior:"instant"})}function Ee(){F.current?.focus({preventScroll:!0}),w&&ze(),x(!1),D("")}function Xe(b){if(!s){l([b]);return}const _=new Set(o);_.has(b)?_.delete(b):_.add(b),l(G.map(([L])=>L).filter(L=>_.has(L)))}function Qe(b){const _=I[b]?.[0];if(!_)return;const L=pe.current?.getBoundingClientRect().height??0;if(w&&re.current&&L){const fe=re.current.getBoundingClientRect().top+b*L,Se=We(re.current),Re=Se?.getBoundingClientRect(),Ze=Se??window,et=Math.max(Re?.top??0,C.current?.closest('[slot="header"]')?.getBoundingClientRect().bottom??0),tt=Math.min(Re?.bottom??window.innerHeight,F.current?.getBoundingClientRect().top??window.innerHeight);fe<et?Ze.scrollBy(0,fe-et):fe+L>tt&&Ze.scrollBy(0,fe+L-tt)}const q=document.getElementById(e+"-"+_);q?q.focus({preventScroll:w}):v.current=_,c(_)}function $t(b,_){if(b.key==="Escape"){b.preventDefault(),Ee();return}if(!p||!w)return;const L=b.key==="ArrowDown"||b.key==="ArrowRight"?1:b.key==="ArrowUp"||b.key==="ArrowLeft"?-1:0;let q=_+L;if(b.key==="Home")q=0;else if(b.key==="End")q=I.length-1;else if(b.key==="Tab"&&s)q=_+(b.shiftKey?-1:1);else if(!L)return;q<0||q>=I.length||(b.preventDefault(),Qe(q),!s&&L&&Xe(I[q][0]))}const De=[],Je=new Set;function Oe(b,_){const L=b[0];return p&&!s&&Je.add(L),r.jsx("div",{onKeyDown:q=>$t(q,_),onFocus:()=>{w&&p&&c(L)},children:r.jsx(Wt,{id:e+"-"+L,name:t,option:b,multiple:s,selected:o.includes(L),onChoose:()=>Xe(L),disclosure:p?void 0:{controls:V,expand:()=>Ce(L)}})})}if(!s){const b=M[0];De.push(r.jsx("div",{className:w?"neui-catalog-row":void 0,children:p?I[0]&&Oe(I[0],0):r.jsxs("button",{type:"button",className:"neui-row neui-ripple neui-choice","aria-controls":V,"aria-expanded":!1,onClick:()=>Ce(b?.[0]??(B?"search":G[0]?.[0])),children:[b?r.jsx(It,{selected:!0,round:!0}):r.jsx("span",{"aria-hidden":"true",className:"neuicon-project neui-row-area-leading place-self-center"}),r.jsxs("span",{className:"neui-row-copy",children:[b?.[1]??d,b?.[2]&&r.jsx("small",{children:b[2]})]})]})},"single-summary"))}for(let b=s?0:1;b<I.length;b++){const _=I[b],L=_[0],q=s&&H.includes(_);if(w){if(!(p?b>=ie.first&&b<ie.end:!k&&b<Math.max(16,ie.end-ie.first))&&!q&&!(p&&L===g))continue;const Se=!p&&k?H.indexOf(_):b,Re=!p&&!q;De.push(r.jsx("div",{className:"neui-catalog-row",style:{top:"calc("+Se+" * var(--neui-project-height))"},...Re?{inert:"","aria-hidden":!0}:{},children:Oe(_,b)},L))}else De.push(r.jsx(le.Item,{open:p||q,returnFocusRef:F,children:Oe(_,b)},L))}return r.jsxs(J,{id:e,label:n,description:y,header:B&&r.jsx(le,{open:p,returnFocusRef:F,children:r.jsxs("div",{className:"neui-row neui-ripple neui-focus neui-entry",children:[r.jsx("span",{"aria-hidden":"true",className:"neuicon-search neui-row-area-leading place-self-center"}),r.jsx("input",{ref:C,type:"search",className:"neui-field-input neui-row-area-content","aria-label":f,placeholder:f,disabled:!p,"aria-controls":V,value:R,onChange:b=>me(b.target.value),onKeyDown:b=>{b.key==="Escape"&&(b.preventDefault(),Ee()),I.length&&(b.key==="ArrowDown"||b.key==="Enter")&&(b.preventDefault(),Qe(0))}}),O(R&&r.jsx("span",{className:"neui-collapse-inline neui-row-area-trailing",children:r.jsx("span",{className:"neui-reveal-clip",children:r.jsx("button",{className:"neui-clear",type:"button","aria-label":"Очистить поиск",onClick:()=>{me(""),C.current?.focus({preventScroll:!0})},children:r.jsx("span",{"aria-hidden":"true",className:"neuicon-clear"})})})}))]})}),meta:r.jsxs(r.Fragment,{children:[r.jsxs("button",{type:"button",className:"neui-pill",ref:F,"aria-controls":V,"aria-expanded":p,"aria-label":(p?"Свернуть":"Раскрыть")+" "+a+". "+Ue,onClick:b=>p?Ee():Ce(b.detail===0?B?"search":G[0]?.[0]:void 0),children:[Ue,r.jsx("svg",{className:"neui-chev","data-open":p,width:"12",height:"12",viewBox:"0 0 16 16","aria-hidden":"true",children:r.jsx("path",{d:"m3 6 5 5 5-5",fill:"none",stroke:"currentColor",strokeWidth:"1.5"})})]}),O(h&&r.jsx("span",{className:"neui-collapse-inline",children:r.jsx("span",{className:"neui-reveal-clip",children:h})}))]}),children:[r.jsxs(le.Group,{followViewport:!0,open:p,id:V,onCollapsed:()=>j(!0),children:[r.jsxs("div",{ref:re,className:w?"neui-catalog":void 0,style:w?{"--neui-catalog-rows":je}:void 0,children:[w&&r.jsxs(r.Fragment,{children:[r.jsx("div",{className:"neui-catalog-window","data-open":p,"aria-hidden":"true"}),r.jsx("div",{ref:pe,className:"neui-pitch","aria-hidden":"true"})]}),De]}),O(p&&!!Z.length&&r.jsx("div",{className:"neui-collapse-block",children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsx("p",{className:"neui-note",role:"status",children:I.length?"Найдено: "+I.length:"Совпадений нет. Попробуйте другой запрос."})})})),s&&r.jsx(le.Item,{open:!p&&!M.length,returnFocusRef:F,children:r.jsxs("button",{type:"button",className:"neui-row neui-ripple",onClick:()=>Ce(B?"search":G[0]?.[0]),children:[r.jsx("span",{"aria-hidden":"true",className:`neui-row-area-leading place-self-center ${t==="delivery"?"neuicon-mail":"neuicon-project"}`}),r.jsx("span",{className:"neui-row-copy",children:d})]})})]}),!s&&!o.length&&r.jsx("input",{type:"hidden",name:t,value:""}),o.filter(b=>!Je.has(b)).map(b=>r.jsx("input",{type:"hidden",name:t,value:b},b))]})}const Bt=[["instant","Сразу","Каждое важное событие"],["daily","Раз в день","Одна сводка в конце дня"],["weekly","Раз в неделю","Главное за последние семь дней"],["custom","По расписанию","Индивидуальное расписание недоступно в прототипе",!0]],At=[["brief","Коротко","Только заголовки событий"],["details","С подробностями","Заголовки, авторы и описание изменений"]],Gt=[["skip","Пропустить выпуск","Следующая сводка придёт, когда появятся события"],["send","Прислать пустую сводку","Сообщить, что за период событий не было"]],Ne=[["inbox","Входящие Trinet","Во вкладку уведомлений"],["email","Электронная почта","На адрес профиля или другой указанный адрес"],["mobile","Уведомления телефона","На экран мобильного устройства"],["browser","Уведомления браузера","На рабочий стол через браузер"],["chat","Личный чат","Сообщением от бота в мессенджере"],["team","Канал команды","В общую ленту рабочего чата"]],Fr=[["trinet","Trinet"],["entropy","Entropy"],["atlas","Атлас"],["orbit","Орбита"],["north","Север"],["vector","Вектор"],["pulse","Пульс"],["signal","Сигнал"],["beacon","Маяк"],["spectrum","Спектр"],["rhythm","Ритм"],["core","Ядро"]],Er=[["design","Дизайн-система"],["search","Поиск"],["automation","Автоматизация"],["mobile","Мобильное приложение"],["reports","Отчёты"],["access","Управление доступом"],["integrations","Интеграции"],["events","Журнал событий"],["docs","Документация"],["notifications","Уведомления"],["analytics","Аналитика"],["import","Импорт данных"]],de=Fr.flatMap(([e,t])=>Er.map(([n,a])=>[e+"-"+n,t+" · "+a])),qt=`Доброе утро, команда!
Вот новости проекта за неделю.

Мы выпустили обновление формы.
Теперь она запоминает черновики.
Поиск по задачам тоже готов.
Его уже можно попробовать.

Дальше займёмся уведомлениями.
В пятницу покажем первый вариант.
До встречи на демо!`;function Or(){const[e,t]=m.useState([de[0][0]]);return r.jsx(Pe,{id:m.useId(),name:"projects",label:"Проекты в сводке",multiple:!0,options:de,selected:e,searchLabel:"Поиск проектов",emptyLabel:"Выбрать проекты",onChange:t})}const vt=[{id:"core",name:"Ядро",channels:3},{id:"design",name:"Дизайн-система",channels:2},{id:"search",name:"Поиск",channels:1}];function Lr(){const[e,t]=m.useState(["design"]);return r.jsxs("section",{className:"neui-ridge neui-track-focus",children:[r.jsx("span",{slot:"label",children:"Проекты в сводке"}),r.jsxs("table",{className:"w-full text-left",children:[r.jsx("caption",{className:"sr-only",children:"Каналы и выбранные проекты"}),r.jsx("thead",{className:"text-sm text-muted",children:r.jsxs("tr",{children:[r.jsx("th",{scope:"col",children:"Проект"}),r.jsx("th",{scope:"col",children:"Каналы"})]})}),r.jsx("tbody",{children:vt.map(n=>r.jsxs("tr",{children:[r.jsx("th",{scope:"row",children:r.jsxs("label",{className:"neui-row neui-ripple cursor-pointer",children:[r.jsx("input",{type:"checkbox",className:"neui-row-area-leading neui-check-box appearance-none checked:[--neui-check-level:1]",checked:e.includes(n.id),onChange:a=>t(a.target.checked?[...e,n.id]:e.filter(i=>i!==n.id))}),r.jsx("span",{className:"neui-row-area-content",children:n.name})]})}),r.jsx("td",{children:n.channels})]},n.id))})]}),r.jsxs("output",{slot:"meta",className:"neui-pill",children:["Выбрано ",e.length," из ",vt.length]})]})}function _r(){const e=m.useId(),[t,n]=m.useState(.5);return r.jsx("div",{className:"neui-example",children:r.jsxs("div",{className:"neui-ridge neui-track-focus",id:e,children:[r.jsx("label",{slot:"label",htmlFor:e+"-value",children:"Громкость сигнала"}),r.jsxs("div",{className:"neui-scale-example",children:[r.jsx("input",{id:e+"-value",className:"neui-range",type:"range",min:"0",max:"1",step:"0.25",value:t,"aria-valuetext":Math.round(t*100)+"%",onChange:a=>n(a.currentTarget.valueAsNumber)}),r.jsx("div",{className:"neui-range-ticks","aria-hidden":"true",children:[0,.25,.5,.75,1].map(a=>r.jsx("i",{},a))}),r.jsxs("div",{className:"neui-scale-labels","aria-hidden":"true",children:[r.jsx("span",{children:"0%"}),r.jsx("span",{children:"100%"})]})]}),r.jsxs("output",{slot:"meta",className:"neui-pill",htmlFor:e+"-value",children:[Math.round(t*100),"%"]})]})})}const ve=new Map(Ne.map(([e,t])=>[e,t]));function Ir(e,t){if(e.some(i=>i.id===t.step.id))return e;const n=e.slice(),a=n.findIndex(i=>i.id===t.next);return n.splice(a<0?Math.min(t.index,n.length):a,0,t.step),n}function Wr({onChoose:e}){return Ne.map(([t,n])=>r.jsxs("button",{type:"button",className:"neui-row neui-ripple neui-focus",onClick:()=>e(t),children:[r.jsx("span",{"aria-hidden":"true",className:"neui-row-area-leading place-self-center",children:"+"}),r.jsx("span",{className:"neui-row-copy",children:n})]},t))}function Br({id:e,steps:t,onChange:n}){const[a,i]=m.useState(null),o=ke(a==="add",{followViewport:!0}),[s,d]=m.useState(),[f,y]=m.useState(""),h=m.useRef(null),u=m.useRef(new Map),l=m.useRef(null);m.useLayoutEffect(()=>{const N=l.current;N&&(u.current.get(N)??h.current)?.focus(),l.current=null},[t]);function p(N){i(a===N?null:N)}function x(N,S){const R=N+S;if(R<0||R>=t.length)return;const D=t.slice(),g=t[N];D.splice(N,1),D.splice(R,0,g),l.current=g.id,n(D),y(`Шаг ${R+1}. ${ve.get(g.channel)}.`)}function k(N){const S=t[N],R={step:S,index:N,next:t[N+1]?.id};d(R),l.current=t[N+1]?.id??t[N-1]?.id??"add",i(null),n(t.filter(D=>D.id!==S.id)),y(`Удалён шаг ${N+1}. ${ve.get(S.channel)}.`)}function j(){s&&(l.current=s.step.id,n(Ir(t,s)),d(void 0),y("Шаг восстановлен."))}return r.jsxs(J,{id:e,label:"Порядок повторной доставки",description:"После сбоя пробуем каналы по очереди. Один канал можно повторить.",meta:r.jsxs(r.Fragment,{children:[O(s&&r.jsx("span",{className:"neui-collapse-inline",children:r.jsx("span",{className:"neui-reveal-clip",children:r.jsx("button",{type:"button",className:"neui-pill",onClick:j,children:"Вернуть шаг"})})})),r.jsx("button",{ref:h,type:"button",className:"neui-pill","aria-expanded":a==="add","aria-controls":e+"-add",onClick:()=>p("add"),children:a==="add"?"Свернуть каналы":"Добавить шаг"})]}),children:[r.jsx("span",{className:"sr-only",id:e+"-help",children:"Нажмите на шаг для изменения порядка. Для удаления потяните вправо или нажмите Delete."}),r.jsx("ol",{className:"neui-tags","aria-label":"Попытки доставки",children:O(t.map((N,S)=>{const R=S+1,D=a===N.id,g=e+"-"+N.id;return r.jsx("li",{className:"neui-collapse-block",children:r.jsxs("div",{className:"neui-reveal-clip",children:[r.jsxs("div",{className:"neui-swipe-right neui-tag neui-focus-anchor neui-focus neui-ripple","data-neui-swipe-open":D,children:[r.jsx("button",{type:"button",className:"neui-swipe-content neui-tag-name","aria-expanded":D,"aria-controls":g,ref:c=>{c?u.current.set(N.id,c):u.current.delete(N.id)},"aria-label":R+". "+ve.get(N.channel),"aria-describedby":e+"-help","aria-keyshortcuts":"Delete Backspace",onClick:()=>p(N.id),onKeyDown:c=>{c.key==="Delete"||c.key==="Backspace"?(c.preventDefault(),c.repeat||k(S)):c.key==="Escape"&&i(null)},children:ve.get(N.channel)}),r.jsx("button",{type:"button",className:"neui-swipe-action","aria-label":"Удалить попытку "+R,"aria-hidden":!D,tabIndex:D?0:-1,onClick:()=>k(S),children:r.jsx("span",{className:"neui-tag-word",children:r.jsx("span",{children:"Удалить"})})}),r.jsxs("span",{className:"neui-tag-icon neui-step-icon","aria-hidden":"true",children:[r.jsxs("span",{className:"neui-step-number",children:[R,"."]}),r.jsx("span",{className:"neuicon-transition neuicon-to-trash duration-0"})]})]}),O(D&&r.jsx("div",{id:g,className:"neui-collapse-block",children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsxs("div",{className:"neui-step-actions",children:[r.jsx("button",{type:"button",className:"neui-pill",disabled:S<=0,onClick:()=>x(S,-1),children:"Вверх"}),r.jsx("button",{type:"button",className:"neui-pill",disabled:S===t.length-1,onClick:()=>x(S,1),children:"Вниз"})]})})}))]})},N.id)}))}),t.map(N=>r.jsx("input",{type:"hidden",name:"retryRoute",value:N.channel},N.id)),O(!t.length&&r.jsx("div",{className:"neui-collapse-block",children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsx("p",{className:"neui-note",children:"Повторных попыток пока нет."})})})),r.jsx("div",{ref:o,id:e+"-add",children:O(a==="add"&&r.jsx("div",{className:"neui-collapse-block",children:r.jsxs("div",{className:"neui-reveal-clip",children:[t.length>0&&r.jsx("hr",{className:"neui-divider"}),r.jsx("div",{role:"group","aria-label":"Каналы для добавления",children:r.jsx(Wr,{onChoose:N=>{n([...t,{id:crypto.randomUUID(),channel:N}]),y(`Добавлен шаг ${t.length+1}. ${ve.get(N)}.`)}})})]})}))}),r.jsx("span",{className:"sr-only",role:"status",children:f})]})}const Ar=["mobile","email","mobile"];function Yt(e){return(Array.isArray(e)?e:Ar).filter(n=>Ne.some(([a])=>a===n)).map((n,a)=>({id:"saved-"+a,channel:n}))}const W={min:2,max:30,step:2,initial:10};function Ve(e){if(!/^[+-]?\d+(?:[.,]\d+)?$/.test(e.trim()))return;const t=Number(e.trim().replace(",","."));if(!(!Number.isInteger(t)||t<W.min||t>W.max||(t-W.min)%W.step!==0))return t}const Gr=Array.from({length:1+(W.max-W.min)/W.step},(e,t)=>W.min+t*W.step);function qr({id:e,draft:t,applied:n,onChange:a}){const[i,o]=m.useState(!1),s=ke(i,{followViewport:!0}),d=m.useRef(null),f=m.useRef(!1);function y(){f.current=!0,d.current?.focus({preventScroll:!0}),f.current=!1,o(!1)}const h=Ve(t)===void 0?`Введите чётное число от ${W.min} до ${W.max}. Сейчас используется ${n} мин.`:void 0;return r.jsx(J,{id:e,label:"Интервал между попытками",error:h,children:r.jsxs("div",{onKeyDown:u=>{u.key==="Escape"&&i&&(u.preventDefault(),y())},children:[r.jsxs("div",{className:"neui-number-entry",children:[r.jsxs("label",{className:"neui-row neui-entry neui-ripple neui-focus",children:[r.jsx("span",{"aria-hidden":"true",className:"neuicon-clock neui-row-area-leading place-self-center"}),r.jsxs("span",{className:"neui-quantity neui-row-area-content",children:[r.jsxs("span",{className:"neui-quantity-value",children:[r.jsx("span",{"aria-hidden":"true",children:t||"0"}),r.jsx("input",{ref:d,type:"text",inputMode:"decimal",className:"neui-field-input",value:t,"aria-labelledby":e+"-label","aria-describedby":[e+"-unit",h&&e+"-error"].filter(Boolean).join(" "),"aria-invalid":!!h,"aria-controls":e+"-scale",onFocus:()=>{f.current||o(!0)},onClick:()=>o(!0),onChange:u=>{const l=u.currentTarget.value;o(!0),a(l,Ve(l)??n)}})]}),r.jsx("span",{id:e+"-unit",className:"text-muted",children:"мин"})]})]}),O(i&&r.jsx("div",{className:"neui-collapse-inline",children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsx("button",{type:"button",className:"neui-pill","aria-label":"Свернуть шкалу","aria-expanded":i,"aria-controls":e+"-scale",onClick:y,children:"Свернуть"})})}))]}),r.jsx("input",{type:"hidden",name:"retryMinutes",value:n}),r.jsx("div",{ref:s,id:e+"-scale",children:O(i&&r.jsx("div",{className:"neui-collapse-block",children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsxs("div",{className:"neui-scale-example",children:[r.jsx("input",{type:"range",className:"neui-range","aria-label":"Интервал по шкале, минуты",min:W.min,max:W.max,step:W.step,value:n,onChange:u=>a(u.currentTarget.value,u.currentTarget.valueAsNumber)}),r.jsx("div",{className:"neui-range-ticks","aria-hidden":"true",children:Gr.map(u=>r.jsx("i",{},u))}),r.jsxs("div",{className:"neui-scale-labels","aria-hidden":"true",children:[r.jsxs("span",{children:[W.min," мин"]}),r.jsxs("span",{children:[W.max," мин"]})]})]})})}))})]})})}function Yr({id:e,value:t,applied:n,onChange:a}){const i=m.useRef(null),[o,s]=m.useState(!!(t&&t!==n)),[d,f]=m.useState(!1);m.useEffect(()=>{f(!!i.current?.validity.typeMismatch)},[t]);const y=o&&d?"Проверьте адрес, например name@example.com. Пока используется "+(n||"адрес из профиля")+".":void 0;return r.jsx(J,{id:e,label:"Адрес для сводки",error:y,children:r.jsxs("div",{className:"neui-row neui-ripple neui-focus neui-entry",children:[r.jsx("span",{"aria-hidden":"true",className:"neuicon-mail neui-row-area-leading place-self-center"}),r.jsx("input",{type:"email",ref:i,className:"neui-field-input neui-row-area-content",autoComplete:"email",placeholder:"Адрес из профиля","aria-labelledby":e+"-label","aria-invalid":!!y,"aria-describedby":y?e+"-error":void 0,value:t,onBlur:()=>s(!0),onChange:h=>{const{value:u,validity:l}=h.currentTarget;a(u,l.valid?u.trim():n)}})]})})}const Vr={pencil:"neuicon-pencil",text:"neuicon-text",person:"neuicon-person"},Hr=new Intl.PluralRules("ru"),$r={one:"символ",few:"символа",many:"символов"};function _e({id:e,name:t,label:n,icon:a,value:i,limit:o,description:s,placeholder:d,readOnly:f,onChange:y}){const h=m.useRef(null),u=m.useRef(null),l=o===void 0?1/0:o-i.length;Pn(h,x=>{const k=u.current?.firstChild;if(!k)return x.getBoundingClientRect().top+24;const j=document.createRange(),N=x.selectionDirection==="backward"?x.selectionStart:x.selectionEnd,S=Math.min(N,Math.max(0,(k.textContent?.length??1)-1));j.setStart(k,S),j.setEnd(k,S+1);const R=j.getBoundingClientRect();return R.top+R.height/2-x.scrollTop}),m.useLayoutEffect(()=>{const x=h.current,k=u.current;function j(){x.style.height=k.getBoundingClientRect().height+"px"}j();const N=new ResizeObserver(j);return N.observe(k),()=>N.disconnect()},[]);const p=Hr.select(l);return r.jsx(J,{id:e,label:n,description:s,meta:l<=50&&r.jsxs("span",{id:e+"-count",className:"neui-pill neui-count",style:{"--urgency":(50-l)*2+"%"},children:[p==="one"?"Остался":"Осталось"," ",l," ",$r[p]??"символа"]}),children:r.jsxs("div",{className:"neui-row neui-ripple neui-focus neui-edit",children:[r.jsx("span",{"aria-hidden":"true",className:`neui-row-leading ${Vr[a]}`}),r.jsx("textarea",{ref:h,className:"neui-editor",name:t,placeholder:d,readOnly:f,"aria-labelledby":e+"-label","aria-describedby":[s&&e+"-description",l<=50&&e+"-count"].filter(Boolean).join(" ")||void 0,rows:1,value:i,maxLength:o,onChange:x=>y?.(x.target.value)}),r.jsx("span",{className:"neui-caret-mirror","aria-hidden":"true",ref:u,children:i+"​"})]})})}const Vt="trinet:storybook:notification-settings:v1",te={retryRoute:Yt(void 0),retryMinutes:W.initial,retryDraft:String(W.initial),periodDraft:{start:{},end:{}},dateDraft:{},frequency:"daily",format:"brief",delivery:["inbox"],emailText:"",emailAddress:"",projects:["trinet-design","entropy-automation"],primaryProject:"",emptyDigest:"skip",subject:"",introText:qt,tags:["potential","frequently_used"],tagDraft:""};function Ie(e,t){const n=St(e);if(!Q(n)&&t&&typeof t=="object")for(const a of["year","month","day"]){const i=t[a];typeof i=="string"&&/^\d+$/.test(i)&&i.length<=(a==="year"?4:2)&&(n[a]=i)}return n}function Kr(){try{const e=JSON.parse(localStorage.getItem(Vt)??"null");if(!e||typeof e!="object")return te;const t=e.values??{},n=e.emailDraft??{},a=(u,l)=>typeof u=="string"?u:l,i=(u,l,p)=>u.some(([x,,,k])=>x===l&&!k)?String(l):p,o=(u,l,p)=>Array.isArray(l)?[...new Set(l.filter(x=>u.some(([k])=>k===x)))]:p,s=i(de,t.primaryProject,""),d=o(de,t.projects,te.projects),f=Ie(t.firstDigestDate,e.dateDraft),y={start:Ie(t.digestPeriod?.start,e.periodDraft?.start),end:Ie(t.digestPeriod?.end,e.periodDraft?.end)},h=Ve(String(t.retryMinutes))??W.initial;return{retryRoute:Yt(t.retryRoute),retryMinutes:h,retryDraft:a(e.retryDraft,String(h)),tags:Array.isArray(t.tags)?[...new Set(t.tags.filter(u=>typeof u=="string"&&!!u.trim()).map(u=>u.trim()))]:te.tags,tagDraft:a(e.tagDraft,""),periodDraft:y,dateDraft:f,frequency:i(Bt,t.frequency,te.frequency),format:i(At,t.format,te.format),emptyDigest:i(Gt,t.emptyDigest,te.emptyDigest),delivery:o(Ne,t.delivery,te.delivery),projects:s?[s,...d.filter(u=>u!==s)]:d,primaryProject:s,emailAddress:a(n.applied,a(t.emailAddress,"")),emailText:a(n.text,a(t.emailAddress,"")),subject:a(t.subject,"").slice(0,120),introText:a(t.introText,qt).slice(0,300)}}catch{return te}}function Ur(){const[e,t]=m.useState(Kr),[n,a]=m.useState(!0);return m.useEffect(()=>{const{emailText:i,emailAddress:o,dateDraft:s,periodDraft:d,tagDraft:f,retryRoute:y,retryDraft:h,...u}=e,l=Q(s),p=Rt(d),x={...u,...p?{digestPeriod:p}:{},retryRoute:y.map(k=>k.channel),...l?{firstDigestDate:l}:{},senderName:"Trinet",...u.delivery.includes("email")?{emailAddress:o}:{}};try{localStorage.setItem(Vt,JSON.stringify({values:x,tagDraft:f,retryDraft:h,...p?{}:{periodDraft:d},...l?{}:{dateDraft:s},emailDraft:{text:i,applied:o}})),a(!0)}catch{a(!1)}},[e]),{state:e,setState:t,saved:n}}function zr({embedded:e=!1}={}){const t=m.useId().replace(/:/g,""),{state:n,setState:a,saved:i}=Ur(),[o,s]=m.useState(""),d=n.delivery.includes("email");function f(l,p){a(x=>({...x,[l]:p}))}function y(l){s(""),a(p=>({...p,primaryProject:l,projects:l?[l,...p.projects.filter(x=>x!==l)]:p.projects}))}const h=(n.primaryProject||o)&&r.jsx("button",{type:"button",className:"neui-pill","aria-label":(o?"Вернуть":"Сбросить")+" первый проект",onClick:()=>{o?y(o):(s(n.primaryProject),a(l=>({...l,primaryProject:""})))},children:o?"Вернуть":"Сбросить"}),u=e?"div":"main";return r.jsxs(u,{className:"neui-example",lang:"ru",children:[!e&&r.jsx("h1",{children:"Настройки сводки"}),r.jsxs("form",{className:"neui-settings",onSubmit:l=>l.preventDefault(),children:[r.jsx(Le,{id:t+"-frequency",name:"frequency",label:"Как часто присылать сводку?",options:Bt,value:n.frequency,onChange:l=>f("frequency",l)}),r.jsx(Ft,{id:t+"-date",name:"firstDigestDate",label:"Дата первой сводки",draft:n.dateDraft,onChange:l=>a(p=>({...p,dateDraft:l}))}),r.jsx(Et,{id:t+"-period",name:"digestPeriod",label:"Период событий",draft:n.periodDraft,onChange:l=>a(p=>({...p,periodDraft:l}))}),r.jsx(Le,{id:t+"-format",name:"format",label:"В каком формате?",options:At,value:n.format,onChange:l=>f("format",l)}),r.jsx(Pe,{id:t+"-delivery",name:"delivery",label:"Куда доставлять сводку?",actionLabel:"каналы доставки",options:Ne,multiple:!0,selected:n.delivery,emptyLabel:"Доставка выключена",onChange:l=>a(p=>({...p,delivery:l}))}),O(d&&r.jsx("div",{className:"neui-collapse-block",children:r.jsx("div",{className:"neui-reveal-clip",children:r.jsx("div",{className:"neui-conditional-field",children:r.jsx(Yr,{id:t+"-email",value:n.emailText,applied:n.emailAddress,onChange:(l,p)=>a(x=>({...x,emailText:l,emailAddress:p}))})})})})),r.jsx("input",{type:"hidden",name:"emailAddress",disabled:!d,value:n.emailAddress}),r.jsx(Br,{id:t+"-retry-route",steps:n.retryRoute,onChange:l=>a(p=>({...p,retryRoute:l}))}),r.jsx(qr,{id:t+"-retry-minutes",draft:n.retryDraft,applied:n.retryMinutes,onChange:(l,p)=>a(x=>({...x,retryDraft:l,retryMinutes:p}))}),r.jsx(Pe,{id:t+"-projects",name:"projects",label:"Проекты в сводке",options:de,multiple:!0,searchLabel:"Поиск проектов",emptyLabel:"Выбрать проекты",selected:n.projects,onChange:l=>{a(p=>{const x=l.includes(p.primaryProject)?p.primaryProject:"";return{...p,primaryProject:x,projects:x?[x,...l.filter(k=>k!==x)]:l}})}}),r.jsx(Pe,{id:t+"-priority",name:"primaryProject",label:"Первым в сводке",options:de,description:"Выбранный проект включается в сводку и показывается первым.",searchLabel:"Поиск первого проекта",emptyLabel:"Выбрать первый проект",recovery:h,selected:n.primaryProject?[n.primaryProject]:[],onChange:l=>y(l[0]??"")}),r.jsx(Le,{id:t+"-empty",name:"emptyDigest",label:"Если событий нет",options:Gt,value:n.emptyDigest,onChange:l=>f("emptyDigest",l)}),r.jsx(_e,{id:t+"-subject",name:"subject",label:"Тема сводки",icon:"pencil",value:n.subject,placeholder:"Введите тему",limit:120,onChange:l=>f("subject",l)}),r.jsx(Ot,{id:t+"-tags",name:"tags",label:"Теги сводки",tags:n.tags,draft:n.tagDraft,onChange:(l,p)=>a(x=>({...x,tags:l,tagDraft:p}))}),r.jsx(_e,{id:t+"-intro",name:"introText",label:"Вступительный текст",icon:"text",value:n.introText,limit:300,onChange:l=>f("introText",l)}),r.jsx(_e,{id:t+"-sender",name:"senderName",label:"Имя отправителя",icon:"person",value:"Trinet",description:"Имя задано профилем отправителя.",readOnly:!0})]}),r.jsx("p",{className:"neui-after",role:"status",children:i?"Настройки и черновики сохраняются на этом устройстве.":"Не удалось сохранить на устройстве. Изменения пока доступны в этой вкладке."})]})}const Xr=Object.assign({"./recipes/DateDemo.tsx":Qt,"./recipes/PeriodDemo.tsx":Jt,"./recipes/ProjectsDemo.tsx":Zt,"./recipes/TableDemo.tsx":en,"./recipes/TagsDemo.tsx":tn,"../recipes/Field.tsx":nn,"../recipes/LegacyField.tsx":an,"../recipes/LegacyRidge.tsx":rn,"../recipes/Reveal.tsx":sn,"../recipes/Ridge.tsx":on,"../stories/canvas.css":ln,"../stories/examples/RangeExample.tsx":cn,"../stories/form/CalendarField.tsx":un,"../stories/form/CalendarPanel.tsx":dn,"../stories/form/CalendarRangeField.tsx":pn,"../stories/form/ChoicePicker.tsx":mn,"../stories/form/DateSegments.tsx":fn,"../stories/form/DeliveryOrderField.tsx":gn,"../stories/form/EmailField.tsx":hn,"../stories/form/NotificationSettings.tsx":vn,"../stories/form/OptionRow.tsx":yn,"../stories/form/RetryIntervalField.tsx":bn,"../stories/form/TagField.tsx":xn,"../stories/form/TextField.tsx":wn,"../stories/form/options.ts":kn,"../stories/form/retries.ts":Nn,"../stories/form/settings.ts":jn,"../stories/form/tags.css":Cn,"../stories/form/useCalendarDrag.ts":Dn,"../stories/form/useChoiceWindow.ts":Sn});function Qr(e){const t=Object.entries(Xr).find(([n])=>n.endsWith("/"+e));if(!t)throw new Error("Не найден исходник "+e);return t[1]}const Jr=[{id:"date",name:"Календарь",icon:"calendar",text:"Выберите сегмент даты. После выбора года ассистент переходит к месяцу и дню. На каждой сетке доступны соседние страницы.",View:Nr,files:["DateDemo.tsx","CalendarField.tsx","CalendarPanel.tsx","DateSegments.tsx","useCalendarDrag.ts","canvas.css"]},{id:"period",name:"Диапазон дат",icon:"calendar",text:"У начала и конца интервала свои сегменты. Выбор первого дня переводит ассистент к дню окончания.",View:jr,files:["PeriodDemo.tsx","CalendarRangeField.tsx","CalendarPanel.tsx","DateSegments.tsx","canvas.css"]},{id:"range",name:"Слайдер",icon:"sliders",text:"Нативная шкала с дискретным шагом. Стрелки клавиатуры двигают ручку, значение остаётся в мета-пиле.",View:_r,files:["RangeExample.tsx","canvas.css"]},{id:"tags",name:"Теги",icon:"tag",text:"Enter добавляет тег в список. Потяните строку вправо для удаления или выберите тег и воспользуйтесь действием удаления.",View:Sr,files:["TagsDemo.tsx","TagField.tsx","tags.css","Field.tsx"]},{id:"projects",name:"Выбор с поиском",icon:"search",text:"Большой справочник раскрывается в потоке страницы. Поиск и выбранные значения остаются частями одного поля.",View:Or,files:["ProjectsDemo.tsx","ChoicePicker.tsx","OptionRow.tsx","useChoiceWindow.ts","options.ts","canvas.css"]},{id:"table",name:"Таблица",icon:"grid",text:"Нативная таблица с заголовками и независимым выбором строк. Счётчик внизу читает то же состояние, что и чекбоксы.",View:Lr,files:["TableDemo.tsx"]},{id:"settings",name:"Настройки сводки",icon:"layers",text:"Полная форма прототипа. Здесь можно проверить совместную работу полей, общий скролл, черновики и условную доставку по почте.",View:()=>r.jsx(zr,{embedded:!0}),files:["NotificationSettings.tsx","settings.ts","options.ts","EmailField.tsx","RetryIntervalField.tsx","DeliveryOrderField.tsx","TextField.tsx","canvas.css"]}];function Zr({recipe:e}){const[t,n]=m.useState(e.files[0]),{View:a}=e;return r.jsxs(zt,{className:"recipe-detail",id:"recipes/"+e.id,label:e.name,children:[r.jsx("p",{className:"recipe-description",children:e.text}),r.jsx("div",{className:"recipe-stage",children:r.jsx("div",{className:"neui-example",children:r.jsx(a,{})})}),r.jsxs("div",{className:"source-heading",children:[r.jsx("h3",{children:"Исходный код"}),r.jsx("select",{value:t,"aria-label":"Исходный файл рецепта",onChange:i=>n(i.target.value),children:e.files.map(i=>r.jsx("option",{children:i},i))})]}),r.jsx(Xt,{source:Qr(t),filename:t,folded:!0},t)]})}function ti(){return r.jsxs(r.Fragment,{children:[r.jsx(Ut,{subtitle:"Рабочие поля из примитивов NEUI. Забирайте разметку, меняйте поведение и подключайте свои данные."}),r.jsx("div",{className:"doc-sections",children:Jr.map(e=>r.jsx(Zr,{recipe:e},e.id))})]})}export{ti as default};
