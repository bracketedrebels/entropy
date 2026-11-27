import { useEffect, useRef } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { Icon, IslandRidge } from './components'

export const sections = [
  ['css', 'CSS API', 'code'],
  ['vite', 'Vite API', 'bolt'],
  ['react', 'React API', 'orbit'],
  ['recipes', 'Рецепты', 'book'],
  ['philosophy', 'Философия', 'aperture'],
] as const

type SectionId = (typeof sections)[number][0]
type Stroke = { id: number; x: number; y: number; axis?: 'x' | 'y' }

export function SectionDock({ active }: { active: SectionId }) {
  const stroke = useRef<Stroke | null>(null)
  const suppressClick = useRef(false)
  const selected = sections.findIndex(([key]) => key === active)
  const nav = useRef<HTMLElement>(null)
  const wheel = useRef({ last: -Infinity, distance: 0, committed: false })
  useEffect(() => {
    const node = nav.current
    if (!node) return
    function onWheel(e: WheelEvent) {
      if (e.ctrlKey || Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.2) return
      e.preventDefault()
      const w = wheel.current
      if (e.timeStamp - w.last > 180) { w.distance = 0; w.committed = false }
      w.last = e.timeStamp
      if (w.committed) return
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? node!.clientWidth : 1
      w.distance -= e.deltaX * unit
      if (Math.abs(w.distance) < 36) return
      w.committed = true
      const next = sections[selected + Math.sign(w.distance)]
      if (next) window.location.hash = next[0]
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [selected])

  function start(e: PointerEvent<HTMLElement>) {
    if (!e.isPrimary || e.button !== 0) {
      stroke.current = null
      return
    }
    suppressClick.current = false
    stroke.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
  }

  function track(e: PointerEvent<HTMLElement>) {
    const s = stroke.current
    if (!s || s.id !== e.pointerId) return
    const dx = Math.abs(e.clientX - s.x), dy = Math.abs(e.clientY - s.y)
    if (!s.axis && Math.max(dx, dy) >= 9) {
      s.axis = dx > dy * 1.2 ? 'x' : 'y'
      suppressClick.current = true
      if (s.axis === 'x') e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  function finish(e: PointerEvent<HTMLElement>) {
    const s = stroke.current
    if (!s || s.id !== e.pointerId) return
    stroke.current = null
    const dx = e.clientX - s.x, dy = e.clientY - s.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) >= 9) suppressClick.current = true
    if (s.axis === 'y' || Math.abs(dx) < 36 || Math.abs(dx) <= Math.abs(dy) * 1.2) return
    const next = sections[selected + Math.sign(dx)]
    if (next) window.location.hash = next[0]
  }

  function byKey(e: KeyboardEvent<HTMLElement>) {
    const position = sections.findIndex(([key]) => (e.target as HTMLElement).closest('a')?.hash === '#' + key)
    if (position < 0) return
    const destinations: Record<string, number> = {
      ArrowLeft: position - 1, ArrowRight: position + 1, Home: 0, End: sections.length - 1,
    }
    const index = destinations[e.key]
    if (index === undefined || e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    const next = sections[index]
    if (next) {
      const link = e.currentTarget.querySelector<HTMLAnchorElement>(`a[href="#${next[0]}"]`)
      link?.focus({ preventScroll: true })
      window.location.hash = next[0]
    }
  }

  return <nav ref={nav} className="section-dock" aria-label="Разделы каталога"
    style={{ '--section-index': selected, '--section-count': sections.length } as CSSProperties}
    onPointerDown={start} onPointerMove={track} onPointerUp={finish}
    onPointerCancel={() => { stroke.current = null }}
    onLostPointerCapture={e => { if (e.target === e.currentTarget) stroke.current = null }}
    onPointerLeave={e => { if (!e.currentTarget.hasPointerCapture(e.pointerId) && e.pointerType === 'mouse') stroke.current = null }}
    onClickCapture={e => {
      if (e.detail && suppressClick.current) { e.preventDefault(); e.stopPropagation() }
      suppressClick.current = false
    }}
    onKeyDown={byKey} onDragStart={e => e.preventDefault()}>
    <IslandRidge />
    <span aria-hidden="true" className="dock-selection"><i className="neui-check-radio" /></span>
    {sections.map(([key, label, glyph]) =>
      <a className="dock-link neui-ripple" key={key} href={'#' + key}
        draggable={false} aria-current={key === active ? 'page' : undefined} aria-label={label} title={label}>
        <Icon name={glyph} /><span className="dock-label">{label}</span>
      </a>)}
  </nav>
}
