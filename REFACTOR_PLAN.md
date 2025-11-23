# 🚀 Master Plan: OpenAPI 3.1 Refactoring & Quality Assurance

Этот документ служит детальной дорожной картой ("Punch List") для приведения документации Reezonly Space API к идеальному состоянию.

---

## 📊 Текущий статус

- **Ошибок линтера (Errors):** 38
- **Предупреждений (Warnings):** 24
- **Всего задач:** 62

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

- [ ] **Groups:** `DELETE /group/group/multiple-delete` (Missing 4xx)
- [ ] **Groups:** `GET /dictionary/user/groups` (Missing 4xx)
- [ ] **Groups:** `POST /group/group/user-delete` (Missing 4xx)
- [ ] **Groups:** `POST /group/group/export` (Missing 4xx)
- [ ] **Groups:** `POST /group/group/assign-courses` (Missing 4xx)
- [ ] **Certificates:** `GET /certificate/template/index` (Missing 4xx)
- [ ] **Certificates:** `GET /certificate/certificate/index` (Missing 4xx)
- [ ] **Certificates:** `GET /certificate/course/index` (Missing 4xx)
- [ ] **Certificates:** `GET /certificate/user/index` (Missing 4xx)
- [ ] **Certificates:** `GET /certificate/type/index` (Missing 4xx)
- [ ] **Certificates:** `GET /certificate/variable/index` (Missing 4xx)
- [ ] **Certificates:** `GET /certificate/variable-list/index` (Missing 4xx)
- [ ] **Courses:** `GET /course/course/index` (Missing 4xx)

### 1.3. Invalid Examples & Schema Mismatches
*Примеры (`example` / `examples`) не соответствуют описанной схеме (`schema`).*

- [ ] **User:** `POST /user/user/create` (example `email` format invalid)
- [ ] **User:** `PUT /user/user/update` (example `update_profile` missing required `email`)
- [ ] **User:** `PUT /user/user/update` (example `update_memberships` missing required `username`)
- [ ] **User:** `PUT /user/user/update` (example `update_memberships` missing required `email`)
- [x] **Group:** `PUT /group/group/update` (example `move` missing required `name`) (Fixed manually)
- [ ] **Certificate:** `POST /certificate/download-zip` (schema example `filePath` must be `uri` format)
- [ ] **Certificate:** `POST /certificate/download-zip` (response example `filePath` must be `uri` format)
- [ ] **Dictionary:** `GET /dictionary/dictionary/page-types` (example must be array)
- [ ] **Dictionary:** `GET /dictionary/dictionary/pages` (example must be array)

### 1.4. Unused Components (Dead Code)
*Компоненты определены в `schemas`, но нигде не используются в 45 публичных методах. Нужно либо удалить, либо использовать.*

- [ ] **Parameters:** `Page`, `PerPage`, `Search`, `Id`, `PathId`...
- [ ] **Schemas:** `CreateUserRequest`, `UserList`, `ImportReport`...
- [ ] **Responses:** `Success`, `Created`, `BadRequest`, `Unauthorized`...

### 1.5. Global Meta Issues
- [ ] **Info:** Missing `license` field.
- [ ] **Servers:** Remove `localhost` from production build.

---

## ✅ Phase 1.5: Parameter & Schema Verification (Manual check against PHP code)

Ensure all parameters, response schemas, and error codes match the actual PHP implementation.

### Users
- [ ] `GET /user/user/index`
- [ ] `GET /user/user/admin`
- [ ] `GET /user/user/view`
- [ ] `GET /dictionary/user/fields`
- [ ] `POST /user/user/create`
- [ ] `PUT /user/user/update`
- [ ] `DELETE /user/user/delete`
- [ ] `GET /dictionary/user/statuses`
- [ ] `POST /user/user/add-course`
- [ ] `POST /user/user/delete-course`
- [ ] `POST /user/user/preview`
- [ ] `POST /user/user/load`
- [ ] `GET /user/user/get-import-progress`
- [ ] `GET /user/user/load-template`
- [ ] `GET /user/import-report/index`
- [ ] `GET /user/importreport/download`

### Groups
- [x] `GET /group/group/index` (Fixed: restored 'data' wrapper)
- [ ] `GET /group/group/view`
- [ ] `POST /group/group/create`
- [x] `PUT /group/group/update` (Verified)
- [ ] `DELETE /group/group/delete`
- [x] `GET /dictionary/user/groups` (Verified: flat response 'items')
- [ ] `POST /group/group/user-add`
- [ ] `POST /group/group/user-delete`
- [ ] `POST /group/group/assign-courses`
- [ ] `DELETE /group/group/multiple-delete`
- [ ] `POST /group/group/export`
- [x] `GET /group/group/export-download` (Verified)

### Certificates
- [ ] `GET /certificate/template/index`
- [ ] `GET /certificate/template/view`
- [ ] `POST /certificate/certificate/create`
- [ ] `GET /certificate/certificate/index`
- [ ] `GET /certificate/certificate/view`
- [ ] `GET /certificate/certificate/download`
- [ ] `POST /certificate/download-zip`
- [ ] `GET /certificate/course/index`
- [ ] `GET /certificate/user/index`
- [ ] `GET /certificate/type/index`
- [ ] `GET /certificate/variable/index`
- [ ] `GET /certificate/variable-list/index`

### Learning (ReadOnly)
- [x] `GET /dictionary/dictionary/page-types` (Verified: array response)
- [x] `GET /dictionary/dictionary/pages` (Verified: array response)
- [ ] `GET /course/course/index`
- [ ] `GET /course/course/view`

### Reports
- [ ] `POST /integration/report/consolidated`

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
