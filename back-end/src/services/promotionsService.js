import { supabase } from "../config/db.js";
import { markPromotionOrderStatus } from "../utils/promotionOrders.js";

const DAY_MS = 24 * 60 * 60 * 1000;

// Выставляет флаг продвижения (VIP/ТОП/Срочно) + срок истечения внутри
// features (отдельной колонки под срок в listings нет — см.
// promotionOrders.js). Общая логика для источников продвижения:
// оплаченного заказа (applyPromotion ниже), бесплатного списания с тарифа
// при создании и через /:id/promote-with-tariff (см.
// controllers/listingsController.js). Возвращает true, если продвижение
// применено.
export async function grantPromotion({ listingId, serviceType, days }) {
  const { data: listing, error } = await supabase
    .from("listings")
    .select("features, status")
    .eq("id", listingId)
    .maybeSingle();

  if (error || !listing) {
    console.error("Grant Promotion: listing not found", listingId, error);
    return false;
  }

  const expiresAt = new Date(Date.now() + Number(days) * DAY_MS).toISOString();
  const nextFeatures = { ...(listing.features || {}) };

  const updates = { updated_at: new Date().toISOString() };

  // Объявления, купленные платным типом размещения (VIP/ТОП/Срочно) без
  // покрытия тарифом, создаются в controllers/listingsController.js
  // createListing статусом "draft" и не публикуются, пока не подтвердится
  // оплата — grantPromotion вызывается именно в момент этого
  // подтверждения (см. paymentsController.js reconcilePaymentStatus →
  // promotionsService.applyPromotion), поэтому здесь же и переводим
  // объявление в "active". "hidden" — по той же логике: покупка
  // продвижения для скрытого объявления возвращает его в публичную выдачу
  // (осознанное действие владельца). "moderation" НЕ трогаем — снять с
  // модерации может только admin, оплата продвижения это не обходит.
  if (listing.status === "draft" || listing.status === "hidden") {
    updates.status = "active";
  }

  if (serviceType === "vip" || serviceType === "top") {
    updates.promotion_status = serviceType;
    nextFeatures.promotionExpiresAt = expiresAt;
  } else if (serviceType === "urgent") {
    updates.is_urgent = true;
    nextFeatures.urgentExpiresAt = expiresAt;
  } else {
    console.error("Grant Promotion: unknown serviceType", serviceType);
    return false;
  }

  updates.features = nextFeatures;

  const { error: updateError } = await supabase
    .from("listings")
    .update(updates)
    .eq("id", listingId);

  if (updateError) {
    console.error("Grant Promotion Update Error:", updateError);
    return false;
  }

  return true;
}

// Применяет купленное продвижение к объявлению после подтверждённой оплаты.
// Instagram-продвижение — это ручная публикация сотрудником, а не флаг на
// объявлении, поэтому для него мы просто помечаем заказ как "ожидает
// публикации" — админ увидит его в списке заказов и выполнит вручную.
export async function applyPromotion(order) {
  const { listingId, serviceType, days } = order;

  if (serviceType === "instagram") {
    await markPromotionOrderStatus(order.orderId, "fulfillment_pending");
    return;
  }

  const applied = await grantPromotion({ listingId, serviceType, days });

  if (applied) {
    await markPromotionOrderStatus(order.orderId, "applied");
  }
}

// Продвижение покупается на ограниченный срок (days), но в listings нет
// автоматического job'а, который бы его снимал — вместо cron-задачи
// используем ленивую проверку "истёк ли срок" прямо при чтении объявления:
// каждый read-путь (getListings/getListingById/getMyListings) прогоняет
// строку через эту функцию и показывает клиенту уже актуальное состояние,
// даже если БД ещё не обновлена. Сама функция ничего не пишет в БД —
// вызывающий код (см. downgradeExpiredPromotionInDb в listingsController.js)
// решает, стоит ли фиксировать исправление.
export function resolvePromotionExpiry(listing) {
  const now = Date.now();
  const features = listing?.features || {};

  let promotionStatus = listing?.promotion_status ?? "regular";
  let isUrgent = Boolean(listing?.is_urgent);
  let changed = false;

  if (
    (promotionStatus === "vip" || promotionStatus === "top") &&
    features.promotionExpiresAt &&
    new Date(features.promotionExpiresAt).getTime() <= now
  ) {
    promotionStatus = "regular";
    changed = true;
  }

  if (
    isUrgent &&
    features.urgentExpiresAt &&
    new Date(features.urgentExpiresAt).getTime() <= now
  ) {
    isUrgent = false;
    changed = true;
  }

  return { promotionStatus, isUrgent, changed };
}
