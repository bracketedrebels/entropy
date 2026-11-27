import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Code } from '../components'

const shapes = [
  ['С фокусом', ''],
  ['Широкий отступ', 'neui-ridge-inset-[18px]'],
  ['Радиус 16', 'neui-ridge-radius-[16px]'],
] as const

export default function Ridge() {
  const [shape, setShape] = useState(0)
  const [depth, setDepth] = useState(1)
  const [strength, setStrength] = useState(1)
  const classes = ('neui-ridge neui-track-focus ' + shapes[shape][1]).trim()
  const style = { '--neui-ridge-depth': depth, '--neui-focus-strength': strength } as CSSProperties
  const controls = [
    { name: 'Глубина желоба', value: depth, change: setDepth, max: 1 },
    { name: 'Сила света', value: strength, change: setStrength, max: 3 },
  ]
  const source = `<section class="${classes} neui-ridge-depth-[${depth}] neui-focus-strength-[${strength}]">
  <span slot="label">Канал сигнала</span>
  <label class="neui-row neui-ripple">
    <input type="radio" name="channel" class="neui-row-area-leading neui-check-radio appearance-none checked:[--neui-check-level:1]" checked>
    <span class="neui-row-area-content">Основной</span>
  </label>
</section>`
  return <>
    <div className="sample-stage stage-ridge">
      <section className={classes} style={style}>
        <span slot="label">Канал сигнала</span>
        {['Основной', 'Резервный'].map((label, i) => <label className="neui-row neui-ripple cursor-pointer" key={label}>
          <input type="radio" name="atlas-ridge-channel" defaultChecked={i === 0}
            className="neui-row-area-leading neui-check-radio appearance-none m-0 checked:[--neui-check-level:1]" />
          <span className="neui-row-area-content">{label}</span>
        </label>)}
        {controls.map(control => <label className="relief-control neui-focus-anchor" key={control.name}>
          <span>{control.name}</span><output aria-hidden="true">{control.value}</output>
          <input type="range" className="neui-range" aria-label={control.name} min={0} max={control.max} step={0.05}
            value={control.value} onChange={e => control.change(e.currentTarget.valueAsNumber)} />
        </label>)}
      </section>
    </div>
    <div className="variants" aria-label="Конфигурация Ridge">
      {shapes.map(([label], i) => <button type="button" className="neui-pill neui-ripple" key={label}
        aria-pressed={shape === i} onClick={() => setShape(i)}>{label}</button>)}
    </div>
    <Code source={source} folded lang="HTML" />
  </>
}
