import { useEffect, useState } from 'react'
import { channels, emptyDigest, format, frequency, initialIntro, projects } from './options'
import type { Option } from './options'

const storageKey = 'trinet:storybook:notification-settings:v1'
const defaults = {
  frequency: 'daily', format: 'brief', delivery: ['inbox'], emailText: '', emailAddress: '',
  projects: ['trinet-design', 'entropy-automation'], primaryProject: '', emptyDigest: 'skip',
  subject: '', introText: initialIntro,
}
export type Settings = typeof defaults

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
    return {
      frequency: single(frequency, values.frequency, defaults.frequency),
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
    const { emailText, emailAddress, ...fields } = state
    const values = { ...fields, senderName: 'Trinet', ...(fields.delivery.includes('email') ? { emailAddress } : {}) }
    try {
      localStorage.setItem(storageKey, JSON.stringify({ values, emailDraft: { text: emailText, applied: emailAddress } }))
      setSaved(true)
    } catch { setSaved(false) }
  }, [state])
  return { state, setState, saved }
}
