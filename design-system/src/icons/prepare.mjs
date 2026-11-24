import plugin from 'tailwindcss/plugin'

const intervals = 48
const cssUrl = svg => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
const namePattern = /^[a-z][a-z0-9-]*$/

/**
 * icons maps a name to a complete SVG. A pair supplies the contents of a square
 * SVG viewBox at progress 0..1. Both endpoints must match their static icons.
 * Runs only in the Tailwind build.
 */
export function prepareIcons({ icons, pairs = [] }) {
  const utilities = {}
  for (const [name, svg] of Object.entries(icons)) {
    if (!namePattern.test(name) || /^(?:from-|to-|transition$)/.test(name)) throw new Error(`Invalid NEUI icon name: ${name}`)
    const mask = cssUrl(svg)
    utilities['.neui-icon-' + name] = {
      display: 'inline-block', width: '1em', height: '1em', flex: 'none',
      backgroundColor: 'currentColor', mask: `${mask} center / contain no-repeat`,
    }
    utilities['.neui-icon-from-' + name] = { '--neui-icon-from': mask }
    utilities['.neui-icon-to-' + name] = { '--neui-icon-to': mask }
  }

  for (const { from, to, draw, size = 24 } of pairs) {
    if (!Object.hasOwn(icons, from) || !Object.hasOwn(icons, to) || from === to)
      throw new Error(`Invalid NEUI icon pair: ${from} → ${to}`)
    if (!Number.isFinite(size) || size <= 0) throw new Error(`Invalid NEUI icon viewBox size: ${size}`)
    const frames = Array.from({ length: intervals + 1 }, (_, index) =>
      `<svg y="${index * size}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${draw(index / intervals)}</svg>`)
    const atlas = cssUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${frames.length * size}" preserveAspectRatio="none">${frames.join('')}</svg>`)
    for (const [a, b, backwards] of [[from, to, false], [to, from, true]]) {
      // The compound selector is prepared once. No client registry or class observer.
      const rules = utilities['.neui-icon-from-' + a]
      const selector = '&.neui-icon-to-' + b
      if (rules[selector]) throw new Error(`Duplicate NEUI icon pair: ${a} → ${b}`)
      rules[selector] = {
        '--neui-icon-atlas': atlas, '--neui-icon-steps': String(intervals),
        '--neui-icon-phase': backwards ? 'calc(1 - var(--neui-icon-p))' : 'var(--neui-icon-p)',
      }
    }
  }
  return plugin(({ addUtilities }) => addUtilities(utilities))
}
