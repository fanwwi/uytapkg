"use client";

import { Search, Sparkles } from "lucide-react";

import styles from "./SearchMode.module.css";

export default function SearchMode({ mode, setMode }) {
  return (
    <div className={styles.wrapper}>
      <div
        className={`
          ${styles.slider}
          ${mode === "smart" ? styles.smart : ""}
        `}
      />

      <button
        className={mode === "normal" ? styles.active : ""}
        onClick={() => setMode("normal")}
      >
        <Search />
        Обычный поиск
      </button>

      <button
        className={mode === "smart" ? styles.active : ""}
        onClick={() => setMode("smart")}
      >
        <Sparkles />
        Умный поиск
      </button>
    </div>
  );
}
