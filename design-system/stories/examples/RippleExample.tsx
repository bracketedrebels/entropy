import { useId, useState } from 'react'
import type { CSSProperties } from 'react'

export function RippleExample() {
  const id = useId()
  const [progress, setProgress] = useState(.5)
  return <>
    <button type="button" className="neui-row neui-ripple">
      <span className="neui-row-area-content">Нажмите в любой точке строки</span>
    </button>
    <label htmlFor={id} className="mt-6 block">Прогресс волны · {Math.round(progress * 100)}%</label>
    <input id={id} className="w-full" type="range" min="0" max="1" step=".01" value={progress}
      onChange={event => setProgress(event.target.valueAsNumber)} />
    <div className="neui-row neui-ripple" aria-hidden="true"
      style={{ '--neui-ripple-progress': progress, '--neui-ripple-x': '30%' } as CSSProperties}>
      <span className="neui-row-area-content">Предпросмотр</span>
    </div>
  </>
}
