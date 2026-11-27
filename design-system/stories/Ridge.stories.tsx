import type { Meta, StoryObj } from '@storybook/react-vite'
import { FocusExample, RidgeExample } from './examples/RidgeExample'
import source from './examples/RidgeExample.tsx?raw'

const meta = {
  id: 'trinet-ridge',
  title: 'Примитивы/Ridge',
  component: RidgeExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: { code: source },
      description: {
        component: 'Класс neui-ridge рисует жёлоб с липкими краями. Класс neui-track-focus добавляет подсветку активной строки. Переключите track в Controls и пройдите по опциям с клавиатуры. Подпись, контролы и их доступные имена принадлежат приложению.',
      },
    },
  },
} satisfies Meta<typeof RidgeExample>
export default meta
export const Tall: StoryObj<typeof meta> = { name: 'Длинное поле', args: { track: true } }
export const WithoutTracker: StoryObj<typeof meta> = { name: 'Жёлоб без подсветки', args: { track: false } }
export const FocusOnly: StoryObj<typeof meta> = { name: 'Трекер без жёлоба', render: () => <FocusExample /> }
