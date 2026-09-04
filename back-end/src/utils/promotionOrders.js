import { randomUUID } from "crypto";
import { supabase } from "../config/db.js";
import { APP_SETTINGS_BUCKET } from "./pricingSettings.js";

// Разовые покупки продвижения объявлений (VIP/ТОП/Срочно/Instagram) —
// платёжная запись (сумма/статус/счёт O!Dengi) всегда живёт в таблице
// `payments` (как и у тарифов PRO), а вот к какому именно объявлению и
// какая услуга относится покупка — хранить негде: в `payments` нет колонки
// под listing_id, а добавить её нельзя (в этом окружении нет доступа к
// прямым DDL-миграциям Postgres, см. комментарии в pricingSettings.js /
// bannersStore.js — тот же самый JSON-в-Storage паттерн). Поэтому эта
// метаинформация хранится здесь, отдельным JSON-объектом, и связывается с
// платежом по orderId (он уникален и уже есть в payments).
const ORDERS_OBJECT = "promotion-orders.json";

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

// См. bannersStore.js — та же причина не форсировать fresh-перечитывание
// сразу после записи (in-process кэш этого процесса всегда как минимум
// так же свеж, как последняя запись, сделанная им же).
async function readAll() {
  if (cache && Date.now() - cacheAt < CACHE_TTL_MS) {
    return cache;
  }

  try {
    const { data, error } = await supabase.storage
      .from(APP_SETTINGS_BUCKET)
      .download(ORDERS_OBJECT);

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
    console.error("Не удалось загрузить заказы продвижения, использую пустой список:", err);
    return [];
  }
}

async function writeAll(orders) {
  await ensureBucket();

  const payload = Buffer.from(JSON.stringify(orders), "utf-8");

  const { error } = await supabase.storage
    .from(APP_SETTINGS_BUCKET)
    .upload(ORDERS_OBJECT, payload, {
      contentType: "application/json",
      upsert: true,
      cacheControl: "0",
    });

  if (error) {
    throw new Error(error.message || "Не удалось сохранить заказ продвижения");
  }

  cache = orders;
  cacheAt = Date.now();
  return orders;
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

// Создаёт запись о заказе продвижения — вызывается сразу после того, как в
// `payments` создана строка с этим orderId (до создания счёта в O!Dengi,
// чтобы запись гарантированно существовала к моменту, когда реконсиляция
// статуса платежа попытается её найти).
export async function createPromotionOrder({ orderId, userId, listingId, serviceType, days }) {
  return withWriteLock(async () => {
    const orders = await readAll();

    const order = {
      id: randomUUID(),
      orderId,
      userId,
      listingId,
      serviceType,
      days,
      status: "pending", // pending -> applied | fulfillment_pending (instagram) | canceled
      createdAt: new Date().toISOString(),
      appliedAt: null,
    };

    await writeAll([order, ...orders]);
    return order;
  });
}

export async function getPromotionOrderByOrderId(orderId) {
  const orders = await readAll();
  return orders.find((o) => o.orderId === orderId) || null;
}

export async function markPromotionOrderStatus(orderId, status) {
  return withWriteLock(async () => {
    const orders = await readAll();
    const index = orders.findIndex((o) => o.orderId === orderId);
    if (index === -1) return null;

    const updated = {
      ...orders[index],
      status,
      appliedAt: status === "applied" || status === "fulfillment_pending" ? new Date().toISOString() : orders[index].appliedAt,
    };

    const next = [...orders];
    next[index] = updated;
    await writeAll(next);
    return updated;
  });
}

// Для админки — список заказов, отсортированный от новых к старым.
export async function listPromotionOrders() {
  const orders = await readAll();
  return [...orders].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}
