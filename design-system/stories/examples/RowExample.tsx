import { useState } from 'react'
import { useRipple } from '@trinet/design-system'

interface RowExampleProps {
  disabled: boolean
  description: string
}

export function RowExample({ disabled, description }: RowExampleProps) {
  const [checked, setChecked] = useState(false)
  const ripple = useRipple()

  return (
    <label ref={ripple} className="tn-row tn-ripple min-h-choice rounded-choice">
      <input type="checkbox" className="sr-only" checked={checked} disabled={disabled}
        onChange={event => setChecked(event.target.checked)} />
      <span className="row-area-leading place-self-center tn-mark" aria-hidden="true" data-selected={checked} />
      <span className="row-area-content min-w-0">
        Электронная почта
        <small className="block text-sm text-muted">{description}</small>
      </span>
    </label>
  )
}
