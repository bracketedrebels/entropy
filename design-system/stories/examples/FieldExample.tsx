import { useId } from 'react'
import { Ridge } from '../../recipes/Ridge'

export function FieldExample() {
  const id = useId()
  return (
    <Ridge id={id} label="Имя отправителя">
      <fieldset className="neui-group" aria-labelledby={id + '-label'} aria-describedby={id + '-description'}>
        <div className="neui-row">
          <input readOnly value="Trinet" aria-labelledby={id + '-label'} aria-describedby={id + '-description'}
            className="neui-row-area-content w-full border-0 bg-transparent [font:inherit] text-muted" />
        </div>
        <p id={id + '-description'} className="neui-note">Имя задано профилем отправителя.</p>
      </fieldset>
    </Ridge>
  )
}
