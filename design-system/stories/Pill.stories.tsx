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
        component: 'Pill.Action работает как нативная кнопка. Pill.Status показывает метаданные и пропускается при Tab. В нижнем слоте Field первая капсула располагается справа.',
      },
    },
  },
} satisfies Meta<typeof PillExample>
export default meta
export const Recovery: StoryObj<typeof meta> = { name: 'Действие и счётчик' }
