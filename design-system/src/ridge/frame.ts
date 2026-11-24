import css from './frame.css?inline'
import { layoutRidge, layoutAuthoredRidge } from './geometry'

// All interpolated strings are fixed part names. Authored nodes stay in the light DOM.
function groove(part: string) {
  return `<svg class="neui-groove neui-${part}" part="${part}" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="${part}-light" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="var(--neui-halo)" stop-opacity="0"/>
        <stop offset=".3" stop-color="var(--neui-halo)" stop-opacity=".65"/>
        <stop offset=".5" stop-color="var(--neui-core)"/>
        <stop offset=".7" stop-color="var(--neui-halo)" stop-opacity=".65"/>
        <stop offset="1" stop-color="var(--neui-halo)" stop-opacity="0"/>
      </linearGradient>
      <mask id="${part}-mask" maskUnits="userSpaceOnUse" x="-4" y="-4" width="110%">
        <path fill="none" stroke="white" stroke-width="2"/>
      </mask>
    </defs>
    <path part="cut" class="neui-cut" transform="translate(-.35 -.55)"/>
    <path part="lip" class="neui-lip" transform="translate(.35 .65)"/>
    <path part="floor" class="neui-floor"/>
    <g mask="url(#${part}-mask)"><g class="neui-texture"><rect part="light" class="neui-light" width="100%"
      fill="var(--neui-ridge-light-fill,url(#${part}-light))"/></g></g>
  </svg>`
}

const frame = `<i class="neui-metrics" aria-hidden="true"></i><i class="neui-pins" aria-hidden="true"></i><div class="neui-top-track"><div class="neui-head" part="head">
  ${groove('upper')}
  <span class="neui-caption" part="caption"><slot name="label"></slot><i class="neui-baseline" aria-hidden="true"></i></span>
  <div class="neui-header-slot" part="header"><slot name="header"></slot></div>
</div></div>
<div class="neui-aperture"><div class="neui-top-clip"><div class="neui-bottom-clip"><div class="neui-ink">
  <div class="neui-body" part="body"><slot></slot></div><div class="neui-rails">${groove('walls')}</div>
</div></div></div></div>
<div class="neui-bottom-track"><div class="neui-foot" part="foot">
  ${groove('base')}<div class="neui-meta" part="meta"><slot name="meta"></slot></div>
</div></div>`
const owned = Symbol.for('neui.ridge.frame')
type FrameRoot = ShadowRoot & { [owned]?: true }
let template: HTMLTemplateElement | undefined

export function mountRidge(host: HTMLElement) {
  // Existing applications may supply the complete frame and attachRidge themselves.
  if (host.querySelector(':scope > .neui-top-track')) return layoutAuthoredRidge(host)
  let root = host.shadowRoot as FrameRoot | null
  if (root && !root[owned]) return
  if (!root) {
    // HTML limits the elements that may host a shadow tree. A div can frame native fieldsets and controls.
    try { root = host.attachShadow({ mode: 'open' }) } catch { return }
    root[owned] = true
  }
  if (!template) {
    template = host.ownerDocument.createElement('template')
    template.innerHTML = frame
    const style = host.ownerDocument.createElement('style')
    style.textContent = css + '\n*,*::before,*::after { box-sizing:border-box }'
    template.content.prepend(style)
  }
  root.replaceChildren(template.content.cloneNode(true))
  const stop = layoutRidge(host, root)
  return () => {
    stop()
    // Named content must remain visible when the behavior is toggled off.
    root.innerHTML = '<slot name="label"></slot><slot name="header"></slot><slot></slot><slot name="meta"></slot>'
    for (const name of ['start', 'foot-pad', 'head', 'foot']) host.style.removeProperty('--neui-' + name)
  }
}
