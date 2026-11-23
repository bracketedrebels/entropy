import { useEffect, useRef, useState } from 'react'
import { Field, Row } from '../../src'
import { Icon } from './Icon'

export function EmailField({ id, enabled, value, applied, onChange }: {
  id: string; enabled: boolean; value: string; applied: string; onChange: (text: string, applied: string) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [reviewed, setReviewed] = useState(Boolean(value && value !== applied))
  const [invalid, setInvalid] = useState(false)
  useEffect(() => { setInvalid(Boolean(input.current?.validity.typeMismatch)) }, [enabled, value])
  const error = enabled && reviewed && invalid
    ? 'Проверьте адрес, например name@example.com. Пока используется ' + (applied || 'адрес из профиля') + '.' : undefined
  return <Field id={id} label="Адрес для сводки" error={error}><Row className="tn-entry" leading={<Icon name="mail" />}>
    <input type="email" ref={input} className="tn-field-input" autoComplete="email" placeholder="Адрес из профиля"
      disabled={!enabled} aria-labelledby={id + '-label'} aria-invalid={Boolean(error)} aria-describedby={error ? id + '-error' : undefined}
      value={value} onBlur={() => setReviewed(true)} onChange={e => {
        const { value, validity } = e.currentTarget
        onChange(value, validity.valid ? value.trim() : applied)
      }} />
    <input type="hidden" name="emailAddress" value={applied} disabled={!enabled} />
  </Row></Field>
}
