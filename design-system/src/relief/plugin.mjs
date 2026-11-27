import plugin from 'tailwindcss/plugin'

// An inset shadow with the same offset shades the opposite wall of the recess.
function relief(inset) {
  const depth = factor => `calc(var(--_neui-depth) * ${factor})`
  const shadow = (x, y, blur, spread, color) =>
    `${inset}${depth(x)} ${depth(y)} ${depth(blur)} ${depth(spread)} ${color}`
  const light = 'var(--neui-relief-light, var(--neui-lip, #ffffffc7))'
  const shade = 'var(--neui-relief-shade, var(--neui-shadow, #73859368))'
  return {
    '--_neui-depth': 'max(0px, var(--neui-depth, 8px))',
    boxShadow: [
      shadow(.15, .24, .52, -.18, `color-mix(in srgb, ${shade} 55%, transparent)`),
      shadow(.78, 1, 1.65, -.30, shade),
      shadow(-.68, -.82, 1.45, -.22, light),
    ].join(', '),
    transitionProperty: '--neui-depth',
    transitionDuration: 'var(--tw-duration, 240ms)',
    transitionTimingFunction: 'var(--tw-ease, ease-out)',
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' },
  }
}

export default plugin(({ addBase, addUtilities, matchUtilities }) => {
  addBase({
    '@property --neui-depth': { syntax: '"<length>"', inherits: 'false', initialValue: '8px' },
  })
  addUtilities({
    '.neui-extruded': relief(''),
    '.neui-intruded': relief('inset '),
  })
  matchUtilities(
    { 'neui-depth': value => ({ '--neui-depth': value }) },
    { type: 'length', values: { 0: '0px', 2: '2px', 4: '4px', 8: '8px', 12: '12px', 16: '16px' } },
  )
})
