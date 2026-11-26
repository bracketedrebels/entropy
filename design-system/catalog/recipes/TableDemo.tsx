import { useState } from 'react'

const projects = [
  { id:'core', name:'Ядро', channels:3 },
  { id:'design', name:'Дизайн-система', channels:2 },
  { id:'search', name:'Поиск', channels:1 },
]

export default function TableDemo() {
  const [selected, setSelected] = useState(['design'])
  return <section className="neui-ridge neui-track-focus">
    <span slot="label">Проекты в сводке</span>
    <table className="w-full text-left">
      <caption className="sr-only">Каналы и выбранные проекты</caption>
      <thead className="text-sm text-muted"><tr><th scope="col">Проект</th><th scope="col">Каналы</th></tr></thead>
      <tbody>{projects.map(p => <tr key={p.id}>
        <th scope="row"><label className="neui-row neui-ripple cursor-pointer">
          <input type="checkbox" className="neui-row-area-leading neui-check-box appearance-none checked:[--neui-check-level:1]"
            checked={selected.includes(p.id)} onChange={e => setSelected(e.target.checked
              ? [...selected, p.id] : selected.filter(id => id !== p.id))} />
          <span className="neui-row-area-content">{p.name}</span>
        </label></th>
        <td>{p.channels}</td>
      </tr>)}</tbody>
    </table>
    <output slot="meta" className="neui-pill">Выбрано {selected.length} из {projects.length}</output>
  </section>
}
