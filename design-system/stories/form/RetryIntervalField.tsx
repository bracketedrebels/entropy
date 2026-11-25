import { useRef, useState } from 'react'
import { Field } from '../../recipes/Field'
import { Reveal } from '../../recipes/Reveal'
import { interval, retryMinutes } from './retries'

const marks = Array.from({ length: 1 + (interval.max - interval.min) / interval.step }, (_, i) => interval.min + i * interval.step)
type Props = { id: string; draft: string; applied: number; onChange: (draft: string, applied: number) => void }

export function RetryIntervalField({ id, draft, applied, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const error = retryMinutes(draft) === undefined
    ? `Введите чётное число от ${interval.min} до ${interval.max}. Сейчас используется ${applied} мин.` : undefined
  return <Field id={id} label="Интервал между попытками" error={error} meta={
    <button type="button" ref={trigger} className="neui-pill" aria-controls={id + '-scale'} aria-expanded={open}
      onClick={() => setOpen(!open)}>{open ? 'Свернуть шкалу' : 'По шкале'}</button>}>
    <label className="neui-row neui-entry neui-ripple neui-focus">
      <span aria-hidden="true" className="neuicon-clock neui-row-area-leading place-self-center" />
      <input type="text" inputMode="decimal" className="neui-field-input neui-row-area-content" value={draft}
        aria-labelledby={id + '-label'} aria-describedby={error ? id + '-error' : undefined} aria-invalid={!!error}
        onChange={e => { const text = e.currentTarget.value; onChange(text, retryMinutes(text) ?? applied) }} />
      <span className="neui-row-area-trailing text-muted">мин</span>
    </label>
    <input type="hidden" name="retryMinutes" value={applied} />
    <Reveal open={open} id={id + '-scale'} returnFocusRef={trigger} followViewport>
      <div className="neui-scale-example">
        <input type="range" className="neui-range" aria-label="Интервал по шкале, минуты"
          min={interval.min} max={interval.max} step={interval.step} value={applied}
          onChange={e => onChange(e.currentTarget.value, e.currentTarget.valueAsNumber)} />
        <div className="neui-range-ticks" aria-hidden="true">{marks.map(mark => <i key={mark} />)}</div>
        <div className="neui-scale-labels" aria-hidden="true"><span>{interval.min} мин</span><span>{interval.max} мин</span></div>
      </div>
    </Reveal>
  </Field>
}
