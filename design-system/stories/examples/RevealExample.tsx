import { useId, useRef, useState } from 'react'
import { useReveal } from '@neui/kit'

export function RevealExample() {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const panel = useReveal(open, trigger)

  return (
    <>
      <button type="button" ref={trigger} className="neui-pill" aria-expanded={open} aria-controls={id}
        onClick={() => setOpen(value => !value)}>
        {open ? 'Скрыть адрес' : 'Указать другой адрес'}
      </button>
      <div {...panel} id={id} className="neui-reveal">
        <div className="neui-reveal-clip">
          <label className="block pt-4">Адрес для сводки
            <input type="email" disabled={!open} placeholder="Адрес из профиля"
              className="block w-full border-0 bg-transparent [font:inherit] text-ink placeholder:text-muted"
              onKeyDown={event => {
                if (event.key === 'Escape') {
                  trigger.current?.focus({ preventScroll: true })
                  setOpen(false)
                }
              }} />
          </label>
        </div>
      </div>
      <p className="mt-[18px] mb-0 text-muted">Сводка приходит раз в день.</p>
    </>
  )
}
