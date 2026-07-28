"use client";

import { House, KeyRound } from "lucide-react";

import styles from "./DealSwitcher.module.css";

export default function DealSwitcher({ deal, setDeal }) {
  return (
    <div className={styles.wrapper}>
      <button
        className={deal === "buy" ? styles.active : ""}
        onClick={() => setDeal("buy")}
      >
        <House />
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
