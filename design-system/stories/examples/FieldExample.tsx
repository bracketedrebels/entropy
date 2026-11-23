import { useId } from 'react'
import { Ridge } from '../../recipes/Ridge'

export function FieldExample() {
  const id = useId()
  return (
    <Ridge id={id} label="Имя отправителя">
      <fieldset className="tn-group" aria-labelledby={id + '-label'} aria-describedby={id + '-description'}>
        <div className="tn-row">
          <input readOnly value="Trinet" aria-labelledby={id + '-label'} aria-describedby={id + '-description'}
            className="row-area-content w-full border-0 bg-transparent [font:inherit] text-muted" />
        </div>
        <p id={id + '-description'} className="tn-note">Имя задано профилем отправителя.</p>
      </fieldset>
    </Ridge>
  )
}
