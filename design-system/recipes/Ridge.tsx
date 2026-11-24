import type { ReactNode } from 'react'
import { useRidge } from '@neui/kit/react'

export interface RidgeProps {
  /** Unique HTML id, also used by the label and SVG masks. */
  id: string
  label: ReactNode
  header?: ReactNode
  meta?: ReactNode
  children: ReactNode
}

// Decorative SVG belongs to this recipe. The hook measures and updates the marked parts.
function Groove({ id, part }: { id: string; part: string }) {
  const mask = id + '-' + part + '-mask'
  const gradient = id + '-' + part + '-light'
  return <svg className={'neui-groove neui-' + part} aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="var(--neui-halo)" stopOpacity="0" />
        <stop offset=".3" stopColor="var(--neui-halo)" stopOpacity=".65" />
        <stop offset=".5" stopColor="var(--neui-core)" />
        <stop offset=".7" stopColor="var(--neui-halo)" stopOpacity=".65" />
        <stop offset="1" stopColor="var(--neui-halo)" stopOpacity="0" />
      </linearGradient>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="110%">
        <path fill="none" stroke="white" strokeWidth="2" />
      </mask>
    </defs>
    <path className="neui-cut" transform="translate(-.35 -.55)" />
    <path className="neui-lip" transform="translate(.35 .65)" />
    <path className="neui-floor" />
    <g mask={'url(#' + mask + ')'}><g className="neui-texture">
      <rect width="100%" className="neui-light" fill={'url(#' + gradient + ')'} />
    </g></g>
  </svg>
}

export function Ridge({ id, label, header, meta, children }: RidgeProps) {
  const shell = useRidge()
  return <div id={id} className="neui-ridge" ref={shell}>
    <div className="neui-top-track"><div className="neui-head">
      <Groove id={id} part="upper" />
      <span id={id + '-label'} className="neui-caption">{label}<i aria-hidden="true" className="neui-baseline" /></span>
      <div className="neui-header-slot">{header}</div>
    </div></div>
    <div className="neui-aperture"><div className="neui-top-clip"><div className="neui-bottom-clip"><div className="neui-ink">
      <div className="neui-body">{children}</div><div className="neui-rails"><Groove id={id} part="walls" /></div>
    </div></div></div></div>
    <div className="neui-bottom-track"><div className="neui-foot"><Groove id={id} part="base" />
      <div className="neui-meta">{meta}</div>
    </div></div>
  </div>
}
