import { projectFocus } from './trackFocus'

type StickyRanges = { enter: KeyframeAnimationOptions; exit: KeyframeAnimationOptions }

/** Project one light into each groove mask, keeping its own sticky panel in local coordinates. */
export function ridgeLighting(shell: HTMLElement, head: HTMLElement, foot: HTMLElement, textures: SVGGElement[]) {
  let origin: Element | null = null
  let headHeight = 0
  let footTop = 0
  let travel = 0
  let ranges: StickyRanges | undefined
  let animations: Animation[] = []
  let topShift = 0
  let bottomShift = 0

  function offsets(up: number, down: number) {
    const panelTops = [up, headHeight, footTop - down]
    const anchorTop = origin === head ? up : origin === foot ? footTop - down : 0
    return panelTops.map(top => anchorTop - top)
  }

  const shift = (y: number) => 'translateY(' + y + 'px)'
  function place(positions: number[]) {
    textures.forEach((texture, i) => {
      const transform = shift(positions[i])
      if (texture.style.transform !== transform) texture.style.transform = transform
    })
  }

  function bind() {
    animations.forEach(animation => animation.cancel())
    animations = []
    if (!ranges) {
      place(offsets(topShift, bottomShift))
      return
    }
    const rest = offsets(0, 0), entering = offsets(0, travel), exiting = offsets(travel, 0)
    place(rest)
    const { enter, exit } = ranges
    textures.forEach((texture, i) => {
      // The two sticky ranges can overlap. Independent translation properties add their offsets.
      if (entering[i] !== rest[i]) animations.push(texture.animate([
        { transform: shift(entering[i]) }, { transform: shift(rest[i]) },
      ], enter))
      if (exiting[i] !== rest[i]) animations.push(texture.animate([
        { translate: '0 0px' }, { translate: '0 ' + (exiting[i] - rest[i]) + 'px' },
      ], exit))
    })
  }

  const stop = projectFocus(shell, (target, y) => {
    // Follow slot projection as well as authored frames. display:contents has no measurable box.
    let panel = target
    while (panel && panel !== shell && panel !== head && panel !== foot) {
      panel = panel.assignedSlot ?? panel.parentElement
    }
    const next = panel === head || panel === foot ? panel : null
    if (next) {
      const localY = (y - next.getBoundingClientRect().top) + 'px'
      if (shell.style.getPropertyValue('--neui-cap-light-y') !== localY) shell.style.setProperty('--neui-cap-light-y', localY)
    } else if (origin) {
      shell.style.removeProperty('--neui-cap-light-y')
    }
    if (next !== origin) {
      origin = next
      bind()
    }
  })

  return {
    layout(height: number, join: number, distance: number, timing?: StickyRanges) {
      headHeight = height
      footTop = join
      travel = distance
      ranges = timing
      bind()
    },
    scroll(up: number, down: number) {
      topShift = up
      bottomShift = down
      place(offsets(up, down))
    },
    dispose() {
      stop()
      animations.forEach(animation => animation.cancel())
      shell.style.removeProperty('--neui-cap-light-y')
      textures.forEach(texture => texture.style.removeProperty('transform'))
    },
  }
}
