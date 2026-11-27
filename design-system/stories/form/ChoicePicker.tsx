import { useLayoutEffect, useMemo, useRef, useState } from 'react'
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
  const terms = fold(query).split(/\s+/).filter(Boolean)
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
          <span aria-hidden="true" className={`neui-row-area-leading place-self-center ${name === 'delivery' ? 'neuicon-mail' : 'neuicon-project'}`} />
          <span className="neui-row-copy">{emptyLabel}</span>
        </button>
      </Reveal.Item>}
    </Reveal.Group>
    {!multiple && !selected.length && <input type="hidden" name={name} value="" />}
    {selected.filter(key => !visibleControls.has(key)).map(key => <input key={key} type="hidden" name={name} value={key} />)}
  </Field>
}
