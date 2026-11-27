import type { Plugin } from 'vite'

export interface NeuiOptions {
  /** Client module relative to Vite's root, for hosts that supply their own HTML. */
  clientEntry?: string
  /** Compile statically marked React JSX exit sites. Defaults to true. */
  leaving?: boolean
  /** Project CSS globs relative to Vite root. Imports are followed. */
  leavingStyles?: string[]
}

/** Connect NEUI's delegated behaviors to the client entry. */
export function neui(options?: NeuiOptions): Plugin

export { neuiLeaving } from '@neui-tools/leaving/vite'
