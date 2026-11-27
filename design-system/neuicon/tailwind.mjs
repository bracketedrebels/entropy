import plugin from 'tailwindcss/plugin'
import { prepareIcons } from './prepare.mjs'

export function neuiconTailwind(options) {
  const { properties, utilities } = prepareIcons(options)
  return plugin(({ addBase, addUtilities }) => {
    addBase(Object.fromEntries(Object.entries(properties).map(([name, rules]) => ['@property ' + name, rules])))
    addUtilities(Object.fromEntries(Object.entries(utilities).map(([name, rules]) => ['.' + name, rules])))
  })
}
export default neuiconTailwind()
