"use client";

import { Building2, Home, Trees, BedDouble, Store, Car } from "lucide-react";

import styles from "./Categories.module.css";

export default function Categories({ category, setCategory }) {
  const categories = [
    {
      name: "Квартиры",
      icon: Building2,
    },
    {
      name: "Дома",
      icon: Home,
    },
    {
      name: "Участки",
      icon: Trees,
    },
    {
      name: "Комнаты",
      icon: BedDouble,
    },
    {
      name: "Коммерция",
      icon: Store,
    },
    {
      name: "Паркинг / Гараж",
      icon: Car,
    },
  ];

  return (
    <div className={styles.categories}>
      {categories.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.name}
            className={category === item.name ? styles.active : ""}
            onClick={() => setCategory(item.name)}
          >
            <Icon />

            <span>{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}
