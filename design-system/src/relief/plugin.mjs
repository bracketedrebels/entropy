import plugin from 'tailwindcss/plugin'

const light = 'var(--neui-relief-light, var(--neui-lip, #ffffffc7))'
const shade = 'var(--neui-relief-shade, var(--neui-shadow, #73859368))'
const flat = '0 0 transparent'

// All offsets lie on the vertical light axis. The same offset on an inset
// shadow colours the opposite wall, keeping the light source fixed.
function layer(depth, inset, offset, blur, spread, color, strength) {
  const length = factor => `calc(var(${depth}) * ${factor})`
  const tint = strength === 100 ? color : `color-mix(in srgb, ${color} ${strength}%, transparent)`
  return `${inset}0 ${length(offset)} ${length(blur)} ${length(spread)} ${tint}`
}

function contour(depth, inset = '') {
  return [
    layer(depth, inset, -.17, .28, -.035, light, 100),
    layer(depth, inset, .20, .34, -.045, shade, 94),
    layer(depth, inset, -.70, 1.35, -.18, light, 62),
    layer(depth, inset, .89, 1.58, -.22, shade, 69),
  ].join(', ')
}

const paint = {
  boxShadow: 'var(--_neui-relief-face, 0 0 transparent), var(--_neui-relief-contour, 0 0 transparent)',
  transitionProperty: '--neui-depth',
  transitionDuration: 'var(--tw-duration, 240ms)',
  transitionTimingFunction: 'var(--tw-ease, ease-out)',
  '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' },
}
const body = {
  ...paint,
  '--_neui-rise': 'max(0px, var(--neui-depth))',
  '--_neui-recess': 'max(0px, 0px - var(--neui-depth))',
  '--_neui-relief-contour': [contour('--_neui-rise'), contour('--_neui-recess', 'inset ')].join(', '),
}

export default plugin(({ addBase, addUtilities, matchUtilities }) => {
  // Keep the two paint layers local even when relief surfaces are nested.
  const shadowSlot = { syntax: '"*"', inherits: 'false', initialValue: flat }
  addBase({
    '@property --neui-depth': { syntax: '"<length>"', inherits: 'false', initialValue: '8px' },
    '@property --_neui-relief-contour': shadowSlot,
    '@property --_neui-relief-face': shadowSlot,
  })
  addUtilities({
    '.neui-relief': body,
    '.neui-extruded': body,
    '.neui-intruded': { ...body, '--neui-depth': '-8px' },
    '.neui-inner-shadow': {
      ...paint,
      '--_neui-face-depth': 'max(var(--neui-depth), 0px - var(--neui-depth))',
      '--_neui-relief-face': [
        layer('--_neui-face-depth', 'inset ', .58, 1.38, -.20, shade, 38),
        layer('--_neui-face-depth', 'inset ', -.48, 1.15, -.17, light, 43),
      ].join(', '),
    },
  })
  matchUtilities(
    { 'neui-depth': value => ({ '--neui-depth': value }) },
    { type: 'length', supportsNegativeValues: true, values: { 0: '0px', 2: '2px', 4: '4px', 8: '8px', 12: '12px', 16: '16px' } },
  )
})
