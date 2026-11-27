import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconExample } from './examples/IconExample'
import source from './examples/IconExample.tsx?raw'

const meta = {
  id: 'neui-icon',
  title: 'Примитивы/Icon',
  component: IconExample,
  tags: ['autodocs'],
  parameters: { docs: { source: { code: source }, description: {
    component: 'Ползунок управляет масками на элементе, в ::before и ::after. У бирки и корзины 120 положений. Кнопка проигрывает переход за 500 мс в любую сторону.',
  } } },
} satisfies Meta<typeof IconExample>

export default meta
export const Transitions: StoryObj<typeof meta> = { name: 'Маски и переходы' }
