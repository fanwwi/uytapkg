"use client";

import { useState } from "react";

import { createListing } from "@/utils/api";

import StepProgress from "./components/StepProgress/StepProgress";
import StepImage from "./components/StepImage/StepImage";
import StepLocation from "./components/StepLocation/StepLocation";
import StepDeal from "./components/StepDeal/StepDeal";
import StepCategory from "./components/StepCategory/StepCategory";
import StepAddress from "./components/StepAddress/StepAddress";
import StepListingType from "./components/StepListingType/StepListingType";

import styles from "./AddProduct.module.css";

const initialForm = {
  // =========================
  // ФОТО
  // =========================
  images: [],

  // =========================
  // МЕСТОПОЛОЖЕНИЕ
  // =========================
  country: "Кыргызстан",
  region: "",
  city: "",
  settlement: "",
  location: "",
  district: "",

  // =========================
  // СДЕЛКА
  // =========================
  dealType: "",
  rentalPeriod: "",

  // =========================
  // КАТЕГОРИЯ
  // =========================
  category: "",

  // =========================
  // ЦЕНА
  // =========================
  priceFrom: "",
  priceTo: "",

  // =========================
  // ПЛОЩАДЬ
  // =========================
  areaFrom: "",
  areaTo: "",

  // =========================
  // ДОПОЛНИТЕЛЬНЫЕ ФИЛЬТРЫ
  // =========================
  beachDistanceFrom: "",
  beachDistanceTo: "",
  developerOrComplex: "",

  // =========================
  // АДРЕС
  // =========================
  address: "",
  latitude: null,
  longitude: null,

  // =========================
  // ТИП РАЗМЕЩЕНИЯ
  // =========================
  listingType: "",
};

export default function AddProductPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // У тебя реально 6 шагов:
  //
  // 1. Фотографии
  // 2. Местоположение
  // 3. Тип сделки
  // 4. Категория и характеристики
  // 5. Адрес
  // 6. Тип объявления
  //
  const totalSteps = 6;

  function updateForm(values) {
    setForm((prev) => ({
      ...prev,
      ...values,
    }));
  }

  function nextStep() {
    setStep((prev) => Math.min(prev + 1, totalSteps));
    setSubmitMessage("");
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 1));
    setSubmitMessage("");
  }

  async function submitProduct() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const token = localStorage.getItem("uytap_token");

      if (!token) {
        throw new Error("Сначала войдите в аккаунт");
      }

      if (!form.images?.length) {
        throw new Error("Добавьте хотя бы одну фотографию");
      }

      if (!form.category) {
        throw new Error("Выберите категорию недвижимости");
      }

      if (!form.dealType) {
        throw new Error("Выберите тип сделки");
      }

      // =========================
      // ЦЕНА
      // =========================

      const priceFrom = Number(form.priceFrom);
      const priceTo = Number(form.priceTo);

      let derivedPrice = 100000;

      if (priceFrom > 0) {
        derivedPrice = priceFrom;
      } else if (priceTo > 0) {
        derivedPrice = priceTo;
      }

      // =========================
      // НАЗВАНИЕ
      // =========================

      const dealTitle =
        form.dealType === "sale"
          ? "Продажа"
          : form.dealType === "rent"
            ? "Аренда"
            : "Недвижимость";

      const categoryTitles = {
        apartment: "квартиры",
        house: "дома",
        land: "участка",
        room: "комнаты",
        commercial: "коммерческого помещения",
        parking: "паркинга",
      };

      const categoryTitle = categoryTitles[form.category] || "недвижимости";

      const derivedTitle = `${dealTitle} ${categoryTitle}`;

      // =========================
      // ОПИСАНИЕ
      // =========================

      const locationText =
        form.location ||
        form.city ||
        form.settlement ||
        form.region ||
        "Кыргызстан";

      const derivedDescription = [
        `Объект: ${categoryTitle}.`,
        `Местоположение: ${locationText}.`,
        form.district ? `Район: ${form.district}.` : "",
        form.address ? `Адрес: ${form.address}.` : "",
        form.developerOrComplex
          ? `Застройщик / ЖК: ${form.developerOrComplex}.`
          : "",
      ]
        .filter(Boolean)
        .join(" ");

      // =========================
      // ФОТО
      // =========================
      //
      // Пока передаём URL локальных blob-файлов.
      // В production здесь лучше сделать отдельный upload
      // на backend/storage и передавать уже реальные URL.
      //

      const photos = (form.images || []).map((image) => image.url);

      // =========================
      // PAYLOAD
      // =========================

      const payload = {
        title: derivedTitle,
        description: derivedDescription,

        // Категория
        propertyType: form.category,

        // Сделка
        dealType: form.dealType,
        rentPeriod: form.rentalPeriod || null,

        // Местоположение
        country: form.country || "Кыргызстан",
        region: form.region || null,
        city: form.city || null,
        settlement: form.settlement || form.location || null,
        district: form.district || null,

        // Адрес
        address: form.address || null,
        latitude: form.latitude ?? null,
        longitude: form.longitude ?? null,

        // Цена
        price: derivedPrice,
        priceFrom: priceFrom > 0 ? priceFrom : null,
        priceTo: priceTo > 0 ? priceTo : null,
        currency: "USD",

        // Площадь
        area:
          Number(form.areaFrom || form.areaTo || 0) > 0
            ? Number(form.areaFrom || form.areaTo)
            : null,

        areaFrom: Number(form.areaFrom) > 0 ? Number(form.areaFrom) : null,

        areaTo: Number(form.areaTo) > 0 ? Number(form.areaTo) : null,

        // Расстояние до пляжа
        beachDistanceFrom:
          Number(form.beachDistanceFrom) > 0
            ? Number(form.beachDistanceFrom)
            : null,

        beachDistanceTo:
          Number(form.beachDistanceTo) > 0
            ? Number(form.beachDistanceTo)
            : null,

        // Застройщик / ЖК
        developerOrComplex: form.developerOrComplex || null,

        // Тип объявления
        listingType: form.listingType || "standard",

        // Фотографии
        photos,

        // Дополнительные параметры
        rooms: form.rooms || null,
        floor: form.floor || null,
        totalFloors: form.floors || null,

        // Resort
        isResort: true,

        resortFilters: {
          beachDistanceFrom:
            Number(form.beachDistanceFrom) > 0
              ? Number(form.beachDistanceFrom)
              : null,

          beachDistanceTo:
            Number(form.beachDistanceTo) > 0
              ? Number(form.beachDistanceTo)
              : null,

          developerOrComplex: form.developerOrComplex || null,
        },

        // Остальные характеристики
        features: {
          wifi: form.wifi || null,
          pool: form.pool || null,
          bath: form.bath || null,
          view: form.view || null,
          parking: form.parking || null,
          beach: form.beach || null,
          pets: form.pets || null,
          children: form.children || null,
          furniture: form.furniture || null,
          documents: form.documents || null,
          offerType: form.offerType || null,
        },
      };

      console.log("📦 Данные объявления:", payload);

      const result = await createListing(token, payload);

      setSubmitMessage(result?.message || "Объявление успешно опубликовано");

      // Очищаем blob URL после успешной отправки
      form.images?.forEach((image) => {
        if (image?.url?.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });

      setForm(initialForm);
      setStep(1);
    } catch (error) {
      console.error("Ошибка публикации:", error);

      setSubmitMessage(error?.message || "Не удалось опубликовать объявление");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <StepProgress currentStep={step} totalSteps={totalSteps} />

        <div className={styles.card}>
          {/* =========================================
              STEP 1 — ФОТОГРАФИИ
          ========================================= */}

          {step === 1 && (
            <StepImage form={form} updateForm={updateForm} onNext={nextStep} />
          )}

          {/* =========================================
              STEP 2 — МЕСТОПОЛОЖЕНИЕ
          ========================================= */}

          {step === 2 && (
            <StepLocation
              form={form}
              updateForm={updateForm}
              onNext={nextStep}
            />
          )}

          {/* =========================================
              STEP 3 — СДЕЛКА
          ========================================= */}

          {step === 3 && (
            <StepDeal
              form={form}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {/* =========================================
              STEP 4 — КАТЕГОРИЯ
          ========================================= */}

          {step === 4 && (
            <StepCategory
              form={form}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {/* =========================================
              STEP 5 — АДРЕС
          ========================================= */}

          {step === 5 && (
            <StepAddress
              form={form}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {/* =========================================
              STEP 6 — ТИП ОБЪЯВЛЕНИЯ
          ========================================= */}

          {step === 6 && (
            <StepListingType
              form={form}
              updateForm={updateForm}
              onBack={prevStep}
              onSubmit={submitProduct}
              isSubmitting={isSubmitting}
            />
          )}

          {/* =========================================
              MESSAGE
          ========================================= */}

          {submitMessage && (
            <div
              className={
                submitMessage.includes("успешно")
                  ? styles.successMessage
                  : styles.errorMessage
              }
            >
              {submitMessage}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
