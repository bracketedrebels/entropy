// @vitest-environment node
import { expect, it } from 'vitest'
import { transformHosts } from './reactHosts.mjs'

it('changes only marked intrinsic tag names and preserves directives, refs, keys and children', () => {
  const input = `'use client';
const __NeuiHost0 = 1;
export const view = <section className={track ? 'neui-ridge neui-track-focus' : 'neui-ridge'} ref={ref}>
  <div key={id} {...props} className={cx('neui-track-focus', extra)} />
  <section className="neui-ridge"><Custom className="neui-ridge" /></section>
  <aside className="neui-ridge-radius-[8px]" />
</section>`
  const { code, map } = transformHosts(input, 'example.tsx')
  expect(code.startsWith("'use client';")).toBe(true)
  expect(code.match(/ForTag\("section"\)/g)).toHaveLength(1)
  expect(code).toContain('<__Neui_Host0 className={track')
  expect(code).toContain('ref={ref}>')
  expect(code).toContain('<__Neui_Host1 key={id} {...props}')
  expect(code).toContain('<Custom className="neui-ridge" /></__Neui_Host0>')
  expect(code).toContain('<aside className="neui-ridge-radius-[8px]" />')
  expect(map.sourcesContent).toEqual([input])
})

it('leaves computed markers, comments, textual examples and custom components alone', () => {
  const input = `// <div className="neui-ridge" />
const view = <Box className="neui-track-focus"><div className={styles} title="neui-ridge" /></Box>`
  expect(transformHosts(input, 'example.jsx')).toBeUndefined()
})
