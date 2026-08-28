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
import {
  Search,
  MapPin,
  Building2,
  Home,
  X,
  RotateCcw,
  MousePointer2,
} from "lucide-react";

import "leaflet/dist/leaflet.css";
import styles from "./Map.module.css";

/* =========================================================
   FIX LEAFLET MARKER ICON
========================================================= */

const createIcon = () =>
  L.divIcon({
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

const markerIcon = createIcon();

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

function AreaDrawer({ onComplete, onStart, drawing }) {
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
   DATA
========================================================= */

const DEFAULT_OBJECTS = [
  {
    id: 1,
    type: "apartment",
    name: "3-комнатная квартира",
    address: "ул. Токтогула, 125",
    price: "8 500 000 сом",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
    position: [42.8746, 74.6122],
  },
  {
    id: 2,
    type: "complex",
    name: "ЖК Central Park",
    address: "ул. Киевская, 168",
    price: "от 6 900 000 сом",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=85",
    position: [42.8769, 74.6065],
  },
  {
    id: 3,
    type: "house",
    name: "Современный дом",
    address: "мкр. Асанбай",
    price: "15 500 000 сом",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
    position: [42.8238, 74.6318],
  },
  {
    id: 4,
    type: "apartment",
    name: "2-комнатная квартира",
    address: "ул. Исанова, 44",
    price: "5 800 000 сом",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
    position: [42.8659, 74.5964],
  },
  {
    id: 5,
    type: "complex",
    name: "ЖК Южные Ворота",
    address: "Южная магистраль",
    price: "от 7 200 000 сом",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=85",
    position: [42.8325, 74.615],
  },
  {
    id: 6,
    type: "apartment",
    name: "1-комнатная квартира",
    address: "ул. Манаса, 32",
    price: "4 300 000 сом",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85",
    position: [42.8669, 74.595],
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Map() {
  const [objects] = useState(DEFAULT_OBJECTS);

  const [search, setSearch] = useState("");
  const [selectedBounds, setSelectedBounds] = useState(null);
  const [tempBounds, setTempBounds] = useState(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  const [hoveredObject, setHoveredObject] = useState(null);

  const filteredObjects = useMemo(() => {
    let result = objects;

    if (selectedBounds) {
      result = result.filter((object) =>
        selectedBounds.contains(L.latLng(object.position)),
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (object) =>
          object.name.toLowerCase().includes(query) ||
          object.address.toLowerCase().includes(query),
      );
    }

    return result;
  }, [objects, selectedBounds, search]);

  function handleBounds(bounds, finished) {
    setTempBounds(bounds);

    if (finished) {
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
    }
  }

  function clearSelection() {
    setSelectedBounds(null);
    setTempBounds(null);
    setHasSelection(false);
  }

  return (
    <main className={styles.page}>
      <section className={styles.mapWrapper}>
        {/* =================================================
            HEADER
        ================================================= */}

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

        {/* =================================================
            MAP
        ================================================= */}

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
              drawing={isDrawing}
              onStart={() => {
                setIsDrawing(true);
                setHoveredObject(null);
              }}
              onComplete={(bounds, finished) => {
                handleBounds(bounds, finished);

                if (finished) {
                  setIsDrawing(false);
                }
              }}
            />

            {/* =================================================
                TEMPORARY DRAWING RECTANGLE
            ================================================= */}

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

            {/* =================================================
                FINAL SELECTED AREA
            ================================================= */}

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

            {/* =================================================
                OBJECTS
            ================================================= */}

            {filteredObjects.map((object) => (
              <Marker
                key={object.id}
                position={object.position}
                icon={markerIcon}
                eventHandlers={{
                  mouseover: () => setHoveredObject(object),
                  mouseout: () => setHoveredObject(null),
                }}
              />
            ))}
          </MapContainer>

          {/* =================================================
              DRAWING INDICATOR
          ================================================= */}

          {isDrawing && (
            <div className={styles.drawingIndicator}>
              <MousePointer2 />
              <span>Отпустите мышь, чтобы выбрать область</span>
            </div>
          )}

          {/* =================================================
              DRAW BUTTON
          ================================================= */}

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

          {/* =================================================
              SELECTION INFO
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
                Сбросить
              </button>
            </div>
          )}

          {/* =================================================
              HOVER CARD
          ================================================= */}

          {hoveredObject && (
            <div
              className={styles.objectPreview}
              onMouseEnter={() => setHoveredObject(hoveredObject)}
            >
              <div className={styles.previewImage}>
                <img src={hoveredObject.image} alt={hoveredObject.name} />

                <span className={styles.previewType}>
                  {hoveredObject.type === "complex"
                    ? "ЖК"
                    : hoveredObject.type === "house"
                      ? "Дом"
                      : "Квартира"}
                </span>
              </div>

              <div className={styles.previewContent}>
                <h3>{hoveredObject.name}</h3>

                <p>
                  <MapPin />
                  {hoveredObject.address}
                </p>

                <strong>{hoveredObject.price}</strong>

                <button type="button">Подробнее</button>
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
