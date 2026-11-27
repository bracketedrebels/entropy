import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/ubuntu/300.css'
import '@fontsource/ubuntu/400.css'
import '@fontsource/ubuntu/500.css'
import '@fontsource/ubuntu/700.css'
import './catalog.css'
import '../stories/canvas.css'
import { Gallery } from './Gallery'
import { SectionDock, sections } from './SectionDock'
import { Icon, IslandRidge } from './components'
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
function App() {
  const viewport = useRef<HTMLDivElement>(null)
  const [page,setPage] = useState(route)
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
    if (id!=='css'||!detail) viewport.current?.scrollTo(0, 0)
  },[id,title,detail])
  useLayoutEffect(()=>{
    document.documentElement.dataset.theme=light?'light':'dark'
    try {localStorage.setItem('neui-catalog-theme',light?'light':'dark')} catch { /* Theme still applies in memory. */ }
  },[light])
  return <div className="atlas neui-surface" data-theme={light?'light':'dark'}>
    <a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById('main-content')?.focus()}}>К содержанию</a>
    <div className="content-island">
      <IslandRidge />
      <div className="island-scroll" ref={viewport}>
        <header className="bar-inner">
          <a className="wordmark" href="#css" aria-label="NEUI, CSS API"><Icon name="layers"/>NEUI</a>
          <div className="header-tools">
            <button className="chrome-button neui-ripple" onClick={() => setLight(!light)}
              aria-label={light ? 'Включить тёмную тему' : 'Включить светлую тему'} title={light ? 'Тёмная тема' : 'Светлая тема'}>
              <Icon name={light ? 'moon' : 'lamp'}/>
            </button>
            <a className="chrome-button github" href="https://github.com/bracketedrebels/entropy/tree/feat/trinet-react-kit/design-system"
              aria-label="Исходники на GitHub" title="GitHub"><Icon name="github"/></a>
          </div>
        </header>
        <main className="atlas-inner" id="main-content" tabIndex={-1}>
          {id==='css'?<Gallery detail={detail}/>:id==='vite'?<ViteDocs detail={detail}/>:id==='react'?<ReactDocs/>:
            id==='philosophy'?<Philosophy/>:<Suspense fallback={<p role="status">Загружаем рецепты…</p>}><Recipes detail={detail}/></Suspense>}
        </main>
        <footer className="atlas-foot"><span>NEUI <span>·</span> Дизайн-система</span><a href="./storybook/">Архив Storybook</a></footer>
      </div>
    </div>
    <SectionDock active={id} />
  </div>
}
createRoot(document.getElementById('root')!).render(<App/>)
