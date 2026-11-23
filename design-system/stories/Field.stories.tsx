import type { Meta, StoryObj } from '@storybook/react-vite'
import { FieldExample } from './examples/FieldExample'
import source from './examples/FieldExample.tsx?raw'

const meta = {
  id: 'trinet-field',
  title: 'Примитивы/Field',
  component: FieldExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: { code: source },
      description: {
        component: 'Field связывает заголовок, пояснение и содержимое жёлоба. Для текстового контрола пример задаёт доступное имя и описание.',
      },
    },
  },
} satisfies Meta<typeof FieldExample>
export default meta
export const Profile: StoryObj<typeof meta> = { name: 'Поле с пояснением' }
