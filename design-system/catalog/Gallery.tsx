import { memo, useEffect, useState } from 'react'
import { Code, Intro, Icon } from './components'
import { primitives } from './primitives'
import type { Primitive } from './primitives'

const Markup = memo(function Markup({ source }: { source: string }) {
  // Only bundled examples authored in this repository reach the preview.
  return <div className="demo-markup" dangerouslySetInnerHTML={{ __html: source }} />
})
function Card({ item, theme }: { item: Primitive; theme?: { index: number; select: (index: number) => void } }) {
  const [localIndex, setLocalIndex] = useState(0)
  const index = theme?.index ?? localIndex
  const setIndex = theme?.select ?? setLocalIndex
  const variant = item.variants?.[index], View = variant?.View
  const { Playground } = item
  return <article className="sample-card" id={'sample-' + item.id}>
    <div className="card-head"><div className="card-title"><span className="card-glyph"><Icon name={item.icon} /></span><h3><a href={'#css/' + item.id}>{item.title}</a></h3></div>
      <p>{item.summary}</p></div>
    {Playground ? <Playground /> : variant && <>
      <div className={'sample-stage stage-' + item.id}>
        {View ? <View key={index} /> : <Markup source={variant.preview ?? variant.source} />}
      </div>
      <div className="variants" aria-label={'Конфигурация ' + item.title}>{item.variants.map((v, i) =>
        <button type="button" className="neui-pill neui-ripple" aria-pressed={index === i} key={v.name} onClick={() => setIndex(i)}>{v.name}</button>)}</div>
      <Code key={index} folded lang={View ? 'TSX' : 'HTML'} source={variant.source} />
    </>}
  </article>
}
export function Gallery({ detail, light, onTheme }: { detail?: string; light: boolean; onTheme: (light: boolean) => void }) {
  const [family, setFamily] = useState('Все'), [query, setQuery] = useState('')
  useEffect(() => {
    if (!detail) return
    setFamily('Все'); setQuery('')
    const frame = requestAnimationFrame(() => document.getElementById('sample-' + detail)?.scrollIntoView({block:'start'}))
    return () => cancelAnimationFrame(frame)
  }, [detail])
  const visible = primitives.filter(p => (family === 'Все' || p.family === family) &&
    [p.title, p.summary, 'neui-' + p.id, p.family, ...(p.keywords ?? []), ...(p.variants ?? []).map(v => v.source)].join(' ').toLowerCase().includes(query.trim().toLowerCase()))
  return <>
    <Intro subtitle="Примитивы света, формы и движения. Собирайте интерфейс из классов Tailwind прямо в своей разметке.">
      <a href="#vite" className="setup-link neui-pill neui-ripple"><Icon name="code" />Подключение</a>
    </Intro>
    <section className="gallery" aria-label="Каталог композиций">
      <div className="gallery-heading"><div className="section-title"><h2>Композиции</h2><span className="counter" aria-label="Количество примитивов">{String(visible.length).padStart(2,'0')}</span></div>
        <label className="search-box neui-focus neui-ripple"><Icon name="search"/><input aria-label="Поиск по CSS API" type="search" value={query} placeholder="Найти класс…" onChange={e=>setQuery(e.target.value)} /></label></div>
      <div className="filters" aria-label="Группы примитивов">{['Все','Поверхность','Движение','Выбор','Раскладка'].map(f=>
        <button type="button" key={f} className="filter neui-pill neui-ripple" aria-pressed={family===f} onClick={()=>setFamily(f)}>{f}</button>)}</div>
      <div className="samples">{visible.map(p=><Card item={p} key={p.id} theme={p.id === 'surface' ? { index: light ? 1 : 0, select: i => onTheme(i === 1) } : undefined}/>)}</div>
      {visible.length===0 && <div className="empty"><p>Подходящих композиций нет.</p><button className="setup-link neui-pill neui-ripple" onClick={()=>{setQuery('');setFamily('Все')}}>Сбросить фильтры</button></div>}
    </section>
  </>
}
