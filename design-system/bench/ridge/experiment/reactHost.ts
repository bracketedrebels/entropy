import { createElement, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import type { HTMLAttributes } from 'react'
import { mountRidge } from '../../../src/ridge/frame'
import { trackFocus } from '../../../src/ridge/trackFocus'

const useCommit = typeof document === 'undefined' ? useEffect : useLayoutEffect

function createHost(tag: string) {
  const Host = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>((props, userRef) => {
    const host = useRef<HTMLElement>(null)
    const tokens = typeof props.className === 'string' ? props.className.split(/\s+/) : []
    const ridge = tokens.includes('neui-ridge')
    const focus = tokens.includes('neui-track-focus')
    useCommit(() => {
      if (ridge && host.current instanceof HTMLElement) return mountRidge(host.current)
    }, [ridge])
    useCommit(() => {
      if (focus && host.current instanceof HTMLElement) return trackFocus(host.current)
    }, [focus])
    // Let the installed React version handle object refs, callback refs and ref cleanup.
    useImperativeHandle(userRef, () => host.current!, [])
    return createElement(tag, { ...props, ref: host })
  })
  Host.displayName = 'NEUI(' + tag + ')'
  return Host
}

const hosts = new Map<string, ReturnType<typeof createHost>>()
export function forTag(tag: string) {
  let host = hosts.get(tag)
  if (!host) {
    host = createHost(tag)
    hosts.set(tag, host)
  }
  return host
}
