import { useState } from 'react'
import { Row } from '@trinet/design-system'

interface RowExampleProps {
  disabled: boolean
  description: string
}

export function RowExample({ disabled, description }: RowExampleProps) {
  const [checked, setChecked] = useState(false)

  return (
    <Row
      as="label"
      className="min-h-choice rounded-choice"
      description={description}
      leading={
        <>
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            disabled={disabled}
            onChange={event => setChecked(event.target.checked)}
          />
          <span aria-hidden="true" className="tn-mark" data-selected={checked} />
        </>
      }
    >
      Электронная почта
    </Row>
  )
}
