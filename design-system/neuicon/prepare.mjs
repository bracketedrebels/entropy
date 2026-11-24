import { catalog } from './catalog.mjs'

const defaultFrames = 49
const progress = 'clamp(0, var(--neuicon-progress), 1)'
const reverse = `calc(1 - ${progress})`
const size = 24
const uri = svg => 'data:image/svg+xml,' + encodeURIComponent(svg)
const image = svg => `url("${uri(svg)}")`
const viewport = (body, width, height) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">${body}</svg>`

function validateFrames(frames) {
  if (!Number.isSafeInteger(frames) || frames < 2) throw new RangeError('NEUIcon frames must be an integer of at least 2')
}

function samples(frames, draw) {
  return Array.from({ length: frames }, (_, i) => draw(i / (frames - 1), i)).join('')
}

// Each cell is clipped to its own viewport so a blurred neighbour never bleeds into an endpoint.
function cell(body, i, side) {
  return `<svg y="${i * side}" width="${side}" height="${side}" viewBox="0 0 ${side} ${side}" overflow="hidden">${body}</svg>`
}

function strip(mask, frames, phase) {
  const steps = frames - 1
  return `${mask} center calc(round(nearest, ${phase} * ${steps}, 1) * 100% / ${steps}) / 100% ${frames * 100}% no-repeat`
}

// One reusable dissolve per glyph. The SVG geometry is stored once regardless of the number of partners.
function dissolve(svg) {
  const frames = defaultFrames
  const filters = new Map()
  const cells = samples(frames, (p, i) => {
    if (i === 0) return ''
    const blur = (size * .36 * p * (1 - p)).toFixed(3)
    const id = 'b' + Math.min(i, frames - 1 - i)
    const sharp = i === frames - 1
    if (!sharp) filters.set(id, `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter>`)
    return cell(`<use href="#glyph" opacity="${+p.toFixed(4)}"${sharp ? '' : ` filter="url(#${id})"`}/>`, i, size)
  })
  const glyph = `<image id="glyph" width="${size}" height="${size}" href="${uri(svg)}"/>`
  return image(viewport(`<defs>${glyph}${[...filters.values()].join('')}</defs>${cells}`, size, size * frames))
}

const iconBox = { display: 'inline-block', width: '1em', height: '1em', flex: 'none', 'background-color': 'currentColor' }
const emptyProperty = { syntax: '"*"', inherits: 'false' }
const blend = 'var(--neuicon-dissolve-from), var(--neuicon-dissolve-to)'

export function prepareIcons({ icons = catalog.icons, pairs = icons === catalog.icons ? catalog.pairs : [], frames = defaultFrames } = {}) {
  validateFrames(frames)
  const properties = { '--neuicon-progress': { syntax: '"<number>"', inherits: 'true', 'initial-value': '0' } }
  const utilities = {
    'neuicon-transition': {
      ...iconBox,
      mask: 'var(--neuicon-mask)',
      'transition-property': '--neuicon-progress',
      'transition-duration': 'var(--tw-duration, 240ms)',
      'transition-timing-function': 'var(--tw-ease, ease-out)',
      '@media (prefers-reduced-motion: reduce)': { 'transition-property': 'none' },
    },
  }
  for (const [name, svg] of Object.entries(icons)) {
    if (!/^[a-z][a-z0-9-]*$/.test(name) || /^(?:from-|to-|transition$)/.test(name))
      throw new Error(`Invalid NEUIcon name: ${name}`)
    const staticMask = image(svg)
    const fading = dissolve(svg)
    utilities['neuicon-' + name] = { ...iconBox, mask: staticMask + ' center / contain no-repeat' }
    utilities['neuicon-from-' + name] = {
      '--neuicon-dissolve-from': strip(fading, defaultFrames, reverse),
      '--neuicon-mask': blend,
    }
    utilities['neuicon-to-' + name] = { '--neuicon-dissolve-to': strip(fading, defaultFrames, progress) }
  }
  for (const { from, to, draw, size: side = 24, frames: count = frames } of pairs) {
    if (!Object.hasOwn(icons, from) || !Object.hasOwn(icons, to) || from === to)
      throw new Error(`Invalid NEUIcon pair: ${from} → ${to}`)
    if (!Number.isFinite(side) || side <= 0) throw new Error(`Invalid NEUIcon viewBox size: ${side}`)
    validateFrames(count)
    const poses = samples(count, (p, i) => cell(draw(p), i, side))
    const atlas = image(viewport(poses, side, side * count))
    for (const [a, b, phase] of [[from, to, progress], [to, from, reverse]]) {
      // Both utilities land on the same CSS box, even through variants or @apply.
      const slot = '--neuicon-pair-from-' + a
      const destination = utilities['neuicon-to-' + b]
      if (slot in destination) throw new Error(`Duplicate NEUIcon pair: ${a} → ${b}`)
      properties[slot] = emptyProperty
      utilities['neuicon-from-' + a]['--neuicon-mask'] = `var(${slot}, ${blend})`
      destination[slot] = strip(atlas, count, phase)
    }
  }
  return { properties, utilities }
}
