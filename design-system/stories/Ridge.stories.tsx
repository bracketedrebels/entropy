import type { Meta, StoryObj } from '@storybook/react-vite'
import { RidgeExample } from './examples/RidgeExample'
import source from './examples/RidgeExample.tsx?raw'

import recipe from '../recipes/Ridge.tsx?raw'

const meta = {
  id: 'trinet-ridge',
  title: 'Примитивы/Ridge',
  component: RidgeExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: { code: "// recipes/Ridge.tsx\n" + recipe + "\n// stories/examples/RidgeExample.tsx\n" + source },
      description: {
        component: 'useRidge подключает геометрию и фокус к вашей разметке. Ниже доступны оба исходника: открытый рецепт жёлоба с тремя SVG и пример его использования. Прокрутите поле и перемещайте фокус между строками.',
      },
    },
  },
} satisfies Meta<typeof RidgeExample>
export default meta
export const Tall: StoryObj<typeof meta> = { name: 'Длинное поле' }
