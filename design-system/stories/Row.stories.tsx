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
        component: 'tn-row задаёт CSS Grid с именованными областями leading, content и trailing. Разместите в них свои элементы классом row-area-*. Нативный label связывает текст и checkbox. useRipple подключает отклик к поверхности строки.',
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
