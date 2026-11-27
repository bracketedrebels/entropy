import type { Meta, StoryObj } from '@storybook/react-vite'
import { RangeExample } from './examples/RangeExample'
import source from './examples/RangeExample.tsx?raw'

const meta = {
  id: 'neui-range', title: 'Примитивы/Range', component: RangeExample, tags: ['autodocs'],
  parameters: { docs: { source: { code: source }, description: { component:
    'Класс neui-range оформляет нативный ползунок. Границы и шаг задаются атрибутами min, max и step. Деления и подписи добавляет приложение.' } } },
} satisfies Meta<typeof RangeExample>
export default meta
export const Steps: StoryObj<typeof meta> = { name: 'Шкала с дробным шагом' }
