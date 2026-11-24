import { Field } from '../../recipes/Field'
import type { Option } from './options'

export function Mark({ selected, round = false }: { selected: boolean; round?: boolean }) {
  const shape = round ? 'neui-check-radio' : 'neui-check-box'
  return <span aria-hidden="true" className={`neui-row-area-leading place-self-center ${shape} ${selected ? '[--neui-check-level:1]' : ''}`} />
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
  return <label htmlFor={id} className="neui-row neui-ripple neui-choice">
    {disclosure
      ? <button id={id} type="button" className="neui-option" aria-expanded={false}
          aria-controls={disclosure.controls} onClick={disclosure.expand} />
      : <input id={id} name={multiple ? undefined : name} className="neui-option" type={multiple ? 'checkbox' : 'radio'}
          value={key} disabled={disabled} checked={selected} onChange={onChoose} />}
    <Mark selected={selected} round={!multiple} />
    <span className="neui-row-copy">{label}{description && <small>{description}</small>}</span>
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
