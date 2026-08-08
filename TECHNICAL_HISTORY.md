# UyTap — Техническая история проекта и отчет по продвижению

Данный документ содержит хронологию разработки, архитектурные решения, историю изменений и инструкции по подключению сервисов для платформы недвижимости **UyTap** (Кыргызстан).

---

## 📌 1. Общие сведения о проекте

* **Название платформы:** UyTap (УйТап)
* **Назначение:** Доска объявлений о недвижимости в Кыргызстане (продажа и аренда) с умным AI-поиском и генерацией объявлений.
* **Технологический стек:**
  * **Front-end:** Next.js, React, Vanilla CSS / CSS Modules, Framer Motion, Lucide Icons.
  * **Back-end:** Node.js (ES Modules), Express.js, JWT, Zod validation, Bcrypt.js.
  * **База данных:** PostgreSQL / Supabase.
  * **Искусственный интеллект:** Google Gemini API (Умный поиск, автогенерация описаний и переводов RU/KG).

---

## 🏗 2. Архитектурные правила и Принцип DRY (Don't Repeat Yourself)

В ходе анализа предыдущей версии платформы было обнаружено 13 мест с дублированием данных (списки районов, удобств, правила проверки паролей). В новой версии внедрены следующие правила:
1. **Единый источник правды (Single Source of Truth):** Все справочники (регионы, типы недвижимости, удобства) хранятся в одном модуле `back-end/src/constants/`.
2. **Единая логика фильтрации:** Логика подбора объявлений идентична на главной странице, странице поиска и интерактивной карте.
3. **Разделение статусов:** Платные статусы продвижения (`VIP`, `ТОП`, `Срочно`) хранятся в объявлении, а статус `is_verified` (Верифицирован) принадлежит профилю пользователя.
4. **Правило Главной страницы:** Объявления без фотографий гарантированно отфильтровываются из блока «Популярные», даже если у них оплачен статус VIP/ТОП.

---

## 📊 3. Хронология сессий и Детальная История Изменений

### 📅 Сессия: 30 июля 2026 г.
* **Цель:** Анализ ТЗ (`technicalinstry.txt`) и составление плана бэкенда.
* **Выполнено:**
  * Анализ всех бизнес-требований и спецификаций Иссык-Куля.
  * Создание первичного журнала `CHANGELOG.md` в бэкенде.
  * Составление дорожной карты архитектуры данных (`backend_plan.md`).

---

### 📅 Сессия: 3 августа 2026 г. (Текущий этап)
* **Цель:** Полная реализация бэкенд-функций под готовый фронтенд, расширение БД и связь всех компонентов.

#### 📝 Выполненные задачи:

1. **Разработка Схемы Базы Данных ([`schema.sql`](file:///C:/Users/User/Desktop/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82/uytapkg/back-end/src/schema.sql)):**
   * Создано 11 реляционных таблиц для полной поддержки сайта:
     - `users`: Аутентификация, email, phone, hashed_password, role, is_verified, account_type.
     - `user_profiles`: Персональные данные (имя, фамилия, компания, ИНН, адрес офиса, аватар).
     - `verification_requests`: Заявки на верификацию продавцов (сканы паспортов, статус одобрения/отказа).
     - `listings`: Единая база недвижимости (тип, сделка, период аренды, регион, город, район, координаты, цена, курортный флаг `is_resort`, статусы `VIP`/`TOP`/`URGENT`).
     - `listing_photos`: Таблица фотографий с порядком отображения и флагом главного фото.
     - `developers` & `residential_complexes`: Застройщики и витрина ЖК.
     - `complex_layouts`: Планировки квартир с ценами и статусом «доступно/продано».
     - `favorites`: Избранные объявления пользователей.
     - `banners`: Рекламные баннеры с аналитикой показов и кликов.

2. **Создание Единых Справочников ([`src/constants/`](file:///C:/Users/User/Desktop/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82/uytapkg/back-end/src/constants/)):**
   * `locations.js`: Районы Бишкека, сёл и курортных зон Иссык-Куля (Чолпон-Ата, Бостери, Тамчи и др.).
   * `propertyTypes.js`: Маппинг категорий недвижимости и разрешенных вариантов аренды.
   * `amenities.js`: Удобства для обычной и курортной недвижимости (вид на озеро, бассейн, пляж).

3. **Разработка контроллеров и роутов:**
   * **Авторизация и Вход ([`authController.js`](file:///C:/Users/User/Desktop/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82/uytapkg/back-end/src/controllers/authController.js)):** Вход по Email/паролю и телефонным OTP-кодам в WhatsApp (с поддержкой тестового режима `1111`/`1234`), генерация JWT.
   * **Поиск и Объявления ([`listingsController.js`](file:///C:/Users/User/Desktop/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82/uytapkg/back-end/src/controllers/listingsController.js)):** Комплексный поиск с фильтрами, пагинация, просмотры, фильтр "Популярные".
   * **Застройщики и ЖК ([`complexesController.js`](file:///C:/Users/User/Desktop/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82/uytapkg/back-end/src/controllers/complexesController.js)):** Просмотр ЖК и планировок.
   * **Умный AI-поиск ([`aiController.js`](file:///C:/Users/User/Desktop/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82/uytapkg/back-end/src/controllers/aiController.js)):** Прямая интеграция Google Gemini API с умным локальным фолбэком.

4. **Интеграция с Фронтендом:**
   * Обновлен модуль запросов [`front-end/src/utils/api.js`](file:///C:/Users/User/Desktop/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82/uytapkg/front-end/src/utils/api.js).
   * Компонент Умного поиска [`SmartSearch.jsx`](file:///C:/Users/User/Desktop/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82/uytapkg/front-end/src/components/pageComponents/smartSearch/SmartSearch.jsx) соединен с AI API.

### 📅 Сессия: 5 августа 2026 г.
* **Цель:** Загрузка фото/лого профиля, редактирование личного кабинета на бэкенде (фронт не трогали).

#### 📝 Выполненные задачи:

1. **Загрузка файлов в Supabase Storage:**
   * Установлен `multer` (v2) для приёма `multipart/form-data`.
   * Создан [`middleware/upload.js`](back-end/src/middleware/upload.js) — валидация типа и размера файлов.
   * Создан [`utils/storage.js`](back-end/src/utils/storage.js) — upload/delete в бакет `avatars`, получение публичного URL.

2. **Публичная загрузка (для регистрации, без токена):**
   * `POST /api/upload` — поле формы `file`, JPEG/PNG/WebP, до 8 МБ.
   * Ответ: `{ success: true, url: "..." }`.
   * Файлы сохраняются в `avatars/uploads/{uuid}.{ext}`.
   * HEIC отклоняется с сообщением на русском.
   * Файлы: [`uploadController.js`](back-end/src/controllers/uploadController.js), [`uploadRoutes.js`](back-end/src/routes/uploadRoutes.js).

3. **Загрузка аватара авторизованным пользователем:**
   * `POST /api/auth/avatar` — поле `avatar`, JPEG/PNG/WebP/GIF, до 5 МБ, JWT обязателен.
   * Сразу пишет URL в `user_profiles.avatar_url`, удаляет старый файл из Storage.
   * `DELETE /api/auth/avatar` — сброс `avatar_url` и удаление файла.

4. **Редактирование профиля (личный кабинет):**
   * `PUT /api/auth/me` — JWT обязателен, JSON-тело, все поля опциональные.
   * Обновляет `users` (phone, accountType) и `user_profiles` (имя, about, avatarUrl, поля ролей).
   * `avatarUrl: null` — удаление фото.
   * Ответ в формате `getMe()`: `{ success, message, user }`.
   * Схема валидации: [`validation.js`](back-end/src/utils/validation.js) → `updateMeSchema`.

5. **Подключение роутов:**
   * [`index.js`](back-end/src/index.js) — `app.use("/api/upload", uploadRoutes)`.
   * [`authRoutes.js`](back-end/src/routes/authRoutes.js) — `PUT /me`, `POST /avatar`, `DELETE /avatar`.

6. **Проверка фронтенда (без изменений кода):**
   * Редирект после регистрации на `/success-register` — уже настроен во всех формах.

### 📅 Сессия: 9 августа 2026 г.
* **Цель:** Нормальная реализация AI-поиска и привязка его к UI.
* **Выполнено:**
  * Усовершенствован `back-end/src/controllers/aiController.js` — теперь Gemini API парсится в корректный JSON, а при ошибках используется локальный fallback.
  * Привязка `SmartSearchVoice` к состояниям поиска в `front-end/src/components/pageComponents/searchFilter/SearchFilter.jsx`.
  * Добавлен `generateDescription` в `front-end/src/utils/api.js` для будущей AI-генерации текстов.
  * Фронтенд теперь передаёт результат AI-парсинга `onAiParsed` и запускает поиск по реальным фильтрам.

#### 📁 Изменённые / новые файлы:
| Файл | Назначение |
|------|------------|
| `src/middleware/upload.js` | Multer: `uploadImageFile` (поле `file`), `uploadAvatar` (поле `avatar`) |
| `src/utils/storage.js` | Upload/delete в Supabase Storage |
| `src/controllers/uploadController.js` | Обработчик `POST /api/upload` |
| `src/routes/uploadRoutes.js` | Роут загрузки |
| `src/controllers/authController.js` | `updateMe`, `uploadUserAvatar`, `deleteUserAvatar` |
| `src/routes/authRoutes.js` | Новые роуты профиля и аватара |
| `src/controllers/aiController.js` | AI-парсер Gemini + локальный fallback |
| `src/routes/aiRoutes.js` | Роуты `/api/ai/search` и `/api/ai/generate-description` |
| `front-end/src/utils/api.js` | Добавлен `generateDescription(details)` и AI search helper |
| `front-end/src/components/pageComponents/searchFilter/SearchFilter.jsx` | Привязка `onAiParsed` к UI-фильтрам и запуск поиска |
| `src/utils/validation.js` | `updateMeSchema` |
| `src/index.js` | Подключение `/api/upload`, обработка ошибок multer |
| `package.json` | Зависимость `multer` |

#### 🔧 Инструкция этой сессии:
1. AI-поиск выполняется через `POST /api/ai/search`.
2. Компонент `SmartSearchVoice` отправляет текст/голос на бэкенд.
3. Бэкенд пытается распарсить запрос Gemini API в JSON, при ошибках возвращает локальный парсер.
4. Результат AI попадает в `SearchFilter` и мапится в реальные фильтры `region`, `district`, `propertyType`, `dealType`, `rooms`, `maxPrice`.
5. После парсинга сразу запускается запрос `/api/listings`.

#### 🔌 Как фронт получает доступ (кратко):
* Базовый URL: `NEXT_PUBLIC_API_URL` или `http://localhost:5000/api`.
* Регистрация с фото: `POST /upload` → `url` → `POST /auth/register` с `avatarUrl`.
* Редактирование: `PUT /auth/me` (текст + `avatarUrl`) или `POST /auth/avatar` (файл напрямую).
* Чтение профиля: `GET /auth/me` с `Authorization: Bearer <token>`.
* Фото в ответах: `user.profile.avatar_url`.

* **Ручная настройка:** в Supabase создать публичный бакет `avatars`. В `.env` ключ `SUPABASE_KEY` = **service_role**.
* **Отчёт для фронтенда:** [`FRONTEND_API_REPORT.md`](./FRONTEND_API_REPORT.md)

---

## 🛠 4. Статус Подключения Сервисов и Настройка Конфигурации

Файл конфигурации бэкенда [`back-end/.env`](file:///C:/Users/User/Desktop/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82/uytapkg/back-end/.env):

```env
PORT=5000
SUPABASE_URL=https://kakiuqgjhcunyaxydopx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI...
DATABASE_URL=https://kakiuqgjhcunyaxydopx.supabase.co/rest/v1/
JWT_SECRET=tVfRotVOr4zPbzPj...
# Опционально для активации боевой нейросети Gemini:
GEMINI_API_KEY=ваш_ключ_из_google_ai_studio
```

---

## 🚀 5. План Дальнейшего Продвижения Разработки

1. **Развертывание БД в Supabase:** Выполнить скрипт [`schema.sql`](back-end/src/schema.sql) в Supabase SQL Editor.
2. **Бакет аватаров:** Storage → New bucket → `avatars` (Public), `SUPABASE_KEY` = service_role.
3. **Интеграция фронтенда:** добавить в `api.js` функции `uploadImage`, `updateMe`, `uploadAvatar`, `deleteAvatar`; подключить `ProfileEditModal`.
4. **Разработка Админ-панели:** роуты `/api/admin` для модерации и верификации.
5. **Раздел подачи объявлений:** мульти-шаговая форма с AI-автогенерацией текста.
6. **Тестирование и деплой:** Vercel (Front-end), Render/DigitalOcean (Back-end).
