// A second press can travel over a focused surface without erasing the first contact.
const fronts = new WeakMap<HTMLElement, string>()
const fades = new WeakMap<HTMLElement, object>()

function reset(target: HTMLElement) {
  target.style.removeProperty('--neui-focus-progress')
  target.style.removeProperty('--neui-focus-origin-x')
  target.style.removeProperty('--neui-focus-origin-y')
}

export function enterFocus(target: HTMLElement) {
  // Runtime selector for @apply and responsive utilities. Literal classes supply their own CSS.
  if (!target.classList.contains('neui-focus')) target.setAttribute('data-neui-focus', '')
  if (fades.delete(target)) reset(target)
}

export function leaveFocus(target: HTMLElement) {
  const front = fronts.get(target)
  if (front) {
    const reached = getComputedStyle(target).getPropertyValue(front).trim() || '0'
    target.style.setProperty('--neui-focus-progress', reached)
    fronts.delete(target)
  }
  if (!front && !target.hasAttribute('data-neui-focus')) return
  const token = {}
  fades.set(target, token)
  const transitions = (target.getAnimations?.({ subtree: true }) ?? []).filter(motion =>
    'transitionProperty' in motion && motion.transitionProperty === 'opacity' &&
    (motion.effect as KeyframeEffect | null)?.target === target)
  void Promise.allSettled(transitions.map(motion => motion.finished)).then(() => {
    if (fades.get(target) !== token || target.matches(':focus-within')) return
    fades.delete(target)
    reset(target)
    target.removeAttribute('data-neui-focus')
  })
}

export function revealFocus(target: HTMLElement, x: number, y: number, front: string) {
  enterFocus(target)
  fronts.set(target, front)
  target.style.setProperty('--neui-focus-origin-x', x + '%')
  target.style.setProperty('--neui-focus-origin-y', y + '%')
  target.style.setProperty('--neui-focus-progress', 'var(' + front + ')')
  return () => {
    if (fronts.get(target) !== front) return
    fronts.delete(target)
    reset(target)
    if (!target.matches(':focus-within')) target.removeAttribute('data-neui-focus')
  }
}
