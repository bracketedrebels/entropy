import type { Meta, StoryObj } from '@storybook/react-vite'
import { FocusSurfaces } from './examples/FocusSurfaces'
import source from './examples/FocusSurfaces.tsx?raw'

const meta = {
  id: 'neui-focus-surfaces',
  title: 'Эксперименты/Фокус при вводе',
  component: FocusSurfaces,
  parameters: { docs: { source: { code: source } } },
} satisfies Meta<typeof FocusSurfaces>

export default meta
export const Comparison: StoryObj<typeof meta> = { name: 'Сравнение на текстарее' }
