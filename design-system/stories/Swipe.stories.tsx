import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagField } from './form/TagField'
import source from './form/TagField.tsx?raw'

function TagsExample() {
  const [tags, setTags] = useState(['potential', 'frequently_used'])
  const [draft, setDraft] = useState('')
  return <div className="neui-example"><TagField id="swipe-tags" label="Теги сводки" name="tags"
    tags={tags} draft={draft} onChange={(values, text) => { setTags(values); setDraft(text) }} /></div>
}

const meta = {
  id: 'neui-swipe', title: 'Примитивы/Swipe', component: TagsExample, tags: ['autodocs'],
  parameters: { docs: { source: { code: source }, description: { component:
    'Потяните тег вправо до полного появления «Удалить». Верните палец до порога, чтобы отменить действие. Клик по тегу открывает кнопку удаления. Enter в поле добавляет тег.' } } },
} satisfies Meta<typeof TagsExample>

export default meta
export const Tags: StoryObj<typeof meta> = { name: 'Теги и удаление' }
