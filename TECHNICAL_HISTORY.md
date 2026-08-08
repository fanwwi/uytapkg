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
* **Цель:** Загрузка аватарок на бэкенде (фронт не трогали).
* **Выполнено:**
  * `POST /api/auth/avatar` — multipart, поле `avatar` → Supabase Storage (`avatars`) → `user_profiles.avatar_url`.
  * `DELETE /api/auth/avatar` — сброс URL и удаление файла из Storage.
  * Модули: `middleware/upload.js` (multer), `utils/storage.js`.
* **Ручная настройка:** в Supabase создать публичный бакет `avatars`. В `.env` ключ `SUPABASE_KEY` должен быть **service_role** (иначе upload в Storage запрещён).

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

1. **Развертывание БД в Supabase:** Выполнить скрипт [`schema.sql`](file:///C:/Users/User/Desktop/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82/uytapkg/back-end/src/schema.sql) в вашем Supabase SQL Editor.
2. **Бакет аватаров:** Storage → New bucket → `avatars` (Public).
3. **Разработка Админ-панели:** Подготовка роутов `/api/admin` для модерации объявлений и заявок на верификацию.
4. **Раздел Подачи объявлений на Фронтенде:** Верстка мульти-шаговой формы с кнопкой AI-автогенерации текста.
5. **Тестирование и деплой:** Локальное тестирование взаимодействия всех компонентов с последующим деплоем на Vercel (Front-end) и Render/DigitalOcean (Back-end).
