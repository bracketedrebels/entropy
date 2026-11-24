// @vitest-environment node
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { build } from 'vite'
import { it, expect, vi } from 'vitest'
import { prepareIcons } from '@neui/icon'
import { neuicon } from '@neui/icon/vite'

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

it.each(['vite', 'tailwind'])('builds host and pseudo-element utilities independently of the kit using %s', async adapter => {
  const root = await mkdtemp(join(tmpdir(), 'neuicon-'))
  try {
    await mkdir(join(root, 'node_modules/@neui'), { recursive: true })
    for (const [name, path] of [['@neui/icon', '../neuicon'], ['tailwindcss', '../node_modules/tailwindcss']]) {
      await symlink(fileURLToPath(new URL(path, import.meta.url)), join(root, 'node_modules', name), 'dir')
    }
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
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
