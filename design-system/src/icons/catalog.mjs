import { prepareIcons } from './prepare.mjs'

const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>`
const outline = body => `<g fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${body}</g>`

// The original tag gesture reshapes the body first, then lifts the lid.
function tagToTrash(t) {
  const fold = Math.min(1, t / .76)
  const lift = Math.max(0, (t - .76) / .24)
  const mix = (a, b, amount) => +(a + (b - a) * amount).toFixed(2)
  // Every pose has the same path commands; corresponding coordinates interpolate.
  const poses = [
    'M5 10 L5 21 L19 21 L19 10 M5 10 L10.8 4 Q12 2.5 13.2 4 L19 10 M10.8 8 L12 6.8 L13.2 8 L12 9.2 Z',
    'M6 9 L7.5 21 L16.5 21 L18 9 M3 8 L10 8 Q12 8 14 8 L21 8 M9 8 L9 5.5 L15 5.5 L15 8 Z',
    'M6 9 L7.5 21 L16.5 21 L18 9 M3 8 L9.8 6.4 Q11.8 6 13.8 5.5 L20.6 4 M8.9 6.7 L8.3 4.2 L14.2 2.9 L14.8 5.3 Z',
  ]
  const coordinate = /[\d.]+/g
  const closed = poses[1].match(coordinate).map(Number)
  const open = poses[2].match(coordinate).map(Number)
  let index = 0
  const path = poses[0].replace(coordinate, value => {
    const position = mix(mix(Number(value), closed[index], fold), open[index], lift)
    index++
    return String(position)
  })
  return outline(`<path transform="rotate(${mix(-25, 0, fold)} 12 12)" d="${path}"/>`)
}

const shapes = {
  search: '<circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/>',
  clear: '<path d="m6 6 12 12M18 6 6 18"/>',
  text: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  pencil: '<path d="m4 20 1-5L16.5 3.5a2 2 0 0 1 3 3L8 18.8 4 20ZM14.5 5.5l4 4"/>',
  person: '<circle cx="12" cy="7" r="3.5"/><path d="M4.5 20c.5-4 3.2-6.5 7.5-6.5s7 2.5 7.5 6.5"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
  project: '<path d="M3 7V5h7l2 3h9v12H3V7Z"/>',
  star: '<path d="m12 2.8 2.9 6 6.6.9-4.8 4.7 1.1 6.6-5.8-3.1L6.2 21l1.1-6.6-4.8-4.7 6.6-.9Z"/>',
}
const icons = Object.fromEntries(Object.entries(shapes).map(([name, body]) => [name, svg(outline(body))]))
icons.tag = svg(tagToTrash(0))
icons.trash = svg(tagToTrash(1))

export default prepareIcons({ icons, pairs: [{ from: 'tag', to: 'trash', draw: tagToTrash }] })
