"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";

import styles from "./StepAddress.module.css";
import RealEstateMap from "@/components/ui/realEstateMap/RealEstateMap";

export default function StepAddress({ form, updateForm, onNext, onBack }) {
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);

  const canContinue = form.address?.trim().length > 3;

  /*
   * Поиск адреса через Nominatim.
   * Не отправляем запрос на каждую букву.
   */
  useEffect(() => {
    const query = form.address?.trim();

    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    // Если адрес уже выбран из подсказки —
    // повторно его не ищем.
    if (form.addressSelected) {
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setSearching(true);

        const params = new URLSearchParams({
          q: query,
          format: "json",
          addressdetails: "1",
          limit: "5",
          "accept-language": "ru",
        });

        /*
         * Ограничиваем поиск выбранной страной.
         */
        if (form.country === "kyrgyzstan") {
          params.set("countrycodes", "kg");
        }

        if (form.country === "turkey") {
          params.set("countrycodes", "tr");
        }

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error("Ошибка поиска адреса");
        }

        const data = await response.json();

        setSuggestions(data);
      } catch (error) {
        console.error("Address search error:", error);
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 700);

    return () => clearTimeout(timeout);
  }, [form.address, form.country, form.addressSelected]);

  /*
   * Пользователь выбрал адрес из подсказки.
   */
  function selectAddress(place) {
    const latitude = Number(place.lat);
    const longitude = Number(place.lon);

    updateForm({
      address: place.display_name,
      latitude,
      longitude,
      addressSelected: true,
    });

    setSuggestions([]);
  }

  /*
   * Пользователь печатает адрес вручную.
   */
  function handleAddressChange(event) {
    updateForm({
      address: event.target.value,
      addressSelected: false,
    });

    setSuggestions([]);
  }

  /*
   * Пользователь нажал / перетащил точку на карте.
   *
   * Координаты приходят из RealEstateMap.
   * Сам RealEstateMap затем делает reverse geocoding
   * и возвращает найденный адрес.
   */
  function handleLocationChange({ latitude, longitude, address }) {
    updateForm({
      latitude,
      longitude,
      ...(address
        ? {
            address,
            addressSelected: true,
          }
        : {}),
    });

    setSuggestions([]);
  }

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <span>Шаг 5 из 6</span>

        <h1>Где находится объект?</h1>

        <p>Введите адрес или выберите точку непосредственно на карте.</p>
      </div>

      {/* ПОИСК АДРЕСА */}
      <div className={styles.addressSearch}>
        <label>Адрес</label>

        <div className={styles.searchInput}>
          <MapPin className={styles.searchIcon} />

          <input
            type="text"
            value={form.address || ""}
            onChange={handleAddressChange}
            placeholder="Начните вводить адрес..."
            autoComplete="off"
          />

          {searching ? (
            <Loader2 className={styles.loader} />
          ) : (
            <Search className={styles.searchRightIcon} />
          )}
        </div>

        {/* ПОДСКАЗКИ */}
        {suggestions.length > 0 && (
          <div className={styles.suggestions}>
            {suggestions.map((place) => (
              <button
                type="button"
                key={place.place_id}
                className={styles.suggestion}
                onClick={() => selectAddress(place)}
              >
                <MapPin />

                <div>
                  <strong>
                    {place.address?.road ||
                      place.address?.neighbourhood ||
                      place.address?.city ||
                      "Адрес"}
                  </strong>

                  <span>{place.display_name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* КАРТА */}
      <div className={styles.map}>
        <RealEstateMap
          latitude={form.latitude}
          longitude={form.longitude}
          onLocationChange={handleLocationChange}
        />
      </div>

      {/* КООРДИНАТЫ */}
      {form.latitude && form.longitude && (
        <div className={styles.coordinatesPreview}>
          <span>Координаты объекта</span>

          <strong>
            {Number(form.latitude).toFixed(6)},{" "}
            {Number(form.longitude).toFixed(6)}
          </strong>
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={onBack}>
          Назад
        </button>

        <button
          type="button"
          className={styles.primary}
          disabled={!canContinue}
          onClick={onNext}
        >
          Продолжить
          <ChevronRight size={18} />
        </button>
      </div>

      <div className={styles.mapAttribution}>
        Карта © OpenStreetMap contributors
      </div>
    </div>
  );
}
