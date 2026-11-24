import postcss from 'postcss'
import { prepareIcons } from './prepare.mjs'

function declarations(rules) {
  return Object.entries(rules).map(([key, value]) =>
    typeof value === 'string' ? `${key}: ${value};` : `${key} { ${declarations(value)} }`).join('\n')
}

// This directive belongs in the Tailwind entry stylesheet, where candidates are collected.
export function neuicon(options) {
  const { properties, utilities } = prepareIcons(options)
  const sheet = [
    ...Object.entries(properties).map(([key, rules]) => `@property ${key} { ${declarations(rules)} }`),
    ...Object.entries(utilities).map(([name, rules]) => `@utility ${name} { ${declarations(rules)} }`),
  ].join('\n')
  return {
    name: 'neuicon', enforce: 'pre',
    transform: {
      order: 'pre',
      handler(code, id) {
        if (!id.split('?')[0].endsWith('.css') || !code.includes('@neuicon')) return
        const root = postcss.parse(code, { from: id })
        const directive = root.nodes.find(node => node.type === 'atrule' && node.name === 'neuicon')
        if (!directive) return
        directive.replaceWith(postcss.parse(sheet).nodes)
        return { code: root.toString(), map: null }
      },
    },
  }
}
