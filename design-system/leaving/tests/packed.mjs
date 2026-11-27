import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const archive = resolve(process.argv[2])
const root = await mkdtemp(join(tmpdir(), 'leaving-consumer-'))
const { packages } = JSON.parse(await readFile(new URL('../../package-lock.json', import.meta.url), 'utf8'))
const dependencies = Object.fromEntries(['react', 'react-dom', 'vite', 'tailwindcss', '@tailwindcss/vite'].map(name =>
  [name, packages['node_modules/' + name].version]))
dependencies['@neui-tools/leaving'] = 'file:' + archive

try {
  await writeFile(join(root, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies }))
  execFileSync('npm', ['install', '--no-audit', '--no-fund'], { cwd: root, stdio: 'inherit' })
  await writeFile(join(root, 'vite.config.mjs'), `
    import tailwindcss from '@tailwindcss/vite'
    import { neuiLeaving } from '@neui-tools/leaving/vite'
    export default { plugins: [tailwindcss(), neuiLeaving()], esbuild: { jsx: 'automatic' } }
  `)
  await writeFile(join(root, 'index.html'), '<div id="app"></div><script type="module" src="/app.tsx"></script>')
  await writeFile(join(root, 'style.css'), `
    @import "tailwindcss";
    @import "@neui-tools/leaving/tailwind.css";
    @utility panel { @apply neui-collapse-block; }
  `)
  await writeFile(join(root, 'app.tsx'), `
    import './style.css'
    import { useState } from 'react'
    import { createRoot } from 'react-dom/client'
    function App() {
      const [open, setOpen] = useState(true)
      return <main><button onClick={() => setOpen(!open)}>Toggle</button>
        {open && <section className="panel"><div>Content</div></section>}
      </main>
    }
    createRoot(document.querySelector('#app')).render(<App />)
  `)
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--minify=false'], { cwd: root, stdio: 'inherit' })
  const assets = join(root, 'dist/assets')
  const files = await readdir(assets)
  const output = ext => readFile(join(assets, files.find(file => file.endsWith(ext))), 'utf8')
  assert.match(await output('.js'), /getAnimations\(/)
  const css = await output('.css')
  assert.match(css, /\.panel\b/)
  assert.match(css, /data-leaving/)
  assert.match(css, /@starting-style/)
  const installed = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8'))
  assert.equal(installed.packages['node_modules/@neui/kit'], undefined)
  console.log('Standalone tarball built successfully with React, Tailwind and Vite.')
} finally {
  await rm(root, { recursive: true, force: true })
}
