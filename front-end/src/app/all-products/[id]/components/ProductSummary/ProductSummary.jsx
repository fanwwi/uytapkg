"use client";

import {
  MapPin,
  CalendarDays,
  Ruler,
  LandPlot,
  Layers3,
  BedDouble,
  Building2,
  Waves,
} from "lucide-react";

import styles from "./ProductSummary.module.css";

const ROOM_TYPES = ["квартира", "дом", "коттедж", "комната"];

function normalizeType(value) {
  if (!value) return "";

  return String(value).trim().toLowerCase().replace(/ё/g, "е");
}

function getRawValue(product, ...keys) {
  for (const key of keys) {
    const rawValue = product?.rawFeatures?.[key];

    if (rawValue !== undefined && rawValue !== null && rawValue !== "") {
      return rawValue;
    }

    const productValue = product?.[key];

    if (
      productValue !== undefined &&
      productValue !== null &&
      productValue !== ""
    ) {
      return productValue;
    }
  }

  return null;
}

function canShowRooms(product) {
  const type = normalizeType(getRawValue(product, "type", "category"));

  return ROOM_TYPES.some((allowedType) => type.includes(allowedType));
}

function isLand(product) {
  const type = normalizeType(getRawValue(product, "type", "category"));

  return type.includes("участ");
}

function formatArea(value, land = false) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const stringValue = String(value).trim();

  if (
    stringValue.includes("м²") ||
    stringValue.includes("м2") ||
    stringValue.includes("сот")
  ) {
    return stringValue;
  }

  return land ? `${stringValue} сот.` : `${stringValue} м²`;
}

function formatSeries(value) {
  if (!value) return null;

  const normalized = String(value).trim().toLowerCase().replace(/ё/g, "е");

  const labels = {
    "106_normal": "106 обычная",
    "106_improved": "106 улучшенная",
    "107_normal": "107 обычная",
    "107_improved": "107 улучшенная",
    new_building: "Новостройка",
    newbuilding: "Новостройка",
    elite: "Элитка",
    eliteka: "Элитка",
    individual: "Индивидуалка",
    individualka: "Индивидуалка",
  };

  return (
    labels[normalized] ||
    labels[normalized.replace(/\s+/g, "_")] ||
    String(value).trim()
  );
}

export default function ProductSummary({ product }) {
  const locationParts = [product.country, product.city].filter(
    (value) =>
      value !== null && value !== undefined && String(value).trim() !== "",
  );

  const area = getRawValue(product, "area");

  const landArea = getRawValue(product, "landArea", "areaSotka", "plotArea");

  const floor = getRawValue(product, "floor", "currentFloor");

  const floors = getRawValue(product, "floors", "totalFloors");

  const rooms = getRawValue(product, "rooms");

  const series = getRawValue(
    product,
    "series",
    "apartmentSeries",
    "apartment_series",
  );

  const beachDistance = getRawValue(product, "beachDistance");

  const quickInfo = [];

  if (
    canShowRooms(product) &&
    rooms !== null &&
    rooms !== undefined &&
    Number(rooms) > 0
  ) {
    quickInfo.push({
      icon: BedDouble,
      value: rooms,
      label: "комнат",
    });
  }

  if (area) {
    quickInfo.push({
      icon: Ruler,
      value: formatArea(area, isLand(product)),
      label: "",
    });
  }

  if (landArea) {
    quickInfo.push({
      icon: LandPlot,
      value: formatArea(landArea, true),
      label: "участок",
    });
  }

  if (floor) {
    quickInfo.push({
      icon: Layers3,
      value: floors ? `${floor} / ${floors}` : floor,
      label: floors ? "этаж" : "",
    });
  }

  if (normalizeType(product.type).includes("квартир")) {
    const formattedSeries = formatSeries(series);

    if (formattedSeries) {
      quickInfo.push({
        icon: Building2,
        value: formattedSeries,
        label: "",
      });
    }
  }

  if (beachDistance) {
    quickInfo.push({
      icon: Waves,
      value: `${beachDistance} м`,
      label: "до пляжа",
    });
  }

  return (
    <div className={styles.summary}>
      <div className={styles.summaryTop}>
        <div className={styles.summaryLabels}>
          {product.dealType && (
            <span className={styles.deal}>{product.dealType}</span>
          )}

          {product.listingType && (
            <span className={styles.listingType}>{product.listingType}</span>
          )}
        </div>
      </div>

      <h1>{product.title || "Объект недвижимости"}</h1>

      <div className={styles.location}>
        <MapPin size={20} />

        <div>
          {locationParts.length > 0 ? (
            <strong>{locationParts.join(", ")}</strong>
          ) : (
            <strong>Местоположение не указано</strong>
          )}

          {product.address && <span>{product.address}</span>}
        </div>
      </div>

      {product.price && <div className={styles.price}>{product.price}</div>}

      {product.rentalPeriod && (
        <div className={styles.rentalInfo}>
          <CalendarDays size={16} />

          <span>
            Период аренды: <strong>{product.rentalPeriod}</strong>
          </span>
        </div>
      )}

      {quickInfo.length > 0 && (
        <div
          className={`${styles.quickInfo} ${
            quickInfo.length === 1 ? styles.quickInfoOne : ""
          }`}
        >
          {quickInfo.slice(0, 5).map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={`${item.value}-${index}`}>
                <Icon />

                <span>
                  <b>{item.value}</b>

                  {item.label && <small>{item.label}</small>}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
