import { readFileSync } from 'node:fs'
import plugin from 'tailwindcss/plugin'

// Embed one static nine-slice tile at build time. The transparent middle leaves
// content clear and the outset reaches the soft falloff outside raised edges.
const noise = readFileSync(new URL('./dither.svg', import.meta.url), 'utf8')
const noiseImage = `url("data:image/svg+xml,${encodeURIComponent(noise)}")`

const light = 'var(--neui-relief-light, var(--neui-lip, #ffffffc7))'
const shade = 'var(--neui-relief-shade, var(--neui-shadow, #73859368))'

// All offsets lie on the vertical light axis. The same offset on an inset
// shadow colours the opposite wall, keeping the light source fixed.
function layer(depth, inset, offset, blur, spread, color, strength, offsetDepth = depth) {
  const length = factor => `calc(var(${depth}) * ${factor})`
  const tint = strength === 100 ? color : `color-mix(in srgb, ${color} ${strength}%, transparent)`
  return `${inset}0 calc(var(${offsetDepth}) * ${offset}) ${length(blur)} ${length(spread)} ${tint}`
}

function contour(depth, inset = '') {
  return [
    layer(depth, inset, -.17, .28, -.035, light, 100),
    layer(depth, inset, .20, .34, -.045, shade, 94),
    layer(depth, inset, -.70, 1.35, -.18, light, 62),
    layer(depth, inset, .89, 1.58, -.22, shade, 69),
  ].join(', ')
}

const body = {
  '--_neui-rise': 'max(0px, var(--neui-depth))',
  '--_neui-recess': 'max(0px, 0px - var(--neui-depth))',
  // The recessed face spans a wider area than the inner rim. Its light must
  // still be visible further inside once the rim shadow has fallen off.
  '--_neui-face-width': 'max(var(--_neui-rise), 2 * var(--_neui-recess))',
  '--_neui-face-offset': 'calc(var(--neui-depth) - var(--_neui-recess))',
  cornerShape: 'squircle',
  '--_neui-grain-outset': 'min(24px, 1.5 * var(--_neui-rise))',
  '--_neui-grain-inset': 'min(32px, 2 * max(var(--_neui-rise), var(--_neui-recess)))',
  borderImageSource: 'var(--neui-relief-dither, var(--_neui-relief-noise))',
  borderImageSlice: '32',
  borderImageWidth: 'calc(var(--_neui-grain-inset) + var(--_neui-grain-outset))',
  borderImageOutset: 'var(--_neui-grain-outset)',
  borderImageRepeat: 'round',
  boxShadow: [
    contour('--_neui-rise'),
    contour('--_neui-recess', 'inset '),
    layer('--_neui-face-width', 'inset ', .58, 1.38, -.20, shade, 38, '--_neui-face-offset'),
    layer('--_neui-face-width', 'inset ', -.48, 1.15, -.17, light, 43, '--_neui-face-offset'),
  ].join(', '),
  transitionProperty: '--neui-depth',
  transitionDuration: 'var(--tw-duration, 240ms)',
  transitionTimingFunction: 'var(--tw-ease, ease-out)',
  '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' },
}

export default plugin(({ addBase, addUtilities, matchUtilities }) => {
  addBase({
    ':root, :host': { '--_neui-relief-noise': noiseImage },
    '@property --neui-depth': { syntax: '"<length>"', inherits: 'false', initialValue: '8px' },
  })
  addUtilities({
    '.neui-relief': body,
    '.neui-extruded': body,
    '.neui-intruded': { ...body, '--neui-depth': '-8px' },
  })
  matchUtilities(
    { 'neui-depth': value => ({ '--neui-depth': value }) },
    { type: 'length', supportsNegativeValues: true, values: { 0: '0px', 2: '2px', 4: '4px', 8: '8px', 12: '12px', 16: '16px' } },
  )
})
