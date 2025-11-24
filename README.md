# Reezonly Space OpenAPI (45 public methods)

Однокнопочная сборка и просмотр публичной спеки. Один источник истины — `space-platform-api.yaml`; `bundles/complete-api.yaml` теперь лишь симлинк для обратной совместимости.

---

## Быстрый старт (Docker)

### Вариант 1: Готовый образ (рекомендуется)

Образ автоматически собирается при каждом push в main:

```bash
# запуск контейнера на порту 3000 с готовым образом из GitHub Container Registry
docker run -p 3000:80 ghcr.io/tkavelli/reezonly-space-openapi:latest

# открыть в браузере
open http://localhost:3000
```

### Вариант 2: Собрать образ локально

```bash
# сборка образа
docker build -t reezonly-space-openapi .

# запуск контейнера на порту 3000
docker run -p 3000:80 reezonly-space-openapi

# открыть в браузере
open http://localhost:3000
```

Доступные эндпоинты:
- UI (Redoc): http://localhost:3000
- YAML (основной): http://localhost:3000/space-platform-api.yaml
- YAML (симлинк): http://localhost:3000/bundles/complete-api.yaml

---

## Локальная разработка (без Docker)

Если хочешь редактировать спеку и видеть изменения в браузере в реальном времени.

### 1. Установка зависимостей

```bash
# установить npm пакеты (используется package-lock.json)
npm ci

# установить зависимости для build.js
cd tools && npm ci && cd ..
```

### 2. Сборка

```bash
# собирает всё из specs/* в space-platform-api.yaml
npm run bundle
```

Что происходит:
1. `tools/build.js` читает все YAML файлы из `specs/` (users, groups, certificates, learning, reports)
2. Объединяет их в один `space-platform-api.yaml`
3. Создаёт симлинк `bundles/complete-api.yaml` → `space-platform-api.yaml`

### 3. Генерация документации HTML

```bash
# собирает спеку и генерирует красивый HTML в docs/index.html
npm run build-docs
```

Процесс:
1. `npm run bundle` — собирает YAML
2. `redocly build-docs` — генерирует HTML из YAML
3. `tools/add-try-link.js` — добавляет логотип и скрипты

### 4. Просмотр локально

```bash
# запуск простого HTTP сервера на порту 3000
python3 -m http.server 3000

# или используй Node.js
npx http-server -p 3000
```

Открой http://localhost:3000/docs/index.html в браузере.

### 5. Разработка с hot-reload (опционально)

Если часто редактируешь `specs/*.yaml`:

```bash
npm run watch
```

Это автоматически пересобирает `space-platform-api.yaml` при любом изменении `specs/`.

---

## Линтинг и валидация

```bash
# проверить YAML на ошибки (требования к descriptions, примерам и т.д.)
npm run lint

# или использовать redocly напрямую
redocly lint space-platform-api.yaml
```

Правила линтинга определены в `redocly.yaml`:
- ✅ Каждый метод должен иметь `description`
- ✅ Каждый параметр должен иметь `description`
- ✅ `operationId` должен начинаться с глагола: `get|list|create|update|delete|download|assign`
- ✅ Все компоненты должны использоваться
- ✅ Все ссылки должны быть валидны

---

## Структура проекта

```
reezonly-space-openapi/
├── package.json              # основные зависимости (redocly, nodemon)
├── package-lock.json         # фиксированные версии (обязателен для npm ci)
├── .gitignore               # исключает node_modules из гита
│
├── redocly.yaml             # конфиг Redocly (theme, rules, lint)
├── space-platform-api.yaml  # собранный OpenAPI (итоговый файл)
│
├── specs/                   # исходные YAML модули
│   ├── core/
│   │   ├── base.yaml        # базовая инфраструктура
│   │   └── common/          # shared components (schemas, responses, parameters)
│   ├── users.yaml           # 7 методов управления пользователями
│   ├── groups.yaml          # 12 методов управления группами
│   ├── certificates.yaml    # 10 методов сертификатов
│   ├── learning.yaml        # 8 методов обучения
│   └── reports.yaml         # 8 методов отчётов
│
├── tools/                   # сборщик и вспомогательные скрипты
│   ├── package.json         # зависимости для build.js
│   ├── build.js             # объединяет specs/* в space-platform-api.yaml
│   └── add-try-link.js      # инжектирует логотип и скрипты в HTML
│
├── docs/                    # сгенерированная документация
│   ├── index.html           # итоговая красивая спека (Redoc)
│   ├── space-platform-api.yaml
│   └── img/
│       └── logo.svg
│
├── bundles/
│   └── complete-api.yaml    # симлинк → ../space-platform-api.yaml
│
├── Dockerfile               # контейнеризация
├── nginx.conf              # конфиг nginx для контейнера
└── README.md               # этот файл
```

---

## Команды

| Команда | Описание |
|---------|---------|
| `npm run lint` | Проверить YAML на ошибки (redocly lint) |
| `npm run build:modules` | Собрать spec: `tools/build.js` |
| `npm run bundle` | Собрать + создать симлинк |
| `npm run build-docs` | Собрать + сгенерировать HTML |
| `npm run watch` | Автоматически пересобирать при изменении specs/ |
| `npm run ci:spec` | lint + bundle (для CI/CD) |

---

## Docker

### Использовать готовый образ (рекомендуется)

Образ автоматически собирается в GitHub Actions при каждом push:

```bash
# запустить готовый образ с Docker Hub
docker run -d -p 3000:80 --name space-api ghcr.io/tkavelli/reezonly-space-openapi:latest

# проверить логи
docker logs -f space-api

# остановить контейнер
docker stop space-api && docker rm space-api
```

### Собрать образ локально

```bash
# собрать образ
docker build -t reezonly-space-openapi .

# запустить контейнер
docker run -d -p 3000:80 --name space-api reezonly-space-openapi

# проверить логи
docker logs -f space-api

# остановить контейнер
docker stop space-api && docker rm space-api
```

### Доступные образы

При каждом push в `main` GitHub Actions автоматически собирает и публикует образ:
- `ghcr.io/tkavelli/reezonly-space-openapi:latest` — последняя версия из main
- `ghcr.io/tkavelli/reezonly-space-openapi:main` — текущий branch
- `ghcr.io/tkavelli/reezonly-space-openapi:sha-<commit>` — конкретный коммит

Скачать образ:
```bash
docker pull ghcr.io/tkavelli/reezonly-space-openapi:latest
```

Проверить статус сборки: https://github.com/tkavelli/reezonly-space-openapi/actions

---

## Дополнительная документация

- [REFACTOR_PLAN.md](REFACTOR_PLAN.md) — план архитектуры и текущие задачи
- [best_practicies.md](best_practicies.md) — стандарты и best practices для OpenAPI
- [CUSTOMIZATION.md](CUSTOMIZATION.md) — кастомизация Redoc UI

---

## Continuous Integration (CI/CD)

### GitHub Pages (pages.yml)

При push в `main`:
1. Восстанавливает зависимости: `npm ci && npm ci --prefix tools`
2. Генерирует документацию: `npm run build-docs`
3. Деплоит в GitHub Pages: https://tkavelli.github.io/reezonly-space-openapi

### Docker Image (docker.yml)

При push в `main`:
1. Собирает Docker образ
2. Публикует в GitHub Container Registry (ghcr.io)
3. Доступен на: `ghcr.io/tkavelli/reezonly-space-openapi:latest`

### Проверить статус

Все workflows: https://github.com/tkavelli/reezonly-space-openapi/actions

Что происходит:
- `pages.yml` — деплой на GitHub Pages (через nginx в докере)
- `docker.yml` — сборка и публикация Docker образа

---

## Типичные сценарии

### Хочу добавить новый метод API

1. Отредактируй соответствующий файл в `specs/` (e.g., `specs/users.yaml`)
2. Добавь `description` ко всем полям и параметрам (требование линтера)
3. `npm run lint` — проверь синтаксис
4. `npm run build-docs` — собери и посмотри результат
5. `git add . && git commit && git push` — задеплоится автоматически на GitHub Pages

### Локальная проверка перед коммитом

```bash
npm run lint && npm run build-docs
```

Если всё зелёное — коммитить можно.

### Просмотр в браузере

```bash
npm run build-docs
python3 -m http.server 3000
open http://localhost:3000/docs
```

---

## .gitignore

Репо содержит только исходники:
- ✅ Исходные YAML файлы (`specs/*`)
- ✅ Конфиги и скрипты (`redocly.yaml`, `tools/build.js`)
- ✅ `package.json` и `package-lock.json`
- ❌ node_modules (исключён, используй `npm ci`)
- ❌ Generated files (`docs/index.html`, `space-platform-api.yaml` из bundle)

Это обеспечивает чистоту репозитория (~200 KB вместо 200+ MB).

---

## FAQ

**Q: Где редактировать API?**
A: В `specs/` директории, каждый модуль в отдельном файле.

**Q: Как запустить локально?**
A: `npm ci && npm run build-docs && python3 -m http.server 3000`

**Q: Где документация по API?**
A: В `docs/index.html` после `npm run build-docs`

**Q: Как задеплоить изменения?**
A: Просто `git push` в `main` — GitHub Actions сам всё сделает.

**Q: Почему генерируется HTML?**
A: Redoc преобразует YAML в красивую интерактивную документацию с примерами и "Try It Out".
