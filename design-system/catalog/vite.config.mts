import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { neui } from '@neui/kit/vite'
import { neuicon } from '@neui/icon/vite'
import { catalog } from '@neui/icon/catalog'
import { atlasIcons } from './icons'

export default defineConfig({
  root: 'catalog',
  base: './',
  plugins: [neuicon({ icons: { ...catalog.icons, ...atlasIcons }, pairs: catalog.pairs }), tailwindcss(), neui()],
  esbuild: { jsx: 'automatic' },
  css: { postcss: { plugins: [] } },
  build: { outDir: '../storybook-static', emptyOutDir: true },
})
