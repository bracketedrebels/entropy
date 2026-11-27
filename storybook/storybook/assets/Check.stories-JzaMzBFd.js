import{r as c,j as e}from"./iframe-jnNrxMJ8.js";import"./preload-helper-PPVm8Dsz.js";function n(){const r=c.useId(),[s,i]=c.useState(1);return e.jsxs("div",{className:"grid gap-5",children:[e.jsxs("div",{className:"grid gap-3",style:{"--neui-check-level":s},children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("span",{className:"neui-check-radio","aria-hidden":"true"}),e.jsx("span",{className:"neui-check-box","aria-hidden":"true"}),"Цвет поверхности"]}),e.jsx("div",{className:"flex items-center gap-4 before:neui-check-radio before:text-brand after:neui-check-box after:text-brand",children:"Цвет бренда · ::before и ::after"})]}),e.jsxs("label",{className:"grid gap-2",htmlFor:r,children:["Яркость · ",s.toFixed(2),e.jsx("input",{id:r,type:"range",min:"0",max:"3",step:".05",value:s,onChange:a=>i(a.target.valueAsNumber)})]}),e.jsx("div",{className:"flex flex-wrap gap-2","aria-label":"Уровни яркости",children:[0,.5,1,2].map(a=>e.jsx("button",{type:"button",className:"neui-pill",onClick:()=>i(a),children:a},a))})]})}n.__docgenInfo={description:"",methods:[],displayName:"CheckExample"};const l=`import { useId, useState } from 'react'
import type { CSSProperties } from 'react'

export function CheckExample() {
  const id = useId()
  const [level, setLevel] = useState(1)
  return <div className="grid gap-5">
    <div className="grid gap-3" style={{ '--neui-check-level': level } as CSSProperties}>
      <div className="flex items-center gap-4">
        <span className="neui-check-radio" aria-hidden="true" />
        <span className="neui-check-box" aria-hidden="true" />
        Цвет поверхности
      </div>
      <div className="flex items-center gap-4 before:neui-check-radio before:text-brand after:neui-check-box after:text-brand">
        Цвет бренда · ::before и ::after
      </div>
    </div>
    <label className="grid gap-2" htmlFor={id}>Яркость · {level.toFixed(2)}
      <input id={id} type="range" min="0" max="3" step=".05" value={level}
        onChange={event => setLevel(event.target.valueAsNumber)} />
    </label>
    <div className="flex flex-wrap gap-2" aria-label="Уровни яркости">
      {[0, 0.5, 1, 2].map(value => <button key={value} type="button" className="neui-pill"
        onClick={() => setLevel(value)}>{value}</button>)}
    </div>
  </div>
}
`,u={id:"neui-check",title:"Примитивы/Check",component:n,tags:["autodocs"],parameters:{docs:{source:{code:l},description:{component:"neui-check-radio рисует круг, neui-check-box — квадрат. Яркость задаёт --neui-check-level. Попробуйте дробные значения, уровни выше единицы и обе темы. Цвет бренда в примере задаёт утилита text-brand."}}}},t={name:"Форма и яркость"},m=["Intensity"];t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: 'Форма и яркость'
}`,...t.parameters?.docs?.source}}};export{t as Intensity,m as __namedExportsOrder,u as default};
