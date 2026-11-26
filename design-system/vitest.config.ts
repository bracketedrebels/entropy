import { defineConfig } from 'vitest/config'
import { neui } from '@neui/kit/vite'

export default defineConfig({
  plugins: [neui()],
  css: { postcss: { plugins: [] } },
  test: { environment: 'jsdom', include: ['src/**/*.test.{ts,tsx}', 'stories/**/*.test.tsx', 'vite/*.test.mjs', 'bench/ridge/experiment/*.test.{tsx,mjs}'] },
})
