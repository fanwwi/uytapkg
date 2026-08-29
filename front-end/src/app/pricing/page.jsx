"use client";

import { useState } from "react";
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
} from "lucide-react";

import styles from "./Pricing.module.css";
import Header from "@/components/pageComponents/header/Header";
import Footer from "@/components/pageComponents/footer/Footer";

export default function Pricing() {
  const router = useRouter();
  const [period, setPeriod] = useState("1");

  const tariffs = [
    {
      id: "free",
      title: "Частный",
      price: 0,
      icon: User,
      desc: "Для собственников, которые продают или сдают свою недвижимость",
      features: [
        "1 бесплатное объявление",
        "Срок размещения 45 дней",
        "2 бесплатных подъема",
        "Базовый профиль пользователя",
      ],
    },
    {
      id: "start",
      title: "СТАРТ",
      price: 390,
      icon: Rocket,
      desc: "Для начинающих риелторов и частных специалистов",
      features: [
        "До 10 активных объявлений",
        "3 авто-UP в месяц",
        "Персональная страница агента",
        "Контакт WhatsApp в 1 клик",
      ],
    },
    {
      id: "optimal",
      title: "ОПТИМАЛЬНЫЙ",
      price: 790,
      icon: Crown,
      popular: true,
      desc: "Лучший выбор для активных специалистов",
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
      title: "БИЗНЕС",
      price: 1890,
      icon: Building2,
      desc: "Для агентств недвижимости и команд",
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
      title: "ЗАСТРОЙЩИК",
      price: null,
      icon: Sparkles,
      developer: true,
      desc: "Для строительных компаний и жилых комплексов",
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

    // Индивидуальный тариф для застройщиков оформляется не через онлайн-оплату
    if (tariff.price === null) {
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
            Дополнительные инструменты, чтобы ваши объявления получили больше
            внимания.
          </p>
        </div>

        <div className={styles.promoGrid}>
          <div className={styles.promoCard}>
            <Crown />
            <span>01</span>
            <h3>VIP</h3>
            <p>290 сом / день</p>
          </div>

          <div className={styles.promoCard}>
            <Rocket />
            <span>02</span>
            <h3>ТОП</h3>
            <p>190 сом / день</p>
          </div>

          <div className={styles.promoCard}>
            <Sparkles />
            <span>03</span>
            <h3>Авто-UP</h3>
            <p>290 сом / 30 дней</p>
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
