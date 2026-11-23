import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode, RefObject } from 'react'
import { Field, Pill, Reveal, Row } from '../../src'
import { Icon } from './Icon'
import { OptionRow } from './OptionRow'
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
  const beforeResize = useRef<number | null>(null)
  const motion = useRef<Animation | null>(null)
  function captureHeight() {
    if (!windowed || !list.current?.animate) return
    beforeResize.current = list.current.getBoundingClientRect().height
    motion.current?.cancel()
  }
  // A 144-row list opens at the same visible speed as a short list. Release the
  // height constraint at the end so the document owns its full scroll extent.
  useLayoutEffect(() => {
    const before = beforeResize.current
    beforeResize.current = null
    const host = list.current, pitch = probe.current?.getBoundingClientRect().height
    if (before === null || !host || !pitch || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const limit = window.innerHeight + 2 * pitch
    const from = Math.min(before, limit)
    const to = Math.min((open ? matches.length : preview.length) * pitch, limit)
    if (Math.abs(from - to) < 1) return
    const animation = host.animate([{ height: from + 'px' }, { height: to + 'px' }],
      { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)' })
    motion.current = animation
    return () => animation.cancel()
  }, [open, query, matches.length, preview.length, list, probe])
  function filter(value: string) {
    returnToStart()
    captureHeight()
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
    captureHeight()
    if (settled) setSession(order)
    nextFocus.current = target ?? null
    setFocusKey(target ?? null)
    setSettled(false)
    setOpen(true)
  }
  function returnToStart() {
    const field = document.getElementById(id)
    if (field && field.getBoundingClientRect().top < 0) field.scrollIntoView({ block: 'start', behavior: 'instant' })
  }
  function close() {
    trigger.current?.focus({ preventScroll: true })
    if (windowed) returnToStart()
    captureHeight()
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
      const ceiling = Math.max(0, search.current?.closest('.tn-header-slot')?.getBoundingClientRect().bottom ?? 0)
      const floor = Math.min(window.innerHeight, trigger.current?.getBoundingClientRect().top ?? window.innerHeight)
      if (top < ceiling) window.scrollBy(0, top - ceiling)
      else if (top + pitch > floor) window.scrollBy(0, top + pitch - floor)
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
  let gap = 0
  function flushGap(index: number) {
    if (!gap) return
    rows.push(<Reveal.Item key={'gap-' + (index - gap)} open={open}>
      <div aria-hidden="true" style={{ height: 'calc(' + gap + ' * var(--tn-project-height))' }} />
    </Reveal.Item>)
    gap = 0
  }
  for (const [index, option] of matches.entries()) {
    const key = option[0], inPreview = preview.includes(option)
    if (windowed && !inPreview && key !== focusKey && (index < range.first || index >= range.end)) {
      gap++
      continue
    }
    flushGap(index)
    if (open && !multiple) visibleControls.add(key)
    rows.push(<Reveal.Item key={key} open={open || inPreview} returnFocusRef={trigger}>
      <div onKeyDown={event => navigate(event, index)} onFocus={() => { if (windowed && open) setFocusKey(key) }}>
        <OptionRow id={id + '-' + key} name={name} option={option} multiple={multiple} selected={selected.includes(key)}
          onChoose={() => choose(key)} disclosure={open ? undefined : { controls: optionsId, expand: () => expand(key) }} />
      </div>
    </Reveal.Item>)
  }
  flushGap(matches.length)

  return <Field id={id} label={label} description={description} header={searchable && <Reveal open={open} returnFocusRef={trigger}>
    <Row className="tn-entry" leading={<Icon name="search" />} trailing={query && <button className="tn-clear" type="button"
      aria-label="Очистить поиск" onClick={() => { filter(''); search.current?.focus({ preventScroll: true }) }}>
      <Icon name="clear" /></button>}>
      <input ref={search} type="search" className="tn-field-input" aria-label={searchLabel} placeholder={searchLabel}
        disabled={!open} aria-controls={optionsId} value={query} onChange={e => filter(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Escape') { e.preventDefault(); close() }
          if (matches.length && (e.key === 'ArrowDown' || e.key === 'Enter')) { e.preventDefault(); focusOption(0) }
        }} />
    </Row>
  </Reveal>} meta={<>
    <Pill.Action ref={trigger} aria-controls={optionsId} aria-expanded={open}
      aria-label={(open ? 'Свернуть' : 'Раскрыть') + ' ' + actionLabel + '. ' + caption}
      onClick={e => open ? close() : expand(e.detail === 0 ? (searchable ? 'search' : order[0]?.[0]) : undefined)}>
      {caption}<svg className="tn-chev" data-open={open} width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
        <path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
    </Pill.Action>{recovery}
  </>}>
    <Reveal.Group followViewport open={open} id={optionsId} onCollapsed={() => setSettled(true)}>
      <div ref={list} className={windowed ? 'tn-catalog' : undefined}>
        {windowed && <div ref={probe} className="tn-pitch" aria-hidden="true" />}
        {rows}
      </div>
      {open && !!terms.length && <p className="tn-note" role="status">{matches.length
        ? 'Найдено: ' + matches.length : 'Совпадений нет. Попробуйте другой запрос.'}</p>}
      <Reveal.Item open={!open && !chosen.length} returnFocusRef={trigger}>
        <Row as="button" leading={<Icon name={name === 'delivery' ? 'mail' : 'project'} />}
          onClick={() => expand(searchable ? 'search' : order[0]?.[0])}>{emptyLabel}</Row>
      </Reveal.Item>
    </Reveal.Group>
    {!multiple && !selected.length && <input type="hidden" name={name} value="" />}
    {selected.filter(key => !visibleControls.has(key)).map(key => <input key={key} type="hidden" name={name} value={key} />)}
  </Field>
}
