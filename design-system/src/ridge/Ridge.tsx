import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { attachRidge } from './geometry'

export interface RidgeProps {
  /** Unique HTML id, also used by the label and SVG masks. */
  id: string
  label: ReactNode
  header?: ReactNode
  meta?: ReactNode
  children: ReactNode
}

function Groove({ id, part }: { id: string; part: string }) {
  const mask = id + '-' + part + '-mask'
  const gradient = id + '-' + part + '-light'
  return <svg className={'tn-groove tn-' + part} aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="var(--tn-halo)" stopOpacity="0" />
        <stop offset=".3" stopColor="var(--tn-halo)" stopOpacity=".65" />
        <stop offset=".5" stopColor="var(--tn-core)" />
        <stop offset=".7" stopColor="var(--tn-halo)" stopOpacity=".65" />
        <stop offset="1" stopColor="var(--tn-halo)" stopOpacity="0" />
      </linearGradient>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="110%">
        <path fill="none" stroke="white" strokeWidth="2" />
      </mask>
    </defs>
    <path className="tn-cut" transform="translate(-.35 -.55)" />
    <path className="tn-lip" transform="translate(.35 .65)" />
    <path className="tn-floor" />
    <g mask={'url(#' + mask + ')'}><g className="tn-texture">
      <rect width="100%" className="tn-light" fill={'url(#' + gradient + ')'} />
    </g></g>
  </svg>
}

export function Ridge({ id, label, header, meta, children }: RidgeProps) {
  const shell = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => shell.current ? attachRidge(shell.current) : undefined, [id])
  return <div id={id} className="tn-ridge" ref={shell}>
    <div className="tn-top-track"><div className="tn-head">
      <Groove id={id} part="upper" />
      <span id={id + '-label'} className="tn-caption">{label}<i aria-hidden="true" className="tn-baseline" /></span>
      <div className="tn-header-slot">{header}</div>
    </div></div>
    <div className="tn-aperture"><div className="tn-top-clip"><div className="tn-bottom-clip"><div className="tn-ink">
      <div className="tn-body">{children}</div><div className="tn-rails"><Groove id={id} part="walls" /></div>
    </div></div></div></div>
    <div className="tn-bottom-track"><div className="tn-foot"><Groove id={id} part="base" />
      <div className="tn-meta">{meta}</div>
    </div></div>
  </div>
}
