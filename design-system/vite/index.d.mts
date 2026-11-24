import type { Plugin } from 'vite'

export interface NeuiOptions {
  /** Client module relative to Vite's root, for hosts that supply their own HTML. */
  clientEntry?: string
}

/** Connect NEUI's delegated behaviors to the client entry. */
export function neui(options?: NeuiOptions): Plugin
