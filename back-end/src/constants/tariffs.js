// =======================================================
// Тарифы UyTap PRO и их актуальные цены.
//
// Цены и скидки живут ТОЛЬКО здесь, на сервере. Клиент присылает
// лишь tariffId/months — сумма к оплате всегда пересчитывается
// на бэкенде, чтобы никто не мог подделать сумму платежа через
// query-параметры или тело запроса.
// =======================================================

// price — стоимость тарифа за 1 месяц в сомах (KGS)
export const TARIFFS = {
  start: { id: "start", title: "СТАРТ", price: 390 },
  optimal: { id: "optimal", title: "ОПТИМАЛЬНЫЙ", price: 790 },
  business: { id: "business", title: "БИЗНЕС", price: 1890 },
};

// discountPercent за выбранный период оплаты (в месяцах)
export const PERIOD_DISCOUNTS = {
  1: 0,
  3: 10,
  6: 20,
  12: 35,
};

export function getTariff(tariffId) {
  return TARIFFS[tariffId] || null;
}

// Считает финальную сумму в сомах (не в копейках) с учётом скидки за период.
export function calculateTariffTotal(tariffId, months) {
  const tariff = getTariff(tariffId);
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
