// @vitest-environment node
import { renderToString } from 'react-dom/server'
import { expect, it } from 'vitest'

it('renders the original HTML on the server in both states', () => {
  const Form = ({ open }: { open: boolean }) => <section>{open && <b className="leaving:opacity-0">Текст</b>}</section>
  expect(renderToString(<Form open />)).toBe('<section><b class="leaving:opacity-0">Текст</b></section>')
  expect(renderToString(<Form open={false} />)).toBe('<section></section>')
})
