// The declarative client and an existing imperative adapter can share one behavior.
export function retain<Key extends object>(start: (key: Key) => () => void) {
  const entries = new WeakMap<Key, { owners: number; stop: () => void }>()
  return (key: Key) => {
    let entry = entries.get(key)
    if (!entry) {
      entry = { owners: 0, stop: start(key) }
      entries.set(key, entry)
    }
    entry.owners++
    let released = false
    return () => {
      if (released) return
      released = true
      if (--entry.owners === 0) { entries.delete(key); entry.stop() }
    }
  }
}
