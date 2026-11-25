import { useId, useState } from 'react'

export function RangeExample() {
  const id = useId()
  const [value, setValue] = useState(0.5)
  return <div className="neui-example">
    <div className="neui-ridge neui-track-focus" id={id}>
      <label slot="label" htmlFor={id + '-value'}>Громкость сигнала</label>
      <div className="neui-scale-example">
        <input id={id + '-value'} className="neui-range" type="range" min="0" max="1" step="0.25" value={value}
          aria-valuetext={Math.round(value * 100) + '%'} onChange={event => setValue(event.currentTarget.valueAsNumber)} />
        <div className="neui-range-ticks" aria-hidden="true">
          {[0, 0.25, 0.5, 0.75, 1].map(tick => <i key={tick} />)}
        </div>
        <div className="neui-scale-labels" aria-hidden="true"><span>0%</span><span>100%</span></div>
      </div>
      <output slot="meta" className="neui-pill" htmlFor={id + '-value'}>{Math.round(value * 100)}%</output>
    </div>
  </div>
}
