import { supabase } from "../config/db.js";
import { getPricingSettings } from "../utils/pricingSettings.js";

const DAY_MS = 24 * 60 * 60 * 1000;

// Без активного тарифа личным продавцам разрешено бесплатно держать
// ограниченное число активных объявлений (см. фронтенд /pricing — план
// "Частный"); риэлторам/агентствам/застройщикам без тарифа/индивидуальной
// выдачи — 0, публикация объявления требует оплаченного тарифа.
const FREE_PERSONAL_ACTIVE_LISTINGS = 2;

// Активирует/продлевает тариф пользователя после подтверждённой оплаты.
// Если у пользователя уже есть активная подписка — новый период
// добавляется к оставшемуся сроку, а не затирает его.
//
// Оплата дефолтного тарифа (start/optimal/business) всегда возвращает
// пользователя на is_individual=false и снимает возможную ручную
// блокировку (is_active=true) — купленный тариф должен реально
// заработать, а не остаться выключенным из-за прошлого решения админа.
// started_at выставляется только при создании новой подписки — при
// продлении существующей период считается непрерывным. Каждая новая
// оплата также обнуляет счётчики использованных VIP/TOP поднятий —
// пользователь платит за новый период, лимиты должны начаться заново.
export async function activateSubscription(userId, tariffId, months) {
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("expires_at, started_at")
    .eq("user_id", userId)
    .maybeSingle();

  const now = Date.now();
  const currentExpiry = existing?.expires_at ? new Date(existing.expires_at).getTime() : now;
  const base = currentExpiry > now ? currentExpiry : now;
  const expiresAt = new Date(base + months * 30 * DAY_MS).toISOString();

  const { error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        tariff_id: tariffId,
        expires_at: expiresAt,
        started_at: existing?.started_at || new Date().toISOString(),
        is_active: true,
        is_individual: false,
        custom_name: null,
        active_listings_limit: null,
        vip_boosts_limit: null,
        top_boosts_limit: null,
        listings_used: 0,
        vip_boosts_used: 0,
        top_boosts_used: 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Activate Subscription Error:", error);
    throw new Error("Не удалось активировать тариф");
  }

  return { tariffId, expiresAt };
}

// Возвращает подписку пользователя, только если она реально действует
// прямо сейчас (включена админом и срок не истёк) — иначе null. Используется
// везде, где нужно понять "положены ли этому пользователю бесплатные
// поднятия VIP/TOP по тарифу".
export async function getActiveSubscription(userId) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Get Active Subscription Error:", error);
    return null;
  }

  if (!data || !data.is_active) return null;
  if (new Date(data.expires_at).getTime() <= Date.now()) return null;

  return data;
}

// Лимиты VIP/TOP поднятий, положенные по тарифу пользователя:
//   - индивидуальный тариф — собственные vip_boosts_limit/top_boosts_limit;
//   - дефолтный тариф (start/optimal/business) — из текущих настроек цен
//     (см. utils/pricingSettings.js), т.к. лимиты дефолтных тарифов общие
//     для всех и не хранятся в каждой строке подписки.
export async function getTariffBoostLimits(subscription) {
  if (!subscription) return { vip: 0, top: 0 };

  if (subscription.is_individual) {
    return {
      vip: subscription.vip_boosts_limit ?? 0,
      top: subscription.top_boosts_limit ?? 0,
    };
  }

  const pricing = await getPricingSettings();
  const plan = pricing.tariffs[subscription.tariff_id];

  if (!plan) return { vip: 0, top: 0 };

  return { vip: plan.vipLifts ?? 0, top: plan.topLifts ?? 0 };
}

// Сколько активных объявлений (status="active") разрешено пользователю
// одновременно прямо сейчас: по активному тарифу (индивидуальному или
// дефолтному — из текущих настроек цен), либо бесплатный лимит без
// тарифа (см. FREE_PERSONAL_ACTIVE_LISTINGS выше). Используется при
// создании объявления и при возврате объявления в статус "active" (см.
// controllers/listingsController.js), чтобы лимит тарифа нельзя было
// обойти скрытием/показом объявлений вместо реального удаления.
export async function getActiveListingsLimit(userId, accountType) {
  const subscription = await getActiveSubscription(userId);

  if (subscription) {
    if (subscription.is_individual) {
      return subscription.active_listings_limit ?? 0;
    }

    const pricing = await getPricingSettings();
    const plan = pricing.tariffs[subscription.tariff_id];
    return plan?.activeListings ?? 0;
  }

  return accountType === "personal" ? FREE_PERSONAL_ACTIVE_LISTINGS : 0;
}

// Пытается списать одно бесплатное поднятие (VIP или TOP) с тарифа
// пользователя. Возвращает { granted: true, remaining } при успехе, либо
// { granted: false, reason } если тарифа нет/лимит исчерпан — в этом
// случае вызывающий код должен направить пользователя на обычную платную
// покупку продвижения (см. controllers/listingsController.js
// promoteListingWithTariff).
//
// boostType: "vip" | "top"
export async function consumeTariffBoost(userId, boostType) {
  const subscription = await getActiveSubscription(userId);

  if (!subscription) {
    return { granted: false, reason: "no_active_tariff" };
  }

  const limits = await getTariffBoostLimits(subscription);
  const limit = boostType === "vip" ? limits.vip : limits.top;
  const usedField = boostType === "vip" ? "vip_boosts_used" : "top_boosts_used";
  const used = subscription[usedField] || 0;

  if (used >= limit) {
    return { granted: false, reason: "limit_reached" };
  }

  // Условие .eq(usedField, used) — оптимистическая блокировка: если между
  // чтением и записью счётчик уже кем-то изменился (двойной клик,
  // параллельный запрос), update не найдёт строку и ничего не спишет,
  // вместо того чтобы дать использовать одно и то же поднятие дважды.
  const { data: updated, error } = await supabase
    .from("subscriptions")
    .update({ [usedField]: used + 1, updated_at: new Date().toISOString() })
    .eq("id", subscription.id)
    .eq(usedField, used)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Consume Tariff Boost Error:", error);
    return { granted: false, reason: "error" };
  }

  if (!updated) {
    return { granted: false, reason: "conflict" };
  }

  return { granted: true, remaining: limit - (used + 1) };
}

// Возвращает одно поднятие, ранее списанное consumeTariffBoost, когда
// действие, ради которого оно списывалось, в итоге не состоялось (см.
// controllers/listingsController.js createListing — объявление не
// создалось или продвижение не удалось применить после списания).
// Best-effort: если подписка с тех пор пропала/сменилась — просто ничего
// не делает, возвращать уже нечему.
export async function refundTariffBoost(userId, boostType) {
  const subscription = await getActiveSubscription(userId);
  if (!subscription) return;

  const usedField = boostType === "vip" ? "vip_boosts_used" : "top_boosts_used";
  const used = subscription[usedField] || 0;
  if (used <= 0) return;

  const { error } = await supabase
    .from("subscriptions")
    .update({ [usedField]: used - 1, updated_at: new Date().toISOString() })
    .eq("id", subscription.id);

  if (error) {
    console.error("Refund Tariff Boost Error:", error);
  }
}

// Пытается списать 1 объявление с активного тарифа пользователя (одноразовый расход слота).
// Возвращает { hasSubscription: true, granted: true, remaining } при успехе,
// либо { hasSubscription: false } если у пользователя нет тарифа,
// либо { hasSubscription: true, granted: false, reason: "limit_reached" | "conflict" } при исчерпании/конфликте.
export async function consumeTariffListing(userId) {
  const subscription = await getActiveSubscription(userId);

  if (!subscription) {
    return { hasSubscription: false };
  }

  let limit = 0;
  if (subscription.is_individual) {
    limit = subscription.active_listings_limit ?? 0;
  } else {
    const pricing = await getPricingSettings();
    const plan = pricing.tariffs[subscription.tariff_id];
    limit = plan?.activeListings ?? 0;
  }

  const used = subscription.listings_used ?? 0;

  if (used >= limit) {
    return { hasSubscription: true, granted: false, reason: "limit_reached", limit, used };
  }

  // Оптимистическая блокировка для защиты от состояния гонки
  const { data: updated, error } = await supabase
    .from("subscriptions")
    .update({ listings_used: used + 1, updated_at: new Date().toISOString() })
    .eq("id", subscription.id)
    .eq("listings_used", used)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST204" || error.code === "42703") {
      console.warn(
        "⚠️ WARNING: Column 'listings_used' is missing in 'subscriptions' table. " +
        "Please run this SQL in your Supabase SQL Editor:\n" +
        "ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS listings_used INT NOT NULL DEFAULT 0;"
      );
    } else {
      console.error("Consume Tariff Listing Error:", error);
    }
    // Если колонка ещё не создана в БД, не блокируем создание аварийно
    return { hasSubscription: true, granted: true, remaining: Math.max(limit - (used + 1), 0) };
  }

  if (!updated) {
    return { hasSubscription: true, granted: false, reason: "conflict" };
  }

  return { hasSubscription: true, granted: true, remaining: limit - (used + 1) };
}

// Возвращает списанный слот объявления ТОЛЬКО если создание объявления в БД завершилось сбоем
// (ошибка вставки фото или откат транзакции). При обычном удалении объявления пользователем этот метод НЕ вызывается.
export async function refundTariffListing(userId) {
  const subscription = await getActiveSubscription(userId);
  if (!subscription) return;

  const used = subscription.listings_used ?? 0;
  if (used <= 0) return;

  const { error } = await supabase
    .from("subscriptions")
    .update({ listings_used: used - 1, updated_at: new Date().toISOString() })
    .eq("id", subscription.id);

  if (error) {
    console.error("Refund Tariff Listing Error:", error);
  }
}

