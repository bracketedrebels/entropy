import{r as d,j as i}from"./iframe-jnNrxMJ8.js";import{R as t}from"./Ridge-BgGbeQ1Z.js";import"./preload-helper-PPVm8Dsz.js";import"./presence-BcgZgrm1.js";function a(){const e=d.useId();return i.jsx(t,{id:e,label:"Имя отправителя",children:i.jsxs("fieldset",{className:"neui-group","aria-labelledby":e+"-label","aria-describedby":e+"-description",children:[i.jsx("div",{className:"neui-row",children:i.jsx("input",{readOnly:!0,value:"Trinet","aria-labelledby":e+"-label","aria-describedby":e+"-description",className:"neui-row-area-content w-full border-0 bg-transparent [font:inherit] text-muted"})}),i.jsx("p",{id:e+"-description",className:"neui-note",children:"Имя задано профилем отправителя."})]})})}a.__docgenInfo={description:"",methods:[],displayName:"FieldExample"};const s=`import { useId } from 'react'
import { Ridge } from '../../recipes/Ridge'

export function FieldExample() {
  const id = useId()
  return (
    <Ridge id={id} label="Имя отправителя">
      <fieldset className="neui-group" aria-labelledby={id + '-label'} aria-describedby={id + '-description'}>
        <div className="neui-row">
          <input readOnly value="Trinet" aria-labelledby={id + '-label'} aria-describedby={id + '-description'}
            className="neui-row-area-content w-full border-0 bg-transparent [font:inherit] text-muted" />
        </div>
        <p id={id + '-description'} className="neui-note">Имя задано профилем отправителя.</p>
      </fieldset>
    </Ridge>
  )
}
`,u={id:"trinet-field",title:"Примитивы/Field",component:a,tags:["autodocs"],parameters:{docs:{source:{code:s},description:{component:"Нативный fieldset, aria-labelledby и aria-describedby связывают группу, контрол и пояснение с видимой подписью жёлоба. Его полная разметка опубликована в примере Ridge."}}}},r={name:"Поле с пояснением"},p=["Profile"];r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Поле с пояснением'
}`,...r.parameters?.docs?.source}}};export{r as Profile,p as __namedExportsOrder,u as default};
