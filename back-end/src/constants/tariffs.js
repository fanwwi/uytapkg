// =======================================================
// Тарифы UyTap PRO и их актуальные цены.
//
// Сами цены редактируются админом (см. utils/pricingSettings.js) и
// хранятся на сервере — но пересчёт суммы к оплате всегда происходит
// здесь же, на бэкенде, по актуальным ценам. Клиент присылает лишь
// tariffId/months, сумма никогда не принимается от клиента напрямую,
// чтобы никто не мог подделать её через query-параметры или тело
// запроса.
// =======================================================

// discountPercent за выбранный период оплаты (в месяцах)
export const PERIOD_DISCOUNTS = {
  1: 0,
  3: 10,
  6: 20,
  12: 35,
};

// `pricing` — объект, полученный через getPricingSettings() (см.
// utils/pricingSettings.js). Передаётся явно, чтобы вызывающий код мог
// один раз получить актуальные цены и переиспользовать их (например, при
// расчёте списка платежей в админке), не дёргая хранилище на каждую запись.
export function getTariff(tariffId, pricing) {
  if (!pricing) return null;

  // pricing.tariffs.<id> — объект { price, activeListings, vipLifts,
  // topLifts } (см. utils/pricingSettings.js); лимиты нужны, чтобы при
  // выдаче/продлении дефолтного тарифа (subscriptionsService.js) знать,
  // сколько объявлений/поднятий полагается пользователю.
  const map = {
    start: { id: "start", title: "СТАРТ", ...pricing.tariffs.start },
    optimal: { id: "optimal", title: "ОПТИМАЛЬНЫЙ", ...pricing.tariffs.optimal },
    business: { id: "business", title: "БИЗНЕС", ...pricing.tariffs.business },
  };

  return map[tariffId] || null;
}

// Считает финальную сумму в сомах (не в копейках) с учётом скидки за период.
export function calculateTariffTotal(tariffId, months, pricing) {
  const tariff = getTariff(tariffId, pricing);
  if (!tariff) return null;

  const period = Number(months);
  if (!Number.isInteger(period) || !(period in PERIOD_DISCOUNTS)) {
    return null;
  }

  const discountPercent = PERIOD_DISCOUNTS[period];
  const pricePerMonth = Math.round(tariff.price * (1 - discountPercent / 100));
  const total = pricePerMonth * period;

  return {
    tariff,
    months: period,
    discountPercent,
    pricePerMonth,
    total,
  };
}
