"use client";

import {
  Home,
  Castle,
  Hotel,
  Trees,
  Building2,
  AlertCircle,
  Crown,
} from "lucide-react";

import styles from "./Categories.module.css";

const categories = [
  {
    id: "house",
    title: "Дом / дача",
    icon: Home,
  },

  {
    id: "cottage",
    title: "Коттедж",
    icon: Castle,
  },

  {
    id: "guest",
    title: "Гостевой дом",
    icon: Hotel,
  },

  {
    id: "land",
    title: "Участок",
    icon: Trees,
  },

  {
    id: "commercial",
    title: "Коммерция",
    icon: Building2,
  },
];

export default function Categories({
  category,
  setCategory,

  urgent,
  setUrgent,

  vip,
  setVip,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.items}>
        {categories.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={category === item.id ? styles.active : ""}
              onClick={() => setCategory(item.id)}
            >
              <Icon />

              {item.title}
            </button>
          );
        })}
      </div>

      <div className={styles.badges}>
        <button
          className={urgent ? styles.activeBadge : ""}
          onClick={() => setUrgent(!urgent)}
        >
          <AlertCircle />
          Срочно
        </button>

        <button
          className={vip ? styles.vipActive : ""}
          onClick={() => setVip(!vip)}
        >
          <Crown />
          VIP
        </button>
      </div>
    </div>
  );
}
