// Every live tap owns two numeric tracks on its host. Slot names are reused across
// elements and gestures. Only the peak number of concurrent waves needs registration.
const registered = new Set<string>()

function registerTrack(name: string) {
  if (registered.has(name)) return
  try {
    CSS.registerProperty({ name, syntax: '<number>', initialValue: '0', inherits: false })
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'InvalidModificationError')) throw error
  }
  registered.add(name)
}

function milliseconds(time: string) {
  return parseFloat(time) * (time.endsWith('ms') ? 1 : 1000)
}

export interface Wave {
  x: number
  y: number
  progress: string
  energy?: string
  stop: () => void
  cancel: () => void
}

export function compose(target: HTMLElement, waves: Iterable<Wave>) {
  const layers: string[] = [], samples: string[] = []
  for (const { x, y, progress, energy } of waves) {
    if (!energy) continue
    samples.push(`${x}% ${y}% var(${progress}) var(${energy})`)
    const radius = `calc(var(${progress}) * 100%)`
    const spread = `(2 - var(${energy}))`
    const ring = (offset: number, tone: string) => {
      const edge = `color-mix(in srgb, ${tone} calc(var(${energy}) * 25%), transparent)`
      const peak = `color-mix(in srgb, ${tone} calc(var(${energy}) * 100%), transparent)`
      return `radial-gradient(circle farthest-corner at ${x}% calc(${y}% + ${offset}px * ${spread}),
        transparent calc(${radius} - 10px * ${spread}), ${edge} calc(${radius} - 6px * ${spread}), ${peak} ${radius},
        ${edge} calc(${radius} + 6px * ${spread}), transparent calc(${radius} + 10px * ${spread}))`
    }
    layers.push(ring(3, 'var(--neui-shade)'), ring(-3, 'var(--neui-highlight)'))
  }
  target.style.setProperty('--neui-live-waves', samples.join(','))
  target.style.setProperty('--neui-live-gradients', layers.reverse().join(','))
}

export function play(target: HTMLElement, wave: Wave, done: () => void) {
  const style = getComputedStyle(target, wave.energy ? '::after' : '::before')
  const easing = style.getPropertyValue?.('--neui-travel-ease')?.trim() || 'ease-out'
  const times = wave.energy ? style.transitionDuration : style.animationDuration
  const [duration, fade = duration * .8] = times.split(',').map(value => milliseconds(value.trim()))
  if (!(duration > 0)) { done(); return }
  const fadeStart = Math.max(0, 1 - Math.min(fade, duration) / duration)
  const { progress, energy } = wave
  if (typeof globalThis.CSS?.registerProperty === 'function' && typeof target.animate === 'function') {
    registerTrack(progress)
    if (energy) registerTrack(energy)
    // Sparse keyframes give radius one continuous ease-out segment. Only the
    // amplitude has a shoulder. Neither a release nor a later tap rewinds it.
    const frames: Keyframe[] = [{ offset: 0, [progress]: 0, easing, ...(energy && { [energy]: 1 }) }]
    if (energy && fadeStart > 0) frames.push({ offset: fadeStart, [energy]: 1, easing: 'ease-in-out' })
    frames.push({ offset: 1, [progress]: 1, ...(energy && { [energy]: 0 }) })
    const animation = target.animate(frames, { duration })
    wave.cancel = () => animation.cancel()
    void animation.finished.then(done, done)
    return
  }
  // Browsers without typed custom properties still paint the CSS gradient pair.
  const clock = target.animate?.([], { duration, easing, fill: 'both' })
  const start = performance.now()
  let frame: number
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    if (t >= 1) { done(); return }
    const tail = Math.min(1, (1 - t) / Math.max(.001, 1 - fadeStart))
    target.style.setProperty(progress, String(clock?.effect?.getComputedTiming().progress ?? 1 - (1 - t) ** 2))
    if (energy) target.style.setProperty(energy, String(tail * tail * (3 - 2 * tail)))
    frame = requestAnimationFrame(step)
  }
  step(start)
  wave.cancel = () => {
    cancelAnimationFrame(frame)
    target.style.removeProperty(progress)
    clock?.cancel()
    if (energy) target.style.removeProperty(energy)
  }
}
