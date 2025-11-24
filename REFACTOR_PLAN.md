# 🚀 Master Plan: OpenAPI 3.1 Refactoring & Quality Assurance

Этот документ служит детальной дорожной картой ("Punch List") для приведения документации Reezonly Space API к идеальному состоянию.

---

## 📊 Текущий статус

⚠️ **ОБНОВЛЕНО 2025-11-24 (После проверки /user/user/delete и добавления 401/403):**

| Метрика | Было (2025-11-23) | Сейчас | Изменение |
|---------|---|---|---|
| **Ошибок (Errors)** | 180 | 12 | -168 ✅ |
| **Missing 4xx Responses** | 14+ | 5 | -9 ✅ |
| **Неиспользуемые компоненты** | 13 | 12 | -1 ✅ |
| **Example/Schema mismatches** | 2+ | 2 | - |

**Phase 1 Progress:**
- ✅ 1.1 Operation Descriptions — полностью готово
- ✅ 1.2 Operation 4xx Responses — 9 методов исправлено, 5 осталось (требуют проверки кода)
- ⏳ 1.3 Invalid Examples — 2 ошибки (timestamps в примерах /group/group/view)
- ⏳ 1.4 Unused Components — 12 компонентов (требуют решения: удалить vs использовать)

**Примечание:** Статус "38 ошибок" был на очень раннем этапе. После полного добавления операций ошибок стало 214. Сейчас после систематического прохода Phase 1 — всего 22 ошибки. **Это нормально и ожидается.**

---

## 🧠 Архитектурная Стратегия (Single Source of Truth)

Мы переходим к модели **"Единый источник — два продукта"**:

1.  **Source Files (Исходники):**
    *   Лежат в `specs/paths/`.
    *   **Структура папок:** Строго повторяет роутинг Yii2 (`module/controller/action.yaml`).
    *   *Зачем:* Чтобы бэкенд-разработчик мгновенно находил файл спеки, зная URL или контроллер.
2.  **Internal Build (Внутренняя дока):**
    *   Собирает ВСЕ файлы.
    *   Используется командой разработки для тестов и фронтенда.
3.  **Public Build (Для интеграторов):**
    *   Билдер фильтрует методы по "Белому списку" (45 методов).
    *   **Скрытие полей:** Билдер вырезает поля/енумы, помеченные как `x-internal` (например, роль `admin` при редактировании юзера).
    *   Группировка в меню (Sidebar) происходит через **Теги** (`Users`, `Groups`), а не через папки.

---

## ✅ Phase 1: Clean Code (Detailed Punch List)

Цель: "Зеленый" линтер. Исправление контента внутри текущих файлов перед их дроблением.

### 1.1. Operation Descriptions (Missing `description`)
*Линтер требует текстовое описание для каждого метода.*

- [x] **Groups:** `GET /group/group/export-download` (Fixed manually)

### 1.2. Operation 4xx Responses (Missing Error Responses)
*Каждая операция должна описывать возможные ошибки (400, 401, 403, 404).*

- [x] **Groups:** `DELETE /group/group/multiple-delete` (Missing 4xx)
- [x] **Groups:** `GET /dictionary/user/groups` (Missing 4xx)
- [x] **Groups:** `POST /group/group/user-delete` (Missing 4xx)
- [x] **Groups:** `POST /group/group/export` (Missing 4xx)
- [x] **Groups:** `POST /group/group/assign-courses` (Missing 4xx)
- [x] **Certificates:** `GET /certificate/template/index` (Missing 4xx)
- [x] **Certificates:** `GET /certificate/certificate/index` (Missing 4xx)
- [x] **Certificates:** `GET /certificate/course/index` (Missing 4xx)
- [x] **Certificates:** `GET /certificate/user/index` (Missing 4xx)
- [x] **Certificates:** `GET /certificate/type/index` (Missing 4xx)
- [x] **Certificates:** `GET /certificate/variable/index` (Missing 4xx)
- [x] **Certificates:** `GET /certificate/variable-list/index` (Missing 4xx)
- [x] **Courses:** `GET /course/course/index` (Missing 4xx)

### 1.2.1. ТЕКУЩИЙ СТАТУС: Missing 4xx Responses (npm run lint 2025-11-24)
*Текущий линтер ругается на 10 методов без 4xx responses. Для каждого нужно проверить РЕАЛЬНЫЙ PHP код и документировать только то, что там есть. Твоя задача - проверить что в коде, потом посмотреть какие ошибки указаны в Yaml - и дать рекомендацию по тому что нужно добавить в Yaml, или УБРАТЬ из Yaml*

**Инструкция:**
- Для каждого метода найти файл контроллера в `space-backend/`
- Проверить какие HTTP коды он может вернуть (200, 401, 403, 404, 422, 500 и т.д.)
- Добавить в YAML только то, что реально выбросится из кода
- НЕ придумывать ошибки, которых нет!

- [x] **Users:** `GET /dictionary/user/fields` — проверить `UserController.php` actionUserFields
- [x] **Users:** `GET /dictionary/user/statuses` — проверить `UserController.php` actionUserStatuses
- [x] **Users:** `GET /user/user/load-template` — проверить `UserController.php` actionLoadTemplate
- [x] **Users:** `POST /user/user/preview` — проверить `UserController.php` actionPreview
- [x] **Users:** `GET /user/importreport/download` — проверить `ImportReportController.php`
- [ ] **Groups:** `GET /group/group/view` — проверить `GroupController.php` actionView
- [ ] **Certificates:** `GET /certificate/template/view` — проверить `TemplateController.php` actionView
- [ ] **Certificates:** `GET /certificate/certificate/view` — проверить `CertificateController.php` actionView

### 1.3. Invalid Examples & Schema Mismatches
*Примеры (`example` / `examples`) не соответствуют описанной схеме (`schema`).*

- [x] **User:** `POST /user/user/create` (example `email` format invalid)
- [x] **User:** `PUT /user/user/update` (example `update_profile` missing required `email`)
- [x] **User:** `PUT /user/user/update` (example `update_memberships` missing required `username`)
- [x] **User:** `PUT /user/user/update` (example `update_memberships` missing required `email`)
- [x] **Group:** `PUT /group/group/update` (example `move` missing required `name`) (Fixed manually)
- [x] **Certificate:** `POST /certificate/download-zip` (schema example `filePath` must be `uri` format)
- [x] **Certificate:** `POST /certificate/download-zip` (response example `filePath` must be `uri` format)
- [x] **Dictionary:** `GET /dictionary/dictionary/page-types` (example must be array)
- [x] **Dictionary:** `GET /dictionary/dictionary/pages` (example must be array)

### 1.3.1. Example/Schema Type Mismatches (в примерах неправильный тип)
*Примеры в YAML не совпадают с типом, объявленным в схеме.*

- [ ] **Groups:** `GET /group/group/view` — в примере `users[0].created_at` строка, должно быть `integer` (Unix timestamp)
- [ ] **Groups:** `GET /group/group/view` — в примере `users[1].created_at` строка, должно быть `integer` (Unix timestamp)

### 1.4. Unused Components (Dead Code)
*Компоненты определены в `schemas`, но нигде не используются в 45 публичных методах. Нужно либо удалить, либо использовать.*

**Статус (npm run lint 2025-11-24):** 12 неиспользуемых компонентов найдено

**Параметры:**
- [ ] `Search` — нигде не используется в публичных методах
- [ ] `Ids` — нигде не используется в публичных методах

**Схемы:**
- [ ] `GroupMemberStats` — нигде не используется
- [ ] `ImportStatus` — нигде не используется
- [ ] `FileUploadResponse` — нигде не используется

**Response компоненты (в responses.yaml):**
- [ ] `Success` — нигде не используется ($ref)
- [ ] `Created` — нигде не используется ($ref)
- [ ] `UserList` — нигде не используется ($ref)
- [ ] `GroupList` — нигде не используется ($ref)
- [ ] `CertificateList` — нигде не используется ($ref)
- [ ] `ValidationError` — нигде не используется ($ref)
- [ ] `TooManyRequests` — нигде не используется ($ref)

**Решение:**
- **Опция A:** Удалить если действительно не нужны
- **Опция B:** Начать использовать через `$ref` вместо inline `allOf`

### 1.5. Global Meta Issues
- [x] **Info:** Missing `license` field.
- [x] **Servers:** Remove `localhost` from production build.

### 1.6. OpenAPI 3.1 Deprecated Syntax Removal
*Удаление устаревшего синтаксиса OpenAPI 3.0.*

- [x] **`nullable: true`** заменены на `type: [string, 'null']` ✅ **COMPLETED** (0 найдено)
  - Это свойство из OpenAPI 3.0, в 3.1 используется JSON Schema notation с массивом типов

### 1.7. OpenAPI 3.1 Composition Simplification
*Упрощение `allOf` паттернов в соответствии с новыми возможностями OpenAPI 3.1 (sibling properties + $ref).*

**Статус:** 49 `allOf` найдено в коде. **РАЗДЕЛЕНИЕ:**

#### A. Нужные `allOf` (Schema Composition) - ОСТАВИТЬ:
- [x] **CertificateDetail** расширяет Certificate
- [x] **GroupForm** расширяет CreateGroupRequest
- [x] **GroupListItem** расширяет Group
- [x] Другие schema наследования

*Эти `allOf` нужны для расширения базовых объектов новыми полями.*

#### B. Упрощаемые `allOf` (Response Wrapping) - **ОПТИМИЗИРОВАТЬ:**
- [ ] **responses.yaml:** `Success`, `Created`, `UserList`, `GroupList`, `CertificateList` (9 шт)
  - **Текущий паттерн:** `allOf: [$ref, {properties: {...}}]`
  - **Новый паттерн (3.1):** `$ref` + inline `properties` (сибилинг)
  - **Примечание:** Можно упростить, но требует проверки совместимости с tools

#### C. Response Schemas (8 шт в responses.yaml):
- [ ] Проверить что все responses используют правильную структуру
- [ ] Убрать дублирование структур (BadRequest, Unauthorized, ValidationError и т.д.)

**Priority:** LOW — текущий код валиден и работает, упрощение — опционально.

---

## 🏗 Phase 2: Architectural Refactor (Implementation Plan)

Перестройка файловой структуры под стратегию "Route-Based Source".

### 2.1. Файловая структура (Route-Based)

```text
specs/
├── openapi.yaml                      # ENTRYPOINT
├── paths/                            # ОПЕРАЦИИ (По роутам Yii2)
│   ├── user/                         # Module: user
│   │   ├── user/                     # Controller: user
│   │   │   ├── index.yaml            # Action: index
│   │   │   ├── create.yaml           # Action: create
│   │   │   └── ...
│   │   └── import-report/            # Controller: import-report
│   │       └── index.yaml
│   ├── group/                        # Module: group
│   │   └── group/                    # Controller: group
│   │       ├── index.yaml
│   │       └── create.yaml
│   └── certificate/                  # Module: certificate
│       ├── certificate/
│       ├── template/
│       └── ...
└── components/                       # ПЕРЕИСПОЛЬЗУЕМЫЕ КОМПОНЕНТЫ
    ├── schemas/                      # Модели (User, Group...)
    ├── responses/
    └── parameters/
```

### 2.2. Стратегия обработки ошибок (Error Handling)

*   **401 Unauthorized / 403 Forbidden / 500 Internal Error:**
    *   Абсолютно идентичны для всех методов.
    *   Хранятся целиком в `components/responses/`.
    *   Подключаются через `$ref`.

*   **400 Bad Request / 404 Not Found:**
    *   Имеют **общую структуру** (Schema), но **уникальные примеры**.
    *   **Schema:** Хранится в `components/schemas/ErrorResponse.yaml`.
    *   **Examples:** Определяются **локально** в каждом файле `paths/.../action.yaml`, описывая конкретные ошибки валидации (например, "Email занят" или "Группа имеет подгруппы").

### 2.3. Builder Logic (tools/build.js)

1.  **Scanning:** Рекурсивный поиск всех `yaml` в `specs/paths/`.
2.  **Extraction:** Парсинг пути файла для определения URL (если структура файла совпадает с URL) или чтение поля пути внутри файла.
3.  **Filtering:**
    *   `PUBLIC_BUILD`: Сверка `operationId` или `path` с жестким "Белым списком" (45 методов).
    *   `INTERNAL_BUILD`: Включение всех найденных файлов.
4.  **Sanitization:** Для Public build удаление полей/значений enum, помеченных `x-internal`.

---

## 📝 Instructions for Next Session

1.  Перейти в корень проекта: `cd ../..`
2.  Запустить агента.
3.  Команда: *"Приступай к выполнению Phase 1 из файла openapi-publish/REFACTOR_PLAN.md. Сверяйся с PHP кодом для правильных кодов ошибок."*
