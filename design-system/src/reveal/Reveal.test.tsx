import { createRef } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { Reveal } from './Reveal'

afterEach(cleanup)
it('keeps the draft, removes the hidden branch from navigation and returns focus on close', () => {
  const trigger = createRef<HTMLButtonElement>()
  const view = (open: boolean) => <>
    <button ref={trigger}>Каналы</button>
    <Reveal open={open} collapsed={<span>Сводка</span>} returnFocusRef={trigger}>
      <input aria-label="Адрес" />
    </Reveal></>
  const { rerender } = render(view(true))
  const email = screen.getByRole<HTMLInputElement>('textbox')
  fireEvent.change(email, { target: { value: 'draft' } })
  email.focus()
  rerender(view(false))
  expect(email.closest('[inert]')).not.toBeNull()
  expect(screen.queryByRole('textbox')).toBeNull()
  expect(document.activeElement).toBe(trigger.current)
  rerender(view(true))
  expect(screen.getByRole<HTMLInputElement>('textbox').value).toBe('draft')
  expect(screen.getByText('Сводка').closest('[inert]')).not.toBeNull()
})
