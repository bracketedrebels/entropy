import { useLayoutEffect, useRef, useState } from 'react'
import { Field } from '../../recipes/Field'
import { Reveal } from '../../recipes/Reveal'
import { channels } from './options'
import type { DeliveryStep } from './retries'
import './tags.css'

const titles = new Map(channels.map(([key, title]) => [key, title]))
type Props = { id: string; steps: DeliveryStep[]; onChange: (steps: DeliveryStep[]) => void }

type RemovedStep = { step: DeliveryStep; next?: string; index: number }

function restoreStep(steps: DeliveryStep[], removed: RemovedStep) {
  if (steps.some(item => item.id === removed.step.id)) return steps
  const next = steps.slice()
  const anchor = next.findIndex(item => item.id === removed.next)
  next.splice(anchor < 0 ? Math.min(removed.index, next.length) : anchor, 0, removed.step)
  return next
}

function ChannelButtons({ onChoose }: { onChoose: (channel: string) => void }) {
  return channels.map(([key, title]) => <button type="button" key={key} className="neui-row neui-ripple neui-focus"
    onClick={() => onChoose(key)}><span aria-hidden="true" className="neui-row-area-leading place-self-center">+</span>
    <span className="neui-row-copy">{title}</span></button>)
}

export function DeliveryOrderField({ id, steps, onChange }: Props) {
  const [panel, setPanel] = useState<string | null>(null)
  const [removed, setRemoved] = useState<RemovedStep>()
  const [leaving, setLeaving] = useState<RemovedStep[]>([])
  const visible = leaving.reduceRight(restoreStep, steps)
  const positions = leaving.length ? new Map(steps.map((step, index) => [step.id, index])) : undefined
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
    const deletion = { step, index, next: steps[index + 1]?.id }
    setRemoved(deletion)
    setLeaving(old => [...old, deletion])
    pendingFocus.current = steps[index + 1]?.id ?? steps[index - 1]?.id ?? 'add'
    setPanel(null)
    onChange(steps.filter(item => item.id !== step.id))
    setStatus(`Удалён шаг ${index + 1}. ${titles.get(step.channel)}.`)
  }
  function restore() {
    if (!removed) return
    setLeaving(old => old.filter(entry => entry.step.id !== removed.step.id))
    pendingFocus.current = removed.step.id
    onChange(restoreStep(steps, removed))
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
    <span className="sr-only" id={id + '-help'}>Нажмите на шаг для изменения порядка. Для удаления потяните вправо или нажмите Delete.</span>
    <ol className="neui-tags" aria-label="Попытки доставки">
      {visible.map((step, position) => {
        const index = positions ? positions.get(step.id) ?? -1 : position
        const present = index >= 0
        const ordinal = (present ? index : position) + 1
        const open = panel === step.id && present
        const actions = id + '-' + step.id
        return <li key={step.id}><Reveal.Group open={present}
          onCollapsed={() => setLeaving(old => old.filter(entry => entry.step.id !== step.id))}>
          <Reveal.Item open={present}>
            <div className="neui-swipe-right neui-tag neui-focus-anchor neui-focus neui-ripple" data-neui-swipe-open={open}>
              <button type="button" className="neui-swipe-content neui-tag-name" aria-expanded={open} aria-controls={actions}
                ref={el => { if (el) rows.current.set(step.id, el); else rows.current.delete(step.id) }}
                aria-label={ordinal + '. ' + titles.get(step.channel)} aria-describedby={id + '-help'}
                aria-keyshortcuts="Delete Backspace" onClick={() => toggle(step.id)}
                onKeyDown={e => {
                  if (e.key === 'Delete' || e.key === 'Backspace') {
                    e.preventDefault()
                    if (!e.repeat && present) remove(index)
                  } else if (e.key === 'Escape') setPanel(null)
                }}>{titles.get(step.channel)}</button>
              <button type="button" className="neui-swipe-action" aria-label={'Удалить попытку ' + ordinal}
                aria-hidden={!open} tabIndex={open ? 0 : -1} disabled={!present} onClick={() => remove(index)}>
                <span className="neui-tag-word"><span>Удалить</span></span>
              </button>
              <span className="neui-tag-icon neui-step-icon" aria-hidden="true">
                <span className="neui-step-number">{ordinal}.</span>
                <span className="neuicon-transition neuicon-to-trash duration-0" />
              </span>
            </div>
            <Reveal id={actions} open={open}>
              <div className="neui-step-actions">
                <button type="button" className="neui-pill" disabled={index <= 0} onClick={() => move(index, -1)}>Вверх</button>
                <button type="button" className="neui-pill" disabled={!present || index === steps.length - 1} onClick={() => move(index, 1)}>Вниз</button>
              </div>
            </Reveal>
          </Reveal.Item>
        </Reveal.Group></li>
      })}
    </ol>
    {steps.map(step => <input key={step.id} type="hidden" name="retryRoute" value={step.channel} />)}
    {!steps.length && <p className="neui-note">Повторных попыток пока нет.</p>}
    <Reveal id={id + '-add'} open={panel === 'add'} returnFocusRef={addButton} followViewport>
      {steps.length > 0 && <hr className="neui-divider" />}
      <div role="group" aria-label="Каналы для добавления">
        <ChannelButtons onChoose={channel => {
          onChange([...steps, { id: crypto.randomUUID(), channel }])
          setStatus(`Добавлен шаг ${steps.length + 1}. ${titles.get(channel)}.`)
        }} />
      </div>
    </Reveal>
    <span className="sr-only" role="status">{status}</span>
  </Field>
}
