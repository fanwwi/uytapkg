import { supabase } from "../config/db.js";
import { APP_SETTINGS_BUCKET } from "./pricingSettings.js";
import { extractStoragePath } from "./storage.js";

// =======================================================
// Реестр "кто и когда загрузил этот файл в Storage" — закрывает две
// проблемы разом:
//
// 1. IDOR на удаление файлов: trustedImageUrl (validation.js) проверяет
//    только ХОСТ ссылки, не то, кто и как её загрузил. Без этого реестра
//    злоумышленник мог бы подставить публичный URL чужого фото
//    объявления/ЖК в СВОИ photos/images (валидация хоста это пропускала
//    бы), а затем удалить/обновить свою запись — removeImageFromStorage
//    выполняется с сервисными правами и стирает файл из Storage
//    независимо от того, кому он реально принадлежит.
// 2. Обход водяного знака: фото, загруженные через публичный
//    /api/upload (без водяного знака, для логотипов/аватаров при
//    регистрации), не попадают в этот реестр — значит их нельзя
//    подставить в photos объявления/images ЖК в обход
//    /api/upload/listing-photo и /api/upload/complex-photo, которые
//    водяной знак накладывают всегда.
//
// Как и promotionOrders.js/bannersStore.js — тот же паттерн JSON-объекта
// в Storage-бакете app-settings, т.к. в этом окружении нет доступа к
// прямым DDL-миграциям Postgres для отдельной таблицы.
// =======================================================
const OWNERSHIP_OBJECT = "upload-ownership.json";

let cache = null;
let cacheAt = 0;
const CACHE_TTL_MS = 10 * 1000;

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = (buckets || []).some((b) => b.name === APP_SETTINGS_BUCKET);
  if (!exists) {
    await supabase.storage.createBucket(APP_SETTINGS_BUCKET, { public: false });
  }
}

async function readAll() {
  if (cache && Date.now() - cacheAt < CACHE_TTL_MS) {
    return cache;
  }

  try {
    const { data, error } = await supabase.storage
      .from(APP_SETTINGS_BUCKET)
      .download(OWNERSHIP_OBJECT);

    if (error || !data) {
      cache = {};
      cacheAt = Date.now();
      return cache;
    }

    const text = await data.text();
    const parsed = JSON.parse(text);
    cache = parsed && typeof parsed === "object" ? parsed : {};
    cacheAt = Date.now();
    return cache;
  } catch (err) {
    console.error("Не удалось загрузить реестр владельцев файлов, использую пустой:", err);
    return {};
  }
}

async function writeAll(map) {
  await ensureBucket();

  const payload = Buffer.from(JSON.stringify(map), "utf-8");

  const { error } = await supabase.storage
    .from(APP_SETTINGS_BUCKET)
    .upload(OWNERSHIP_OBJECT, payload, {
      contentType: "application/json",
      upsert: true,
      cacheControl: "0",
    });

  if (error) {
    throw new Error(error.message || "Не удалось сохранить реестр владельцев файлов");
  }

  cache = map;
  cacheAt = Date.now();
  return map;
}

let writeQueue = Promise.resolve();
function withWriteLock(fn) {
  const run = writeQueue.then(fn, fn);
  writeQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

// Вызывается сразу после успешной загрузки в Storage через
// /api/upload/listing-photo или /api/upload/complex-photo (оба требуют
// authenticateToken) — фиксирует, что именно этот пользователь загрузил
// именно этот objectPath. Best-effort: если запись не удалась, файл всё
// равно уже загружен и URL отдан клиенту — не роняем ответ пользователю
// из-за сбоя записи в реестр, только логируем (тот же принцип, что и у
// createInstagramRequest в listingsController.js).
export async function recordUploadOwner(objectPath, userId) {
  if (!objectPath || !userId) return;

  try {
    await withWriteLock(async () => {
      const map = await readAll();
      map[objectPath] = { userId, uploadedAt: new Date().toISOString() };
      await writeAll(map);
    });
  } catch (err) {
    console.error("Не удалось записать владельца загруженного файла:", err);
  }
}

// true, если objectPath реально был загружен ИМЕННО этим userId через
// один из авторизованных /api/upload/* эндпоинтов, которые ведут запись
// в реестр (см. recordUploadOwner выше).
export async function isUploadOwnedBy(objectPath, userId) {
  if (!objectPath || !userId) return false;
  const map = await readAll();
  return map[objectPath]?.userId === userId;
}

// Проверяет массив публичных URL (photos объявления / images ЖК) — true,
// только если КАЖДЫЙ из них был загружен именно этим пользователем через
// один из /api/upload/listing-photo, /api/upload/complex-photo. Пустой
// массив считается валидным (фото необязательны). Используется в
// controllers/listingsController.js и controllers/complexesController.js
// перед созданием/обновлением записи — см. uploadOwnership.js вверху
// файла про то, какую конкретно атаку это закрывает.
export async function verifyAllOwnedBy(urls, userId) {
  if (!Array.isArray(urls) || urls.length === 0) return true;

  for (const url of urls) {
    const objectPath = extractStoragePath(url);
    // eslint-disable-next-line no-await-in-loop -- нужна ранняя остановка на первом чужом файле
    const owned = await isUploadOwnedBy(objectPath, userId);
    if (!owned) return false;
  }

  return true;
}
