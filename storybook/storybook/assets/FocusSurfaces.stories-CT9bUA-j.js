import{r as i,j as a}from"./iframe-jnNrxMJ8.js";import{T as p}from"./TextField-CMq0TbPL.js";import"./preload-helper-PPVm8Dsz.js";import"./mini-PomufWgy.js";import"./Field-Cc630tkK.js";import"./presence-BcgZgrm1.js";import"./Ridge-BgGbeQ1Z.js";const o=[{id:"tone",label:"Тон",hint:"За волной остаётся ровный, чуть более светлый тон."},{id:"light",label:"Свет",hint:"Волна открывает тёплый свет, падающий сверху."},{id:"line",label:"Строка",hint:"Мягкая полоса следует за строкой, в которой вы печатаете."},{id:"ring",label:"Контур",hint:"Исходный вариант для сравнения. Волна проявляет линию по краю."}],f=["Готовим обновление поиска. В выдаче уже видны названия проектов и последние изменения.","До четверга проверим длинные запросы и пустую выдачу на телефоне.","В пятницу соберём отзывы и отправим команде короткую сводку."].join(`

`);function u(){const n=i.useId(),[t,l]=i.useState(o[0]),[c,d]=i.useState(f);function m(e){if(t.id!=="line"||!(e.target instanceof HTMLTextAreaElement))return;const r=e.target.closest(".neui-track-focus");r&&e.currentTarget.style.setProperty("--lab-last-focus-y",r.style.getPropertyValue("--neui-focus-y"))}return a.jsxs("section",{className:"neui-example focus-surfaces","data-material":t.id,onBlurCapture:m,children:[a.jsxs("fieldset",{className:"neui-group",children:[a.jsx("legend",{children:"Фокус при вводе"}),a.jsx("div",{className:"focus-surfaces-options",children:o.map(e=>a.jsxs("label",{className:"neui-ripple",children:[a.jsx("input",{type:"radio",className:"neui-option",name:n,value:e.id,checked:t.id===e.id,onChange:()=>l(e)}),a.jsx("span",{className:"neui-check-radio","aria-hidden":"true"}),e.label]},e.id))})]}),a.jsx("p",{className:"focus-surfaces-hint",children:t.hint}),a.jsx(p,{id:n+"-editor",name:"summary",label:"Текст сводки",icon:"pencil",value:c,onChange:d})]})}u.__docgenInfo={description:"",methods:[],displayName:"FocusSurfaces"};const h=`import { useId, useState } from 'react'
import type { FocusEvent } from 'react'
import { TextField } from '../form/TextField'
import './focus-surfaces.css'

const variants = [
  { id: 'tone', label: 'Тон', hint: 'За волной остаётся ровный, чуть более светлый тон.' },
  { id: 'light', label: 'Свет', hint: 'Волна открывает тёплый свет, падающий сверху.' },
  { id: 'line', label: 'Строка', hint: 'Мягкая полоса следует за строкой, в которой вы печатаете.' },
  { id: 'ring', label: 'Контур', hint: 'Исходный вариант для сравнения. Волна проявляет линию по краю.' },
] as const

const sample = [
  'Готовим обновление поиска. В выдаче уже видны названия проектов и последние изменения.',
  'До четверга проверим длинные запросы и пустую выдачу на телефоне.',
  'В пятницу соберём отзывы и отправим команде короткую сводку.',
].join('\\n\\n')

export function FocusSurfaces() {
  const id = useId()
  const [variant, setVariant] = useState<(typeof variants)[number]>(variants[0])
  const [value, setValue] = useState(sample)

  function keepCaretOnBlur(event: FocusEvent<HTMLElement>) {
    if (variant.id !== 'line' || !(event.target instanceof HTMLTextAreaElement)) return
    // The Ridge releases its caret measurement on blur. The fading band keeps that last position.
    const ridge = event.target.closest<HTMLElement>('.neui-track-focus')
    if (ridge) event.currentTarget.style.setProperty('--lab-last-focus-y', ridge.style.getPropertyValue('--neui-focus-y'))
  }

  return <section className="neui-example focus-surfaces" data-material={variant.id} onBlurCapture={keepCaretOnBlur}>
    <fieldset className="neui-group">
      <legend>Фокус при вводе</legend>
      <div className="focus-surfaces-options">
        {variants.map(item => <label className="neui-ripple" key={item.id}>
          <input type="radio" className="neui-option" name={id} value={item.id}
            checked={variant.id === item.id} onChange={() => setVariant(item)} />
          <span className="neui-check-radio" aria-hidden="true" />
          {item.label}
        </label>)}
      </div>
    </fieldset>
    <p className="focus-surfaces-hint">{variant.hint}</p>
    <TextField id={id + '-editor'} name="summary" label="Текст сводки" icon="pencil"
      value={value} onChange={setValue} />
  </section>
}
`,j={id:"neui-focus-surfaces",title:"Эксперименты/Фокус при вводе",component:u,parameters:{docs:{source:{code:h}}}},s={name:"Сравнение на текстарее"},k=["Comparison"];s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Сравнение на текстарее'
}`,...s.parameters?.docs?.source}}};export{s as Comparison,k as __namedExportsOrder,j as default};
