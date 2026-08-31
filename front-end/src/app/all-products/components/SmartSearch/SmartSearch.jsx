"use client";

import {
  Mic,
  MicOff,
  Sparkles,
  RotateCcw,
  Search,
  Loader2,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import styles from "./SmartSearch.module.css";

const SAFE_MAX_TEXT_LENGTH = 2000;

/* =========================================================
   NORMALIZATION HELPERS
========================================================= */

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ");
}

function cleanValue(value) {
  if (value === undefined || value === null) return "";

  return String(value).trim().replace(/\s+/g, " ");
}

/* =========================================================
   PROPERTY TYPES
========================================================= */

const PROPERTY_TYPES = {
  apartment: "apartment",
  apartments: "apartment",
  flat: "apartment",

  квартира: "apartment",
  квартиры: "apartment",
  квартир: "apartment",

  house: "house",
  дома: "house",
  дом: "house",

  cottage: "cottage",
  коттедж: "cottage",
  коттеджи: "cottage",

  land: "land",
  участок: "land",
  участки: "land",
  земля: "land",

  room: "room",
  комната: "room",
  комнаты: "room",

  commercial: "commercial",
  коммерция: "commercial",
  коммерческая: "commercial",

  parking: "parking",
  паркинг: "parking",
  гараж: "parking",
  гаражи: "parking",
};

/* =========================================================
   DEAL TYPES
========================================================= */

const DEAL_TYPES = {
  sale: "sale",
  sell: "sale",
  продажа: "sale",
  продам: "sale",
  купить: "sale",
  покупка: "sale",

  rent: "rent",
  аренда: "rent",
  арендовать: "rent",
  снять: "rent",
  сниму: "rent",
  "сниму в аренду": "rent",
};

/* =========================================================
   REGIONS
========================================================= */

const REGION_TYPES = {
  bishkek: "BISHKEK",
  бишкек: "BISHKEK",

  osh: "OSH",
  ош: "OSH",
  "ошская область": "OSH",

  "issyk-kul": "ISSYK_KUL",
  "issyk kul": "ISSYK_KUL",
  "issyk-kul region": "ISSYK_KUL",
  "issyk kul region": "ISSYK_KUL",

  "иссык-куль": "ISSYK_KUL",
  "иссык куль": "ISSYK_KUL",
  "иссык-кульская область": "ISSYK_KUL",
  "иссык кульская область": "ISSYK_KUL",

  chu: "CHUY",
  "чуйская область": "CHUY",
  чуй: "CHUY",

  "jalal-abad": "JALAL_ABAD",
  "жалал-абад": "JALAL_ABAD",
  "джалал-абад": "JALAL_ABAD",
  "джалал-абадская область": "JALAL_ABAD",
  "джалал абадская область": "JALAL_ABAD",

  batken: "BATKEN",
  баткен: "BATKEN",
  "баткенская область": "BATKEN",

  naryn: "NARYN",
  нарын: "NARYN",
  "нарынская область": "NARYN",

  talas: "TALAS",
  талас: "TALAS",
  "таласская область": "TALAS",

  turkey: "TURKEY",
  турция: "TURKEY",
  турцию: "TURKEY",
  турции: "TURKEY",
};

/* =========================================================
   ISSYK-KUL CITIES
========================================================= */

const ISSYK_KUL_CITIES = [
  "каракол",
  "чолпон-ата",
  "чолпоната",
  "бостери",
  "тамчы",
  "тамчи",
  "чон-сары-ой",
  "чон сары ой",
  "сары-ой",
  "сары ой",
  "боконбаево",
  "барскоон",
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

/* =========================================================
   REGION DETECTION FROM RAW TEXT
========================================================= */

function detectRegionFromText(value) {
  const text = normalizeText(value);

  if (!text) return "";

  if (
    text.includes("иссык-куль") ||
    text.includes("иссык куль") ||
    text.includes("иссыккуль")
  ) {
    return "ISSYK_KUL";
  }

  for (const city of ISSYK_KUL_CITIES) {
    if (text.includes(city)) {
      return "ISSYK_KUL";
    }
  }

  if (text.includes("бишкек")) {
    return "BISHKEK";
  }

  if (text.includes("ош")) {
    return "OSH";
  }

  if (
    text.includes("турци") ||
    text.includes("турция") ||
    text.includes("анталья") ||
    text.includes("стамбул")
  ) {
    return "TURKEY";
  }

  if (text.includes("чуй")) {
    return "CHUY";
  }

  if (
    text.includes("жалал-абад") ||
    text.includes("джалал-абад") ||
    text.includes("жалал абад") ||
    text.includes("джалал абад")
  ) {
    return "JALAL_ABAD";
  }

  if (text.includes("баткен")) {
    return "BATKEN";
  }

  if (text.includes("нарын")) {
    return "NARYN";
  }

  if (text.includes("талас")) {
    return "TALAS";
  }

  return "";
}

/* =========================================================
   REGION NORMALIZATION
========================================================= */

function normalizeRegion(value) {
  const normalized = normalizeText(value);

  if (!normalized) return "";

  if (REGION_TYPES[normalized]) {
    return REGION_TYPES[normalized];
  }

  if (normalized.includes("иссык") && normalized.includes("куль")) {
    return "ISSYK_KUL";
  }

  if (normalized.includes("бишкек")) {
    return "BISHKEK";
  }

  if (normalized === "ош" || normalized.includes("ошская")) {
    return "OSH";
  }

  if (normalized.includes("тур")) {
    return "TURKEY";
  }

  if (normalized.includes("чуй")) {
    return "CHUY";
  }

  if (normalized.includes("жалал") || normalized.includes("джалал")) {
    return "JALAL_ABAD";
  }

  if (normalized.includes("баткен")) {
    return "BATKEN";
  }

  if (normalized.includes("нарын")) {
    return "NARYN";
  }

  if (normalized.includes("талас")) {
    return "TALAS";
  }

  return cleanValue(value);
}

/* =========================================================
   PRICE / AREA HELPERS
========================================================= */

function normalizeNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = String(value).replace(/\s/g, "").replace(",", ".");

  const number = Number(normalized);

  return Number.isFinite(number) ? number : null;
}

function normalizeRangeValue(value) {
  const number = normalizeNumber(value);

  if (number === null) return "";

  return String(number);
}

/* =========================================================
   ROOMS
========================================================= */

function normalizeRooms(value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const raw = normalizeText(value);

  if (
    raw.includes("4+") ||
    raw.includes("четыре") ||
    raw.includes("пять") ||
    raw.includes("шесть") ||
    raw.includes("7")
  ) {
    return "4+";
  }

  const number = Number(raw.replace(/[^\d.]/g, ""));

  if (!Number.isFinite(number)) {
    return "";
  }

  return number >= 4 ? "4+" : String(number);
}

/* =========================================================
   CATEGORY NORMALIZATION
========================================================= */

function normalizePropertyType(value) {
  const normalized = normalizeText(value);

  if (!normalized) return "";

  return PROPERTY_TYPES[normalized] || normalized;
}

function normalizeDealType(value) {
  const normalized = normalizeText(value);

  if (!normalized) return "";

  return DEAL_TYPES[normalized] || normalized;
}

/* =========================================================
   FEATURES
========================================================= */

const FEATURE_KEYS = [
  "series",
  "floor",
  "condition",
  "walls",
  "heating",
  "documents",
  "furniture",
  "offerType",

  "houseType",
  "floors",
  "sewerage",
  "water",
  "electricity",

  "purpose",
  "fence",
  "location",
  "terrain",

  "roomsInApartment",
  "privateBathroom",

  "premisesType",
  "firstLine",
  "separateEntrance",
  "rentalBusiness",

  "ceilingHeight",
  "parkingType",
  "material",
  "security",
  "gates",
  "inspectionPit",
  "basement",
  "truckAccess",
  "gateType",
];

const ARRAY_KEYS = ["amenities", "communications", "technicalParameters"];

/* =========================================================
   NORMALIZE AI RESPONSE
========================================================= */

function normalizeFilters(aiFilters, originalQuery = "") {
  const f = aiFilters && typeof aiFilters === "object" ? aiFilters : {};

  const normalized = {};

  /* -------------------------------------------------------
     PROPERTY TYPE
  ------------------------------------------------------- */

  const propertyType = normalizePropertyType(f.propertyType);

  if (propertyType) {
    normalized.propertyType = propertyType;
  }

  /* -------------------------------------------------------
     DEAL TYPE
  ------------------------------------------------------- */

  const dealType = normalizeDealType(f.dealType);

  if (dealType) {
    normalized.dealType = dealType;
  }

  /* -------------------------------------------------------
     LOCATION
  ------------------------------------------------------- */

  let region = normalizeRegion(f.region);

  /*
   * Если AI не дал region,
   * пытаемся определить его непосредственно
   * из исходного пользовательского запроса.
   */

  if (!region) {
    region = detectRegionFromText(originalQuery);
  }

  const rawCity = cleanValue(f.city);
  const normalizedCity = normalizeText(rawCity);

  const cityIsIssykKul =
    normalizedCity.includes("иссык") && normalizedCity.includes("куль");

  const cityIsIssykKulLocation = ISSYK_KUL_CITIES.some((city) =>
    normalizedCity.includes(city),
  );

  if (region === "ISSYK_KUL" || cityIsIssykKul || cityIsIssykKulLocation) {
    normalized.region = "ISSYK_KUL";
    normalized.city = "Иссык-Куль";
  } else if (region === "TURKEY") {
    normalized.country = "turkey";
    normalized.region = "TURKEY";

    normalized.city = rawCity || "Турция";
  } else if (region) {
    normalized.region = region;

    if (region === "BISHKEK") {
      normalized.city = "Бишкек";
    } else if (region === "OSH") {
      normalized.city = "Ош";
    }
  }

  /*
   * Если AI вернул конкретный город,
   * сохраняем его.
   *
   * Исключение — Иссык-Куль,
   * где регион имеет приоритет.
   */

  if (
    rawCity &&
    region !== "ISSYK_KUL" &&
    !cityIsIssykKul &&
    !cityIsIssykKulLocation
  ) {
    normalized.city = rawCity;
  }

  /* -------------------------------------------------------
     COUNTRY
  ------------------------------------------------------- */

  if (f.country) {
    const country = normalizeText(f.country);

    if (country.includes("турц") || country === "turkey") {
      normalized.country = "turkey";
    } else {
      normalized.country = cleanValue(f.country);
    }
  }

  /* -------------------------------------------------------
     DISTRICT
  ------------------------------------------------------- */

  if (f.district) {
    normalized.district = cleanValue(f.district);
  }

  /* -------------------------------------------------------
     PRICE
  ------------------------------------------------------- */

  const minPrice = normalizeNumber(f.minPrice);
  const maxPrice = normalizeNumber(f.maxPrice);

  if (minPrice !== null) {
    normalized.priceFrom = String(minPrice);
  }

  if (maxPrice !== null) {
    normalized.priceTo = String(maxPrice);
  }

  /*
   * Поддерживаем старое поле maxPrice,
   * если backend отдаёт только его.
   */

  if (normalized.priceTo === undefined && f.maxPrice !== undefined) {
    normalized.priceTo = normalizeRangeValue(f.maxPrice);
  }

  /* -------------------------------------------------------
     AREA
  ------------------------------------------------------- */

  const minArea = normalizeNumber(f.minArea);
  const maxArea = normalizeNumber(f.maxArea);

  if (minArea !== null) {
    normalized.areaFrom = String(minArea);
  }

  if (maxArea !== null) {
    normalized.areaTo = String(maxArea);
  }

  /* -------------------------------------------------------
     ROOMS
  ------------------------------------------------------- */

  const rooms = normalizeRooms(f.rooms);

  if (rooms) {
    normalized.rooms = rooms;
  }

  /* -------------------------------------------------------
     BEACH DISTANCE
  ------------------------------------------------------- */

  const beachFrom = normalizeNumber(f.beachDistanceFrom);
  const beachTo = normalizeNumber(f.beachDistanceTo);

  if (beachFrom !== null) {
    normalized.beachDistanceFrom = String(beachFrom);
  }

  if (beachTo !== null) {
    normalized.beachDistanceTo = String(beachTo);
  }

  /*
   * Если AI понял Иссык-Куль,
   * но расстояние до пляжа не было задано,
   * ничего не придумываем.
   *
   * Фильтр просто покажется пользователю,
   * потому что region = ISSYK_KUL.
   */

  /* -------------------------------------------------------
     FEATURES
  ------------------------------------------------------- */

  for (const key of FEATURE_KEYS) {
    const value = f[key];

    if (value !== undefined && value !== null && value !== "") {
      normalized[key] = value;
    }
  }

  /* -------------------------------------------------------
     ARRAYS
  ------------------------------------------------------- */

  for (const key of ARRAY_KEYS) {
    const value = f[key];

    if (value !== undefined && value !== null && value !== "") {
      normalized[key] = Array.isArray(value) ? value : [value];
    }
  }

  return normalized;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function SmartSearch({ onFiltersDetected }) {
  const recognitionRef = useRef(null);

  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [searching, setSearching] = useState(false);

  const [text, setText] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     SPEECH RECOGNITION
  ========================================================= */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "ru-RU";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let resultText = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        resultText += event.results[i][0]?.transcript || "";
      }

      const value = resultText.trim();

      if (value) {
        setText(value);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);

      setListening(false);

      if (event.error === "not-allowed") {
        setError(
          "Нет доступа к микрофону. Разрешите микрофон в настройках браузера.",
        );
        return;
      }

      if (event.error === "no-speech") {
        setError("Не удалось услышать речь. Попробуйте ещё раз.");
        return;
      }

      if (event.error === "audio-capture") {
        setError("Микрофон не найден.");
        return;
      }

      setError("Не удалось распознать голос. Попробуйте ещё раз.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }

      recognitionRef.current = null;
    };
  }, []);

  /* =========================================================
     VOICE
  ========================================================= */

  function toggleVoice() {
    if (!supported) {
      setError("Ваш браузер не поддерживает голосовой ввод.");
      return;
    }

    if (!recognitionRef.current) {
      setError("Голосовой ввод недоступен.");
      return;
    }

    if (listening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }

      setListening(false);
      return;
    }

    try {
      setError("");
      recognitionRef.current.start();
    } catch (error) {
      console.error("Speech recognition start error:", error);
    }
  }

  /* =========================================================
     SEARCH
  ========================================================= */

  async function handleSearch(searchText = text) {
    const trimmedText = String(searchText || "").trim();

    if (!trimmedText) {
      setError("Опишите, какую недвижимость вы ищете.");
      return;
    }

    if (trimmedText.length > SAFE_MAX_TEXT_LENGTH) {
      setError("Запрос слишком длинный. Сократите его до 2000 символов.");
      return;
    }

    try {
      setSearching(true);
      setError("");

      const response = await fetch("/api/smart-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: trimmedText,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Не удалось выполнить умный поиск.");
      }

      if (!data.filters || typeof data.filters !== "object") {
        throw new Error("AI не вернул параметры поиска.");
      }

      const normalized = normalizeFilters(data.filters, trimmedText);

      console.group("SMART SEARCH");
      console.log("Query:", trimmedText);
      console.log("AI response:", data.filters);
      console.log("Normalized:", normalized);
      console.groupEnd();

      setText(trimmedText);

      /*
       * Передаём родителю И исходный запрос,
       * И готовые нормализованные фильтры.
       */

      onFiltersDetected?.({
        query: trimmedText,
        filters: normalized,
      });
    } catch (error) {
      console.error("Smart search error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Не удалось выполнить умный поиск. Попробуйте ещё раз.",
      );
    } finally {
      setSearching(false);
    }
  }

  /* =========================================================
     EXAMPLES
  ========================================================= */

  function useExample(example) {
    setText(example);
    setError("");
  }

  /* =========================================================
     CLEAR
  ========================================================= */

  function clearSearch() {
    setText("");
    setError("");
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.badge}>
            <Sparkles size={13} />
            AI SEARCH
          </div>

          <h2>Расскажите, что вы ищете</h2>

          <p>
            Напишите или скажите своими словами — AI определит тип недвижимости,
            локацию, цену, площадь, комнаты и характеристики.
          </p>
        </div>
      </div>

      <div className={styles.searchBox}>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Например: Ищу коттедж на Иссык-Куле до 200 тысяч долларов, с бассейном, сауной, первой линией и недалеко от пляжа"
          rows={5}
          maxLength={SAFE_MAX_TEXT_LENGTH}
          disabled={searching}
        />

        <div className={styles.searchActions}>
          <button
            type="button"
            className={`${styles.voiceButton} ${
              listening ? styles.listening : ""
            }`}
            onClick={toggleVoice}
            disabled={searching}
            aria-label={listening ? "Остановить запись" : "Голосовой ввод"}
          >
            {listening ? <MicOff size={21} /> : <Mic size={21} />}
          </button>

          {text && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearSearch}
              disabled={searching}
              aria-label="Очистить"
            >
              <RotateCcw size={15} />
            </button>
          )}
        </div>
      </div>

      {listening && (
        <div className={styles.listeningStatus}>
          <span className={styles.pulse} />
          <span>Слушаю... Говорите, что вы ищете</span>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {!supported && (
        <div className={styles.browserNotice}>
          Голосовой ввод недоступен в этом браузере. Попробуйте Chrome.
        </div>
      )}

      <button
        type="button"
        className={styles.searchButton}
        disabled={searching || !text.trim() || listening}
        onClick={() => handleSearch()}
      >
        {searching ? (
          <>
            <Loader2 size={19} className={styles.spinner} />
            Анализирую запрос...
          </>
        ) : (
          <>
            <Search size={19} />
            Найти подходящие объявления
          </>
        )}
      </button>

      <div className={styles.examples}>
        <span>Например:</span>

        <div className={styles.exampleList}>
          <button
            type="button"
            onClick={() =>
              useExample(
                "Ищу двухкомнатную квартиру в Бишкеке до 80000 долларов, площадью от 50 до 80 квадратных метров, с хорошим ремонтом и парковкой",
              )
            }
          >
            Квартира в Бишкеке
          </button>

          <button
            type="button"
            onClick={() =>
              useExample(
                "Нужен частный дом в Бишкеке или рядом, до 150000 долларов, минимум 4 комнаты, с отоплением и водой",
              )
            }
          >
            Частный дом
          </button>

          <button
            type="button"
            onClick={() =>
              useExample(
                "Ищу коттедж на Иссык-Куле до 200 тысяч долларов, с бассейном, сауной, первой линией и недалеко от пляжа",
              )
            }
          >
            Коттедж на Иссык-Куле
          </button>
        </div>
      </div>
    </section>
  );
}
