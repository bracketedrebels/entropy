# NEUIcon

Одноцветные SVG-маски и обратимые переходы для Tailwind 4. Пакет подключается независимо от NEUI и React. Vite готовит CSS при сборке и при запуске dev-сервера.

## Подключение

```ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { neuicon } from '@neui/icon/vite'

export default defineConfig({ plugins: [neuicon({ frames: 60 }), tailwindcss()] })
```

В основном CSS-файле, который обрабатывает Tailwind, подключите утилиты одной директивой:

```css
@import "tailwindcss";
@neuicon;
```

Для сборки напрямую через Tailwind вместо адаптера Vite можно подключить стандартный каталог через `@plugin "@neui/icon/tailwind";`. Собственный каталог подключается через локальный модуль, экспортирующий результат `neuiconTailwind(options)` из той же точки входа.

## На элементе и на псевдоэлементе

`neuicon-search` задаёт маску размером `1em`. Она наследует цвет текста, а `bg-*` задаёт отдельный цвет. Для перехода укажите на одной области три класса. Те же классы принимают `before:` и `after:`. Обе стороны одного элемента могут показывать разные пары. Доступное имя действия задаёт кнопка.

```html
<button class="inline-flex items-center gap-2 before:neuicon-search">Найти</button>

<button class="inline-flex items-center gap-2
  before:neuicon-transition before:neuicon-from-tag before:neuicon-to-trash
  before:duration-500 hover:before:[--neuicon-progress:1] focus-visible:before:[--neuicon-progress:1]">
  Удалить тег
</button>
```

`--neuicon-progress` принимает число от 0 до 1 и наследуется. Его можно задать на самом псевдоэлементе или на родителе. Для переключения подходят `duration-*` и `ease-*`, для прямого управления свайпом — `duration-0` на области иконки. При уменьшенном движении в настройках системы состояние переключается сразу.

## Кадры и собственные переходы

```ts
import { neuicon } from '@neui/icon/vite'
import { icons, drawFold, drawOpen } from './glyphs'

const iconPlugin = neuicon({
  icons,
  frames: 60,
  pairs: [
    { from: 'sheet', to: 'folded-sheet', draw: drawFold },
    { from: 'lock', to: 'open-lock', frames: 120, draw: drawOpen },
  ],
})
```

`frames` — полное число положений в SVG-атласе, включая начало и конец. При `frames: 120` сборщик вызывает `draw(i / 119)` ровно 120 раз. Минимум — 2, по умолчанию — 49. Значение у пары имеет приоритет. Обратный переход читает те же положения с конца. Количество кадров определяет детализацию формы, длительность перехода задаётся в CSS.

`icons` сопоставляет именам полные SVG-изображения. `draw(progress)` возвращает внутреннюю SVG-разметку в квадратном `viewBox` со стороной `size` (по умолчанию 24). Крайние положения должны совпадать с иконками пары. Встроенные иконки и пары доступны через `import { catalog } from '@neui/icon/catalog'` для расширения в проекте.

У произвольной пары обе маски рисуются слоями на одной области. Для каждого глифа сборщик готовит одну переиспользуемую шкалу растворения с 49 положениями. В крайних положениях глифы чёткие, в середине смешиваются размытые силуэты. Добавление партнёра не требует отдельной анимации для сочетания. У зарегистрированной пары на той же области остаётся один слой с её геометрией. Выбор задают CSS-переменные из классов `from` и `to`. Клиент управляет только прогрессом.
