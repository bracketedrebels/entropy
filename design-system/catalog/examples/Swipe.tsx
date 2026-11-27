import { useState } from 'react'

export default function Swipe() {
  const [open, setOpen] = useState(false)
  const [read, setRead] = useState(false)
  return <div className="neui-swipe-right" data-neui-swipe-open={open}>
    <button type="button" className="neui-swipe-content neui-row neui-ripple"
      aria-expanded={open} onClick={() => setOpen(!open)}>
      <i aria-hidden="true" className="neuicon-mail neui-row-area-leading place-self-center" />
      <span className="neui-row-area-content">{read ? 'Прочитано' : 'Новое письмо'}</span>
    </button>
    <button type="button" className="neui-swipe-action" tabIndex={open ? 0 : -1}
      aria-hidden={!open} onClick={() => { setRead(!read); setOpen(false) }}>
      {read ? 'Пометить новым' : 'Прочитать'}
    </button>
  </div>
}
