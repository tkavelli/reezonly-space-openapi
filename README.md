# Reezonly Space OpenAPI (45 public methods)

Однокнопочная сборка и просмотр публичной спеки. Один источник истины — `space-platform-api.yaml`; `bundles/complete-api.yaml` теперь лишь симлинк для обратной совместимости.

## Быстрый старт (Docker)
```bash
# сборка образа
docker build -t reezonly-space-openapi .
# запуск
docker run -p 3000:80 reezonly-space-openapi
# открыть в браузере
open http://localhost:3000
```
Доступно:
- UI (Redoc): http://localhost:3000
- YAML: http://localhost:3000/bundles/complete-api.yaml
- YAML (основной): http://localhost:3000/space-platform-api.yaml

## Локальная разработка без Docker
```bash
npm ci
cd tools && npm ci && cd ..
npm run bundle      # собирает specs/* в space-platform-api.yaml и обновляет симлинк bundles/complete-api.yaml
npm run build-docs  # генерирует docs/index.html из space-platform-api.yaml
python3 -m http.server 3000
```

## Сборщик
- `tools/build.js` — склеивает 45 публичных методов из `specs/*` в **единственный** `space-platform-api.yaml`.
- `redocly.yaml` — конфиг Redocly CLI.
- `nginx.conf` — раздача статических docs + YAML в контейнере.

## Структура
```
Dockerfile
.dockerignore
README.md
README_SPACE_API.md   # расширенная инструкция
bundles/complete-api.yaml
space-platform-api.yaml
specs/                # модули users/groups/certificates/learning/reports
tools/                # сборщик и валидация
```
