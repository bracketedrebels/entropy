import { useState } from 'react'

interface RowExampleProps {
  disabled: boolean
  description: string
}

export function RowExample({ disabled, description }: RowExampleProps) {
  const [checked, setChecked] = useState(false)

  return (
    <label className="neui-row neui-ripple min-h-choice rounded-choice">
      <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled}
        onChange={event => setChecked(event.target.checked)} />
      <span className="neui-row-area-leading place-self-center neui-check-box peer-checked:[--neui-check-level:1]" aria-hidden="true" />
      <span className="neui-row-area-content min-w-0">
        Электронная почта
        <small className="block text-sm text-muted">{description}</small>
      </span>
    </label>
  )
}
