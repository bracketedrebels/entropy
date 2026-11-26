import { useState } from 'react'

export default function CollapseBlock() {
  const [open, setOpen] = useState(false)
  return <div>
    <button className="neui-pill" aria-expanded={open}
      onClick={() => setOpen(!open)}>Параметры</button>
    {open && <div className="neui-collapse-block">
      <div className="neui-reveal-clip">
        <label className="neui-row"><input type="checkbox" />
          <span className="neui-row-area-content">Сохранять черновик</span>
        </label>
      </div>
    </div>}
  </div>
}
