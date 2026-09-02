import { supabase } from "../config/db.js";

// Приватный бакет для редактируемых настроек сайта (создаётся автоматически
// при первом обращении, см. ensureBucket ниже — доступ только через
// service-role ключ, наружу отдаётся исключительно через контроллер).
export const APP_SETTINGS_BUCKET = "app-settings";
const PRICING_OBJECT = "pricing.json";

const DEFAULT_PRICING = Object.freeze({
  tariffs: {
    start: 390,
    optimal: 790,
    business: 1890,
    developer: { mode: "individual", value: null },
  },
  services: {
    vip: 290,
    urgent: 70,
    top: 190,
    instagram: 390,
  },
});

const num = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

// Приводит произвольные (в т.ч. повреждённые/неполные) данные к
// каноническому виду цен — используется и при чтении, и при записи,
// чтобы в хранилище никогда не оказалось некорректного значения.
function normalizePricing(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  const t = src.tariffs && typeof src.tariffs === "object" ? src.tariffs : {};
  const s = src.services && typeof src.services === "object" ? src.services : {};
  const dev = t.developer && typeof t.developer === "object" ? t.developer : {};

  const mode = dev.mode === "numeric" ? "numeric" : "individual";

  return {
    tariffs: {
      start: num(t.start, DEFAULT_PRICING.tariffs.start),
      optimal: num(t.optimal, DEFAULT_PRICING.tariffs.optimal),
      business: num(t.business, DEFAULT_PRICING.tariffs.business),
      developer: {
        mode,
        value: mode === "numeric" ? num(dev.value, 0) : null,
      },
    },
    services: {
      vip: num(s.vip, DEFAULT_PRICING.services.vip),
      urgent: num(s.urgent, DEFAULT_PRICING.services.urgent),
      top: num(s.top, DEFAULT_PRICING.services.top),
      instagram: num(s.instagram, DEFAULT_PRICING.services.instagram),
    },
  };
}

let cache = null;
let cacheAt = 0;
const CACHE_TTL_MS = 15 * 1000;

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = (buckets || []).some((b) => b.name === APP_SETTINGS_BUCKET);
  if (!exists) {
    await supabase.storage.createBucket(APP_SETTINGS_BUCKET, { public: false });
  }
}

// Возвращает текущие цены тарифов и услуг. При отсутствии файла (первый
// запуск) или ошибке чтения безопасно откатывается на значения по
// умолчанию — платежи и публичные страницы не должны падать из-за
// проблем с настройками.
export async function getPricingSettings() {
  if (cache && Date.now() - cacheAt < CACHE_TTL_MS) {
    return cache;
  }

  try {
    const { data, error } = await supabase.storage
      .from(APP_SETTINGS_BUCKET)
      .download(PRICING_OBJECT);

    if (error || !data) {
      cache = normalizePricing(null);
      cacheAt = Date.now();
      return cache;
    }

    const text = await data.text();
    cache = normalizePricing(JSON.parse(text));
    cacheAt = Date.now();
    return cache;
  } catch (err) {
    console.error("Не удалось загрузить настройки цен, использую значения по умолчанию:", err);
    return normalizePricing(null);
  }
}

// Сохраняет новые цены (уже провалидированные zod-схемой на уровне
// контроллера). Возвращает нормализованный объект, который был записан.
export async function savePricingSettings(pricingInput) {
  const normalized = normalizePricing(pricingInput);
  const payload = Buffer.from(JSON.stringify(normalized), "utf-8");

  await ensureBucket();

  const { error } = await supabase.storage
    .from(APP_SETTINGS_BUCKET)
    .upload(PRICING_OBJECT, payload, {
      contentType: "application/json",
      upsert: true,
      cacheControl: "0",
    });

  if (error) {
    throw new Error(error.message || "Не удалось сохранить настройки цен");
  }

  cache = normalized;
  cacheAt = Date.now();
  return normalized;
}
