import { supabase } from "../config/db.js";

const DAY_MS = 24 * 60 * 60 * 1000;

// Активирует/продлевает тариф пользователя после подтверждённой оплаты.
// Если у пользователя уже есть активная подписка — новый период
// добавляется к оставшемуся сроку, а не затирает его.
export async function activateSubscription(userId, tariffId, months) {
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("expires_at")
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
