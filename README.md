# Entropy — первый исполняемый срез

Entropy — Pure Tacit FRP язык графов. В этом репозитории компилятор на MoonBit
превращает s-expression граф в обычный JavaScript, который работает на RxJS.
Пользователь соединяет элементы и подграфы; типы выводятся из структуры графа,
нативных сигнатур и схем валидации.

Первый пример принимает HTTP-запрос и возвращает полное имя:

```http
GET /full-name?first=Dan&last=Mironenko

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"full":"Dan Mironenko"}
```

## Запуск

Нужны Linux/macOS, Node.js 22+ и MoonBit. Проверено на Linux x86_64,
Node.js 24.22.1 и `moonc v0.10.20+65efd5b93` (`moon 0.1.20261104`).
Для native-сборки нужен C toolchain; на Ubuntu — пакет `build-essential`.

Установите [MoonBit](https://www.moonbitlang.com/download). Для воспроизводимой
версии, используемой в CI:

```sh
curl -fsSL https://cli.moonbitlang.com/install/unix.sh -o /tmp/install-moonbit.sh
MOONBIT_INSTALL_VERSION='0.10.20+65efd5b93' bash /tmp/install-moonbit.sh
export PATH="$HOME/.moon/bin:$PATH"
moon -C "$HOME/.moon/lib/core" bundle --target native --warn-list -a
```

Из корня репозитория:

```sh
npm ci
npm test
npm start
```

`npm test` собирает native-компилятор, компилирует пример и запускает тесты.
Сервер запускается на `127.0.0.1:3000`; порт меняется через `PORT`, адрес — через
`HOST`. В другом терминале:

```sh
curl 'http://127.0.0.1:3000/full-name?first=Dan&last=Mironenko'
curl 'http://127.0.0.1:3000/full-name?first=Dan'
```

Второй запрос вернёт 400 с ошибками валидации. Последующие запросы продолжат
обрабатываться. Ctrl+C снимает подписки и закрывает сервер.

Только сборка: `npm run build`. Проверка переносимости ядра:
`npm run test:wasm`. Это исполнение тестов компилятора на Wasm GC;
пользовательская программа пока компилируется только в JS для Node.js.

## Что читать

| Файл | Назначение |
| --- | --- |
| [full-name.ent](examples/full-name/full-name.ent) | Семантические исток и сток, чистое преобразование, весь пример |
| [person.schema.json](examples/full-name/person.schema.json) | Единственный источник типа входных данных |
| [http.ent](modules/http.ent) | Нативные HTTP-элементы и их сигнатуры |
| [stdlib.ent](modules/stdlib.ent) | Stream, Result, map, switchMap, константы, кодек |
| [types.mbt](compiler/types.mbt) | Унификация, generic-параметры, строки именованных полей |
| [compiler.mbt](compiler/compiler.mbt) | Проверка графов и создание типизированного IR |
| [nodejs.mbt](compiler/nodejs.mbt) | Генераторы нативных элементов и JS backend |
| [http.mjs](runtime/http.mjs) | Сервер, корреляция, RxJS-подписки, исполнение ответов |
| [m1.md](docs/m1.md) | Семантика, формат графов и явные границы M1 |
| [moonbit.md](docs/moonbit.md) | Краткий путеводитель по использованным приёмам MoonBit |

В смешанном модуле могут одновременно находиться `native` и `graph`.
Нативность относится к элементу, а не к модулю. Истоки и стоки называются
существительными (`requests`, `responses`), преобразования — глаголами
(`readQuery`, `formatName`, `prepareResponse`).

## Граф без аннотаций типов

```lisp
(graph function formatName (inputs person)
  (node first (field person first))
  (node last (field person last))
  (node joined (call std.join " " (vector first last)))
  (output (tuple (full joined))))
```

Из проекций и сигнатуры `join` компилятор выводит, что `first` и `last` — строки.
Остальные поля аргумента разрешены благодаря полиморфному хвосту кортежа.
Результат — закрытый кортеж с полем `full: String`. Входной HTTP-кодек получает
свой закрытый тип отдельно из JSON Schema, и совместимость проверяется при
композиции.

Сборка оставляет `dist/full-name.mjs` и `dist/full-name.mjs.types.json`.
Второй файл показывает выведенные сигнатуры; он не нужен runtime и не является
местом для пользовательских аннотаций.

## Границы поставки

Это рабочий прототип ядра и одного HTTP endpoint, а не завершённая спецификация
языка. Поддерживается строгое подмножество Draft 7: строки и вложенные закрытые
объекты со всеми обязательными полями. Неподдерживаемые ключевые слова приводят
к ошибке компиляции. Нет редактора, LLM, Trinet-сущностей, рекурсии, литеральных
типов, общего механизма плагинов и других целевых runtime.

Исходный UI-прототип заменён; его история сохранена в Git. Деплой GitHub Pages
заменён проверками компилятора и HTTP-примера. Репозиторий не публикует npm-пакеты
и не разворачивает сервер автоматически.
