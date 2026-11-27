const paths = {
  layers: '<path d="m3 8 9-5 9 5-9 5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
  wave: '<path d="M2 13h3c2 0 2-8 4-8s3 14 5 14 2-7 4-7h4"/>',
  lamp: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M20.5 14a8.7 8.7 0 0 1-10.6-10.5A8.8 8.8 0 1 0 20.5 14Z"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 5V3H4v13h2"/>',
  braces: '<path d="M9 3H7v6l-3 3 3 3v6h2m6-18h2v6l3 3-3 3v6h-2"/>',
  code: '<path d="m7 7-5 5 5 5m10-10 5 5-5 5m-4-14-3 18"/>',
  github: '<path d="M8 21v-3c-3 .5-4-.6-5-3m13 6v-4c0-1-.3-1.7-.9-2.2 3-.3 5.9-1.5 5.9-6a4.5 4.5 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1 .1-3.4 1.4a13 13 0 0 0-7.1 0C6.7 2.5 5.7 2.4 5.7 2.4a4.3 4.3 0 0 0-.1 3.2A4.5 4.5 0 0 0 4.3 9c0 4.5 2.8 5.6 5.8 5.9-.6.5-1.1 1.5-1.1 2.4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  marker: '<rect x="3" y="8" width="7" height="7" rx="1.5"/><circle cx="17.5" cy="11.5" r="3.5"/>',
  sliders: '<path d="M3 7h4m5 0h9M3 17h10m5 0h3"/><circle cx="9.5" cy="7" r="2.5"/><circle cx="15.5" cy="17" r="2.5"/>',
  expand: '<path d="M4 3h16M4 21h16M12 7v10m-3-7 3-3 3 3m-6 4 3 3 3-3"/>',
  tick: '<path d="m4.5 12 4.5 4.5 10-10"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
}
// The dock masks have a 32-unit em. Open counters and angled terminals keep
// their strokes legible beside Ubuntu Light at the actual navigation size.
const brace = 'M12.6 3.6 12.3 5.2C9.7 5.4 9 6.7 9 9.3v2.5c0 2.1-.8 3.6-2.3 4.2C8.2 16.6 9 18.1 9 20.2v2.5c0 2.6.7 3.9 3.3 4.1l.3 1.6c-3.8 0-5.4-2-5.4-5.6v-2.5c0-2.1-.8-3.3-3.1-3.5v-1.6c2.3-.2 3.1-1.4 3.1-3.5V9.2c0-3.6 1.6-5.6 5.4-5.6Z'
const orbit = 'M26.5 12.6c-2.4-1.4-6.1-2.1-10.5-2.1-7.3 0-12.8 2.3-12.8 5.5s5.5 5.5 12.8 5.5c6.5 0 11.4-1.8 12.6-4.2'
const dockGlyphs = {
  'dock-css': `<path d="${brace}"/><path d="${brace}" transform="translate(32) scale(-1 1)"/>`,
  'dock-vite': '<path fill-rule="evenodd" d="m20 2.8-2 9.8h8.1L12.3 29.4l1.9-11.1H6.3L18.5 3.5Zm-3.1 6.1L9.6 16.6h6.8l-1.2 7.1 7.3-9.4h-6.7Z"/>',
  'dock-react': `<g fill="none" stroke="black" stroke-width="1.45" stroke-linecap="round"><path d="${orbit}"/><path d="${orbit}" transform="rotate(60 16 16)"/><path d="${orbit}" transform="rotate(120 16 16)"/></g>`,
  'dock-recipes': '<g fill="none" stroke="black" stroke-width="1.7" stroke-linejoin="round"><path d="M16 10.4C12.7 7.3 8.8 6 3.1 6.2v17.2c5.5-.2 9.5 1 12.9 3.6 3.4-2.6 7.4-3.8 12.9-3.6V6.2c-5.7-.2-9.6 1.1-12.9 4.2Zm0 0v16.1"/><path d="M20.1 10.7c1.5-.8 3-1.3 4.7-1.5" stroke-linecap="round"/></g>',
  'dock-philosophy': '<path d="m16.5 28.8-2.1.5V15.1c0-5.6 2.3-9.1 6.2-9.1 4.2 0 6.8 3.7 6.8 8.3 0 6.3-4.6 10.3-11.6 10.3-6.6 0-11.4-3.7-11.4-9.3 0-4.2 2.5-7.7 6.1-9.3l.7 1.5c-3 1.5-4.9 4.1-4.9 7.7 0 4.4 3.8 7.6 9.5 7.6 5.9 0 9.6-3.2 9.6-8.4 0-3.6-1.7-6.6-4.8-6.6-2.7 0-4.1 2.9-4.1 7.4Z"/>',
}
export const atlasIcons = {
  ...Object.fromEntries(Object.entries(paths).map(([name, body]) => [name,
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>',
  ])),
  ...Object.fromEntries(Object.entries(dockGlyphs).map(([name, body]) => [name,
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' + body + '</svg>',
  ])),
}
