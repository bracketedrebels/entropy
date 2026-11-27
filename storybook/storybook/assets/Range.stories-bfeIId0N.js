import{r as u,j as e}from"./iframe-jnNrxMJ8.js";import"./preload-helper-PPVm8Dsz.js";function i(){const a=u.useId(),[t,r]=u.useState(.5);return e.jsx("div",{className:"neui-example",children:e.jsxs("div",{className:"neui-ridge neui-track-focus",id:a,children:[e.jsx("label",{slot:"label",htmlFor:a+"-value",children:"Громкость сигнала"}),e.jsxs("div",{className:"neui-scale-example",children:[e.jsx("input",{id:a+"-value",className:"neui-range",type:"range",min:"0",max:"1",step:"0.25",value:t,"aria-valuetext":Math.round(t*100)+"%",onChange:n=>r(n.currentTarget.valueAsNumber)}),e.jsx("div",{className:"neui-range-ticks","aria-hidden":"true",children:[0,.25,.5,.75,1].map(n=>e.jsx("i",{},n))}),e.jsxs("div",{className:"neui-scale-labels","aria-hidden":"true",children:[e.jsx("span",{children:"0%"}),e.jsx("span",{children:"100%"})]})]}),e.jsxs("output",{slot:"meta",className:"neui-pill",htmlFor:a+"-value",children:[Math.round(t*100),"%"]})]})})}i.__docgenInfo={description:"",methods:[],displayName:"RangeExample"};const l=`import { useId, useState } from 'react'

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
`,o={id:"neui-range",title:"Примитивы/Range",component:i,tags:["autodocs"],parameters:{docs:{source:{code:l},description:{component:"Класс neui-range оформляет нативный ползунок. Границы и шаг задаются атрибутами min, max и step. Деления и подписи добавляет приложение."}}}},s={name:"Шкала с дробным шагом"},m=["Steps"];s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Шкала с дробным шагом'
}`,...s.parameters?.docs?.source}}};export{s as Steps,m as __namedExportsOrder,o as default};
