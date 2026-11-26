import { useId, useRef, useState } from 'react'
import { Reveal } from '../../recipes/Reveal'
import { CalendarRangeField } from './CalendarRangeField'
import { CalendarField } from './CalendarField'
import { ChoicePicker } from './ChoicePicker'
import { DeliveryOrderField } from './DeliveryOrderField'
import { RetryIntervalField } from './RetryIntervalField'
import { EmailField } from './EmailField'
import { RadioField } from './OptionRow'
import { TagField } from './TagField'
import { TextField } from './TextField'
import { channels, emptyDigest, format, frequency, projects } from './options'
import { useSettings } from './settings'

export function NotificationSettings() {
  const id = useId().replace(/:/g, '')
  const { state, setState, saved } = useSettings()
  const [previousProject, setPreviousProject] = useState('')
  const deliveryTrigger = useRef<HTMLButtonElement>(null)
  const emailEnabled = state.delivery.includes('email')
  function setText(key: 'frequency' | 'format' | 'emptyDigest' | 'subject' | 'introText', value: string) {
    setState(old => ({ ...old, [key]: value }))
  }
  function setPriority(key: string) {
    setPreviousProject('')
    setState(old => ({ ...old, primaryProject: key,
      projects: key ? [key, ...old.projects.filter(value => value !== key)] : old.projects }))
  }
  const recovery = (state.primaryProject || previousProject) && <button type="button" className="neui-pill"
    aria-label={(previousProject ? 'Вернуть' : 'Сбросить') + ' первый проект'}
    onClick={() => {
      if (previousProject) setPriority(previousProject)
      else { setPreviousProject(state.primaryProject); setState(old => ({ ...old, primaryProject: '' })) }
    }}>{previousProject ? 'Вернуть' : 'Сбросить'}</button>

  return <main className="neui-example" lang="ru"><h1>Настройки сводки</h1>
    <form className="neui-settings" onSubmit={e => e.preventDefault()}>
      <RadioField id={id + '-frequency'} name="frequency" label="Как часто присылать сводку?" options={frequency}
        value={state.frequency} onChange={value => setText('frequency', value)} />
      <CalendarField id={id + '-date'} name="firstDigestDate" label="Дата первой сводки" draft={state.dateDraft}
        onChange={dateDraft => setState(old => ({ ...old, dateDraft }))} />
      <CalendarRangeField id={id + '-period'} name="digestPeriod" label="Период событий" draft={state.periodDraft}
        onChange={periodDraft => setState(old => ({ ...old, periodDraft }))} />
      <RadioField id={id + '-format'} name="format" label="В каком формате?" options={format}
        value={state.format} onChange={value => setText('format', value)} />
      <ChoicePicker id={id + '-delivery'} name="delivery" label="Куда доставлять сводку?" actionLabel="каналы доставки"
        options={channels} multiple selected={state.delivery} emptyLabel="Доставка выключена" triggerRef={deliveryTrigger}
        onChange={delivery => setState(old => ({ ...old, delivery }))} />
      <Reveal open={emailEnabled} returnFocusRef={deliveryTrigger}><div className="neui-conditional-field">
        <EmailField id={id + '-email'} enabled={emailEnabled} value={state.emailText} applied={state.emailAddress}
          onChange={(emailText, emailAddress) => setState(old => ({ ...old, emailText, emailAddress }))} />
      </div></Reveal>
      <DeliveryOrderField id={id + '-retry-route'} steps={state.retryRoute}
        onChange={retryRoute => setState(old => ({ ...old, retryRoute }))} />
      <RetryIntervalField id={id + '-retry-minutes'} draft={state.retryDraft} applied={state.retryMinutes}
        onChange={(retryDraft, retryMinutes) => setState(old => ({ ...old, retryDraft, retryMinutes }))} />
      <ChoicePicker id={id + '-projects'} name="projects" label="Проекты в сводке" options={projects} multiple
        searchLabel="Поиск проектов" emptyLabel="Выбрать проекты" selected={state.projects} onChange={projects => {
          setState(old => {
            const primary = projects.includes(old.primaryProject) ? old.primaryProject : ''
            return { ...old, primaryProject: primary, projects: primary ? [primary, ...projects.filter(key => key !== primary)] : projects }
          })
        }} />
      <ChoicePicker id={id + '-priority'} name="primaryProject" label="Первым в сводке" options={projects}
        description="Выбранный проект включается в сводку и показывается первым."
        searchLabel="Поиск первого проекта" emptyLabel="Выбрать первый проект" recovery={recovery}
        selected={state.primaryProject ? [state.primaryProject] : []} onChange={values => setPriority(values[0] ?? '')} />
      <RadioField id={id + '-empty'} name="emptyDigest" label="Если событий нет" options={emptyDigest}
        value={state.emptyDigest} onChange={value => setText('emptyDigest', value)} />
      <TextField id={id + '-subject'} name="subject" label="Тема сводки" icon="pencil" value={state.subject}
        placeholder="Введите тему" limit={120} onChange={value => setText('subject', value)} />
      <TagField id={id + '-tags'} name="tags" label="Теги сводки" tags={state.tags} draft={state.tagDraft}
        onChange={(tags, tagDraft) => setState(old => ({ ...old, tags, tagDraft }))} />
      <TextField id={id + '-intro'} name="introText" label="Вступительный текст" icon="text" value={state.introText}
        limit={300} onChange={value => setText('introText', value)} />
      <TextField id={id + '-sender'} name="senderName" label="Имя отправителя" icon="person" value="Trinet"
        description="Имя задано профилем отправителя." readOnly />
    </form>
    <p className="neui-after" role="status">{saved ? 'Настройки и черновики сохраняются на этом устройстве.'
      : 'Не удалось сохранить на устройстве. Изменения пока доступны в этой вкладке.'}</p>
  </main>
}
