import type { Meta, StoryObj } from '@storybook/react-vite'
import { RevealExample } from './examples/RevealExample'
import source from './examples/RevealExample.tsx?raw'

const meta = {
  id: 'trinet-reveal',
  title: 'Примитивы/Reveal',
  component: RevealExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: { code: source },
      description: {
        component: 'Управляемый Reveal принимает open, children и необязательный collapsed. Раскрытие сдвигает соседей. Повторите нажатие в середине движения, чтобы развернуть его. Черновик остаётся в смонтированном редакторе. Скрытая область исключена из навигации. Хозяин формы управляет участием контрола в отправке.',
      },
    },
  },
} satisfies Meta<typeof RevealExample>
export default meta
export const Conditional: StoryObj<typeof meta> = { name: 'Условный адрес' }
