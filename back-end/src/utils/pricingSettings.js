import { supabase } from "../config/db.js";

// Приватный бакет для редактируемых настроек сайта (создаётся автоматически
// при первом обращении, см. ensureBucket ниже — доступ только через
// service-role ключ, наружу отдаётся исключительно через контроллер).
export const APP_SETTINGS_BUCKET = "app-settings";
const PRICING_OBJECT = "pricing.json";

// Лимиты тарифа — сколько активных объявлений и платных поднятий
// (VIP/TOP) включено в тариф. Используются при выдаче дефолтного тарифа
// (см. services/subscriptionsService.js) и должны совпадать по форме с
// тем, что редактирует админ в /admin/payments (PricingModal).
const DEFAULT_PRICING = Object.freeze({
  tariffs: {
    start: { price: 390, activeListings: 5, vipLifts: 1, topLifts: 1 },
    optimal: { price: 790, activeListings: 15, vipLifts: 2, topLifts: 3 },
    business: { price: 1890, activeListings: 50, vipLifts: 5, topLifts: 10 },
    developer: {
      mode: "individual",
      value: null,
      activeListings: 100,
      vipLifts: 10,
      topLifts: 20,
    },
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

const int = (value, fallback) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : fallback;
};

// Нормализует один тарифный план (price + лимиты). Поддерживает старый
// формат хранения, где план был просто числом (ценой) — так было до
// того, как в тарифы добавили лимиты по объявлениям/VIP/TOP, чтобы уже
// сохранённые в бакете цены не терялись при первом обращении после
// обновления.
function normalizePlan(raw, fallback) {
  if (raw && typeof raw === "object") {
    return {
      price: num(raw.price, fallback.price),
      activeListings: int(raw.activeListings, fallback.activeListings),
      vipLifts: int(raw.vipLifts, fallback.vipLifts),
      topLifts: int(raw.topLifts, fallback.topLifts),
    };
  }

  return {
    price: num(raw, fallback.price),
    activeListings: fallback.activeListings,
    vipLifts: fallback.vipLifts,
    topLifts: fallback.topLifts,
  };
}

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
      start: normalizePlan(t.start, DEFAULT_PRICING.tariffs.start),
      optimal: normalizePlan(t.optimal, DEFAULT_PRICING.tariffs.optimal),
      business: normalizePlan(t.business, DEFAULT_PRICING.tariffs.business),
      developer: {
        mode,
        value: mode === "numeric" ? num(dev.value, 0) : null,
        activeListings: int(dev.activeListings, DEFAULT_PRICING.tariffs.developer.activeListings),
        vipLifts: int(dev.vipLifts, DEFAULT_PRICING.tariffs.developer.vipLifts),
        topLifts: int(dev.topLifts, DEFAULT_PRICING.tariffs.developer.topLifts),
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
