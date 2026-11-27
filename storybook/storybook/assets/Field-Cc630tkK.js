import{j as e}from"./iframe-jnNrxMJ8.js";import{p as r}from"./presence-BcgZgrm1.js";import{R as p}from"./Ridge-BgGbeQ1Z.js";function u({frame:d=p,id:i,label:l,header:n,meta:t,description:a,error:s,children:c}){const o=[a&&i+"-description",s&&i+"-error"].filter(Boolean).join(" ")||void 0;return e.jsx(d,{id:i,label:l,header:n,meta:t,children:e.jsxs("fieldset",{className:"neui-group","aria-labelledby":i+"-label","aria-describedby":o,children:[c,r(a&&e.jsx("div",{className:"neui-collapse-block",children:e.jsx("div",{className:"neui-reveal-clip",children:e.jsx("p",{id:i+"-description",className:"neui-note",children:a})})})),r(s&&e.jsx("div",{className:"neui-collapse-block",children:e.jsx("div",{className:"neui-reveal-clip",children:e.jsx("p",{id:i+"-error",className:"neui-note neui-error",role:"status",children:s})})}))]})})}u.__docgenInfo={description:"",methods:[],displayName:"Field",props:{id:{required:!0,tsType:{name:"string"},description:"Unique HTML id, also used by the label."},label:{required:!0,tsType:{name:"ReactNode"},description:""},header:{required:!1,tsType:{name:"ReactNode"},description:""},meta:{required:!1,tsType:{name:"ReactNode"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},description:{required:!1,tsType:{name:"ReactNode"},description:""},error:{required:!1,tsType:{name:"ReactNode"},description:""},frame:{required:!1,tsType:{name:"Ridge"},description:"",defaultValue:{value:`function Ridge({ id, label, header, meta, children }: RidgeProps) {
  return <div id={id} className="neui-ridge neui-track-focus">
    <span slot="label" id={id + '-label'}>{label}</span>
    {header && <div slot="header">{header}</div>}
    {children}
    {meta && <div slot="meta" className="neui-collapse-block neui-meta-panel">
      <div className="neui-reveal-clip neui-meta-actions">{meta}</div>
    </div>}
  </div>
}`,computed:!1}}}};export{u as F};
