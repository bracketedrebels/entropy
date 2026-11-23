import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react'

const Action = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function Action({ children, className = '', ...props }, ref) {
  return <button ref={ref} type="button" {...props} className={'tn-pill tn-pill-action ' + className}><span>{children}</span></button>
})

function Status({ children, className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={'tn-pill ' + className}><span>{children}</span></span>
}

export const Pill = { Action, Status }
