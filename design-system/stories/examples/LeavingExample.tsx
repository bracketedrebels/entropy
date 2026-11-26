import { useState } from 'react'
const initial = ['Электронная почта', 'Мессенджер', 'Уведомления телефона']

export function LeavingExample() {
  const [rows, setRows] = useState(initial)
  return <section>
    <button className="neui-pill" type="button" onClick={() => setRows(initial)}>Восстановить каналы</button>
    <ul className="m-0 list-none p-0">{rows.map(name =>
      <li key={name} className="neui-collapse-block duration-300">
        <div className="neui-reveal-clip"><button type="button" aria-label={'Убрать ' + name}
          className="neui-row neui-ripple" onClick={() => setRows(current => current.filter(row => row !== name))}>
          <span className="neui-row-area-leading" aria-hidden="true">−</span>
          <span className="neui-row-area-content">{name}</span>
        </button></div>
      </li>)}</ul>
  </section>
}
