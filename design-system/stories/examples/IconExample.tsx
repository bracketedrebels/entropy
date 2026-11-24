import { useId, useState } from 'react'
import type { CSSProperties } from 'react'

const pairs = [
  ['Звезда → профиль', 'neui-icon-from-star neui-icon-to-person'],
  ['Бирка → корзина', 'neui-icon-from-tag neui-icon-to-trash'],
  ['Корзина → бирка', 'neui-icon-from-trash neui-icon-to-tag'],
] as const

export function IconExample() {
  const id = useId()
  const [progress, setProgress] = useState(0)
  const [scrubbing, setScrubbing] = useState(false)
  function toggle() {
    setScrubbing(false)
    setProgress(value => value >= .5 ? 0 : 1)
  }
  return <section className="grid gap-4">
    {pairs.map(([label, classes]) => <div key={label} className="flex items-center gap-4">
      <span aria-hidden="true" className={`neui-icon-transition text-3xl ${classes} ${scrubbing ? 'duration-0' : 'duration-500'}`}
        style={{ '--neui-icon-progress': progress } as CSSProperties} />
      <span>{label}</span>
    </div>)}
    <div>
      <label htmlFor={id}>Прогресс перехода · {Math.round(progress * 100)}%</label>
      <input id={id} className="w-full" type="range" min="0" max="1" step=".01" value={progress}
        onChange={event => { setScrubbing(true); setProgress(event.target.valueAsNumber) }} />
    </div>
    <button className="neui-pill w-fit" type="button" onClick={toggle}>
      {progress >= .5 ? 'В начало' : 'В конец'}
    </button>
    <p className="flex items-center gap-2 text-muted before:neui-icon-star after:neui-icon-person after:bg-accent">
      Маски в ::before и ::after
    </p>
  </section>
}
