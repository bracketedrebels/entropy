// @vitest-environment node
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import postcss from 'postcss'
import { build, createServer } from 'vite'
import { it, expect, vi } from 'vitest'
import { prepareIcons } from '@neui/icon'
import { neuicon } from '@neui/icon/vite'
import { catalog } from '@neui/icon/catalog'

const glyph = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>'
const icons = { a: glyph, b: glyph, c: glyph }

it('samples both endpoints once, uses the pair override, and reverses the same atlas', () => {
  const draw = vi.fn(() => '<path/>')
  const other = vi.fn(() => '<circle/>')
  const { utilities } = prepareIcons({ icons, frames: 60, pairs: [
    { from: 'a', to: 'b', draw }, { from: 'a', to: 'c', draw: other, frames: 120 },
  ] })
  for (const [fn, count] of [[draw, 60], [other, 120]]) {
    expect(fn.mock.calls.map(([p]) => p)).toEqual(Array.from({ length: count }, (_, i) => i / (count - 1)))
  }
  const forward = utilities['neuicon-to-b']['--neuicon-pair-from-a']
  const reverse = utilities['neuicon-to-a']['--neuicon-pair-from-b']
  expect(forward.split(' center ')[0]).toBe(reverse.split(' center ')[0])
  expect(reverse).toContain('calc(1 - clamp(')
  expect(utilities['neuicon-to-c']['--neuicon-pair-from-b']).toBeUndefined()
})

it('accepts a two-pose transition and rejects invalid frame counts during preparation', () => {
  const draw = vi.fn(() => '<path/>')
  const pair = { from: 'a', to: 'b', draw }
  prepareIcons({ icons, frames: 2, pairs: [pair] })
  expect(draw.mock.calls).toEqual([[0], [1]])
  for (const frames of [0, 1, 2.5, NaN, Infinity]) {
    expect(() => prepareIcons({ icons, frames })).toThrow('frames')
    expect(() => prepareIcons({ icons, pairs: [{ ...pair, frames }] })).toThrow('frames')
  }
})

async function withProject(run) {
  const root = await mkdtemp(join(tmpdir(), 'neuicon-'))
  try {
    await mkdir(join(root, 'node_modules/@neui'), { recursive: true })
    for (const [name, path] of [['@neui/icon', '../neuicon'], ['tailwindcss', '../node_modules/tailwindcss']]) {
      await symlink(fileURLToPath(new URL(path, import.meta.url)), join(root, 'node_modules', name), 'dir')
    }
    await run(root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

function unpack(css) {
  const declarations = []
  const sprites = new Set()
  const root = postcss.parse(css)
  root.walkDecls(decl => {
    if (decl.prop === '--neuicon-sprite' ||
        (decl.prop === 'initial-value' && decl.parent.params?.startsWith('--neuicon-sprite-'))) {
      const data = decl.value.match(/^url\(["']?data:image\/svg\+xml,(.*?)["']?\)$/)
      sprites.add(decodeURIComponent(data[1]))
      declarations.push(decl)
    }
  })
  expect(css).not.toContain('--neuicon-pending-')
  return { sprites: [...sprites], declarations }
}

it.each(['vite', 'tailwind'])('builds host and pseudo-element utilities independently of the kit using %s', async adapter => {
  await withProject(async root => {
    await writeFile(join(root, 'index.html'), `<link rel="stylesheet" href="./ui.css">
      <i class="neuicon-search"></i><button class="before:neuicon-transition before:neuicon-from-star before:neuicon-to-person
        after:neuicon-transition after:neuicon-from-tag after:neuicon-to-trash after:duration-500">Test</button>`)
    const directive = adapter === 'vite' ? '@neuicon;' : '@plugin "@neui/icon/tailwind";'
    await writeFile(join(root, 'ui.css'), '@import "tailwindcss"; ' + directive)
    const { output } = await build({ root, configFile: false, logLevel: 'silent',
      plugins: [adapter === 'vite' && neuicon({ frames: 60 }), tailwindcss()],
      css: { postcss: { plugins: [] } }, build: { write: false, cssMinify: false } })
    const css = output.find(file => file.fileName.endsWith('.css')).source
    expect(css).toMatch(/\.before\\:neuicon-transition::?before/)
    expect(css).toMatch(/\.after\\:neuicon-transition::?after/)
    expect(css).not.toMatch(/::?(before|after)::?(before|after)/)
    expect(css).toContain('@property --neuicon-progress')
    expect(css).toMatch(/@property --neuicon-pair-from-tag\s*\{[^}]*inherits:\s*false/)
    expect(css).toContain('--neuicon-dissolve-to')
    expect(css).toContain(adapter === 'vite' ? '6000%' : '4900%')
    expect(css).not.toContain('.neuicon-clear')
    expect(output.some(file => file.type === 'chunk' && file.code.trim())).toBe(false)
    const { sprites, declarations } = unpack(css)
    expect(sprites).toHaveLength(1)
    const [sprite] = sprites
    expect(sprite.match(/<use href="#row"/g)).toHaveLength(48)
    expect(sprite.match(/<feGaussianBlur /g)).toHaveLength(24)
    const names = adapter === 'vite' ? ['person', 'star', 'tag', 'trash'] : Object.keys(catalog.icons)
    expect(sprite.match(/<image /g)).toHaveLength(names.length)
    for (const name of names) expect(sprite).toContain(encodeURIComponent(catalog.icons[name]))
    if (adapter === 'vite') {
      expect(declarations).toHaveLength(1)
      expect(sprite).not.toContain(encodeURIComponent(catalog.icons.search))
      expect(css).toContain('700% 4900%')
    }
  })
})

it('prunes static-only entries and packs @apply per stylesheet in development', async () => {
  await withProject(async root => {
    const styles = {
      'static.css': '.find { @apply neuicon-search; }',
      'one.css': '.marker::after { @apply neuicon-transition neuicon-from-star neuicon-to-star; }',
      'two.css': '@source inline("before:neuicon-from-star before:neuicon-to-person");',
    }
    for (const [file, body] of Object.entries(styles))
      await writeFile(join(root, file), '@import "tailwindcss" source(none); @neuicon; ' + body)
    const server = await createServer({ root, configFile: false, logLevel: 'silent',
      plugins: [neuicon(), tailwindcss()], css: { postcss: { plugins: [] } }, server: { middlewareMode: true, hmr: false } })
    try {
      const style = async file => (await server.transformRequest('/' + file + '?direct')).code
      const plain = await style('static.css')
      expect(plain).toContain('mask:')
      expect(unpack(plain).sprites).toHaveLength(0)
      const one = await style('one.css')
      const two = await style('two.css')
      const a = unpack(one), b = unpack(two)
      expect(a.sprites[0].match(/<image /g)).toHaveLength(1)
      expect(one).toContain('100% 4900%')
      expect(b.sprites[0].match(/<image /g)).toHaveLength(2)
      expect(two).toContain('300% 4900%')
      expect(a.declarations[0].parent.params).not.toBe(b.declarations[0].parent.params)
    } finally {
      await server.close()
    }
  })
})
