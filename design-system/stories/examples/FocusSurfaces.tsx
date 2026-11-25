import { useId, useState } from 'react'
import type { FocusEvent } from 'react'
import { TextField } from '../form/TextField'
import './focus-surfaces.css'

const variants = [
  { id: 'tone', label: 'Тон', hint: 'За волной остаётся ровный, чуть более светлый тон.' },
  { id: 'light', label: 'Свет', hint: 'Волна открывает тёплый свет, падающий сверху.' },
  { id: 'line', label: 'Строка', hint: 'Мягкая полоса следует за строкой, в которой вы печатаете.' },
  { id: 'ring', label: 'Контур', hint: 'Исходный вариант для сравнения. Волна проявляет линию по краю.' },
] as const

const sample = [
  'Готовим обновление поиска. В выдаче уже видны названия проектов и последние изменения.',
  'До четверга проверим длинные запросы и пустую выдачу на телефоне.',
  'В пятницу соберём отзывы и отправим команде короткую сводку.',
].join('\n\n')

export function FocusSurfaces() {
  const id = useId()
  const [variant, setVariant] = useState<(typeof variants)[number]>(variants[0])
  const [value, setValue] = useState(sample)

  function keepCaretOnBlur(event: FocusEvent<HTMLElement>) {
    if (variant.id !== 'line' || !(event.target instanceof HTMLTextAreaElement)) return
    // The Ridge releases its caret measurement on blur. The fading band keeps that last position.
    const ridge = event.target.closest<HTMLElement>('.neui-track-focus')
    if (ridge) event.currentTarget.style.setProperty('--lab-last-focus-y', ridge.style.getPropertyValue('--neui-focus-y'))
  }

  return <section className="neui-example focus-surfaces" data-material={variant.id} onBlurCapture={keepCaretOnBlur}>
    <fieldset className="neui-group">
      <legend>Фокус при вводе</legend>
      <div className="focus-surfaces-options">
        {variants.map(item => <label className="neui-ripple" key={item.id}>
          <input type="radio" className="neui-option" name={id} value={item.id}
            checked={variant.id === item.id} onChange={() => setVariant(item)} />
          <span className="neui-check-radio" aria-hidden="true" />
          {item.label}
        </label>)}
      </div>
    </fieldset>
    <p className="focus-surfaces-hint">{variant.hint}</p>
    <TextField id={id + '-editor'} name="summary" label="Текст сводки" icon="pencil"
      value={value} onChange={setValue} />
  </section>
}
