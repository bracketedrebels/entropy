import { useLayoutEffect, useRef, useState } from 'react'
import { Field } from '../../recipes/Field'
import { Reveal } from '../../recipes/Reveal'
import { channels } from './options'
import type { DeliveryStep } from './retries'

const titles = new Map(channels.map(([key, title]) => [key, title]))
type Props = { id: string; steps: DeliveryStep[]; onChange: (steps: DeliveryStep[]) => void }

function ChannelButtons({ onChoose }: { onChoose: (channel: string) => void }) {
  return channels.map(([key, title]) => <button type="button" key={key} className="neui-row neui-ripple neui-focus"
    onClick={() => onChoose(key)}><span aria-hidden="true" className="neui-row-area-leading place-self-center">+</span>
    <span className="neui-row-copy">{title}</span></button>)
}

export function DeliveryOrderField({ id, steps, onChange }: Props) {
  const [panel, setPanel] = useState<string | null>(null)
  const [replacing, setReplacing] = useState(false)
  const [removed, setRemoved] = useState<{ step: DeliveryStep; next?: string; index: number }>()
  const [status, setStatus] = useState('')
  const addButton = useRef<HTMLButtonElement>(null)
  const rows = useRef(new Map<string, HTMLButtonElement>())
  const pendingFocus = useRef<string | null>(null)
  useLayoutEffect(() => {
    const target = pendingFocus.current
    if (target) (rows.current.get(target) ?? addButton.current)?.focus()
    pendingFocus.current = null
  }, [steps])
  function toggle(target: string) {
    setReplacing(false)
    setPanel(panel === target ? null : target)
  }
  function move(index: number, offset: number) {
    const target = index + offset
    if (target < 0 || target >= steps.length) return
    const next = steps.slice()
    const step = steps[index]
    next.splice(index, 1)
    next.splice(target, 0, step)
    pendingFocus.current = step.id
    onChange(next)
    setStatus(`Шаг ${target + 1}. ${titles.get(step.channel)}.`)
  }
  function remove(index: number) {
    const step = steps[index]
    setRemoved({ step, index, next: steps[index + 1]?.id })
    pendingFocus.current = steps[index + 1]?.id ?? steps[index - 1]?.id ?? 'add'
    setPanel(null)
    onChange(steps.filter(item => item.id !== step.id))
    setStatus(`Удалён шаг ${index + 1}. ${titles.get(step.channel)}.`)
  }
  function restore() {
    if (!removed) return
    const next = steps.slice()
    const anchor = next.findIndex(item => item.id === removed.next)
    next.splice(anchor < 0 ? Math.min(removed.index, next.length) : anchor, 0, removed.step)
    pendingFocus.current = removed.step.id
    onChange(next)
    setRemoved(undefined)
    setStatus('Шаг восстановлен.')
  }
  return <Field id={id} label="Порядок повторной доставки"
    description="После сбоя пробуем каналы по очереди. Один канал можно повторить."
    meta={<>
      {removed && <button type="button" className="neui-pill" onClick={restore}>Вернуть шаг</button>}
      <button ref={addButton} type="button" className="neui-pill" aria-expanded={panel === 'add'}
        aria-controls={id + '-add'} onClick={() => toggle('add')}>{panel === 'add' ? 'Свернуть каналы' : 'Добавить шаг'}</button>
    </>}>
    <ol className="m-0 list-none p-0" aria-label="Попытки доставки">
      {steps.map((step, index) => {
        const open = panel === step.id
        const actions = id + '-' + step.id
        return <li key={step.id}>
          <input type="hidden" name="retryRoute" value={step.channel} />
          <button type="button" className="neui-row neui-ripple neui-focus" aria-expanded={open} aria-controls={actions}
            ref={element => { if (element) rows.current.set(step.id, element); else rows.current.delete(step.id) }}
            onClick={() => toggle(step.id)}>
            <span className="neui-row-area-leading place-self-center text-muted tabular-nums">{index + 1}.</span>
            <span className="neui-row-copy">{titles.get(step.channel)}</span>
          </button>
          <Reveal id={actions} open={open}>
            <div className="neui-step-actions">
              <button type="button" className="neui-pill" disabled={index === 0} onClick={() => move(index, -1)}>Раньше</button>
              <button type="button" className="neui-pill" disabled={index === steps.length - 1} onClick={() => move(index, 1)}>Позже</button>
              <button type="button" className="neui-pill" aria-expanded={open && replacing} aria-controls={actions + '-choices'}
                onClick={() => setReplacing(!replacing)}>Заменить</button>
              <button type="button" className="neui-pill text-danger" onClick={() => remove(index)}>Удалить</button>
            </div>
            <div id={actions + '-choices'}>{open && replacing && <ChannelButtons onChoose={channel => {
              pendingFocus.current = step.id
              onChange(steps.map(item => item.id === step.id ? { ...item, channel } : item))
              setPanel(null)
              setStatus(`Шаг ${index + 1}. ${titles.get(channel)}.`)
            }} />}</div>
          </Reveal>
        </li>
      })}
    </ol>
    {!steps.length && <p className="neui-note">Повторных попыток пока нет.</p>}
    <Reveal id={id + '-add'} open={panel === 'add'} returnFocusRef={addButton} followViewport>
      <ChannelButtons onChoose={channel => {
        onChange([...steps, { id: crypto.randomUUID(), channel }])
        setStatus(`Добавлен шаг ${steps.length + 1}. ${titles.get(channel)}.`)
      }} />
    </Reveal>
    <span className="sr-only" role="status">{status}</span>
  </Field>
}
