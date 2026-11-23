import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { Field, Pill, Row, useFocusAnchor } from '../../src'
import { Icon } from './Icon'

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
    <Pill.Status id={id + '-count'} className="tn-count" style={{ '--urgency': (50 - remaining) * 2 + '%' } as CSSProperties}>
      {word === 'one' ? 'Остался' : 'Осталось'} {remaining} {endings[word] ?? 'символа'}
    </Pill.Status>}>
    <Row className="tn-edit" leading={<Icon name={icon} />}>
      <textarea ref={editor} className="tn-editor" name={name} placeholder={placeholder} readOnly={readOnly} aria-labelledby={id + '-label'}
        aria-describedby={[description && id + '-description', remaining <= 50 && id + '-count'].filter(Boolean).join(' ') || undefined} rows={1} value={value} maxLength={limit}
        onChange={event => onChange?.(event.target.value)} />
      <span className="tn-caret-mirror" aria-hidden="true" ref={mirror}>{value + '\u200b'}</span>
    </Row>
  </Field>
}
