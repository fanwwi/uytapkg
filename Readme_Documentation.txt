UyTap — Документация проекта

О ПРОЕКТЕ

UyTap — цифровая платформа для поиска, размещения и управления объявлениями о недвижимости в Кыргызстане.
Проект объединяет в одном сервисе собственников недвижимости, покупателей, арендаторов, риэлторов, агентства недвижимости и застройщиков.
Основная задача UyTap — сделать поиск и размещение недвижимости более удобными, понятными и локализованными под рынок Кыргызстана.
Пользователь может искать недвижимость, использовать фильтры, просматривать объекты на карте, открывать подробную информацию об объекте, добавлять объявления в избранное, создавать собственные объявления и управлять своим профилем.

ОСНОВНЫЕ ВОЗМОЖНОСТИ

* Поиск недвижимости
* Фильтрация объявлений
* Просмотр подробной информации об объекте
* Просмотр объектов на карте
* Добавление объявлений
* Редактирование и управление объявлениями
* Избранное
* Личный профиль
* Регистрация и авторизация
* Отдельные профили для разных типов пользователей
* Новостройки и жилые комплексы
* Профили застройщиков
* Профили риэлторов
* Профили агентств недвижимости
* AI-функции
* Голосовые функции
* Платные услуги
* Генерация PDF-чеков
* Поддержка русского и кыргызского языков
* Адаптивная версия для мобильных устройств

ТИПЫ ПОЛЬЗОВАТЕЛЕЙ

1. Personal

Обычный пользователь платформы.

Возможности:

* поиск недвижимости;
* просмотр объявлений;
* добавление объектов в избранное;
* создание собственных объявлений;
* управление профилем.

2. Realtor

Профессиональный риэлтор.

Возможности:

* создание профессионального профиля;
* размещение объявлений;
* управление собственными объектами;
* отображение информации о деятельности.

3. Agency

Агентство недвижимости.

Профиль может содержать:

* название агентства;
* имя руководителя;
* телефон;
* email;
* адрес офиса;
* ИНН;
* описание компании;
* объявления агентства.

4. Developer

Застройщик.

Профиль компании может содержать:

* название компании;
* ИНН;
* телефон;
* email;
* адрес офиса;
* описание компании;
* проекты;
* объявления.

АРХИТЕКТУРА

Проект состоит из двух основных частей:

Frontend
Backend

Frontend отвечает за пользовательский интерфейс, навигацию, формы, отображение данных, карты, авторизацию на стороне клиента и взаимодействие с API.
Backend отвечает за бизнес-логику, пользователей, авторизацию, объявления, избранное, платежи, работу с базой данных и обработку API-запросов.

Общая схема:

Frontend
|
v
REST API
|
v
Backend
|
v
Database

FRONTEND

Frontend проекта построен на следующих технологиях:

* Next.js
* React
* JavaScript
* JSX
* CSS Modules
* Lucide React
* Leaflet
* Axios / Fetch
* Firebase
* Supabase
* Framer Motion
* Swagger API

NEXT.JS

Next.js используется как основной framework frontend-приложения.

Основные задачи:

* маршрутизация;
* страницы;
* layouts;
* client components;
* оптимизация изображений;
* работа с API;
* production deployment.

СТРУКТУРА FRONTEND

Основная структура проекта:

src/
app/
components/
context/
utils/
assets/

app/ содержит страницы и маршруты приложения.

components/ содержит переиспользуемые UI-компоненты.

context/ содержит глобальные React Context, например LanguageContext.

utils/ содержит вспомогательные функции и API-запросы.

assets/ содержит локальные изображения и другие ресурсы.

API LAYER

Основная работа с backend API вынесена в:

src/utils/
src/app/


Вместо того чтобы писать fetch непосредственно в каждом компоненте, frontend использует централизованные API-функции.

Примеры функций:

registerUser()
loginUser()
getMe()
getMyListings()
getFavorites()
getListingById()
addFavorite()
removeFavorite()

Централизация API позволяет уменьшить дублирование кода и сделать работу с backend более предсказуемой.

АВТОРИЗАЦИЯ

Для клиентской части используются два основных значения:

uytap_token
uytap_user

uytap_token содержит authentication token.

uytap_user содержит информацию о текущем пользователе.

AUTH FLOW

Регистрация:

Registration Form
|
v
registerUser()
|
v
Backend /auth/register
|
v
token + user
|
v
localStorage
|
v
/auth-code

Авторизация:

Login Form
|
v
loginUser()
|
v
Backend /auth/login
|
v
token + user
|
v
localStorage
|
v
Application

ПРОВЕРКА АВТОРИЗАЦИИ

Frontend проверяет наличие:

uytap_token

и

uytap_user

Если оба значения существуют, пользователь считается авторизованным.

Header не должен выполнять дополнительный getMe() только для проверки факта авторизации.

Это уменьшает количество ненужных API-запросов.

СИНХРОНИЗАЦИЯ AUTH STATE

После изменения данных пользователя используется custom browser event:

uytap:user-updated

Пример:

window.dispatchEvent(
new Event("uytap:user-updated")
);

Другие компоненты могут подписываться на это событие и обновлять своё состояние.

ЗАЩИЩЁННЫЕ МАРШРУТЫ

Некоторые страницы доступны только авторизованным пользователям.

Примеры:

/profile
/favorites
/add-product

Если пользователь не авторизован, он перенаправляется на:

/auth-required

РЕГИСТРАЦИЯ

В системе предусмотрены отдельные формы регистрации:

* Personal
* Realtor
* Agency
* Developer

Каждая форма передаёт соответствующий accountType.

Примеры:

accountType: "personal"

accountType: "realtor"

accountType: "agency"

accountType: "developer"

ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ

Перед регистрацией пользователь должен принять:

* Политику конфиденциальности
* Пользовательское соглашение

Кнопка регистрации заблокирована до принятия обоих документов.

Страницы:

/privacy-policy

/terms

РАБОТА С ОБЪЯВЛЕНИЯМИ

Основной сценарий создания объявления:

User
|
v
Add Product
|
v
Form
|
v
API
|
v
Backend
|
v
Database
|
v
Listing

ОБЪЕКТ НЕДВИЖИМОСТИ

Объявление может содержать:

* название;
* описание;
* цену;
* тип недвижимости;
* категорию;
* адрес;
* координаты;
* фотографии;
* площадь;
* количество комнат;
* характеристики;
* информацию о владельце;
* дополнительные параметры.

PRODUCT DETAILS

Страница объекта получает ID объявления и загружает информацию через API.

Основная функция:

getListingById(id)

Страница может отображать:

* фотографии;
* цену;
* описание;
* характеристики;
* адрес;
* карту;
* информацию о владельце;
* состояние избранного.

ИЗБРАННОЕ

Пользователь может сохранять объявления.

Основные операции:

addFavorite()

removeFavorite()

Общий принцип:

Listing
|
v
Add to favorites
|
v
Backend
|
v
Favorite relation

КАРТЫ

Для работы с картами используется Leaflet.

Карты используются для:

* поиска недвижимости;
* отображения расположения объектов;
* отображения маркеров;
* поиска объектов в определённой области;
* просмотра объектов на карте.

Общий принцип:

Listing
|
v
latitude / longitude
|
v
Leaflet
|
v
Marker
|
v
Listing Details

AI-ФУНКЦИИ

UyTap содержит AI-функциональность для улучшения взаимодействия пользователя с платформой.

В проекте используются:

* Google Gemini
* ElevenLabs

AI может применяться для:

* интеллектуального поиска;
* обработки пользовательских запросов;
* генерации и обработки информации;
* голосовых функций;
* дополнительных сценариев взаимодействия с недвижимостью.

GEMINI

Gemini используется для AI-сценариев и обработки пользовательских запросов.

Общий принцип:

User query
|
v
Frontend
|
v
AI request
|
v
Gemini
|
v
Result
|
v
Frontend

SUPABASE

Supabase используется для отдельных данных и дополнительных элементов платформы.
В частности, проект использует баннеры и связанный с ними контент.

Пример API-функции:

getBanners()

FIREBASE

Firebase используется для соответствующих интеграций проекта.
Конкретный набор Firebase-сервисов зависит от текущей конфигурации проекта.

ПЛАТЕЖИ

UyTap поддерживает платные услуги.

Платёжная система может использоваться для:

* размещения объявлений;
* продвижения;
* дополнительных услуг;
* тарифов.

Общий принцип:

User
|
v
Payment
|
v
Backend
|
v
Payment processing
|
v
Success / Error

PDF-ЧЕКИ

После успешной оплаты frontend может создавать PDF-чек.

Используются:

* html2canvas
* jsPDF

Общий принцип:

Payment success
|
v
Receipt component
|
v
html2canvas
|
v
Image
|
v
jsPDF
|
v
PDF receipt

Название файла:

uytap-receipt-{paymentId}.pdf

МУЛЬТИЯЗЫЧНОСТЬ

UyTap поддерживает два языка:

RU — русский

KG — кыргызский

Для управления языком используется LanguageContext.

Переключение языка выполняется через:

changeLanguage("ru")

changeLanguage("ky")

Для получения перевода используется:

t("header.locations")

Компонент переключения:

LanguageSwitcher

BACKEND

Backend является API-слоем между frontend и database.

Основные задачи backend:

* регистрация;
* авторизация;
* управление пользователями;
* управление объявлениями;
* избранное;
* платежи;
* валидация;
* бизнес-логика;
* работа с database;
* обработка API-запросов.

BACKEND AUTHENTICATION

Основные authentication endpoints:

POST /auth/register

POST /auth/login

GET /auth/me

REGISTRATION API

Для персонального аккаунта frontend отправляет данные примерно в следующем формате:

{
"accountType": "personal",
"firstName": "Name",
"lastName": "Surname",
"phone": "+996XXXXXXXXX",
"email": "[user@example.com](mailto:user@example.com)",
"password": "********"
}

Для других типов аккаунтов набор полей отличается.

LOGIN API

Пример данных:

{
"email": "[user@example.com](mailto:user@example.com)",
"password": "********"
}

API AUTHENTICATION

Защищённые запросы используют authentication token.

Общий принцип:

Authorization: Bearer <token>

Backend проверяет token перед выполнением защищённых операций.

USERS

Backend хранит данные пользователей и информацию о типе аккаунта.

Основные типы:

personal
realtor
agency
developer

LISTINGS

Основная сущность платформы — объявление недвижимости.

Условно объявление содержит:

* id;
* title;
* description;
* price;
* type;
* category;
* address;
* latitude;
* longitude;
* images;
* features;
* owner;
* createdAt.

Фактическая структура зависит от backend schema.

DATABASE

Backend отвечает за взаимодействие с базой данных.

Основные группы данных:

* Users
* Listings
* Favorites
* Payments
* Developers
* Agencies
* Realtors

ВАЛИДАЦИЯ

Frontend выполняет validation для удобства пользователя.

Однако основная validation должна выполняться на backend.

Frontend validation не является механизмом безопасности.

SWAGGER

Swagger / OpenAPI используется для документирования API.

Swagger позволяет:

* просматривать endpoints;
* смотреть request schemas;
* тестировать API;
* проверять authentication;
* изучать response schemas.

ENVIRONMENT VARIABLES

Frontend использует environment variables.

Основные:

NEXT_PUBLIC_API_URL

BACKEND_API_URL

Пример:

NEXT_PUBLIC_API_URL=[https://your-backend-url](https://your-backend-url)

BACKEND_API_URL=[https://your-backend-url](https://your-backend-url)

Секретные ключи, пароли, database credentials и private tokens нельзя хранить непосредственно в исходном коде.

УСТАНОВКА FRONTEND

Клонировать проект:

git clone <repository-url>

Перейти в frontend:

cd frontend

Установить зависимости:

npm install

Создать файл:

.env.local

Добавить:

NEXT_PUBLIC_API_URL=...

BACKEND_API_URL=...

ЗАПУСК FRONTEND

Development:

npm run dev

После запуска приложение обычно доступно по:

[http://localhost:3000](http://localhost:3000)

PRODUCTION BUILD

Создание production build:

npm run build

Запуск production:

npm run start

BACKEND

Перейти в backend:

cd backend

Установить зависимости согласно package manager backend.

Например:

npm install

После настройки environment variables запустить backend development server.

DEPLOYMENT

Frontend может быть размещён на Vercel.

Общий процесс:

GitHub
|
v
Vercel
|
v
Next.js Build
|
v
Production

Перед deployment необходимо добавить environment variables в настройках проекта.

PERFORMANCE

Для frontend необходимо контролировать:

* LCP;
* CLS;
* TBT;
* JavaScript bundle size;
* image size;
* количество API-запросов;
* client-side rendering;
* animations;
* third-party scripts.

Особое внимание следует уделять изображениям недвижимости, так как они могут значительно увеличивать размер страницы.

Для изображений рекомендуется использовать Next.js Image.

RESPONSIVE DESIGN

UyTap поддерживает:

* Desktop;
* Tablet;
* Mobile.

Адаптивность применяется к:

* Header;
* Navigation;
* Forms;
* Listing cards;
* Maps;
* Filters;
* Profile;
* Payment pages.

MOBILE NAVIGATION

На мобильных устройствах используется отдельное меню.

Оно содержит:

* профиль;
* авторизацию;
* переключатель языка;
* основные разделы;
* избранное;
* добавление объявления.

UI DESIGN

Основной цвет интерфейса:

#483DF6

Цвет используется для:

* primary buttons;
* active states;
* links;
* icons;
* borders;
* interactive elements.

Основные принципы дизайна:

* белый фон;
* тёмный текст;
* насыщенный фиолетовый акцент;
* скруглённые элементы;
* понятная иерархия;
* адаптивность;
* минимальное использование тяжёлых визуальных эффектов.

ОСНОВНАЯ СТРУКТУРА ПРОЕКТА

UyTap/

```
frontend/

    src/

        app/

        components/

        context/

        utils/

        assets/

    public/

    package.json

    next.config.*

    .env.example


backend/

    ...

    package.json

    .env.example


README.txt
```

GIT WORKFLOW

Примеры commit messages:

feat: add realtor registration

fix: improve authentication state

feat: add favorites

fix: optimize listing images

feat: add payment receipt

refactor: centralize API requests

style: improve mobile header

CHECKLIST ПЕРЕД PRODUCTION

Authentication:

* Регистрация работает
* Авторизация работает
* Logout удаляет authentication data
* Защищённые страницы перенаправляют неавторизованных пользователей
* Profile показывает правильный account type

Listings:

* Создание объявления работает
* Редактирование работает
* Удаление работает
* Детальная страница работает
* Поиск работает
* Фильтры работают

Favorites:

* Добавление в избранное работает
* Удаление из избранного работает
* Страница избранного работает

Maps:

* Карта загружается
* Маркеры отображаются
* Координаты корректны

Payments:

* Payment request работает
* Success state работает
* Error state работает
* PDF receipt создаётся

Localization:

* Русский язык работает
* Кыргызский язык работает
* LanguageSwitcher работает

Mobile:

* Header работает
* Mobile navigation работает
* Forms корректно отображаются
* Listing cards адаптивны
* Maps корректно отображаются
* Profile адаптивен

БЕЗОПАСНОСТЬ

Необходимо не добавлять в Git:

.env
.env.local
.env.production
API keys
JWT secrets
Database passwords
Private tokens

Для repository рекомендуется создать:

.env.example

В нём должны находиться только названия необходимых переменных без настоящих секретов.

PROJECT PHILOSOPHY

UyTap создан с идеей сделать поиск недвижимости простым, локальным и технологичным.
Платформа объединяет классические объявления о недвижимости с картами, AI-инструментами, профилями пользователей, избранным и цифровыми услугами.

Основной принцип:

Найти недвижимость.
Изучить объект.
Посмотреть расположение.
Связаться с продавцом.
Сохранить объект или воспользоваться дополнительной услугой.

LICENSE

Проект является проприетарным.
Исходный код, дизайн, бренд, бизнес-логика и материалы проекта не могут быть скопированы, распространены или использованы в коммерческих целях без разрешения владельцев проекта.
