import { useRipple } from '../../src'
import { Field } from '../../recipes/Field'
import type { Option } from './options'

export function Mark({ selected, round = false }: { selected: boolean; round?: boolean }) {
  return <span aria-hidden="true" className="tn-mark row-area-leading place-self-center" data-selected={selected} data-round={round || undefined} />
}

type Props = {
  option: Option
  id: string
  name: string
  multiple?: boolean
  selected: boolean
  onChoose: () => void
  disclosure?: { controls: string; expand: () => void }
}

export function OptionRow({ option: [key, label, description, disabled], id, name, multiple, selected, onChoose, disclosure }: Props) {
  const ripple = useRipple()
  return <label ref={ripple} htmlFor={id} className="tn-row tn-ripple tn-choice">
    {disclosure
      ? <button id={id} type="button" className="tn-option" aria-expanded={false}
          aria-controls={disclosure.controls} onClick={disclosure.expand} />
      : <input id={id} name={multiple ? undefined : name} className="tn-option" type={multiple ? 'checkbox' : 'radio'}
          value={key} disabled={disabled} checked={selected} onChange={onChoose} />}
    <Mark selected={selected} round={!multiple} />
    <span className="tn-row-copy">{label}{description && <small>{description}</small>}</span>
  </label>
}

export function RadioField({ id, name, label, options, value, onChange }: {
  id: string; name: string; label: string; options: readonly Option[]; value: string; onChange: (value: string) => void
}) {
  return <Field id={id} label={label}>
    {options.map(option => <OptionRow key={option[0]} option={option} id={id + '-' + option[0]}
      name={name} selected={value === option[0]} onChoose={() => onChange(option[0])} />)}
  </Field>
}
