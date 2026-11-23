import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { ChoicePicker } from './form/ChoicePicker'
import { channels } from './form/options'

function Delivery({ id }: { id: string }) {
  const [selected, setSelected] = useState(['inbox'])
  return <ChoicePicker id={id} name="delivery" label="Куда доставлять сводку?" actionLabel="каналы доставки"
    options={channels} selected={selected} onChange={setSelected} multiple emptyLabel="Доставка выключена" />
}

// jsdom has no layout. Exercise the real React disclosure, native controls and focus.
vi.mock('../src/ridge/geometry', () => ({ attachRidge: () => undefined }))
afterEach(cleanup)

const disclosure = () => screen.getByRole('button', { name: /каналы доставки/ })
const row = (name: string) => screen.getByText(name, { exact: true })
const choices = () => screen.queryAllByRole<HTMLInputElement>('checkbox')

it('retains the visible row and its open panel when disclosure reverses', () => {
  render(<Delivery id="delivery" />)
  const inbox = row('Входящие Trinet')
  const panel = inbox.closest('.tn-reveal')!
  for (const count of [6, 0, 6, 0]) {
    fireEvent.click(disclosure())
    expect(choices()).toHaveLength(count)
    expect(row('Входящие Trinet')).toBe(inbox)
    expect(inbox.closest('.tn-reveal')).toBe(panel)
    expect(panel.getAttribute('data-open')).toBe('true')
  }
  fireEvent.click(inbox)
  expect(choices()[0].checked).toBe(true)
  expect(document.activeElement).toBe(choices()[0])
})

it('keeps both preview rows and promotes selected channels only on reopening', () => {
  render(<Delivery id="delivery" />)
  fireEvent.click(disclosure())
  const team = row('Канал команды')
  const inbox = row('Входящие Trinet')
  fireEvent.click(team)
  expect(choices()[5].checked).toBe(true)
  fireEvent.click(disclosure())
  expect(screen.getByRole('button', { name: /Канал команды/ })).toBeTruthy()
  fireEvent.click(disclosure())
  expect(row('Канал команды')).toBe(team)
  expect(row('Входящие Trinet')).toBe(inbox)
  expect(choices().map(control => control.checked)).toEqual([true, true, false, false, false, false])
  fireEvent.click(row('Электронная почта'))
  fireEvent.click(disclosure())
  expect(disclosure().textContent).toContain('Ещё 2 из 6')
  expect(screen.queryByRole('button', { name: /Канал команды/ })).toBeNull()
  fireEvent.click(disclosure())
  expect(choices().map(control => control.checked)).toEqual([true, true, true, false, false, false])
})

it('opens an empty selection from its prompt without selecting a channel', () => {
  render(<Delivery id="delivery" />)
  fireEvent.click(disclosure())
  fireEvent.click(row('Входящие Trinet'))
  fireEvent.click(disclosure())
  expect(choices()).toHaveLength(0)
  fireEvent.click(screen.getByRole('button', { name: 'Доставка выключена' }))
  expect(choices()).toHaveLength(6)
  expect(choices().every(control => !control.checked)).toBe(true)
  expect(document.activeElement).toBe(choices()[0])
})

it('reverses an unfinished collapse without moving the last selected row to the top', async () => {
  render(<Delivery id="delivery" />)
  fireEvent.click(disclosure())
  fireEvent.click(row('Канал команды'))
  let finish!: () => void
  const finished = new Promise<void>(resolve => { finish = resolve })
  const region = document.getElementById(disclosure().getAttribute('aria-controls')!)!
  Object.defineProperty(region, 'getAnimations', {
    value: () => [{ transitionProperty: 'grid-template-rows', finished }],
  })
  fireEvent.click(disclosure())
  fireEvent.click(disclosure())
  await act(async () => { finish(); await finished })
  expect(choices()[5].id).toBe('delivery-team')
  expect(choices()[5].checked).toBe(true)
})
