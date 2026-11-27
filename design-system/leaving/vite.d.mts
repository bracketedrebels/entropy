import type { Plugin } from 'vite'

export interface LeavingOptions {
  /** Stylesheets relative to Vite's root. CSS imports and @apply aliases are followed. */
  styles?: string[]
}

export function neuiLeaving(options?: LeavingOptions): Plugin
export default neuiLeaving
