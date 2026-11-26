import { useRef } from 'react'
import type { MouseEvent, PointerEvent } from 'react'

// Touch and trackpads use the native snap scroller. Desktop mice can grab the same strip.
export function useCalendarDrag() {
  const origin = useRef<{ x: number; scroll: number; id: number } | null>(null)
  const suppressClick = useRef(false)
  function release(event: PointerEvent<HTMLDivElement>) {
    if (origin.current?.id !== event.pointerId) return
    const node = event.currentTarget
    origin.current = null
    if (!node.hasAttribute('data-dragging')) return
    const pages = Array.from(node.children, child => (child as HTMLElement).offsetLeft)
    const left = pages.reduce((best, x) => Math.abs(x - node.scrollLeft) < Math.abs(best - node.scrollLeft) ? x : best)
    node.removeAttribute('data-dragging')
    if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId)
    node.scrollTo({ left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return {
    onPointerDown(event: PointerEvent<HTMLDivElement>) {
      suppressClick.current = false
      if (event.pointerType === 'mouse' && event.button === 0)
        origin.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft, id: event.pointerId }
    },
    onPointerMove(event: PointerEvent<HTMLDivElement>) {
      const from = origin.current, node = event.currentTarget
      if (!from || from.id !== event.pointerId) return
      if (!event.buttons) { release(event); return }
      const distance = from.x - event.clientX
      if (!suppressClick.current && Math.abs(distance) < 5) return
      if (!suppressClick.current) {
        suppressClick.current = true
        node.setAttribute('data-dragging', '')
        node.setPointerCapture(event.pointerId)
      }
      node.scrollLeft = from.scroll + distance
    },
    onPointerUp: release, onPointerCancel: release, onLostPointerCapture: release,
    onClickCapture(event: MouseEvent<HTMLDivElement>) {
      if (suppressClick.current && event.detail) { event.stopPropagation(); suppressClick.current = false }
    },
  }
}
