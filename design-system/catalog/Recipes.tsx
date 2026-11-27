import { useState } from 'react'
import type { ComponentType } from 'react'
import { CatalogSection } from './CatalogSection'
import { Intro, Code } from './components'
import DateDemo from './recipes/DateDemo'
import PeriodDemo from './recipes/PeriodDemo'
import TagsDemo from './recipes/TagsDemo'
import ProjectsDemo from './recipes/ProjectsDemo'
import TableDemo from './recipes/TableDemo'
import { RangeExample } from '../stories/examples/RangeExample'
import { NotificationSettings } from '../stories/form/NotificationSettings'

const sources = import.meta.glob<string>(['./recipes/*.tsx', '../stories/form/*.{ts,tsx,css}', '!../stories/form/*.test.tsx',
  '../stories/examples/RangeExample.tsx', '../stories/canvas.css', '../recipes/*.tsx'], {query: '?raw', import:'default', eager:true})
function source(file: string) {
  const entry = Object.entries(sources).find(([path]) => path.endsWith('/' + file))
  if (!entry) throw new Error('Не найден исходник ' + file)
  return entry[1]
}
interface Recipe {id:string; name:string; icon:string; text:string; View:ComponentType; files:string[]}
const recipes: Recipe[] = [
  {id:'date',name:'Календарь',icon:'calendar',text:'Выберите сегмент даты. После выбора года ассистент переходит к месяцу и дню. На каждой сетке доступны соседние страницы.',View:DateDemo,files:['DateDemo.tsx','CalendarField.tsx','CalendarPanel.tsx','DateSegments.tsx','useCalendarDrag.ts','canvas.css']},
  {id:'period',name:'Диапазон дат',icon:'calendar',text:'У начала и конца интервала свои сегменты. Выбор первого дня переводит ассистент к дню окончания.',View:PeriodDemo,files:['PeriodDemo.tsx','CalendarRangeField.tsx','CalendarPanel.tsx','DateSegments.tsx','canvas.css']},
  {id:'range',name:'Слайдер',icon:'sliders',text:'Нативная шкала с дискретным шагом. Стрелки клавиатуры двигают ручку, значение остаётся в мета-пиле.',View:RangeExample,files:['RangeExample.tsx','canvas.css']},
  {id:'tags',name:'Теги',icon:'tag',text:'Enter добавляет тег в список. Потяните строку вправо для удаления или выберите тег и воспользуйтесь действием удаления.',View:TagsDemo,files:['TagsDemo.tsx','TagField.tsx','tags.css','Field.tsx']},
  {id:'projects',name:'Выбор с поиском',icon:'search',text:'Большой справочник раскрывается в потоке страницы. Поиск и выбранные значения остаются частями одного поля.',View:ProjectsDemo,files:['ProjectsDemo.tsx','ChoicePicker.tsx','OptionRow.tsx','useChoiceWindow.ts','options.ts','canvas.css']},
  {id:'table',name:'Таблица',icon:'grid',text:'Нативная таблица с заголовками и независимым выбором строк. Счётчик внизу читает то же состояние, что и чекбоксы.',View:TableDemo,files:['TableDemo.tsx']},
  {id:'settings',name:'Настройки сводки',icon:'layers',text:'Полная форма прототипа. Здесь можно проверить совместную работу полей, общий скролл, черновики и условную доставку по почте.',View:() => <NotificationSettings embedded />,files:['NotificationSettings.tsx','settings.ts','options.ts','EmailField.tsx','RetryIntervalField.tsx','DeliveryOrderField.tsx','TextField.tsx','canvas.css']},
]
function RecipeDetail({recipe}: {recipe:Recipe}) {
  const [file,setFile] = useState(recipe.files[0])
  const {View} = recipe
  return <CatalogSection className="recipe-detail" id={'recipes/' + recipe.id} label={recipe.name}>
    <p className="recipe-description">{recipe.text}</p>
    <div className="recipe-stage"><div className="neui-example"><View /></div></div>
    <div className="source-heading"><h3>Исходный код</h3>
      <select value={file} aria-label="Исходный файл рецепта" onChange={e=>setFile(e.target.value)}>
        {recipe.files.map(f=><option key={f}>{f}</option>)}
      </select></div>
    <Code source={source(file)} filename={file} key={file} folded />
  </CatalogSection>
}
export default function Recipes() {
  return <><Intro subtitle="Рабочие поля из примитивов NEUI. Забирайте разметку, меняйте поведение и подключайте свои данные." />
    <div className="doc-sections">{recipes.map(recipe => <RecipeDetail key={recipe.id} recipe={recipe} />)}</div></>
}
