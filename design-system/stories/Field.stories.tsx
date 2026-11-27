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
        component: 'Нативный fieldset, aria-labelledby и aria-describedby связывают группу, контрол и пояснение с видимой подписью жёлоба. Его полная разметка опубликована в примере Ridge.',
      },
    },
  },
} satisfies Meta<typeof FieldExample>
export default meta
export const Profile: StoryObj<typeof meta> = { name: 'Поле с пояснением' }
