"use client";

import {
  CalendarDays,
  ExternalLink,
  Pencil,
  Trash2,
  Power,
} from "lucide-react";

import styles from "./BannerCard.module.css";

export default function BannerCard({ banner, onEdit, onDelete, onToggle }) {
  function formatDate(date) {
    if (!date) return "Бессрочно";

    return new Date(date).toLocaleDateString("ru-RU");
  }

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={banner.image}
          alt={banner.title}
          style={{
            objectPosition: banner.imagePosition || "center",
          }}
        />

        <div className={styles.status}>
          <span
            className={banner.active ? styles.activeDot : styles.inactiveDot}
          />

          {banner.active ? "Активен" : "Отключён"}
        </div>

        <div className={styles.imageActions}>
          <button
            type="button"
            onClick={() => onEdit(banner)}
            title="Редактировать"
          >
            <Pencil />
          </button>

          <button
            type="button"
            onClick={() => onDelete(banner.id)}
            title="Удалить"
          >
            <Trash2 />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3>{banner.title}</h3>

          <button
            type="button"
            className={
              banner.active ? styles.powerActive : styles.powerInactive
            }
            onClick={() => onToggle(banner.id)}
            title={banner.active ? "Отключить" : "Включить"}
          >
            <Power />
          </button>
        </div>

        <div className={styles.info}>
          <div>
            <CalendarDays />

            <span>
              {formatDate(banner.startDate)}
              {" — "}
              {formatDate(banner.endDate)}
            </span>
          </div>

          {banner.link && (
            <a href={banner.link} target="_blank" rel="noreferrer">
              <ExternalLink />

              <span>Открыть ссылку</span>
            </a>
          )}
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={() => onEdit(banner)}>
            <Pencil />
            Редактировать
          </button>

          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => onDelete(banner.id)}
          >
            <Trash2 />
            Удалить
          </button>
        </div>
      </div>
    </article>
  );
}
