(self.webpackChunkempty_project=self.webpackChunkempty_project||[]).push([[712],{712:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>H});var r=n(59),o=n(526),a=n(92),c=n(293);function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}const s=function(e){return function(t){return u(u({},t),{},{projectActive:e})}};function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?f(Object(n),!0).forEach((function(t){d(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}const m=function(e){return function(t){return p(p({},t),{},{projects:p(p({},t.projects||{}),{},d({},e.id,e))})}};var y={default:0,named:{}};const b=function(){return function(){return Promise.resolve((e="project")?(e in y.named||(y.named.project=0),"".concat(e).concat(++y.named.project)):"".concat(++y.default));var e}},v=function(e){return function(){return fetch(e,{method:"GET"}).then((function(e){return e.json()}))}},h=function(){return function(){return Promise.resolve([{name:"Fake example project",url:"example.project.json"}])}};var g=n(362),O=n(34);function j(){return(j=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function w(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function E(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?w(Object(n),!0).forEach((function(t){S(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):w(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function S(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function P(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,o=!1,a=void 0;try{for(var c,i=e[Symbol.iterator]();!(r=(c=i.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==i.return||i.return()}finally{if(o)throw a}}return n}}(e,t)||function(e,t){if(e){if("string"==typeof e)return x(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?x(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function x(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}const A=function(e){var t=e.children,n=e.clear,r=void 0===n||n,a=e.className,c=void 0===a?"":a,i=e.style,u=void 0===i?{}:i,l=e.active,s=void 0===l||l,f=e.onTransitionEnd,p=void 0===f?g.Z:f,d=function(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}(e,["children","clear","className","style","active","onTransitionEnd"]),m=P((0,O.Z)(),2),y=m[0],b=m[1].height,v=(0,o.useMemo)((function(){return s?b:0}),[s,b]),h=P((0,o.useState)(!1),2),w=h[0],S=h[1],x=(0,o.useCallback)((function(e){return S(!1),p(e)}),[p]);(0,o.useEffect)((function(){return S(!0)}),[v]);var A=(0,o.useMemo)((function(){return s||w||!r?t:null}),[w,s,t,r]);return o.createElement("div",j({className:"".concat(c," overflow-hidden transition-size duration-300 ease-in-out"),onTransitionEnd:x,style:E(E({},u),{},{blockSize:v})},d),o.createElement("div",{className:"transition-none",ref:y},A))};function N(){return(N=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}const k=function(e){var t=e.status,n=void 0===t?"inprogress":t,r=e.onTransitionEnd,a=void 0===r?g.Z:r,c=e.className,i=void 0===c?"":c,u=function(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}(e,["status","onTransitionEnd","className"]);return o.createElement("div",N({className:"flex flex-col ".concat(i)},u),o.createElement(A,{active:"success"===n,clear:!1,onTransitionEnd:function(e){return"success"===n&&a(e)}},o.createElement("div",{className:"flex flex-no-wrap items-center"},o.createElement("span",{className:"font-secondary text-3xl text-success mr-2"},"•"),o.createElement("span",{className:"font-secondary text-base"},"success"))),o.createElement(A,{active:"failure"===n,clear:!1,onTransitionEnd:function(e){return"failure"===n&&a(e)}},o.createElement("div",{className:"flex flex-no-wrap items-center"},o.createElement("span",{className:"font-secondary text-3xl text-failure mr-2"},"•"),o.createElement("span",{className:"font-secondary text-base"},"failure"))),o.createElement(A,{active:"inprogress"===n,clear:!1,onTransitionEnd:function(e){return"inprogress"===n&&a(e)}},o.createElement("div",{className:"text-white text-opacity-75 font-secondary text-xl flex justify-evenly"},o.createElement("div",{className:"animate-ping"},"."),o.createElement("div",{className:"animate-ping",style:{animationDelay:".2s"}},"."),o.createElement("div",{className:"animate-ping",style:{animationDelay:".4s"}},"."),o.createElement("div",{className:"animate-ping",style:{animationDelay:".6s"}},"."),o.createElement("div",{className:"animate-ping",style:{animationDelay:".8s"}},"."))))};var C=n(558),F=n(637);function D(e){return function(e){if(Array.isArray(e))return I(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||T(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function T(e,t){if(e){if("string"==typeof e)return I(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?I(e,t):void 0}}function I(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}const L=function(e){var t,n,r=e.children,a=e.back,c=void 0===a||a,i=(t=(0,o.useState)([]),n=2,function(e){if(Array.isArray(e))return e}(t)||function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,o=!1,a=void 0;try{for(var c,i=e[Symbol.iterator]();!(r=(c=i.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==i.return||i.return()}finally{if(o)throw a}}return n}}(t,n)||T(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),u=i[0],l=i[1],s=(0,o.useCallback)((function(){return l((function(e){return e.slice(0,-1)}))}),[]);return o.createElement("div",{className:"flex flex-col items-stretch"},o.createElement(A,{active:u.length>0&&c},o.createElement("div",{className:"ui/interactable text-2xl font-secondary px-6",tabIndex:1,onKeyDown:function(e){var t=e.which;(t===C.s.Enter||t===C.s.Space)&&s()},onClick:s},"Back")),o.createElement(U,{steps:u,onPress:l},r))};var M=(0,F.Z)(!0),U=function e(t){var n=t.children,r=t.path,a=void 0===r?[]:r,c=t.steps,i=t.onPress,u=void 0===i?g.Z:i,l=(0,o.useMemo)((function(){return o.Children.toArray(n).filter((function(e){return(0,o.isValidElement)(e)}))}),[n]),s=(0,o.useCallback)((function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:M;return function(){return Promise.resolve(t()?[].concat(D(a),[e]):a).then((function(e){return u(e)}))}}),[a,u]),f=(0,o.useCallback)((function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:M;return function(n){var r=n.which;(r===C.s.Enter||r===C.s.Space)&&Promise.resolve(t()?[].concat(D(a),[e]):a).then((function(e){return u(e)}))}}),[a,u]);return o.createElement(o.Fragment,null,l.map((function(t,n){return(0,o.isValidElement)(t)?o.createElement(o.Fragment,{key:[].concat(D(a),[n]).join(".")},o.createElement(A,{active:c.join(".")===a.join(".")},o.createElement("div",{className:"ui/interactable",tabIndex:1,onKeyDown:f(n,t.props.onAboutToChoose||M),onClick:s(n,t.props.onAboutToChoose||M)},o.createElement("div",{className:"text-2xl font-secondary px-6 pt-2"},t.props.caption),t.props.description?o.createElement("div",{className:"text-sm font-secondary px-6 pb-2"},t.props.description):null)),o.createElement(e,{steps:c,path:[].concat(D(a),[n]),onPress:u},t.props.children)):null})))};const B=function(){return null};function K(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,o=!1,a=void 0;try{for(var c,i=e[Symbol.iterator]();!(r=(c=i.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==i.return||i.return()}finally{if(o)throw a}}return n}}(e,t)||function(e,t){if(e){if("string"==typeof e)return Z(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Z(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Z(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}const H=function(){var e=(0,a.k6)(),t=(0,c.Vg)(b),n=(0,c._Y)(s),i=(0,c.Vg)(v),u=(0,c.Vg)(h),l=(0,c._Y)(m),f=K((0,o.useState)(),2),p=f[0],d=f[1],y=K((0,o.useState)(undefined),2),g=y[0],O=y[1],j=K((0,o.useState)([]),2),w=j[0],E=j[1];(0,o.useEffect)((function(){u().then(E)}),[]);var S=(0,o.useCallback)((function(e){return O("inprogress"),new Promise((function(t,n){e().then((0,r.debounce)((function(e){O("success"),t(e)}),1e3,{leading:!1,trailing:!0})).catch((0,r.debounce)((function(e){O("failure"),n(e)}),1e3,{leading:!1,trailing:!0}))}))}),[]);return(0,o.useEffect)((function(){switch(null==p?void 0:p.code){case V.create:S((function(){return t().then((function(e){return n(e)}))}));break;case V.load:S((function(){return i(p.payload).then((function(e){n(e.id),l(e)}))}))}}),[p]),o.createElement("div",{className:"glass-landed m-auto w-2/5 py-6"},o.createElement(L,{back:!p},o.createElement(B,{caption:"New",description:"Create new project from different configurations."},o.createElement(B,{caption:"From Scratch",description:"Shiny brand new empty project. No dependencies.",onAboutToChoose:function(){return d({code:V.create,payload:W.fromScratch}),!0}})),o.createElement(B,{caption:"Load",description:"Load existing project"},w.map((function(e){var t=e.name,n=e.url;return o.createElement(B,{caption:t,description:n,onAboutToChoose:function(){return d({code:V.load,payload:n}),!0}})})))),o.createElement(A,{active:!!g},o.createElement("div",{className:"flex flex-row px-6 py-2 justify-between items-center text-white text-opacity-75 bg-black bg-opacity-25"},o.createElement(q,{code:null==p?void 0:p.code,payload:null==p?void 0:p.payload}),o.createElement(k,{status:g,onTransitionEnd:function(){return"success"===g&&e.push("/editor")}}))))};var V,W,q=function(e){var t=e.code,n=e.payload;return o.createElement("div",{className:"flex flex-col justify-evenly items-start"},o.createElement("div",{className:"text-2xl font-secondary"},t===V.create?"Creating new project":t===V.load?"Loading project":"Something is happening"),o.createElement("div",{className:"text-sm font-secondary"},t===V.create?n===W.fromScratch?"Using 'From Scratch' template":"":t===V.load?o.createElement(o.Fragment,null,n):""))};!function(e){e[e.create=0]="create",e[e.load=1]="load"}(V||(V={})),function(e){e[e.fromScratch=0]="fromScratch"}(W||(W={}))},293:(e,t,n)=>{"use strict";n.d(t,{_Y:()=>d,y$:()=>y,Vg:()=>m});var r=n(526);const o=(0,r.createContext)(new function(){return new Worker(n.p+"bundle.worker.js")});var a=n(633),c=n.n(a),i=Math.random(),u=Symbol();const l=function(e){var t;return null===(t=Object.getOwnPropertyDescriptor(function(e){return Object.getOwnPropertySymbols(e).includes(u)||Object.defineProperty(e,u,{configurable:!1,enumerable:!1,writable:!1,value:c().h64(e.toString(),i).toString()}),e}(e),u))||void 0===t?void 0:t.value};var s;!function(e){e[e.reduce=0]="reduce",e[e.subscribe=1]="subscribe",e[e.unsubscribe=2]="unsubscribe",e[e.run=3]="run"}(s||(s={}));var f=n(59);function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var d=function(e){var t=(0,r.useContext)(o),n=l(e);return(0,r.useCallback)((function(){for(var e=arguments.length,r=new Array(e),o=0;o<e;o++)r[o]=arguments[o];t.postMessage({id:(0,f.uniqueId)(),type:s.reduce,payload:{fingerprint:n,payload:r}})}),[t])},m=function(e){var t=(0,r.useContext)(o),n=l(e);return(0,r.useCallback)((function(){for(var e=(0,f.uniqueId)(),r=arguments.length,o=new Array(r),a=0;a<r;a++)o[a]=arguments[a];return t.postMessage({id:e,type:s.run,payload:{fingerprint:n,payload:o}}),new Promise((function(n){t.addEventListener("message",(function r(o){var a=o.data;a.type===s.run&&a.id===e&&(n(a.payload),t.removeEventListener("message",r))}))}))}),[])},y=function(e){var t,n,a=(0,r.useContext)(o),c=(t=(0,r.useState)(),n=2,function(e){if(Array.isArray(e))return e}(t)||function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,o=!1,a=void 0;try{for(var c,i=e[Symbol.iterator]();!(r=(c=i.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==i.return||i.return()}finally{if(o)throw a}}return n}}(t,n)||function(e,t){if(e){if("string"==typeof e)return p(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?p(e,t):void 0}}(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),i=c[0],u=c[1],l=(0,r.useMemo)((function(){return e.join(".")}),[e]),d=(0,r.useCallback)((function(e){var t=e.data,n=t.type,r=t.payload,o=r.path,a=r.data;n===s.reduce&&o===l&&u(a)}),[l]);return(0,r.useEffect)((function(){return a.addEventListener("message",d),function(){return a.removeEventListener("message",d)}}),[a,d]),(0,r.useEffect)((function(){return a.postMessage({id:(0,f.uniqueId)(),type:s.subscribe,payload:{path:l}}),function(){return a.postMessage({id:(0,f.uniqueId)(),type:s.unsubscribe,payload:{path:l}})}}),[a,l]),i}},558:(e,t)=>{"use strict";var n;(n=t.s||(t.s={}))[n.Backspace=8]="Backspace",n[n.Tab=9]="Tab",n[n.Enter=13]="Enter",n[n.Shift=16]="Shift",n[n.Ctrl=17]="Ctrl",n[n.Alt=18]="Alt",n[n.PauseBreak=19]="PauseBreak",n[n.CapsLock=20]="CapsLock",n[n.Escape=27]="Escape",n[n.Space=32]="Space",n[n.PageUp=33]="PageUp",n[n.PageDown=34]="PageDown",n[n.End=35]="End",n[n.Home=36]="Home",n[n.LeftArrow=37]="LeftArrow",n[n.UpArrow=38]="UpArrow",n[n.RightArrow=39]="RightArrow",n[n.DownArrow=40]="DownArrow",n[n.Insert=45]="Insert",n[n.Delete=46]="Delete",n[n.Zero=48]="Zero",n[n.ClosedParen=48]="ClosedParen",n[n.One=49]="One",n[n.ExclamationMark=49]="ExclamationMark",n[n.Two=50]="Two",n[n.AtSign=50]="AtSign",n[n.Three=51]="Three",n[n.PoundSign=51]="PoundSign",n[n.Hash=51]="Hash",n[n.Four=52]="Four",n[n.DollarSign=52]="DollarSign",n[n.Five=53]="Five",n[n.PercentSign=53]="PercentSign",n[n.Six=54]="Six",n[n.Caret=54]="Caret",n[n.Hat=54]="Hat",n[n.Seven=55]="Seven",n[n.Ampersand=55]="Ampersand",n[n.Eight=56]="Eight",n[n.Star=56]="Star",n[n.Asterik=56]="Asterik",n[n.Nine=57]="Nine",n[n.OpenParen=57]="OpenParen",n[n.A=65]="A",n[n.B=66]="B",n[n.C=67]="C",n[n.D=68]="D",n[n.E=69]="E",n[n.F=70]="F",n[n.G=71]="G",n[n.H=72]="H",n[n.I=73]="I",n[n.J=74]="J",n[n.K=75]="K",n[n.L=76]="L",n[n.M=77]="M",n[n.N=78]="N",n[n.O=79]="O",n[n.P=80]="P",n[n.Q=81]="Q",n[n.R=82]="R",n[n.S=83]="S",n[n.T=84]="T",n[n.U=85]="U",n[n.V=86]="V",n[n.W=87]="W",n[n.X=88]="X",n[n.Y=89]="Y",n[n.Z=90]="Z",n[n.LeftWindowKey=91]="LeftWindowKey",n[n.RightWindowKey=92]="RightWindowKey",n[n.SelectKey=93]="SelectKey",n[n.Numpad0=96]="Numpad0",n[n.Numpad1=97]="Numpad1",n[n.Numpad2=98]="Numpad2",n[n.Numpad3=99]="Numpad3",n[n.Numpad4=100]="Numpad4",n[n.Numpad5=101]="Numpad5",n[n.Numpad6=102]="Numpad6",n[n.Numpad7=103]="Numpad7",n[n.Numpad8=104]="Numpad8",n[n.Numpad9=105]="Numpad9",n[n.Multiply=106]="Multiply",n[n.Add=107]="Add",n[n.Subtract=109]="Subtract",n[n.DecimalPoint=110]="DecimalPoint",n[n.Divide=111]="Divide",n[n.F1=112]="F1",n[n.F2=113]="F2",n[n.F3=114]="F3",n[n.F4=115]="F4",n[n.F5=116]="F5",n[n.F6=117]="F6",n[n.F7=118]="F7",n[n.F8=119]="F8",n[n.F9=120]="F9",n[n.F10=121]="F10",n[n.F11=122]="F11",n[n.F12=123]="F12",n[n.NumLock=144]="NumLock",n[n.ScrollLock=145]="ScrollLock",n[n.SemiColon=186]="SemiColon",n[n.Equals=187]="Equals",n[n.Comma=188]="Comma",n[n.Dash=189]="Dash",n[n.Period=190]="Period",n[n.UnderScore=189]="UnderScore",n[n.PlusSign=187]="PlusSign",n[n.ForwardSlash=191]="ForwardSlash",n[n.Tilde=192]="Tilde",n[n.GraveAccent=192]="GraveAccent",n[n.OpenBracket=219]="OpenBracket",n[n.ClosedBracket=221]="ClosedBracket",n[n.Quote=222]="Quote"}}]);