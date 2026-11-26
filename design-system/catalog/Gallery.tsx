import { memo, useEffect, useState } from 'react'
import { Code, Hero, Icon } from './components'
import { primitives } from './primitives'
import type { Primitive } from './primitives'

const Markup = memo(function Markup({ source }: { source: string }) {
  // Only bundled examples authored in this repository reach the preview.
  return <div className="demo-markup" dangerouslySetInnerHTML={{ __html: source }} />
})
function Card({ item }: { item: Primitive }) {
  const [index, setIndex] = useState(0)
  const variant = item.variants[index], View = variant.View
  return <article className="sample-card" id={'sample-' + item.id}>
    <div className="card-head"><div className="card-title"><span className="card-glyph"><Icon name={item.icon} /></span><h3><a href={'#css/' + item.id}>{item.title}</a></h3></div>
      <p>{item.summary}</p></div>
    <div className={'sample-stage stage-' + item.id}>
      {View ? <View key={index} /> : <Markup source={variant.source} />}
    </div>
    <div className="variants" aria-label={'Конфигурация ' + item.title}>{item.variants.map((v, i) =>
      <button type="button" className="neui-ripple" aria-pressed={index === i} key={v.name} onClick={() => setIndex(i)}>{v.name}</button>)}</div>
    <Code key={index} folded lang={View ? 'TSX' : 'HTML'} source={variant.source} />
  </article>
}
export function Gallery({ detail }: { detail?: string }) {
  const [family, setFamily] = useState('Все'), [query, setQuery] = useState('')
  useEffect(() => {
    if (!detail) return
    setFamily('Все'); setQuery('')
    const frame = requestAnimationFrame(() => document.getElementById('sample-' + detail)?.scrollIntoView({block:'start'}))
    return () => cancelAnimationFrame(frame)
  }, [detail])
  const visible = primitives.filter(p => (family === 'Все' || p.family === family) &&
    [p.title, p.summary, p.family, ...p.variants.map(v => v.source)].join(' ').toLowerCase().includes(query.trim().toLowerCase()))
  return <>
    <Hero title="CSS API" subtitle="Примитивы света, формы и движения. Собирайте интерфейс из классов Tailwind прямо в своей разметке."
      eyebrow="Справочник примитивов" icon="layers" art>
      <a href="#vite" className="setup-link"><Icon name="code" />Подключение</a>
    </Hero>
    <section className="gallery" aria-label="Каталог композиций">
      <div className="gallery-heading"><div className="section-title"><h2>Композиции</h2><span className="counter" aria-label="Количество примитивов">{String(visible.length).padStart(2,'0')}</span></div>
        <label className="search-box"><Icon name="search"/><input aria-label="Поиск по CSS API" type="search" value={query} placeholder="Найти класс…" onChange={e=>setQuery(e.target.value)} /></label></div>
      <div className="filters" aria-label="Группы примитивов">{['Все','Поверхность','Движение','Выбор','Раскладка'].map(f=>
        <button type="button" key={f} className="filter neui-ripple" aria-pressed={family===f} onClick={()=>setFamily(f)}>{f}</button>)}</div>
      <div className="samples">{visible.map(p=><Card item={p} key={p.id}/>)}</div>
      {visible.length===0 && <div className="empty"><p>Подходящих композиций нет.</p><button className="setup-link" onClick={()=>{setQuery('');setFamily('Все')}}>Сбросить фильтры</button></div>}
    </section>
  </>
}
