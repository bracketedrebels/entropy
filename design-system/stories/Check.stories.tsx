import type { Meta, StoryObj } from '@storybook/react-vite'
import { CheckExample } from './examples/CheckExample'
import source from './examples/CheckExample.tsx?raw'

const meta = {
  id: 'neui-check',
  title: 'Примитивы/Check',
  component: CheckExample,
  tags: ['autodocs'],
  parameters: { docs: { source: { code: source }, description: {
    component: 'neui-check-radio рисует круг, neui-check-box — квадрат. Яркость задаёт --neui-check-level. Попробуйте дробные значения, уровни выше единицы и обе темы. Цвет бренда в примере задаёт утилита text-brand.',
  } } },
} satisfies Meta<typeof CheckExample>

export default meta
export const Intensity: StoryObj<typeof meta> = { name: 'Форма и яркость' }
