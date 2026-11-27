import { createCapLight, wrapEmitter } from './capLight'
import { projectFocus } from './trackFocus'

type StickyRanges = { enter: KeyframeAnimationOptions; exit: KeyframeAnimationOptions }
interface Contour {
  height: number
  headHeight: number
  footTop: number
  upper: (end: number) => string
  base: (start: number) => string
}

const shift = (y: number) => 'translateY(' + y + 'px)'

export function ridgeLighting(shell: HTMLElement, head: HTMLElement, foot: HTMLElement, textures: SVGGElement[]) {
  const emitters = textures.map(texture => wrapEmitter(texture.parentNode as SVGElement))
  let origin: Element | null = null
  let lamp: ReturnType<typeof createCapLight> | undefined
  let contour: Contour | undefined
  let ranges: StickyRanges | undefined
  let animations: Animation[] = []
  let up = 0, down = 0
  let lastY: string | undefined
  let pendingFade: object | undefined

  function position() {
    if (!contour) return
    if (origin && lamp) {
      const distance = contour.footTop - up - down
      lamp.moving.style.transform = shift(origin === head ? distance : -distance)
    } else {
      textures[0].style.transform = shift(-up)
      textures[1].style.transform = shift(-contour.headHeight)
      textures[2].style.transform = shift(down - contour.footTop)
    }
  }

  function bind() {
    animations.forEach(animation => animation.cancel())
    animations = []
    if (!contour) return
    const { height, headHeight, footTop, upper, base } = contour
    const travel = Math.max(0, footTop - headHeight)
    const pinned = origin === head || origin === foot
    for (const texture of textures) texture.style.display = pinned ? 'none' : ''
    if (origin) {
      const above = origin === head
      const source = textures[above ? 0 : 2].ownerSVGElement!
      lamp ??= createCapLight(source)
      if (lamp.svg.previousElementSibling !== source) source.after(lamp.svg)
      lamp.band.setAttribute('fill', source.querySelector('.neui-light')!.getAttribute('fill')!)
      // The local arc and the straight rails share the same rect, gradient and mask raster.
      // The opposite contour extends through the rails, clipped where the local arc begins.
      lamp.near.setAttribute('d', above ? upper(headHeight) : base(0))
      lamp.far.setAttribute('d', above ? base(-height) : upper(height))
      lamp.railClip.setAttribute('x', '-2')
      lamp.railClip.setAttribute('width', '110%')
      lamp.railClip.setAttribute('y', String(above ? headHeight - 0.5 : -height))
      lamp.railClip.setAttribute('height', String(height + 0.5))
      position()
      if (ranges) {
        const sign = above ? 1 : -1
        animations = [
          lamp.moving.animate([{ transform: shift(sign * headHeight) }, { transform: shift(sign * footTop) }], ranges.enter),
          lamp.moving.animate([{ translate: '0 0px' }, { translate: '0 ' + (-sign * travel) + 'px' }], ranges.exit),
        ]
      }
    } else {
      lamp?.svg.remove()
      position()
      if (ranges) animations = [
        textures[0].animate([{ transform: shift(0) }, { transform: shift(-travel) }], ranges.exit),
        textures[2].animate([{ transform: shift(travel - footTop) }, { transform: shift(-footTop) }], ranges.enter),
      ]
    }
  }

  const stop = projectFocus(shell, (target, y) => {
    if (!target) {
      if (!lastY || pendingFade) return
      // The tracker releases its public signals immediately. Keep the last paint source
      // and its local coordinates until that source has actually become transparent.
      shell.style.setProperty('--neui-cap-light-y', lastY)
      const token = pendingFade = {}
      const bands = origin && lamp ? [lamp.band] : textures.map(texture => texture.querySelector('.neui-light')!)
      const fades = bands.flatMap(band => band.getAnimations?.() ?? []).filter(animation =>
        'transitionProperty' in animation && animation.transitionProperty === 'opacity')
      const release = () => {
        if (pendingFade !== token) return
        pendingFade = undefined
        lastY = undefined
        shell.style.removeProperty('--neui-cap-light-y')
        if (origin) { origin = null; bind() }
      }
      if (fades.length) void Promise.allSettled(fades.map(fade => fade.finished)).then(release)
      else release()
      return
    }
    pendingFade = undefined
    let panel: Element | null = target
    while (panel && panel !== shell && panel !== head && panel !== foot) panel = panel.assignedSlot ?? panel.parentElement
    const next = panel === head || panel === foot ? panel : null
    lastY = next ? (y - next.getBoundingClientRect().top) + 'px' : shell.style.getPropertyValue('--neui-focus-y')
    if (next) {
      if (shell.style.getPropertyValue('--neui-cap-light-y') !== lastY) shell.style.setProperty('--neui-cap-light-y', lastY)
    } else shell.style.removeProperty('--neui-cap-light-y')
    if (next !== origin) {
      origin = next
      bind()
    }
  })

  return {
    layout(shape: Contour, timing?: StickyRanges) {
      contour = shape
      ranges = timing
      bind()
    },
    scroll(topShift: number, bottomShift: number) {
      up = topShift
      down = bottomShift
      position()
    },
    dispose() {
      pendingFade = undefined
      stop()
      for (const emitter of emitters) emitter.replaceWith(...emitter.childNodes)
      animations.forEach(animation => animation.cancel())
      lamp?.svg.remove()
      shell.style.removeProperty('--neui-cap-light-y')
      for (const texture of textures) {
        texture.style.removeProperty('transform')
        texture.style.removeProperty('display')
      }
    },
  }
}
