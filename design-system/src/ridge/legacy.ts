import { layoutAuthoredRidge } from './geometry'
import { trackFocus } from './trackFocus'

/** Compatibility adapter for applications that supply the original light-DOM frame. */
export function attachRidge(shell: HTMLElement) {
  const stopLayout = layoutAuthoredRidge(shell)
  const stopFocus = trackFocus(shell)
  shell.setAttribute('data-neui-legacy-focus', '')
  return () => {
    stopFocus()
    stopLayout()
    shell.removeAttribute('data-neui-legacy-focus')
  }
}
