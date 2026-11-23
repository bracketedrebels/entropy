import type { Preview } from '@storybook/react-vite'
import '@fontsource/ubuntu/300.css'
import '../src/styles.css'
import '../stories/canvas.css'

const preview: Preview = {
  globalTypes: {
    theme: { description: 'Материал поверхности', toolbar: { title: 'Тема', icon: 'mirror',
      items: [{ value: 'dark', title: 'Графит' }, { value: 'light', title: 'Светлая' }], dynamicTitle: true } },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [(Story, context) => <div className="tn-surface tn-canvas" data-theme={context.globals.theme}><Story /></div>],
  parameters: {
    layout: 'fullscreen',
    options: { storySort: { order: ['Форма', 'Примитивы', ['Row', 'Reveal', 'Ridge', 'Pill']] } },
  },
}
export default preview
