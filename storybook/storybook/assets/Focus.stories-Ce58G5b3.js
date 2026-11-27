import{j as e}from"./iframe-jnNrxMJ8.js";import"./preload-helper-PPVm8Dsz.js";function u({duration:n="duration-800",easing:t="ease-out"}){return e.jsxs("div",{className:"neui-example grid gap-4",children:[e.jsxs("label",{className:`neui-row neui-entry neui-ripple neui-focus ${n} ${t}`,children:[e.jsx("span",{"aria-hidden":"true",className:"neuicon-pencil neui-row-area-leading place-self-center"}),e.jsx("input",{className:"neui-field-input neui-row-area-content","aria-label":"Волна и тон фокуса",placeholder:"Волна и тон фокуса"})]}),e.jsx("button",{type:"button",className:`neui-row neui-focus ${n} ${t}`,children:e.jsx("span",{className:"neui-row-area-content",children:"Только фокус"})}),e.jsx("button",{type:"button",className:`neui-row neui-ripple ${n} ${t}`,children:e.jsx("span",{className:"neui-row-area-content",children:"Только волна"})})]})}u.__docgenInfo={description:"",methods:[],displayName:"FocusExample",props:{easing:{required:!1,tsType:{name:"union",raw:"'ease-out' | 'ease-linear' | 'ease-in-out'",elements:[{name:"literal",value:"'ease-out'"},{name:"literal",value:"'ease-linear'"},{name:"literal",value:"'ease-in-out'"}]},description:"",defaultValue:{value:"'ease-out'",computed:!1}},duration:{required:!1,tsType:{name:"union",raw:"'duration-500' | 'duration-800' | 'duration-1500'",elements:[{name:"literal",value:"'duration-500'"},{name:"literal",value:"'duration-800'"},{name:"literal",value:"'duration-1500'"}]},description:"",defaultValue:{value:"'duration-800'",computed:!1}}}};const o=`export function FocusExample({ duration = 'duration-800', easing = 'ease-out' }: {
  easing?: 'ease-out' | 'ease-linear' | 'ease-in-out'
  duration?: 'duration-500' | 'duration-800' | 'duration-1500'
}) {
  return <div className="neui-example grid gap-4">
    <label className={\`neui-row neui-entry neui-ripple neui-focus \${duration} \${easing}\`}>
      <span aria-hidden="true" className="neuicon-pencil neui-row-area-leading place-self-center" />
      <input className="neui-field-input neui-row-area-content" aria-label="Волна и тон фокуса" placeholder="Волна и тон фокуса" />
    </label>
    <button type="button" className={\`neui-row neui-focus \${duration} \${easing}\`}>
      <span className="neui-row-area-content">Только фокус</span>
    </button>
    <button type="button" className={\`neui-row neui-ripple \${duration} \${easing}\`}>
      <span className="neui-row-area-content">Только волна</span>
    </button>
  </div>
}
`,r={id:"neui-focus",title:"Примитивы/Focus",component:u,args:{duration:"duration-800",easing:"ease-out"},argTypes:{duration:{control:"select",options:["duration-500","duration-800","duration-1500"]},easing:{control:"select",options:["ease-out","ease-linear","ease-in-out"]}},tags:["autodocs"],parameters:{docs:{source:{code:o},description:{component:"Нажмите ближе к краю поля. За гребнем поверхность меняет тон и сохраняет его, пока поле в фокусе. Перейдите клавишей Tab, чтобы сразу увидеть тон всего поля."}}}},a={name:"Тон при фокусе"},l=["Tone"];a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: 'Тон при фокусе'
}`,...a.parameters?.docs?.source}}};export{a as Tone,l as __namedExportsOrder,r as default};
