import { useRef, useState } from 'react'
import { Field } from '../../recipes/Field'
import { Reveal } from '../../recipes/Reveal'
import { interval, retryMinutes } from './retries'

const marks = Array.from({ length: 1 + (interval.max - interval.min) / interval.step }, (_, i) => interval.min + i * interval.step)
type Props = { id: string; draft: string; applied: number; onChange: (draft: string, applied: number) => void }

export function RetryIntervalField({ id, draft, applied, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const editor = useRef<HTMLInputElement>(null)
  const returning = useRef(false)
  function close() {
    returning.current = true
    editor.current?.focus({ preventScroll: true })
    returning.current = false
    setOpen(false)
  }
  const error = retryMinutes(draft) === undefined
    ? `Введите чётное число от ${interval.min} до ${interval.max}. Сейчас используется ${applied} мин.` : undefined
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
        {open && <button type="button" className="neui-pill" aria-label="Свернуть шкалу" aria-expanded="true"
          aria-controls={id + '-scale'} onClick={close}>Свернуть</button>}
      </div>
      <input type="hidden" name="retryMinutes" value={applied} />
      <Reveal open={open} id={id + '-scale'} returnFocusRef={editor} followViewport>
        <div className="neui-scale-example">
          <input type="range" className="neui-range" aria-label="Интервал по шкале, минуты"
            min={interval.min} max={interval.max} step={interval.step} value={applied}
            onChange={e => onChange(e.currentTarget.value, e.currentTarget.valueAsNumber)} />
          <div className="neui-range-ticks" aria-hidden="true">{marks.map(mark => <i key={mark} />)}</div>
          <div className="neui-scale-labels" aria-hidden="true"><span>{interval.min} мин</span><span>{interval.max} мин</span></div>
        </div>
      </Reveal>
    </div>
  </Field>
}
