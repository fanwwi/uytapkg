"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Heart, Crown, Zap, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t, language } = useLanguage();

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

  function getRoomsLabel(rooms) {
    if (language === "ky") {
      return rooms === 1 ? "бөлмө" : "бөлмө";
    }

    return rooms === 1 ? "комната" : "комнат";
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
                ? t("listingCard.compare.remove")
                : t("listingCard.compare.add")
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
                ? t("listingCard.compare.selected")
                : compareDisabled
                  ? t("listingCard.compare.otherType")
                  : t("listingCard.compare.button")}
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
              {t("listingCard.badges.urgent")}
            </span>
          )}

          <span className={styles.type}>{item.type}</span>
        </div>

        {/* FAVORITE */}

        <button
          type="button"
          className={styles.favorite}
          aria-label={
            isFavorite
              ? t("listingCard.favorite.remove")
              : t("listingCard.favorite.add")
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
              {item.rooms} {getRoomsLabel(item.rooms)}
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
            {t("listingCard.details")}
          </button>
        </div>
      </div>
    </article>
  );
}
