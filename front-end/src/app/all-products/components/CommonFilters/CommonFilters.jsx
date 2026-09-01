"use client";

import {
  MapPin,
  DoorOpen,
  DollarSign,
  Ruler,
  Waves,
  FileText,
} from "lucide-react";


import styles from "./CommonFilters.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

const cityOptions = ["Все", "Бишкек", "Ош", "Иссык-Куль", "Турция"];

const roomsOptions = ["Все", "1", "2", "3", "4+"];

const currencyOptions = ["USD", "KGS", "EUR"];

/* =========================================================
   ISSYK-KUL DETECTOR
========================================================= */

function isIssykKul(filters) {
  const city = String(filters?.city || "")
    .trim()
    .toLowerCase();

  const region = String(filters?.region || "")
    .trim()
    .toLowerCase();

  const country = String(filters?.country || "")
    .trim()
    .toLowerCase();

  /* ---------------------------------------------
     REGION
  --------------------------------------------- */

  if (
    region === "issyk_kul" ||
    region === "issyk-kul" ||
    region === "issyk kul" ||
    (region.includes("иссык") && region.includes("куль"))
  ) {
    return true;
  }

  /* ---------------------------------------------
     CITY = ИССЫК-КУЛЬ
  --------------------------------------------- */

  if (city.includes("иссык") && city.includes("куль")) {
    return true;
  }

  /* ---------------------------------------------
     CITIES AROUND ISSYK-KUL
  --------------------------------------------- */

  const issykKulCities = [
    "каракол",
    "чолпон-ата",
    "чолпоната",
    "бостери",
    "тамчы",
    "чон-сары-ой",
    "чон сары ой",
    "сары-ой",
    "сары ой",
    "боконбаево",
    "барскоон",
    "тамга",
    "каджи-сай",
    "каджисай",
    "тосор",
    "ананьево",
    "пристань-пржевальск",
    "рыбачье",
    "балыкчы",
    "иссык-куль",
  ];

  if (issykKulCities.some((name) => city.includes(name))) {
    return true;
  }

  /* ---------------------------------------------
     COUNTRY НЕ НУЖЕН ДЛЯ ОПРЕДЕЛЕНИЯ
  --------------------------------------------- */

  return false;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CommonFilters({ filters, updateFilter }) {
  /*
   * Определяем непосредственно здесь.
   *
   * Поэтому:
   *
   * city = "Иссык-Куль"
   * → true
   *
   * region = "ISSYK_KUL"
   * → true
   *
   * city = "Каракол"
   * → true
   *
   * city = "Бишкек"
   * → false
   */

  const showBeachDistance = isIssykKul(filters);

  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {/* =================================================
            CITY / REGION
        ================================================= */}

        <CustomSelect
          icon={MapPin}
          title="Город / регион"
          options={cityOptions}
          value={filters.city || "Все"}
          setValue={(value) => {
            updateFilter("city", value);

            /*
             * Иссык-Куль:
             * принудительно выставляем регион.
             */
            if (value === "Иссык-Куль") {
              updateFilter("region", "ISSYK_KUL");
            } else {
              /*
               * Для остальных городов убираем
               * автоматически установленный регион.
               */
              updateFilter("region", "");
            }
          }}
        />

        {/* =================================================
            CURRENCY
        ================================================= */}

        <CustomSelect
          icon={FileText}
          title="Валюта"
          options={currencyOptions}
          value={filters.currency || "USD"}
          setValue={(value) => updateFilter("currency", value)}
        />

        {/* =================================================
            PRICE
        ================================================= */}

        <div className={styles.range}>
          <div className={styles.rangeTitle}>
            <DollarSign size={17} />
            <span>Цена</span>
          </div>

          <div className={styles.inputs}>
            <input
              type="number"
              min="0"
              placeholder="От"
              value={filters.priceFrom || ""}
              onChange={(event) =>
                updateFilter("priceFrom", event.target.value)
              }
            />

            <input
              type="number"
              min="0"
              placeholder="До"
              value={filters.priceTo || ""}
              onChange={(event) => updateFilter("priceTo", event.target.value)}
            />
          </div>
        </div>

        {/* =================================================
            AREA
        ================================================= */}

        <div className={styles.range}>
          <div className={styles.rangeTitle}>
            <Ruler size={17} />
            <span>Площадь, м²</span>
          </div>

          <div className={styles.inputs}>
            <input
              type="number"
              min="0"
              placeholder="От"
              value={filters.areaFrom || ""}
              onChange={(event) => updateFilter("areaFrom", event.target.value)}
            />

            <input
              type="number"
              min="0"
              placeholder="До"
              value={filters.areaTo || ""}
              onChange={(event) => updateFilter("areaTo", event.target.value)}
            />
          </div>
        </div>

        {/* =================================================
            ROOMS
        ================================================= */}

        {["apartment", "house", "cottage", "room"].includes(
          filters.propertyType,
        ) && (
          <CustomSelect
            icon={DoorOpen}
            title="Комнаты"
            options={roomsOptions}
            value={filters.rooms || "Все"}
            setValue={(value) => updateFilter("rooms", value)}
          />
        )}

        {/* =================================================
            BEACH DISTANCE
        ================================================= */}

        {showBeachDistance && (
          <div className={styles.range}>
            <div className={styles.rangeTitle}>
              <Waves size={17} />
              <span>До пляжа, м</span>
            </div>

            <div className={styles.inputs}>
              <input
                type="number"
                min="0"
                placeholder="От"
                value={filters.beachDistanceFrom || ""}
                onChange={(event) =>
                  updateFilter("beachDistanceFrom", event.target.value)
                }
              />

              <input
                type="number"
                min="0"
                placeholder="До"
                value={filters.beachDistanceTo || ""}
                onChange={(event) =>
                  updateFilter("beachDistanceTo", event.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
