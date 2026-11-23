import { useId } from 'react'
import { Field, Row } from '@trinet/design-system'

export function FieldExample() {
  const id = useId()

  return (
    <Field id={id} label="Имя отправителя" description="Имя задано профилем отправителя.">
      <Row>
        <input
          readOnly
          value="Trinet"
          aria-labelledby={id + '-label'}
          aria-describedby={id + '-description'}
          className="w-full border-0 bg-transparent [font:inherit] text-muted"
        />
      </Row>
    </Field>
  )
}
