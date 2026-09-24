"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Check,
  Crown,
  Building2,
  User,
  Rocket,
  Sparkles,
  Star,
  CreditCard,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Wallet,
  Zap,
  Camera,
} from "lucide-react";

import styles from "./Pricing.module.css";
import Header from "@/components/pageComponents/header/Header";
import Footer from "@/components/pageComponents/footer/Footer";
import { getPricing } from "@/utils/api";
import { useLanguage } from "@/context/LanguageContext";

const DEFAULT_PRICING = {
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
};

const getTariffPrice = (tariff) =>
  tariff && typeof tariff === "object" ? (tariff.price ?? 0) : (tariff ?? 0);

const getTariffLimit = (tariff, field, fallback) =>
  tariff && typeof tariff === "object" && tariff[field] != null
    ? tariff[field]
    : fallback;

export default function Pricing() {
  const router = useRouter();
  const { t } = useLanguage();

  const [period, setPeriod] = useState("1");
  const [pricing, setPricing] = useState(DEFAULT_PRICING);

  useEffect(() => {
    getPricing()
      .then((data) => setPricing(data))
      .catch((err) => console.error("Ошибка загрузки цен:", err));
  }, []);

  const developerPrice =
    pricing.tariffs.developer.mode === "numeric" &&
    Number.isFinite(pricing.tariffs.developer.value)
      ? pricing.tariffs.developer.value
      : null;

  const tariffs = [
    {
      id: "free",
      title: t("pricing.tariffs.private.title"),
      price: 0,
      icon: User,
      desc: t("pricing.tariffs.private.description"),
      features: [
        t("pricing.tariffs.private.features.freeListings"),
        t("pricing.tariffs.private.features.top"),
        t("pricing.tariffs.private.features.duration"),
        t("pricing.tariffs.private.features.search"),
        t("pricing.tariffs.private.features.profile"),
        t("pricing.tariffs.private.features.favorites"),
        t("pricing.tariffs.private.features.compare"),
        "2 бесплатных объявления",
        "Размещение объявления на 45 дней",
        "Поиск и фильтры",
        "Публичный профиль пользователя",
        "Добавление в избранное",
        "Сравнение объектов в избранном",
      ],
    },
    {
      id: "start",
      title: t("pricing.tariffs.start.title"),
      price: getTariffPrice(pricing.tariffs.start),
      icon: Rocket,
      desc: t("pricing.tariffs.start.description"),
      features: [
        t("pricing.tariffs.start.features.listings"),
        t("pricing.tariffs.start.features.top"),
        t("pricing.tariffs.start.features.profile"),
        t("pricing.tariffs.start.features.search"),
        t("pricing.tariffs.start.features.map"),
        t("pricing.tariffs.start.features.compare"),
        `До ${getTariffLimit(pricing.tariffs.start, "activeListings", DEFAULT_PRICING.tariffs.start.activeListings)} активных объявлений`,
        `До ${getTariffLimit(pricing.tariffs.start, "topLifts", DEFAULT_PRICING.tariffs.start.topLifts)} поднятий в ТОП`,
        "Публичный профиль специалиста",
        "Поиск и фильтры",
        "Размещение объявлений на карте",
        "Сравнение объектов в избранном",
      ],
    },
    {
      id: "optimal",
      title: t("pricing.tariffs.optimal.title"),
      price: getTariffPrice(pricing.tariffs.optimal),
      icon: Crown,
      popular: true,
      desc: t("pricing.tariffs.optimal.description"),
      features: [
        t("pricing.tariffs.optimal.features.listings"),
        t("pricing.tariffs.optimal.features.vip"),
        t("pricing.tariffs.optimal.features.profile"),
        t("pricing.tariffs.optimal.features.map"),
        t("pricing.tariffs.optimal.features.promotion"),
        t("pricing.tariffs.optimal.features.compare"),
        `До ${getTariffLimit(pricing.tariffs.optimal, "activeListings", DEFAULT_PRICING.tariffs.optimal.activeListings)} активных объявлений`,
        `До ${getTariffLimit(pricing.tariffs.optimal, "vipLifts", DEFAULT_PRICING.tariffs.optimal.vipLifts)} поднятий объявления в VIP`,
        "Публичный профиль специалиста",
        "Размещение объектов на карте",
        "Продвижение объявлений",
        "Сравнение объектов в избранном",
      ],
    },
    {
      id: "business",
      title: t("pricing.tariffs.business.title"),
      price: getTariffPrice(pricing.tariffs.business),
      icon: Building2,
      desc: t("pricing.tariffs.business.description"),
      features: [
        t("pricing.tariffs.business.features.listings"),
        t("pricing.tariffs.business.features.vip"),
        t("pricing.tariffs.business.features.profile"),
        t("pricing.tariffs.business.features.objects"),
        t("pricing.tariffs.business.features.compare"),
        `До ${getTariffLimit(pricing.tariffs.business, "activeListings", DEFAULT_PRICING.tariffs.business.activeListings)} активных объявлений`,
        `До ${getTariffLimit(pricing.tariffs.business, "vipLifts", DEFAULT_PRICING.tariffs.business.vipLifts)} поднятий в VIP`,
        "Профиль агентства",
        "Размещение объектов агентства",
        "Сравнение объектов в избранном",
      ],
    },
    {
      id: "developer",
      title: t("pricing.tariffs.developer.title"),
      price: developerPrice,
      icon: Sparkles,
      developer: true,
      desc: t("pricing.tariffs.developer.description"),
      features: [
        t("pricing.tariffs.developer.features.complexes"),
        t("pricing.tariffs.developer.features.developerCard"),
        t("pricing.tariffs.developer.features.complexCards"),
        t("pricing.tariffs.developer.features.apartments"),
        t("pricing.tariffs.developer.features.management"),
        t("pricing.tariffs.developer.features.compare"),
      ],
    },
  ];

  const periods = [
    {
      id: "1",
      title: t("pricing.periods.month1"),
      discount: "",
      discountPercent: 0,
    },
    {
      id: "3",
      title: t("pricing.periods.month3"),
      discount: "-10%",
      discountPercent: 10,
    },
    {
      id: "6",
      title: t("pricing.periods.month6"),
      discount: "-20%",
      discountPercent: 20,
    },
    {
      id: "12",
      title: t("pricing.periods.month12"),
      discount: "-35%",
      discountPercent: 35,
    },
  ];

  const selectedPeriod = periods.find((item) => item.id === period);
  const discountPercent = selectedPeriod?.discountPercent ?? 0;
  const months = Number(period);

  const getPrice = (price) => {
    if (price === null) return null;
    if (price === 0) return 0;
    return Math.round(price * (1 - discountPercent / 100));
  };

  const getTotal = (price) => {
    if (price === null) return null;
    if (price === 0) return 0;
    const monthlyPrice = getPrice(price);
    return monthlyPrice * months;
  };

  const hasDiscount = (price) =>
    discountPercent > 0 && price !== null && price > 0;

  const handleProfileClick = () => {
    const token = localStorage.getItem("uytap_token");
    if (token) {
      router.push("/profile");
    } else {
      router.push("/auth-required");
    }
  };

  const handleTariffClick = (tariff) => {
    if (tariff.price === 0) {
      router.push("/profile");
      return;
    }

    if (tariff.developer) {
      router.push("/connect");
      return;
    }

    const token = localStorage.getItem("uytap_token");
    if (!token) {
      router.push("/auth-required");
      return;
    }

    const params = new URLSearchParams({
      tariffId: tariff.id,
      months: String(months),
    });

    router.push(`/payment?${params.toString()}`);
  };

  return (
    <main className={styles.page}>
      <Header />

      <div className={styles.noise} />
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <Zap size={14} />
          UyTap PRO
        </div>

        <h1>
          {t("pricing.hero.title")}
          <span> {t("pricing.hero.titleAccent")}</span>
        </h1>

        <p>{t("pricing.hero.description")}</p>

        <div className={styles.periods}>
          {periods.map((item) => (
            <button
              key={item.id}
              type="button"
              className={period === item.id ? styles.activePeriod : ""}
              onClick={() => setPeriod(item.id)}
            >
              <span>{item.title}</span>
              {item.discount && <small>{item.discount}</small>}
            </button>
          ))}
        </div>
      </section>

      {/* TARIFFS */}
      <section className={styles.cardsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionNumber}>01</span>
            <span className={styles.sectionLabel}>
              {t("pricing.sections.tariffs")}
            </span>
          </div>
          <p>{t("pricing.tariffsSectionDescription")}</p>
        </div>

        <div className={styles.cards}>
          {tariffs.map((item, index) => {
            const Icon = item.icon;
            const currentPrice = getPrice(item.price);
            const discounted = hasDiscount(item.price);

            return (
              <article
                key={item.id}
                className={`
                  ${styles.card}
                  ${item.popular ? styles.popular : ""}
                  ${item.developer ? styles.developer : ""}
                `}
              >
                {item.popular && (
                  <div className={styles.badge}>
                    <Star size={12} />
                    {t("pricing.popular")}
                  </div>
                )}

                <div className={styles.cardTop}>
                  <div className={styles.icon}>
                    <Icon size={23} />
                  </div>
                  <span className={styles.cardIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h2>{item.title}</h2>
                <p className={styles.desc}>{item.desc}</p>

                <div className={styles.price}>
                  {item.price === null ? (
                    <strong className={styles.individualPrice}>
                      {t("pricing.individual")}
                    </strong>
                  ) : item.price === 0 ? (
                    <>
                      <strong>0</strong>
                      <span>{t("pricing.somPerMonth")}</span>
                    </>
                  ) : (
                    <>
                      {discounted && (
                        <span className={styles.oldPrice}>
                          {item.price} {t("pricing.som")}
                        </span>
                      )}
                      <strong>{currentPrice}</strong>
                      <span>{t("pricing.somPerMonth")}</span>
                    </>
                  )}
                </div>

                {discounted && (
                  <div className={styles.discountInfo}>
                    {t("pricing.saving")} {discountPercent}%
                  </div>
                )}

                <div className={styles.divider} />

                <ul>
                  {item.features.map((feature) => (
                    <li key={feature}>
                      <span className={styles.check}>
                        <Check size={12} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={styles.cardButton}
                  onClick={() => handleTariffClick(item)}
                >
                  {item.developer
                    ? t("pricing.discussPackage")
                    : t("pricing.chooseTariff")}
                  <ArrowRight size={16} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.how}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionNumber}>02</span>
          <span className={styles.sectionLabel}>
            {t("pricing.sections.howItWorks")}
          </span>
          <h2>
            {t("pricing.how.title")}
            <span> {t("pricing.how.titleAccent")}</span>
          </h2>
          <p>{t("pricing.how.description")}</p>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>01</div>
            <h3>{t("pricing.how.steps.choose.title")}</h3>
            <p>{t("pricing.how.steps.choose.description")}</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>02</div>
            <h3>{t("pricing.how.steps.account.title")}</h3>
            <p>{t("pricing.how.steps.account.description")}</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>03</div>
            <h3>{t("pricing.how.steps.payment.title")}</h3>
            <p>{t("pricing.how.steps.payment.description")}</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>04</div>
            <h3>{t("pricing.how.steps.clients.title")}</h3>
            <p>{t("pricing.how.steps.clients.description")}</p>
          </div>
        </div>
      </section>

      {/* PAYMENT */}
      <section className={styles.payment}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionNumber}>03</span>
          <span className={styles.sectionLabel}>
            {t("pricing.sections.payment")}
          </span>
          <h2>
            {t("pricing.payment.title")}
            <span> {t("pricing.payment.titleAccent")}</span>
          </h2>
        </div>

        <div className={styles.paymentGrid}>
          <div className={styles.paymentCard}>
            <div className={styles.smallIcon}>
              <CreditCard size={20} />
            </div>
            <h3>{t("pricing.payment.card.title")}</h3>
            <p>{t("pricing.payment.card.description")}</p>
          </div>
          <div className={styles.paymentCard}>
            <div className={styles.smallIcon}>
              <Smartphone size={20} />
            </div>
            <h3>{t("pricing.payment.mobile.title")}</h3>
            <p>{t("pricing.payment.mobile.description")}</p>
          </div>
          <div className={styles.paymentCard}>
            <div className={styles.smallIcon}>
              <Wallet size={20} />
            </div>
            <h3>{t("pricing.payment.business.title")}</h3>
            <p>{t("pricing.payment.business.description")}</p>
          </div>
          <div className={styles.paymentCard}>
            <div className={styles.smallIcon}>
              <ShieldCheck size={20} />
            </div>
            <h3>{t("pricing.payment.security.title")}</h3>
            <p>{t("pricing.payment.security.description")}</p>
          </div>
        </div>
      </section>

      {/* PROMOTION */}
      <section className={styles.promotion}>
        <div className={styles.promotionHeader}>
          <div>
            <span className={styles.sectionNumber}>04</span>
            <span className={styles.sectionLabel}>
              {t("pricing.sections.promotion")}
            </span>
            <h2>
              {t("pricing.promotion.title")}
              <span> {t("pricing.promotion.titleAccent")}</span>
            </h2>
          </div>
          <p>{t("pricing.promotion.description")}</p>
        </div>

        <div className={styles.promoGrid}>
          <div className={styles.promoCard}>
            <div className={styles.promoIcon}>
              <Rocket size={22} />
            </div>
            <span className={styles.promoIndex}>01</span>
            <h3>ТОП</h3>
            <strong>
              {pricing.services.top} {t("pricing.somPerDay")}
            </strong>
            <p>{t("pricing.promotion.top")}</p>
          </div>

          <div className={styles.promoCard}>
            <div
              className={styles.promoIcon}
              style={{ borderColor: "#9a9a0b7f" }}
            >
              <Crown size={22} color="#9a9a0b" />
            </div>
            <span className={styles.promoIndex}>02</span>
            <h3>VIP</h3>
            <strong style={{ color: "#9a9a0b" }}>
              {pricing.services.vip} {t("pricing.somPerDay")}
            </strong>
            <p>{t("pricing.promotion.vip")}</p>
          </div>

          <div className={`${styles.promoCard} ${styles.urgentCard}`}>
            <div className={styles.promoIcon}>
              <Zap size={22} />
            </div>
            <span className={styles.promoIndex}>03</span>
            <h3>{t("pricing.promotion.urgentTitle")}</h3>
            <strong>
              {pricing.services.urgent} {t("pricing.somPerDay")}
            </strong>
            <p>{t("pricing.promotion.urgent")}</p>
          </div>
        </div>

        <div className={styles.smmModule}>
          <div className={styles.smmVisual}>
            <div
              className={styles.smmIcon}
              style={{ borderColor: "#eb23ac6a" }}
            >
              <Camera size={23} color="#eb23ab" />
            </div>
            <span className={styles.smmNumber}>05.2</span>
          </div>

          <div className={styles.smmContent}>
            <div className={styles.smmTop}>
              <span className={styles.smmLabel}>{t("pricing.smm.label")}</span>
              <span className={styles.smmPlatforms}>
                Instagram · Telegram · Meta Ads
              </span>
            </div>

            <h3>{t("pricing.smm.title")}</h3>

            <div className={styles.smmPrice} style={{ color: "#eb23ab" }}>
              {pricing.services.instagram} {t("pricing.som")}
            </div>

            <p>
              {t("pricing.smm.description")}
              <strong> @uytap.kg</strong>
              {t("pricing.smm.telegramSuffix")}
            </p>

            <div className={styles.smmFeatures}>
              <span>
                <Check size={12} />
                {t("pricing.smm.features.layout")}
              </span>
              <span>
                <Check size={12} />
                {t("pricing.smm.features.post")}
              </span>
              <span>
                <Check size={12} />
                {t("pricing.smm.features.telegram")}
              </span>
              <span>
                <Check size={12} />
                {t("pricing.smm.features.api")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <div className={styles.ctaBadge}>
            <Sparkles size={14} />
            UyTap
          </div>
          <h2>
            {t("pricing.cta.title")}
            <br />
            {t("pricing.cta.titleSecond")} <span>UyTap.</span>
          </h2>
          <p>{t("pricing.cta.description")}</p>
          <button
            type="button"
            className={styles.ctaButton}
            onClick={handleProfileClick}
          >
            {t("pricing.cta.button")}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
