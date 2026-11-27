import { ridgeLighting } from './lighting'
import { retain } from './retain'

type TimelineOptions = { subject: HTMLElement; axis: 'block'; inset: string }
type TimelineConstructor = new (options: TimelineOptions) => AnimationTimeline

/** Native sticky caps. The matching clips counter-translate the ink, preserving a single scroll. */
export function layoutRidge(shell: HTMLElement, frame: HTMLElement | ShadowRoot = shell) {
  // Select this instance's frame only, including when the consumer nests another Ridge.
  function find(part: string) {
    const node = Array.from(frame.querySelectorAll('.neui-' + part)).find(el => frame !== shell || el.closest('.neui-ridge') === shell)
    if (!node) throw new Error('Ridge requires a .neui-' + part + ' in its frame.')
    return node as HTMLElement
  }
  const caption = find('caption'), baseline = find('baseline'), header = find('header-slot'), meta = find('meta')
  const head = find('head'), foot = find('foot'), body = find('body')
  const topClip = find('top-clip'), bottomClip = find('bottom-clip'), ink = find('ink')
  const panes = ['upper', 'walls', 'base'].map(part => find(part))
  const textures = panes.map(pane => pane.querySelector<SVGGElement>('.neui-texture')!)
  const light = ridgeLighting(shell, head, foot, textures)
  const shift = (y: number) => 'translateY(' + y + 'px)'
  const translate = (y: number) => '0 ' + y + 'px'
  const Timeline = (window as Window & { ViewTimeline?: TimelineConstructor }).ViewTimeline
  const nativeTimeline = Timeline && CSS.supports('animation-range:exit-crossing 1px')
  let timeline: AnimationTimeline | undefined
  let timelineInset: string | undefined
  let animations: Animation[] = []
  let disposed = false
  function fallback() {
    const box = shell.getBoundingClientRect()
    const up = head.getBoundingClientRect().top - box.top
    const down = box.bottom - foot.getBoundingClientRect().bottom
    topClip.style.transform = shift(up)
    bottomClip.style.translate = translate(-up)
    bottomClip.style.transform = shift(-down)
    ink.style.transform = shift(down)
    light.scroll(up, down)
  }
  function layout() {
    if (disposed) return
    const width = shell.clientWidth, inset = parseFloat(getComputedStyle(body).paddingLeft)
    if (!width) return
    if (nativeTimeline) {
      const inset = getComputedStyle(head).top + ' ' + getComputedStyle(foot).bottom
      if (timelineInset !== inset) {
        timeline = new Timeline({ subject: shell, axis: 'block', inset })
        timelineInset = inset
      }
    }
    const left = 1.5, right = width - left, gap = inset - left
    const label = caption.getBoundingClientRect(), base = baseline.getBoundingClientRect()
    const hasLabel = frame === shell || Boolean(shell.querySelector(':scope > [slot="label"]'))
    const top = hasLabel ? base.top - label.top : left
    const start = hasLabel ? Math.max(top + gap, label.height + 2) : inset
    const band = header.offsetHeight, metadata = meta.offsetHeight
    shell.style.setProperty('--neui-start', (start + band) + 'px')
    shell.style.setProperty('--neui-foot-pad', Math.max(inset, metadata) + 'px')
    const height = shell.getBoundingClientRect().height, bottom = height - left
    const maxR = Math.max(0, Math.min((right-left)/2, (bottom-top)/2))
    const radius = Math.min(parseFloat(getComputedStyle(shell).getPropertyValue('--neui-row-radius')) + gap, maxR)
    const pill = frame === shell ? meta.querySelector('.neui-pill') : shell.querySelector(':scope > [slot="meta"].neui-pill, :scope > [slot="meta"] .neui-pill')
    const pillHeight = pill?.getBoundingClientRect().height ?? 0
    const faceHeight = pill ? pillHeight - 2 * parseFloat(getComputedStyle(pill).getPropertyValue('--neui-pill-inset')) : 0
    // Reveal the smaller corner with the visible height of the footer.
    const fraction = pillHeight ? Math.min(1, metadata / pillHeight) : 0
    const pillRadius = Math.min(faceHeight / 2 + gap, maxR)
    const br = faceHeight > 0 ? radius + (pillRadius - radius) * fraction : radius
    const depth = Math.max(radius, br, metadata - left)
    const headH = top + radius + band
    const join = bottom - depth
    const travel = Math.max(0, join - headH)
    shell.style.setProperty('--neui-head', headH + 'px')
    shell.style.setProperty('--neui-foot', (height - join) + 'px')
    const x = hasLabel ? Math.min(right - radius, base.left - shell.getBoundingClientRect().left + 8) : left + radius
    const leftCap = hasLabel ? `V ${start+1.65}` : `V ${top+radius} a ${radius} ${radius} 0 0 1 ${radius} ${-radius}`
    const upperOutline = (end: number) =>
      `M ${x} ${top} H ${right-radius} a ${radius} ${radius} 0 0 1 ${radius} ${radius} V ${end} M ${left} ${end} ${leftCap}`
    const baseOutline = (start: number) =>
      `M ${right} ${start} V ${depth-br} a ${br} ${br} 0 0 1 ${-br} ${br} H ${left+radius} a ${radius} ${radius} 0 0 1 ${-radius} ${-radius} V ${start}`
    const contour = { height, headHeight: headH, footTop: join, upper: upperOutline, base: baseOutline }
    const paths = [upperOutline(headH+4), `M ${left} -4 V ${travel+4} M ${right} -4 V ${travel+4}`, baseOutline(-4)]
    const heights = [headH, travel, height-join]
    panes.forEach((pane, index) => {
      pane.querySelectorAll('mask path, .neui-cut, .neui-lip, .neui-floor').forEach(path => path.setAttribute('d', paths[index]))
      pane.querySelector('mask')!.setAttribute('height', String(heights[index]+8))
    })
    // Move the two curved openings with their sticky caps. The narrow side strips
    // carry only the rails, so the content cutout can turn inwards at every corner.
    const contentTop = start + band, contentBottom = height - Math.max(inset, metadata)
    const contentRight = width - inset
    const limit = Math.max(0, Math.min((width - inset * 2) / 2, (contentBottom - contentTop) / 2))
    const inner = Math.min(Math.max(0, radius - gap), limit)
    const endRadius = Math.min(Math.max(0, br - gap), limit)
    const rails = (from: number, to: number) =>
      `M 0 ${from} H ${inset} V ${to} H 0 Z M ${contentRight} ${from} H ${width} V ${to} H ${contentRight} Z`
    const upperCut = `M ${inset} ${contentTop + inner} a ${inner} ${inner} 0 0 1 ${inner} ${-inner}
      H ${contentRight - inner} a ${inner} ${inner} 0 0 1 ${inner} ${inner} V ${height} H ${inset} Z`
    const lowerCut = `M ${inset} 0 H ${contentRight} V ${contentBottom - endRadius}
      a ${endRadius} ${endRadius} 0 0 1 ${-endRadius} ${endRadius} H ${inset + inner}
      a ${inner} ${inner} 0 0 1 ${-inner} ${-inner} Z`
    topClip.style.clipPath = `path("${upperCut.replace(/\s+/g, ' ')} ${rails(headH, height)}")`
    bottomClip.style.clipPath = `path("${lowerCut.replace(/\s+/g, ' ')} ${rails(0, join)}")`
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
      ]
      light.layout(contour, { enter, exit })
    } else {
      light.layout(contour)
      if (!timeline) fallback()
    }
  }
  const events = new AbortController()
  const listener = { signal: events.signal }
  const resize = new ResizeObserver(layout)
  for (const element of [shell, caption, header, meta]) resize.observe(element)
  for (const probe of frame.querySelectorAll('.neui-metrics, .neui-pins')) resize.observe(probe)
  if (!nativeTimeline) window.addEventListener('scroll', fallback, { ...listener, capture: true, passive: true })
  frame.addEventListener('slotchange', layout, listener)
  const settings = new MutationObserver(layout)
  for (let el: HTMLElement | null = shell; el; el = el.parentElement)
    settings.observe(el, { attributes: true, attributeFilter: ['class', 'data-theme'] })
  void shell.ownerDocument.fonts?.ready.then(layout)
  layout()
  return () => {
    disposed = true
    light.dispose()
    resize.disconnect()
    events.abort()
    settings.disconnect()
    animations.forEach(a => a.cancel())
  }
}

export const layoutAuthoredRidge = retain((shell: HTMLElement) => layoutRidge(shell))
