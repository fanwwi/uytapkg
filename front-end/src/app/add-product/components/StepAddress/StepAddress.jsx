"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Loader2, MapPin, Search } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./StepAddress.module.css";
import RealEstateMap from "@/components/ui/realEstateMap/RealEstateMap";

export default function StepAddress({ form, updateForm, onNext, onBack }) {
  const { t, language } = useLanguage();

  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);

  const canContinue = form.address?.trim().length > 3;

  useEffect(() => {
    const query = form.address?.trim();

    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

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
          "accept-language": language === "ky" ? "ky" : "ru",
        });

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
  }, [form.address, form.country, form.addressSelected, language]);

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

  function handleAddressChange(event) {
    updateForm({
      address: event.target.value,
      addressSelected: false,
    });

    setSuggestions([]);
  }

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
        <span>{t("stepAddress.step")}</span>

        <h1>{t("stepAddress.title")}</h1>

        <p>{t("stepAddress.description")}</p>
      </div>

      {/* ПОИСК АДРЕСА */}

      <div className={styles.addressSearch}>
        <label>{t("stepAddress.address.label")}</label>

        <div className={styles.searchInput}>
          <MapPin className={styles.searchIcon} />

          <input
            type="text"
            value={form.address || ""}
            onChange={handleAddressChange}
            placeholder={t("stepAddress.address.placeholder")}
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
                      t("stepAddress.address.default")}
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
          <span>{t("stepAddress.coordinates")}</span>

          <strong>
            {Number(form.latitude).toFixed(6)},{" "}
            {Number(form.longitude).toFixed(6)}
          </strong>
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={onBack}>
          {t("common.back")}
        </button>

        <button
          type="button"
          className={styles.primary}
          disabled={!canContinue}
          onClick={onNext}
        >
          {t("stepAddress.continue")}
          <ChevronRight size={18} />
        </button>
      </div>

      <div className={styles.mapAttribution}>
        {t("stepAddress.mapAttribution")}
      </div>
    </div>
  );
}
