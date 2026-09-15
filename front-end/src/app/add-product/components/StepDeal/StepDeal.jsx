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

import { useLanguage } from "@/context/LanguageContext";

import styles from "./StepDeal.module.css";

const dealTypes = [
  {
    value: "sale",
    icon: BadgeDollarSign,
    accent: "sale",
  },
  {
    value: "rent",
    icon: KeyRound,
    accent: "rent",
  },
];

const rentalPeriods = [
  {
    value: "monthly",
    icon: CalendarDays,
  },
  {
    value: "daily",
    icon: Clock3,
  },
  {
    value: "longTerm",
    icon: Home,
  },
  {
    value: "shortTerm",
    icon: Sun,
  },
];

export default function StepDeal({ form, updateForm, onNext, onBack }) {
  const { t } = useLanguage();

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
          {t("stepDeal.step")}
        </span>

        <h1>{t("stepDeal.title")}</h1>

        <p>{t("stepDeal.description")}</p>
      </div>

      {/* DEAL TYPE */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>{t("stepDeal.dealType.title")}</span>
          <small>{t("stepDeal.dealType.description")}</small>
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

                  {selected && <span className={styles.check} />}
                </div>

                <div className={styles.cardContent}>
                  <strong>{t(`stepDeal.types.${item.value}.title`)}</strong>

                  <span>{t(`stepDeal.types.${item.value}.description`)}</span>
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
              <strong>{t("stepDeal.rentalPeriod.title")}</strong>

              <span>{t("stepDeal.rentalPeriod.description")}</span>
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

                  <span className={styles.smallLabel}>
                    {t(`stepDeal.rentalPeriods.${item.value}`)}
                  </span>

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
          {t("common.back")}
        </button>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            disabled={!canContinue}
            onClick={onNext}
          >
            {t("stepDeal.continue")}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
