import type { Meta, StoryObj } from '@storybook/react-vite'
import { RidgeExample } from './examples/RidgeExample'
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
        component: 'Прокрутите высокое поле. Заголовок и нижняя дуга закрепляются в одном вертикальном скролле. Фокус подсвечивает жёлоб напротив строки. Для собственной координаты элемента доступен useFocusAnchor.',
      },
    },
  },
} satisfies Meta<typeof RidgeExample>
export default meta
export const Tall: StoryObj<typeof meta> = { name: 'Длинное поле' }
