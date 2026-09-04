# UyTap Backend — Adversarial Security Review Findings

Проведено против локально поднятого бэкенда (`node src/index.js`,
`http://localhost:5000`), ходящего в реальный (боевой) Supabase-проект
`kakiuqgjhcunyaxydopx.supabase.co`. Все PoC — рабочий код в
`back-end/security-tests/*.test.mjs`, запускается: `node --test "back-end/security-tests/*.test.mjs"`
(15/15 тестов проходят, все подтверждают эксплойт или подтверждают отсутствие
уязвимости — см. пометки). Все тестовые строки/файлы созданы и удалены в
teardown каждого теста; полный журнал — `SECURITY_LOG.md` (после прогона —
пусто по `sectest-*@example-security-test.local`, проверено запросом к БД).

---

## 1. Free paid-promotion bypass on listing CREATE — CRITICAL

**Файл:** `back-end/src/controllers/listingsController.js:224-233` (createListing)

```js
let promotion_status = "regular";
let is_urgent = false;
if (listingType === "vip") {
  promotion_status = "vip";
} else if (listingType === "top") {
  promotion_status = "top";
} else if (listingType === "urgent") {
  is_urgent = true;
}
```

`listingType` приходит напрямую из тела клиентского запроса
(`utils/validation.js:176`, `z.string().optional().nullable()` — вообще без
ограничения набора значений) и ни разу не сверяется ни с оплаченным
заказом продвижения (`utils/promotionOrders.js`), ни с ролью пользователя.

**Воспроизведение:**
```
POST /api/listings
Authorization: Bearer <token обычного пользователя>
Content-Type: application/json

{ "title": "...", "propertyType": "apartment", "dealType": "sale",
  "region": "Бишкек", "price": 100000, "listingType": "vip" }
```
Ответ 201, `data.promotion_status === "vip"` — платное VIP-размещение
получено бесплатно, без единого запроса к `/api/payments/*`.

**PoC:** `back-end/security-tests/promotion-bypass.test.mjs`
(`"Free promotion bypass: POST /api/listings with listingType=vip..."` и
`...listingType=urgent...`) — оба теста ПРОХОДЯТ, подтверждая эксплойт.

**Impact:** любой зарегистрированный пользователь (personal/realtor/agency/
developer) может бесплатно и неограниченно навешивать себе VIP/ТОП/"Срочно"
на любое количество объявлений при их создании — полный обход монетизации
продвижения, прямые финансовые потери для бизнеса, недобросовестное
преимущество в выдаче над честно заплатившими продавцами.

---

## 2. Free paid-promotion + moderation bypass on listing UPDATE — CRITICAL

**Файл:** `back-end/src/controllers/listingsController.js:546-556` (updateListing)

Код явно документирует уязвимость сам себя (комментарий оставлен в коде):
```js
// TODO(security): сейчас статус/продвижение владелец может менять сам
// через этот эндпоинт (временно оставлено открытым для тестирования
// по просьбе пользователя, 2026-09-02). ...
if (data.status !== undefined) updates.status = data.status;
if (data.promotionStatus !== undefined) updates.promotion_status = data.promotionStatus;
if (data.isUrgent !== undefined) updates.is_urgent = data.isUrgent;
```
Единственная проверка прав на этом эндпоинте — "владелец или admin"
(`existingListing.user_id !== userId && userRole !== "admin"`), т.е. ЛЮБОЙ
владелец объявления проходит эту проверку и может менять `promotionStatus`,
`isUrgent` и `status` (включая перевод из/в `"moderation"`) как угодно.

**Воспроизведение:**
```
PUT /api/listings/<свой-listing-id>
Authorization: Bearer <token владельца>
Content-Type: application/json

{ "promotionStatus": "vip", "isUrgent": true }
```
— мгновенно применяется без оплаты. Аналогично:
```
{ "status": "active" }
```
после того как объявление получило `status: "moderation"`, снимает его с
модерации без участия администратора.

**PoC:** `back-end/security-tests/promotion-bypass.test.mjs` — тесты
`"...PUT /api/listings/:id lets owner self-grant promotionStatus=vip/isUrgent..."`
и `"Moderation bypass: ..."` — оба ПРОХОДЯТ.

**Impact:** то же, что и находка №1, плюс обход контент-модерации —
пользователь может публиковать объявление, отклонённое/отправленное на
проверку модератором, просто откатив `status` обратно на `"active"` самому
себе.

---

## 3. Mandatory watermark bypass via unauthenticated generic upload endpoint — HIGH

**Файлы:**
- `back-end/src/routes/uploadRoutes.js:33` — `router.post("/", uploadLimiter, handleImageFileUpload, uploadImage);` (БЕЗ `authenticateToken`)
- `back-end/src/controllers/uploadController.js:11-33` (`uploadImage` не вызывает `applyWatermark`)
- `back-end/src/utils/storage.js:45-49` (`uploadPublicImageToStorage` кладёт файл в тот же бакет `avatars`, по тому же паттерну `uploads/{uuid}.{ext}`, что и watermark-пайплайн)
- `back-end/src/utils/validation.js:38-39,180` (`trustedImageUrl`/`photos` в `createListingSchema` проверяют ТОЛЬКО хост ссылки, не то, каким эндпоинтом файл был загружен)

Комментарий в коде утверждает обратное:
```js
// ... это отдельный от uploadImage эндпоинт специально для
// того, чтобы наложение нельзя было обойти клиентским флагом: тип
// загрузки определяется тем, какой URL вызван, а не телом запроса.
```
Это верно только в рамках ОДНОГО запроса на upload — но ничто не мешает
клиенту вызвать другой ("правильный" с точки зрения хоста, но не
watermark-эндпоинт) upload-URL и подставить полученную ссылку в `photos`
при создании объявления напрямую.

**Воспроизведение:**
```
POST /api/upload            (БЕЗ Authorization заголовка вообще!)
Content-Type: multipart/form-data; boundary=...
--...
Content-Disposition: form-data; name="file"; filename="photo.png"
Content-Type: image/png

<байты обычной фотографии>
--...--
```
→ 200 `{ "url": "https://.../storage/v1/object/public/avatars/uploads/<uuid>.png" }`,
файл побайтово идентичен оригиналу — без водяного знака.

```
POST /api/listings
Authorization: Bearer <token>
{ ..., "photos": ["<URL из шага выше>"] }
```
→ 201, объявление публично показывает это фото как основное — без
водяного знака UyTap.

**PoC:** `back-end/security-tests/watermark-bypass.test.mjs` — оба теста
ПРОХОДЯТ: (1) подтверждает, что `/api/upload` вообще не требует токена;
(2) грузит одну и ту же картинку и через `/api/upload/listing-photo`
(водяной знак накладывается, побайтово отличается от оригинала — sanity
check), и через `/api/upload` (байты идентичны оригиналу), затем создаёт
объявление с "чистой" ссылкой и скачивает итоговое публично отдаваемое
фото — оно побайтово равно необработанному оригиналу.

**Impact:**
1. Полный обход платной/защитной фичи водяного знака на фото объявлений —
   пользователи могут красть чужие фото или защищать свои "чистые" фото от
   copy-paste в других объявлениях без каких-либо ограничений.
2. Отдельно: `POST /api/upload` вообще не требует авторизации — это
   открытый анонимный аплоад произвольных "изображений" (лимитирован лишь
   `express-rate-limit` 50/15 мин на IP) в публичный Storage бакет проекта,
   что даёт анонимному атакующему возможность размещать файлы на
   доверенном домене проекта (потенциал для фишинга/хостинга нежелательного
   контента под доменом Supabase Storage проекта) и потреблять место в
   Storage без всякой привязки к аккаунту.

---

## Проверено, уязвимостей НЕ найдено

- **JWT forgery** (`back-end/src/middleware/auth.js`): `alg=none` токен,
  токен с произвольной/неверной подписью, токен с подменённым payload при
  сохранённой оригинальной подписи — во всех случаях `jsonwebtoken.verify`
  корректно возвращает ошибку → эндпоинт отвечает 403. Просроченный токен
  отдельно не проверялся (JWT living 7 дней, ждать/подделывать `exp` без
  знания секрета бессмысленно — подпись всё равно не сойдётся, что уже
  покрыто тестом "неверная подпись"). PoC: `jwt-forgery.test.mjs` (5/5 passed).
- **IDOR на объявлениях**: `PUT`/`DELETE /api/listings/:id` от чужого
  пользователя корректно отклоняются 403 (владелец проверяется по
  `user_id`). PoC: `idor-listings-payments.test.mjs`.
- **IDOR на платежах**: `GET /api/payments/:orderId/status` и
  `POST /api/payments/:orderId/cancel` строго скоуплены по
  `.eq("user_id", userId)` в запросе к БД — чужой платёж по чужому orderId
  возвращает 404, даже когда сам orderId точно известен атакующему. PoC:
  `idor-listings-payments.test.mjs`.
- **Покупка продвижения для чужого объявления**: `POST
  /api/payments/promotion/create` проверяет `listing.user_id !== userId` →
  403. PoC: `idor-listings-payments.test.mjs`.
- **Admin routes**: все роуты в `adminRoutes.js` защищены и
  `authenticateToken`, и `requireAdmin` — вручную просмотрены построчно,
  пропусков не найдено.
- **Mass assignment роли/прав**: `registerSchema` и `updateMeSchema`
  (`utils/validation.js`) не содержат поля `role`; вставка в `users` при
  регистрации использует явный список полей, а не спред всего тела запроса
  — подсунуть `role: "admin"` через `/api/auth/register` или `PUT
  /api/auth/me` невозможно.
- **Webhook/callback платежей** (`handleResultUrl`,
  `paymentsController.js:504-532`): эндпоint публичный, но тело запроса
  используется ТОЛЬКО как триггер "перепроверь этот order_id"; реальное
  подтверждение оплаты всегда идёт через `reconcilePaymentStatus`, которая
  делает отдельный server-to-server вызов `odengi.statusPayment(...)` и
  никогда не доверяет присланному в вебхуке статусу/сумме — подделать
  `order_id`/произвольный статус в теле вебхука бессмысленно, пока
  реальный API O!Dengi не подтвердит `approved`. **Важно:** сквозной тест
  подтверждения оплаты (webhook → apply) НЕ выполнен на практике, т.к.
  `ODENGI_SID` в `.env` пуст → `assertOdengiConfigured()` кидает
  исключение при любом обращении к O!Dengi, и `createPayment`/
  `createPromotionPayment` всегда отвечают 503 раньше, чем платёж реально
  создаётся с `invoice_id`. Логика проверена только чтением кода — вывод
  сделан из статического анализа, а не из работающего PoC.
- **CORS**: `allowedOrigins` в `index.js` — запросы без `Origin`
  (curl/сервер-сервер) пропускаются намеренно и обоснованно (комментарий в
  коде верен: browser CORS-модель не действует на такие запросы, credential
  theft через это невозможен). Запрос с посторонним `Origin` из браузера
  был бы отклонён `cors` middleware — не тестировалось живым браузером
  (не было в приоритете), но реализация стандартная и выглядит корректной.
- **Upload MIME-фильтр**: `middleware/upload.js` фильтрует по
  клиентскому `Content-Type` части формы, а не по реальным байтам файла —
  но для эндпоинтов с водяным знаком (`/api/upload/listing-photo`,
  `/api/upload/complex-photo`) реальная валидация формата всё равно
  происходит через `sharp(buffer).metadata()` в `watermark.js` (невалидное
  "изображение" даёт `400`, PoC не писал отдельно, это следует из
  архитектуры и подтверждается тем, что watermark-тест выше успешно
  извлёк реальные метаданные PNG). Для `/api/upload` (без водяного знака)
  реальная проверка байт отсутствует — это отражено в находке №3 как часть
  общей картины (можно загрузить произвольный не-image файл под видом
  image/png), отдельного PoC на "не-image контент выполняется как HTML"
  не делал: при отдаче с Content-Type `image/png` современные браузеры не
  выполнят HTML/JS даже если реальные байты — это не image (нет MIME
  sniffing для явно указанных image/* типов) — поэтому классифицировал
  это как "обход валидации типа файла / произвольный контент под видом
  фото", а не как подтверждённый stored-XSS.
- **Публичный профиль пользователя** (`GET /api/auth/users/:id`) отдаёт
  `email`/`phone` без авторизации. Проверил фронтенд
  (`front-end/src/app/public-profile/**`) — это осознанно спроектированная
  публичная страница продавца/агентства/застройщика с контактными данными
  (стандартно для доски объявлений недвижимости, отображается для ВСЕХ
  типов аккаунтов, включая `personal`). Не считаю уязвимостью — это
  дизайн-решение продукта, а не баг, хотя стоит явно уточнить у продукта,
  насколько это устраивает приватность обычных ("personal") продавцов.

---

## Не проверено / оставлено без вывода

- **Реальный webhook/replay-эксплойт оплаты end-to-end** — невозможно
  из-за пустого `ODENGI_SID` в `.env` (см. выше); только статический анализ.
- **SSRF через загрузку по URL** — в проекте нет функционала "загрузить
  фото по URL" (только multipart file upload), вектор неприменим.
- **Sharp decompression-bomb на реальном "тяжёлом" файле** — не гонял
  специально сконструированный PNG-бомбу (например, крошечный файл,
  распаковывающийся в close to `limitInputPixels` 50 млн пикселей) —
  `limitInputPixels: 50_000_000` в `watermark.js` выглядит как разумная
  защита по коду, отдельно не подтверждал нагрузочным PoC (вне разрешённых
  рамок — не DoS-тестировать).
- **Race condition при регистрации** (двойная регистрация одного email
  параллельными запросами) — не тестировал: создание двух реальных
  пользователей параллельно ради демонстрации гонки показалось избыточным
  риском/шумом в реальной БД при низкой ожидаемой severity (в худшем
  случае — два аккаунта с одинаковым email, не эскалация привилегий); при
  необходимости можно добавить отдельный PoC.
- **Rate-limit на login/register под реальной нагрузкой** — не долбил
  сервер сотнями запросов (запрещено правилами задания); код-ревью
  подтверждает `express-rate-limit` навешан на `/api/auth/login`,
  `/api/auth/register` (100/15 мин), `/api/payments/create` и
  `/api/payments/promotion/create` (20/15 мин) — выглядит адекватно на
  уровне конфигурации.
- **complexesController** — код-ревью не выявил IDOR (владелец проверяется
  через `developers.user_id` → `developer_id` на ЖК), отдельный
  живой PoC не писал (сочтено ниже приоритетом, чем находки 1-3; создание
  застройщика/ЖК плюс проверка потребовали бы больше тестовых данных в
  боевой БД).
- **favoritesController / остальные "мелкие" роуты** (`bannersRoutes`,
  `constantsRoutes`, `lawyersRoutes`, `settingsRoutes`, `developersRoutes`,
  `aiRoutes`) — код-ревью: все публичные GET-роуты действительно только
  читают данные, все мутации требуют `authenticateToken`/`requireAdmin`
  там, где это уместно. Живых PoC не писал — не нашёл потенциальных дыр,
  требующих доказательства.
