"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  Rectangle,
} from "react-leaflet";
import L from "leaflet";
import { useRouter } from "next/navigation";

import { getListings, getComplexes, getListingById } from "@/utils/api";
import { mapListingData } from "@/utils/mapListingData";
import { mapComplexData } from "@/utils/mapComplexData";

import {
  Search,
  MapPin,
  X,
  RotateCcw,
  MousePointer2,
  ArrowUpRight,
  Home,
  SlidersHorizontal,
  Building2,
  Tag,
  Loader2,
} from "lucide-react";

import "leaflet/dist/leaflet.css";
import styles from "./Map.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

/* =========================================================
   FILTER OPTIONS
========================================================= */

const DEAL_OPTIONS = ["Все", "Купить", "Снять"];

const PROPERTY_OPTIONS = [
  "Все",
  "Квартира",
  "Дом",
  "Коттедж",
  "Участок",
  "Коммерция",
  "Паркинг",
  "Комната",
  "ЖК",
];

const LOCATION_OPTIONS = [
  "Все",
  "Бишкек",
  "Чуйская область",
  "Ошская область",
  "Джалал-Абадская область",
  "Иссык-Кульская область",
  "Нарынская область",
  "Таласская область",
  "Баткенская область",
  "Турция",
];

/* =========================================================
   LEAFLET MARKER
========================================================= */

let markerIcon;

const getMarkerIcon = () => {
  if (typeof window === "undefined" || typeof L === "undefined" || !L.divIcon) {
    return undefined;
  }

  if (!markerIcon) {
    markerIcon = L.divIcon({
      className: styles.customMarker,

      html: `
        <div class="${styles.markerInner}">
          <div class="${styles.markerGlow}"></div>

          <div class="${styles.markerPin}">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/>
              <circle cx="12" cy="10" r="2.5"/>
            </svg>
          </div>
        </div>
      `,

      iconSize: [42, 42],
      iconAnchor: [21, 42],
    });
  }

  return markerIcon;
};

/* =========================================================
   MAP RESIZE
========================================================= */

function MapResizeFix() {
  const map = useMap();

  useEffect(() => {
    const resize = () => {
      map.invalidateSize(true);
    };

    const timer = setTimeout(resize, 100);

    window.addEventListener("resize", resize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", resize);
    };
  }, [map]);

  return null;
}

/* =========================================================
   MAP CONTROLLER
========================================================= */

function MapController({ selectedBounds }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedBounds) return;

    map.fitBounds(selectedBounds, {
      padding: [50, 50],
      maxZoom: 15,
      animate: true,
      duration: 0.5,
    });
  }, [selectedBounds, map]);

  return null;
}

/* =========================================================
   AREA DRAWER
========================================================= */

function AreaDrawer({ onComplete, onStart }) {
  const map = useMap();

  const startPoint = useRef(null);
  const isDrawing = useRef(false);

  useMapEvents({
    mousedown(event) {
      if (event.originalEvent.button !== 0) return;

      if (!event.originalEvent.shiftKey) return;

      isDrawing.current = true;
      startPoint.current = event.latlng;

      map.dragging.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();

      onStart();
    },

    mousemove(event) {
      if (!isDrawing.current || !startPoint.current) return;

      const bounds = L.latLngBounds(startPoint.current, event.latlng);

      onComplete(bounds, false);
    },

    mouseup(event) {
      if (!isDrawing.current || !startPoint.current) return;

      const bounds = L.latLngBounds(startPoint.current, event.latlng);

      isDrawing.current = false;
      startPoint.current = null;

      map.dragging.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();

      onComplete(bounds, true);
    },
  });

  useEffect(() => {
    return () => {
      map.dragging.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    };
  }, [map]);

  return null;
}

/* =========================================================
   OBJECT TYPE LABEL
========================================================= */

function getObjectTypeLabel(object) {
  if (object?.objectType === "complex") {
    return "ЖК";
  }

  switch (object?.propertyType) {
    case "house":
      return "Дом";

    case "cottage":
      return "Коттедж";

    case "land":
      return "Участок";

    case "commercial":
      return "Коммерция";

    case "parking":
      return "Паркинг";

    case "room":
      return "Комната";

    default:
      return "Квартира";
  }
}

/* =========================================================
   NORMALIZE DEAL TYPE
========================================================= */

function normalizeDealType(object) {
  if (!object) return "";

  const raw = String(
    object.dealType ??
      object.deal_type ??
      object.transactionType ??
      object.transaction_type ??
      object.operationType ??
      object.operation_type ??
      object.deal ??
      object.operation ??
      object.typeDeal ??
      "",
  )
    .trim()
    .toLowerCase();

  if (
    raw.includes("rent") ||
    raw.includes("аренд") ||
    raw.includes("сним") ||
    raw.includes("найм") ||
    raw.includes("lease")
  ) {
    return "rent";
  }

  if (
    raw.includes("buy") ||
    raw.includes("продаж") ||
    raw.includes("куп") ||
    raw.includes("sale")
  ) {
    return "buy";
  }

  return "";
}

/* =========================================================
   NORMALIZE PROPERTY TYPE
========================================================= */

function normalizePropertyType(object) {
  if (!object) return "";

  if (object.objectType === "complex") {
    return "complex";
  }

  const raw = String(
    object.type ??
      object.category ??
      object.categoryType ??
      object.propertyType ??
      "",
  )
    .trim()
    .toLowerCase();

  if (
    raw.includes("apartment") ||
    raw.includes("квартир") ||
    raw.includes("flat")
  ) {
    return "apartment";
  }

  if (raw.includes("cottage") || raw.includes("коттедж")) {
    return "cottage";
  }

  if (raw.includes("house") || raw.includes("дом")) {
    return "house";
  }

  if (
    raw.includes("land") ||
    raw.includes("зем") ||
    raw.includes("участ") ||
    raw.includes("plot")
  ) {
    return "land";
  }

  if (
    raw.includes("commercial") ||
    raw.includes("коммер") ||
    raw.includes("офис") ||
    raw.includes("магазин")
  ) {
    return "commercial";
  }

  if (
    raw.includes("parking") ||
    raw.includes("паркинг") ||
    raw.includes("гараж")
  ) {
    return "parking";
  }

  if (raw.includes("room") || raw.includes("комнат")) {
    return "room";
  }

  return raw;
}

/* =========================================================
   LOCATION TEXT
========================================================= */

function getLocationText(object) {
  if (!object) return "";

  return [
    object.country,
    object.city,
    object.region,
    object.district,
    object.address,
    object.fullAddress,
    object.location,
    object.street,
  ]
    .filter(Boolean)
    .map((value) => String(value).trim())
    .join(" ")
    .toLowerCase();
}

/* =========================================================
   NORMALIZE LOCATION
========================================================= */

function normalizeLocation(object) {
  if (!object) return "";

  const text = getLocationText(object);

  if (
    text.includes("турци") ||
    text.includes("turkey") ||
    text.includes("istanbul") ||
    text.includes("стамбул") ||
    text.includes("ankara") ||
    text.includes("анкара") ||
    text.includes("antalya") ||
    text.includes("анталь")
  ) {
    return "turkey";
  }

  if (text.includes("бишкек") || text.includes("bishkek")) {
    return "bishkek";
  }

  if (text.includes("чуйск") || text.includes("чүй") || text.includes("chuy")) {
    return "chuy";
  }

  if (
    text.includes("ошск") ||
    text.includes("ошская") ||
    text.includes("ош ") ||
    text.includes("osh")
  ) {
    return "osh";
  }

  if (text.includes("джалал") || text.includes("jalal")) {
    return "jalal_abad";
  }

  if (
    text.includes("иссык") ||
    text.includes("иссык-куль") ||
    text.includes("иссык куль") ||
    text.includes("каракол") ||
    text.includes("чолпон") ||
    text.includes("бостери") ||
    text.includes("тамчы") ||
    text.includes("балыкчы") ||
    text.includes("боконбаево")
  ) {
    return "issyk_kul";
  }

  if (text.includes("нарын") || text.includes("naryn")) {
    return "naryn";
  }

  if (text.includes("талас") || text.includes("talas")) {
    return "talas";
  }

  if (text.includes("баткен") || text.includes("batken")) {
    return "batken";
  }

  return "";
}

/* =========================================================
   NORMALIZE LISTING
========================================================= */

function normalizeListing(item) {
  if (!item) return null;

  let mapped;

  try {
    mapped = mapListingData(item);
  } catch (error) {
    console.error("Ошибка mapListingData:", item, error);

    return null;
  }

  const latitude = Number(
    mapped.latitude ??
      mapped.lat ??
      item.latitude ??
      item.lat ??
      item.location?.latitude ??
      item.location?.lat,
  );

  const longitude = Number(
    mapped.longitude ??
      mapped.lng ??
      mapped.lon ??
      item.longitude ??
      item.lng ??
      item.lon ??
      item.location?.longitude ??
      item.location?.lng,
  );

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    console.warn("Объявление пропущено: нет координат", item);

    return null;
  }

  const object = {
    ...mapped,

    id: item.id ?? mapped.id,

    objectType: "listing",

    type: mapped.type || item.category || item.propertyType || "apartment",

    name:
      mapped.title || mapped.name || item.title || item.name || "Объявление",

    address:
      mapped.address ||
      mapped.location ||
      item.address ||
      item.fullAddress ||
      "Адрес не указан",

    price:
      mapped.priceFormatted || mapped.price || item.price || "Цена не указана",

    image:
      mapped.image ||
      mapped.images?.[0] ||
      item.cover_photo ||
      item.coverPhoto ||
      item.images?.[0] ||
      null,

    latitude,
    longitude,

    position: [latitude, longitude],
  };

  const combined = {
    ...item,
    ...mapped,
    address: object.address,
  };

  return {
    ...object,

    dealType: normalizeDealType(combined),

    propertyType: normalizePropertyType(combined),

    locationType: normalizeLocation(combined),

    locationText: getLocationText(combined),
  };
}

/* =========================================================
   NORMALIZE COMPLEX
========================================================= */

function normalizeComplex(item) {
  if (!item) return null;

  let mapped;

  try {
    mapped = mapComplexData(item);
  } catch (error) {
    console.error("Ошибка mapComplexData:", item, error);

    return null;
  }

  const latitude = Number(
    mapped.latitude ??
      mapped.lat ??
      item.latitude ??
      item.lat ??
      item.location?.latitude ??
      item.location?.lat,
  );

  const longitude = Number(
    mapped.longitude ??
      mapped.lng ??
      mapped.lon ??
      item.longitude ??
      item.lng ??
      item.lon ??
      item.location?.longitude ??
      item.location?.lng,
  );

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    console.warn("ЖК пропущен: нет координат", item);

    return null;
  }

  let price = "Цена не указана";

  if (mapped.priceFrom !== null && mapped.priceFrom !== undefined) {
    if (
      mapped.priceTo !== null &&
      mapped.priceTo !== undefined &&
      mapped.priceFrom !== mapped.priceTo
    ) {
      price = `от ${mapped.priceFrom} до ${mapped.priceTo} сом`;
    } else {
      price = `от ${mapped.priceFrom} сом`;
    }
  }

  const object = {
    ...mapped,

    id: item.id ?? mapped.id,

    objectType: "complex",

    type: "complex",

    name: mapped.name || item.name || "Жилой комплекс",

    address:
      mapped.address || item.address || item.fullAddress || "Адрес не указан",

    price,

    image:
      mapped.image ||
      mapped.images?.[0] ||
      item.cover_photo ||
      item.coverPhoto ||
      null,

    latitude,
    longitude,

    position: [latitude, longitude],
  };

  const combined = {
    ...item,
    ...mapped,

    address: object.address,
  };

  return {
    ...object,

    dealType: normalizeDealType(combined),

    propertyType: "complex",

    locationType: normalizeLocation(combined),

    locationText: getLocationText(combined),
  };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SearchMapClient() {
  const router = useRouter();

  /* =========================================================
     DATA
  ========================================================= */

  const [listings, setListings] = useState([]);
  const [complexes, setComplexes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  /* =========================================================
     SEARCH
  ========================================================= */

  const [search, setSearch] = useState("");

  /* =========================================================
     FILTERS
  ========================================================= */

  const [showFilters, setShowFilters] = useState(false);

  const [dealFilter, setDealFilter] = useState("Все");

  const [propertyFilter, setPropertyFilter] = useState("Все");

  const [locationFilter, setLocationFilter] = useState("Все");

  /* =========================================================
     AREA
  ========================================================= */

  const [selectedBounds, setSelectedBounds] = useState(null);

  const [tempBounds, setTempBounds] = useState(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const [hasSelection, setHasSelection] = useState(false);

  /* =========================================================
     SELECTED OBJECT
  ========================================================= */

  const [selectedObject, setSelectedObject] = useState(null);

  const [selectedObjectDetails, setSelectedObjectDetails] = useState(null);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [detailsError, setDetailsError] = useState("");

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setLoadError("");

        const [listingsResponse, complexesResponse] = await Promise.all([
          getListings({
            page: 1,
            limit: 500,
          }),

          getComplexes(),
        ]);

        if (cancelled) return;

        if (listingsResponse?.success && Array.isArray(listingsResponse.data)) {
          const mappedListings = listingsResponse.data
            .map(normalizeListing)
            .filter(Boolean);

          setListings(mappedListings);
        } else {
          setListings([]);
        }

        if (
          complexesResponse?.success &&
          Array.isArray(complexesResponse.data)
        ) {
          const mappedComplexes = complexesResponse.data
            .map(normalizeComplex)
            .filter(Boolean);

          setComplexes(mappedComplexes);
        } else {
          setComplexes([]);
        }
      } catch (error) {
        console.error("Ошибка загрузки объектов карты:", error);

        if (!cancelled) {
          setLoadError(error?.message || "Не удалось загрузить объекты");

          setListings([]);
          setComplexes([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     ALL OBJECTS
  ========================================================= */

  const objects = useMemo(() => {
    return [...listings, ...complexes];
  }, [listings, complexes]);

  /* =========================================================
     ACTIVE FILTER COUNT
  ========================================================= */

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (dealFilter !== "Все") {
      count += 1;
    }

    if (propertyFilter !== "Все") {
      count += 1;
    }

    if (locationFilter !== "Все") {
      count += 1;
    }

    return count;
  }, [dealFilter, propertyFilter, locationFilter]);

  /* =========================================================
     DEAL VALUE
  ========================================================= */

  function getDealValue(object) {
    if (object?.dealType === "buy") {
      return "Купить";
    }

    if (object?.dealType === "rent") {
      return "Снять";
    }

    return "";
  }

  /* =========================================================
     PROPERTY LABEL
  ========================================================= */

  function getPropertyLabel(value) {
    const labels = {
      apartment: "Квартира",
      house: "Дом",
      cottage: "Коттедж",
      land: "Участок",
      commercial: "Коммерция",
      parking: "Паркинг",
      room: "Комната",
      complex: "ЖК",
    };

    return labels[value] || "";
  }

  /* =========================================================
     LOCATION VALUE
  ========================================================= */

  function getLocationFilterValue(object) {
    const values = {
      bishkek: "Бишкек",
      chuy: "Чуйская область",
      osh: "Ошская область",
      jalal_abad: "Джалал-Абадская область",
      issyk_kul: "Иссык-Кульская область",
      naryn: "Нарынская область",
      talas: "Таласская область",
      batken: "Баткенская область",
      turkey: "Турция",
    };

    return values[object.locationType] || "";
  }

  /* =========================================================
     FILTERED OBJECTS
  ========================================================= */

  const filteredObjects = useMemo(() => {
    let result = objects;

    /* AREA */

    if (selectedBounds) {
      result = result.filter((object) => {
        return selectedBounds.contains(L.latLng(object.position));
      });
    }

    /* SEARCH */

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((object) => {
        const name = String(object.name || "").toLowerCase();

        const address = String(object.address || "").toLowerCase();

        const description = String(object.description || "").toLowerCase();

        const developer = String(object.developer || "").toLowerCase();

        const locationText = String(object.locationText || "").toLowerCase();

        return (
          name.includes(query) ||
          address.includes(query) ||
          description.includes(query) ||
          developer.includes(query) ||
          locationText.includes(query)
        );
      });
    }

    /* DEAL */

    if (dealFilter !== "Все") {
      result = result.filter((object) => {
        return getDealValue(object) === dealFilter;
      });
    }

    /* PROPERTY */

    if (propertyFilter !== "Все") {
      result = result.filter((object) => {
        return getPropertyLabel(object.propertyType) === propertyFilter;
      });
    }

    /* LOCATION */

    if (locationFilter !== "Все") {
      result = result.filter((object) => {
        return getLocationFilterValue(object) === locationFilter;
      });
    }

    return result;
  }, [
    objects,
    selectedBounds,
    search,
    dealFilter,
    propertyFilter,
    locationFilter,
  ]);

  /* =========================================================
     AREA
  ========================================================= */

  function handleBounds(bounds, finished) {
    setTempBounds(bounds);

    if (!finished) return;

    const north = bounds.getNorth();
    const south = bounds.getSouth();

    const east = bounds.getEast();
    const west = bounds.getWest();

    const isTiny =
      Math.abs(north - south) < 0.0005 || Math.abs(east - west) < 0.0005;

    if (isTiny) {
      setTempBounds(null);
      return;
    }

    setSelectedBounds(bounds);

    setTempBounds(null);

    setHasSelection(true);

    setSelectedObject((current) => {
      if (!current) return null;

      if (bounds.contains(L.latLng(current.position))) {
        return current;
      }

      return null;
    });
  }

  /* =========================================================
     CLEAR AREA
  ========================================================= */

  function clearSelection() {
    setSelectedBounds(null);
    setTempBounds(null);
    setHasSelection(false);

    closeObjectPreview();
  }

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  function clearFilters() {
    setDealFilter("Все");
    setPropertyFilter("Все");
    setLocationFilter("Все");
  }

  /* =========================================================
     OBJECT CLICK
  ========================================================= */

  async function handleObjectClick(object) {
    if (!object?.id) return;

    /*
      Сначала показываем карточку с информацией,
      которая уже есть в карте.
    */

    setSelectedObject(object);

    setSelectedObjectDetails(object);

    setDetailsError("");

    /*
      Для обычного объявления дополнительно
      получаем полную информацию с API.
    */

    if (object.objectType !== "listing") {
      return;
    }

    try {
      setDetailsLoading(true);

      const response = await getListingById(object.id);

      /*
        API может вернуть:

        {
          success: true,
          data: {...}
        }

        либо сразу объект.
      */

      const rawData = response?.data ?? response?.listing ?? response;

      if (!rawData) {
        setDetailsError("Не удалось получить информацию об объекте");

        return;
      }

      let mappedDetails = rawData;

      try {
        mappedDetails = mapListingData(rawData);
      } catch (error) {
        console.warn("Не удалось дополнительно замапить объявление:", error);

        mappedDetails = rawData;
      }

      const mergedObject = {
        ...object,
        ...rawData,
        ...mappedDetails,

        id: rawData.id ?? mappedDetails.id ?? object.id,

        objectType: "listing",

        name:
          mappedDetails.title ||
          mappedDetails.name ||
          rawData.title ||
          rawData.name ||
          object.name,

        address:
          mappedDetails.address ||
          rawData.address ||
          rawData.fullAddress ||
          object.address,

        image:
          mappedDetails.image ||
          mappedDetails.images?.[0] ||
          rawData.cover_photo ||
          rawData.coverPhoto ||
          rawData.images?.[0] ||
          object.image,

        price:
          mappedDetails.priceFormatted ||
          mappedDetails.price ||
          rawData.price ||
          object.price,
      };

      setSelectedObjectDetails(mergedObject);
    } catch (error) {
      console.error("Ошибка получения объявления:", error);

      setDetailsError("Не удалось загрузить дополнительную информацию");

      /*
        Даже если API упало, карточка продолжает
        работать на основе данных карты.
      */

      setSelectedObjectDetails(object);
    } finally {
      setDetailsLoading(false);
    }
  }

  /* =========================================================
     DETAILS
  ========================================================= */

  function handleDetails(object) {
    if (!object?.id) return;

    if (object.objectType === "complex") {
      router.push(`/complexes/${object.id}`);

      return;
    }

    router.push(`/all-products/${object.id}`);
  }

  /* =========================================================
     PREVIEW CLICK
  ========================================================= */

  function handlePreviewClick(event) {
    /*
      Не отправляем клик с кнопки Details
      второй раз.
    */

    if (event.target.closest(`.${styles.detailsButton}`)) {
      return;
    }

    if (!selectedObjectDetails?.id) {
      return;
    }

    handleDetails(selectedObjectDetails);
  }

  /* =========================================================
     CLOSE PREVIEW
  ========================================================= */

  function closeObjectPreview() {
    setSelectedObject(null);
    setSelectedObjectDetails(null);
    setDetailsLoading(false);
    setDetailsError("");
  }

  /* =========================================================
     PREVIEW OBJECT
  ========================================================= */

  const previewObject = selectedObjectDetails || selectedObject;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className={styles.page}>
      <section className={styles.mapWrapper}>
        {/* ===================================================
            TOP CONTROLS
        =================================================== */}

        <div className={styles.topPanel}>
          {/* HOME */}

          <button
            type="button"
            className={styles.homeButton}
            onClick={() => router.push("/")}
            aria-label="На главную"
          >
            <Home size={18} />

            <span>Главная</span>
          </button>

          {/* HEADING */}

          <div className={styles.heading}>
            <div className={styles.headingIcon}>
              <MapPin />
            </div>

            <div>
              <span>UYTAP MAP</span>

              <h1>Недвижимость на карте</h1>
            </div>
          </div>

          {/* FILTER TOGGLE */}

          <button
            type="button"
            className={`${styles.filtersToggle} ${
              showFilters || activeFilterCount > 0
                ? styles.filtersToggleActive
                : ""
            }`}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <SlidersHorizontal />

            <span>Фильтры</span>

            {activeFilterCount > 0 && <b>{activeFilterCount}</b>}
          </button>
        </div>

        {/* ===================================================
            FILTER PANEL
        =================================================== */}

        <div
          className={`${styles.filtersPanel} ${
            showFilters ? styles.filtersPanelOpen : ""
          }`}
        >
          <div className={styles.filtersHeader}>
            <div>
              <strong>Фильтры поиска</strong>

              <span>Настройте отображение объектов на карте</span>
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                className={styles.clearFilters}
                onClick={clearFilters}
              >
                <RotateCcw size={14} />
                Сбросить
              </button>
            )}
          </div>

          <div className={styles.filtersGrid}>
            <CustomSelect
              icon={Tag}
              title="Тип сделки"
              options={DEAL_OPTIONS}
              value={dealFilter}
              setValue={setDealFilter}
            />

            <CustomSelect
              icon={Building2}
              title="Тип недвижимости"
              options={PROPERTY_OPTIONS}
              value={propertyFilter}
              setValue={setPropertyFilter}
            />

            <CustomSelect
              icon={MapPin}
              title="Локация"
              options={LOCATION_OPTIONS}
              value={locationFilter}
              setValue={setLocationFilter}
            />
          </div>
        </div>

        {/* ===================================================
            MAP
        =================================================== */}

        <div className={styles.mapArea}>
          <MapContainer
            center={[42.8746, 74.6122]}
            zoom={12}
            minZoom={5}
            maxZoom={18}
            zoomControl={true}
            scrollWheelZoom={true}
            className={styles.map}
            attributionControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapResizeFix />

            <MapController selectedBounds={selectedBounds} />

            <AreaDrawer
              onStart={() => {
                setIsDrawing(true);
                closeObjectPreview();
              }}
              onComplete={(bounds, finished) => {
                handleBounds(bounds, finished);

                if (finished) {
                  setIsDrawing(false);
                }
              }}
            />

            {/* TEMP AREA */}

            {tempBounds && (
              <Rectangle
                bounds={tempBounds}
                pathOptions={{
                  color: "#8b5cf6",
                  weight: 3,
                  opacity: 1,
                  fillColor: "#8b5cf6",
                  fillOpacity: 0.2,
                  dashArray: "8 6",
                }}
              />
            )}

            {/* SELECTED AREA */}

            {selectedBounds && (
              <Rectangle
                bounds={selectedBounds}
                pathOptions={{
                  color: "#a78bfa",
                  weight: 3,
                  opacity: 1,
                  fillColor: "#8b5cf6",
                  fillOpacity: 0.18,
                  dashArray: "10 6",
                  className: "selected-area",
                }}
              />
            )}

            {/* MARKERS */}

            {filteredObjects.map((object) => (
              <Marker
                key={`${object.objectType}-${object.id}`}
                position={object.position}
                icon={getMarkerIcon()}
                eventHandlers={{
                  click: () => handleObjectClick(object),
                }}
              />
            ))}
          </MapContainer>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className={styles.mapStatus}>
              <div className={styles.loadingSpinner} />

              <span>Загружаем объекты...</span>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && loadError && (
            <div className={styles.mapStatus}>
              <span>Не удалось загрузить объекты</span>
            </div>
          )}

          {/* =================================================
              DRAWING
          ================================================= */}

          {isDrawing && (
            <div className={styles.drawingIndicator}>
              <MousePointer2 />

              <span>Отпустите мышь, чтобы выбрать область</span>
            </div>
          )}

          {/* =================================================
              DRAW HINT
          ================================================= */}

          {!isDrawing && !hasSelection && (
            <div className={styles.drawHint}>
              <div className={styles.drawHintIcon}>
                <MousePointer2 />
              </div>

              <div>
                <strong>Выделите область</strong>

                <span>Удерживайте Shift и протяните по карте мышью</span>
              </div>
            </div>
          )}

          {/* =================================================
              SELECTION PANEL
          ================================================= */}

          {hasSelection && (
            <div className={styles.selectionPanel}>
              <div className={styles.selectionIcon}>
                <MapPin />
              </div>

              <div className={styles.selectionText}>
                <strong>Область выбрана</strong>

                <span>
                  Найдено объектов: <b>{filteredObjects.length}</b>
                </span>
              </div>

              <button
                type="button"
                className={styles.resetButton}
                onClick={clearSelection}
              >
                <RotateCcw />

                <span>Сбросить</span>
              </button>
            </div>
          )}

          {/* =================================================
              OBJECT PREVIEW
          ================================================= */}

          {previewObject && (
            <div
              className={styles.objectPreview}
              onClick={handlePreviewClick}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  handleDetails(previewObject);
                }
              }}
            >
              {/* CLOSE */}

              <button
                type="button"
                className={styles.previewClose}
                onClick={(event) => {
                  event.stopPropagation();

                  closeObjectPreview();
                }}
                aria-label="Закрыть"
              >
                <X />
              </button>

              {/* IMAGE */}

              <div className={styles.previewImage}>
                {previewObject.image ? (
                  <img
                    src={previewObject.image}
                    alt={previewObject.name || "Объект недвижимости"}
                  />
                ) : (
                  <div className={styles.previewNoImage}>
                    <MapPin />
                  </div>
                )}

                <span className={styles.previewType}>
                  {getObjectTypeLabel(previewObject)}
                </span>
              </div>

              {/* CONTENT */}

              <div className={styles.previewContent}>
                <h3>{previewObject.name || "Объект недвижимости"}</h3>

                <p>
                  <MapPin />

                  <span>{previewObject.address || "Адрес не указан"}</span>
                </p>

                <strong>{previewObject.price || "Цена не указана"}</strong>

                {/* API LOADING */}

                {detailsLoading && (
                  <div className={styles.previewLoading}>
                    <Loader2 size={16} className={styles.spinnerIcon} />

                    <span>Загружаем информацию...</span>
                  </div>
                )}

                {/* API ERROR */}

                {!detailsLoading && detailsError && (
                  <span className={styles.previewError}>{detailsError}</span>
                )}

                {/* DETAILS BUTTON */}

                <button
                  type="button"
                  className={styles.detailsButton}
                  onClick={(event) => {
                    event.stopPropagation();

                    handleDetails(previewObject);
                  }}
                >
                  <span>Подробнее</span>

                  <ArrowUpRight />
                </button>
              </div>
            </div>
          )}

          {/* =================================================
              RESULT COUNT
          ================================================= */}

          <div className={styles.resultCount}>
            <span className={styles.resultDot} />
            {filteredObjects.length} объектов
          </div>
        </div>
      </section>
    </main>
  );
}
