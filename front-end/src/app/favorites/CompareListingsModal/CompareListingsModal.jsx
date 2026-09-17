"use client";

import {
  X,
  MapPin,
  Ruler,
  BedDouble,
  Building2,
  Layers3,
  Check,
  Minus,
  GitCompare,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./CompareListingsModal.module.css";

function normalizeValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return value;
}

function formatFeatureValue(value) {
  if (typeof value === "boolean") {
    return value ? "Есть" : "Нет";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return Object.values(value).join(", ");
  }

  return String(value);
}

// Служебные поля из listings.features — они пишутся туда для внутренней
// логики (см. back-end/src/services/promotionsService.js
// grantPromotion/resolvePromotionExpiry и привязку ЖК в
// listingsController.js), а не для показа пользователю. Без этого
// фильтра, например, "promotionExpiresAt" превращалось бы в строку
// сравнения "Promotion Expires At" с сырым ISO-временем.
const TECHNICAL_FEATURE_KEY_PATTERN =
  /id$|createdat|updatedat|deletedat|expiresat|verificationstatus|verificationdocs|rejectionreason/i;

function getFeatures(item) {
  const features = item?.rawFeatures || {};

  return Object.entries(features)
    .filter(([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === false
      ) {
        return false;
      }

      if (TECHNICAL_FEATURE_KEY_PATTERN.test(key.toLowerCase())) {
        return false;
      }

      return true;
    })
    .map(([key, value]) => ({
      key,
      value: formatFeatureValue(value),
    }));
}

function getBetterValue(values, type) {
  const numericValues = values.map((value) => {
    if (typeof value === "number") return value;

    const parsed = Number(
      String(value || "")
        .replace(/\s/g, "")
        .replace(",", ".")
        .replace(/[^\d.]/g, ""),
    );

    return Number.isFinite(parsed) ? parsed : null;
  });

  if (numericValues.some((value) => value === null)) {
    return [];
  }

  if (type === "price") {
    const min = Math.min(...numericValues);

    return numericValues.map((value) => value === min);
  }

  if (type === "area" || type === "rooms" || type === "year") {
    const max = Math.max(...numericValues);

    return numericValues.map((value) => value === max);
  }

  return [];
}

function ComparisonRow({ icon: Icon, label, values, type, unit = "" }) {
  const { t } = useLanguage();

  const better = getBetterValue(values, type);

  return (
    <div className={styles.row}>
      <div className={styles.rowLabel}>
        <Icon size={16} />

        <span>{label}</span>
      </div>

      <div className={styles.rowValues}>
        {values.map((value, index) => {
          const normalized = normalizeValue(value);

          return (
            <div
              key={index}
              className={`${styles.value} ${
                better[index] ? styles.valueBetter : ""
              }`}
            >
              {normalized !== null ? (
                <>
                  <strong>
                    {normalized}
                    {unit}
                  </strong>

                  {better[index] && (
                    <span className={styles.betterLabel}>
                      {t("compareListings.better")}
                    </span>
                  )}
                </>
              ) : (
                <span className={styles.missing}>
                  <Minus size={14} />

                  {t("compareListings.notSpecified")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CompareListingsModal({ isOpen, items = [], onClose }) {
  const { t } = useLanguage();

  if (!isOpen || items.length === 0) {
    return null;
  }

  const featureMap = new Map();

  items.forEach((item) => {
    getFeatures(item).forEach(({ key, value }) => {
      if (!featureMap.has(key)) {
        featureMap.set(key, []);
      }

      featureMap.get(key).push(value);
    });
  });

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.modal}>
        {/* HEADER */}

        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <div className={styles.headerIcon}>
              <GitCompare size={19} />
            </div>

            <div>
              <h2>{t("compareListings.title")}</h2>

              <p>
                {t("compareListings.comparison")} {items.length}{" "}
                {t("compareListings.objectsOfType")}{" "}
                <strong>{items[0].type}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={t("compareListings.close")}
          >
            <X size={19} />
          </button>
        </header>

        {/* OBJECTS */}

        <div className={styles.objects}>
          {items.map((item) => (
            <div className={styles.object} key={item.id}>
              <div className={styles.objectImage}>
                <img src={item.image} alt={item.title} />
              </div>

              <div className={styles.objectContent}>
                <span className={styles.objectType}>{item.type}</span>

                <h3>{item.title}</h3>

                <div className={styles.objectLocation}>
                  <MapPin size={13} />

                  <span>{item.location}</span>
                </div>

                <strong className={styles.objectPrice}>{item.price}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* COMPARISON */}

        <div className={styles.comparison}>
          <div className={styles.sectionTitle}>
            {t("compareListings.mainCharacteristics")}
          </div>

          <ComparisonRow
            icon={Ruler}
            label={t("compareListings.area")}
            values={items.map((item) => item.rawArea)}
            type="area"
            unit=" м²"
          />

          <ComparisonRow
            icon={BedDouble}
            label={t("compareListings.rooms")}
            values={items.map((item) => item.rooms)}
            type="rooms"
          />

          <ComparisonRow
            icon={Layers3}
            label={t("compareListings.floor")}
            values={items.map((item) =>
              item.floors ? `${item.floors}` : null,
            )}
          />

          <ComparisonRow
            icon={Building2}
            label={t("compareListings.dealType")}
            values={items.map((item) => item.dealType)}
          />

          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <MapPin size={16} />

              <span>{t("compareListings.location")}</span>
            </div>

            <div className={styles.rowValues}>
              {items.map((item) => (
                <div className={styles.value} key={item.id}>
                  <strong>{item.location || "—"}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURES */}

          {featureMap.size > 0 && (
            <>
              <div className={styles.sectionTitle}>
                {t("compareListings.features")}
              </div>

              {[...featureMap.entries()].map(([key]) => {
                const valuesByItem = items.map((item) => {
                  const feature = getFeatures(item).find(
                    (itemFeature) => itemFeature.key === key,
                  );

                  return feature?.value || null;
                });

                const displayName = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (char) => char.toUpperCase())
                  .replace(/_/g, " ");

                return (
                  <div className={styles.row} key={key}>
                    <div className={styles.rowLabel}>
                      <span>{displayName}</span>
                    </div>

                    <div className={styles.rowValues}>
                      {valuesByItem.map((value, index) => (
                        <div className={styles.value} key={index}>
                          {value ? (
                            <span className={styles.featurePresent}>
                              <Check size={14} />

                              {value}
                            </span>
                          ) : (
                            <span className={styles.featureMissing}>
                              <Minus size={14} />

                              {t("compareListings.no")}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* INSIGHT */}

          <div className={styles.insight}>
            <div className={styles.insightIcon}>
              <GitCompare size={17} />
            </div>

            <div>
              <strong>{t("compareListings.insightTitle")}</strong>

              <p>{t("compareListings.insightText")}</p>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            {t("compareListings.close")}
          </button>
        </footer>
      </div>
    </div>
  );
}
