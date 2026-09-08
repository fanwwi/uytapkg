"use client";

import {
  Settings2,
  Crown,
  Rocket,
  Building2,
  Sparkles,
  Zap,
  Camera,
  ListChecks,
  ArrowUp,
} from "lucide-react";

import styles from "./PricingSection.module.css";

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "—";
  }

  return `${Number(price).toLocaleString("ru-RU")} сом`;
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return Number(value).toLocaleString("ru-RU");
};

const formatServicePrice = (price) => {
  return `${Number(price).toLocaleString("ru-RU")} сом`;
};

const getTariffValue = (tariff, field) => {
  if (!tariff) return null;

  if (typeof tariff === "object") {
    return tariff[field] ?? null;
  }

  return null;
};

const getTariffPrice = (tariff) => {
  if (typeof tariff === "object") {
    return tariff.price ?? 0;
  }

  return tariff ?? 0;
};

export default function PricingSection({ pricing, onOpenPricingModal }) {
  const developerMode = pricing.tariffs.developer?.mode;

  const developerValue = pricing.tariffs.developer?.value;

  const developerPrice =
    developerMode === "individual"
      ? "Индивидуально"
      : `${Number(developerValue || 0).toLocaleString("ru-RU")} сом`;

  const tariffCards = [
    {
      key: "start",
      title: "СТАРТ",
      icon: Rocket,
      tariff: pricing.tariffs.start,
    },
    {
      key: "optimal",
      title: "ОПТИМАЛЬНЫЙ",
      icon: Crown,
      tariff: pricing.tariffs.optimal,
    },
    {
      key: "business",
      title: "БИЗНЕС",
      icon: Building2,
      tariff: pricing.tariffs.business,
    },
  ];

  return (
    <section className={styles.pricingPanel}>
      <div className={styles.pricingPanelHeader}>
        <div className={styles.pricingPanelTitle}>
          <div className={styles.pricingPanelIcon}>
            <Settings2 size={18} />
          </div>

          <div>
            <span>НАСТРОЙКИ СИСТЕМЫ</span>

            <h2>Текущие цены</h2>

            <p>Стоимость тарифов и дополнительные возможности UyTap</p>
          </div>
        </div>

        <button
          type="button"
          className={styles.pricingEditButton}
          onClick={onOpenPricingModal}
        >
          <Settings2 size={16} />
          Изменить цены
        </button>
      </div>

      <div className={styles.pricingGroupTitle}>
        <span>01</span>

        <div>
          <strong>Тарифы</strong>

          <small>Стоимость и доступные возможности</small>
        </div>
      </div>

      <div className={styles.currentPricingGrid}>
        {tariffCards.map(({ key, title, icon: Icon, tariff }) => (
          <div key={key} className={styles.currentPriceCard}>
            <div className={styles.currentPriceIcon}>
              <Icon size={18} />
            </div>

            <div className={styles.currentPriceContent}>
              <span>{title}</span>

              <strong>{formatPrice(getTariffPrice(tariff))}</strong>

              <small>в месяц</small>
            </div>

            <div className={styles.tariffLimits}>
              <div className={styles.tariffLimit}>
                <ListChecks size={14} />

                <div>
                  <span>Активные</span>

                  <strong>
                    {formatNumber(getTariffValue(tariff, "activeListings"))}
                  </strong>
                </div>
              </div>

              <div className={styles.tariffLimit}>
                <Crown size={14} />

                <div>
                  <span>VIP</span>

                  <strong>
                    {formatNumber(getTariffValue(tariff, "vipLifts"))}
                  </strong>
                </div>
              </div>

              <div className={styles.tariffLimit}>
                <ArrowUp size={14} />

                <div>
                  <span>TOP</span>

                  <strong>
                    {formatNumber(getTariffValue(tariff, "topLifts"))}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* DEVELOPER */}

        <div className={styles.currentPriceCard}>
          <div className={styles.currentPriceIcon}>
            <Sparkles size={18} />
          </div>

          <div className={styles.currentPriceContent}>
            <span>ЗАСТРОЙЩИК</span>

            <strong>{developerPrice}</strong>

            <small>
              {developerMode === "individual" ? "особые условия" : "в месяц"}
            </small>
          </div>

          <div className={styles.tariffLimits}>
            <div className={styles.tariffLimit}>
              <ListChecks size={14} />

              <div>
                <span>Активные</span>

                <strong>
                  {formatNumber(
                    getTariffValue(pricing.tariffs.developer, "activeListings"),
                  )}
                </strong>
              </div>
            </div>

            <div className={styles.tariffLimit}>
              <Crown size={14} />

              <div>
                <span>VIP</span>

                <strong>
                  {formatNumber(
                    getTariffValue(pricing.tariffs.developer, "vipLifts"),
                  )}
                </strong>
              </div>
            </div>

            <div className={styles.tariffLimit}>
              <ArrowUp size={14} />

              <div>
                <span>TOP</span>

                <strong>
                  {formatNumber(
                    getTariffValue(pricing.tariffs.developer, "topLifts"),
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}

      <div className={`${styles.pricingGroupTitle} ${styles.servicesTitle}`}>
        <span>02</span>

        <div>
          <strong>Дополнительные услуги</strong>

          <small>Продвижение и SMM</small>
        </div>
      </div>

      <div className={styles.currentPricingGrid}>
        <div className={styles.currentPriceCard}>
          <div className={styles.currentPriceIcon}>
            <Crown size={18} />
          </div>

          <div className={styles.currentPriceContent}>
            <span>VIP</span>

            <strong>{formatServicePrice(pricing.services.vip)}</strong>

            <small>в день</small>
          </div>
        </div>

        <div className={styles.currentPriceCard}>
          <div className={styles.currentPriceIcon}>
            <Zap size={18} />
          </div>

          <div className={styles.currentPriceContent}>
            <span>СРОЧНО</span>

            <strong>{formatServicePrice(pricing.services.urgent)}</strong>

            <small>в день</small>
          </div>
        </div>

        <div className={styles.currentPriceCard}>
          <div className={styles.currentPriceIcon}>
            <Rocket size={18} />
          </div>

          <div className={styles.currentPriceContent}>
            <span>ТОП</span>

            <strong>{formatServicePrice(pricing.services.top)}</strong>

            <small>в день</small>
          </div>
        </div>

        <div className={styles.currentPriceCard}>
          <div className={styles.currentPriceIcon}>
            <Camera size={18} />
          </div>

          <div className={styles.currentPriceContent}>
            <span>INSTAGRAM</span>

            <strong>{formatServicePrice(pricing.services.instagram)}</strong>

            <small>за публикацию</small>
          </div>
        </div>
      </div>

      <div className={styles.pricingPanelFooter}>
        <span>Цены и лимиты применяются к новым покупкам и услугам.</span>

        <button
          type="button"
          className={styles.pricingInlineButton}
          onClick={onOpenPricingModal}
        >
          Настроить
          <Settings2 size={14} />
        </button>
      </div>
    </section>
  );
}
