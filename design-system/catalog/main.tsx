import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/ubuntu/300.css'
import '@fontsource/ubuntu/400.css'
import '@fontsource/ubuntu/500.css'
import '@fontsource/ubuntu/700.css'
import './catalog.css'
import '../stories/canvas.css'
import { CompactCatalog, useCompactLayout } from './CatalogSection'
import { Gallery } from './Gallery'
import { LocalNavigation } from './LocalNavigation'
import { SectionDock, sections } from './SectionDock'
import { Icon } from './components'
import { ReactDocs, ViteDocs, Philosophy } from './Docs'

const Recipes = lazy(() => import('./Recipes'))
function route() {
  const [key, detail] = location.hash.slice(1).split('/')
  return { section:sections.find(([id])=>id===key) ?? sections[0], detail }
}
function migrateStoryLink() {
  const previous = new URLSearchParams(location.search).get('path')
  if (!previous || location.hash || !/^\/(story|docs)\//.test(previous)) return
  const slug = previous.split('/').pop()?.split('--')[0] ?? ''
  const equivalent: Record<string,string> = {
    'trinet-form':'recipes/settings','neui-swipe':'recipes/tags','neui-calendar':'recipes/date','trinet-calendar':'recipes/date',
    ...Object.fromEntries(['ripple','ridge','focus','check','icon','range','row','pill','surface'].flatMap(id=>
      ['neui-','trinet-'].map(p=>[p+id,'css/'+id]))),
    'trinet-reveal':'css/collapse','neui-reveal':'css/collapse',
  }
  const target = previous === '/story/neui-calendar--date-range' ? 'recipes/period' : equivalent[slug]
  if (target) history.replaceState(null,'', location.pathname + '#' + target)
  else location.replace(new URL('./storybook/' + location.search, document.baseURI).href)
}
migrateStoryLink()

function toSectionTop(event: React.MouseEvent<HTMLAnchorElement>) {
  if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey &&
      event.currentTarget.hash === location.hash) window.scrollTo(0, 0)
}

function App() {
  const compact = useCompactLayout()
  const [page,setPage] = useState(route)
  const [content, setContent] = useState<HTMLDivElement | null>(null)
  const [light,setLight] = useState(()=>{ try {return localStorage.getItem('neui-catalog-theme')==='light'} catch {return false} })
  useEffect(()=>{
    const onHash=()=>setPage(route())
    window.addEventListener('hashchange',onHash)
    return ()=>window.removeEventListener('hashchange',onHash)
  },[])
  const [id, title] = page.section
  const { detail } = page
  useLayoutEffect(()=>{
    document.title = title + ' · NEUI'
    if (!detail) window.scrollTo(0, 0)
  },[id,title,detail])
  useLayoutEffect(()=>{
    document.documentElement.dataset.theme=light?'light':'dark'
    try {localStorage.setItem('neui-catalog-theme',light?'light':'dark')} catch { /* Theme still applies in memory. */ }
  },[light])
  const tools = <div className="header-tools">
    <button className="chrome-button neui-ripple" onClick={() => setLight(!light)}
      aria-label={light ? 'Включить тёмную тему' : 'Включить светлую тему'} title={light ? 'Тёмная тема' : 'Светлая тема'}>
      <Icon name={light ? 'moon' : 'lamp'}/>
    </button>
    <a className="chrome-button neui-ripple" href="https://github.com/bracketedrebels/entropy/tree/feat/trinet-react-kit/design-system"
      aria-label="Исходники на GitHub" title="GitHub"><Icon name="github"/></a>
  </div>
  return <CompactCatalog.Provider value={compact}><div className="atlas">
    <a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById('main-content')?.focus()}}>К содержанию</a>
    <div className="catalog-field neui-ridge neui-track-focus neui-track-focus-within">
      <h1 className="island-title" slot="label">
        <a className="legend-link neui-ripple" href="#css" onClick={toSectionTop}>NEUI</a>
        <span aria-hidden="true"> · </span>
        <a className="legend-link neui-ripple" href={'#' + id} onClick={toSectionTop}>{title}</a>
      </h1>
      {compact && <div slot="header" className="mobile-header-tools">{tools}</div>}
      <div className="catalog-content">
        {!compact && <header className="bar-inner">{tools}</header>}
        <main className="atlas-inner" id="main-content" tabIndex={-1}>
          <Suspense fallback={<p role="status">Загружаем рецепты…</p>}>
            <div key={id} data-page={id} ref={setContent}>
              {id === 'css' ? <Gallery light={light} onTheme={setLight}/> : id === 'vite' ? <ViteDocs/> :
                id === 'react' ? <ReactDocs/> : id === 'philosophy' ? <Philosophy/> : <Recipes/>}
            </div>
          </Suspense>
        </main>
        <footer className="atlas-foot"><span>NEUI <span>·</span> Дизайн-система</span><a href="./storybook/">Архив Storybook</a></footer>
      </div>
    </div>
    <div className="catalog-dock">
      {content?.dataset.page === id && <LocalNavigation content={content} section={id} detail={detail} />}
      <SectionDock active={id} />
    </div>
  </div></CompactCatalog.Provider>
}
createRoot(document.getElementById('root')!).render(<App/>)
