import { createRef, useState } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { Reveal } from '../../recipes/Reveal'

afterEach(cleanup)
it('keeps the draft, removes the hidden branch from navigation and returns focus on close', () => {
  const trigger = createRef<HTMLButtonElement>()
  function Form({ open }: { open: boolean }) {
    const [draft, setDraft] = useState('')
    return <>
      <button ref={trigger}>Каналы</button>
      <Reveal open={open} collapsed={<span>Сводка</span>} returnFocusRef={trigger}>
        <input aria-label="Адрес" value={draft} onChange={e => setDraft(e.currentTarget.value)} />
      </Reveal></>
  }
  const { rerender } = render(<Form open />)
  const email = screen.getByRole<HTMLInputElement>('textbox')
  fireEvent.change(email, { target: { value: 'draft' } })
  email.focus()
  rerender(<Form open={false} />)
  expect(email.isConnected).toBe(false)
  expect(screen.queryByRole('textbox')).toBeNull()
  expect(document.activeElement).toBe(trigger.current)
  rerender(<Form open />)
  expect(screen.getByRole<HTMLInputElement>('textbox').value).toBe('draft')
  expect(screen.queryByText('Сводка')).toBeNull()
})
