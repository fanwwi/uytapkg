"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createListing, getConstants, uploadImage } from "@/utils/api";

import StepProgress from "./components/StepProgress/StepProgress";
import StepImage from "./components/StepImage/StepImage";
import StepLocation from "./components/StepLocation/StepLocation";
import StepDeal from "./components/StepDeal/StepDeal";
import StepCategory from "./components/StepCategory/StepCategory";
import StepAddress from "./components/StepAddress/StepAddress";
import StepListingType from "./components/StepListingType/StepListingType";

import styles from "./AddProduct.module.css";
import { House } from "lucide-react";
import Link from "next/link";

const initialForm = {
  title: "",
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
  beachDistance: "",
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
  const router = useRouter();
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
        router.push("/auth-required");
        return;
      }

      if (!form.title?.trim()) {
        throw new Error("Введите название объявления");
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

      // дальше твой код...

      // =========================
      // ЦЕНА
      // =========================

      const price = Number(form.price);
      let derivedPrice = 100000;

      if (price > 0) {
        derivedPrice = price;
      }

      // =========================
      // РАССТОЯНИЕ ДО ПЛЯЖА
      // =========================
      // Поле "Расстояние до пляжа" на шаге характеристик хранится в
      // form.beachDistance (одно значение), а не в form.beachDistanceFrom/To —
      // те поля никогда не заполняются ни одним компонентом формы.
      const beachDistanceValue =
        Number(form.beachDistance) > 0 ? Number(form.beachDistance) : null;

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

      const photos = [];
      for (const img of form.images || []) {
        if (img.file) {
          try {
            const uploadedUrl = await uploadImage(img.file);
            photos.push(uploadedUrl);
          } catch (e) {
            console.error("Failed to upload image:", img.file.name, e);
            throw new Error(
              `Не удалось загрузить фотографию ${img.file.name}: ${e.message}`,
            );
          }
        } else if (img.url && !img.url.startsWith("blob:")) {
          photos.push(img.url);
        }
      }

      // =========================
      // PAYLOAD
      // =========================

      // Разделение amenities на resort и general
      let isResortAmenity = false;
      if (form.amenities && form.amenities !== "Любые") {
        try {
          const constants = await getConstants();
          const resortList = constants?.amenities?.resort || [];
          isResortAmenity = resortList.includes(form.amenities);
        } catch (e) {
          console.error("Failed to fetch constants for amenities split", e);
        }
      }

      const payload = {
        title: form.title.trim(),
        description: derivedDescription,

        // Категория
        propertyType: form.category,

        // Сделка
        dealType: form.dealType,
        rentPeriod:
          form.dealType === "rent"
            ? form.rentalPeriod === "longTerm"
              ? "long_term"
              : form.rentalPeriod === "shortTerm"
                ? "weekly"
                : form.rentalPeriod || null
            : null,

        // Местоположение
        country: form.country || "Кыргызстан",
        region: form.country === "turkey" ? "TURKEY" : form.region || "BISHKEK",
        city:
          (form.country === "turkey"
            ? form.city
            : form.region === "BISHKEK" || form.region === "bishkek"
              ? "Бишкек"
              : form.settlement || form.city || form.location) || null,
        district: form.district || null,

        // Адрес
        address: form.address || null,
        latitude: form.latitude ?? null,
        longitude: form.longitude ?? null,

        // Цена
        price: derivedPrice,
        priceFrom: price > 0 ? price : null,
        priceTo: price > 0 ? price : null,
        currency: "USD",

        // Площадь
        area: form.area ? Number(form.area) : null,
        areaFrom: form.area ? Number(form.area) : null,
        areaTo: form.area ? Number(form.area) : null,

        // Расстояние до пляжа
        beachDistanceFrom: beachDistanceValue,
        beachDistanceTo: beachDistanceValue,

        // Застройщик / ЖК
        developerOrComplex: form.developerOrComplex || null,

        // Тип объявления
        listingType: form.listingType || "standard",

        // Фотографии
        photos,

        // Дополнительные параметры
        rooms: form.rooms ? Number(form.rooms) : null,
        floor: form.floor ? Number(form.floor) : null,
        totalFloors: form.floors ? Number(form.floors) : null,

        // Resort
        isResort: true,

        resortFilters: {
          beachDistanceFrom: beachDistanceValue,
          beachDistanceTo: beachDistanceValue,

          developerOrComplex: form.developerOrComplex || null,

          amenities: isResortAmenity ? [form.amenities] : [],
        },

        // Остальные характеристики
        features: {
          ...form,
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
          ceilingHeight: form.ceilingHeight || null,
          buildingType: form.buildingType || null,
          repair: form.repair || null,
          heating: form.heating || null,
          amenities:
            !isResortAmenity && form.amenities && form.amenities !== "Любые"
              ? [form.amenities]
              : [],
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

      // Перенаправляем пользователя в мои объявления
      router.push("/profile/ads");
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
        <Link href="/" className={styles.homeButton}>
          <House size={18} />
          На главную
        </Link>

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
