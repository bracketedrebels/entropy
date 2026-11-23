import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotificationSettings as Form } from './form/NotificationSettings'

const meta = { id: 'trinet-form', title: 'Форма/Настройки сводки', component: Form,
  parameters: { docs: { description: { component: 'Частота, доставка, проекты и текст сводки в одной форме. Выбор электронной почты раскрывает адрес. Поиск в обоих справочниках использует общую прокрутку формы.' } } },
} satisfies Meta<typeof Form>
export default meta
export const NotificationSettings: StoryObj<typeof meta> = { name: 'Настройки уведомлений' }
