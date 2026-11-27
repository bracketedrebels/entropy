import{r as a,j as e}from"./iframe-jnNrxMJ8.js";import{R as u}from"./Ridge-BgGbeQ1Z.js";import"./preload-helper-PPVm8Dsz.js";import"./presence-BcgZgrm1.js";function r(){const o=a.useId(),[s,n]=a.useState(!1),i=e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",className:"neui-pill",onClick:()=>n(l=>!l),children:s?"Вернуть":"Сбросить"}),e.jsx("output",{className:"neui-pill",children:s?"Выбрано 0":"Выбран 1"})]});return e.jsx(u,{id:o,label:"Первым в сводке",meta:i,children:e.jsx("div",{className:"neui-row",children:e.jsx("span",{className:"neui-row-area-content",children:s?"Проект не выбран":"Trinet · Дизайн-система"})})})}r.__docgenInfo={description:"",methods:[],displayName:"PillExample"};const c=`import { useId, useState } from 'react'
import { Ridge } from '../../recipes/Ridge'

export function PillExample() {
  const id = useId()
  const [cleared, setCleared] = useState(false)
  const meta = <>
    <button type="button" className="neui-pill" onClick={() => setCleared(value => !value)}>
      {cleared ? 'Вернуть' : 'Сбросить'}
    </button>
    <output className="neui-pill">{cleared ? 'Выбрано 0' : 'Выбран 1'}</output>
  </>

  return (
    <Ridge id={id} label="Первым в сводке" meta={meta}>
      <div className="neui-row">
        <span className="neui-row-area-content">{cleared ? 'Проект не выбран' : 'Trinet · Дизайн-система'}</span>
      </div>
    </Ridge>
  )
}
`,f={id:"trinet-pill",title:"Примитивы/Pill",component:r,tags:["autodocs"],parameters:{docs:{source:{code:c},description:{component:"neui-pill задаёт материал и область попадания на одном HTML-элементе. Кнопка выполняет действие, output сообщает изменившееся количество. Фон капсулы нарисован CSS."}}}},t={name:"Действие и счётчик"},g=["Recovery"];t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: 'Действие и счётчик'
}`,...t.parameters?.docs?.source}}};export{t as Recovery,g as __namedExportsOrder,f as default};
