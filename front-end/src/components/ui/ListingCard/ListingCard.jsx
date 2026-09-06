"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Heart, Crown, Zap } from "lucide-react";

import styles from "./ListingCard.module.css";

export default function ListingCard({ item, isFavorite, onFavoriteClick }) {
  const router = useRouter();

  const isVip = item?.status === "vip";
  const isUrgent = item?.status === "urgent";

  function openListing() {
    router.push(`/all-products/${item.id}`);
  }

  return (
    <article className={styles.card} onClick={openListing}>
      {/* IMAGE */}

      <div className={styles.image}>
        <Image
          src={item.image}
          fill
          alt={item.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        />

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
