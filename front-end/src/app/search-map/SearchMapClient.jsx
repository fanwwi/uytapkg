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

import { getListings, getComplexes } from "@/utils/api";

import { mapListingData } from "@/utils/mapListingData";
import { mapComplexData } from "@/utils/mapComplexData";

import {
  Search,
  MapPin,
  X,
  RotateCcw,
  MousePointer2,
  ArrowUpRight,
} from "lucide-react";

import "leaflet/dist/leaflet.css";
import styles from "./Map.module.css";

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
   HELPERS
========================================================= */

function getObjectTypeLabel(object) {
  if (object.objectType === "complex") {
    return "ЖК";
  }

  if (object.type === "house") {
    return "Дом";
  }

  if (object.type === "land") {
    return "Участок";
  }

  if (object.type === "commercial") {
    return "Коммерция";
  }

  if (object.type === "parking") {
    return "Паркинг";
  }

  if (object.type === "room") {
    return "Комната";
  }

  return "Квартира";
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

  return {
    ...mapped,

    id: item.id ?? mapped.id,

    objectType: "listing",

    type: mapped.type || item.category || "apartment",

    name: mapped.title || item.title || "Объявление",

    address:
      mapped.address || mapped.location || item.address || "Адрес не указан",

    price:
      mapped.priceFormatted || mapped.price || item.price || "Цена не указана",

    image:
      mapped.image ||
      mapped.images?.[0] ||
      item.cover_photo ||
      item.images?.[0] ||
      null,

    latitude,
    longitude,

    position: [latitude, longitude],
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

  return {
    ...mapped,

    id: item.id ?? mapped.id,

    objectType: "complex",

    type: "complex",

    name: mapped.name || item.name || "Жилой комплекс",

    address: mapped.address || item.address || "Адрес не указан",

    price,

    image: mapped.image || mapped.images?.[0] || item.cover_photo || null,

    latitude,
    longitude,

    position: [latitude, longitude],
  };
}

/* =========================================================
   MAIN CLIENT COMPONENT
========================================================= */

export default function SearchMapClient() {
  const router = useRouter();

  /* =========================================================
     REAL DATA
  ========================================================= */

  const [listings, setListings] = useState([]);
  const [complexes, setComplexes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  /* =========================================================
     UI
  ========================================================= */

  const [search, setSearch] = useState("");

  const [selectedBounds, setSelectedBounds] = useState(null);

  const [tempBounds, setTempBounds] = useState(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const [hasSelection, setHasSelection] = useState(false);

  const [selectedObject, setSelectedObject] = useState(null);

  /* =========================================================
     LOAD REAL DATA
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
            limit: 100,
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

  const objects = useMemo(() => {
    return [...listings, ...complexes];
  }, [listings, complexes]);

  const filteredObjects = useMemo(() => {
    let result = objects;

    if (selectedBounds) {
      result = result.filter((object) => {
        return selectedBounds.contains(L.latLng(object.position));
      });
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((object) => {
        const name = String(object.name || "").toLowerCase();

        const address = String(object.address || "").toLowerCase();

        const description = String(object.description || "").toLowerCase();

        const developer = String(object.developer || "").toLowerCase();

        return (
          name.includes(query) ||
          address.includes(query) ||
          description.includes(query) ||
          developer.includes(query)
        );
      });
    }

    return result;
  }, [objects, selectedBounds, search]);

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

  function clearSelection() {
    setSelectedBounds(null);
    setTempBounds(null);
    setHasSelection(false);
    setSelectedObject(null);
  }

  function handleObjectClick(object) {
    if (!object) return;

    setSelectedObject(object);
  }

  function handleDetails(object) {
    if (!object?.id) return;

    if (object.objectType === "complex") {
      router.push(`/complexes/${object.id}`);

      return;
    }

    router.push(`/all-products/${object.id}`);
  }

  function closeObjectPreview() {
    setSelectedObject(null);
  }

  return (
    <main className={styles.page}>
      <section className={styles.mapWrapper}>
        <div className={styles.topPanel}>
          <div className={styles.heading}>
            <div className={styles.headingIcon}>
              <MapPin />
            </div>

            <div>
              <span>UYTap MAP</span>

              <h1>Недвижимость на карте</h1>
            </div>
          </div>

          <div className={styles.searchBox}>
            <Search />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по адресу или объекту..."
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className={styles.clearSearch}
              >
                <X />
              </button>
            )}
          </div>
        </div>

        <div className={styles.mapArea}>
          <MapContainer
            center={[42.8746, 74.6122]}
            zoom={12}
            minZoom={10}
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
                setSelectedObject(null);
              }}
              onComplete={(bounds, finished) => {
                handleBounds(bounds, finished);

                if (finished) {
                  setIsDrawing(false);
                }
              }}
            />

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

          {loading && (
            <div className={styles.mapStatus}>
              <div className={styles.loadingSpinner} />

              <span>Загружаем объекты...</span>
            </div>
          )}

          {!loading && loadError && (
            <div className={styles.mapStatus}>
              <span>Не удалось загрузить объекты</span>
            </div>
          )}

          {isDrawing && (
            <div className={styles.drawingIndicator}>
              <MousePointer2 />

              <span>Отпустите мышь, чтобы выбрать область</span>
            </div>
          )}

          {!isDrawing && !hasSelection && (
            <div className={styles.drawHint}>
              <div className={styles.drawHintIcon}>
                <MousePointer2 />
              </div>

              <div>
                <strong>Выделите область</strong>

                <span>Зажмите мышь и протяните по карте</span>
              </div>
            </div>
          )}

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
                Сбросить
              </button>
            </div>
          )}

          {selectedObject && (
            <div className={styles.objectPreview}>
              <button
                type="button"
                className={styles.previewClose}
                onClick={closeObjectPreview}
                aria-label="Закрыть"
              >
                <X />
              </button>

              <div className={styles.previewImage}>
                {selectedObject.image ? (
                  <img src={selectedObject.image} alt={selectedObject.name} />
                ) : (
                  <div className={styles.previewNoImage}>
                    <MapPin />
                  </div>
                )}

                <span className={styles.previewType}>
                  {getObjectTypeLabel(selectedObject)}
                </span>
              </div>

              <div className={styles.previewContent}>
                <h3>{selectedObject.name}</h3>

                <p>
                  <MapPin />

                  {selectedObject.address}
                </p>

                <strong>{selectedObject.price}</strong>

                <button
                  type="button"
                  className={styles.detailsButton}
                  onClick={() => handleDetails(selectedObject)}
                >
                  <span>Подробнее</span>

                  <ArrowUpRight />
                </button>
              </div>
            </div>
          )}

          <div className={styles.resultCount}>
            <span className={styles.resultDot} />
            {filteredObjects.length} объектов
          </div>
        </div>
      </section>
    </main>
  );
}
