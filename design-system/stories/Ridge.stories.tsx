import { useId } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Ridge, Row } from '../src'

function Example() {
  const id = useId()
  return <div className="tn-example"><Ridge id={id} label="Этапы обработки">
    {Array.from({ length: 24 }, (_, i) => <Row as="label" key={i}>
      <input type="radio" name={id} defaultChecked={i === 0} /> Этап {i + 1}
    </Row>)}
  </Ridge></div>
}
const meta = { id: 'trinet-ridge', title: 'Примитивы/Ridge', component: Example, tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Прокрутите высокое поле. Заголовок и нижняя дуга закрепляются в одном вертикальном скролле. Фокус подсвечивает жёлоб напротив строки. Для собственной координаты элемента доступен useFocusAnchor.' } } },
} satisfies Meta<typeof Example>
export default meta
export const Tall: StoryObj<typeof meta> = { name: 'Длинное поле' }
