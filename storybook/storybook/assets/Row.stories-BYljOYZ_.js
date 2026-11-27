import{r as l,j as s}from"./iframe-jnNrxMJ8.js";import"./preload-helper-PPVm8Dsz.js";function t({disabled:c,description:e}){const[o,u]=l.useState(!1);return s.jsxs("label",{className:"neui-row neui-ripple min-h-choice rounded-choice",children:[s.jsx("input",{type:"checkbox",className:"peer sr-only",checked:o,disabled:c,onChange:d=>u(d.target.checked)}),s.jsx("span",{className:"neui-row-area-leading place-self-center neui-check-box peer-checked:[--neui-check-level:1]","aria-hidden":"true"}),s.jsxs("span",{className:"neui-row-area-content min-w-0",children:["Электронная почта",s.jsx("small",{className:"block text-sm text-muted",children:e})]})]})}t.__docgenInfo={description:"",methods:[],displayName:"RowExample",props:{disabled:{required:!0,tsType:{name:"boolean"},description:""},description:{required:!0,tsType:{name:"string"},description:""}}};const n=`import { useState } from 'react'

interface RowExampleProps {
  disabled: boolean
  description: string
}

export function RowExample({ disabled, description }: RowExampleProps) {
  const [checked, setChecked] = useState(false)

  return (
    <label className="neui-row neui-ripple min-h-choice rounded-choice">
      <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled}
        onChange={event => setChecked(event.target.checked)} />
      <span className="neui-row-area-leading place-self-center neui-check-box peer-checked:[--neui-check-level:1]" aria-hidden="true" />
      <span className="neui-row-area-content min-w-0">
        Электронная почта
        <small className="block text-sm text-muted">{description}</small>
      </span>
    </label>
  )
}
`,p={id:"trinet-row",title:"Примитивы/Row",component:t,tags:["autodocs"],parameters:{docs:{source:{code:n},description:{component:"neui-row задаёт CSS Grid с именованными областями leading, content и trailing. Разместите в них свои элементы классом neui-row-area-*. Нативный label связывает текст и checkbox. Класс neui-ripple подключает отклик к поверхности строки."}}},args:{disabled:!1,description:"На адрес из профиля"}};function i(c,e){const o="<RowExample disabled={"+e.disabled+"} description="+JSON.stringify(e.description)+" />";return{name:c,args:e,parameters:{docs:{source:{code:n.trimEnd()+`

`+o}}}}}const r=i("Строка выбора",p.args),a=i("Недоступная опция",{disabled:!0,description:"Укажите адрес в профиле"}),x=["Checkbox","Disabled"];r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"rowStory('Строка выбора', meta.args)",...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`rowStory('Недоступная опция', {
  disabled: true,
  description: 'Укажите адрес в профиле'
})`,...a.parameters?.docs?.source}}};export{r as Checkbox,a as Disabled,x as __namedExportsOrder,p as default};
