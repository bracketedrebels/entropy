import { useRipple } from './useRipple'
import type { ButtonHTMLAttributes, HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'

type Slots = { leading?: ReactNode; trailing?: ReactNode; description?: ReactNode; children: ReactNode }
export type RowProps = Slots & (
  | ({ as?: 'div' } & HTMLAttributes<HTMLDivElement>)
  | ({ as: 'label' } & LabelHTMLAttributes<HTMLLabelElement>)
  | ({ as: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>)
)

/** A single aligned hit area. Choose the element that owns the native action. */
export function Row(props: RowProps) {
  const ripple = useRipple()
  const { as, className = '', leading, trailing, description, children, ...native } = props
  const content = <>
    <span className="tn-row-leading">{leading}</span>
    <span className="tn-row-copy">{children}{description != null && <small>{description}</small>}</span>
    {trailing != null && <span className="tn-row-trailing">{trailing}</span>}
  </>
  if (as === 'button') return <button type="button" {...native as ButtonHTMLAttributes<HTMLButtonElement>} ref={ripple} className={'tn-row tn-ripple ' + className}>{content}</button>
  if (as === 'label') return <label {...native as LabelHTMLAttributes<HTMLLabelElement>} ref={ripple} className={'tn-row tn-ripple ' + className}>{content}</label>
  return <div {...native as HTMLAttributes<HTMLDivElement>} ref={ripple} className={'tn-row tn-ripple ' + className}>{content}</div>
}
