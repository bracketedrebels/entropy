import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Code } from '../components'

const glyphs = ['neuicon-calendar', 'neuicon-mail', 'neuicon-star']
type Treatment = 'neui-extruded' | 'neui-intruded'

function Relief({ treatment }: { treatment: Treatment }) {
  const [depth, setDepth] = useState(8)
  const raised = treatment === 'neui-extruded'
  const caption = raised ? 'Высота подъёма' : 'Глубина погружения'
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
          min={0} max={16} step={0.5} value={depth} onChange={event => setDepth(event.currentTarget.valueAsNumber)} />
      </label>
    </div>
    <Code source={source} folded lang="HTML" />
  </>
}

export function Extrusion() { return <Relief treatment="neui-extruded" /> }
export function Intrusion() { return <Relief treatment="neui-intruded" /> }
