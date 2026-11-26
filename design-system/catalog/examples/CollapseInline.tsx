import { useState } from 'react'

export default function CollapseInline() {
  const [open, setOpen] = useState(false)
  return <div className="flex items-center">
    <button className="neui-pill" aria-expanded={open}
      onClick={() => setOpen(!open)}>Метки</button>
    {open && <span className="neui-collapse-inline">
      <span className="neui-reveal-clip whitespace-nowrap pl-2">Чертёж · Готово</span>
    </span>}
  </div>
}
