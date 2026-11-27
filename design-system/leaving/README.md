# @neui-tools/leaving

Анимируйте размонтирование нативных элементов React средствами Tailwind CSS 4. Плагин Vite находит JSX с вариантом `leaving:` и удерживает соответствующий DOM-узел до завершения его CSS-переходов. Разметка и состояние принадлежат приложению.

## Подключение

В приложении с React, Vite 7 и Tailwind CSS 4 установите пакет.

```sh
npm install @neui-tools/leaving
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { neuiLeaving } from '@neui-tools/leaving/vite'

export default defineConfig({
  plugins: [tailwindcss(), neuiLeaving()],
  esbuild: { jsx: 'automatic' },
})
```

```css
/* app.css */
@import "tailwindcss";
@import "@neui-tools/leaving/tailwind.css";
```

```tsx
export function Notice({ open }: { open: boolean }) {
  return <section>
    {open && <p className="transition-opacity duration-200 starting:opacity-0 leaving:opacity-0 motion-reduce:transition-none">
      Изменения сохранены
    </p>}
  </section>
}
```

## Композиция

Для вертикального или горизонтального раскрытия используйте `neui-collapse-block` и `neui-collapse-inline` с одним дочерним контейнером. Скорость задаётся классами Tailwind. Чтобы свернуть содержимое до нуля, разрешите дочернему контейнеру сжиматься, например с помощью `min-h-0 overflow-clip` для вертикального раскрытия.

```tsx
{open && <div className="neui-collapse-block duration-300">
  <div className="min-h-0 overflow-clip">{children}</div>
</div>}
```

Плагин распознаёт условия с `&&`, тернарные выражения и прямой `.map()` со стабильным `key`. Поместите статический маркер класса на корневой HTML-элемент внутри JSX или в возвращаемое значение именованного React-компонента. Классы, определённые через цепочки `@apply`, также поддерживаются. Список сканируемых таблиц стилей можно сузить через `neuiLeaving({ styles: ['src/app.css'] })`. При использовании полного `neui()` обработка уже включена.

Во время ухода элемент получает `data-leaving="true"`, `inert` и `aria-hidden`. Повторное появление того же ключа отменяет удаление. Когда у самого элемента нет активных CSS-переходов, он удаляется сразу. Черновик, который нужен при следующем открытии, храните в состоянии приложения.
