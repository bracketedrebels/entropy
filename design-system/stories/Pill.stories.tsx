import { useId, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, Pill, Row } from '../src'

function Example() {
  const id = useId(), [cleared, setCleared] = useState(false)
  return <div className="tn-example"><Field id={id} label="Первым в сводке" meta={<>
    <Pill.Action onClick={() => setCleared(!cleared)}>{cleared ? 'Вернуть' : 'Сбросить'}</Pill.Action>
    <Pill.Status>{cleared ? 'Выбрано 0' : 'Выбран 1'}</Pill.Status>
  </>}><Row>{cleared ? 'Проект не выбран' : 'Trinet · Дизайн-система'}</Row></Field></div>
}
const meta = { id: 'trinet-pill', title: 'Примитивы/Pill', component: Example, tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Pill.Action работает как нативная кнопка. Pill.Status показывает метаданные и пропускается при Tab. В нижнем слоте Field первая капсула располагается справа.' } } },
} satisfies Meta<typeof Example>
export default meta
export const Recovery: StoryObj<typeof meta> = { name: 'Действие и счётчик' }
