import { createHash } from 'node:crypto'
import postcss from 'postcss'
import { catalog } from './catalog.mjs'
import { prepareRules } from './prepare.mjs'
import { dissolveLayer, dissolveSprite, svgImage } from './dissolve.mjs'

function declarations(rules) {
  return Object.entries(rules).map(([key, value]) =>
    typeof value === 'string' ? `${key}: ${value};` : `${key} { ${declarations(value)} }`).join('\n')
}

// Replace only the markers that survived Tailwind (including variants, safelists and @apply).
// A content-specific property keeps independent CSS entries usable on the same page or in shadow roots.
function pack(code, id, icons, layers) {
  if (!code.includes('var(--neuicon-pending-')) return
  const root = postcss.parse(code, { from: id })
  const uses = []
  root.walkDecls(/^--neuicon-dissolve-(from|to)$/, decl => {
    const layer = layers.get(decl.value)
    if (layer) uses.push({ decl, ...layer })
  })
  if (!uses.length) return
  const names = [...new Set(uses.map(use => use.name))].sort()
  const { svg, columns } = dissolveSprite(names, icons)
  const indices = new Map(names.map((name, i) => [name, i]))
  const digest = createHash('sha256').update(svg).digest('hex').slice(0, 16)
  const property = '--neuicon-sprite-' + digest
  for (const { decl, name, phase } of uses) {
    decl.value = dissolveLayer(`var(${property})`, indices.get(name), columns, phase)
  }
  root.append(postcss.parse(`@property ${property} { syntax: "*"; inherits: false; initial-value: ${svgImage(svg)}; }`).nodes)
  return { code: root.toString(), map: null }
}

export function neuicon(options = {}) {
  const icons = options.icons ?? catalog.icons
  const layers = new Map()
  const { properties, utilities } = prepareRules(options, (name, phase) => {
    const value = `var(--neuicon-pending-${layers.size})`
    layers.set(value, { name, phase })
    return value
  })
  const sheet = [
    ...Object.entries(properties).map(([key, rules]) => `@property ${key} { ${declarations(rules)} }`),
    ...Object.entries(utilities).map(([name, rules]) => `@utility ${name} { ${declarations(rules)} }`),
  ].join('\n')
  return [{
    name: 'neuicon:utilities', enforce: 'pre',
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
  }, {
    name: 'neuicon:sprite',
    transform(code, id) {
      if (id.split('?')[0].endsWith('.css')) return pack(code, id, icons, layers)
    },
  }]
}
