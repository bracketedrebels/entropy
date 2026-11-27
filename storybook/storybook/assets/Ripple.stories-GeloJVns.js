import{r as a,j as e}from"./iframe-jnNrxMJ8.js";import"./preload-helper-PPVm8Dsz.js";function t(){const n=a.useId(),[r,o]=a.useState(.22);return e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",className:"neui-row neui-ripple min-h-32",children:e.jsxs("span",{className:"neui-row-area-content",children:["По умолчанию · 800 мс",e.jsx("small",{className:"neui-note",children:"Нажмите в нескольких местах подряд"})]})}),e.jsx("button",{type:"button",className:"neui-row neui-ripple duration-500",children:e.jsx("span",{className:"neui-row-area-content",children:"duration-500 · 500 мс"})}),e.jsxs("label",{htmlFor:n,className:"mt-6 block",children:["Прогресс волны · ",Math.round(r*100),"%"]}),e.jsx("input",{id:n,className:"w-full",type:"range",min:"0",max:"1",step:".01",value:r,onChange:i=>o(i.target.valueAsNumber)}),e.jsx("div",{className:"neui-row neui-ripple min-h-32","aria-hidden":"true",style:{"--neui-ripple-progress":r,"--neui-ripple-x":"30%"},children:e.jsx("span",{className:"neui-row-area-content",children:"Предпросмотр"})})]})}t.__docgenInfo={description:"",methods:[],displayName:"RippleExample"};const u=`import { useId, useState } from 'react'
import type { CSSProperties } from 'react'

export function RippleExample() {
  const id = useId()
  const [progress, setProgress] = useState(.22)
  return <>
    <button type="button" className="neui-row neui-ripple min-h-32">
      <span className="neui-row-area-content">По умолчанию · 800 мс<small className="neui-note">Нажмите в нескольких местах подряд</small></span>
    </button>
    <button type="button" className="neui-row neui-ripple duration-500">
      <span className="neui-row-area-content">duration-500 · 500 мс</span>
    </button>
    <label htmlFor={id} className="mt-6 block">Прогресс волны · {Math.round(progress * 100)}%</label>
    <input id={id} className="w-full" type="range" min="0" max="1" step=".01" value={progress}
      onChange={event => setProgress(event.target.valueAsNumber)} />
    <div className="neui-row neui-ripple min-h-32" aria-hidden="true"
      style={{ '--neui-ripple-progress': progress, '--neui-ripple-x': '30%' } as CSSProperties}>
      <span className="neui-row-area-content">Предпросмотр</span>
    </div>
  </>
}
`,c={id:"neui-ripple",title:"Примитивы/Ripple",component:t,tags:["autodocs"],parameters:{docs:{source:{code:u},description:{component:"Vite подключает поведение один раз для всего документа. Любая цель с классом neui-ripple получает волну из точки нажатия. Сравните рост за 800 мс и с классом duration-500. Нажмите в нескольких местах подряд, чтобы увидеть независимые волны. Ползунок позволяет рассмотреть освещённый и теневой склоны гребня."}}}},s={name:"Нажатие и прогресс"},m=["Press"];s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Нажатие и прогресс'
}`,...s.parameters?.docs?.source}}};export{s as Press,m as __namedExportsOrder,c as default};
