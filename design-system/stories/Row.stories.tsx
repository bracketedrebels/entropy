import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Row } from '../src'
import { Mark } from './form/OptionRow'

function Example({ disabled, description }: { disabled: boolean; description: string }) {
  const [checked, setChecked] = useState(false)
  return <div className="tn-example"><Row as="label" className="tn-choice" description={description} leading={
    <><input type="checkbox" className="tn-option" checked={checked} disabled={disabled} onChange={e => setChecked(e.target.checked)} />
      <Mark selected={checked} /></>}>Электронная почта</Row></div>
}
const meta = { id: 'trinet-row', title: 'Примитивы/Row', component: Example, tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Row задаёт сетку и область нажатия. Укажите as="label" для нативной опции, as="button" для действия или оставьте div для редактора. leading, children, description и trailing занимают отдельные места. Ripple принадлежит цели нажатия. Значение и focus остаются у контрола.' } } },
  args: { disabled: false, description: 'На адрес из профиля' },
} satisfies Meta<typeof Example>
export default meta
export const Checkbox: StoryObj<typeof meta> = { name: 'Строка выбора' }
export const Disabled: StoryObj<typeof meta> = { name: 'Недоступная опция', args: { disabled: true, description: 'Укажите адрес в профиле' } }
