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

const DEFAULT_PRICING = {
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
};

export default function Pricing() {
  const router = useRouter();
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
      title: "Частный",
      price: 0,
      icon: User,
      desc: "Только для собственников, которые продают или сдают свою недвижимость",
      features: [
        "1 бесплатное объявление",
        "Срок размещения 45 дней",
        "2 бесплатных подъема",
        "Базовый профиль пользователя",
      ],
    },
    {
      id: "start",
      title: "Старт",
      price: pricing.tariffs.start,
      icon: Rocket,
      desc: "Только для риелторов и частных специалистов",
      features: [
        "До 10 активных объявлений",
        "3 авто-UP в месяц",
        "Персональная страница агента",
        "Контакт WhatsApp в 1 клик",
      ],
    },
    {
      id: "optimal",
      title: "Оптимальный",
      price: pricing.tariffs.optimal,
      icon: Crown,
      popular: true,
      desc: "Только для риелторов и частных специалистов. Лучший выбор для активных специалистов",
      features: [
        "До 20 активных объявлений",
        "5 авто-UP в месяц",
        "Значок «Проверенный риелтор»",
        "Брендированная страница",
        "Скрытие похожих объявлений",
      ],
    },
    {
      id: "business",
      title: "Для агентства",
      price: pricing.tariffs.business,
      icon: Building2,
      desc: "Только для агентств недвижимости и команд",
      features: [
        "До 40 активных объявлений",
        "Официальная страница агентства",
        "Добавление сотрудников",
        "Общий лимит объектов",
        "Статистика команды",
      ],
    },
    {
      id: "developer",
      title: "Индивидуальный",
      price: developerPrice,
      icon: Sparkles,
      developer: true,
      desc: "Только для строительных компаний",
      features: [
        "Карточки жилых комплексов",
        "Интерактивные шахматки квартир",
        "Добавление планировок",
        "VIP размещение",
        "Персональный менеджер 24/7",
      ],
    },
  ];

  const periods = [
    {
      id: "1",
      title: "1 месяц",
      discount: "",
      discountPercent: 0,
    },
    {
      id: "3",
      title: "3 месяца",
      discount: "-10%",
      discountPercent: 10,
    },
    {
      id: "6",
      title: "6 месяцев",
      discount: "-20%",
      discountPercent: 20,
    },
    {
      id: "12",
      title: "12 месяцев",
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

  const hasDiscount = (price) => {
    return discountPercent > 0 && price !== null && price > 0;
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem("uytap_token");

    if (token) {
      router.push("/profile");
    } else {
      router.push("/auth-required");
    }
  };

  const handleTariffClick = (tariff) => {
    // Бесплатный тариф активен по умолчанию — платить не нужно
    if (tariff.price === 0) {
      router.push("/profile");
      return;
    }

    // Тариф застройщика оформляется не через онлайн-оплату (backend не
    // принимает его в /api/payments/create) — независимо от того, задал
    // ли админ конкретную цену или оставил "Индивидуально".
    if (tariff.developer) {
      router.push("/profile");
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
          Тарифы, которые
          <span> работают на вас.</span>
        </h1>

        <p>
          Выберите подходящий пакет для продажи, аренды и продвижения
          недвижимости на UyTap.
        </p>

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
            <span className={styles.sectionLabel}>Тарифы</span>
          </div>

          <p>Для собственников, риелторов, агентств и застройщиков.</p>
        </div>

        <div className={styles.cards}>
          {tariffs.map((item, index) => {
            const Icon = item.icon;

            const currentPrice = getPrice(item.price);
            const total = getTotal(item.price);

            const discounted = hasDiscount(item.price);

            return (
              <article
                key={item.title}
                className={`
                  ${styles.card}
                  ${item.popular ? styles.popular : ""}
                  ${item.developer ? styles.developer : ""}
                `}
              >
                {item.popular && (
                  <div className={styles.badge}>
                    <Star size={12} />
                    ПОПУЛЯРНЫЙ
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
                      Индивидуально
                    </strong>
                  ) : item.price === 0 ? (
                    <>
                      <strong>0</strong>
                      <span>сом / месяц</span>
                    </>
                  ) : (
                    <>
                      {discounted && (
                        <span className={styles.oldPrice}>
                          {item.price} сом
                        </span>
                      )}

                      <strong>{currentPrice}</strong>

                      <span>сом / месяц</span>
                    </>
                  )}
                </div>

                {discounted && (
                  <div className={styles.discountInfo}>
                    Экономия {discountPercent}%
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
                  {item.developer ? "Обсудить пакет" : "Выбрать тариф"}

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

          <span className={styles.sectionLabel}>Как это работает</span>

          <h2>
            Подключиться
            <span> проще, чем кажется.</span>
          </h2>

          <p>
            Всего несколько шагов — и ваши объявления начинают работать на вас.
          </p>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>01</div>
            <h3>Выберите тариф</h3>
            <p>
              Подберите решение для собственника, риелтора, агентства или
              застройщика.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>02</div>
            <h3>Создайте аккаунт</h3>
            <p>
              Войдите в личный кабинет и заполните информацию о вашем профиле.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>03</div>
            <h3>Оплатите тариф</h3>
            <p>
              После успешной оплаты возможности тарифа активируются
              автоматически.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>04</div>
            <h3>Получайте клиентов</h3>
            <p>
              Размещайте объекты, продвигайте их и увеличивайте количество
              обращений.
            </p>
          </div>
        </div>
      </section>

      {/* PAYMENT */}

      <section className={styles.payment}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionNumber}>03</span>

          <span className={styles.sectionLabel}>Оплата</span>

          <h2>
            Всё необходимое
            <span> для бизнеса.</span>
          </h2>
        </div>

        <div className={styles.paymentGrid}>
          <div className={styles.paymentCard}>
            <div className={styles.smallIcon}>
              <CreditCard size={20} />
            </div>

            <h3>Банковская карта</h3>
            <p>Быстрая онлайн-оплата через безопасный сервис.</p>
          </div>

          <div className={styles.paymentCard}>
            <div className={styles.smallIcon}>
              <Smartphone size={20} />
            </div>

            <h3>Мобильные платежи</h3>
            <p>Оплачивайте через популярные платежные системы Кыргызстана.</p>
          </div>

          <div className={styles.paymentCard}>
            <div className={styles.smallIcon}>
              <Wallet size={20} />
            </div>

            <h3>Для бизнеса</h3>
            <p>Индивидуальные условия для агентств и застройщиков.</p>
          </div>

          <div className={styles.paymentCard}>
            <div className={styles.smallIcon}>
              <ShieldCheck size={20} />
            </div>

            <h3>Безопасность</h3>
            <p>Проверенные платежи и защита вашего аккаунта.</p>
          </div>
        </div>
      </section>

      {/* PROMOTION */}

      <section className={styles.promotion}>
        <div className={styles.promotionHeader}>
          <div>
            <span className={styles.sectionNumber}>04</span>

            <span className={styles.sectionLabel}>Продвижение</span>

            <h2>
              Сделайте объект
              <span> заметнее.</span>
            </h2>
          </div>

          <p>
            Инструменты продвижения, которые помогают быстрее привлечь внимание
            покупателей и увеличить количество обращений.
          </p>
        </div>

        <div className={styles.promoGrid}>
          <div className={styles.promoCard}>
            <div className={styles.promoIcon}>
              <Rocket size={22} />
            </div>

            <span className={styles.promoIndex}>01</span>

            <h3>ТОП</h3>

            <strong>{pricing.services.top} сом / день</strong>

            <p>
              Подъем и закрепление объявления выше стандартных бесплатных
              карточек.
            </p>
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

            <strong style={{ color: "#9a9a0b" }}>{pricing.services.vip} сом / день</strong>

            <p>
              Закрепление в самом верху каталога + выделение яркой золотой
              рамкой.
            </p>
          </div>

          <div className={`${styles.promoCard} ${styles.urgentCard}`}>
            <div className={styles.promoIcon}>
              <Zap size={22} />
            </div>

            <span className={styles.promoIndex}>03</span>

            <h3>Срочно</h3>

            <strong>{pricing.services.urgent} сом / день</strong>

            <p>
              Красный бейдж на карточке + автоматическое попадание в специальный
              фильтр «Срочные продажи».
            </p>
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
              <span className={styles.smmLabel}>
                Автоматизированный SMM-модуль
              </span>

              <span className={styles.smmPlatforms}>
                Instagram · Telegram · Meta Ads
              </span>
            </div>

            <h3>Instagram Пост + Сторис</h3>

            <div className={styles.smmPrice} style={{ color: "#eb23ab" }}>
              {pricing.services.instagram} сом
            </div>

            <p>
              Возможность сделать ваше объявление еще заметнее через публикацию
              и размещении в сторис на официальной Instagram-странице
              <strong> @uytap.kg</strong> и дублирование в Telegram-канал.
            </p>

            <div className={styles.smmFeatures}>
              <span>
                <Check size={12} />
                Автогенерация макета
              </span>

              <span>
                <Check size={12} />
                Instagram Post + Story
              </span>

              <span>
                <Check size={12} />
                Дублирование в Telegram
              </span>

              <span>
                <Check size={12} />
                Instagram Graph API
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
            Развивайте продажи
            <br />
            недвижимости с <span>UyTap.</span>
          </h2>

          <p>
            Получайте больше клиентов, продвигайте объекты и управляйте
            недвижимостью профессионально.
          </p>

          <button
            type="button"
            className={styles.ctaButton}
            onClick={handleProfileClick}
          >
            Перейти в личный кабинет
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
