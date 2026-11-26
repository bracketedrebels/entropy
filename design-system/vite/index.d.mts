import type { Plugin } from 'vite'

export interface NeuiOptions {
  /** Client module relative to Vite's root, for hosts that supply their own HTML. */
  clientEntry?: string
  /** Compile statically marked React JSX exit sites. Defaults to true. */
  leaving?: boolean
}

/** Connect NEUI's delegated behaviors to the client entry. */
export function neui(options?: NeuiOptions): Plugin
