import { parse } from '@babel/parser'
import MagicString from 'magic-string'

import { candidate } from './styles.mjs'

function marked(value, aliases) {
  return value.split(/\s+/).some(token => {
    const parsed = candidate(token)
    return parsed.leaving || aliases.has(parsed.utility)
  })
}

function visit(node, callback, parent) {
  if (!node || typeof node.type !== 'string') return
  callback(node, parent)
  for (const child of Object.values(node)) {
    if (Array.isArray(child)) child.forEach(item => visit(item, callback, node))
    else if (child?.type) visit(child, callback, node)
  }
}

function host(node, aliases, keyed = false) {
  if (node?.type !== 'JSXElement') return false
  const { name, attributes } = node.openingElement
  if (name.type !== 'JSXIdentifier' || !/^[a-z][\w-]*$/.test(name.name)) return false
  if (keyed && !attributes.some(attr => attr.type === 'JSXAttribute' && attr.name.name === 'key')) return false
  const classes = attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'className')
  let found = false
  visit(classes?.value, item => {
    if (item.type === 'StringLiteral' && marked(item.value, aliases)) found = true
    if (item.type === 'TemplateElement' && marked(item.value.raw, aliases)) found = true
  })
  return found
}

const empty = node => node.type === 'NullLiteral' || (node.type === 'BooleanLiteral' && !node.value)

function supported(node, aliases) {
  if (node?.type === 'LogicalExpression') return node.operator === '&&' && host(node.right, aliases)
  if (node?.type === 'ConditionalExpression') {
    return (host(node.consequent, aliases) && (empty(node.alternate) || host(node.alternate, aliases))) ||
      (empty(node.consequent) && host(node.alternate, aliases))
  }
  if (node?.type !== 'CallExpression' || node.callee.type !== 'MemberExpression' ||
      node.callee.computed || node.callee.property.name !== 'map') return false
  const fn = node.arguments[0]
  if (!['ArrowFunctionExpression', 'FunctionExpression'].includes(fn?.type)) return false
  const body = fn.body
  if (body.type !== 'BlockStatement') return host(body, aliases, true)
  const last = body.body.at(-1)
  return last?.type === 'ReturnStatement' && body.body.slice(0, -1).every(s => s.type === 'VariableDeclaration') && host(last.argument, aliases, true)
}

function component(fn, owner) {
  const name = fn?.id?.name ?? (owner?.type === 'VariableDeclarator' ? owner.id.name : undefined)
  return typeof name === 'string' && /^[A-Z]/.test(name)
}

export function transformLeaving(code, id, aliases = new Set()) {
  if ((!code.includes('leaving:') && ![...aliases].some(name => code.includes(name))) || !/\.[jt]sx$/.test(id) || id.includes('/node_modules/')) return
  const program = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript', 'decorators-legacy'] }).program
  let alias = '__neuiPresence'
  while (code.includes(alias)) alias += '_'
  const edits = new MagicString(code)
  const renderBodies = new WeakSet()
  visit(program, (node, parent) => {
    if ((node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') &&
        component(node, parent)) renderBodies.add(node.body)
    const expression = node.type === 'JSXExpressionContainer' && ['JSXElement', 'JSXFragment'].includes(parent?.type) ? node.expression
      : node.type === 'ReturnStatement' && renderBodies.has(parent) ? node.argument
      : node.type === 'ArrowFunctionExpression' && renderBodies.has(node.body) ? node.body : null
    if (!supported(expression, aliases)) return
    edits.appendLeft(expression.start, alias + '(')
    edits.appendLeft(expression.end, ')')
  })
  if (!edits.hasChanged()) return
  edits.appendLeft(program.directives.at(-1)?.end ?? program.interpreter?.end ?? 0,
    '\nimport { presence as ' + alias + " } from '@neui-tools/leaving/presence';\n")
  return { code: edits.toString(), map: edits.generateMap({ hires: true, source: id, includeContent: true }) }
}
