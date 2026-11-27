import { useId, useState } from 'react'
import { calendarDraft } from '@neui/kit/react'
import { CalendarField } from '../../stories/form/CalendarField'

export default function DateDemo() {
  const [draft, setDraft] = useState(() => calendarDraft('2026-11-26'))
  return <CalendarField id={useId()} name="date" label="Дата первой сводки"
    draft={draft} onChange={setDraft} />
}
