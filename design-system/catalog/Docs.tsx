import { Code, Intro, Icon } from './components'

const viteConfig = `import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { neui } from '@neui/kit/vite'
import { neuicon } from '@neui/icon/vite'

export default defineConfig({
  plugins: [neuicon(), tailwindcss(), neui()],
})`
const mainCss = `@import "tailwindcss";
@import "@neui/kit/tailwind.css";

@neuicon;`
const entry = `neui({
  clientEntry: 'src/entry-client.tsx',
  leaving: true,
  leavingStyles: ['src/**/*.css', 'themes/**/*.css'],
})`
const pair = `import { neuicon } from '@neui/icon/vite'
import { catalog } from '@neui/icon/catalog'

const svg = (r: number) =>
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
  '<circle cx="12" cy="12" r="' + r + '"/></svg>'

neuicon({
  icons: { ...catalog.icons, seed: svg(3), disc: svg(9) },
  frames: 49,
  pairs: [...catalog.pairs, {
    from: 'seed', to: 'disc', size: 24, frames: 25,
    draw: p => '<circle cx="12" cy="12" r="' + (3 + 6 * p) + '"/>',
  }],
})`
const hookExample = `import { prepareBehavior } from '@neui/kit/react'

const useMeasure = prepareBehavior<HTMLElement>(node => {
  const observer = new ResizeObserver(([entry]) => {
    node.style.setProperty('--field-width', entry.contentRect.width + 'px')
  })
  observer.observe(node)
  return () => observer.disconnect()
})

export function Field() {
  const ref = useMeasure()
  return <section ref={ref} className="neui-ridge neui-track-focus">
    <h2 slot="label">Параметры</h2>
  </section>
}`
function Options({rows}:{rows:string[][]}) {
  return <div className="table-wrap"><table className="api-table"><thead><tr><th>Параметр</th><th>По умолчанию</th><th>Назначение</th></tr></thead>
    <tbody>{rows.map(([k,v,n])=><tr key={k}><th scope="row"><code>{k}</code></th><td><code>{v}</code></td><td>{n}</td></tr>)}</tbody></table></div>
}
const pages = [
  ['setup','Подключение','code'], ['client','Поведение и leaving','layers'], ['icons','Плагин иконок','star'],
] as const
export function ViteDocs({detail}: {detail?:string}) {
  const id = pages.some(p=>p[0]===detail) ? detail : 'setup'
  return <><Intro subtitle="Подключите поведение NEUI, компиляцию классов Tailwind и нужные вашему проекту иконки." />
    <div className="doc-layout"><nav className="side-index" aria-label="Разделы Vite API">{pages.map(([key,name,icon])=>
      <a className="neui-pill neui-ripple" href={'#vite/'+key} key={key} aria-current={key===id?'page':undefined}><Icon name={icon}/>{name}</a>)}</nav>
    <article className="doc-body">{id==='setup'?<>
      <h2>Подключение</h2><p>В этом каталоге три плагина работают в одной сборке Vite. Эту конфигурацию можно использовать с пакетами рабочего пространства NEUI.</p>
      <Code source={viteConfig} filename="vite.config.ts"/><Code source={mainCss} filename="src/app.css"/>
      <h3>Из чего складывается сборка</h3>
      <dl className="definition-list">
        <dt>neui()</dt><dd>Подключает обработчики Ripple, Ridge и Swipe к клиентской точке входа. Включает JSX-трансформацию neuiLeaving() по умолчанию.</dd>
        <dt>tailwindcss()</dt><dd>Собирает классы и варианты, которые встретились в исходниках приложения.</dd>
        <dt>neuicon()</dt><dd>Отдельный плагин, который можно подключить для SVG-масок и переходов. Его первый проход раскрывает @neuicon, второй упаковывает слои переходов после Tailwind.</dd>
      </dl>
    </>:id==='client'?<>
      <h2>Поведение и leaving</h2><p>В клиентском приложении достаточно вызвать <code>neui()</code>. Для HTML с сервера укажите собственную клиентскую точку входа.</p>
      <Code source={entry} lang="TS"/>
      <Options rows={[
        ['clientEntry','HTML Vite','Путь от Vite root к клиентскому модулю JS, TS, JSX или TSX. Без параметра импорты добавляются в HTML.'],
        ['leaving','true','Удерживает уходящий узел до окончания перехода в распознанных JSX-условиях и списках с ключами.'],
        ['leavingStyles',"['**/*.css']", 'Шаблоны путей для поиска CSS-классов, включающих leaving через @apply.'],
      ]}/>
      <h3>Только уход элемента</h3><p>Если нужен только трансформер, его можно подключить отдельно. При использовании обычного neui() он уже включён.</p>
      <Code source={"import { neuiLeaving } from '@neui/kit/vite'\n\nexport default { plugins: [neuiLeaving({ styles: ['src/**/*.css'] })] }"} lang="TS"/>
      <p>Маркер ставится на корневой DOM-элемент условного выражения или элемента списка со стабильным key. Приложение хранит черновик ввода, если он должен пережить размонтирование.</p>
    </>:<>
      <h2>Иконки и переходы</h2><p>Класс выбирает маску, currentColor задаёт цвет. Между произвольными знаками доступно растворение, а зарегистрированная пара получает собственное движение.</p>
      <Options rows={[
        ['icons','catalog.icons','Словарь имя → SVG. Чтобы расширить встроенный набор, добавьте его через spread.'],
        ['pairs','catalog.pairs¹','Массив переходов. from и to указывают имена из icons, draw(progress) возвращает SVG-содержимое одного кадра. Обратное направление генерируется автоматически.'],
        ['frames','49','Количество кадров, включая края. Целое от 2. У пары можно переопределить frames и размер её viewBox (size, по умолчанию 24).'],
      ]}/>
      <p>¹ При передаче собственного словаря icons начальный список пар пуст. В примере сохранены встроенные иконки и переходы.</p>
      <Code source={pair} filename="icons.ts"/>
      <Code source={'<span class="neuicon-transition neuicon-from-seed neuicon-to-disc\n  duration-500 hover:[--neuicon-progress:1]" aria-hidden="true"></span>'} lang="HTML"/>
    </>}</article></div></>
}
export function ReactDocs() {
  return <><Intro subtitle="Поведение подключается к вашей разметке через ref. Состояние, семантика и дерево элементов остаются у приложения."/>
    <article className="doc-body single-doc"><h2>prepareBehavior</h2>
      <p>Подготовьте хук один раз на уровне модуля. Каждый вызов хука даёт отдельный callback ref. При замене элемента или размонтировании он вызывает функцию очистки.</p>
      <Code source={hookExample} filename="Field.tsx"/>
      <h3>Хуки в рецептах</h3><p>Сегодня в <code>@neui/kit/react</code> уже есть <code>useCalendar</code>, <code>useCalendarGrid</code> и <code>useCalendarRange</code>. Их можно изучить в исходниках рецептов. Полный справочник фабрик оставлен на следующую итерацию.</p>
      <a className="setup-link" href="#recipes/period">Открыть диапазон дат <span aria-hidden="true">→</span></a>
    </article></>
}
const principles = [
  ['layers','Поверхность и свет','Жёлоб очерчивает поле и держит его края при прокрутке. В графитовой теме направленный свет подчёркивает рельеф, в светлой фокус даёт короткий медный акцент.'],
  ['wave','Три сигнала взаимодействия','Ripple отвечает на касание. Focus меняет тон активной поверхности. Точка или квадрат сохраняет состояние выбора после того, как волна ушла. Каждый эффект подключается отдельно.'],
  ['expand','Раскрытие в потоке','Ассистент занимает место под своим полем и сдвигает соседей. У длинного списка остаётся общий скролл. Выбранные строки видны и в свёрнутом поле.'],
  ['tag','Мета-действия в пределах поля','Счётчик, сброс и возврат группируются у правого нижнего края. Когда в строке значения достаточно места, действие может стать рядом с датой или числом.'],
  ['grid','Ритм строки','У метки, текста и действия есть общие оси. Строки сохраняют выравнивание при переносе текста. В навигации один и тот же отступ в 11 px виден между соседними кнопками и от края кнопки до жёлоба.'],
  ['code','Разметка принадлежит автору','Нативный элемент задаёт смысл и клавиатурное поведение. Классы добавляют материал и взаимодействие. Рецепт можно скопировать и адаптировать под свою задачу.'],
] as const
export function Philosophy() {
  return <><Intro subtitle="Neo + UI отсылает к неоморфизму. По-русски название звучит как «не UI» и ставит в центр то, как интерфейс ощущается в работе."/>
    <section className="principles" aria-label="Принципы системы">{principles.map(([i,t,s])=><article key={t}><div className="card-glyph"><Icon name={i}/></div><h2>{t}</h2><p>{s}</p></article>)}</section>
    <div className="tradeoffs"><section><h2>Что даёт такой подход</h2><p>Один набор классов подходит для обычного HTML и JSX. Разработчик может заменить семантику, источник данных или способ валидации, сохранив знакомые жесты и визуальный ритм.</p></section>
    <section><h2>Цена гибкости</h2><p>Автор рецепта отвечает за доступное имя, фокус, клавиатуру и ошибки. Большие списки требуют виртуализации, а раскрытие в потоке двигает соседей. Для анимации ухода трансформеру нужен статически распознаваемый JSX-маркер.</p></section></div></>
}
