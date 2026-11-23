const paths = {
  search: <><circle cx="10" cy="10" r="6.5" /><path d="m15 15 5 5" /></>,
  clear: <path d="m6 6 12 12M18 6 6 18" />,
  text: <path d="M4 6h16M4 12h16M4 18h10" />,
  pencil: <path d="m4 20 1-5L16.5 3.5a2 2 0 0 1 3 3L8 18.8 4 20ZM14.5 5.5l4 4" />,
  person: <><circle cx="12" cy="7" r="3.5" /><path d="M4.5 20c.5-4 3.2-6.5 7.5-6.5s7 2.5 7.5 6.5" /></>,
  mail: <><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></>,
  project: <path d="M3 7V5h7l2 3h9v12H3V7Z" />,
} as const

export function Icon({ name }: { name: keyof typeof paths }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
