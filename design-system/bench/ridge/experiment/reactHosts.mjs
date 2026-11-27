import { parse } from '@babel/parser'
import MagicString from 'magic-string'

const marker = /(?:^|\s)neui-(?:ridge|track-focus)(?:\s|$)/

function walk(node, visit) {
  if (!node || typeof node.type !== 'string') return
  visit(node)
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(child => walk(child, visit))
    else if (value?.type) walk(value, visit)
  }
}

function declaresBehavior(attribute) {
  if (attribute.type !== 'JSXAttribute' || attribute.name.name !== 'className') return false
  let found = false
  walk(attribute.value, node => {
    if (node.type === 'StringLiteral' && marker.test(node.value)) found = true
    if (node.type === 'TemplateElement' && marker.test(node.value.cooked ?? '')) found = true
  })
  return found
}

// Rewrite tag names only: keys, refs, spreads, evaluation order and children stay in the original JSX.
export function transformHosts(code, id) {
  const program = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript', 'decorators-legacy'] }).program
  const source = new MagicString(code)
  const tags = new Map()
  let prefix = '__Neui'
  while (code.includes(prefix)) prefix += '_'
  walk(program, node => {
    if (node.type !== 'JSXElement') return
    const open = node.openingElement
    if (open.name.type !== 'JSXIdentifier' || !/^[a-z][\w-]*$/.test(open.name.name)) return
    if (!open.attributes.some(declaresBehavior)) return
    const tag = open.name.name
    if (!tags.has(tag)) tags.set(tag, prefix + 'Host' + tags.size)
    const binding = tags.get(tag)
    source.overwrite(open.name.start, open.name.end, binding)
    if (node.closingElement) source.overwrite(node.closingElement.name.start, node.closingElement.name.end, binding)
  })
  if (!tags.size) return
  const preamble = [`import { forTag as ${prefix}ForTag } from 'neui-bench:host';`,
    ...Array.from(tags, ([tag, name]) => `const ${name} = /* @__PURE__ */ ${prefix}ForTag(${JSON.stringify(tag)});`)]
  source.appendLeft(program.directives.at(-1)?.end ?? program.interpreter?.end ?? 0, '\n' + preamble.join('\n') + '\n')
  return { code: source.toString(), map: source.generateMap({ hires: true, source: id, includeContent: true }) }
}
