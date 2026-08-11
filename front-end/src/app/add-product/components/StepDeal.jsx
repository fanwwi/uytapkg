"use client";

import styles from "./steps.module.css";

export default function StepDeal({ form, updateForm, onNext, onBack }) {
  const canContinue =
    form.dealType && (form.dealType === "sale" || form.rentalPeriod);

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <span>Шаг 2 из 5</span>

        <h1>Что вы хотите сделать?</h1>

        <p>Выберите тип сделки.</p>
      </div>

      <div className={styles.cards}>
        <button
          type="button"
          className={`${styles.choiceCard} ${
            form.dealType === "sale" ? styles.selected : ""
          }`}
          onClick={() =>
            updateForm({
              dealType: "sale",
              rentalPeriod: "",
            })
          }
        >
          <strong>Продам</strong>
          <span>Разместить объект на продажу</span>
        </button>

        <button
          type="button"
          className={`${styles.choiceCard} ${
            form.dealType === "rent" ? styles.selected : ""
          }`}
          onClick={() =>
            updateForm({
              dealType: "rent",
            })
          }
        >
          <strong>Сдам в аренду</strong>
          <span>Разместить объект в аренду</span>
        </button>
      </div>

      {form.dealType === "rent" && (
        <div className={styles.field}>
          <label>Период аренды</label>

          <div className={styles.periodGrid}>
            {[
              ["monthly", "Помесячно"],
              ["daily", "Посуточно"],
              ["longTerm", "Долгосрочно"],
              ["shortTerm", "Краткосрочно"],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={`${styles.smallChoice} ${
                  form.rentalPeriod === value ? styles.selected : ""
                }`}
                onClick={() =>
                  updateForm({
                    rentalPeriod: value,
                  })
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

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
          Продолжить
        </button>
      </div>
    </div>
  );
}
