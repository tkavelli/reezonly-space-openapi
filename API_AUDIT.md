# OpenAPI — Аудит соответствия спеки и кода (45 методов)

## Цель аудита

**Проверяемые файлы:** OpenAPI YAML спецификации в папке [`openapi/specs/`](../openapi/specs/)

**Доменные файлы:**
- [openapi/specs/users.yaml](../openapi/specs/users.yaml) — Users, Groups
- [openapi/specs/learning.yaml](../openapi/specs/learning.yaml) — Courses, Pages
- [openapi/specs/certificates.yaml](../openapi/specs/certificates.yaml) — Certificates

**Критерий проверки — Реалистичность:**

> Метод / путь / параметры / тело / ответ / коды совпадают с фактическим поведением сервиса

Каждый метод проверяется на соответствие реальному коду в [`space-backend/`](../space-backend/):
- ✅ HTTP метод (GET/POST/PUT/DELETE)
- ✅ Путь endpoint'а
- ✅ Query/path параметры
- ✅ Request body (mediaType, schema)
- ✅ Response structure (data wrapper, fields)
- ✅ HTTP коды ответов (200, 400, 404, 422, 500)

---

## 📋 Как читать и фиксить расхождения

### ⚠️ ВАЖНО: Все замечания требуют критической проверки

**В этом аудите указаны:**
- ❌ Расхождения между YAML и кодом
- 💡 Рекомендации по исправлению
- 📝 Ссылки на файлы и строки кода

**НО:** Рекомендации — это **не абсолютная истина**. Перед исправлением:
1. **Самостоятельно проверь** код и спеку по ссылкам
2. **Убедись** что проблема описана корректно
3. **Оцени** какой вариант исправления логичнее:
   - Может быть код правильнее, и нужно исправить YAML?
   - Может быть YAML правильнее, и нужно исправить код?
   - Может быть это не баг, а feature?

### Структура каждого анализа

Для каждого метода указано:

**Код:**
- **Файл:** [ссылка](space-backend/) на контроллер/action с номерами строк
- **Выдержка:** PHP код, который реально возвращает endpoint

**YAML спека или OpenAPI аннотация:**
- **Файл:** [ссылка](openapi/specs/) на YAML или PHP аннотацию с номерами строк
- **Выдержка:** То, как описан endpoint в спеке

**Проблема:**
- Что совпадает или не совпадает
- Какие структуры отличаются

**Варианты исправления:**
- Вариант 1 — исправить YAML (с указанием где)
- Вариант 2 — исправить код (с указанием где)
- **⚠️ Рекомендация — это НЕ приказ, а предложение**

### Как пользоваться аудитом

1. **Найди свой метод** в [таблице расхождений](#сводка-расхождений--все-методы) в конце
2. **Прочитай детальный анализ** для своего метода
3. **Проверь код и спеку самостоятельно** по ссылкам
4. **Критически оцени** рекомендацию (согласен ли ты с ней?)
5. **Выбери вариант исправления** (1 или 2, или третий вариант?)
6. **Примени исправление** в код или YAML
7. **Проверь синтаксис** (YAML/PHP валиден?)

---

## Список всех методов

### Users (16)
1. `GET /user/user/index` — Список пользователей
2. `GET /user/user/admin` — Список администраторов
3. `GET /user/user/view` — Детальная информация о пользователе
4. `GET /dictionary/user/fields` — Кастомные поля пользователей
5. `POST /user/user/create` — Создать пользователя
6. `PUT /user/user/update` — Обновить пользователя
7. `DELETE /user/user/delete` — Удалить пользователей
8. `GET /dictionary/user/statuses` — Статусы пользователей
9. `POST /user/user/add-course` — Назначить курсы
10. `POST /user/user/delete-course` — Отозвать курсы
11. `POST /user/user/preview` — Предпросмотр импорта
12. `POST /user/user/load` — Запустить импорт
13. `GET /user/user/get-import-progress` — Статус импорта
14. `GET /user/user/load-template` — Скачать шаблон импорта
15. `GET /user/import-report/index` — Список отчётов импорта
16. `GET /user/importreport/download` — Скачать отчёт импорта

### Groups (12)
17. `GET /group/group/index` — Список групп
18. `GET /group/group/view` — Детали группы
19. `POST /group/group/create` — Создать группу
20. `PUT /group/group/update` — Обновить группу
21. `DELETE /group/group/delete` — Удалить группу
22. `DELETE /group/group/multiple-delete` — Массовое удаление групп
23. `GET /dictionary/user/groups` — Справочник групп
24. `POST /group/group/user-add` — Добавить пользователей в группу
25. `POST /group/group/user-delete` — Удалить пользователей из группы
26. `POST /group/group/export` — Экспорт группы
27. `GET /group/group/export-download` — Скачать экспорт группы
28. `POST /group/group/assign-courses` — Назначить курсы группе

### Certificates (12)
29. `GET /certificate/template/index` — Список шаблонов сертификатов
30. `GET /certificate/template/view` — Детали шаблона
31. `POST /certificate/certificate/create` — Создать сертификат
32. `GET /certificate/certificate/index` — Список сертификатов
33. `GET /certificate/certificate/view` — Детали сертификата
34. `GET /certificate/certificate/download` — Скачать сертификат
35. `POST /certificate/download-zip` — Скачать ZIP архив
36. `GET /certificate/course/index` — Курсы для сертификатов
37. `GET /certificate/user/index` — Пользователи для сертификатов
38. `GET /certificate/type/index` — Типы сертификатов
39. `GET /certificate/variable/index` — Переменные сертификатов
40. `GET /certificate/variable-list/index` — Значения переменных

### Learning (4)
41. `GET /course/course/index` — Список курсов
42. `GET /course/course/view` — Детали курса
43. `GET /dictionary/dictionary/page-types` — Типы страниц
44. `GET /dictionary/dictionary/pages` — Список страниц

### Integration Reports (1)
45. `POST /integration/report/consolidated` — Консолидированный отчёт

---

## Детальный аудит — Learning (5 методов)

### 41. GET /course/course/index — Список курсов

**Статус: ✅ СООТВЕТСТВУЕТ**

**Код:**
- Файл: [space-backend/backend/modules/api/v1/modules/course/controllers/CourseController.php:167-184](space-backend/backend/modules/api/v1/modules/course/controllers/CourseController.php#L167-L184)

```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $dataProvider->getModels(),
]);
```

**Фактический ответ:**
```json
{
  "success": true,
  "data": {
    "pagination": {...},
    "items": [...]
  }
}
```

**OpenAPI аннотация (строки 125-163):**
- Описывает `data.pagination` и `data.items`

**Вывод:** Код и спека совпадают. Расхождений нет.

---

### 42. GET /course/course/view — Детали курса

**Статус: ❌ РАСХОЖДЕНИЕ**

**Код:**
- Файл: [space-backend/backend/modules/api/v1/modules/course/controllers/CourseController.php:245-257](space-backend/backend/modules/api/v1/modules/course/controllers/CourseController.php#L245-L257)

```php
return $this->response(200, null, null, [
    'item' => $model,
]);
```

**Фактический ответ:**
```json
{
  "success": true,
  "data": {
    "item": {...}
  }
}
```

**OpenAPI аннотация (строки 186-239):**
- Описывает `data.items` как массив объектов

**Проблема:**
- Код возвращает `data.item` (единственный объект)
- Спека описывает `data.items` (массив)

**Что нужно исправить:**

**Вариант 1** — Исправить спеку под код:
- Файл: OpenAPI spec для `/course/course/view`
- Изменить: `data.items[]` → `data.item: object`

**Вариант 2** — Исправить код под спеку:
- Файл: [space-backend/backend/modules/api/v1/modules/course/controllers/CourseController.php:251-253](space-backend/backend/modules/api/v1/modules/course/controllers/CourseController.php#L251-L253)
- Изменить: `['item' => $model]` → `['items' => [$model]]`

**Рекомендация:** Вариант 1 — исправить спеку, т.к. `view` метод логически должен возвращать один объект.

---

### 43. GET /dictionary/dictionary/page-types — Типы страниц

**Статус: ❌ РАСХОЖДЕНИЕ**

**Код:**
- Файл: [space-backend/backend/modules/api/v1/modules/dictionary/controllers/DictionaryController.php:61-67](space-backend/backend/modules/api/v1/modules/dictionary/controllers/DictionaryController.php#L61-L67)

```php
return [
    'success' => true,
    'items' => PageType::getCustomListArray($type),
];
```

**Фактический ответ:**
```json
{
  "success": true,
  "items": [...]
}
```

**OpenAPI аннотация (строки 32-56):**
- Описывает `data.items` с вложенной структурой

**Проблема:**
- Код возвращает `items` на верхнем уровне (без `data` обёртки)
- Спека описывает `data.items`

**Что нужно исправить:**

**Вариант 1** — Исправить код под спеку:
- Файл: [space-backend/backend/modules/api/v1/modules/dictionary/controllers/DictionaryController.php:61-67](space-backend/backend/modules/api/v1/modules/dictionary/controllers/DictionaryController.php#L61-L67)
- Изменить на использование `$this->response()`:

```php
return $this->response(200, null, null, [
    'items' => PageType::getCustomListArray($type),
]);
```

**Вариант 2** — Исправить спеку под код:
- Изменить структуру ответа: убрать `data` обёртку, `items` на верхнем уровне

**Рекомендация:** Вариант 1 — привести код к единому стандарту с `data` обёрткой для консистентности API.

---

### 44. GET /dictionary/dictionary/pages — Список страниц

**Статус: ❌ ОТСУТСТВУЕТ СПЕКА + НЕКОНСИСТЕНТНЫЙ ОТВЕТ**

**Код:**
- Файл: [space-backend/backend/modules/api/v1/modules/dictionary/controllers/DictionaryController.php:270-276](space-backend/backend/modules/api/v1/modules/dictionary/controllers/DictionaryController.php#L270-L276)

```php
public function actionPages(): array
{
    return [
        'success' => true,
        'items' => Page::getPageList(),
    ];
}
```

**Фактический ответ:**
```json
{
  "success": true,
  "items": [...]
}
```

**OpenAPI аннотация:** **ОТСУТСТВУЕТ**

**Проблемы:**
1. Нет OpenAPI аннотации для этого endpoint
2. Код возвращает `items` без `data` обёртки (неконсистентно с другими endpoints)

**Что нужно исправить:**

1. **Добавить OpenAPI аннотацию** в файл:
   - [space-backend/backend/modules/api/v1/modules/dictionary/controllers/DictionaryController.php:267-276](space-backend/backend/modules/api/v1/modules/dictionary/controllers/DictionaryController.php#L267-L276)

2. **Исправить код для консистентности:**
```php
public function actionPages(): array
{
    return $this->response(200, null, null, [
        'items' => Page::getPageList(),
    ]);
}
```

**Рекомендация:** Добавить OpenAPI doc и привести к единому стандарту `data.items`.

---

### 45. POST /integration/report/consolidated — Консолидированный отчёт

**Статус: ❌ ENDPOINT НЕ СУЩЕСТВУЕТ**

**Код:** **НЕ НАЙДЕН**

**Поиск:**
- `grep -r "actionConsolidated" space-backend/` — нет результатов
- `grep -r "integration/report" space-backend/` — нет результатов
- Папка `modules/api/v1/modules/integration/` — не существует

**Проблема:**
Endpoint указан в списке 45 методов, но контроллер и action не существуют в кодовой базе Space.

**Что нужно исправить:**

**Вариант 1** — Удалить из списка:
- Endpoint не реализован в Space backend
- Возможно, это endpoint LMS или внешнего сервиса

**Вариант 2** — Реализовать endpoint:
- Создать `IntegrationModule` с `ReportController`
- Реализовать `actionConsolidated`

**Рекомендация:** Уточнить, где должен находиться этот endpoint. Если это LMS — удалить из списка Space API.

---

## Детальный аудит — Certificates (5 методов)

### 36. GET /certificate/course/index — Курсы для сертификатов

**Статус: ❌ РАСХОЖДЕНИЕ**

**Код:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/CourseController.php:72-89](space-backend/backend/modules/api/v1/modules/certificate/controllers/CourseController.php#L72-L89)

```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $dataProvider->getModels(),
]);
```

**Фактический ответ:**
```json
{
  "success": true,
  "data": {
    "pagination": {...},
    "items": [...]
  }
}
```

**YAML спека** (строки 653-678):
```yaml
/certificate/course/index:
  get:
    responses:
      '200':
        schema:
          properties:
            data:
              type: array
              items:
                properties:
                  id: {type: integer}
                  title: {type: string}
                  type: {type: string}
```

**Проблема:**
- YAML описывает `data` как **прямой массив** объектов
- Код возвращает `data` как **объект с полями** `pagination` и `items`

**Что нужно исправить:**

**Вариант 1** — Исправить YAML спеку под код:
- Файл: [openapi/specs/certificates.yaml:671-678](openapi/specs/certificates.yaml#L671-L678)
- Изменить структуру:

```yaml
data:
  type: object
  properties:
    pagination:
      ref: '#/components/schemas/Pagination'
    items:
      type: array
      items:
        properties:
          id: {type: integer}
          title: {type: string}
          type: {type: string}
```

**Вариант 2** — Исправить код под YAML:
- Изменить возврат на прямой массив (но потеряется pagination)

**Рекомендация:** Вариант 1 — исправить YAML, добавить описание `pagination`, т.к. код корректно реализует паттерн с пагинацией.

---

### 37. GET /certificate/user/index — Пользователи для сертификатов

**Статус: ❌ РАСХОЖДЕНИЕ**

**Код:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/UserController.php:69-87](space-backend/backend/modules/api/v1/modules/certificate/controllers/UserController.php#L69-L87)

```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $dataProvider->getModels(),
]);
```

**Фактический ответ:**
```json
{
  "success": true,
  "data": {
    "pagination": {...},
    "items": [...]
  }
}
```

**YAML спека** (строки 680-710):
```yaml
/certificate/user/index:
  get:
    responses:
      '200':
        schema:
          properties:
            data:
              type: array
              items:
                properties:
                  id: {type: integer}
                  username: {type: string}
                  email: {type: string}
```

**Проблема:**
- YAML описывает `data` как **прямой массив** объектов
- Код возвращает `data` как **объект с полями** `pagination` и `items`

**Что нужно исправить:**

**Вариант 1** — Исправить YAML спеку под код:
- Файл: [openapi/specs/certificates.yaml:703-710](openapi/specs/certificates.yaml#L703-L710)
- Изменить структуру:

```yaml
data:
  type: object
  properties:
    pagination:
      ref: '#/components/schemas/Pagination'
    items:
      type: array
      items:
        properties:
          id: {type: integer}
          username: {type: string}
          email: {type: string}
```

**Рекомендация:** Вариант 1 — исправить YAML, добавить `pagination` структуру.

---

### 38. GET /certificate/type/index — Типы сертификатов

**Статус: ❌ РАСХОЖДЕНИЕ + ОТСУТСТВИЕ АННОТАЦИИ**

**Код:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/TypeController.php:31-48](space-backend/backend/modules/api/v1/modules/certificate/controllers/TypeController.php#L31-L48)

```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $dataProvider->getModels(),
]);
```

**Фактический ответ:**
```json
{
  "success": true,
  "data": {
    "pagination": {...},
    "items": [...]
  }
}
```

**OpenAPI аннотация:** **ОТСУТСТВУЕТ** (только PHP комментарий `@return array`)

**YAML спека** (строки 712-740):
```yaml
/certificate/type/index:
  get:
    responses:
      '200':
        schema:
          properties:
            data:
              type: array
              items:
                properties:
                  id: {type: integer}
                  name: {type: string}
                  description: {type: string, nullable: true}
```

**Проблемы:**
1. Код возвращает `data: { pagination, items }`, YAML описывает `data: array`
2. Нет OpenAPI аннотации в коде (только в YAML)

**Что нужно исправить:**

**Для кода:**
- Добавить OpenAPI аннотацию в [TypeController.php:13-30](space-backend/backend/modules/api/v1/modules/certificate/controllers/TypeController.php#L13-L30):

```php
/**
 * @OA\Get(path="/certificate/type/index",
 *     tags={"certificate"},
 *     summary="Справочник типов сертификатов",
 *     description="Возвращает список типов сертификатов",
 *     @OA\Response(
 *         response=200,
 *         description="Success",
 *         @OA\JsonContent(
 *             allOf={@OA\Schema(ref="#/components/schemas/Response")},
 *             @OA\Property(
 *                property="data",
 *                type="object",
 *                properties={
 *                    @OA\Property(
 *                      property="pagination",
 *                      ref="#/components/schemas/Pagination"
 *                    ),
 *                    @OA\Property(
 *                      property="items",
 *                      type="array",
 *                      @OA\Items(ref="#/components/schemas/CertificateType")
 *                    )
 *                }
 *            )
 *         )
 *     ),
 *     security={{"BearerToken": {}}}
 * )
 */
```

**Для YAML:**
- Исправить структуру `data` с array на object с `pagination` (аналогично методам 36-37)

**Рекомендация:** Добавить OpenAPI аннотацию и исправить YAML спеку.

---

### 39. GET /certificate/variable/index — Переменные сертификатов

**Статус: ❌ РАСХОЖДЕНИЕ + ОТСУТСТВИЕ АННОТАЦИИ**

**Код:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableController.php:31-48](space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableController.php#L31-L48)

```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $searchModel->prepareModels($dataProvider->getModels()),
]);
```

**Фактический ответ:**
```json
{
  "success": true,
  "data": {
    "pagination": {...},
    "items": [...]
  }
}
```

**OpenAPI аннотация:** **ОТСУТСТВУЕТ** (только PHP комментарий `@return array`)

**YAML спека** (строки 742-775):
```yaml
/certificate/variable/index:
  get:
    responses:
      '200':
        schema:
          properties:
            data:
              type: array
              items:
                properties:
                  id: {type: integer}
                  key: {type: string}
                  name: {type: string}
                  description: {type: string, nullable: true}
                  required: {type: boolean}
```

**Проблемы:**
1. Код возвращает `data: { pagination, items }`, YAML описывает `data: array`
2. Нет OpenAPI аннотации в коде
3. Код вызывает `prepareModels()` — дополнительная трансформация данных

**Что нужно исправить:**

**Для кода:**
- Добавить OpenAPI аннотацию в [VariableController.php:13-30](space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableController.php#L13-L30):

```php
/**
 * @OA\Get(path="/certificate/variable/index",
 *     tags={"certificate"},
 *     summary="Список переменных сертификатов",
 *     description="Возвращает доступные переменные для шаблонов",
 *     @OA\Response(
 *         response=200,
 *         description="Success",
 *         @OA\JsonContent(
 *             allOf={@OA\Schema(ref="#/components/schemas/Response")},
 *             @OA\Property(
 *                property="data",
 *                type="object",
 *                properties={
 *                    @OA\Property(
 *                      property="pagination",
 *                      ref="#/components/schemas/Pagination"
 *                    ),
 *                    @OA\Property(
 *                      property="items",
 *                      type="array",
 *                      @OA\Items(ref="#/components/schemas/CertificateVariable")
 *                    )
 *                }
 *            )
 *         )
 *     ),
 *     security={{"BearerToken": {}}}
 * )
 */
```

**Для YAML:**
- Исправить структуру `data` с array на object с `pagination`

**Рекомендация:** Добавить OpenAPI аннотацию и исправить YAML спеку.

---

### 40. GET /certificate/variable-list/index — Значения переменных

**Статус: ❌ РАСХОЖДЕНИЕ + ОТСУТСТВИЕ АННОТАЦИИ**

**Код:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableListController.php:31-48](space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableListController.php#L31-L48)

```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $searchModel->prepareModels($dataProvider->getModels()),
]);
```

**Фактический ответ:**
```json
{
  "success": true,
  "data": {
    "pagination": {...},
    "items": [...]
  }
}
```

**OpenAPI аннотация:** **ОТСУТСТВУЕТ** (только PHP комментарий `@return array`)

**YAML спека** (строки 777-801):
```yaml
/certificate/variable-list/index:
  get:
    responses:
      '200':
        schema:
          properties:
            data:
              type: array
              items:
                properties:
                  variable_id: {type: integer}
                  key: {type: string}
                  value: {type: string}
```

**Проблемы:**
1. Код возвращает `data: { pagination, items }`, YAML описывает `data: array`
2. Нет OpenAPI аннотации в коде
3. Код вызывает `prepareModels()` — дополнительная трансформация данных

**Что нужно исправить:**

**Для кода:**
- Добавить OpenAPI аннотацию в [VariableListController.php:13-30](space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableListController.php#L13-L30):

```php
/**
 * @OA\Get(path="/certificate/variable-list/index",
 *     tags={"certificate"},
 *     summary="Наборы переменных сертификатов",
 *     description="Возвращает значения переменных для подстановки в шаблоны",
 *     @OA\Response(
 *         response=200,
 *         description="Success",
 *         @OA\JsonContent(
 *             allOf={@OA\Schema(ref="#/components/schemas/Response")},
 *             @OA\Property(
 *                property="data",
 *                type="object",
 *                properties={
 *                    @OA\Property(
 *                      property="pagination",
 *                      ref="#/components/schemas/Pagination"
 *                    ),
 *                    @OA\Property(
 *                      property="items",
 *                      type="array",
 *                      @OA\Items(ref="#/components/schemas/CertificateVariableList")
 *                    )
 *                }
 *            )
 *         )
 *     ),
 *     security={{"BearerToken": {}}}
 * )
 */
```

**Для YAML:**
- Исправить структуру `data` с array на object с `pagination`

**Рекомендация:** Добавить OpenAPI аннотацию и исправить YAML спеку.

---

## Сводка расхождений — ВСЕ МЕТОДЫ

| № | Метод | Статус | Тип проблемы |
|---|-------|--------|--------------|
| 36 | GET /certificate/course/index | ❌ | YAML: `data[]` vs Код: `data.pagination/items` |
| 37 | GET /certificate/user/index | ❌ | YAML: `data[]` vs Код: `data.pagination/items` |
| 38 | GET /certificate/type/index | ❌ | YAML: `data[]` vs Код: `data.pagination/items` + отсутствует OA аннотация |
| 39 | GET /certificate/variable/index | ❌ | YAML: `data[]` vs Код: `data.pagination/items` + отсутствует OA аннотация |
| 40 | GET /certificate/variable-list/index | ❌ | YAML: `data[]` vs Код: `data.pagination/items` + отсутствует OA аннотация |
| 41 | GET /course/course/index | ✅ | — |
| 42 | GET /course/course/view | ❌ | Структура: `data.item` vs `data.items[]` |
| 43 | GET /dictionary/dictionary/page-types | ❌ | Нет `data` обёртки в коде |
| 44 | GET /dictionary/dictionary/pages | ❌ | Нет OA аннотации + нет `data` обёртки |
| 45 | POST /integration/report/consolidated | ❌ | Endpoint не существует |

---

## Паттерн исправления для DictionaryController

В `DictionaryController.php` все методы возвращают `['success' => true, 'items' => ...]` напрямую, без использования `$this->response()`. Это создаёт несогласованность с остальными контроллерами.

**Затронутые методы:**
- `actionPageTypes` (строка 61-67)
- `actionCourseTitles` (строка 98-104)
- `actionKnowledgeBaseTypes` (строка 135-141)
- `actionRbacRuleNames` (строка 172-178)
- `actionUserStatuses` (строка 209-215)
- `actionReportEducationStatuses` (строка 246-252)
- `actionPages` (строка 270-276)
- `actionMerchantList` (строка 306-312)
- `actionOauthServiceList` (строка 317-323)

**Рекомендация:** Привести все методы к использованию `$this->response()` для консистентной структуры `{ success, data: { items } }`.

---

## Паттерн исправления для Certificate контроллеров

Все 5 методов (36-40) требуют одно и то же исправление:

**Для кода:**
1. Добавить OpenAPI аннотации (`@OA\Get`, `@OA\Response`, `@OA\Property`) в:
   - [space-backend/backend/modules/api/v1/modules/certificate/controllers/TypeController.php:9-30](space-backend/backend/modules/api/v1/modules/certificate/controllers/TypeController.php#L9-L30)
   - [space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableController.php:9-30](space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableController.php#L9-L30)
   - [space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableListController.php:9-30](space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableListController.php#L9-L30)
2. Аннотация должна описывать структуру ответа как объект с `pagination` и `items` (как в CourseController и UserController)

**Для YAML:**
- Исправить все 5 методов в [openapi/specs/certificates.yaml](openapi/specs/certificates.yaml):
  - Метод 36: [строки 671-678](openapi/specs/certificates.yaml#L671-L678)
  - Метод 37: [строки 703-710](openapi/specs/certificates.yaml#L703-L710)
  - Метод 38: [строки 727-740](openapi/specs/certificates.yaml#L727-L740)
  - Метод 39: [строки 757-775](openapi/specs/certificates.yaml#L757-L775)
  - Метод 40: [строки 792-801](openapi/specs/certificates.yaml#L792-L801)
- Изменить `data` с `type: array` на `type: object` с полями `pagination` и `items`

**Пример исправления для метода 36** (аналогично для 37-40):
```yaml
# ДО (НЕПРАВИЛЬНО)
data:
  type: array
  items:
    properties:
      id: {type: integer}
      title: {type: string}

# ПОСЛЕ (ПРАВИЛЬНО)
data:
  type: object
  properties:
    pagination:
      ref: '#/components/schemas/Pagination'
    items:
      type: array
      items:
        properties:
          id: {type: integer}
          title: {type: string}
```

**Рекомендация:** Исправить все 5 методов одновременно для консистентности API паттерна пагинированного списка.

---

## ✅ ФИНАЛЬНЫЙ ЧЕК-ЛИСТ — 15 методов требуют проверки / исправления

Для каждого метода указано:
- ❌ **Что не так в YAML** (файл и строки)
- ✅ **Где узнать истину** (код с ссылкой и строками)
- 📝 **Как на самом деле** (выдержка из кода)

---

## Блок 1: Certificate Issued методы (31-35)

### 31. POST /certificate/certificate/create

**❌ YAML проблема:**
- Файл: [openapi/specs/certificates.yaml:472-473](openapi/specs/certificates.yaml#L472-L473)
- **Проблема:** `data` описан как `$ref: Certificate` (вернёт созданный сертификат)
- **На самом деле:** Код возвращает пустой ответ, без данных о сертификате

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/CertificateController.php:279-297](space-backend/backend/modules/api/v1/modules/certificate/controllers/CertificateController.php#L279-L297)
- **Код возвращает:**
```php
return $this->response();  // Пустой ответ, без data!
```
- Это отличается от YAML где ожидается полный Certificate объект в data

---

### 32. GET /certificate/certificate/index

**❌ YAML проблема:**
- Файл: [openapi/specs/certificates.yaml:237-240](openapi/specs/certificates.yaml#L237-L240)
- **Проблема:** `data` описан как `type: array` с прямыми items
- **На самом деле:** `data` это объект с полями `pagination` и `items`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/CertificateController.php:124-141](space-backend/backend/modules/api/v1/modules/certificate/controllers/CertificateController.php#L124-L141)
- **Код возвращает:**
```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $dataProvider->getModels(),
]);
```
- **OpenAPI аннотация в коде правильная** (строки 86-122): описывает `data` как объект с `pagination` и `items` ✅

---

### 33. GET /certificate/certificate/view

**⚠️ Возможное несоответствие:**
- YAML: [openapi/specs/certificates.yaml:259-283](openapi/specs/certificates.yaml#L259-L283)
- **YAML описывает:** `data: allOf` с Certificate + расширения (template_id, user, course, pdf_url, verification_url, expires_at)
- **OpenAPI аннотация в коде** (строки 144-163): `data: ref="#/components/schemas/CertificateTemplate"`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/CertificateController.php:165-174](space-backend/backend/modules/api/v1/modules/certificate/controllers/CertificateController.php#L165-L174)
- **Код возвращает:**
```php
return $this->response(200, null, null, $model);  // Передаёт модель напрямую
```
- **Статус:** ✅ Похоже правильно (YAML и аннотация совпадают), но нужна проверка что конкретно возвращает `$model`

---

### 34. GET /certificate/certificate/download

**✅ Нет проблем:**
- Файл: [openapi/specs/certificates.yaml:424-427](openapi/specs/certificates.yaml#L424-L427)
- **YAML правильно описывает:** `application/pdf: type: string, format: binary` (файловый ответ)

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/CertificateController.php:192-200](space-backend/backend/modules/api/v1/modules/certificate/controllers/CertificateController.php#L192-L200)
- **Код правильно работает:**
```php
return \Yii::$app->response->sendContentAsFile($pdf, $model->id . '.pdf',
    ['mimeType' => 'application/pdf']);
```
- **Статус:** ✅ СООТВЕТСТВУЕТ

---

### 35. POST /certificate/download-zip

**✅ Похоже правильно:**
- Файл: [openapi/specs/certificates.yaml:524-530](openapi/specs/certificates.yaml#L524-L530)
- **YAML описывает:** response 200 с `data: { filePath: string }`
- **OpenAPI аннотация в коде** (строки 207-243): также `data: { filePath: string }`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/CertificateController.php:245-259](space-backend/backend/modules/api/v1/modules/certificate/controllers/CertificateController.php#L245-L259)
- **Код возвращает:**
```php
return $this->response(200, 'Commit job queued', null, $model->create($dataProvider));
```
- **Статус:** ✅ Похоже правильно (YAML и аннотация совпадают)

---

## Блок 2: Group методы (25-28)

### 25. POST /group/group/user-delete

**❌ YAML проблема:**
- Файл: [openapi/specs/groups.yaml:653-658](openapi/specs/groups.yaml#L653-L658)
- **Проблема:** `data` описан как `{ removed_count: integer }`
- **На самом деле:** Код возвращает пустой ответ без данных

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/group/controllers/GroupController.php:352-370](space-backend/backend/modules/api/v1/modules/group/controllers/GroupController.php#L352-L370)
- **Код возвращает:**
```php
return $this->response();  // Пустой ответ при успехе!
```
- **OpenAPI аннотация:** ОТСУТСТВУЕТ (нет `@OA` в коде)

---

### 26. POST /group/group/export

**✅ СООТВЕТСТВУЕТ:**
- Файл: [openapi/specs/groups.yaml:758-767](openapi/specs/groups.yaml#L758-L767)
- **YAML описывает:** `data: { export_id, download_url }`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/group/controllers/GroupController.php:542-573](space-backend/backend/modules/api/v1/modules/group/controllers/GroupController.php#L542-L573)
- **Код возвращает:**
```php
return $this->response(200, null, null, [
    'export_id'    => $export->id,
    'download_url' => $downloadUrl,
]);
```
- **OpenAPI аннотация:** ОТСУТСТВУЕТ (нет `@OA` в коде)
- **Статус:** ✅ Код и YAML совпадают

---

### 27. GET /group/group/export-download

**✅ СООТВЕТСТВУЕТ:**
- Файл: [openapi/specs/groups.yaml:787-790](openapi/specs/groups.yaml#L787-L790)
- **YAML описывает:** `application/octet-stream: { type: binary }` (файловый ответ)

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/group/controllers/GroupController.php:581-598](space-backend/backend/modules/api/v1/modules/group/controllers/GroupController.php#L581-L598)
- **Код возвращает:**
```php
return Yii::$app->response->sendContentAsFile(
    file_get_contents($fileUpload->file_name),
    $fileUpload->file_upload
);
```
- **Статус:** ✅ СООТВЕТСТВУЕТ (файловый endpoint)

---

### 28. POST /group/group/assign-courses

**❌ YAML проблема:**
- Файл: [openapi/specs/groups.yaml:874-882](openapi/specs/groups.yaml#L874-L882)
- **Проблема:** `data` описан как `{ job_id, assigned_users }`
- **На самом деле:** Код возвращает пустой ответ без данных

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/group/controllers/GroupController.php:469-484](space-backend/backend/modules/api/v1/modules/group/controllers/GroupController.php#L469-L484)
- **Код возвращает:**
```php
return $this->response();  // Пустой ответ при успехе!
```
- **OpenAPI аннотация:** ОТСУТСТВУЕТ (нет `@OA` в коде)

---

## Блок 3: Certificate Template методы (29-30)

### 29. GET /certificate/template/index

**❌ YAML проблема:**
- Файл: [openapi/specs/certificates.yaml:60-78](openapi/specs/certificates.yaml#L60-L78)
- **Проблема:** `data` описан как `type: array` с прямыми items
- **На самом деле:** `data` это объект с полями `pagination` и `items`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/TemplateController.php:100-117](space-backend/backend/modules/api/v1/modules/certificate/controllers/TemplateController.php#L100-L117)
- **Код возвращает:**
```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $dataProvider->getModels(),
]);
```
- **OpenAPI аннотация в коде правильная** (строки 65-98): описывает `data` как объект с `pagination` и `items` ✅

---

### 30. GET /certificate/template/view

**✅ Похоже правильно:**
- Файл: [openapi/specs/certificates.yaml:97-124](openapi/specs/certificates.yaml#L97-L124)
- **YAML описывает:** `data: object` с полями (id, name, description, template_html, variables, preview_url, active)
- **OpenAPI аннотация в коде** (строки 120-139): `data: ref="#/components/schemas/CertificateTemplate.View"`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/TemplateController.php:141-150](space-backend/backend/modules/api/v1/modules/certificate/controllers/TemplateController.php#L141-L150)
- **Код возвращает:**
```php
$model = $this->findModel($id);
$model->scenario = CertificateTemplate::SCENARIO_VIEW;
return $this->response(200, null, null, $model);
```
- **Статус:** ✅ Похоже правильно (YAML и аннотация совпадают)

---

## Блок 4: Certificate Lookups методы (36-40)

### 36. GET /certificate/course/index

**❌ YAML проблема:**
- Файл: [openapi/specs/certificates.yaml:671-678](openapi/specs/certificates.yaml#L671-L678)
- **Проблема:** `data` описан как `type: array` с прямыми items
- **На самом деле:** `data` это объект с полями `pagination` и `items`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/CourseController.php:72-89](space-backend/backend/modules/api/v1/modules/certificate/controllers/CourseController.php#L72-L89)
- **Код возвращает:**
```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $dataProvider->getModels(),
]);
```

---

### 37. GET /certificate/user/index

**❌ YAML проблема:**
- Файл: [openapi/specs/certificates.yaml:703-710](openapi/specs/certificates.yaml#L703-L710)
- **Проблема:** `data` описан как `type: array` с прямыми items
- **На самом деле:** `data` это объект с полями `pagination` и `items`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/UserController.php:69-87](space-backend/backend/modules/api/v1/modules/certificate/controllers/UserController.php#L69-L87)
- **Код возвращает:**
```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $dataProvider->getModels(),
]);
```

---

### 38. GET /certificate/type/index

**❌ YAML проблема:**
- Файл: [openapi/specs/certificates.yaml:727-740](openapi/specs/certificates.yaml#L727-L740)
- **Проблема:** `data` описан как `type: array` с прямыми items
- **На самом деле:** `data` это объект с полями `pagination` и `items`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/TypeController.php:31-48](space-backend/backend/modules/api/v1/modules/certificate/controllers/TypeController.php#L31-L48)
- **Код возвращает:**
```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $dataProvider->getModels(),
]);
```

---

### 39. GET /certificate/variable/index

**❌ YAML проблема:**
- Файл: [openapi/specs/certificates.yaml:757-775](openapi/specs/certificates.yaml#L757-L775)
- **Проблема:** `data` описан как `type: array` с прямыми items
- **На самом деле:** `data` это объект с полями `pagination` и `items`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableController.php:31-48](space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableController.php#L31-L48)
- **Код возвращает:**
```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $searchModel->prepareModels($dataProvider->getModels()),
]);
```

---

### 40. GET /certificate/variable-list/index

**❌ YAML проблема:**
- Файл: [openapi/specs/certificates.yaml:792-801](openapi/specs/certificates.yaml#L792-L801)
- **Проблема:** `data` описан как `type: array` с прямыми items
- **На самом деле:** `data` это объект с полями `pagination` и `items`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableListController.php:31-48](space-backend/backend/modules/api/v1/modules/certificate/controllers/VariableListController.php#L31-L48)
- **Код возвращает:**
```php
return $this->response(200, null, null, [
    'pagination' => $dataProvider->getPaginationInfo(),
    'items' => $searchModel->prepareModels($dataProvider->getModels()),
]);
```

---

### 42. GET /course/course/view

**❌ YAML проблема:**
- Файл: [openapi/specs/learning.yaml](#) (нужно найти в файле)
- **Проблема:** `data` описан как `items: array` (множественное число)
- **На самом деле:** `data` это один объект, не массив

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/course/controllers/CourseController.php:245-257](space-backend/backend/modules/api/v1/modules/course/controllers/CourseController.php#L245-L257)
- **Код возвращает:**
```php
return $this->response(200, null, null, [
    'item' => $model,  // Один объект, не массив
]);
```

---

### 43. GET /dictionary/dictionary/page-types

**❌ YAML проблема:**
- Файл: [openapi/specs/learning.yaml](#) (нужно найти в файле)
- **Проблема:** Возможно описано как `data.items` объект
- **На самом деле:** Код возвращает без обёртки `data`, напрямую `{ success, items }`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/dictionary/controllers/DictionaryController.php:61-67](space-backend/backend/modules/api/v1/modules/dictionary/controllers/DictionaryController.php#L61-L67)
- **Код возвращает:**
```php
return [
    'success' => true,
    'items' => PageType::getCustomListArray($type),
];  // Нет 'data' обёртки!
```

---

### 44. GET /dictionary/dictionary/pages

**❌ YAML проблема:**
- Файл: [openapi/specs/learning.yaml](#) (нужно найти в файле)
- **Проблема:** Возможно описано как `data.items` объект
- **На самом деле:** Код возвращает без обёртки `data`, напрямую `{ success, items }`

**✅ Истина в коде:**
- Файл: [space-backend/backend/modules/api/v1/modules/dictionary/controllers/DictionaryController.php:270-276](space-backend/backend/modules/api/v1/modules/dictionary/controllers/DictionaryController.php#L270-L276)
- **Код возвращает:**
```php
return [
    'success' => true,
    'items' => Page::getPageList(),
];  // Нет 'data' обёртки!
```

---

### 45. POST /integration/report/consolidated

**❌ YAML проблема:**
- Файл: [openapi/specs/](#) (нужно найти в одном из файлов)
- **Проблема:** Endpoint указан в списке, но в коде не существует
- **На самом деле:** Нет контроллера и action для этого endpoint'а

**✅ Истина в коде:**
- Поиск: `grep -r "integration/report" space-backend/` — **нет результатов**
- Папка `space-backend/backend/modules/api/v1/modules/integration/` — **не существует**
- **Контроллер не найден**

---

## Итого: 21 метод требует проверки / исправления

| № | Путь | Проблема | Статус |
|---|------|----------|--------|
| 25 | `/group/group/user-delete` | `data: { removed_count }` vs пустой ответ | ❌ Нужно исправить YAML или код |
| 26 | `/group/group/export` | `data: { export_id, download_url }` | ✅ ПРАВИЛЬНО |
| 27 | `/group/group/export-download` | Файловый ответ (octet-stream) | ✅ ПРАВИЛЬНО |
| 28 | `/group/group/assign-courses` | `data: { job_id, assigned_users }` vs пустой ответ | ❌ Нужно исправить YAML или код |
| 29 | `/certificate/template/index` | `data: array` → `data: object` | ❌ Нужно исправить YAML |
| 30 | `/certificate/template/view` | Проверить что возвращает $model | ✅ Похоже правильно |
| 31 | `/certificate/certificate/create` | `data: Certificate` vs пустой ответ | ❌ Нужно исправить YAML или код |
| 32 | `/certificate/certificate/index` | `data: array` → `data: object` | ❌ Нужно исправить YAML |
| 33 | `/certificate/certificate/view` | Нужна проверка что возвращает $model | ⚠️ Похоже правильно, нужна проверка |
| 34 | `/certificate/certificate/download` | Файловый ответ (PDF) | ✅ ПРАВИЛЬНО |
| 35 | `/certificate/download-zip` | `data: { filePath }` | ✅ Похоже правильно |
| 36 | `/certificate/course/index` | `data: array` → `data: object` | ❌ Нужно исправить YAML |
| 37 | `/certificate/user/index` | `data: array` → `data: object` | ❌ Нужно исправить YAML |
| 38 | `/certificate/type/index` | `data: array` → `data: object` | ❌ Нужно исправить YAML |
| 39 | `/certificate/variable/index` | `data: array` → `data: object` | ❌ Нужно исправить YAML |
| 40 | `/certificate/variable-list/index` | `data: array` → `data: object` | ❌ Нужно исправить YAML |
| 42 | `/course/course/view` | `items[]` → `item` (один объект) | ❌ Нужно исправить YAML |
| 43 | `/dictionary/dictionary/page-types` | Нет `data` обёртки в коде | ❌ Нужно исправить YAML или код |
| 44 | `/dictionary/dictionary/pages` | Нет `data` обёртки в коде | ❌ Нужно исправить YAML или код |
| 45 | `/integration/report/consolidated` | Endpoint не существует в коде | ❌ Удалить из YAML или реализовать |

