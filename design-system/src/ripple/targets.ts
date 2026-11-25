// Resolve each behavior independently, including a ripple nested inside a focus scope.
export function pressTargets(event: Event, focusOnly = false) {
  let ripple: HTMLElement | undefined
  let ring: HTMLElement | undefined
  if (event.defaultPrevented) return {}
  for (const node of event.composedPath()) {
    if (!(node instanceof Element)) continue
    if (node.matches(':disabled,[aria-disabled="true"],[inert]')) return {}
    if (!(node instanceof HTMLElement)) continue
    if (node instanceof HTMLLabelElement && node.control?.matches(':disabled')) return {}
    const style = getComputedStyle(node)
    if (!ring && (node.classList.contains('neui-focus-ring') || style.getPropertyValue('--neui-focus-ring-target').trim() === '1')) ring = node
    if (!focusOnly && !ripple && (node.classList.contains('neui-ripple') || style.getPropertyValue('--neui-ripple-target').trim() === '1')) ripple = node
    if (ring && (focusOnly || ripple)) break
  }
  if ((ring ?? ripple)?.closest('[inert],[aria-disabled="true"],fieldset:disabled')) return {}
  return { ripple, ring }
}
