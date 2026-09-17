"use client";

import { useEffect, useRef } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  Rectangle,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import styles from "../Map.module.css";

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

function AreaDrawer({ enabled, onComplete, onStart }) {
  const map = useMap();

  const startPoint = useRef(null);
  const isDrawing = useRef(false);

  useMapEvents({
    mousedown(event) {
      if (!enabled) return;

      if (event.originalEvent.button !== 0) {
        return;
      }

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
      if (!enabled) return;

      if (!isDrawing.current || !startPoint.current) {
        return;
      }

      const bounds = L.latLngBounds(startPoint.current, event.latlng);

      onComplete(bounds, false);
    },

    mouseup(event) {
      if (!enabled) return;

      if (!isDrawing.current || !startPoint.current) {
        return;
      }

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
    if (!enabled) {
      isDrawing.current = false;
      startPoint.current = null;

      map.dragging.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();

      return;
    }

    const container = map.getContainer();

    container.classList.add(styles.mapDrawingMode);

    return () => {
      container.classList.remove(styles.mapDrawingMode);

      map.dragging.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();

      isDrawing.current = false;
      startPoint.current = null;
    };
  }, [enabled, map]);

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

export default function SearchMap({
  filteredObjects,
  selectedBounds,
  tempBounds,
  isAreaMode,
  setIsDrawing,
  closeObjectPreview,
  handleBounds,
  handleObjectClick,
}) {
  return (
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
          enabled={isAreaMode}
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
    </div>
  );
}
