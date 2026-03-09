## Описание

Шаблон backend‑приложения на NestJS с аутентификацией по JWT, модулем пользователей и интеграцией с Prisma и Swagger. Можно использовать как стартовую точку для REST API с авторизацией и базой данных.

### Основные технологии

- **NestJS** (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`)
- **JWT** (`@nestjs/jwt`, `passport-jwt`, `@nestjs/passport`)
- **Prisma** (`prisma`, `@prisma/client` v6)
- **Swagger** (`@nestjs/swagger`)
- **Валидация и сериализация** (`class-validator`, `class-transformer`)
- **Шифрование паролей** (`argon2`)
- **docker**

## API

###  Swagger UI
Интерактивная документация API доступна после запуска приложения:

`http://localhost:{{PORT}}/api/docs`

### Пример запроса/ответа

**Запрос:**

```http
POST /auth/login HTTP/1.1
Host: localhost:3010
Content-Type: application/json

{
  "username": "demo-user",
  "password": "demo-password"
}
```

**Успешный ответ 200:**

```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
