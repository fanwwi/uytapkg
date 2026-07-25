"use client";

import {
  UserRound,
  UserCheck,
  Hammer,
  Building2,
  ArrowRight,
} from "lucide-react";

import styles from "./AccountType.module.css";

export default function AccountType({ setType }) {
  const types = [
    {
      id: "personal",
      title: "Частное лицо",
      description: "Продажа, покупка или аренда собственной недвижимости",
      icon: UserRound,
      color: "personal",
    },

    {
      id: "realtor",
      title: "Риэлтор",
      description: "Работа с клиентами и управление объектами",
      icon: UserCheck,
      color: "realtor",
    },

    {
      id: "agency",
      title: "Агентство недвижимости",
      description: "Команда специалистов и большой каталог объектов",
      icon: Building2,
      color: "agency",
    },

    {
      id: "developer",
      title: "Застройщик",
      description: "Продвижение жилых комплексов и проектов",
      icon: Hammer,
      color: "developer",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Выберите тип аккаунта</h2>

        <p>Настроим сервис под ваши задачи</p>
      </div>

      <div className={styles.cards}>
        {types.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`${styles.card} ${styles[item.color]}`}
              onClick={() => setType(item.id)}
            >
              <div className={styles.icon}>
                <Icon />
              </div>

              <div className={styles.content}>
                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </div>

              <div className={styles.arrow}>
                <ArrowRight />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
