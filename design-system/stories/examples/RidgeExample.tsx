import { useId } from 'react'

export function RidgeExample({ track = true }: { track?: boolean }) {
  const id = useId()
  return <section className={track ? 'neui-ridge neui-track-focus' : 'neui-ridge'} aria-labelledby={id}>
    <span slot="label" id={id}>Этапы обработки</span>
    {Array.from({ length: 24 }, (_, index) => (
      <label className="neui-row" key={index}>
        <input className="neui-row-area-leading place-self-center" type="radio" name={id} defaultChecked={index === 0} />
        <span className="neui-row-area-content">Этап {index + 1}</span>
      </label>
    ))}
  </section>
}

export function FocusExample() {
  return <div className="neui-track-focus relative">
    <span aria-hidden="true" className="pointer-events-none absolute left-0 h-2 w-1 -translate-y-1/2 rounded-full bg-accent"
      style={{ top: 'var(--neui-focus-y)', opacity: 'var(--neui-focus-active)' }} />
    <label className="neui-focus-anchor flex items-center gap-4 py-3 pl-4">Имя<input className="min-w-0" /></label>
    <label className="neui-focus-anchor flex items-center gap-4 py-3 pl-4">Город<input className="min-w-0" /></label>
  </div>
}
