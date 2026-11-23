import { useId, useState } from 'react'
import { Field, Pill, Row } from '@trinet/design-system'

export function PillExample() {
  const id = useId()
  const [cleared, setCleared] = useState(false)

  return (
    <Field
      id={id}
      label="Первым в сводке"
      meta={
        <>
          <Pill.Action onClick={() => setCleared(value => !value)}>
            {cleared ? 'Вернуть' : 'Сбросить'}
          </Pill.Action>
          <Pill.Status>{cleared ? 'Выбрано 0' : 'Выбран 1'}</Pill.Status>
        </>
      }
    >
      <Row>{cleared ? 'Проект не выбран' : 'Trinet · Дизайн-система'}</Row>
    </Field>
  )
}
