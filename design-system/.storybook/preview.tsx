import type { Preview } from '@storybook/react-vite'
import '@fontsource/ubuntu/300.css'
import '@neui/kit/ripple'
import './catalog.css'
import '../stories/canvas.css'

const preview: Preview = {
  globalTypes: {
    theme: { description: 'Материал поверхности', toolbar: { title: 'Тема', icon: 'mirror',
      items: [{ value: 'dark', title: 'Графит' }, { value: 'light', title: 'Светлая' }], dynamicTitle: true } },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [(Story, context) => <div className="neui-surface neui-canvas" data-theme={context.globals.theme}>
    <div className="mx-auto w-full max-w-[430px]"><Story /></div>
  </div>],
  parameters: {
    layout: 'fullscreen',
    docs: { codePanel: true, source: { type: 'code', language: 'tsx' } },
    options: { storySort: { order: ['Форма', 'Примитивы', ['Row', 'Ripple', 'Reveal', 'Ridge', 'Field', 'Pill']] } },
  },
}
export default preview
