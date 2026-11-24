/** A single paint source in a sticky panel. Only the distant end of its mask can move. */
export function createCapLight(source: SVGSVGElement) {
  const doc = source.ownerDocument
  const svg = <K extends keyof SVGElementTagNameMap>(name: K) => doc.createElementNS('http://www.w3.org/2000/svg', name)
  const lamp = svg('svg')
  lamp.classList.add('neui-cap-lamp')
  lamp.setAttribute('aria-hidden', 'true')
  lamp.setAttribute('focusable', 'false')

  const defs = svg('defs'), mask = svg('mask'), clip = svg('clipPath'), railClip = svg('rect')
  // Authored frames already have unique mask IDs. Generated frames have independent shadow roots.
  mask.id = source.querySelector('mask')!.id + '-pinned'
  clip.id = mask.id + '-rail'
  clip.append(railClip)
  const near = svg('path'), far = svg('path'), rail = svg('g'), moving = svg('g')
  for (const path of [near, far]) {
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', 'white')
    path.setAttribute('stroke-width', '2')
  }
  moving.append(far)
  rail.append(moving)
  rail.setAttribute('clip-path', 'url(#' + clip.id + ')')
  mask.append(near, rail)
  defs.append(clip, mask)
  const band = source.querySelector('.neui-light')!.cloneNode(false) as SVGRectElement
  band.setAttribute('mask', 'url(#' + mask.id + ')')
  lamp.append(defs, band)

  return { svg: lamp, band, near, far, railClip, moving }
}
