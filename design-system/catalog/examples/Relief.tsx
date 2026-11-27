import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Code } from '../components'

const glyphs = ['neuicon-calendar', 'neuicon-mail', 'neuicon-star']
function Relief({ initialDepth }: { initialDepth: number }) {
  const [depth, setDepth] = useState(initialDepth)
  const [concave, setConcave] = useState(initialDepth > 0)
  const treatment = concave ? 'neui-relief neui-inner-shadow' : 'neui-relief'
  const caption = 'Глубина рельефа'
  const style = { '--neui-depth': depth + 'px' } as CSSProperties
  const source = `<div class="${treatment} neui-depth-[${depth}px] duration-300
  grid size-16 place-items-center rounded-2xl">
  <i class="neuicon-mail text-2xl" aria-hidden="true"></i>
</div>`

  return <>
    <div className="sample-stage relief-stage">
      <div className="relief-tiles" aria-hidden="true">
        {glyphs.map(glyph => <div key={glyph} className={`relief-tile duration-300 ${treatment}`} style={style}>
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
          checked={concave} onChange={event => setConcave(event.currentTarget.checked)} />
        Вогнутая поверхность
      </label>
    </div>
    <Code source={source} folded lang="HTML" />
  </>
}

export function Extrusion() { return <Relief initialDepth={8} /> }
export function Intrusion() { return <Relief initialDepth={-8} /> }
