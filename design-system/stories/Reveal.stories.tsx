import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId, useRef, useState } from 'react'
import { Field, Reveal, Row } from '../src'

function Example() {
  const id = useId(), trigger = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  return <div className="tn-example">
    <button ref={trigger} className="tn-example-button" aria-expanded={open} aria-controls={id}
      onClick={() => setOpen(!open)}>{open ? 'Скрыть адрес' : 'Указать другой адрес'}</button>
    <Reveal id={id} open={open} returnFocusRef={trigger}>
      <div style={{ paddingTop: 16 }}><Field id={id + '-email'} label="Адрес для сводки"><Row>
        <input className="tn-field-input" aria-labelledby={id + '-email-label'} type="email" disabled={!open}
          placeholder="Адрес из профиля" onKeyDown={event => { if (event.key === 'Escape') { trigger.current?.focus(); setOpen(false) } }} />
      </Row></Field></div>
    </Reveal>
    <p className="tn-after">Сводка приходит раз в день.</p>
  </div>
}
const meta = { id: 'trinet-reveal', title: 'Примитивы/Reveal', component: Example, tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Управляемый Reveal принимает open, children и необязательный collapsed. Раскрытие сдвигает соседей. Повторите нажатие в середине движения, чтобы развернуть его. Черновик остаётся в смонтированном редакторе. Скрытая область исключена из навигации. Хозяин формы управляет участием контрола в отправке.' } } },
} satisfies Meta<typeof Example>
export default meta
export const Conditional: StoryObj<typeof meta> = { name: 'Условный адрес' }
