// @vitest-environment node
import { expect, it } from 'vitest'
import { transformLeaving } from '../transform.mjs'

it('wraps marked immediate render sites and preserves source, keys, directives and refs', () => {
  const source = `'use client';
    const __neuiPresence = 1;
    function Form() { return <main>
      {open ? <input ref={input} className="w-full leaving:w-0" /> : null}
      {open && <aside className={cx('motion-safe:leaving:opacity-0', other)} />}
      {rows.map(row => <li key={row.id} className="leaving:opacity-0" />)}
    </main> }
    const Last = () => show ? false : <footer className="leaving:w-0" />`
  const { code, map } = transformLeaving(source, 'form.tsx')
  expect(code.startsWith("'use client';")).toBe(true)
  expect(code.match(/__neuiPresence_\(/g)).toHaveLength(4)
  expect(code).toContain('ref={input}')
  expect(code).toContain('key={row.id}')
  expect(map.sourcesContent).toEqual([source])
})

it('skips unkeyed lists, inner markers, JSX props, data computations and raw imports', () => {
  const source = `const compute = () => rows.map(r => <i key={r} className="leaving:w-0"/>);
  const Form = () => <Box nodes={rows.map(r => <i key={r} className="leaving:w-0"/>)}>
    {a && <div><b className="leaving:w-0"/></div>}{a && <Part className="leaving:w-0"/>}
    {rows.map(r => <i className="leaving:w-0"/>)}
  </Box>`
  expect(transformLeaving(source, 'form.tsx')).toBeUndefined()
  expect(transformLeaving('const Form=()=>a && <i className="leaving:w-0"/>', 'form.tsx?raw')).toBeUndefined()
})

it('uses resolved aliases only on a marked host, including keyed map bodies with local declarations', () => {
  const aliases = new Set(['panel'])
  const code = `const Form = () => <main>
    {open && <aside className="md:panel" />}
    {rows.map(r => { const id = r.id; return <li key={id} className="panel" /> })}
    {open && <section className="panel-extra" />}
    {open && <div><i className="panel" /></div>}
  </main>`
  expect(transformLeaving(code, 'form.tsx', aliases).code.match(/__neuiPresence\(/g)).toHaveLength(2)
})
