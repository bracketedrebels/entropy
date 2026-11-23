import type { Meta, StoryObj } from '@storybook/react-vite'
import { RevealExample } from './examples/RevealExample'
import source from './examples/RevealExample.tsx?raw'

const meta = {
  id: 'trinet-reveal',
  title: 'Примитивы/Reveal',
  component: RevealExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: { code: source },
      description: {
        component: 'neui-reveal и neui-reveal-clip задают переход в потоке. useReveal синхронизирует доступность панели и возвращает фокус на триггер. Состояние раскрытия и разметка принадлежат приложению.',
      },
    },
  },
} satisfies Meta<typeof RevealExample>
export default meta
export const Conditional: StoryObj<typeof meta> = { name: 'Условный адрес' }
