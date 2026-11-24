import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconExample } from './examples/IconExample'
import source from './examples/IconExample.tsx?raw'

const meta = {
  id: 'neui-icon',
  title: 'Примитивы/Icon',
  component: IconExample,
  tags: ['autodocs'],
  parameters: { docs: { source: { code: source }, description: {
    component: 'Ползунок задаёт положение иконок. Кнопка запускает тот же переход за 500 мс в любую сторону.',
  } } },
} satisfies Meta<typeof IconExample>

export default meta
export const Transitions: StoryObj<typeof meta> = { name: 'Маски и переходы' }
