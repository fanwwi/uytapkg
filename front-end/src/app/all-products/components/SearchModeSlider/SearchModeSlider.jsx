"use client";

import { SlidersHorizontal, Sparkles } from "lucide-react";
import styles from "./SearchModeSlider.module.css";

export default function SearchModeSlider({ value, onChange }) {
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
            <strong>Фильтры</strong>
            <small>Настроить вручную</small>
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
            <strong>Умный поиск</strong>
            <small>Опишите, что ищете</small>
          </span>
        </button>
      </div>
    </div>
  );
}
