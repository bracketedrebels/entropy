import type { Meta, StoryObj } from '@storybook/react-vite'
import { PillExample } from './examples/PillExample'
import source from './examples/PillExample.tsx?raw'

const meta = {
  id: 'trinet-pill',
  title: 'Примитивы/Pill',
  component: PillExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: { code: source },
      description: {
        component: 'tn-pill задаёт материал и область попадания на одном HTML-элементе. Кнопка выполняет действие, output сообщает изменившееся количество. Фон капсулы нарисован CSS.',
      },
    },
  },
} satisfies Meta<typeof PillExample>
export default meta
export const Recovery: StoryObj<typeof meta> = { name: 'Действие и счётчик' }
