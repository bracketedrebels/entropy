import { prepareBehavior } from './prepareBehavior'
import { attachRidge } from './ridge/legacy'

export { prepareBehavior }
export { useReveal, useRevealGroup } from './reveal/useReveal'
export { useFocusAnchor } from './ridge/focus'
export const useRidge = prepareBehavior(attachRidge)
export { useCalendar, useCalendarGrid } from './calendar/useCalendar'
export type { CalendarOptions } from './calendar/useCalendar'
export { calendarDraft, calendarValue, yearsPerPage } from './calendar/model'
export type { CalendarDraft, CalendarPart, CalendarCell } from './calendar/model'
