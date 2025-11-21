# Настройка CORS для "Try It Out"

## Обзор

Интерактивная документация API по адресу https://tkavelli.github.io/reezonly-space-openapi/try.html содержит функцию "Try It Out", которая позволяет пользователям тестировать API эндпоинты прямо из документации.

Для работы этой функции backend API должен настроить CORS (Cross-Origin Resource Sharing) заголовки, чтобы разрешить запросы с домена документации.

## Требуемые CORS заголовки

Добавьте эти заголовки **во все API ответы** (включая ошибки и OPTIONS preflight):

```
Access-Control-Allow-Origin: https://tkavelli.github.io
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Accept-Language
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

## Реализация по фреймворкам

### PHP / Yii2 (Рекомендуется для Space Backend)

Добавьте в базовый класс контроллера API или middleware:

```php
<?php

namespace backend\modules\api\v1\modules\user\controllers;

use yii\rest\Controller;

class UserController extends Controller
{
    public function behaviors()
    {
        return array_merge(parent::behaviors(), [
            'corsFilter' => [
                'class' => \yii\filters\Cors::class,
                'cors' => [
                    'Origin' => ['https://tkavelli.github.io', 'http://localhost:*'],
                    'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                    'Access-Control-Request-Headers' => ['Content-Type', 'Authorization', 'Accept-Language'],
                    'Access-Control-Allow-Credentials' => true,
                    'Access-Control-Max-Age' => 86400,
                ],
            ],
        ]);
    }

    // ... остальной код контроллера
}
```

Или глобальный фильтр в `config/main.php`:

```php
'components' => [
    'response' => [
        'class' => yii\web\Response::class,
    ],
],
'as corsFilter' => [
    'class' => \yii\filters\Cors::class,
    'cors' => [
        'Origin' => ['https://tkavelli.github.io', 'http://localhost:*'],
        'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        'Access-Control-Request-Headers' => ['Content-Type', 'Authorization', 'Accept-Language'],
        'Access-Control-Allow-Credentials' => true,
        'Access-Control-Max-Age' => 86400,
    ],
],
```

### Node.js / Express

```javascript
const cors = require('cors');

app.use(cors({
    origin: ['https://tkavelli.github.io', 'http://localhost:*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
    credentials: true,
    maxAge: 86400
}));
```

### Nginx (Reverse Proxy)

Добавьте в блок server:

```nginx
add_header Access-Control-Allow-Origin "https://tkavelli.github.io" always;
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, PATCH, OPTIONS" always;
add_header Access-Control-Allow-Headers "Content-Type, Authorization, Accept-Language" always;
add_header Access-Control-Allow-Credentials "true" always;
add_header Access-Control-Max-Age "86400" always;

if ($request_method = OPTIONS) {
    return 204;
}
```

## Тестирование CORS

### Способ 1: Интерактивная документация

1. Перейдите на https://tkavelli.github.io/reezonly-space-openapi/try.html
2. Нажмите "Try it out" на любом эндпоинте
3. Откройте консоль браузера (F12 → Console) и проверьте ошибки CORS
4. Откройте вкладку Network (F12 → Network) и посмотрите заголовки ответа

### Способ 2: curl

```bash
curl -i -X OPTIONS \
  -H "Origin: https://tkavelli.github.io" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://ваш-api-домен.com/api/v1/user/user/index
```

Ответ должен содержать:
- `Access-Control-Allow-Origin: https://tkavelli.github.io`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS`
- и другие заголовки CORS

### Способ 3: JavaScript Fetch

```javascript
fetch('https://ваш-api-домен.com/api/v1/user/user/index', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ВАШ_ТОКЕН'
    },
    credentials: 'include'
}).then(r => r.json()).catch(e => console.error('CORS Error:', e));
```

## Решение проблем

### Ошибка: "Access to XMLHttpRequest blocked by CORS policy"

**Причина:** Backend не настроил CORS заголовки.

**Решение:**
1. Проверьте, что добавили CORS заголовки в API
2. Убедитесь, что `Access-Control-Allow-Origin` совпадает с доменом документации
3. Проверьте консоль браузера и вкладку Network для деталей

### Ошибка: "Method Not Allowed"

**Причина:** `Access-Control-Allow-Methods` не включает метод запроса.

**Решение:**
Убедитесь, что все HTTP методы, используемые API, указаны (GET, POST, PUT, DELETE, PATCH, OPTIONS).

### Ошибка: "Header not allowed"

**Причина:** `Access-Control-Allow-Headers` не включает требуемые заголовки.

**Решение:**
Убедитесь, что `Content-Type`, `Authorization`, `Accept-Language` включены в разрешенные заголовки.

## Важные замечания

- Домен документации: `https://tkavelli.github.io`
- Для разработки можно добавить `http://localhost:*` в разрешенные origin'ы
- `Access-Control-Max-Age` определяет время кеширования preflight ответов браузером (рекомендуется: 86400 сек = 24 часа)
- В production используйте явный домен вместо `*` в `Access-Control-Allow-Origin`

## Ссылки

- [MDN: CORS](https://developer.mozilla.org/ru/docs/Web/HTTP/CORS)
- [Yii2: CORS Filter](https://www.yiiframework.com/doc/guide/2.0/en/structure-filters#cors)
- [Express: CORS](https://expressjs.com/en/resources/middleware/cors.html)
