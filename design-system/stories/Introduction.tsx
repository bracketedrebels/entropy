import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Field, Pill, Row, useFocusAnchor } from '../src'

const initial = 'Доброе утро, команда!\nВот новости проекта за неделю.\n\nВ пятницу покажем обновлённую форму на демо.'
const limit = 150
const words = new Intl.PluralRules('ru')
const endings: Record<string, string> = { one: 'символ', few: 'символа', many: 'символов' }

export function Introduction({ id }: { id: string }) {
  const [text, setText] = useState(initial)
  const editor = useRef<HTMLTextAreaElement>(null)
  const mirror = useRef<HTMLDivElement>(null)
  const remaining = limit - text.length
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
  return <Field id={id} label="Вступительный текст" meta={remaining <= 50 &&
    <Pill.Status id={id + '-count'} className="tn-count" style={{ '--urgency': (50 - remaining) * 2 + '%' } as CSSProperties}>
      {word === 'one' ? 'Остался' : 'Осталось'} {remaining} {endings[word] ?? 'символа'}
    </Pill.Status>}>
    <Row className="tn-edit" leading={<svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor"><path d="M2 3.5h12M2 7.5h9M2 11.5h7" /></svg>}>
      <textarea ref={editor} className="tn-editor" aria-labelledby={id + '-label'}
        aria-describedby={remaining <= 50 ? id + '-count' : undefined} rows={1} value={text} maxLength={limit}
        onChange={event => setText(event.target.value)} />
      <span className="tn-caret-mirror" aria-hidden="true" ref={mirror}>{text + '\u200b'}</span>
    </Row>
  </Field>
}
