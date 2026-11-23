import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId } from 'react'
import { Delivery } from './Delivery'
import { Introduction } from './Introduction'

function Form() {
  const id = useId().replace(/:/g, '')
  return <main className="tn-example"><h1>Настройки сводки</h1>
    <Delivery id={id + '-delivery'} /><Introduction id={id + '-intro'} />
  </main>
}
const meta = { id: 'trinet-form', title: 'Форма/Настройки сводки', component: Form,
  parameters: { docs: { description: { component: 'Два поля используют один жёлоб. Раскройте каналы доставки, затем перенесите каретку между строками вступительного текста.' } } },
} satisfies Meta<typeof Form>
export default meta
export const NotificationSettings: StoryObj<typeof meta> = { name: 'Каналы и текст' }
