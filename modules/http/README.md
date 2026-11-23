# HTTP

Модуль с namespace `http`. Его публичные декларации (`module.ent`), JS-реализация
(`runtime.mjs`), MoonBit-генератор (`nodejs.mbt`), манифесты и собственные тесты
находятся в этой папке.

`package.json.entropy.dependencies` явно подключает соседний stdlib: его типы
Stream, JSON и ValidationErrors нужны сигнатурам HTTP. Зависимость указывает на
публичный манифест `../stdlib/package.json`, а внутренние файлы HTTP разрешаются
локально. npm-зависимость runtime — RxJS; она объявлена в этом же package.json.

Подключение проекта:

```json
{
  "target": "nodejs",
  "modules": ["path/to/http/package.json", "application.ent"],
  "config": { "path": "/example", "hostname": "127.0.0.1", "port": 3000 }
}
```

Загрузчик автоматически добавляет транзитивную зависимость stdlib один раз.
Сам проект не перечисляет `http/module.ent` и `http/runtime.mjs` отдельно.

`nodejs.mbt` описывает bindings и обёртку программы с HTTP-host. Именно модуль
создаёт `host`, подставляет статическую конфигурацию и возвращает
`host.program(...)`. Компилятор получает общий контракт backend и не импортирует
HTTP; при сборке проекта без этого модуля не возникает HTTP-импортов или сервера.
В M1 одновременно поддерживается один владелец program-host.

Нативный исток `http.requests` — разделяемый Observable. `readQuery` извлекает
query-параметры; `getPayload` возвращает значение запроса. Чистые `makeOk`,
`makeBadRequest`, `makeResponse` строят описание ответа. Только сток `responses`
пишет в сокет. Корреляция запроса с ответом хранится в opaque capability.

M1 обслуживает один GET endpoint. Таймаут, отключение клиента, повторные ответы,
ошибки потока и освобождение ресурсов проверяются в `test/runtime.test.mjs`.
Интеграционные тесты скомпилированного примера находятся в корневом `test/`,
поскольку проверяют совместную работу нескольких модулей и компилятора.

Из корня после `npm ci`:

```sh
npm test --workspace @entropy/http
```

Обычный `npm test` также запускает эти проверки. Публикация npm-пакета и другие
HTTP runtime пока не реализованы.
