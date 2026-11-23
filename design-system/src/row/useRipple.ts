import { useEffect, useRef } from 'react'

export function useRipple(elementType: string) {
  const waveHost = useRef<HTMLSpanElement>(null)
  const stop = useRef<() => void>()

  useEffect(() => {
    const row = waveHost.current?.parentElement
    if (!row) return
    function startWave(x: number, y: number, pointerId?: number) {
      const host = waveHost.current
      if (!host || !host.animate) return
      stop.current?.()
      const rect = host.getBoundingClientRect()
      const radius = Math.max(1, Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)))
      const wave = document.createElement('span')
      wave.className = 'tn-wave'
      Object.assign(wave.style, { left: x - radius + 'px', top: y - radius + 'px', width: radius * 2 + 'px', height: radius * 2 + 'px' })
      host.appendChild(wave)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const grow = wave.animate([{ transform: 'scale(' + Math.min(1, 16 / radius) + ')' }, { transform: 'scale(1)' }],
        { duration: reduced ? 0 : 240, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' })
      const events = new AbortController()
      let fade: Animation | undefined
      function clear() {
        events.abort()
        grow.cancel()
        fade?.cancel()
        wave.remove()
        if (stop.current === clear) stop.current = undefined
      }
      async function release() {
        events.abort()
        try {
          await grow.finished
          if (!wave.isConnected) return
          fade = wave.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduced ? 0 : 170 })
          await fade.finished
        } catch { /* A newer press or unmount cancelled the animation. */ }
        finally { clear() }
      }
      stop.current = clear
      if (pointerId === undefined) { void release(); return }
      const opts = { signal: events.signal, capture: true }
      window.addEventListener('pointerup', e => { if (e.pointerId === pointerId) void release() }, opts)
      window.addEventListener('pointercancel', e => { if (e.pointerId === pointerId) clear() }, opts)
      window.addEventListener('blur', clear, opts)
    }

    const isDisabled = () => row.matches(':disabled,[aria-disabled=true]') ||
      (row instanceof HTMLLabelElement && row.control?.matches(':disabled'))
    function press(e: PointerEvent) {
      if (!row || e.defaultPrevented || !e.isPrimary || e.button !== 0 || isDisabled()) return
      const bounds = row.getBoundingClientRect()
      startWave(e.clientX - bounds.left, e.clientY - bounds.top, e.pointerId)
    }
    function activate(e: MouseEvent) {
      if (!row || e.defaultPrevented || e.detail !== 0 || stop.current || isDisabled()) return
      const bounds = row.getBoundingClientRect()
      const leading = row.querySelector('.tn-row-leading:not(:empty)')?.getBoundingClientRect()
      startWave(leading ? leading.left - bounds.left + leading.width / 2 : bounds.width / 2, bounds.height / 2)
    }
    row.addEventListener('pointerdown', press)
    row.addEventListener('click', activate)
    return () => {
      row.removeEventListener('pointerdown', press)
      row.removeEventListener('click', activate)
      stop.current?.()
    }
  }, [elementType])
  return waveHost
}
