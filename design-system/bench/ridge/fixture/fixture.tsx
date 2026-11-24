import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { version } from 'react'
import '../../../src/styles.css'

declare global {
  interface Window {
    discovery: { observers: number; time: number; records: number }
    runRidgeBenchmark: typeof run
  }
}

const rootElement = document.getElementById('app')!
const root = createRoot(rootElement)
const nextFrame = () => new Promise<number>(resolve => requestAnimationFrame(resolve))
const dataset = Array.from({ length: 20000 }, (_, index) => ({ id: index, title: 'Узел ' + index }))

function List({ offset }: { offset: number }) {
  return <section className="neui-ridge neui-track-focus">
    <span slot="label">Задачи</span>
    <div className="window"><div className="list">{dataset.slice(offset, offset + 128).map(item =>
      <div key={item.id} className="item"><label><span>{item.title}</span><input defaultValue={item.id} /></label></div>,
    )}</div></div>
  </section>
}

function Graph({ offset }: { offset: number }) {
  return <div className="window graph">{dataset.slice(offset, offset + 48).map(item =>
    <section key={item.id} className="neui-ridge neui-track-focus">
      <span slot="label">{item.title}</span><button>Открыть</button>
      {item.id % 4 === 0 && <div className="neui-ridge neui-track-focus"><span slot="label">Вес</span><input defaultValue={item.id} /></div>}
    </section>,
  )}</div>
}

const render = (scene: string, offset: number) => flushSync(() => root.render(
  scene === 'list' ? <List offset={offset} /> : <Graph offset={offset} />,
))

async function run(scene: string) {
  render(scene, 0)
  await document.fonts.ready
  await nextFrame()
  const hosts = Array.from(rootElement.querySelectorAll<HTMLElement>('.neui-ridge'))
  if (hosts.length !== (scene === 'list' ? 1 : 60) || hosts.some(host => !host.shadowRoot?.querySelector('.neui-floor')))
    throw Error('Не все жёлоба зарегистрированы')
  const control = rootElement.querySelector<HTMLElement>('input,button')!
  control.focus()
  if (control.closest<HTMLElement>('.neui-track-focus')!.style.getPropertyValue('--neui-focus-active') !== '1')
    throw Error('Трекер фокуса не подключён')
  control.blur()
  const discovery = window.discovery
  const samples = []
  let frame = await nextFrame()
  for (let index = 1; index <= 48; index++) {
    const before = performance.now()
    const scan = discovery.time, records = discovery.records
    render(scene, index * (scene === 'list' ? 32 : 6))
    await Promise.resolve() // deliver MutationObserver callbacks in the DOM mode
    rootElement.getBoundingClientRect() // include outstanding style/layout in both modes
    const work = performance.now() - before
    const next = await nextFrame()
    if (index > 8) samples.push({ work, frame: next - frame, scan: discovery.time - scan, records: discovery.records - records })
    frame = next
  }
  return { samples, observers: discovery.observers, react: version }
}

window.runRidgeBenchmark = run
