import type { Meta, StoryObj } from '@storybook/react-vite'
import { FocusExample } from './examples/FocusExample'
import source from './examples/FocusExample.tsx?raw'

const meta = {
  id: 'neui-focus',
  title: 'Примитивы/Focus',
  component: FocusExample,
  args: { duration: 'duration-800', easing: 'ease-out' },
  argTypes: {
    duration: { control: 'select', options: ['duration-500', 'duration-800', 'duration-1500'] },
    easing: { control: 'select', options: ['ease-out', 'ease-linear', 'ease-in-out'] },
  },
  tags: ['autodocs'],
  parameters: { docs: { source: { code: source }, description: { component:
    'Нажмите ближе к краю поля. За гребнем поверхность меняет тон и сохраняет его, пока поле в фокусе. Перейдите клавишей Tab, чтобы сразу увидеть тон всего поля.' } } },
} satisfies Meta<typeof FocusExample>

export default meta
export const Tone: StoryObj<typeof meta> = { name: 'Тон при фокусе' }
