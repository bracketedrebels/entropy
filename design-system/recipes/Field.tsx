import type { ReactNode } from 'react'
import { Ridge } from './Ridge'
import type { RidgeProps } from './Ridge'

export interface FieldProps extends RidgeProps {
  id: string
  description?: ReactNode
  error?: ReactNode
}

export function Field({ frame: Frame = Ridge, id, label, header, meta, description, error, children }: FieldProps & { frame?: typeof Ridge }) {
  const descriptionIds = [description && id + '-description', error && id + '-error'].filter(Boolean).join(' ') || undefined
  return <Frame id={id} label={label} header={header} meta={meta}>
    <fieldset className="neui-group" aria-labelledby={id + '-label'} aria-describedby={descriptionIds}>
      {children}
      {description && <div className="neui-collapse-block"><div className="neui-reveal-clip">
        <p id={id + '-description'} className="neui-note">{description}</p>
      </div></div>}
      {error && <div className="neui-collapse-block"><div className="neui-reveal-clip">
        <p id={id + '-error'} className="neui-note neui-error" role="status">{error}</p>
      </div></div>}
    </fieldset>
  </Frame>
}
