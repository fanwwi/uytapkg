"use client";

import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import styles from "./RealEstateMap.module.css";

const defaultPosition = [42.8746, 74.5698]; // Бишкек

const markerIcon = new L.DivIcon({
  className: styles.customMarker,
  html: `
    <div class="${styles.marker}">
      <div class="${styles.markerDot}"></div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

function MapController({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    if (
      latitude === null ||
      latitude === undefined ||
      longitude === null ||
      longitude === undefined ||
      latitude === "" ||
      longitude === ""
    ) {
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return;
    }

    map.flyTo([lat, lng], 16, {
      duration: 1.2,
    });
  }, [latitude, longitude, map]);

  return null;
}

async function reverseGeocode(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      format: "json",
      addressdetails: "1",
      "accept-language": "ru",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = await response.json();

    return data.display_name || "";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "";
  }
}

function LocationPicker({ onLocationChange }) {
  useMapEvents({
    async click(event) {
      const latitude = event.latlng.lat;
      const longitude = event.latlng.lng;

      onLocationChange({
        latitude,
        longitude,
      });

      const address = await reverseGeocode(latitude, longitude);

      if (address) {
        onLocationChange({
          latitude,
          longitude,
          address,
        });
      }
    },
  });

  return null;
}

export default function RealEstateMapClient({
  latitude,
  longitude,
  onLocationChange,
}) {
  const hasCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined &&
    latitude !== "" &&
    longitude !== "";

  const position = hasCoordinates
    ? [Number(latitude), Number(longitude)]
    : defaultPosition;

  return (
    <div className={styles.wrapper}>
      <MapContainer
        center={position}
        zoom={13}
        className={styles.map}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController latitude={latitude} longitude={longitude} />

        <LocationPicker onLocationChange={onLocationChange} />

        {hasCoordinates && (
          <Marker
            position={position}
            icon={markerIcon}
            draggable
            eventHandlers={{
              async dragend(event) {
                const marker = event.target;
                const coordinates = marker.getLatLng();

                const newLatitude = coordinates.lat;
                const newLongitude = coordinates.lng;

                onLocationChange({
                  latitude: newLatitude,
                  longitude: newLongitude,
                });

                const address = await reverseGeocode(newLatitude, newLongitude);

                if (address) {
                  onLocationChange({
                    latitude: newLatitude,
                    longitude: newLongitude,
                    address,
                  });
                }
              },
            }}
          />
        )}
      </MapContainer>

      <div className={styles.hint}>
        <span className={styles.hintDot} />
        Нажмите на карту или перетащите точку
      </div>
    </div>
  );
}
