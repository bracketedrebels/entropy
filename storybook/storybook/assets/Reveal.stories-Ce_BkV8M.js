import{r as l,j as e}from"./iframe-jnNrxMJ8.js";import{p as C}from"./presence-BcgZgrm1.js";import{r as D}from"./index-CqjbCPJZ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CErFR1tq.js";function A(){const a=l.useId(),t=l.useRef(null),[s,n]=l.useState(!1),[i,p]=l.useState("");return e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",ref:t,className:"neui-pill","aria-expanded":s,"aria-controls":a,onClick:()=>n(u=>!u),children:s?"Скрыть адрес":"Указать другой адрес"}),C(s&&e.jsx("div",{id:a,className:"lab-disclosure",children:e.jsx("div",{className:"neui-reveal-clip",children:e.jsxs("label",{className:"block pt-4",children:["Адрес для сводки",e.jsx("input",{type:"email",value:i,onChange:u=>p(u.target.value),placeholder:"Адрес из профиля",className:"block w-full border-0 bg-transparent [font:inherit] text-ink placeholder:text-muted",onKeyDown:u=>{u.key==="Escape"&&(t.current?.focus({preventScroll:!0}),n(!1))}})]})})})),e.jsx("p",{className:"mt-[18px] mb-0 text-muted",children:"Сводка приходит раз в день."})]})}A.__docgenInfo={description:"",methods:[],displayName:"RevealExample"};const _=["Электронная почта","Мессенджер","Уведомления телефона"];function V(){const[a,t]=l.useState(_);return e.jsxs("section",{children:[e.jsx("button",{className:"neui-pill",type:"button",onClick:()=>t(_),children:"Восстановить каналы"}),e.jsx("ul",{className:"m-0 list-none p-0",children:C(a.map(s=>e.jsx("li",{className:"neui-collapse-block duration-300",children:e.jsx("div",{className:"neui-reveal-clip",children:e.jsxs("button",{type:"button","aria-label":"Убрать "+s,className:"neui-row neui-ripple",onClick:()=>t(n=>n.filter(i=>i!==s)),children:[e.jsx("span",{className:"neui-row-area-leading","aria-hidden":"true",children:"−"}),e.jsx("span",{className:"neui-row-area-content",children:s})]})})},s)))})]})}V.__docgenInfo={description:"",methods:[],displayName:"LeavingExample"};const O=`import { useState } from 'react'
const initial = ['Электронная почта', 'Мессенджер', 'Уведомления телефона']

export function LeavingExample() {
  const [rows, setRows] = useState(initial)
  return <section>
    <button className="neui-pill" type="button" onClick={() => setRows(initial)}>Восстановить каналы</button>
    <ul className="m-0 list-none p-0">{rows.map(name =>
      <li key={name} className="neui-collapse-block duration-300">
        <div className="neui-reveal-clip"><button type="button" aria-label={'Убрать ' + name}
          className="neui-row neui-ripple" onClick={() => setRows(current => current.filter(row => row !== name))}>
          <span className="neui-row-area-leading" aria-hidden="true">−</span>
          <span className="neui-row-area-content">{name}</span>
        </button></div>
      </li>)}</ul>
  </section>
}
`,M=Array.from({length:64},(a,t)=>t),q=Array.from({length:8},(a,t)=>M.slice(t*8,t*8+8)),m=()=>new Promise(a=>requestAnimationFrame(a)),K=new Set(["lab-disclosure"]);function H({mode:a,id:t,open:s,checks:n}){const i=e.jsx("div",{className:"neui-reveal-clip",children:e.jsx("div",{className:"h-6 text-center",children:t+1})});if(a==="Runtime"){const p="lab-disclosure";n.current++;const u=p.split(/\s+/).some(v=>K.has(v)),g=s&&e.jsx("div",{className:p,children:i});return u?C(g):g}return C(s&&e.jsx("div",{className:"lab-disclosure",children:i}))}function T({mode:a,expanded:t,checks:s}){return e.jsx("div",{className:"grid grid-cols-8",children:q.map(n=>e.jsx("div",{children:n.map(i=>e.jsx(H,{mode:a,id:i,open:t||i%2===0,checks:s},i))},n[0]))})}function B(){const[a,t]=l.useState({mode:"Vite",expanded:!0}),[s,n]=l.useState(""),[i,p]=l.useState(0),[u,g]=l.useState([]),v=l.useRef(0),h=l.useRef(null),b=l.useRef();l.useEffect(()=>()=>b.current?.abort(),[]);async function I(){if(b.current)return;const o=new AbortController;b.current=o;const N=()=>{document.hidden&&o.abort()};document.addEventListener("visibilitychange",N);const f={Vite:[],Runtime:[]};g([]),p(0);try{if(matchMedia("(prefers-reduced-motion: reduce)").matches){n("Для сравнения анимаций включите движение в настройках устройства.");return}if(n("Измеряю частоту кадров в покое"),await document.fonts.ready,await m(),await Promise.allSettled(h.current.getAnimations({subtree:!0}).map(r=>r.finished)),o.signal.aborted)throw Error();let S=await m();const j=[];for(let r=0;r<10;r++){const c=await m();if(o.signal.aborted)throw Error();j.push(c-S),S=c}p(1e3*j.length/j.reduce((r,c)=>r+c,0));for(const[r,c]of[["Vite","Runtime"],["Vite","Runtime"],["Runtime","Vite"],["Vite","Runtime"],["Runtime","Vite"]].entries())for(const d of c){n((r?"Серия "+r+" из 4":"Прогрев")+" · "+d),D.flushSync(()=>t({mode:d,expanded:!0}));const w=await m();for(;await m()-w<320;)if(o.signal.aborted)throw Error();v.current=0;const F=[];for(const x of[!1,!0,!1]){let y=await m();const P=y;for(D.flushSync(()=>t({mode:d,expanded:x}));y-P<320;){const L=await m();if(o.signal.aborted)throw Error();F.push(L-y),y=L}}await Promise.allSettled(h.current.getAnimations({subtree:!0}).map(x=>x.finished));for(let x=0;h.current.querySelector("[data-leaving]")&&x<5;x++)if(await m(),o.signal.aborted)throw Error();if(h.current.querySelector("[data-leaving]"))throw Error();r&&f[d].push({deltas:F,checks:v.current,mounted:h.current.querySelectorAll(".h-6").length})}g(["Vite","Runtime"].map(r=>{const c=f[r].flatMap(d=>d.deltas).sort((d,w)=>d-w);return[r,1e3*c.length/c.reduce((d,w)=>d+w,0),c[Math.ceil(.95*c.length)-1],f[r][0].mounted,f[r][0].checks]})),n("Готово")}catch{h.current&&n("Замер прерван. Повторите в активной вкладке.")}finally{document.removeEventListener("visibilitychange",N),b.current=void 0}}return e.jsxs("section",{children:[e.jsx("button",{className:"neui-pill",type:"button",onClick:I,disabled:!!b.current,children:"Замерить FPS"}),e.jsx("p",{className:"neui-note",children:"64 строки, 32 скрываются за 240 мс. Один прогрев и четыре серии на вариант."}),e.jsx("p",{role:"status",children:s}),i>0&&e.jsxs("p",{children:["В покое: ",i.toFixed(1)," FPS.",i<20&&" Низкая частота среды ограничивает сравнение."]}),!!u.length&&e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsx("tr",{children:["Вариант","FPS","Кадр p95, мс","Строк в DOM","Проверок за серию"].map(o=>e.jsx("th",{children:o},o))})}),e.jsx("tbody",{children:u.map(([o,N,f,S,j])=>e.jsxs("tr",{children:[e.jsx("td",{children:o}),e.jsx("td",{children:N.toFixed(1)}),e.jsx("td",{children:f.toFixed(1)}),e.jsx("td",{children:S}),e.jsx("td",{children:j})]},o))})]}),e.jsx("div",{ref:h,"aria-hidden":"true",children:e.jsx(T,{...a,checks:v})})]})}B.__docgenInfo={description:"",methods:[],displayName:"LeavingBenchmark"};const z=`import { useId, useRef, useState } from 'react'

export function RevealExample() {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')

  return (
    <>
      <button type="button" ref={trigger} className="neui-pill" aria-expanded={open} aria-controls={id}
        onClick={() => setOpen(value => !value)}>
        {open ? 'Скрыть адрес' : 'Указать другой адрес'}
      </button>
      {open && <div id={id} className="lab-disclosure">
        <div className="neui-reveal-clip">
          <label className="block pt-4">Адрес для сводки
            <input type="email" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Адрес из профиля"
              className="block w-full border-0 bg-transparent [font:inherit] text-ink placeholder:text-muted"
              onKeyDown={event => {
                if (event.key === 'Escape') {
                  trigger.current?.focus({ preventScroll: true })
                  setOpen(false)
                }
              }} />
          </label>
        </div>
      </div>}
      <p className="mt-[18px] mb-0 text-muted">Сводка приходит раз в день.</p>
    </>
  )
}
`,Y={id:"trinet-reveal",title:"Примитивы/Reveal",component:A,tags:["autodocs"],parameters:{docs:{source:{code:z},description:{component:"neui-collapse-block и neui-collapse-inline задают раскрытие в потоке. После ухода узел размонтируется. Откройте поле снова, чтобы увидеть черновик из состояния формы."}}}},E={name:"Условный адрес"},k={name:"Уход элемента",render:()=>e.jsx(V,{}),parameters:{docs:{source:{code:O}}}},R={name:"Замер кадров",render:()=>e.jsx(B,{}),tags:["!autodocs"]},Z=["Conditional","Leaving","FrameComparison"];E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: 'Условный адрес'
}`,...E.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: 'Уход элемента',
  render: () => <LeavingExample />,
  parameters: {
    docs: {
      source: {
        code: leavingSource
      }
    }
  }
}`,...k.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  name: 'Замер кадров',
  render: () => <LeavingBenchmark />,
  tags: ['!autodocs']
}`,...R.parameters?.docs?.source}}};export{E as Conditional,R as FrameComparison,k as Leaving,Z as __namedExportsOrder,Y as default};
