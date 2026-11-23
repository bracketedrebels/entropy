import { useId, useState } from 'react'
import { Ridge } from '../../recipes/Ridge'

export function PillExample() {
  const id = useId()
  const [cleared, setCleared] = useState(false)
  const meta = <>
    <button type="button" className="neui-pill" onClick={() => setCleared(value => !value)}>
      {cleared ? 'Вернуть' : 'Сбросить'}
    </button>
    <output className="neui-pill">{cleared ? 'Выбрано 0' : 'Выбран 1'}</output>
  </>

  return (
    <Ridge id={id} label="Первым в сводке" meta={meta}>
      <div className="neui-row">
        <span className="neui-row-area-content">{cleared ? 'Проект не выбран' : 'Trinet · Дизайн-система'}</span>
      </div>
    </Ridge>
  )
}
