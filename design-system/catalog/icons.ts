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
// A 1.35-unit stroke on the 24-unit grid renders just over 1px at the dock's 20px size.
const dockGlyphs = {
  'dock-css': '<path d="M5 3.5h14v7.8H5zM5 8.4h14M10.4 11.3v7.8a1.6 1.6 0 0 0 3.2 0v-7.8"/>',
  'dock-vite': '<path d="m14.2 2.8-10.6 11h7.2l-1 7.4 10.6-12H13z"/>',
  'dock-react': '<path d="m7.1 7.9-4.4 4.1 4.4 4.1m9.8-8.2 4.4 4.1-4.4 4.1m-3.2-11-3.4 13.8"/>',
  'dock-recipes': '<path d="M12 6.4C9.4 4.8 6.2 4.4 2.8 5v13.7c3.5-.6 6.5-.2 9.2 1.4 2.7-1.6 5.7-2 9.2-1.4V5c-3.4-.6-6.6-.2-9.2 1.4Zm0 0v13.7"/>',
  'dock-philosophy': '<path d="M9.1 16.4c0-2-3.2-3.4-3.2-7.2a6.1 6.1 0 1 1 12.2 0c0 3.8-3.2 5.2-3.2 7.2Zm.7 3.3h4.4"/>',
}
export const atlasIcons = {
  ...Object.fromEntries(Object.entries(paths).map(([name, body]) => [name,
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>',
  ])),
  ...Object.fromEntries(Object.entries(dockGlyphs).map(([name, body]) => [name,
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>',
  ])),
}
