import { useId, useState } from 'react'
import type { CalendarRangeDraft } from '@neui/kit/react'
import { CalendarRangeField } from '../../stories/form/CalendarRangeField'

export default function PeriodDemo() {
  const [draft, setDraft] = useState<CalendarRangeDraft>({ start: {}, end: {} })
  return <CalendarRangeField id={useId()} name="period" label="Период событий"
    draft={draft} onChange={setDraft} />
}
