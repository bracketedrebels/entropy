import { defineConfig } from 'vitest/config'

export default defineConfig({
  css: { postcss: { plugins: [] } },
  test: { environment: 'jsdom', include: ['src/**/*.test.{ts,tsx}', 'stories/**/*.test.tsx'] },
})
