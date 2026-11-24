import type { Meta, StoryObj } from '@storybook/react-vite'
import { RippleExample } from './examples/RippleExample'
import source from './examples/RippleExample.tsx?raw'

const meta = {
  id: 'neui-ripple',
  title: 'Примитивы/Ripple',
  component: RippleExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: { code: source },
      description: { component: 'Vite подключает поведение один раз для всего документа. Любая цель с классом neui-ripple получает волну из точки нажатия. Ползунок задаёт тот же CSS-прогресс вручную.' },
    },
  },
} satisfies Meta<typeof RippleExample>

export default meta
export const Press: StoryObj<typeof meta> = { name: 'Нажатие и прогресс' }
