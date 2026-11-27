import { useEffect, useState } from 'react'
import { calendarDraft, calendarRangeValue, calendarValue } from '@neui/kit/react'
import type { CalendarDraft, CalendarPart, CalendarRangeDraft } from '@neui/kit/react'
import { channels, emptyDigest, format, frequency, initialIntro, projects } from './options'
import type { Option } from './options'
import { interval, loadDeliverySteps, retryMinutes } from './retries'

const storageKey = 'trinet:storybook:notification-settings:v1'
const defaults = {
  retryRoute: loadDeliverySteps(undefined), retryMinutes: interval.initial, retryDraft: String(interval.initial),
  periodDraft: { start: {}, end: {} } as CalendarRangeDraft, dateDraft: {} as CalendarDraft, frequency: 'daily', format: 'brief', delivery: ['inbox'], emailText: '', emailAddress: '',
  projects: ['trinet-design', 'entropy-automation'], primaryProject: '', emptyDigest: 'skip',
  subject: '', introText: initialIntro, tags: ['potential', 'frequently_used'], tagDraft: '',
}
export type Settings = typeof defaults

function restoreDate(iso: unknown, rawDraft: unknown) {
  const dateDraft = calendarDraft(iso)
  if (!calendarValue(dateDraft) && rawDraft && typeof rawDraft === 'object') {
    for (const part of ['year', 'month', 'day'] as CalendarPart[]) {
      const raw: unknown = (rawDraft as Record<string, unknown>)[part]
      if (typeof raw === 'string' && /^\d+$/.test(raw) && raw.length <= (part === 'year' ? 4 : 2)) dateDraft[part] = raw
    }
  }
  return dateDraft
}

function load(): Settings {
  try {
    const record = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (!record || typeof record !== 'object') return defaults
    const values = record.values ?? {}, draft = record.emailDraft ?? {}
    const text = (value: unknown, fallback: string) => typeof value === 'string' ? value : fallback
    const single = (options: readonly Option[], value: unknown, fallback: string) =>
      options.some(([key, , , disabled]) => key === value && !disabled) ? String(value) : fallback
    const many = (options: readonly Option[], value: unknown, fallback: string[]) => Array.isArray(value)
      ? [...new Set(value.filter((key): key is string => options.some(([id]) => id === key)))] : fallback
    const primary = single(projects, values.primaryProject, '')
    const included = many(projects, values.projects, defaults.projects)
    const dateDraft = restoreDate(values.firstDigestDate, record.dateDraft)
    const periodDraft = {
      start: restoreDate(values.digestPeriod?.start, record.periodDraft?.start),
      end: restoreDate(values.digestPeriod?.end, record.periodDraft?.end),
    }
    const minutes = retryMinutes(String(values.retryMinutes)) ?? interval.initial
    return {
      retryRoute: loadDeliverySteps(values.retryRoute), retryMinutes: minutes,
      retryDraft: text(record.retryDraft, String(minutes)),
      tags: Array.isArray(values.tags) ? [...new Set<string>(values.tags.filter((t: unknown): t is string =>
        typeof t === 'string' && !!t.trim()).map((t: string) => t.trim()))] : defaults.tags,
      tagDraft: text(record.tagDraft, ''),
      periodDraft, dateDraft, frequency: single(frequency, values.frequency, defaults.frequency),
      format: single(format, values.format, defaults.format),
      emptyDigest: single(emptyDigest, values.emptyDigest, defaults.emptyDigest),
      delivery: many(channels, values.delivery, defaults.delivery),
      projects: primary ? [primary, ...included.filter(key => key !== primary)] : included,
      primaryProject: primary,
      emailAddress: text(draft.applied, text(values.emailAddress, '')), emailText: text(draft.text, text(values.emailAddress, '')),
      subject: text(values.subject, '').slice(0, 120), introText: text(values.introText, initialIntro).slice(0, 300),
    }
  } catch { return defaults }
}

export function useSettings() {
  const [state, setState] = useState(load)
  const [saved, setSaved] = useState(true)
  useEffect(() => {
    const { emailText, emailAddress, dateDraft, periodDraft, tagDraft, retryRoute, retryDraft, ...fields } = state
    const iso = calendarValue(dateDraft)
    const period = calendarRangeValue(periodDraft)
    const values = { ...fields, ...(period ? { digestPeriod: period } : {}), retryRoute: retryRoute.map(step => step.channel), ...(iso ? { firstDigestDate: iso } : {}), senderName: 'Trinet', ...(fields.delivery.includes('email') ? { emailAddress } : {}) }
    try {
      localStorage.setItem(storageKey, JSON.stringify({ values, tagDraft, retryDraft, ...(!period ? { periodDraft } : {}), ...(!iso ? { dateDraft } : {}), emailDraft: { text: emailText, applied: emailAddress } }))
      setSaved(true)
    } catch { setSaved(false) }
  }, [state])
  return { state, setState, saved }
}
