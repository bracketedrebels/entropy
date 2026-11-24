import type { StorybookConfig } from '@storybook/react-vite'

import { neuicon } from '@neui/icon/vite'
import { neui } from '@neui/kit/vite'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.stories.tsx', '../stories/**/*.mdx'],
  addons: ['@storybook/addon-docs'],
  viteFinal: async config => ({
    ...config,
    base: './',
    plugins: [...(config.plugins ?? []), neuicon({ frames: 120 }), tailwindcss(), neui()],
    // Entropy's webpack app at the repository root has its own PostCSS pipeline.
    css: { ...config.css, postcss: { plugins: [] } },
  }),
}
export default config
