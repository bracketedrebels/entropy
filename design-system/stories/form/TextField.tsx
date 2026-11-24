import { useLayoutEffect, useRef } from 'react'
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
    <div className="neui-row neui-ripple neui-edit">
      <span aria-hidden="true" className={`neui-row-leading ${icons[icon]}`} />
      <textarea ref={editor} className="neui-editor" name={name} placeholder={placeholder} readOnly={readOnly} aria-labelledby={id + '-label'}
        aria-describedby={[description && id + '-description', remaining <= 50 && id + '-count'].filter(Boolean).join(' ') || undefined} rows={1} value={value} maxLength={limit}
        onChange={event => onChange?.(event.target.value)} />
      <span className="neui-caret-mirror" aria-hidden="true" ref={mirror}>{value + '\u200b'}</span>
    </div>
  </Field>
}
