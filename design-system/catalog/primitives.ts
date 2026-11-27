import type { ComponentType } from 'react'
import CollapseBlock from './examples/CollapseBlock'
import block from './examples/CollapseBlock.tsx?raw'
import CollapseInline from './examples/CollapseInline'
import inline from './examples/CollapseInline.tsx?raw'

import Relief from './examples/Relief'
import Ridge from './examples/Ridge'
import Swipe from './examples/Swipe'
import swipe from './examples/Swipe.tsx?raw'

export interface Variant { name: string; source: string; preview?: string; View?: ComponentType }
export type Primitive = {
  id: string; title: string; family: string; icon: string; summary: string; keywords?: string[]
} & ({ variants: Variant[]; Playground?: never } | { Playground: ComponentType; variants?: never })
const html = (name: string, source: string): Variant => ({ name, source })
function radio(group: string, text: string, selected: boolean) {
  return `<label class="neui-row neui-ripple cursor-pointer">
  <input type="radio" name="${group}"${selected ? ' checked' : ''}
    class="neui-row-area-leading neui-check-radio appearance-none m-0 checked:[--neui-check-level:1]">
  <span class="neui-row-area-content">${text}</span>
</label>`
}
function wave(name: string, duration: string, preview = false) {
  return html(name, `<button type="button" class="neui-ripple ${duration} ease-out
  w-full min-h-24 rounded-3xl border-0 bg-transparent text-ink cursor-pointer"${preview ? ' style="--neui-ripple-progress:.21"' : ''}>
  Нажмите на поверхность
</button>`)
}
function marks(name: string, shape: string, color = '') {
  const lights = ['0', '0.5', '1', '2'].map(n => `  <div class="grid justify-items-center gap-4">
    <i aria-hidden="true" class="${shape}${color}" style="--neui-check-level:${n}"></i>
    <span class="font-mono text-xs text-muted">${n}</span>
  </div>`)
  return html(name, '<div class="flex justify-around items-center w-full">\n' + lights.join('\n') + '\n</div>')
}
function input(name: string, effects: string, label: string) {
  return html(name, `<label class="neui-row ${effects}">
  <i aria-hidden="true" class="neuicon-pencil neui-row-area-leading place-self-center"></i>
  <input aria-label="${label}" placeholder="${label}"
    class="neui-row-area-content w-full border-0 bg-transparent text-ink">
</label>`)
}
function range(name: string, step: number, ticks: number) {
  return html(name, `<label class="block w-full">Мощность сигнала
  <input type="range" class="neui-range" min="0" max="100" step="${step}" value="50">
  <span class="neui-range-ticks" aria-hidden="true">${'<i></i>'.repeat(ticks)}</span>
</label>`)
}
function swatches(name: string, theme: string) {
  const preview = `<div class="flex items-center justify-around gap-3">
  <span class="text-ink">Текст</span>
  <span class="text-muted">Подпись</span>
  <span class="neui-check-radio [--neui-check-level:1]" aria-label="Индикатор" role="img"></span>
</div>`
  return { name, preview, source: `<html class="neui-surface neui-grain" data-theme="${theme}">
  <body>
${preview.split('\n').map(line => '    ' + line).join('\n')}
  </body>
</html>` }
}
function iconPair(name: string, pair: string) {
  return html(name, `<label class="flex items-center justify-center gap-4 cursor-pointer">
  <input type="checkbox" class="peer">
  <span class="neuicon-transition ${pair} text-2xl duration-500
    peer-checked:[--neuicon-progress:1]" aria-hidden="true"></span>
  Сменить знак
</label>`)
}
const selection = 'Выбор', layout = 'Раскладка', motion = 'Движение', material = 'Поверхность'
export const primitives: Primitive[] = [
  { id: 'ridge', title: 'Ridge', icon: 'layers', family: material, summary: 'Жёлоб объединяет строки и показывает положение фокуса.',
    keywords: ['свет', 'ореол', 'глубина', 'neui-focus-strength', 'neui-ridge-depth', 'neui-track-focus', 'neui-ridge-radius', 'neui-ridge-inset'], Playground: Ridge },
  { id: 'relief', title: 'Relief', icon: 'layers', family: material,
    summary: 'У поднятой плитки середина вогнута, у утопленной — выпукла.',
    keywords: ['рельеф', 'экструзия', 'интрузия', 'углубление', 'neui-extruded', 'neui-intruded', 'neui-depth', 'squircle'], Playground: Relief },
  { id: 'ripple', title: 'Ripple', icon: 'wave', family: motion, summary: 'Волна расходится от точки касания.', variants: [
    wave('800 мс', 'duration-800'), wave('500 мс', 'duration-500'), wave('1500 мс', 'duration-1500'), wave('Срез', 'duration-800', true),
  ] },
  { id: 'check', title: 'Check', icon: 'marker', family: selection, summary: 'Форма и яркость индикатора выбора.', variants: [
    marks('Круг', 'neui-check-radio'), marks('Квадрат', 'neui-check-box'), marks('Акцент', 'neui-check-radio', ' text-brand'),
  ] },
  { id: 'row', title: 'Row', icon: 'grid', family: layout, summary: 'Три именованные области для одной строки.', variants: [
    html('С подписью', `<div class="neui-row">
  <i aria-hidden="true" class="neuicon-mail neui-row-area-leading place-self-center"></i>
  <span class="neui-row-area-content">Почта<small class="block text-muted">Рабочий адрес</small></span>
  <kbd class="neui-row-area-trailing text-muted">↵</kbd>
</div>`),
    html('С выбором', radio('atlas-row', 'Уведомления', true)),
  ] },
  { id: 'focus', title: 'Focus', icon: 'lamp', family: motion, summary: 'Тон поверхности следует за фокусом.', variants: [
    input('Тон', 'neui-focus', 'Название проекта'), input('Тон и волна', 'neui-focus neui-ripple duration-500', 'Введите название'),
  ] },
  { id: 'pill', title: 'Pill', icon: 'tag', family: layout, summary: 'Счётчик, метка или действие поля.', variants: [
    html('Счётчик', '<output class="neui-pill">Выбрано 3 из 12</output>'),
    html('Действие', `<details>
  <summary class="neui-pill cursor-pointer">Подробности</summary>
  <p class="text-sm text-muted">Сводка отправляется по будням.</p>
</details>`),
    html('Состояние', '<span class="neui-pill"><i aria-hidden="true" class="neuicon-tick mr-2"></i>Сохранено</span>'),
  ] },
  { id: 'icon', title: 'NEUIcon', icon: 'star', family: motion, summary: 'SVG-маска и переход между двумя знаками.', variants: [
    iconPair('Морфинг', 'neuicon-from-tag neuicon-to-trash'), iconPair('Растворение', 'neuicon-from-star neuicon-to-person'),
    html('До текста', '<span class="flex items-center gap-3 before:neuicon-calendar before:text-accent">Дата встречи</span>'),
  ] },
  { id: 'collapse', title: 'Collapse', icon: 'expand', family: motion, summary: 'Раскрытие в потоке по одной из двух осей.', variants: [
    { name: 'По вертикали', source: block, View: CollapseBlock }, { name: 'По горизонтали', source: inline, View: CollapseInline },
  ] },
  { id: 'range', title: 'Range', icon: 'sliders', family: selection, summary: 'Жёлоб шкалы, шаг и независимые засечки.', variants: [
    range('Шаг 25', 25, 5), range('Шаг 10', 10, 11), range('Плавно', 1, 2),
  ] },
  { id: 'surface', title: 'Surface', icon: 'moon', family: material, summary: 'Переключите тему всей страницы, чтобы сравнить материал и свет.', variants: [
    swatches('Графит', 'dark'), swatches('Светлая', 'light'),
  ] },
  { id: 'calendar-grid', title: 'Calendar grid', icon: 'calendar', family: layout, summary: 'Число колонок определяется единицей даты.', variants: [
    html('Неделя', `<div class="neui-calendar-grid neui-calendar-days gap-1 text-center">
${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => '  <span>'+d+'</span>').join('\n')}
</div>`),
    html('Месяцы', `<div class="neui-calendar-grid neui-calendar-months gap-3 text-center">
${['Янв','Фев','Мар','Апр','Май','Июн'].map(d => '  <span>'+d+'</span>').join('\n')}
</div>`),
  ] },
  { id: 'swipe', title: 'Swipe', icon: 'tag', family: motion, summary: 'Свайп вправо раскрывает действие строки.', variants: [
    { name: 'Действие', source: swipe, View: Swipe },
    html('Прогресс ½', `<div class="neui-swipe-right" style="--neui-swipe-progress:.5; --neui-swipe-travel:88px">
  <div class="neui-swipe-content neui-row"><span class="neui-row-area-content">Новое письмо</span></div>
  <span class="neui-swipe-action" aria-hidden="true">Прочитать</span>
</div>`),
  ] },
  { id: 'divider', title: 'Divider', icon: 'layers', family: layout, summary: 'Короткая бороздка разделяет группы строк.', variants: [
    html('Четверть', '<div class="w-full text-center text-sm text-muted">Выбранные каналы<hr class="neui-divider">Другие каналы</div>'),
    html('Половина', '<hr class="neui-divider [--neui-divider-size:50%]">'),
  ] },
]
