// A second press can travel over a focused surface without erasing the first contact.
const fronts = new WeakMap<HTMLElement, string>()
const fades = new WeakMap<HTMLElement, object>()

function reset(target: HTMLElement) {
  target.style.removeProperty('--neui-ring-progress')
  target.style.removeProperty('--neui-ring-x')
  target.style.removeProperty('--neui-ring-y')
}

export function ringFocus(target: HTMLElement) {
  // Runtime selector for @apply and responsive utilities. Literal classes supply their own CSS.
  if (!target.classList.contains('neui-focus-ring')) target.setAttribute('data-neui-ring', '')
  if (fades.delete(target)) reset(target)
}

export function ringBlur(target: HTMLElement) {
  const front = fronts.get(target)
  if (front) {
    const reached = getComputedStyle(target).getPropertyValue(front).trim() || '0'
    target.style.setProperty('--neui-ring-progress', reached)
    fronts.delete(target)
  }
  if (!front && !target.hasAttribute('data-neui-ring')) return
  const token = {}
  fades.set(target, token)
  const transitions = (target.getAnimations?.({ subtree: true }) ?? []).filter(motion =>
    'transitionProperty' in motion && motion.transitionProperty === 'opacity' &&
    (motion.effect as KeyframeEffect | null)?.target === target)
  void Promise.allSettled(transitions.map(motion => motion.finished)).then(() => {
    if (fades.get(target) !== token || target.matches(':focus-within')) return
    fades.delete(target)
    reset(target)
    target.removeAttribute('data-neui-ring')
  })
}

export function revealRing(target: HTMLElement, x: number, y: number, front: string) {
  ringFocus(target)
  fronts.set(target, front)
  target.style.setProperty('--neui-ring-x', x + '%')
  target.style.setProperty('--neui-ring-y', y + '%')
  target.style.setProperty('--neui-ring-progress', 'var(' + front + ')')
  return () => {
    if (fronts.get(target) !== front) return
    fronts.delete(target)
    reset(target)
    if (!target.matches(':focus-within')) target.removeAttribute('data-neui-ring')
  }
}
