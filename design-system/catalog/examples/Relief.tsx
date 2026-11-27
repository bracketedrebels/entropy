import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Code } from '../components'

const glyphs = ['neuicon-calendar', 'neuicon-mail', 'neuicon-star']
export default function Relief() {
  const [depth, setDepth] = useState(8)
  const [dither, setDither] = useState(true)
  const caption = 'Глубина рельефа'
  const style = { '--neui-depth': depth + 'px', '--neui-relief-dither': dither ? undefined : 'none' } as CSSProperties
  const source = `<div class="neui-relief neui-depth-[${depth}px] duration-300
  grid size-16 place-items-center rounded-3xl"${dither ? '' : ' style="--neui-relief-dither: none"'}>
  <i class="neuicon-mail text-2xl" aria-hidden="true"></i>
</div>`

  return <>
    <div className="sample-stage">
      <div className="relief-tiles" aria-hidden="true">
        {glyphs.map(glyph => <div key={glyph} className="relief-tile neui-relief rounded-3xl duration-300" style={style}>
          <i className={glyph} />
        </div>)}
      </div>
      <label className="relief-control">
        <span>{caption}</span><output aria-hidden="true">{depth} px</output>
        <input type="range" className="neui-range" aria-label={caption} aria-valuetext={depth + ' px'}
          min={-16} max={16} step={0.5} value={depth} onChange={event => setDepth(event.currentTarget.valueAsNumber)} />
      </label>
      <label className="inline-flex items-center gap-3 min-h-action cursor-pointer">
        <input type="checkbox" className="neui-check-box appearance-none m-0 checked:[--neui-check-level:1]"
          checked={dither} onChange={event => setDither(event.currentTarget.checked)} />
        Дизеринг тени
      </label>
    </div>
    <Code source={source} folded lang="HTML" />
  </>
}
