import { useId, useState } from 'react'
import { enUS } from 'date-fns/locale/en-US'
import { ru } from 'date-fns/locale/ru'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { calendarDraft } from '@neui/kit/react'
import { CalendarField } from './form/CalendarField'
import source from './form/CalendarField.tsx?raw'

function Example({ language }: { language: 'ru' | 'en-US' }) {
  const [draft, setDraft] = useState(() => calendarDraft('2024-02-29'))
  return <CalendarField id={useId()} name="date" label="Дата первой сводки" draft={draft} onChange={setDraft}
    locale={language === 'ru' ? ru : enUS} />
}
const meta = {
  id: 'neui-calendar', title: 'Примитивы/Calendar', component: Example,
  args: { language: 'ru' }, argTypes: { language: { control: 'select', options: ['ru', 'en-US'] } },
  tags: ['autodocs'],
  parameters: { docs: { source: { code: source }, description: { component:
    'Выберите сегмент даты. Локаль задаёт порядок частей, названия месяцев и начало недели. По годам можно листать горизонтально.' } } },
} satisfies Meta<typeof Example>
export default meta
export const DatePicker: StoryObj<typeof meta> = { name: 'Выбор даты' }
