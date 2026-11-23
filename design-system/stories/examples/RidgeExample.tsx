import { useId } from 'react'
import { Ridge, Row } from '@trinet/design-system'

export function RidgeExample() {
  const id = useId()

  return (
    <Ridge id={id} label="Этапы обработки">
      {Array.from({ length: 24 }, (_, index) => (
        <Row as="label" key={index}>
          <input type="radio" name={id} defaultChecked={index === 0} />
          {' Этап ' + (index + 1)}
        </Row>
      ))}
    </Ridge>
  )
}
