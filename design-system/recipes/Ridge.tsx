import type { ReactNode } from 'react'

export interface RidgeProps {
  /** Unique HTML id, also used by the label. */
  id: string
  label: ReactNode
  header?: ReactNode
  meta?: ReactNode
  children: ReactNode
}

/** This recipe owns the semantic content. The same classes and slots work in plain HTML. */
export function Ridge({ id, label, header, meta, children }: RidgeProps) {
  return <div id={id} className="neui-ridge neui-track-focus">
    <span slot="label" id={id + '-label'}>{label}</span>
    {header && <div slot="header">{header}</div>}
    {children}
    {meta && <div slot="meta" className="neui-meta-group">{meta}</div>}
  </div>
}
