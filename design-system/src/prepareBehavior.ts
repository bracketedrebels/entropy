import { useCallback, useRef } from 'react'

/** Prepare once at module scope. Each hook instance owns one element and its cleanup. */
export function prepareBehavior<T extends HTMLElement>(attach: (node: T) => void | (() => void)) {
  return function useBehavior() {
    const detach = useRef<void | (() => void)>()
    return useCallback((node: T | null) => {
      detach.current?.()
      detach.current = node ? attach(node) : undefined
    }, [])
  }
}
