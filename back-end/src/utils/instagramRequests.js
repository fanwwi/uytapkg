import { randomUUID } from "crypto";
import { supabase } from "../config/db.js";
import { APP_SETTINGS_BUCKET } from "./pricingSettings.js";

// Заявки на публикацию объявления в Instagram UyTap. Оплата для этой услуги
// пока не реализована (см. StepListingType на фронте — при выборе типа
// "instagram" объявление публикуется как обычное), поэтому заявка — это
// просто пометка "разместить это объявление в Instagram", которую видит
// админка и отмечает выполненной. Как и promotionOrders.js/bannersStore.js,
// храним JSON-объектом в Storage — прямого доступа к DDL Postgres в этом
// окружении нет, поэтому отдельную таблицу завести нельзя.
const REQUESTS_OBJECT = "instagram-requests.json";

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
      .download(REQUESTS_OBJECT);

    if (error || !data) {
      cache = [];
      cacheAt = Date.now();
      return cache;
    }

    const text = await data.text();
    const parsed = JSON.parse(text);
    cache = Array.isArray(parsed) ? parsed : [];
    cacheAt = Date.now();
    return cache;
  } catch (err) {
    console.error("Не удалось загрузить заявки на Instagram, использую пустой список:", err);
    return [];
  }
}

async function writeAll(requests) {
  await ensureBucket();

  const payload = Buffer.from(JSON.stringify(requests), "utf-8");

  const { error } = await supabase.storage
    .from(APP_SETTINGS_BUCKET)
    .upload(REQUESTS_OBJECT, payload, {
      contentType: "application/json",
      upsert: true,
      cacheControl: "0",
    });

  if (error) {
    throw new Error(error.message || "Не удалось сохранить заявку на Instagram");
  }

  cache = requests;
  cacheAt = Date.now();
  return requests;
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

// Создаётся сразу после публикации объявления с listingType === "instagram".
export async function createInstagramRequest({ listingId, userId }) {
  return withWriteLock(async () => {
    const requests = await readAll();

    const request = {
      id: randomUUID(),
      listingId,
      userId,
      status: "pending", // pending -> published
      createdAt: new Date().toISOString(),
      publishedAt: null,
    };

    await writeAll([request, ...requests]);
    return request;
  });
}

// Для админки — список заявок, отсортированный от новых к старым.
export async function listInstagramRequests() {
  const requests = await readAll();
  return [...requests].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function getInstagramRequestById(id) {
  const requests = await readAll();
  return requests.find((r) => r.id === id) || null;
}

// Админ отмечает, что объявление уже размещено в Instagram.
export async function markInstagramRequestPublished(id) {
  return withWriteLock(async () => {
    const requests = await readAll();
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updated = {
      ...requests[index],
      status: "published",
      publishedAt: new Date().toISOString(),
    };

    const next = [...requests];
    next[index] = updated;
    await writeAll(next);
    return updated;
  });
}
