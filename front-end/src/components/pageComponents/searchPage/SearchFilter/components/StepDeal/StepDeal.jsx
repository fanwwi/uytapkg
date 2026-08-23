"use client";

import {
  BadgeDollarSign,
  CalendarDays,
  ChevronRight,
  Clock3,
  Home,
  KeyRound,
  Sun,
} from "lucide-react";

import styles from "./StepDeal.module.css";

const dealTypes = [
  {
    value: "sale",
    title: "Куплю",
    description: "Просмотреть объекты, размещенные на продажу",
    icon: BadgeDollarSign,
  },
  {
    value: "rent",
    title: "Сниму в аренду",
    description: "Посмотреть объекты, которые сдаются в аренду",
    icon: KeyRound,
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
      {/* HEADER */}
      <div className={styles.header}>
        <h1>Выберите формат сделки</h1>

        <p>
          Укажите, что вы хотите сделать с недвижимостью — купить объект или
          снять его в аренду.
        </p>
      </div>

      {/* DEAL TYPE */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <div>
            <span>Тип сделки</span>
            <small>Выберите один вариант</small>
          </div>

          <span className={styles.required}>Обязательно</span>
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

                  <span
                    className={`${styles.radio} ${
                      selected ? styles.radioActive : ""
                    }`}
                  >
                    {selected && <span />}
                  </span>
                </div>

                <div className={styles.cardContent}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </div>

                <div className={styles.cardArrow}>
                  <ChevronRight size={17} />
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
              <span>Как долго планируете снимать объект?</span>
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

                  <span
                    className={`${styles.smallRadio} ${
                      selected ? styles.smallRadioActive : ""
                    }`}
                  >
                    {selected && <span />}
                  </span>
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

        <button
          type="button"
          className={styles.primary}
          disabled={!canContinue}
          onClick={onNext}
        >
          <span>Продолжить</span>
          <span className={styles.primaryIcon}>
            <ChevronRight size={18} />
          </span>
        </button>
      </div>
    </div>
  );
}
