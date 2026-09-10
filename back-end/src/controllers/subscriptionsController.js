import { supabase } from "../config/db.js";
import { getTariff } from "../constants/tariffs.js";
import { getPricingSettings } from "../utils/pricingSettings.js";
import {
  getActiveSubscription,
  getTariffBoostLimits,
  getActiveListingsLimit,
} from "../services/subscriptionsService.js";

// =======================================================
// GET /api/subscriptions/me — сводка по текущему тарифу авторизованного
// пользователя (для блока "Мой тариф" в профиле): активен ли тариф, какой
// именно, и сколько по его условиям осталось активных
// объявлений/поднятий VIP/TOP. Всегда только СВОИ данные — userId берётся
// из req.user (JWT), не из параметров запроса, поэтому здесь нет и не
// может быть IDOR на чужую подписку.
// =======================================================
export const getMySubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const accountType = req.user.account_type;

    const [subscription, activeListingsLimit, activeListingsCountResult] = await Promise.all([
      getActiveSubscription(userId),
      getActiveListingsLimit(userId, accountType),
      supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "active"),
    ]);

    if (activeListingsCountResult.error) {
      console.error("Get My Subscription — active listings count error:", activeListingsCountResult.error);
    }

    const activeListingsUsed = activeListingsCountResult.count || 0;

    if (!subscription) {
      return res.json({
        success: true,
        data: {
          active: false,
          isIndividual: false,
          tariffId: null,
          tariffName: null,
          startedAt: null,
          expiresAt: null,
          limits: { activeListings: activeListingsLimit, vipBoosts: 0, topBoosts: 0 },
          used: { activeListings: activeListingsUsed, vipBoosts: 0, topBoosts: 0 },
          remaining: {
            activeListings: Math.max(activeListingsLimit - activeListingsUsed, 0),
            vipBoosts: 0,
            topBoosts: 0,
          },
        },
      });
    }

    const boostLimits = await getTariffBoostLimits(subscription);

    let tariffName;
    if (subscription.is_individual) {
      tariffName = subscription.custom_name || "Индивидуальный тариф";
    } else {
      const pricing = await getPricingSettings();
      const tariff = getTariff(subscription.tariff_id, pricing);
      tariffName = tariff?.title || subscription.tariff_id;
    }

    const vipUsed = subscription.vip_boosts_used || 0;
    const topUsed = subscription.top_boosts_used || 0;

    return res.json({
      success: true,
      data: {
        active: true,
        isIndividual: subscription.is_individual,
        tariffId: subscription.tariff_id,
        tariffName,
        startedAt: subscription.started_at,
        expiresAt: subscription.expires_at,
        limits: {
          activeListings: activeListingsLimit,
          vipBoosts: boostLimits.vip,
          topBoosts: boostLimits.top,
        },
        used: {
          activeListings: activeListingsUsed,
          vipBoosts: vipUsed,
          topBoosts: topUsed,
        },
        remaining: {
          activeListings: Math.max(activeListingsLimit - activeListingsUsed, 0),
          vipBoosts: Math.max(boostLimits.vip - vipUsed, 0),
          topBoosts: Math.max(boostLimits.top - topUsed, 0),
        },
      },
    });
  } catch (error) {
    console.error("Get My Subscription Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении данных тарифа",
    });
  }
};
