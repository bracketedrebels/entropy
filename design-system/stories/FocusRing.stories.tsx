import type { Meta, StoryObj } from '@storybook/react-vite'
import { FocusRingExample } from './examples/FocusRingExample'
import source from './examples/FocusRingExample.tsx?raw'

const meta = {
  id: 'neui-focus-ring',
  title: 'Примитивы/Focus Ring',
  component: FocusRingExample,
  args: { duration: 'duration-1000', easing: 'ease-out' },
  argTypes: {
    duration: { control: 'select', options: ['duration-500', 'duration-1000', 'duration-1500'] },
    easing: { control: 'select', options: ['ease-out', 'ease-linear', 'ease-in-out'] },
  },
  tags: ['autodocs'],
  parameters: { docs: { source: { code: source }, description: { component:
    'Нажмите ближе к краю поля. Контур появляется там, куда дошла волна, и остаётся до потери фокуса. Перейдите клавишей Tab, чтобы сразу увидеть весь контур.' } } },
} satisfies Meta<typeof FocusRingExample>

export default meta
export const Contact: StoryObj<typeof meta> = { name: 'Касание края' }
