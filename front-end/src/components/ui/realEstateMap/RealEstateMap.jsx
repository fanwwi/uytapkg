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
  html: ` <div class="${styles.marker}"> <div class="${styles.markerDot}"></div> </div> `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});
/* * Следит за изменением координат. * * Когда пользователь выбирает адрес в input, * StepAddress обновляет latitude/longitude. * * Этот компонент получает новые координаты * и двигает карту к ним. */ function MapController({
  latitude,
  longitude,
}) {
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
    map.flyTo([lat, lng], 16, { duration: 1.2 });
  }, [latitude, longitude, map]);
  return null;
}
/* * Получаем адрес по координатам. */ async function reverseGeocode(
  latitude,
  longitude,
) {
  try {
    const params = new URLSearchParams({
      lat: latitude,
      lon: longitude,
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
/* * Клик по карте. */ function LocationPicker({ onLocationChange }) {
  useMapEvents({
    async click(event) {
      const latitude = event.latlng.lat;
      const longitude = event.latlng.lng;
      /* * Сначала сразу показываем координаты. */ onLocationChange({
        latitude,
        longitude,
      });
      /* * Затем определяем адрес. */ const address = await reverseGeocode(
        latitude,
        longitude,
      );
      if (address) {
        onLocationChange({ latitude, longitude, address });
      }
    },
  });
  return null;
}
export default function RealEstateMap({
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
      {" "}
      <MapContainer
        center={position}
        zoom={13}
        className={styles.map}
        scrollWheelZoom={true}
      >
        {" "}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />{" "}
        {/* Двигаем карту при выборе адреса */}{" "}
        <MapController latitude={latitude} longitude={longitude} />{" "}
        {/* Клик по карте */}{" "}
        <LocationPicker onLocationChange={onLocationChange} /> {/* Маркер */}{" "}
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
                /* * Сразу обновляем координаты. */ onLocationChange({
                  latitude: newLatitude,
                  longitude: newLongitude,
                });
                /* * Получаем новый адрес. */ const address =
                  await reverseGeocode(newLatitude, newLongitude);
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
        )}{" "}
      </MapContainer>{" "}
      <div className={styles.hint}>
        {" "}
        <span className={styles.hintDot} /> Нажмите на карту или перетащите
        точку{" "}
      </div>{" "}
    </div>
  );
}
