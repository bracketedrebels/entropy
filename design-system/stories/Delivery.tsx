import { useRef, useState } from 'react'
import { Field, Pill, Reveal, Row } from '../src'

const channels = [
  ['inbox', 'Входящие Trinet', 'Во вкладку уведомлений'],
  ['email', 'Электронная почта', 'На адрес из профиля'],
  ['mobile', 'Уведомления телефона', 'На экран мобильного устройства'],
  ['browser', 'Уведомления браузера', 'На рабочий стол'],
  ['chat', 'Личный чат', 'Сообщением от бота'],
  ['team', 'Канал команды', 'В общую ленту команды'],
] as const

export function Mark({ selected, round = false }: { selected: boolean; round?: boolean }) {
  return <span aria-hidden="true" className="tn-mark" data-selected={selected} data-round={round || undefined} />
}
export function Delivery({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<readonly string[]>(['inbox'])
  const [order, setOrder] = useState<readonly (typeof channels[number])[]>(channels)
  const trigger = useRef<HTMLButtonElement>(null)
  const active = selected.flatMap(key => channels.filter(([value]) => value === key))
  const visible = active.length > 2 ? active.slice(0, 1) : active
  const caption = open ? 'Выбрано ' + active.length + ' из 6' : active.length > 2 ? 'Ещё ' + (active.length - 1) + ' из 6 вариантов' : '6 вариантов'
  function expand() {
    setOrder([...active, ...channels.filter(([key]) => !selected.includes(key))])
    setOpen(true)
  }
  function activateRow(key: string) {
    expand()
    requestAnimationFrame(() => document.getElementById(id + '-' + key)?.focus({ preventScroll: true }))
  }
  return <Field id={id} label="Куда доставлять сводку?" meta={
    <Pill.Action ref={trigger} aria-controls={id + '-options'} aria-expanded={open}
      aria-label={(open ? 'Свернуть' : 'Раскрыть') + ' каналы доставки. ' + caption}
      onClick={() => open ? setOpen(false) : expand()}>
      {caption}<svg className="tn-chev" data-open={open} width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
        <path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
    </Pill.Action>
  }>
    <Reveal followViewport open={open} id={id + '-options'} returnFocusRef={trigger} collapsed={visible.length ?
      visible.map(([key, name, detail]) => <Row key={key} as="button" className="tn-choice" leading={<Mark selected />}
        description={detail} onClick={() => activateRow(key)}>{name}</Row>) :
      <Row as="button" onClick={expand}>Доставка выключена</Row>}>
      {order.map(([key, name, detail]) => <Row key={key} as="label" className="tn-choice" description={detail}
        leading={<><input className="tn-option" id={id + '-' + key} type="checkbox" checked={selected.includes(key)}
          disabled={!open} onChange={event => setSelected(event.target.checked ? [...selected,key] : selected.filter(id => id !== key))} />
          <Mark selected={selected.includes(key)} /></>}>{name}</Row>)}
    </Reveal>
  </Field>
}
