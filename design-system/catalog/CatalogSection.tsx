import { createContext, useContext, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'

const narrow = () => window.matchMedia('(max-width: 720px)')
function subscribe(change: () => void) {
  const media = narrow()
  media.addEventListener('change', change)
  return () => media.removeEventListener('change', change)
}
export function useCompactLayout() {
  return useSyncExternalStore(subscribe, () => narrow().matches, () => false)
}
export const CompactCatalog = createContext(false)

export function CatalogSection({ id, label, title = label, level = 2, className, children }: {
  id: string; label: string; title?: ReactNode; level?: 2 | 3; className?: string; children: ReactNode
}) {
  const compact = useContext(CompactCatalog)
  const Heading = level === 3 ? 'h3' : 'h2'
  return <article id={id} data-nav-label={label}
    className={['catalog-section', className, compact && 'neui-ridge neui-track-focus'].filter(Boolean).join(' ')}>
    <Heading className="section-legend" slot="label">{title}</Heading>
    <div className="section-body">{children}</div>
  </article>
}
