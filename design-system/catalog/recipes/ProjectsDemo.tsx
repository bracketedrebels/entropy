import { useId, useState } from 'react'
import { ChoicePicker } from '../../stories/form/ChoicePicker'
import { projects } from '../../stories/form/options'

export default function ProjectsDemo() {
  const [selected, setSelected] = useState([projects[0][0]])
  return <ChoicePicker id={useId()} name="projects" label="Проекты в сводке" multiple
    options={projects} selected={selected} searchLabel="Поиск проектов"
    emptyLabel="Выбрать проекты" onChange={setSelected} />
}
