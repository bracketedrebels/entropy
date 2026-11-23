import { focusCentre } from './focus'

type TimelineOptions = { subject: HTMLElement; axis: 'block'; inset: string }
type TimelineConstructor = new (options: TimelineOptions) => AnimationTimeline

/** Native sticky caps. The matching clips counter-translate the ink, preserving a single scroll. */
export function attachRidge(shell: HTMLElement) {
  // Select this instance's frame only, including when the consumer nests another Ridge.
  const find = (part: string) => Array.from(shell.getElementsByClassName('tn-' + part))
    .find(el => el.closest('.tn-ridge') === shell) as HTMLElement
  const caption = find('caption'), baseline = find('baseline'), header = find('header-slot'), meta = find('meta')
  const head = find('head'), foot = find('foot'), body = find('body')
  const topClip = find('top-clip'), bottomClip = find('bottom-clip'), ink = find('ink')
  const panes = ['upper', 'walls', 'base'].map(part => find(part))
  const textures = panes.map(pane => pane.querySelector<SVGGElement>('.tn-texture')!)
  const lights = panes.map(pane => pane.querySelector('rect')!)
  const shift = (y: number) => 'translateY(' + y + 'px)'
  const translate = (y: number) => '0 ' + y + 'px'
  const Timeline = (window as Window & { ViewTimeline?: TimelineConstructor }).ViewTimeline
  const timeline = Timeline && CSS.supports('animation-range:exit-crossing 1px')
    ? new Timeline({ subject: shell, axis: 'block', inset: getComputedStyle(head).top + ' ' + getComputedStyle(foot).bottom })
    : undefined
  let animations: Animation[] = []
  let join = 0
  let disposed = false
  function paintLight() {
    const centre = focusCentre(shell)
    for (const light of lights) light.toggleAttribute('data-lit', centre !== null)
    if (centre === null) return
    const height = parseFloat(getComputedStyle(shell).getPropertyValue('--tn-band'))
    const y = centre - shell.getBoundingClientRect().top - height / 2
    for (const light of lights) {
      light.setAttribute('y', String(y))
      light.setAttribute('height', String(height))
    }
  }
  function fallback() {
    const box = shell.getBoundingClientRect()
    const up = head.getBoundingClientRect().top - box.top
    const down = box.bottom - foot.getBoundingClientRect().bottom
    topClip.style.transform = shift(up)
    bottomClip.style.translate = translate(-up)
    bottomClip.style.transform = shift(-down)
    ink.style.transform = shift(down)
    textures[0].style.transform = shift(-up)
    textures[2].style.transform = shift(down - join)
  }
  function layout() {
    if (disposed) return
    const width = shell.clientWidth, inset = parseFloat(getComputedStyle(body).paddingLeft)
    if (!width) return
    const left = 1.5, right = width - left, gap = inset - left
    const label = caption.getBoundingClientRect(), base = baseline.getBoundingClientRect()
    const top = base.top - label.top
    const start = Math.max(top + gap, label.height + 2)
    const band = header.offsetHeight, metadata = meta.offsetHeight
    shell.style.setProperty('--tn-start', (start + band) + 'px')
    shell.style.setProperty('--tn-foot-pad', Math.max(inset, metadata) + 'px')
    const height = shell.getBoundingClientRect().height, bottom = height - left
    const maxR = Math.max(0, Math.min((right-left)/2, (bottom-top)/2))
    const radius = Math.min(parseFloat(getComputedStyle(shell).getPropertyValue('--tn-row-radius')) + gap, maxR)
    const pill = meta.querySelector('.tn-pill > span')
    const br = pill ? Math.min(pill.getBoundingClientRect().height / 2 + gap, maxR) : radius
    const depth = Math.max(radius, br, metadata - left)
    const headH = top + radius + band
    join = bottom - depth
    const travel = Math.max(0, join - headH)
    shell.style.setProperty('--tn-head', headH + 'px')
    shell.style.setProperty('--tn-foot', (height - join) + 'px')
    const x = Math.min(right - radius, base.left - shell.getBoundingClientRect().left + 8)
    const paths = [
      `M ${x} ${top} H ${right-radius} a ${radius} ${radius} 0 0 1 ${radius} ${radius} V ${headH+4} M ${left} ${headH+4} V ${start+1.65}`,
      `M ${left} -4 V ${travel+4} M ${right} -4 V ${travel+4}`,
      `M ${right} -4 V ${depth-br} a ${br} ${br} 0 0 1 ${-br} ${br} H ${left+radius} a ${radius} ${radius} 0 0 1 ${-radius} ${-radius} V -4`,
    ]
    const heights = [headH, travel, height-join]
    panes.forEach((pane, index) => {
      pane.querySelectorAll('path').forEach(path => path.setAttribute('d', paths[index]))
      pane.querySelector('mask')!.setAttribute('height', String(heights[index]+8))
    })
    const inner = Math.max(0, radius-gap), upper = band ? 0 : inner
    topClip.style.clipPath = `path("M 0 ${headH} H ${inset} V ${start+band} H ${width-inset-upper} a ${upper} ${upper} 0 0 1 ${upper} ${upper} V ${headH} H ${width} V ${height} H 0 Z")`
    bottomClip.style.clipPath = metadata
      ? `inset(0 0 ${metadata}px 0)` : `path("M 0 0 H ${width} V ${join} H ${width-inset} a ${inner} ${inner} 0 0 1 ${-inner} ${inner} H ${inset+inner} a ${inner} ${inner} 0 0 1 ${-inner} ${-inner} H 0 Z")`
    textures[0].style.transform = shift(0)
    textures[1].style.transform = shift(-headH)
    textures[2].style.transform = shift(-join)
    animations.forEach(a => a.cancel())
    animations = []
    if (timeline && travel > 0) {
      const enter = { timeline, fill: 'both' as const, rangeStart: `entry-crossing calc(100% - ${travel}px)`, rangeEnd: 'entry-crossing 100%' }
      const exit = { timeline, fill: 'both' as const, rangeStart: 'exit-crossing 0px', rangeEnd: `exit-crossing ${travel}px` }
      animations = [
        topClip.animate([{ transform: shift(0) }, { transform: shift(travel) }], exit),
        bottomClip.animate([{ translate: translate(0) }, { translate: translate(-travel) }], exit),
        bottomClip.animate([{ transform: shift(-travel) }, { transform: shift(0) }], enter),
        ink.animate([{ transform: shift(travel) }, { transform: shift(0) }], enter),
        textures[0].animate([{ transform: shift(0) }, { transform: shift(-travel) }], exit),
        textures[2].animate([{ transform: shift(travel-join) }, { transform: shift(-join) }], enter),
      ]
    } else if (!timeline) fallback()
    paintLight()
  }
  const events = new AbortController()
  const listener = { signal: events.signal }
  const resize = new ResizeObserver(layout)
  for (const element of [shell, caption, header, meta]) resize.observe(element)
  if (!timeline) window.addEventListener('scroll', fallback, { ...listener, capture: true, passive: true })
  const afterBlur = () => queueMicrotask(() => { if (!disposed) paintLight() })
  shell.addEventListener('focusout', afterBlur, listener)
  for (const type of ['focusin', 'input', 'keyup', 'pointerup', 'selectionchange']) shell.addEventListener(type, paintLight, listener)
  document.addEventListener('selectionchange', paintLight, listener)
  const theme = new MutationObserver(paintLight)
  for (let el: HTMLElement | null = shell; el; el = el.parentElement) theme.observe(el, { attributes: true, attributeFilter: ['data-theme'] })
  void document.fonts.ready.then(layout)
  layout()
  return () => {
    disposed = true
    resize.disconnect()
    events.abort()
    theme.disconnect()
    animations.forEach(a => a.cancel())
  }
}
