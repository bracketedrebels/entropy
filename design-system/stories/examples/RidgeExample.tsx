import { useId } from 'react'
import { Ridge } from '../../recipes/Ridge'

export function RidgeExample() {
  const id = useId()
  return (
    <Ridge id={id} label="Этапы обработки">
      {Array.from({ length: 24 }, (_, index) => (
        <label className="tn-row" key={index}>
          <input className="row-area-leading place-self-center" type="radio" name={id} defaultChecked={index === 0} />
          <span className="row-area-content">Этап {index + 1}</span>
        </label>
      ))}
    </Ridge>
  )
}
