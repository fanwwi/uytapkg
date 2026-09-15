"use client";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./LanguageSwitcher.module.css";

const LANGUAGES = [
  {
    code: "ru",
    label: "RU",
  },
  {
    code: "ky",
    label: "KG",
  },
];

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className={styles.switcher} role="group" aria-label="Выбор языка">
      <div
        className={`${styles.slider} ${
          language === "ky" ? styles.sliderKy : ""
        }`}
      />

      {LANGUAGES.map((item) => (
        <button
          key={item.code}
          type="button"
          className={`${styles.option} ${
            language === item.code ? styles.active : ""
          }`}
          onClick={() => changeLanguage(item.code)}
          aria-pressed={language === item.code}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
