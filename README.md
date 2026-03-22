## Nest JS App Template

Backend-шаблон на NestJS с авторизацией через Google ID Token и выдачей JWT токена приложения.  
Если пользователя нет в БД, он создаётся автоматически при первом входе через Google.

## Используемые библиотеки

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- `@nestjs/config`
- `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`
- `google-auth-library`
- `prisma`, `@prisma/client`
- `@nestjs/swagger`
- `class-validator`, `class-transformer`
- `argon2`

## Переменные окружения

- `DATABASE_URL`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`

## API

### Auth

- `POST /auth/google/login`
  - логин через Google
  - принимает `idToken`
  - если пользователь есть по email -> не создаётся, выдаётся новый JWT
  - если пользователя нет -> создаётся, затем выдаётся JWT

### User (JWT required)

- `GET /user/getMe`
- `GET /user/get/:id`
- `PATCH /user/update/:id`

## Пример запроса/ответа

Запрос:

```http
POST /auth/google/login HTTP/1.1
Host: localhost:3010
Content-Type: application/json

{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
}
```

Успешный ответ:

```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Ошибка:

```json
{
  "statusCode": 401,
  "message": "google-email-not-verified"
}
```

## Swagger

После запуска:

- `http://localhost:3010/api`

## Архитектура проекта

```text
.
├─ .env.example
├─ .gitignore
├─ .prettierrc
├─ Dockerfile
├─ docker-compose.yml
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma.config.ts
├─ README.md
├─ tsconfig.build.json
├─ tsconfig.json
├─ prisma/
│  └─ schema.prisma
└─ src/
   ├─ global.module.ts
   ├─ main.ts
   ├─ auth/
   │  ├─ auth.controller.ts
   │  ├─ auth.module.ts
   │  ├─ auth.service.ts
   │  ├─ dto/
   │  │  └─ requests/
   │  │     ├─ google-sign-in.request.ts
   │  │     ├─ sign-in.request.ts
   │  │     └─ sign-up.request.ts
   │  ├─ guards/
   │  │  └─ jwt-auth.guard.ts
   │  └─ strategies/
   │     └─ jwt.strategy.ts
   ├─ common/
   │  ├─ enums/
   │  │  └─ role.enum.ts
   │  ├─ exceptions/
   │  │  ├─ app-exception.ts
   │  │  └─ prisma.exception-filter.ts
   │  └─ types/
   │     └─ role.type.ts
   ├─ core/
   │  ├─ decorators/
   │  │  └─ roles.decorator.ts
   │  ├─ exceptions/
   │  │  ├─ app-exception.ts
   │  │  └─ prisma.exception-filter.ts
   │  ├─ filters/
   │  │  └─ exception-filter.ts
   │  └─ guards/
   │     └─ roles.guard.ts
   ├─ database/
   │  └─ prisma/
   │     ├─ prisma.module.ts
   │     ├─ prisma.service.ts
   │     └─ seed.ts
   └─ modules/
      └─ user/
         ├─ dto/
         │  ├─ requests/
         │  │  └─ update-user.request.ts
         │  └─ responses/
         │     └─ user.response.ts
         ├─ models/
         │  ├─ auth.user.model.ts
         │  └─ user.model.ts
         ├─ user.controller.ts
         ├─ user.module.ts
         ├─ user.repository.ts
         └─ user.service.ts
```
