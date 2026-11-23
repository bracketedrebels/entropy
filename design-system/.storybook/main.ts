import type { StorybookConfig } from '@storybook/react-vite'

import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.stories.tsx', '../stories/**/*.mdx'],
  addons: ['@storybook/addon-docs'],
  viteFinal: async config => ({
    ...config,
    base: './',
    plugins: [...(config.plugins ?? []), tailwindcss()],
    // Entropy's webpack app at the repository root has its own PostCSS pipeline.
    css: { ...config.css, postcss: { plugins: [] } },
  }),
}
export default config
