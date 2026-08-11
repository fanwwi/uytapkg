"use client";

import styles from "./steps.module.css";

export default function StepProgress({ currentStep, totalSteps }) {
  const steps = ["Локация", "Тип сделки", "Параметры", "Адрес", "Публикация"];

  return (
    <div className={styles.progress}>
      {steps.map((title, index) => {
        const number = index + 1;

        return (
          <div
            key={title}
            className={`${styles.progressItem} ${
              number <= currentStep ? styles.active : ""
            }`}
          >
            <div className={styles.progressCircle}>{number}</div>

            <span>{title}</span>
          </div>
        );
      })}
    </div>
  );
}
