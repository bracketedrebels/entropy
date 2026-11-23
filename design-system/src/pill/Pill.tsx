import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react'

const Action = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function Action({ children, className = '', ...props }, ref) {
  return <button ref={ref} type="button" {...props} className={'neui-pill neui-pill-action ' + className}>{children}</button>
})

function Status({ children, className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={'neui-pill ' + className}>{children}</span>
}

export const Pill = { Action, Status }
