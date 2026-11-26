import { useId, useState } from 'react'
import { TagField } from '../../stories/form/TagField'

export default function TagsDemo() {
  const [tags, setTags] = useState(['potential', 'frequently_used'])
  const [draft, setDraft] = useState('')
  return <TagField id={useId()} name="tags" label="Теги сводки"
    tags={tags} draft={draft} onChange={(values, text) => { setTags(values); setDraft(text) }} />
}
