import { useId, useRef, useState } from 'react'
import { Reveal } from '../../recipes/Reveal'
import { ChoicePicker } from './ChoicePicker'
import { EmailField } from './EmailField'
import { RadioField } from './OptionRow'
import { TextField } from './TextField'
import { channels, emptyDigest, format, frequency, projects } from './options'
import { useSettings } from './settings'

export function NotificationSettings() {
  const id = useId().replace(/:/g, '')
  const { state, setState, saved } = useSettings()
  const [previousProject, setPreviousProject] = useState('')
  const deliveryTrigger = useRef<HTMLButtonElement>(null)
  const priorityTrigger = useRef<HTMLButtonElement>(null)
  const emailEnabled = state.delivery.includes('email')
  function setText(key: 'frequency' | 'format' | 'emptyDigest' | 'subject' | 'introText', value: string) {
    setState(old => ({ ...old, [key]: value }))
  }
  function setPriority(key: string) {
    setPreviousProject('')
    setState(old => ({ ...old, primaryProject: key,
      projects: key ? [key, ...old.projects.filter(value => value !== key)] : old.projects }))
  }
  const recovery = (state.primaryProject || previousProject) && <button type="button" className="tn-pill"
    aria-label={(previousProject ? 'Вернуть' : 'Сбросить') + ' первый проект'}
    onClick={() => {
      priorityTrigger.current?.focus({ preventScroll: true })
      if (previousProject) setPriority(previousProject)
      else { setPreviousProject(state.primaryProject); setState(old => ({ ...old, primaryProject: '' })) }
    }}>{previousProject ? 'Вернуть' : 'Сбросить'}</button>

  return <main className="tn-example" lang="ru"><h1>Настройки сводки</h1>
    <form className="tn-settings" onSubmit={e => e.preventDefault()}>
      <RadioField id={id + '-frequency'} name="frequency" label="Как часто присылать сводку?" options={frequency}
        value={state.frequency} onChange={value => setText('frequency', value)} />
      <RadioField id={id + '-format'} name="format" label="В каком формате?" options={format}
        value={state.format} onChange={value => setText('format', value)} />
      <ChoicePicker id={id + '-delivery'} name="delivery" label="Куда доставлять сводку?" actionLabel="каналы доставки"
        options={channels} multiple selected={state.delivery} emptyLabel="Доставка выключена" triggerRef={deliveryTrigger}
        onChange={delivery => setState(old => ({ ...old, delivery }))} />
      <Reveal open={emailEnabled} returnFocusRef={deliveryTrigger}><div className="tn-conditional-field">
        <EmailField id={id + '-email'} enabled={emailEnabled} value={state.emailText} applied={state.emailAddress}
          onChange={(emailText, emailAddress) => setState(old => ({ ...old, emailText, emailAddress }))} />
      </div></Reveal>
      <ChoicePicker id={id + '-projects'} name="projects" label="Проекты в сводке" options={projects} multiple
        searchLabel="Поиск проектов" emptyLabel="Выбрать проекты" selected={state.projects} onChange={projects => {
          setState(old => {
            const primary = projects.includes(old.primaryProject) ? old.primaryProject : ''
            return { ...old, primaryProject: primary, projects: primary ? [primary, ...projects.filter(key => key !== primary)] : projects }
          })
        }} />
      <ChoicePicker id={id + '-priority'} name="primaryProject" label="Первым в сводке" options={projects}
        description="Выбранный проект включается в сводку и показывается первым." triggerRef={priorityTrigger}
        searchLabel="Поиск первого проекта" emptyLabel="Выбрать первый проект" recovery={recovery}
        selected={state.primaryProject ? [state.primaryProject] : []} onChange={values => setPriority(values[0] ?? '')} />
      <RadioField id={id + '-empty'} name="emptyDigest" label="Если событий нет" options={emptyDigest}
        value={state.emptyDigest} onChange={value => setText('emptyDigest', value)} />
      <TextField id={id + '-subject'} name="subject" label="Тема сводки" icon="pencil" value={state.subject}
        placeholder="Введите тему" limit={120} onChange={value => setText('subject', value)} />
      <TextField id={id + '-intro'} name="introText" label="Вступительный текст" icon="text" value={state.introText}
        limit={300} onChange={value => setText('introText', value)} />
      <TextField id={id + '-sender'} name="senderName" label="Имя отправителя" icon="person" value="Trinet"
        description="Имя задано профилем отправителя." readOnly />
    </form>
    <p className="tn-after" role="status">{saved ? 'Настройки и черновики сохраняются на этом устройстве.'
      : 'Не удалось сохранить на устройстве. Изменения пока доступны в этой вкладке.'}</p>
  </main>
}
