import { randomUUID } from "crypto";
import { supabase } from "../config/db.js";
import { APP_SETTINGS_BUCKET } from "./pricingSettings.js";

const BANNERS_OBJECT = "banners.json";

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

// Читает список баннеров. В обычной работе (GET-запросы) полагается на
// свежий in-memory кэш этого процесса — он всегда как минимум так же
// актуален, как последняя запись, сделанная ИМ ЖЕ (см. writeAll). Реальное
// скачивание из Storage происходит только при "холодном" старте или когда
// кэш устарел по TTL — специально НЕ форсируем перечитывание на каждой
// мутации: некоторые бэкенды Storage не гарантируют мгновенный
// read-after-write, и принудительный re-download сразу после записи может
// вернуть ещё не устаревшую копию — из-за этого только что созданный
// баннер мог "потеряться" в собственном ответе на следующий запрос.
async function readAll() {
  if (cache && Date.now() - cacheAt < CACHE_TTL_MS) {
    return cache;
  }

  try {
    const { data, error } = await supabase.storage
      .from(APP_SETTINGS_BUCKET)
      .download(BANNERS_OBJECT);

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
    console.error("Не удалось загрузить баннеры, использую пустой список:", err);
    return [];
  }
}

async function writeAll(banners) {
  await ensureBucket();

  const payload = Buffer.from(JSON.stringify(banners), "utf-8");

  const { error } = await supabase.storage
    .from(APP_SETTINGS_BUCKET)
    .upload(BANNERS_OBJECT, payload, {
      contentType: "application/json",
      upsert: true,
      cacheControl: "0",
    });

  if (error) {
    throw new Error(error.message || "Не удалось сохранить баннеры");
  }

  cache = banners;
  cacheAt = Date.now();
  return banners;
}

// Простая сериализация мутаций в пределах процесса: create/update/delete
// делают read-modify-write поверх одного JSON-файла, поэтому два
// одновременных запроса без этого могли бы затереть правки друг друга
// (classic lost update). Очередь промисов гарантирует, что вторая мутация
// стартует только после того, как первая полностью прочитала и
// перезаписала файл.
let writeQueue = Promise.resolve();
function withWriteLock(fn) {
  const run = writeQueue.then(fn, fn);
  writeQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

// Все баннеры (для админки), отсортированы от новых к старым.
export async function listAllBanners() {
  const banners = await readAll();
  return [...banners].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

// Только активные и попадающие в текущий диапазон дат — для публичной страницы.
export async function listActiveBanners() {
  const banners = await readAll();
  const today = new Date().toISOString().slice(0, 10);

  return banners
    .filter((b) => {
      if (!b.active) return false;
      if (b.startDate && b.startDate > today) return false;
      if (b.endDate && b.endDate < today) return false;
      return true;
    })
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function getBannerById(id) {
  const banners = await readAll();
  return banners.find((b) => b.id === id) || null;
}

export async function createBanner(data) {
  return withWriteLock(async () => {
    const banners = await readAll();

    const now = new Date().toISOString();
    const banner = {
      id: randomUUID(),
      title: data.title,
      imageUrl: data.imageUrl,
      imagePositionX: data.imagePositionX ?? 50,
      imagePositionY: data.imagePositionY ?? 50,
      link: data.link || null,
      startDate: data.startDate,
      endDate: data.endDate || null,
      active: data.active ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await writeAll([banner, ...banners]);
    return banner;
  });
}

export async function updateBanner(id, data) {
  return withWriteLock(async () => {
    const banners = await readAll();
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const previous = banners[index];
    const updated = {
      ...previous,
      ...data,
      id: previous.id,
      createdAt: previous.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const next = [...banners];
    next[index] = updated;
    await writeAll(next);
    return { previous, updated };
  });
}

export async function deleteBanner(id) {
  return withWriteLock(async () => {
    const banners = await readAll();
    const banner = banners.find((b) => b.id === id);
    if (!banner) return null;

    await writeAll(banners.filter((b) => b.id !== id));
    return banner;
  });
}
