import { useLayoutEffect, useRef, useState } from 'react'
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
  const focusOnOpen = useRef<string | null>(null)
  const optionsId = id + '-options'
  const active = order.filter(([key]) => selected.includes(key))
  const visible = active.length > 2 ? active.slice(0, 1) : active
  const caption = open ? 'Выбрано ' + active.length + ' из 6' : active.length > 2 ? 'Ещё ' + (active.length - 1) + ' из 6 вариантов' : '6 вариантов'
  useLayoutEffect(() => {
    const key = focusOnOpen.current
    if (open && key) {
      document.getElementById(id + '-' + key)?.focus({ preventScroll: true })
      focusOnOpen.current = null
    }
  }, [id, open])

  function expand(focusKey?: string) {
    focusOnOpen.current = focusKey ?? null
    setOpen(true)
  }
  return <Field id={id} label="Куда доставлять сводку?" meta={
    <Pill.Action ref={trigger} aria-controls={optionsId} aria-expanded={open}
      aria-label={(open ? 'Свернуть' : 'Раскрыть') + ' каналы доставки. ' + caption}
      onClick={() => open ? setOpen(false) : expand()}>
      {caption}<svg className="tn-chev" data-open={open} width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
        <path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
    </Pill.Action>
  }>
    <Reveal.Group followViewport open={open} id={optionsId}
      onCollapsed={() => setOrder([...active, ...channels.filter(([key]) => !selected.includes(key))])}>
      {order.map(channel => {
        const [key, name, detail] = channel
        const checked = selected.includes(key)
        const controlId = id + '-' + key
        return <Reveal.Item key={key} open={open || visible.includes(channel)} returnFocusRef={trigger}>
          <Row as="label" htmlFor={controlId} className="tn-choice" description={detail} leading={<>
            {open
              ? <input id={controlId} className="tn-option" type="checkbox" checked={checked}
                  onChange={() => setSelected(previous => previous.includes(key)
                    ? previous.filter(value => value !== key) : [...previous, key])} />
              : <button id={controlId} className="tn-option" type="button" aria-expanded={false}
                  aria-controls={optionsId} onClick={() => expand(key)} />}
            <Mark selected={checked} />
          </>}>{name}</Row>
        </Reveal.Item>
      })}
      <Reveal.Item open={!open && !active.length} returnFocusRef={trigger}>
        <Row as="button" onClick={() => expand(channels[0][0])}>Доставка выключена</Row>
      </Reveal.Item>
    </Reveal.Group>
  </Field>
}
