import { expect, it, vi } from 'vitest'
import { trackGrainViewport } from './viewport'

it('holds the tile at one screen pixel through desktop zoom, pinch and pan', () => {
  const style = document.createElement('div').style
  const viewport = Object.assign(new EventTarget(), { scale: 1, offsetLeft: 0, offsetTop: 0 })
  const listen = vi.spyOn(viewport, 'addEventListener')
  const query = () => new EventTarget()
  const matchMedia = vi.fn(query)
  const win = { document: { documentElement: { style } }, devicePixelRatio: 2, visualViewport: viewport, matchMedia }
  const stop = trackGrainViewport(win as unknown as Window)
  expect(listen.mock.calls.map(([name]) => name)).toEqual(['resize'])
  const scale = () => Number(style.getPropertyValue('--_neui-grain-scale'))
  expect(scale()).toBe(2)

  const monitor = matchMedia.mock.results[0].value
  win.devicePixelRatio = 2.5
  monitor.dispatchEvent(new Event('change'))
  expect(scale()).toBe(2.5)
  expect(matchMedia).toHaveBeenLastCalledWith('(resolution: 2.5dppx)')

  viewport.scale = 2
  viewport.dispatchEvent(new Event('resize'))
  expect(scale()).toBe(5)
  viewport.offsetLeft = 10.25
  viewport.offsetTop = 24.77
  viewport.dispatchEvent(new Event('scroll'))
  expect(scale()).toBe(5)
  expect(style.length).toBe(1)

  stop()
  viewport.dispatchEvent(new Event('resize'))
  matchMedia.mock.results[1].value.dispatchEvent(new Event('change'))
  expect(style.getPropertyValue('--_neui-grain-scale')).toBe('')
  expect(style.length).toBe(0)
})
