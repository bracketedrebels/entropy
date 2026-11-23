import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotificationSettings as Form } from './form/NotificationSettings'
import source from './form/NotificationSettings.tsx?raw'

const meta = {
  id: 'trinet-form',
  title: 'Форма/Настройки сводки',
  component: Form,
  parameters: {
    docs: {
      source: { code: source },
      description: {
        component: 'Частота, доставка, проекты и текст сводки в одной форме. Выбор электронной почты раскрывает адрес. Поиск в обоих справочниках использует общую прокрутку формы.',
      },
    },
  },
} satisfies Meta<typeof Form>
export default meta
export const NotificationSettings: StoryObj<typeof meta> = { name: 'Настройки уведомлений' }
