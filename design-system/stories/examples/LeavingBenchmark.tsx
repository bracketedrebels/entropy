import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { presence } from '@neui/kit/presence'

const ids = Array.from({ length: 64 }, (_, id) => id)
const columns = Array.from({ length: 8 }, (_, i) => ids.slice(i * 8, i * 8 + 8))
const nextFrame = () => new Promise<number>(done => requestAnimationFrame(done))
type Mode = 'Vite' | 'Runtime'
type Sample = { deltas: number[]; mounted: number; checks: number }

const runtimeAliases = new Set(['lab-disclosure'])
type Counter = { current: number }

function Slot({ mode, id, open, checks }: { mode: Mode; id: number; open: boolean; checks: Counter }) {
  const content = <div className="neui-reveal-clip"><div className="h-6 text-center">{id + 1}</div></div>
  if (mode === 'Runtime') {
    // The comparison gets a ready-made registry. Only lookup moves to the client.
    const classes = 'lab-disclosure'
    checks.current++
    const match = classes.split(/\s+/).some(name => runtimeAliases.has(name))
    const row = open && <div className={classes}>{content}</div>
    return match ? presence(row) : row
  }
  return open && <div className="lab-disclosure">{content}</div>
}

function Fixture({ mode, expanded, checks }: { mode: Mode; expanded: boolean; checks: Counter }) {
  return <div className="grid grid-cols-8">{columns.map(column =>
    <div key={column[0]}>{column.map(id =>
      <Slot key={id} mode={mode} id={id} open={expanded || id % 2 === 0} checks={checks} />)}</div>)}</div>
}

export function LeavingBenchmark() {
  const [phase, setPhase] = useState<{ mode: Mode; expanded: boolean }>({ mode: 'Vite', expanded: true })
  const [status, setStatus] = useState('')
  const [idleFps, setIdleFps] = useState(0)
  const [results, setResults] = useState<[Mode, number, number, number, number][]>([])
  const checks = useRef(0)
  const stage = useRef<HTMLDivElement>(null)
  const run = useRef<AbortController>()
  useEffect(() => () => run.current?.abort(), [])
  async function measure() {
    if (run.current) return
    const controller = new AbortController()
    run.current = controller
    const abort = () => { if (document.hidden) controller.abort() }
    document.addEventListener('visibilitychange', abort)
    const samples: Record<Mode, Sample[]> = { Vite: [], Runtime: [] }
    setResults([])
    setIdleFps(0)
    try {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setStatus('Для сравнения анимаций включите движение в настройках устройства.')
        return
      }
      setStatus('Измеряю частоту кадров в покое')
      await document.fonts.ready
      await nextFrame()
      await Promise.allSettled(stage.current!.getAnimations({ subtree: true }).map(animation => animation.finished))
      if (controller.signal.aborted) throw Error()
      let idleStart = await nextFrame()
      const idleFrames = []
      for (let i = 0; i < 10; i++) {
        const frame = await nextFrame()
        if (controller.signal.aborted) throw Error()
        idleFrames.push(frame - idleStart)
        idleStart = frame
      }
      setIdleFps(1000 * idleFrames.length / idleFrames.reduce((sum, n) => sum + n, 0))
      // Discard the first pair. Then alternate order between measured pairs.
      for (const [round, modes] of [['Vite', 'Runtime'], ['Vite', 'Runtime'], ['Runtime', 'Vite'], ['Vite', 'Runtime'], ['Runtime', 'Vite']].entries()) {
        for (const mode of modes as Mode[]) {
          setStatus((round ? 'Серия ' + round + ' из 4' : 'Прогрев') + ' · ' + mode)
          flushSync(() => setPhase({ mode, expanded: true }))
          const warm = await nextFrame()
          while (await nextFrame() - warm < 320) { if (controller.signal.aborted) throw Error() }
          checks.current = 0
          const deltas: number[] = []
          for (const expanded of [false, true, false]) {
            let previous = await nextFrame()
            const start = previous
            flushSync(() => setPhase({ mode, expanded }))
            while (previous - start < 320) {
              const frame = await nextFrame()
              if (controller.signal.aborted) throw Error()
              deltas.push(frame - previous)
              previous = frame
            }
          }
          // rAF callbacks run before paint. Observe removal after the final transitions
          // and their React commit, outside the measurement window.
          await Promise.allSettled(stage.current!.getAnimations({ subtree: true }).map(animation => animation.finished))
          for (let i = 0; stage.current!.querySelector('[data-leaving]') && i < 5; i++) {
            await nextFrame()
            if (controller.signal.aborted) throw Error()
          }
          if (stage.current!.querySelector('[data-leaving]')) throw Error()
          if (round) samples[mode].push({ deltas, checks: checks.current, mounted: stage.current!.querySelectorAll('.h-6').length })
        }
      }
      const modes: Mode[] = ['Vite', 'Runtime']
      setResults(modes.map(mode => {
        const deltas = samples[mode].flatMap(s => s.deltas).sort((a, b) => a - b)
        return [mode, 1000 * deltas.length / deltas.reduce((a, b) => a + b, 0), deltas[Math.ceil(.95 * deltas.length) - 1], samples[mode][0].mounted, samples[mode][0].checks]
      }))
      setStatus('Готово')
    } catch {
      if (stage.current) setStatus('Замер прерван. Повторите в активной вкладке.')
    } finally {
      document.removeEventListener('visibilitychange', abort)
      run.current = undefined
    }
  }
  return <section>
    <button className="neui-pill" type="button" onClick={measure} disabled={!!run.current}>Замерить FPS</button>
    <p className="neui-note">64 строки, 32 скрываются за 240 мс. Один прогрев и четыре серии на вариант.</p>
    <p role="status">{status}</p>
    {idleFps > 0 && <p>В покое: {idleFps.toFixed(1)} FPS.{idleFps < 20 && ' Низкая частота среды ограничивает сравнение.'}</p>}
    {!!results.length && <table className="w-full text-sm"><thead><tr>{['Вариант', 'FPS', 'Кадр p95, мс', 'Строк в DOM', 'Проверок за серию'].map(title => <th key={title}>{title}</th>)}</tr></thead>
      <tbody>{results.map(([mode, fps, p95, count, checks]) => <tr key={mode}><td>{mode}</td><td>{fps.toFixed(1)}</td><td>{p95.toFixed(1)}</td><td>{count}</td><td>{checks}</td></tr>)}</tbody></table>}
    <div ref={stage} aria-hidden="true"><Fixture {...phase} checks={checks} /></div>
  </section>
}
