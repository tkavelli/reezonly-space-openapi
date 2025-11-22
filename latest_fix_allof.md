# Ошибки валидации OpenAPI (allOf / oneOf conflicts)

При сборке документации Redocly CLI 2.11.1 выдает множество предупреждений о несовместимости типов внутри `allOf`. Это происходит из-за использования устаревшего паттерна `oneOf: [type: integer, type: 'null']` внутри схем, которые наследуются друг от друга. Валидатор не может корректно объединить эти типы.

В OpenAPI 3.1 рекомендуется использовать массив типов: `type: [integer, "null"]`.

## Список мест для исправления

### 1. Группы (Groups)
Файл: `specs/groups.yaml`

- [ ] **Схема `Group` / поле `parent_id`**
    *   *Проблема:* Конфликт `integer` и `null` при наследовании в `GroupListItem`, `GroupDetail`, `CreateGroupRequest`, `GroupForm`.
    *   *Где:* Везде, где используется `parent_id`.
    *   *Решение:* Заменить:
        ```yaml
        parent_id:
          oneOf:
            - type: integer
              minimum: 1
            - type: 'null'
        ```
        на:
        ```yaml
        parent_id:
          type: [integer, 'null']
          minimum: 1
        ```

### 2. Даты и временные метки (Dates)
Файл: `specs/core/common/schemas.yaml` (или там, где определены `DateValue` и поля дат)

- [ ] **Поле `date_added_at` (unix/iso)**
    *   *Проблема:* `Incompatible types ... "null" and "integer"` для полей `unix` и `iso`.
    *   *Где:* В отчетах интеграции (`Integration Reports`), списках сущностей.
    *   *Решение:* Проверить схему `DateValue` или определение поля. Если оно должно быть nullable, использовать `type: [object, 'null']` для всего объекта или `type: [integer, 'null']` для `unix`.

- [ ] **Поле `last_activity_at`**
    *   *Аналогично выше.*

- [ ] **Поле `registered_at`**
    *   *Аналогично выше.*

## Общая рекомендация по исправлению

Для всех полей, которые могут быть `null`:

1.  Найдите конструкцию:
    ```yaml
    oneOf:
      - type: <TYPE>
      - type: 'null'
    ```
2.  Замените её на синтаксис OpenAPI 3.1:
    ```yaml
    type: [<TYPE>, 'null']
    ```
3.  Убедитесь, что валидации (например, `minimum: 1`) применяются корректно (обычно валидаторы игнорируют их для null, но стоит проверить).

**Важно:** Это не ломает сборку HTML, но устраняет шум в логах и делает спецификацию более чистой и современной.
