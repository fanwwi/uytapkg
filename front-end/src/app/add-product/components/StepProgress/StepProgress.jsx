"use client";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./StepProgress.module.css";

export default function StepProgress({ currentStep, totalSteps }) {
  const { t } = useLanguage();

  const steps = [
    t("stepProgress.images"),
    t("stepProgress.location"),
    t("stepProgress.deal"),
    t("stepProgress.parameters"),
    t("stepProgress.address"),
    t("stepProgress.publication"),
  ];

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
