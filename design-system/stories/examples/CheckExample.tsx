import { useId, useState } from 'react'
import type { CSSProperties } from 'react'

export function CheckExample() {
  const id = useId()
  const [level, setLevel] = useState(1)
  return <div className="grid gap-5">
    <div className="grid gap-3" style={{ '--neui-check-level': level } as CSSProperties}>
      <div className="flex items-center gap-4">
        <span className="neui-check-radio" aria-hidden="true" />
        <span className="neui-check-box" aria-hidden="true" />
        Цвет поверхности
      </div>
      <div className="flex items-center gap-4 before:neui-check-radio before:text-brand after:neui-check-box after:text-brand">
        Цвет бренда · ::before и ::after
      </div>
    </div>
    <label className="grid gap-2" htmlFor={id}>Яркость · {level.toFixed(2)}
      <input id={id} type="range" min="0" max="3" step=".05" value={level}
        onChange={event => setLevel(event.target.valueAsNumber)} />
    </label>
    <div className="flex flex-wrap gap-2" aria-label="Уровни яркости">
      {[0, 0.5, 1, 2].map(value => <button key={value} type="button" className="neui-pill"
        onClick={() => setLevel(value)}>{value}</button>)}
    </div>
  </div>
}
