import { useId, useRef, useState } from 'react'
import { Field, Reveal, Row } from '@trinet/design-system'

export function RevealExample() {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        ref={trigger}
        aria-expanded={open}
        aria-controls={id}
        className="min-h-action cursor-pointer rounded-row border-0 bg-pill px-4 py-2 [font:inherit] text-ink"
        onClick={() => setOpen(value => !value)}
      >
        {open ? 'Скрыть адрес' : 'Указать другой адрес'}
      </button>
      <Reveal id={id} open={open} returnFocusRef={trigger}>
        <div className="pt-4">
          <Field id={id + '-email'} label="Адрес для сводки">
            <Row>
              <input
                aria-labelledby={id + '-email-label'}
                className="w-full border-0 bg-transparent [font:inherit] text-ink placeholder:text-muted"
                type="email"
                disabled={!open}
                placeholder="Адрес из профиля"
                onKeyDown={event => {
                  if (event.key === 'Escape') {
                    trigger.current?.focus({ preventScroll: true })
                    setOpen(false)
                  }
                }}
              />
            </Row>
          </Field>
        </div>
      </Reveal>
      <p className="mt-[18px] mb-0 text-muted">Сводка приходит раз в день.</p>
    </>
  )
}
