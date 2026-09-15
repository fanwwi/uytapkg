"use client";

import { SlidersHorizontal, Sparkles } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./SearchModeSlider.module.css";

export default function SearchModeSlider({ value, onChange }) {
  const { t } = useLanguage();

  const isSmart = value === "smart";

  return (
    <div className={styles.wrapper}>
      <div className={styles.slider}>
        <div
          className={`${styles.thumb} ${isSmart ? styles.thumbSmart : ""}`}
        />

        <button
          type="button"
          className={`${styles.option} ${!isSmart ? styles.active : ""}`}
          onClick={() => onChange("filters")}
          aria-pressed={!isSmart}
        >
          <span className={styles.icon}>
            <SlidersHorizontal size={16} />
          </span>

          <span className={styles.text}>
            <strong>{t("searchModeSlider.filters.title")}</strong>
            <small>{t("searchModeSlider.filters.description")}</small>
          </span>
        </button>

        <button
          type="button"
          className={`${styles.option} ${isSmart ? styles.active : ""}`}
          onClick={() => onChange("smart")}
          aria-pressed={isSmart}
        >
          <span className={styles.icon}>
            <Sparkles size={16} />
          </span>

          <span className={styles.text}>
            <strong>{t("searchModeSlider.smart.title")}</strong>
            <small>{t("searchModeSlider.smart.description")}</small>
          </span>
        </button>
      </div>
    </div>
  );
}
