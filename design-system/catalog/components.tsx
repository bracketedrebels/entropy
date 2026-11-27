import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

const iconClasses = {
  bolt:'neuicon-bolt', orbit:'neuicon-orbit', aperture:'neuicon-aperture',
  layers:'neuicon-layers', wave:'neuicon-wave', lamp:'neuicon-lamp', marker:'neuicon-marker',
  braces:'neuicon-braces', code:'neuicon-code', copy:'neuicon-copy', tick:'neuicon-tick',
  grid:'neuicon-grid', tag:'neuicon-tag', star:'neuicon-star', expand:'neuicon-expand',
  sliders:'neuicon-sliders', moon:'neuicon-moon', calendar:'neuicon-calendar', book:'neuicon-book',
  github:'neuicon-github', search:'neuicon-search', clear:'neuicon-clear', chevron:'neuicon-chevron',
} as const
export function Icon({ name }: { name: string }) {
  return <i aria-hidden="true" className={iconClasses[name as keyof typeof iconClasses]} />
}
function highlight(code: string) {
  return code.split(/("[^"\n]*"|'[^'\n]*'|<\/?[\w.-]+|\/?>|\b(?:import|from|const|export|default|function|return|true|false)\b|\b[\w-]+(?==))/g)
    .map((part, i) => i % 2 ? <span key={i} className={'syn-' + (/^["']/.test(part) ? 'string' : /^[<>/]/.test(part) ? 'tag' : 'word')}>{part}</span> : part)
}
export function Code({ source, lang = 'TSX', folded = false, filename }: {
  source: string; lang?: string; folded?: boolean; filename?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const [feedback, setFeedback] = useState('')
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timeout.current), [])
  const code = source.trim()
  const lines = code.split('\n')
  const canFold = folded && (lines.length > 3 || lines.some(line => line.length > 80))
  async function copy() {
    try { await navigator.clipboard.writeText(code); setFeedback('Скопировано') }
    catch { setExpanded(true); setFeedback('Выделите код для копирования') }
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setFeedback(''), 2200)
  }
  return <div className={'code-box' + (expanded ? ' is-open' : '')}>
    <div className="code-toolbar"><span className="code-language">{filename ?? lang}</span>
      <div className="code-tools">
        {canFold && <button type="button" aria-expanded={expanded} onClick={() => setExpanded(v => !v)}>
          {expanded ? 'Свернуть' : 'Весь код'} <Icon name="chevron" />
        </button>}
        <button type="button" className="icon-button" onClick={copy} aria-label="Скопировать код" title="Скопировать код">
          <Icon name={feedback === 'Скопировано' ? 'tick' : 'copy'} /></button>
      </div></div>
    <pre tabIndex={0} className={canFold && !expanded ? 'folded' : undefined}><code>{highlight(canFold && !expanded ? lines.slice(0,3).join('\n') : code)}</code></pre>
    {feedback && <span className="copy-status" role="status">{feedback}</span>}
  </div>
}
export function Intro({ subtitle, children }: { subtitle: string; children?: ReactNode }) {
  return <div className="page-intro"><p>{subtitle}</p>{children}</div>
}
