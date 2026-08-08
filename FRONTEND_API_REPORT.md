# UyTap — Отчёт для фронтенда: профиль и загрузка изображений

Документ описывает, что реализовано на бэкенде и как фронтенд может к этому обращаться.

**Дата:** 5 августа 2026  
**Бэкенд:** Node.js + Express + Supabase  
**Фронт не менялся** — этот файл для интеграции.

---

## 1. Подключение к API

| Параметр | Значение |
|----------|----------|
| Базовый URL | `http://localhost:5000/api` |
| Переменная окружения | `NEXT_PUBLIC_API_URL` |
| Авторизация | `Authorization: Bearer <JWT>` |
| Формат ответов | `{ success: true/false, message?, ... }` |

Проверка, что бэкенд запущен:

```
GET /api/health
```

---

## 2. Что сделано на бэкенде

Цепочка работы с фото:

```
Файл с устройства → Supabase Storage (бакет avatars) → публичный URL → user_profiles.avatar_url
```
### AI-функции

| Эндпоинт | Метод | Токен | Назначение |
|----------|-------|-------|------------|
| `/api/ai/search` | POST | нет | Разбор голосового/текстового запроса в поисковые фильтры |
| `/api/ai/generate-description` | POST | нет | Генерация продающих описаний недвижимости на русском и кыргызском |
### Новые эндпоинты

| Эндпоинт | Метод | Токен | Назначение |
|----------|-------|-------|------------|
| `/api/upload` | POST | нет | Загрузить файл, получить URL (для регистрации) |
| `/api/auth/avatar` | POST | да | Загрузить аватар сразу в профиль |
| `/api/auth/avatar` | DELETE | да | Удалить аватар |
| `/api/auth/me` | PUT | да | Обновить профиль (текст, phone, avatarUrl) |

### Существующие (без изменений)

| Эндпоинт | Метод | Назначение |
|----------|-------|------------|
| `/api/auth/register` | POST | Регистрация (принимает `avatarUrl` как строку) |
| `/api/auth/login` | POST | Вход |
| `/api/auth/me` | GET | Прочитать профиль |

---

## 3. Как фронт обращается к API

### 3.1. Регистрация с фото

Токена ещё нет — сначала загрузка файла, потом регистрация с URL.

```
Шаг 1: POST /api/upload
        multipart/form-data, поле "file"
        → { success: true, url: "https://..." }

Шаг 2: POST /api/auth/register
        JSON: { avatarUrl: url, accountType, email, phone, password, ... }
        → { success: true, token, user }

Шаг 3: router.push("/success-register")  — уже настроено во всех формах регистрации
```

### 3.2. AI-поиск

Фронтенд отправляет текст или результат голосового ввода на `POST /api/ai/search`.

```json
{
  "prompt": "Хочу дом в Иссык-Куле до 300 000$ с видом на озеро"
}
```

Ответ содержит готовые параметры для поиска:

```json
{
  "success": true,
  "filters": {
    "region": "Иссык-Кульская область",
    "district": "Чолпон-Ата",
    "propertyType": "house",
    "dealType": "sale",
    "rooms": 3,
    "maxPrice": 300000,
    "currency": "USD"
  },
  "source": "gemini-api"
}
```

После этого фронтенд должен мапить `filters` в локальные стейты и запускать поиск `/api/listings`.

### 3.3. Редактирование профиля — текстовые поля

```
PUT /api/auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Айбек",
  "lastName": "Алиев",
  "about": "О себе...",
  "phone": "+996555123456",
  "accountType": "personal",
  "avatarUrl": "https://..."
}
```

Все поля опциональные — обновляется только то, что отправили.

Удаление фото: `"avatarUrl": null`

Ответ:

```json
{
  "success": true,
  "message": "Профиль успешно обновлён",
  "user": {
    "id": "uuid",
    "accountType": "personal",
    "email": "user@mail.com",
    "phone": "+996555123456",
    "isVerified": false,
    "profile": {
      "first_name": "Айбек",
      "last_name": "Алиев",
      "avatar_url": "https://...",
      "about": "..."
    }
  }
}
```

### 3.3. Редактирование — загрузка файла напрямую

Пользователь уже авторизован — файл сразу попадает в профиль.

```
POST /api/auth/avatar
Authorization: Bearer <token>
multipart/form-data, поле "avatar"
```

Ответ:

```json
{
  "success": true,
  "message": "Аватар успешно загружен",
  "avatar_url": "https://...",
  "profile": { ... }
}
```

Отдельный `PUT /api/auth/me` после этого не нужен.

### 3.4. Удаление фото

Вариант A:

```
DELETE /api/auth/avatar
Authorization: Bearer <token>
```

Вариант B:

```
PUT /api/auth/me
{ "avatarUrl": null }
```

### 3.5. Показать фото в интерфейсе

После `login`, `register`, `getMe`, `updateMe`:

```jsx
const avatar = user?.profile?.avatar_url;

{avatar ? <img src={avatar} alt="avatar" /> : <UserIcon />}
```

Для `agency` и `developer` в `avatar_url` хранится логотип компании.

---

## 4. Ограничения на файлы

| Эндпоинт | Поле формы | Форматы | Макс. размер |
|----------|------------|---------|--------------|
| `POST /api/upload` | `file` | JPEG, PNG, WebP | 8 МБ |
| `POST /api/auth/avatar` | `avatar` | JPEG, PNG, WebP, GIF | 5 МБ |

- HEIC (iPhone) **не принимается** — конвертировать на фронте в JPEG/PNG.
- При `multipart` **не указывать** `Content-Type` вручную — браузер сам выставит boundary.

---

## 5. Имена полей

В **запросах** используется camelCase, в **ответах** `profile` — snake_case (как в БД).

| Запрос (camelCase) | Ответ profile (snake_case) |
|--------------------|----------------------------|
| `avatarUrl` | `avatar_url` |
| `firstName` | `first_name` |
| `lastName` | `last_name` |
| `companyName` | `company_name` |
| `officeAddress` | `office_address` |
| `accountType` | `account_type` (в объекте `user`) |

### Поля `PUT /api/auth/me`

| Поле | Описание |
|------|----------|
| `firstName` | Имя |
| `lastName` | Фамилия |
| `fullName` | ФИО (риэлтор) → `first_name` |
| `directorName` | Директор (агентство) → `first_name` |
| `companyName` | Название компании |
| `agencyName` | Агентство (риэлтор) → `company_name` |
| `inn` | ИНН |
| `officeAddress` | Адрес офиса |
| `about` | О себе |
| `phone` | Телефон (проверка уникальности) |
| `accountType` | `personal` / `realtor` / `agency` / `developer` |
| `avatarUrl` | URL фото или `null` для удаления |

---

## 6. Ошибки

Формат:

```json
{
  "success": false,
  "message": "Текст ошибки на русском",
  "errors": ["..."]
}
```

`errors` — только при валидации (`register`, `updateMe`).

| Код | Когда |
|-----|-------|
| 400 | Неверные данные, нет файла, неверный формат, превышен размер |
| 401 | Нет токена |
| 403 | Просроченный токен |
| 404 | Пользователь или аватар не найден |
| 500 | Ошибка сервера / Storage |

---

## 7. Что уже есть во фронте (`src/utils/api.js`)

| Функция | Статус |
|---------|--------|
| `registerUser` | есть |
| `loginUser` | есть |
| `getMe` | есть |
| `uploadImage` | **нужно добавить** |
| `updateMe` | **нужно добавить** |
| `uploadAvatar` | **нужно добавить** |
| `deleteAvatar` | **нужно добавить** |

### Пример функций для `api.js`

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function uploadImage(file) {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: form,
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message);
  return data.url;
}

export async function updateMe(token, payload) {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.errors?.join(", ") || data.message);
  }
  return data.user;
}

export async function uploadAvatar(token, file) {
  const form = new FormData();
  form.append("avatar", file);

  const response = await fetch(`${API_URL}/auth/avatar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message);
  return data;
}

export async function deleteAvatar(token) {
  const response = await fetch(`${API_URL}/auth/avatar`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message);
  return data;
}
```

---

## 8. Что подключить в UI

### `ProfileEditModal.jsx`

Сейчас при сохранении только `console.log(form)`. Нужно:

1. Новый файл → `uploadImage(file)` или `uploadAvatar(token, file)`
2. Текстовые поля → `updateMe(token, { firstName, lastName, about, avatarUrl })`
3. Удаление фото → `avatarUrl: null` или `deleteAvatar(token)`
4. После успеха — обновить стейт пользователя в приложении

### Формы регистрации

Если добавляется выбор фото:

1. `uploadImage(file)` → `url`
2. `registerUser({ ...fields, avatarUrl: url })`
3. Редирект на `/success-register` — уже работает

---

## 9. Схема потоков

```
РЕГИСТРАЦИЯ С ФОТО:
  [файл] → POST /upload → url → POST /register { avatarUrl } → /success-register

РЕДАКТИРОВАНИЕ:
  [файл]  → POST /upload + PUT /me { avatarUrl }
         или POST /auth/avatar
  [текст] → PUT /auth/me
  [удалить] → DELETE /auth/avatar  или  PUT /me { avatarUrl: null }

ПРОСМОТР:
  GET /auth/me → user.profile.avatar_url
```

---

## 10. Зависимости инфраструктуры

Загрузка файлов не заработает, пока на стороне Supabase не настроено:

1. Бакет **`avatars`** с публичным чтением (Public bucket)
2. В `.env` бэкенда `SUPABASE_KEY` = **service_role**

Если `POST /upload` возвращает 500 — проверить эти настройки у бэкенд-разработчика.

---

*Подробная техническая история изменений: [`TECHNICAL_HISTORY.md`](./TECHNICAL_HISTORY.md)*
