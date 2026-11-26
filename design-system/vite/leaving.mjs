import { parse } from '@babel/parser'
import MagicString from 'magic-string'

const marked = /(?:^|[\s:])leaving:[^\s]+/

function visit(node, callback, parent) {
  if (!node || typeof node.type !== 'string') return
  callback(node, parent)
  for (const child of Object.values(node)) {
    if (Array.isArray(child)) child.forEach(item => visit(item, callback, node))
    else if (child?.type) visit(child, callback, node)
  }
}

function host(node, keyed = false) {
  if (node?.type !== 'JSXElement') return false
  const { name, attributes } = node.openingElement
  if (name.type !== 'JSXIdentifier' || !/^[a-z][\w-]*$/.test(name.name)) return false
  if (keyed && !attributes.some(attr => attr.type === 'JSXAttribute' && attr.name.name === 'key')) return false
  const classes = attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'className')
  let found = false
  visit(classes?.value, item => {
    if (item.type === 'StringLiteral' && marked.test(item.value)) found = true
    if (item.type === 'TemplateElement' && marked.test(item.value.raw)) found = true
  })
  return found
}

const empty = node => node.type === 'NullLiteral' || (node.type === 'BooleanLiteral' && !node.value)

function supported(node) {
  if (node?.type === 'LogicalExpression') return node.operator === '&&' && host(node.right)
  if (node?.type === 'ConditionalExpression') {
    return (host(node.consequent) && (empty(node.alternate) || host(node.alternate))) ||
      (empty(node.consequent) && host(node.alternate))
  }
  if (node?.type !== 'CallExpression' || node.callee.type !== 'MemberExpression' ||
      node.callee.computed || node.callee.property.name !== 'map') return false
  const fn = node.arguments[0]
  if (!['ArrowFunctionExpression', 'FunctionExpression'].includes(fn?.type)) return false
  const body = fn.body
  if (body.type !== 'BlockStatement') return host(body, true)
  return body.body.length === 1 && body.body[0].type === 'ReturnStatement' && host(body.body[0].argument, true)
}

function component(fn, owner) {
  const name = fn?.id?.name ?? (owner?.type === 'VariableDeclarator' ? owner.id.name : undefined)
  return typeof name === 'string' && /^[A-Z]/.test(name)
}

export function transformLeaving(code, id) {
  if (!code.includes('leaving:') || !/\.[jt]sx$/.test(id) || id.includes('/node_modules/')) return
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
    if (!supported(expression)) return
    edits.appendLeft(expression.start, alias + '(')
    edits.appendLeft(expression.end, ')')
  })
  if (!edits.hasChanged()) return
  edits.appendLeft(program.directives.at(-1)?.end ?? program.interpreter?.end ?? 0,
    '\nimport { presence as ' + alias + " } from '@neui/kit/presence';\n")
  return { code: edits.toString(), map: edits.generateMap({ hires: true, source: id, includeContent: true }) }
}
