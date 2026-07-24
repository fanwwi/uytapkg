"use client";

import { useState } from "react";

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
} from "lucide-react";

import styles from "./Pricing.module.css";

export default function Pricing() {
  const [period, setPeriod] = useState("1");

  const tariffs = [
    {
      title: "Частный",
      price: "0",
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
      title: "СТАРТ",
      price: "390",
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
      title: "ОПТИМАЛЬНЫЙ",
      price: "790",
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
      title: "БИЗНЕС",
      price: "1890",
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
      title: "ЗАСТРОЙЩИК",
      price: "Индивидуально",
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
    },

    {
      id: "3",
      title: "3 месяца",
      discount: "-10%",
    },

    {
      id: "6",
      title: "6 месяцев",
      discount: "-20%",
    },

    {
      id: "12",
      title: "12 месяцев",
      discount: "-35%",
    },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1>Тарифы UyTap</h1>

        <p>
          Выберите подходящий пакет для продажи, аренды и продвижения
          недвижимости
        </p>

        <div className={styles.periods}>
          {periods.map((item) => (
            <button
              key={item.id}
              className={period === item.id ? styles.activePeriod : ""}
              onClick={() => setPeriod(item.id)}
            >
              {item.title}

              {item.discount && <span>{item.discount}</span>}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.cards}>
        {tariffs.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`
                  ${styles.card}
                  ${item.popular ? styles.popular : ""}
                  ${item.developer ? styles.developer : ""}
                `}
            >
              {item.popular && (
                <div className={styles.badge}>
                  <Star />
                  ХИТ ПРОДАЖ
                </div>
              )}

              <div className={styles.icon}>
                <Icon />
              </div>

              <h2>{item.title}</h2>

              <p className={styles.desc}>{item.desc}</p>

              <div className={styles.price}>
                {item.price === "Индивидуально" ? (
                  item.price
                ) : (
                  <>
                    {item.price}

                    <span>сом / месяц</span>
                  </>
                )}
              </div>

              <ul>
                {item.features.map((feature) => (
                  <li key={feature}>
                    <Check />

                    {feature}
                  </li>
                ))}
              </ul>

              <button className={styles.button}>
                {item.developer ? "Обсудить пакет" : "Выбрать тариф"}

                <ArrowRight />
              </button>
            </div>
          );
        })}
      </section>

      <section className={styles.how}>
        <h2>Как подключить тариф?</h2>

        <div className={styles.steps}>
          <div>
            <span>1</span>

            <h3>Выберите тариф</h3>

            <p>
              Подберите решение для собственника, риелтора, агентства или
              застройщика.
            </p>
          </div>

          <div>
            <span>2</span>

            <h3>Создайте аккаунт</h3>

            <p>
              Войдите в личный кабинет и заполните информацию о вашем профиле.
            </p>
          </div>

          <div>
            <span>3</span>

            <h3>Оплатите тариф</h3>

            <p>
              После успешной оплаты возможности тарифа активируются
              автоматически.
            </p>
          </div>

          <div>
            <span>4</span>

            <h3>Получайте клиентов</h3>

            <p>Размещайте объекты и увеличивайте количество обращений.</p>
          </div>
        </div>
      </section>

      <section className={styles.payment}>
        <h2>Удобная оплата</h2>

        <div className={styles.paymentGrid}>
          <div>
            <CreditCard />

            <h3>Банковская карта</h3>

            <p>Быстрая онлайн-оплата через безопасный сервис.</p>
          </div>

          <div>
            <Smartphone />

            <h3>Мобильные платежи</h3>

            <p>Оплачивайте через популярные платежные системы Кыргызстана.</p>
          </div>

          <div>
            <Wallet />

            <h3>Для бизнеса</h3>

            <p>Индивидуальные условия для агентств и застройщиков.</p>
          </div>

          <div>
            <ShieldCheck />

            <h3>Безопасность</h3>

            <p>Проверенные платежи и защита вашего аккаунта.</p>
          </div>
        </div>
      </section>

      <section className={styles.promotion}>
        <h2>Продвижение объектов</h2>

        <div className={styles.promoGrid}>
          <div>
            <Crown />

            <h3>VIP</h3>

            <p>290 сом / день</p>
          </div>

          <div>
            <Rocket />

            <h3>ТОП</h3>

            <p>190 сом / день</p>
          </div>

          <div>
            <Sparkles />

            <h3>Авто-UP</h3>

            <p>290 сом / 30 дней</p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Развивайте продажи недвижимости вместе с <span className={styles.pink}>UyTap</span></h2>

        <p>
          Получайте больше клиентов, продвигайте объекты и управляйте
          недвижимостью профессионально.
        </p>

        <button className={styles.button}>
          Перейти в личный кабинет
          <ArrowRight />
        </button>
      </section>
    </main>
  );
}
