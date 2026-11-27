import { useId, useState } from 'react'
import type { CSSProperties } from 'react'

export function RippleExample() {
  const id = useId()
  const [progress, setProgress] = useState(.22)
  return <>
    <button type="button" className="neui-row neui-ripple min-h-32">
      <span className="neui-row-area-content">По умолчанию · 800 мс<small className="neui-note">Нажмите в нескольких местах подряд</small></span>
    </button>
    <button type="button" className="neui-row neui-ripple duration-500">
      <span className="neui-row-area-content">duration-500 · 500 мс</span>
    </button>
    <label htmlFor={id} className="mt-6 block">Прогресс волны · {Math.round(progress * 100)}%</label>
    <input id={id} className="w-full" type="range" min="0" max="1" step=".01" value={progress}
      onChange={event => setProgress(event.target.valueAsNumber)} />
    <div className="neui-row neui-ripple min-h-32" aria-hidden="true"
      style={{ '--neui-ripple-progress': progress, '--neui-ripple-x': '30%' } as CSSProperties}>
      <span className="neui-row-area-content">Предпросмотр</span>
    </div>
  </>
}
