"use client";

import { useState } from "react";

import { Sparkles, Search, Mic, SlidersHorizontal } from "lucide-react";

import styles from "./SmartSearch.module.css";

export default function SmartSearch() {
  const [query, setQuery] = useState("");

  const examples = [
    "Дом возле пляжа с бассейном до 150000$",
    "Коттедж в Бостери на лето с баней",
    "Гостевой дом для бизнеса возле озера",
    "Участок под строительство рядом с водой",
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Sparkles />

        <div>
          <h3>Умный поиск AI</h3>

          <p>Опишите, какую недвижимость вы хотите найти</p>
        </div>
      </div>

      <div className={styles.searchBox}>
        <Search className={styles.searchIcon} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="
          Например: хочу коттедж у Иссык-Куля с бассейном и видом на горы
          "
        />

        <button className={styles.voice}>
          <Mic />
        </button>
      </div>

      <div className={styles.examples}>
        <div className={styles.exampleTitle}>
          <SlidersHorizontal />
          Примеры запросов
        </div>

        <div className={styles.tags}>
          {examples.map((item) => (
            <button key={item} onClick={() => setQuery(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <button className={styles.aiButton}>
        <Sparkles />
        Найти с AI
      </button>
    </div>
  );
}
