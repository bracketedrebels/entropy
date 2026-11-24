import { Field as FieldRecipe, type FieldProps } from './Field'
import { Ridge } from './LegacyRidge'

export function Field(props: FieldProps) {
  return <FieldRecipe {...props} frame={Ridge} />
}
