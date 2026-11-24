const run = document.querySelector('#run')
const status = document.querySelector('#status')
const result = document.querySelector('#result')
const stage = document.querySelector('#stage')
const rounds = [['dom', 'react'], ['react', 'dom'], ['react', 'dom'], ['dom', 'react']]

function percentile(samples, field, fraction) {
  const values = samples.map(sample => sample[field]).sort((a, b) => a - b)
  return values[Math.ceil(values.length * fraction) - 1]
}

async function measure(mode, scene) {
  const frame = document.createElement('iframe')
  frame.title = 'Окно виртуализации'
  const loaded = new Promise((resolve, reject) => {
    frame.onload = resolve
    frame.onerror = () => reject(new Error('Не удалось открыть сборку ' + mode))
  })
  frame.src = './' + mode + '/index.html'
  stage.replaceChildren(frame)
  await loaded
  const sample = await frame.contentWindow.runRidgeBenchmark(scene)
  if (sample.observers !== Number(mode === 'dom')) throw new Error('Неверное число наблюдателей документа')
  return sample
}

function showResults(results) {
  const table = document.createElement('table')
  const head = table.createTHead().insertRow()
  for (const title of ['Сценарий', 'Режим', 'Работа p50 / p95, мс', 'Кадр p50 / p95, мс', 'Callback наблюдателя, мс/шаг']) {
    const cell = document.createElement('th')
    cell.textContent = title
    head.append(cell)
  }
  const body = table.createTBody()
  for (const scene of ['list', 'graph']) {
    for (const mode of ['dom', 'react']) {
      const all = results.filter(r => r.scene === scene && r.mode === mode).flatMap(r => r.samples)
      const pair = field => [.5, .95].map(q => percentile(all, field, q).toFixed(2)).join(' / ')
      const observerTime = all.reduce((sum, v) => sum + v.scan, 0) / all.length
      const row = body.insertRow()
      for (const value of [scene, mode, pair('work'), pair('frame'), observerTime.toFixed(3)]) {
        row.insertCell().textContent = value
      }
    }
  }
  const details = document.createElement('details')
  const summary = document.createElement('summary')
  summary.textContent = 'Результаты по сериям (JSON)'
  const pre = document.createElement('pre')
  const series = results.map(({ samples, ...meta }) => ({
    ...meta, steps: samples.length, p50: percentile(samples, 'work', .5), p95: percentile(samples, 'work', .95),
    frame95: percentile(samples, 'frame', .95), records: samples.reduce((sum, v) => sum + v.records, 0),
  }))
  pre.textContent = JSON.stringify({ browser: navigator.userAgent, series }, null, 2)
  details.append(summary, pre)
  result.append(table, details)
}

run.onclick = async () => {
  run.disabled = true
  result.replaceChildren()
  const results = []
  let interrupted = document.hidden
  const visibility = () => { if (document.hidden) interrupted = true }
  document.addEventListener('visibilitychange', visibility)
  try {
    for (const [index, modes] of rounds.entries()) {
      for (const scene of index % 2 ? ['graph', 'list'] : ['list', 'graph']) {
        for (const mode of modes) {
          status.textContent = 'Серия ' + (index + 1) + ' из 4 · ' + scene + ' · ' + mode
          results.push({ round: index + 1, scene, mode, ...await measure(mode, scene) })
          if (interrupted) throw new Error('Вкладка была в фоне. Повторите замер в открытой вкладке.')
        }
      }
    }
    showResults(results)
    status.textContent = 'Готово · 640 измеренных обновлений'
  } catch (error) {
    status.textContent = 'Ошибка · ' + error.message
  } finally {
    document.removeEventListener('visibilitychange', visibility)
    run.disabled = false
    stage.replaceChildren()
  }
}
