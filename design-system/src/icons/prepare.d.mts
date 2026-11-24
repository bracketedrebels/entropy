import type plugin from 'tailwindcss/plugin'

export interface IconCatalog {
  icons: Readonly<Record<string, string>>
  pairs?: ReadonlyArray<{
    from: string
    to: string
    size?: number
    /** SVG contents inside a square viewBox at progress 0..1. */
    draw: (progress: number) => string
  }>
}

export function prepareIcons(catalog: IconCatalog): ReturnType<typeof plugin>
