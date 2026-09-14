"use client";

import {
  X,
  MapPin,
  Ruler,
  BedDouble,
  Building2,
  CalendarDays,
  Layers3,
  Check,
  Minus,
  GitCompare,
} from "lucide-react";

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
                    <span className={styles.betterLabel}>Лучше</span>
                  )}
                </>
              ) : (
                <span className={styles.missing}>
                  <Minus size={14} />
                  Не указано
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
              <h2>Сравнение объектов</h2>

              <p>
                Сравнение {items.length} объектов типа{" "}
                <strong>{items[0].type}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
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
          <div className={styles.sectionTitle}>Основные характеристики</div>

          <ComparisonRow
            icon={Ruler}
            label="Площадь"
            values={items.map((item) => item.rawArea)}
            type="area"
            unit=" м²"
          />

          <ComparisonRow
            icon={BedDouble}
            label="Комнаты"
            values={items.map((item) => item.rooms)}
            type="rooms"
          />

          <ComparisonRow
            icon={Layers3}
            label="Этаж / этажность"
            values={items.map((item) =>
              item.floors ? `${item.floors}` : null,
            )}
          />

          <ComparisonRow
            icon={Building2}
            label="Тип сделки"
            values={items.map((item) => item.dealType)}
          />

          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <MapPin size={16} />

              <span>Локация</span>
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
                Удобства и характеристики
              </div>

              {[...featureMap.entries()].map(([key, values]) => {
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
                              Нет
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

          {/* MISSING FEATURES */}

          <div className={styles.insight}>
            <div className={styles.insightIcon}>
              <GitCompare size={17} />
            </div>

            <div>
              <strong>На что обратить внимание</strong>

              <p>
                Значения, отмеченные как «Лучше», являются ориентиром по
                числовым характеристикам. Более низкая цена и большая площадь
                обычно выгоднее, но итоговый выбор зависит от ваших приоритетов.
              </p>
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
            Закрыть
          </button>
        </footer>
      </div>
    </div>
  );
}
