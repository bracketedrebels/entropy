import{r as s,j as e}from"./iframe-jnNrxMJ8.js";import"./preload-helper-PPVm8Dsz.js";function l(){const a=s.useId(),[t,i]=s.useState(0),[n,c]=s.useState(!1),p=n?"duration-0":"duration-500",u=n?"before:duration-0":"before:duration-500",f=n?"after:duration-0":"after:duration-500";return e.jsxs("section",{className:"grid gap-4",style:{"--neuicon-progress":t},children:[e.jsxs("p",{className:"flex items-center gap-4",children:[e.jsx("span",{"aria-hidden":"true",className:`neuicon-transition neuicon-from-star neuicon-to-person text-3xl ${p}`}),"Звезда → профиль"]}),e.jsx("p",{className:`flex items-center gap-4 before:text-3xl before:neuicon-transition before:neuicon-from-star before:neuicon-to-person ${u}`,children:"Звезда → профиль в ::before"}),e.jsx("p",{className:`flex items-center gap-4 after:text-3xl after:neuicon-transition after:neuicon-from-tag after:neuicon-to-trash after:bg-accent ${f}`,children:"Бирка → корзина в ::after"}),e.jsx("p",{className:`flex items-center gap-4 before:text-3xl after:text-3xl before:neuicon-transition before:neuicon-from-trash before:neuicon-to-tag after:neuicon-transition after:neuicon-from-star after:neuicon-to-person ${u} ${f}`,children:"Обе иконки на одном элементе"}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:a,children:["Прогресс перехода · ",Math.round(t*100),"%"]}),e.jsx("input",{id:a,className:"w-full",type:"range",min:"0",max:"1",step:".01",value:t,onChange:o=>{c(!0),i(o.target.valueAsNumber)}})]}),e.jsx("button",{className:"neui-pill w-fit",type:"button",onClick:()=>{c(!1),i(o=>o>=.5?0:1)},children:t>=.5?"В начало":"В конец"})]})}l.__docgenInfo={description:"",methods:[],displayName:"IconExample"};const m=`import { useId, useState } from 'react'
import type { CSSProperties } from 'react'

export function IconExample() {
  const id = useId()
  const [progress, setProgress] = useState(0)
  const [scrubbing, setScrubbing] = useState(false)
  const duration = scrubbing ? 'duration-0' : 'duration-500'
  const before = scrubbing ? 'before:duration-0' : 'before:duration-500'
  const after = scrubbing ? 'after:duration-0' : 'after:duration-500'
  return <section className="grid gap-4" style={{ '--neuicon-progress': progress } as CSSProperties}>
    <p className="flex items-center gap-4">
      <span aria-hidden="true" className={\`neuicon-transition neuicon-from-star neuicon-to-person text-3xl \${duration}\`} />
      Звезда → профиль
    </p>
    <p className={\`flex items-center gap-4 before:text-3xl before:neuicon-transition before:neuicon-from-star before:neuicon-to-person \${before}\`}>
      Звезда → профиль в ::before
    </p>
    <p className={\`flex items-center gap-4 after:text-3xl after:neuicon-transition after:neuicon-from-tag after:neuicon-to-trash after:bg-accent \${after}\`}>
      Бирка → корзина в ::after
    </p>
    <p className={\`flex items-center gap-4 before:text-3xl after:text-3xl before:neuicon-transition before:neuicon-from-trash before:neuicon-to-tag after:neuicon-transition after:neuicon-from-star after:neuicon-to-person \${before} \${after}\`}>
      Обе иконки на одном элементе
    </p>
    <div>
      <label htmlFor={id}>Прогресс перехода · {Math.round(progress * 100)}%</label>
      <input id={id} className="w-full" type="range" min="0" max="1" step=".01" value={progress}
        onChange={event => { setScrubbing(true); setProgress(event.target.valueAsNumber) }} />
    </div>
    <button className="neui-pill w-fit" type="button" onClick={() => {
      setScrubbing(false)
      setProgress(value => value >= .5 ? 0 : 1)
    }}>{progress >= .5 ? 'В начало' : 'В конец'}</button>
  </section>
}
`,x={id:"neui-icon",title:"Примитивы/Icon",component:l,tags:["autodocs"],parameters:{docs:{source:{code:m},description:{component:"Ползунок управляет масками на элементе, в ::before и ::after. У бирки и корзины 120 положений. Кнопка проигрывает переход за 500 мс в любую сторону."}}}},r={name:"Маски и переходы"},g=["Transitions"];r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Маски и переходы'
}`,...r.parameters?.docs?.source}}};export{r as Transitions,g as __namedExportsOrder,x as default};
