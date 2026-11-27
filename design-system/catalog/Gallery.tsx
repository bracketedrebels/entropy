import { memo, useState } from 'react'
import { Code, Intro, Icon } from './components'
import { CatalogSection } from './CatalogSection'
import { primitives } from './primitives'
import type { Primitive } from './primitives'

const Markup = memo(function Markup({ source }: { source: string }) {
  // Only bundled examples authored in this repository reach the preview.
  return <div className="demo-markup" dangerouslySetInnerHTML={{ __html: source }} />
})
function Card({ item, theme }: { item: Primitive; theme?: { index: number; select: (index: number) => void; grain: boolean; toggleGrain: () => void } }) {
  const [localIndex, setLocalIndex] = useState(0)
  const index = theme?.index ?? localIndex
  const setIndex = theme?.select ?? setLocalIndex
  const variant = item.variants?.[index], View = variant?.View
  const { Playground } = item
  const id = 'css/' + item.id
  return <CatalogSection className="sample-card" id={id} label={item.title} level={3}
    title={<a className="card-title" href={'#' + id}><Icon name={item.icon}/>{item.title}</a>}>
    <p className="card-summary">{item.summary}</p>
    {Playground ? <Playground /> : variant && <>
      <div className={'sample-stage stage-' + item.id}>
        {View ? <View key={index} /> : <Markup source={variant.preview ?? variant.source} />}
      </div>
      <div className="variants" aria-label={'Конфигурация ' + item.title}>{item.variants.map((v, i) =>
        <button type="button" className="neui-pill neui-ripple" aria-pressed={index === i} key={v.name} onClick={() => setIndex(i)}>{v.name}</button>)}
        {theme && <button type="button" className="neui-pill neui-ripple" aria-pressed={theme.grain} onClick={theme.toggleGrain}>Зерно страницы</button>}
      </div>
      <Code key={index} folded lang={View ? 'TSX' : 'HTML'} source={theme && !theme.grain ? variant.source.replace(' neui-grain', '') : variant.source} />
    </>}
  </CatalogSection>
}
export function Gallery({ light, onTheme }: { light: boolean; onTheme: (light: boolean) => void }) {
  const [grain, setGrain] = useState(() => document.documentElement.classList.contains('neui-grain'))
  function toggleGrain() {
    setGrain(document.documentElement.classList.toggle('neui-grain'))
  }
  return <>
    <Intro subtitle="Примитивы света, формы и движения. Собирайте интерфейс из классов Tailwind прямо в своей разметке.">
      <a href="#vite" className="setup-link neui-pill neui-ripple"><Icon name="code" />Подключение</a>
    </Intro>
    <section className="gallery" aria-label="Каталог композиций">
      <div className="section-title"><h2>Композиции</h2><span className="counter" aria-label="Количество примитивов">{primitives.length}</span></div>
      <div className="samples">{primitives.map(p=><Card item={p} key={p.id} theme={p.id === 'surface' ? { index: light ? 1 : 0, select: i => onTheme(i === 1), grain, toggleGrain } : undefined}/>)}</div>
    </section>
  </>
}
