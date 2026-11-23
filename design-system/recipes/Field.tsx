import type { ReactNode } from 'react'
import { Ridge } from './Ridge'
import type { RidgeProps } from './Ridge'

export interface FieldProps extends RidgeProps {
  id: string
  description?: ReactNode
  error?: ReactNode
}

export function Field({ id, label, header, meta, description, error, children }: FieldProps) {
  const descriptionIds = [description && id + '-description', error && id + '-error'].filter(Boolean).join(' ') || undefined
  return <Ridge id={id} label={label} header={header} meta={meta}>
    <fieldset className="tn-group" aria-labelledby={id + '-label'} aria-describedby={descriptionIds}>
      {children}
      {description && <p id={id + '-description'} className="tn-note">{description}</p>}
      {error && <p id={id + '-error'} className="tn-note tn-error" role="status">{error}</p>}
    </fieldset>
  </Ridge>
}
