"use client";

import {
  BadgeDollarSign,
  CalendarDays,
  ChevronRight,
  Clock3,
  Home,
  KeyRound,
  Moon,
  Sun,
} from "lucide-react";

import styles from "./StepDeal.module.css";

const dealTypes = [
  {
    value: "sale",
    title: "Продам",
    description: "Разместить объект на продажу",
    icon: BadgeDollarSign,
    accent: "sale",
  },
  {
    value: "rent",
    title: "Сдам в аренду",
    description: "Получать доход от аренды объекта",
    icon: KeyRound,
    accent: "rent",
  },
];

const rentalPeriods = [
  {
    value: "monthly",
    label: "Помесячно",
    icon: CalendarDays,
  },
  {
    value: "daily",
    label: "Посуточно",
    icon: Clock3,
  },
  {
    value: "longTerm",
    label: "Долгосрочно",
    icon: Home,
  },
  {
    value: "shortTerm",
    label: "Краткосрочно",
    icon: Sun,
  },
];

export default function StepDeal({ form, updateForm, onNext, onBack }) {
  const canContinue =
    form.dealType && (form.dealType === "sale" || form.rentalPeriod);

  function selectDealType(type) {
    updateForm({
      dealType: type,
      ...(type === "sale" ? { rentalPeriod: "" } : {}),
    });
  }

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <span className={styles.stepBadge}>
          <span className={styles.stepDot} />
          Шаг 3 из 6
        </span>

        <h1>Что вы хотите сделать?</h1>

        <p>Выберите формат сделки — продажа или аренда недвижимости.</p>
      </div>

      {/* DEAL TYPE */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>Тип сделки</span>
          <small>Выберите один вариант</small>
        </div>

        <div className={styles.cards}>
          {dealTypes.map((item) => {
            const Icon = item.icon;
            const selected = form.dealType === item.value;

            return (
              <button
                type="button"
                key={item.value}
                className={`${styles.choiceCard} ${
                  selected ? styles.selected : ""
                }`}
                onClick={() => selectDealType(item.value)}
              >
                <div className={styles.cardTop}>
                  <div className={styles.iconBox}>
                    <Icon />
                  </div>

                  {selected && <span className={styles.check}></span>}
                </div>

                <div className={styles.cardContent}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </div>

                <div className={styles.cardGlow} />
              </button>
            );
          })}
        </div>
      </div>

      {/* RENTAL PERIOD */}
      {form.dealType === "rent" && (
        <div className={styles.field}>
          <div className={styles.periodHeader}>
            <div>
              <strong>Период аренды</strong>
              <span>Как долго планируете сдавать объект?</span>
            </div>

            <div className={styles.periodIcon}>
              <CalendarDays />
            </div>
          </div>

          <div className={styles.periodGrid}>
            {rentalPeriods.map((item) => {
              const Icon = item.icon;
              const selected = form.rentalPeriod === item.value;

              return (
                <button
                  type="button"
                  key={item.value}
                  className={`${styles.smallChoice} ${
                    selected ? styles.selected : ""
                  }`}
                  onClick={() =>
                    updateForm({
                      rentalPeriod: item.value,
                    })
                  }
                >
                  <span className={styles.smallIcon}>
                    <Icon />
                  </span>

                  <span className={styles.smallLabel}>{item.label}</span>

                  {selected && <span className={styles.smallCheck}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={onBack}>
          Назад
        </button>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            disabled={!canContinue}
            onClick={onNext}
          >
            Продолжить
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
