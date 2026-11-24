import { catalog } from './catalog.mjs'
import { dissolveLayer, dissolveSprite, svgImage } from './dissolve.mjs'

const defaultFrames = 49
const progress = 'clamp(0, var(--neuicon-progress), 1)'
const reverse = `calc(1 - ${progress})`
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

const iconBox = { display: 'inline-block', width: '1em', height: '1em', flex: 'none', 'background-color': 'currentColor' }
const emptyProperty = { syntax: '"*"', inherits: 'false' }
const blend = 'var(--neuicon-dissolve-from), var(--neuicon-dissolve-to)'

export function prepareIcons(options = {}) {
  const icons = options.icons ?? catalog.icons
  const names = Object.keys(icons).sort()
  const indices = new Map(names.map((name, i) => [name, i]))
  const sprite = names.length ? dissolveSprite(names, icons) : undefined
  const rules = prepareRules(options, (name, phase) =>
    dissolveLayer('var(--neuicon-sprite)', indices.get(name), sprite.columns, phase))
  if (sprite) rules.utilities['neuicon-transition']['--neuicon-sprite'] = svgImage(sprite.svg)
  return rules
}

// Vite defers the dissolve layers until Tailwind has selected its utilities.
export function prepareRules({ icons = catalog.icons, pairs = icons === catalog.icons ? catalog.pairs : [], frames = defaultFrames }, layer) {
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
    const staticMask = svgImage(svg)
    utilities['neuicon-' + name] = { ...iconBox, mask: staticMask + ' center / contain no-repeat' }
    utilities['neuicon-from-' + name] = {
      '--neuicon-dissolve-from': layer(name, reverse),
      '--neuicon-mask': blend,
    }
    utilities['neuicon-to-' + name] = { '--neuicon-dissolve-to': layer(name, progress) }
  }
  for (const { from, to, draw, size: side = 24, frames: count = frames } of pairs) {
    if (!Object.hasOwn(icons, from) || !Object.hasOwn(icons, to) || from === to)
      throw new Error(`Invalid NEUIcon pair: ${from} → ${to}`)
    if (!Number.isFinite(side) || side <= 0) throw new Error(`Invalid NEUIcon viewBox size: ${side}`)
    validateFrames(count)
    const poses = samples(count, (p, i) => cell(draw(p), i, side))
    const atlas = svgImage(viewport(poses, side, side * count))
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
