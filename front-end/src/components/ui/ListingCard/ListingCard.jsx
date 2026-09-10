"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Heart,
  Crown,
  Zap,
  Check,
} from "lucide-react";

import styles from "./ListingCard.module.css";

export default function ListingCard({
  item,
  isFavorite,
  onFavoriteClick,

  // COMPARE
  compareMode = false,
  isSelected = false,
  compareDisabled = false,
  onCompareToggle,
}) {
  const router = useRouter();

  const isVip = item?.status === "vip";
  const isUrgent = item?.status === "urgent";

  function openListing() {
    router.push(`/all-products/${item.id}`);
  }

  function handleCompareClick(event) {
    event.stopPropagation();

    if (compareDisabled) return;

    onCompareToggle?.(item);
  }

  return (
    <article
      className={`${styles.card} ${
        compareMode && isSelected ? styles.cardSelected : ""
      }`}
      onClick={openListing}
    >
      {/* IMAGE */}

      <div className={styles.image}>
        <Image
          src={item.image}
          fill
          alt={item.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        />

        {/* COMPARE SELECT */}

        {compareMode && (
          <button
            type="button"
            className={`${styles.compareSelect} ${
              isSelected ? styles.compareSelectActive : ""
            } ${compareDisabled ? styles.compareSelectDisabled : ""}`}
            onClick={handleCompareClick}
            disabled={compareDisabled}
            aria-label={
              isSelected
                ? "Убрать объект из сравнения"
                : "Добавить объект к сравнению"
            }
            aria-pressed={isSelected}
          >
            <span
              className={`${styles.compareCheckbox} ${
                isSelected ? styles.compareCheckboxActive : ""
              }`}
            >
              {isSelected && <Check />}
            </span>

            <span className={styles.compareSelectText}>
              {isSelected
                ? "Выбрано"
                : compareDisabled
                  ? "Другой тип"
                  : "Сравнить"}
            </span>
          </button>
        )}

        {/* BADGES */}

        <div className={styles.badges}>
          {isVip && (
            <span className={`${styles.status} ${styles.vip}`}>
              <Crown />
              VIP
            </span>
          )}

          {isUrgent && (
            <span className={`${styles.status} ${styles.urgent}`}>
              <Zap />
              Срочно
            </span>
          )}

          <span className={styles.type}>{item.type}</span>
        </div>

        {/* FAVORITE */}

        <button
          type="button"
          className={styles.favorite}
          aria-label={
            isFavorite ? "Удалить из избранного" : "Добавить в избранное"
          }
          onClick={(event) => {
            event.stopPropagation();

            if (onFavoriteClick) {
              onFavoriteClick(item);
            }
          }}
        >
          <Heart fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* CONTENT */}

      <div className={styles.content}>
        <h2>{item.title}</h2>

        <div className={styles.location}>
          <MapPin />

          <span>{item.location}</span>
        </div>

        <div className={styles.details}>
          {item.rooms && (
            <span>
              {item.rooms} {item.rooms === 1 ? "комната" : "комнат"}
            </span>
          )}

          {item.area && <span>{item.area}</span>}
        </div>

        {/* BOTTOM */}

        <div className={styles.bottom}>
          <strong>{item.price}</strong>

          <button
            type="button"
            className={styles.more}
            onClick={(event) => {
              event.stopPropagation();
              openListing();
            }}
          >
            Подробнее
          </button>
        </div>
      </div>
    </article>
  );
}
