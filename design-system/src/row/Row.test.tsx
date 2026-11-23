import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Row } from './Row'

afterEach(cleanup)
describe('Row', () => {
  it('activates the associated checkbox exactly once from the label text', () => {
    const onChange = vi.fn()
    render(<Row as="label" leading={<input type="checkbox" onChange={onChange} />}>Канал</Row>)
    fireEvent.click(screen.getByText('Канал'))
    expect(screen.getByRole<HTMLInputElement>('checkbox', { name: 'Канал' }).checked).toBe(true)
    expect(onChange).toHaveBeenCalledTimes(1)
  })
  it('leaves a disabled action and the containing form untouched', () => {
    const submit = vi.fn(), click = vi.fn()
    render(<form onSubmit={submit}><Row as="button" disabled onClick={click}>Удалить</Row></form>)
    fireEvent.click(screen.getByRole('button'))
    expect(click).not.toHaveBeenCalled()
    expect(submit).not.toHaveBeenCalled()
  })
})
