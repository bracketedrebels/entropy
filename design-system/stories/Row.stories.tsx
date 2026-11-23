import type { Meta, StoryObj } from '@storybook/react-vite'
import { RowExample } from './examples/RowExample'
import source from './examples/RowExample.tsx?raw'

const meta = {
  id: 'trinet-row',
  title: 'Примитивы/Row',
  component: RowExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: { code: source },
      description: {
        component: 'Row задаёт сетку и область нажатия. Укажите as="label" для нативной опции, as="button" для действия или оставьте div для редактора. leading, children, description и trailing занимают отдельные места. Ripple принадлежит цели нажатия. Значение и focus остаются у контрола.',
      },
    },
  },
  args: { disabled: false, description: 'На адрес из профиля' },
} satisfies Meta<typeof RowExample>
export default meta

function rowStory(name: string, args: Parameters<typeof RowExample>[0]): StoryObj<typeof meta> {
  const usage = '<RowExample disabled={' + args.disabled + '} description=' + JSON.stringify(args.description) + ' />'
  return { name, args, parameters: { docs: { source: { code: source.trimEnd() + '\n\n' + usage } } } }
}

export const Checkbox = rowStory('Строка выбора', meta.args)
export const Disabled = rowStory('Недоступная опция', { disabled: true, description: 'Укажите адрес в профиле' })
