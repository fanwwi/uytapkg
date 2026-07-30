"use client";

import { Home, KeyRound } from "lucide-react";

import styles from "./DealSwitcher.module.css";

export default function DealSwitcher({ deal, setDeal }) {
  return (
    <div className={styles.wrapper}>
      <div
        className={`
          ${styles.slider}
          ${deal === "rent" ? styles.rent : ""}
        `}
      />

      <button
        className={deal === "buy" ? styles.active : ""}
        onClick={() => setDeal("buy")}
      >
        <Home />
        Купить
      </button>

      <button
        className={deal === "rent" ? styles.active : ""}
        onClick={() => setDeal("rent")}
      >
        <KeyRound />
        Снять
      </button>
    </div>
  );
}
