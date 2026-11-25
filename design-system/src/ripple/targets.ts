// Resolve each behavior independently, including a ripple nested inside a focus scope.
export function pressTargets(event: Event, focusOnly = false) {
  let ripple: HTMLElement | undefined
  let focus: HTMLElement | undefined
  if (event.defaultPrevented) return {}
  for (const node of event.composedPath()) {
    if (!(node instanceof Element)) continue
    if (node.matches(':disabled,[aria-disabled="true"],[inert]')) return {}
    if (!(node instanceof HTMLElement)) continue
    if (node instanceof HTMLLabelElement && node.control?.matches(':disabled')) return {}
    const style = getComputedStyle(node)
    if (!focus && (node.classList.contains('neui-focus') || style.getPropertyValue('--neui-focus-target').trim() === '1')) focus = node
    if (!focusOnly && !ripple && (node.classList.contains('neui-ripple') || style.getPropertyValue('--neui-ripple-target').trim() === '1')) ripple = node
    if (focus && (focusOnly || ripple)) break
  }
  if ((focus ?? ripple)?.closest('[inert],[aria-disabled="true"],fieldset:disabled')) return {}
  return { ripple, focus }
}
