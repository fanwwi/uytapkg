"use client";

import { Search, Map, RotateCcw } from "lucide-react";

import styles from "./SearchActions.module.css";

export default function SearchActions({ onReset, onSearch, onMap }) {
  return (
    <div className={styles.actions}>
      <button className={styles.search} onClick={onSearch}>
        <Search />
        Найти
      </button>

      <button className={styles.map} onClick={onMap}>
        <Map />
        На карте
      </button>

      <button className={styles.reset} onClick={onReset}>
        <RotateCcw />
        Сбросить
      </button>
    </div>
  );
}
