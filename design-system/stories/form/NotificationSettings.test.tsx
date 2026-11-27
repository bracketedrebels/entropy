import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { NotificationSettings } from './NotificationSettings'

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
})
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals() })

const button = (name: string | RegExp) => screen.getByRole('button', { name })
const searchbox = (name: string) => screen.getByRole('searchbox', { name })
const type = (input: HTMLElement, value: string) => fireEvent.change(input, { target: { value } })
const payload = () => new FormData(document.querySelector('form')!)

it('admits only an active, valid delivery address while preserving the draft across hide and reload', () => {
  const first = render(<NotificationSettings />)
  expect(payload().has('emailAddress')).toBe(false)
  fireEvent.click(button(/Раскрыть каналы доставки/))
  const emailOption = screen.getByRole('checkbox', { name: /Электронная почта/ })
  fireEvent.click(emailOption)
  const email = screen.getByRole('textbox', { name: 'Адрес для сводки' })
  type(email, 'team@example.org')
  type(email, 'team@')
  fireEvent.blur(email)
  expect(email.getAttribute('aria-invalid')).toBe('true')
  expect(payload().get('emailAddress')).toBe('team@example.org')
  fireEvent.click(emailOption)
  expect(payload().has('emailAddress')).toBe(false)
  first.unmount()
  render(<NotificationSettings />)
  fireEvent.click(button(/Раскрыть каналы доставки/))
  fireEvent.click(screen.getByRole('checkbox', { name: /Электронная почта/ }))
  expect(screen.getByRole<HTMLInputElement>('textbox', { name: 'Адрес для сводки' }).value).toBe('team@')
  expect(payload().get('emailAddress')).toBe('team@example.org')
})

it('retains filtered selections and synchronizes priority, reset, undo and removal from the catalogue', () => {
  render(<NotificationSettings />)
  fireEvent.click(button('Выбрать первый проект'))
  const prioritySearch = searchbox('Поиск первого проекта')
  type(prioritySearch, 'ЯДРО импорт')
  fireEvent.click(screen.getByRole('radio', { name: 'Ядро · Импорт данных' }))
  expect(payload().getAll('primaryProject')).toEqual(['core-import'])
  expect(payload().getAll('projects')).toEqual(['core-import', 'trinet-design', 'entropy-automation'])
  type(prioritySearch, 'нет совпадения')
  expect(screen.getByText(/Совпадений нет/)).toBeTruthy()
  expect(payload().getAll('primaryProject')).toEqual(['core-import'])
  fireEvent.click(button(/Свернуть Первым/))
  const priority = within(screen.getByRole('group', { name: 'Первым в сводке' }))
  const selectedSummary = priority.getByRole('button', { name: 'Ядро · Импорт данных' })
  const reset = button('Сбросить первый проект')
  reset.focus()
  fireEvent.click(reset)
  expect(payload().get('primaryProject')).toBe('')
  expect(button('Выбрать первый проект')).toBe(selectedSummary)
  expect(document.activeElement).toBe(button('Вернуть первый проект'))
  fireEvent.click(button('Вернуть первый проект'))
  expect(priority.getByRole('button', { name: 'Ядро · Импорт данных' })).toBe(selectedSummary)
  expect(payload().get('primaryProject')).toBe('core-import')
  fireEvent.click(button(/Раскрыть Проекты/))
  const field = within(screen.getByRole('group', { name: 'Проекты в сводке' }))
  expect(field.getAllByRole('checkbox').length).toBeLessThan(40)
  type(searchbox('Поиск проектов'), 'импорт ядро')
  fireEvent.click(field.getByRole('checkbox', { name: 'Ядро · Импорт данных' }))
  expect(payload().getAll('projects')).toEqual(['trinet-design', 'entropy-automation'])
  expect(payload().get('primaryProject')).toBe('')
  fireEvent.click(button('Очистить поиск'))
  expect(document.activeElement).toBe(searchbox('Поиск проектов'))
})

it('recycles catalogue rows without starting a disclosure or moving the focused project', () => {
  render(<NotificationSettings />)
  const field = screen.getByRole('group', { name: 'Проекты в сводке' })
  const list = field.querySelector<HTMLElement>('.neui-catalog')!
  const ruler = list.querySelector<HTMLElement>('.neui-pitch')!
  let top = 0
  vi.spyOn(ruler, 'getBoundingClientRect').mockImplementation(() => new DOMRect(0, 0, 1, 64))
  vi.spyOn(list, 'getBoundingClientRect').mockImplementation(() => new DOMRect(0, top, 380, 144 * 64))
  vi.useFakeTimers()
  fireEvent.click(button(/Раскрыть Проекты/))
  const focused = within(field).getByRole('checkbox', { name: 'Trinet · Дизайн-система' })
  act(() => focused.focus())
  const firstSlot = focused.closest<HTMLElement>('.neui-catalog-row')!
  const height = list.style.getPropertyValue('--neui-catalog-rows')
  expect(height).toBe('144')
  const firstTop = firstSlot.style.top
  const project = (name: string) => within(field).queryByRole('checkbox', { name })
  for (const index of [130, 0, 130]) {
    top = -index * 64
    act(() => { fireEvent.scroll(window); vi.advanceTimersByTime(32) })
    expect(!!project('Ядро · Импорт данных')).toBe(index === 130)
    expect(document.activeElement).toBe(focused)
    expect(firstSlot.style.top).toBe(firstTop)
    expect(list.style.getPropertyValue('--neui-catalog-rows')).toBe(height)
    expect(list.querySelector('.neui-reveal')).toBeNull()
    expect(list.querySelectorAll('label').length).toBeLessThan(40)
  }
})

it('keeps native radio semantics, text limits and profile ownership after reload', () => {
  const story = render(<NotificationSettings />)
  expect(screen.getByRole<HTMLInputElement>('radio', { name: /По расписанию/ }).disabled).toBe(true)
  fireEvent.click(screen.getByRole('radio', { name: /Раз в неделю/ }))
  const subject = screen.getByRole<HTMLTextAreaElement>('textbox', { name: 'Тема сводки' })
  type(subject, 'я'.repeat(119))
  expect(subject.maxLength).toBe(120)
  expect(document.getElementById(subject.getAttribute('aria-describedby')!)?.textContent).toBe('Остался 1 символ')
  expect(screen.getByRole<HTMLTextAreaElement>('textbox', { name: 'Имя отправителя' }).readOnly).toBe(true)
  story.unmount()
  render(<NotificationSettings />)
  expect(payload().get('frequency')).toBe('weekly')
  expect(payload().get('subject')).toBe('я'.repeat(119))
})

it('restores a partial calendar, advances year → month → day, and round-trips reset and undo', () => {
  vi.setSystemTime(new Date(2026, 10, 25))
  const first = render(<NotificationSettings />)
  const group = () => within(screen.getByRole('group', { name: 'Дата первой сводки' }))
  fireEvent.click(group().getByRole('button', { name: 'Год, выбрать' }))
  fireEvent.click(group().getByRole('radio', { name: '2024' }))
  expect(payload().has('firstDigestDate')).toBe(false)
  expect(group().getByRole('button', { name: 'Месяц, выбрать' }).getAttribute('aria-expanded')).toBe('true')
  first.unmount()
  render(<NotificationSettings />)
  expect(group().getByRole('button', { name: 'Год, 2024' })).toBeTruthy()
  fireEvent.click(group().getByRole('button', { name: 'Месяц, выбрать' }))
  fireEvent.click(group().getByRole('radio', { name: /^февраль$/i }))
  fireEvent.click(group().getByRole('radio', { name: /29 февраля/ }))
  expect(payload().get('firstDigestDate')).toBe('2024-02-29')
  fireEvent.click(button('Свернуть календарь'))
  fireEvent.click(button('Сбросить дату'))
  expect(payload().has('firstDigestDate')).toBe(false)
  fireEvent.click(button('Вернуть дату'))
  expect(payload().get('firstDigestDate')).toBe('2024-02-29')
})


it('keeps the completed two-digit month when keyboard entry advances focus to the day', () => {
  render(<NotificationSettings />)
  const segment = (part: string) => button(new RegExp('^' + part + ','))
  const year = segment('Год')
  year.focus()
  for (const digit of '2024') fireEvent.keyDown(year, { key: digit })
  const month = segment('Месяц')
  expect(document.activeElement).toBe(month)
  for (const digit of '12') fireEvent.keyDown(month, { key: digit })
  const day = segment('День')
  expect(document.activeElement).toBe(day)
  for (const digit of '31') fireEvent.keyDown(day, { key: digit })
  expect(payload().get('firstDigestDate')).toBe('2024-12-31')
  fireEvent.keyDown(day, { key: 'Escape' })
  expect(day.getAttribute('aria-expanded')).toBe('false')
})


it('retains the visible calendar grid until its closing height transition finishes', async () => {
  render(<NotificationSettings />)
  fireEvent.click(button(/^Год,/))
  const grid = screen.getByRole('radiogroup', { name: /^Год,/ })
  const panel = grid.closest<HTMLElement>('.neui-collapse-block')!
  let finish!: () => void
  const finished = new Promise<void>(resolve => { finish = resolve })
  Object.defineProperty(panel, 'getAnimations', { value: () => [
    { transitionProperty: 'grid-template-rows', effect: { target: panel }, finished },
  ] })
  fireEvent.click(button('Свернуть календарь'))
  expect(panel.hasAttribute('inert')).toBe(true)
  expect(panel.contains(grid)).toBe(true)
  fireEvent.click(button(/^Год,/))
  await act(async () => { finish() })
  expect(panel.hasAttribute('inert')).toBe(false)
  expect(panel.contains(grid)).toBe(true)
  fireEvent.click(button('Свернуть календарь'))
  await act(async () => { await finished })
  expect(panel.isConnected).toBe(false)
})

it.each([
  ['Год, выбрать', '1996 – 2030', '1961 – 1995', -1],
  ['Месяц, выбрать', '2024', '2025', 1],
  ['День, выбрать', 'декабрь 2024', 'январь 2025', 1],
  ['Начало периода, Месяц, выбрать', '2024', '2023', -1],
  ['Конец периода, День, выбрать', 'декабрь 2024', 'ноябрь 2024', -1],
] as const)('slides real adjacent pages for %s and never changes the date by browsing', (segment, from, to, step) => {
  vi.setSystemTime(new Date(2024, 11, 12))
  const left = vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (this: HTMLElement) {
    return this.parentElement?.classList.contains('neui-calendar-pager') ? Array.from(this.parentElement.children).indexOf(this) * 320 : 0
  })
  const width = vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function (this: Element) {
    return this.classList.contains('neui-calendar-pager') ? 320 : 0
  })
  try {
    render(<NotificationSettings />)
    fireEvent.click(button(segment))
    const current = screen.getByRole('radiogroup', { name: new RegExp(from + '$') })
    const strip = current.parentElement!
    const adjacent = (step < 0 ? current.previousElementSibling : current.nextElementSibling) as HTMLElement
    expect(adjacent.getAttribute('aria-label')).toContain(to)
    function swipe(target: HTMLElement) {
      strip.scrollLeft = target.offsetLeft
      fireEvent.scroll(strip)
      fireEvent(strip, new Event('scrollend'))
      expect(strip.querySelector('[data-current="true"]')).toBe(target)
      expect(strip.childElementCount).toBe(3)
      expect(strip.scrollLeft).toBe(target.offsetLeft)
    }
    strip.scrollLeft += step * 160
    fireEvent.scroll(strip)
    expect(current.dataset.current).toBe('true')
    swipe(adjacent)
    swipe(current)
    expect(payload().has('firstDigestDate')).toBe(false)
    expect(payload().has('digestPeriod.start')).toBe(false)
  } finally { left.mockRestore(); width.mockRestore() }
})

it('keeps new tags first, restores drafts, deletes with a separate keypress, and undoes in place', () => {
  let form = render(<NotificationSettings />)
  const input = () => screen.getByRole<HTMLInputElement>('textbox', { name: 'Теги сводки' })
  type(input(), '  обзор  ')
  fireEvent.keyDown(input(), { key: 'Enter' })
  type(input(), 'обзор')
  fireEvent.keyDown(input(), { key: 'Enter' })
  const tags = () => payload().getAll('tags')
  expect(tags()).toEqual(['обзор', 'potential', 'frequently_used'])
  type(input(), 'черновик')
  form.unmount()
  form = render(<NotificationSettings />)
  expect(input().value).toBe('черновик')
  expect(tags()[0]).toBe('обзор')
  input().setSelectionRange(0, 0)
  fireEvent.keyDown(input(), { key: 'Backspace' })
  expect(document.activeElement).toBe(button('обзор'))
  fireEvent.keyDown(button('обзор'), { key: 'Backspace' })
  expect(tags()).toEqual(['potential', 'frequently_used'])
  expect(document.activeElement).toBe(button('potential'))
  fireEvent.click(button('Вернуть удалённый тег'))
  expect(tags()).toEqual(['обзор', 'potential', 'frequently_used'])
  fireEvent.click(button('potential'))
  fireEvent.click(button('Удалить тег «potential»'))
  expect(tags()).toEqual(['обзор', 'frequently_used'])
  fireEvent.click(button('Вернуть удалённый тег'))
  expect(tags()).toEqual(['обзор', 'potential', 'frequently_used'])
  form.unmount()
})

it('keeps the outgoing tag and undo slot until their own transitions finish', async () => {
  render(<NotificationSettings />)
  const tag = button('frequently_used')
  const row = tag.closest('li')!

  function holdTransition(target: Element) {
    let finish!: () => void
    const finished = new Promise<void>(resolve => { finish = resolve })
    Object.defineProperty(target, 'getAnimations', { value: () => [{
      transitionProperty: 'grid-template-rows', effect: { target }, finished,
    }] })
    return () => act(async () => finish())
  }

  const finishRow = holdTransition(row)
  fireEvent.click(tag)
  fireEvent.click(button('Удалить тег «frequently_used»'))
  expect(row.dataset.leaving).toBe('true')
  expect(tag.isConnected).toBe(true)
  expect(payload().getAll('tags')).not.toContain('frequently_used')
  const undo = button('Вернуть удалённый тег')
  const footer = undo.closest<HTMLElement>('[slot="meta"]')!
  const finishFooter = holdTransition(footer)
  fireEvent.click(undo)
  expect(footer.dataset.leaving).toBe('true')
  expect(undo.isConnected).toBe(true)
  expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Теги сводки' }))
  expect(button('frequently_used')).toBe(tag)
  await finishRow()
  await finishFooter()
  expect(tag.isConnected).toBe(true)
  expect(undo.isConnected).toBe(false)
})

it('moves, deletes and restores individual occurrences; the route round-trips as an ordered array', () => {
  const story = render(<NotificationSettings />)
  const row = (position: number, label: string) => button(position + '. ' + label)
  const route = () => payload().getAll('retryRoute')
  expect(route()).toEqual(['mobile', 'email', 'mobile'])
  fireEvent.click(row(3, 'Уведомления телефона'))
  fireEvent.click(button('Вверх'))
  expect(route()).toEqual(['mobile', 'mobile', 'email'])
  expect(document.activeElement).toBe(row(2, 'Уведомления телефона'))
  fireEvent.click(button('Удалить попытку 2'))
  expect(route()).toEqual(['mobile', 'email'])
  fireEvent.click(button('Вернуть шаг'))
  expect(route()).toEqual(['mobile', 'mobile', 'email'])
  fireEvent.click(row(1, 'Уведомления телефона'))
  expect(screen.queryByRole('button', { name: 'Заменить' })).toBeNull()
  fireEvent.keyDown(row(1, 'Уведомления телефона'), { key: 'Delete' })
  expect(route()).toEqual(['mobile', 'email'])
  fireEvent.click(button('Добавить шаг'))
  fireEvent.click(button('Электронная почта'))
  fireEvent.click(button('Электронная почта'))
  expect(route()).toEqual(['mobile', 'email', 'email', 'email'])
  story.unmount()
  render(<NotificationSettings />)
  expect(route()).toEqual(['mobile', 'email', 'email', 'email'])
})

it('keeps the numeric draft free while only applying permitted intervals, including across reload', () => {
  const first = render(<NotificationSettings />)
  const editor = () => screen.getByRole<HTMLInputElement>('textbox', { name: 'Интервал между попытками' })
  const value = () => payload().get('retryMinutes')
  type(editor(), '12')
  expect(value()).toBe('12')
  for (const draft of ['13', '32', '-', '', '1,']) {
    type(editor(), draft)
    expect(editor().value).toBe(draft)
    expect(value()).toBe('12')
    expect(editor().getAttribute('aria-invalid')).toBe('true')
  }
  first.unmount()
  render(<NotificationSettings />)
  expect(editor().value).toBe('1,')
  expect(screen.queryByRole('slider')).toBeNull()
  act(() => editor().focus())
  const scale = screen.getByRole<HTMLInputElement>('slider', { name: 'Интервал по шкале, минуты' })
  expect([scale.min, scale.max, scale.step, scale.value]).toEqual(['2', '30', '2', '12'])
  type(scale, '24')
  expect([editor().value, value()]).toEqual(['24', '24'])
  expect(editor().getAttribute('aria-invalid')).toBe('false')
  const collapse = button('Свернуть шкалу')
  fireEvent.click(collapse)
  expect(collapse.isConnected).toBe(false)
  expect(document.activeElement).toBe(editor())
  expect(screen.queryByRole('slider')).toBeNull()
  fireEvent.click(editor())
  expect(button('Свернуть шкалу')).toBeTruthy()
  expect(screen.getByRole('slider')).toBeTruthy()
  fireEvent.keyDown(editor(), { key: 'Escape' })
  expect(screen.queryByRole('slider')).toBeNull()
})

it('picks a period across years, restores a single bound and resets or restores both together', () => {
  vi.setSystemTime(new Date(2024, 11, 1))
  const first = render(<NotificationSettings />)
  const field = () => within(screen.getByRole('group', { name: 'Период событий' }))
  const click = (role: 'button' | 'radio', name: string | RegExp) => fireEvent.click(field().getByRole(role, { name }))
  click('button', 'Начало периода, День, выбрать')
  click('radio', /31 декабря/)
  expect(field().getByRole('button', { name: 'Конец периода, День, выбрать' }).getAttribute('aria-expanded')).toBe('true')
  expect(field().getByRole<HTMLButtonElement>('radio', { name: /30 декабря/ }).disabled).toBe(true)
  expect(payload().has('digestPeriod.start')).toBe(false)
  first.unmount()
  render(<NotificationSettings />)
  click('button', 'Конец периода, День, выбрать')
  click('button', 'Следующий месяц')
  click('radio', /, 2 января/)
  expect(payload().get('digestPeriod.start')).toBe('2024-12-31')
  expect(payload().get('digestPeriod.end')).toBe('2025-01-02')
  expect(field().getByRole('radio', { name: /, 1 января/ }).dataset.inRange).toBe('true')
  expect(field().getByRole('radio', { name: /, 2 января.*конец периода/ }).dataset.bandEnd).toBe('true')
  fireEvent.click(button('Свернуть календарь периода'))
  fireEvent.click(button('Сбросить период'))
  expect(payload().has('digestPeriod.end')).toBe(false)
  fireEvent.click(button('Вернуть период'))
  expect(payload().get('digestPeriod.end')).toBe('2025-01-02')
  click('button', 'Начало периода, Год, 2024')
  click('radio', '2024')
  click('radio', /^февраль$/i)
  click('radio', /29 февраля/)
  expect(payload().get('digestPeriod.start')).toBe('2024-02-29')
  expect(payload().get('digestPeriod.end')).toBe('2025-01-02')
})

it('lets the end be chosen first and accepts both bounds on the same leap day', () => {
  vi.setSystemTime(new Date(2024, 1, 1))
  render(<NotificationSettings />)
  fireEvent.click(button('Конец периода, День, выбрать'))
  const field = within(screen.getByRole('group', { name: 'Период событий' }))
  fireEvent.click(field.getByRole('radio', { name: /29 февраля/ }))
  expect(button('Начало периода, День, выбрать').getAttribute('aria-expanded')).toBe('true')
  const segment = button('Начало периода, День, выбрать')
  for (const digit of '29') fireEvent.keyDown(segment, { key: digit })
  expect(payload().get('digestPeriod.start')).toBe('2024-02-29')
  expect(payload().get('digestPeriod.end')).toBe('2024-02-29')
  expect(field.getByRole('radio', { name: /29 февраля.*начало периода.*конец периода/ }).dataset.inRange).toBe('true')
})
