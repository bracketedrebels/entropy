import { useEffect, useRef, useState } from 'react'
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
