import{r as i,j as e}from"./iframe-jnNrxMJ8.js";import"./preload-helper-PPVm8Dsz.js";function u({track:o=!0}){const n=i.useId();return e.jsxs("section",{className:o?"neui-ridge neui-track-focus":"neui-ridge","aria-labelledby":n,children:[e.jsx("span",{slot:"label",id:n,children:"Этапы обработки"}),Array.from({length:24},(d,c)=>e.jsxs("label",{className:"neui-row",children:[e.jsx("input",{className:"neui-row-area-leading neui-check-radio m-0 place-self-center appearance-none checked:[--neui-check-level:1]",type:"radio",name:n,defaultChecked:c===0}),e.jsxs("span",{className:"neui-row-area-content",children:["Этап ",c+1]})]},c))]})}function t(){return e.jsxs("div",{className:"neui-track-focus relative",children:[e.jsx("span",{"aria-hidden":"true",className:"pointer-events-none absolute left-0 h-2 w-1 -translate-y-1/2 rounded-full bg-accent",style:{top:"var(--neui-focus-y)",opacity:"var(--neui-focus-active)"}}),e.jsxs("label",{className:"neui-focus-anchor flex items-center gap-4 py-3 pl-4",children:["Имя",e.jsx("input",{className:"min-w-0"})]}),e.jsxs("label",{className:"neui-focus-anchor flex items-center gap-4 py-3 pl-4",children:["Город",e.jsx("input",{className:"min-w-0"})]})]})}u.__docgenInfo={description:"",methods:[],displayName:"RidgeExample",props:{track:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}}}};t.__docgenInfo={description:"",methods:[],displayName:"FocusExample"};const l=`import { useId } from 'react'

export function RidgeExample({ track = true }: { track?: boolean }) {
  const id = useId()
  return <section className={track ? 'neui-ridge neui-track-focus' : 'neui-ridge'} aria-labelledby={id}>
    <span slot="label" id={id}>Этапы обработки</span>
    {Array.from({ length: 24 }, (_, index) => (
      <label className="neui-row" key={index}>
        <input className="neui-row-area-leading neui-check-radio m-0 place-self-center appearance-none checked:[--neui-check-level:1]" type="radio" name={id} defaultChecked={index === 0} />
        <span className="neui-row-area-content">Этап {index + 1}</span>
      </label>
    ))}
  </section>
}

export function FocusExample() {
  return <div className="neui-track-focus relative">
    <span aria-hidden="true" className="pointer-events-none absolute left-0 h-2 w-1 -translate-y-1/2 rounded-full bg-accent"
      style={{ top: 'var(--neui-focus-y)', opacity: 'var(--neui-focus-active)' }} />
    <label className="neui-focus-anchor flex items-center gap-4 py-3 pl-4">Имя<input className="min-w-0" /></label>
    <label className="neui-focus-anchor flex items-center gap-4 py-3 pl-4">Город<input className="min-w-0" /></label>
  </div>
}
`,f={id:"trinet-ridge",title:"Примитивы/Ridge",component:u,tags:["autodocs"],parameters:{docs:{source:{code:l},description:{component:"Класс neui-ridge рисует жёлоб с липкими краями. Класс neui-track-focus добавляет подсветку активной строки. Переключите track в Controls и пройдите по опциям с клавиатуры. Подпись, контролы и их доступные имена принадлежат приложению."}}}},a={name:"Длинное поле",args:{track:!0}},s={name:"Жёлоб без подсветки",args:{track:!1}},r={name:"Трекер без жёлоба",render:()=>e.jsx(t,{})},x=["Tall","WithoutTracker","FocusOnly"];a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: 'Длинное поле',
  args: {
    track: true
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Жёлоб без подсветки',
  args: {
    track: false
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Трекер без жёлоба',
  render: () => <FocusExample />
}`,...r.parameters?.docs?.source}}};export{r as FocusOnly,a as Tall,s as WithoutTracker,x as __namedExportsOrder,f as default};
