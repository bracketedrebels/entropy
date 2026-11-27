/** Keep one texel per screen pixel while the texture scrolls natively with the page. */
export function trackGrainViewport(win: Window) {
  const { style } = win.document.documentElement
  const viewport = win.visualViewport
  let resolution: MediaQueryList | undefined
  let density = 0
  let scale = 0

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
  }

  sync()
  viewport?.addEventListener('resize', sync)
  return () => {
    resolution?.removeEventListener('change', sync)
    viewport?.removeEventListener('resize', sync)
    style.removeProperty('--_neui-grain-scale')
  }
}
