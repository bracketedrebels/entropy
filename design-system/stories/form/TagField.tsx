import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Field } from '../../recipes/Field'
import { Reveal } from '../../recipes/Reveal'
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
  const [exiting, setExiting] = useState<Removed[]>([])
  const [undo, setUndo] = useState<Removed>()
  const visible = exiting.reduceRight(restoreAt, tags)
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
    setExiting(old => [...old, removed])
    onChange(tags.filter(tag => tag !== value), draft)
  }
  function commit() {
    const value = draft.trim()
    if (!value) return
    setExiting(old => old.filter(row => row.value !== value))
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
    setExiting(old => old.filter(row => row.value !== undo.value))
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
      {visible.map(value => {
        const present = tags.includes(value), expanded = open === value, teaching = guide === value
        return <li key={value}><Reveal.Group open={present} onCollapsed={() => setExiting(old => old.filter(row => row.value !== value))}>
          <Reveal.Item open={present}><div className="neui-swipe-right neui-tag neui-focus-anchor neui-focus neui-ripple"
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
          {teaching && <p className="neui-note neui-tag-hint" id={id + '-hint'}>Потяни вправо для удаления</p>}
          </Reveal.Item>
        </Reveal.Group></li>
      })}
    </ul>
    {tags.map(value => <input key={value} type="hidden" name={name} value={value} />)}
  </Field>
}
