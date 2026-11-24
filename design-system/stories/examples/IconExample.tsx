import { useId, useState } from 'react'
import type { CSSProperties } from 'react'

export function IconExample() {
  const id = useId()
  const [progress, setProgress] = useState(0)
  const [scrubbing, setScrubbing] = useState(false)
  const duration = scrubbing ? 'duration-0' : 'duration-500'
  const before = scrubbing ? 'before:duration-0' : 'before:duration-500'
  const after = scrubbing ? 'after:duration-0' : 'after:duration-500'
  return <section className="grid gap-4" style={{ '--neuicon-progress': progress } as CSSProperties}>
    <p className="flex items-center gap-4">
      <span aria-hidden="true" className={`neuicon-transition neuicon-from-star neuicon-to-person text-3xl ${duration}`} />
      Звезда → профиль
    </p>
    <p className={`flex items-center gap-4 before:text-3xl before:neuicon-transition before:neuicon-from-star before:neuicon-to-person ${before}`}>
      Звезда → профиль в ::before
    </p>
    <p className={`flex items-center gap-4 after:text-3xl after:neuicon-transition after:neuicon-from-tag after:neuicon-to-trash after:bg-accent ${after}`}>
      Бирка → корзина в ::after
    </p>
    <p className={`flex items-center gap-4 before:text-3xl after:text-3xl before:neuicon-transition before:neuicon-from-trash before:neuicon-to-tag after:neuicon-transition after:neuicon-from-star after:neuicon-to-person ${before} ${after}`}>
      Обе иконки на одном элементе
    </p>
    <div>
      <label htmlFor={id}>Прогресс перехода · {Math.round(progress * 100)}%</label>
      <input id={id} className="w-full" type="range" min="0" max="1" step=".01" value={progress}
        onChange={event => { setScrubbing(true); setProgress(event.target.valueAsNumber) }} />
    </div>
    <button className="neui-pill w-fit" type="button" onClick={() => {
      setScrubbing(false)
      setProgress(value => value >= .5 ? 0 : 1)
    }}>{progress >= .5 ? 'В начало' : 'В конец'}</button>
  </section>
}
