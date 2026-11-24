// Each glyph is 24 units wide with a full cell of gutter for the Gaussian blur.
const side = 24
export const dissolveFrames = 49
const last = dissolveFrames - 1
export const svgImage = svg => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

export function dissolveSprite(names, icons) {
  const columns = 2 * names.length - 1
  const width = side * columns
  const height = side * dissolveFrames
  const glyphs = names.map((name, i) =>
    `<image x="${2 * i * side}" width="${side}" height="${side}" href="data:image/svg+xml,${encodeURIComponent(icons[name])}"/>`).join('')
  const filters = []
  const rows = []
  for (let i = 1; i <= last; i++) {
    const p = i / last
    const blurId = Math.min(i, last - i)
    if (i <= last / 2) {
      const blur = (side * .36 * p * (1 - p)).toFixed(3)
      filters.push(`<filter id="b${i}" filterUnits="userSpaceOnUse" x="-24" y="-24" width="${width + 48}" height="72"><feGaussianBlur stdDeviation="${blur}"/></filter>`)
    }
    const filter = blurId ? ` filter="url(#b${blurId})"` : ''
    rows.push(`<svg y="${i * side}" width="${width}" height="${side}" overflow="hidden"><use href="#row" opacity="${+p.toFixed(4)}"${filter}/></svg>`)
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><defs><g id="row">${glyphs}</g>${filters.join('')}</defs>${rows.join('')}</svg>`
  return { svg, columns }
}

export function dissolveLayer(mask, index, columns, phase) {
  // CSS mask-position measures the available travel (sprite width minus one glyph).
  const x = columns === 1 ? 0 : 2 * index * 100 / (columns - 1)
  return `${mask} ${x}% calc(round(nearest, ${phase} * ${last}, 1) * 100% / ${last}) / ${columns * 100}% ${dissolveFrames * 100}% no-repeat`
}
