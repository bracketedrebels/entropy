export type Option = readonly [id: string, title: string, description?: string, disabled?: boolean]

export const frequency = [
  ['instant', 'Сразу', 'Каждое важное событие'],
  ['daily', 'Раз в день', 'Одна сводка в конце дня'],
  ['weekly', 'Раз в неделю', 'Главное за последние семь дней'],
  ['custom', 'По расписанию', 'Индивидуальное расписание недоступно в прототипе', true],
] as const satisfies readonly Option[]

export const format = [
  ['brief', 'Коротко', 'Только заголовки событий'],
  ['details', 'С подробностями', 'Заголовки, авторы и описание изменений'],
] as const satisfies readonly Option[]

export const emptyDigest = [
  ['skip', 'Пропустить выпуск', 'Следующая сводка придёт, когда появятся события'],
  ['send', 'Прислать пустую сводку', 'Сообщить, что за период событий не было'],
] as const satisfies readonly Option[]

export const channels: readonly Option[] = [
  ['inbox', 'Входящие Trinet', 'Во вкладку уведомлений'],
  ['email', 'Электронная почта', 'На адрес профиля или другой указанный адрес'],
  ['mobile', 'Уведомления телефона', 'На экран мобильного устройства'],
  ['browser', 'Уведомления браузера', 'На рабочий стол через браузер'],
  ['chat', 'Личный чат', 'Сообщением от бота в мессенджере'],
  ['team', 'Канал команды', 'В общую ленту рабочего чата'],
]

const projectProducts = [
  ['trinet','Trinet'], ['entropy','Entropy'], ['atlas','Атлас'], ['orbit','Орбита'],
  ['north','Север'], ['vector','Вектор'], ['pulse','Пульс'], ['signal','Сигнал'],
  ['beacon','Маяк'], ['spectrum','Спектр'], ['rhythm','Ритм'], ['core','Ядро']
]
const projectAreas = [
  ['design','Дизайн-система'], ['search','Поиск'], ['automation','Автоматизация'],
  ['mobile','Мобильное приложение'], ['reports','Отчёты'], ['access','Управление доступом'],
  ['integrations','Интеграции'], ['events','Журнал событий'], ['docs','Документация'],
  ['notifications','Уведомления'], ['analytics','Аналитика'], ['import','Импорт данных']
]
export const projects: readonly Option[] = projectProducts.flatMap(([product, name]) =>
  projectAreas.map(([area, title]) => [product + '-' + area, name + ' · ' + title] as const)
)


export const initialIntro = `Доброе утро, команда!
Вот новости проекта за неделю.

Мы выпустили обновление формы.
Теперь она запоминает черновики.
Поиск по задачам тоже готов.
Его уже можно попробовать.

Дальше займёмся уведомлениями.
В пятницу покажем первый вариант.
До встречи на демо!`
