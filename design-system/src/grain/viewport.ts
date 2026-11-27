/** Keep one texel per screen pixel and anchor the repeat to the visible viewport. */
export function trackGrainViewport(win: Window) {
  const { style } = win.document.documentElement
  const viewport = win.visualViewport
  let resolution: MediaQueryList | undefined
  let density = 0
  let scale = 0
  let origin = ''

  function sync() {
    const dpr = win.devicePixelRatio || 1
    if (dpr !== density) {
      resolution?.removeEventListener('change', sync)
      resolution = win.matchMedia(`(resolution: ${dpr}dppx)`)
      resolution.addEventListener('change', sync)
      density = dpr
    }
    const nextScale = dpr * (viewport?.scale || 1)
    if (scale !== nextScale) {
      scale = nextScale
      style.setProperty('--_neui-grain-scale', String(scale))
    }
    const snap = (offset = 0) => Math.round(offset * scale) / scale
    const nextOrigin = `${snap(viewport?.offsetLeft)}px ${snap(viewport?.offsetTop)}px`
    if (origin !== nextOrigin) {
      origin = nextOrigin
      style.setProperty('--_neui-grain-origin', origin)
    }
  }

  sync()
  viewport?.addEventListener('resize', sync)
  viewport?.addEventListener('scroll', sync)
  return () => {
    resolution?.removeEventListener('change', sync)
    viewport?.removeEventListener('resize', sync)
    viewport?.removeEventListener('scroll', sync)
    style.removeProperty('--_neui-grain-scale')
    style.removeProperty('--_neui-grain-origin')
  }
}
