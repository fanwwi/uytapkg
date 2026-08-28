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
  price: "",

  // =========================
  // ПЛОЩАДЬ
  // =========================
  areaFrom: "",
  areaTo: "",
  area: "",

  // =========================
  // ИССЫК-КУЛЬ
  // =========================
  beachDistance: "",

  // =========================
  // ЗАСТРОЙЩИК / ЖК
  // =========================
  developerOrComplex: "",

  // =========================
  // ХАРАКТЕРИСТИКИ
  // =========================
  series: "",
  rooms: "",
  floor: "",
  condition: "",
  walls: "",
  heating: "",
  documents: "",
  furniture: "",

  houseType: "",
  floors: "",
  sewerage: "",
  water: "",
  electricity: "",

  purpose: "",
  fence: "",
  terrain: "",
  communications: "",

  roomsInApartment: "",
  privateBathroom: "",

  premisesType: "",
  technicalParameters: "",
  firstLine: "",
  separateEntrance: "",
  rentalBusiness: "",

  ceilingHeight: "",
  parkingType: "",
  material: "",
  security: "",
  gates: "",
  inspectionPit: "",
  basement: "",
  truckAccess: "",
  gateType: "",

  offerType: "",

  // =========================
  // УДОБСТВА
  // МУЛЬТИВЫБОР
  // =========================
  amenities: [],

  // =========================
  // ДОПОЛНИТЕЛЬНЫЕ
  // =========================
  wifi: "",
  pool: "",
  bath: "",
  view: "",
  parking: "",
  beach: "",
  pets: "",
  children: "",
  buildingType: "",
  repair: "",

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

  // =========================
  // ОПИСАНИЕ
  // =========================
  description: "",
};

export default function AddProductPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // У тебя 6 шагов:
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

      // =========================
      // ВАЛИДАЦИЯ
      // =========================

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

      // =========================
      // ЦЕНА
      // =========================

      const price = Number(form.price);

      const derivedPrice = price > 0 ? price : 100000;

      // =========================
      // ПЛОЩАДЬ
      // =========================

      const area = Number(form.area);

      const derivedArea = area > 0 ? area : null;

      // =========================
      // РАССТОЯНИЕ ДО ПЛЯЖА
      // ТОЛЬКО ДЛЯ ИССЫК-КУЛЯ
      // =========================

      const isIssykKul =
        form.region === "ISSYK_KUL" ||
        form.region === "issykKul" ||
        form.region === "ISSYK-KUL" ||
        form.region === "issyk-kul";

      const beachDistanceValue =
        isIssykKul && Number(form.beachDistance) > 0
          ? Number(form.beachDistance)
          : null;

      // =========================
      // НАЗВАНИЕ КАТЕГОРИИ
      // =========================

      const categoryTitles = {
        apartment: "квартиры",
        house: "дома",
        cottage: "коттеджа",
        land: "участка",
        room: "комнаты",
        commercial: "коммерческого помещения",
        parking: "паркинга",
      };

      const categoryTitle =
        categoryTitles[form.category] || "объекта недвижимости";

      // =========================
      // ОПИСАНИЕ
      // =========================

      const locationText =
        form.location ||
        form.city ||
        form.settlement ||
        form.region ||
        "Кыргызстан";

      const generatedDescription = [
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

      const description = form.description?.trim() || generatedDescription;

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
              `Не удалось загрузить фотографию ${img.file.name}: ${
                e.message || "неизвестная ошибка"
              }`,
            );
          }
        } else if (img.url && !img.url.startsWith("blob:")) {
          photos.push(img.url);
        }
      }

      // =========================
      // УДОБСТВА
      // =========================
      //
      // Теперь amenities — массив.
      //
      // Например:
      // [
      //   "Балкон/Лоджия",
      //   "Лифт",
      //   "Парковка"
      // ]
      //
      const selectedAmenities = Array.isArray(form.amenities)
        ? form.amenities.filter((item) => item && item !== "Любые")
        : form.amenities && form.amenities !== "Любые"
          ? [form.amenities]
          : [];

      // =========================
      // CONSTANTS
      // =========================

      let resortAmenities = [];

      try {
        const constants = await getConstants();

        const data = constants?.data || constants;

        resortAmenities = data?.amenities?.resort || [];
      } catch (e) {
        console.error("Failed to fetch constants for amenities split", e);
      }

      // Разделяем выбранные удобства:
      //
      // resortAmenities → курортные удобства
      // остальные → обычные
      //
      const resortSelectedAmenities = selectedAmenities.filter((amenity) =>
        resortAmenities.includes(amenity),
      );

      const generalSelectedAmenities = selectedAmenities.filter(
        (amenity) => !resortAmenities.includes(amenity),
      );

      // =========================
      // FEATURES
      // =========================

      const features = {
        // Общие характеристики
        series: form.series || null,
        rooms: form.rooms ? Number(form.rooms) : null,
        floor: form.floor || null,
        condition: form.condition || null,
        walls: form.walls || null,
        heating: form.heating || null,
        documents: form.documents || null,
        furniture: form.furniture || null,
        offerType: form.offerType || null,

        // Дом
        houseType: form.houseType || null,
        floors: form.floors || null,
        sewerage: form.sewerage || null,
        water: form.water || null,
        electricity: form.electricity || null,

        // Участок
        purpose: form.purpose || null,
        fence: form.fence || null,
        location: form.location || null,
        terrain: form.terrain || null,
        communications: form.communications || null,

        // Комната
        roomsInApartment: form.roomsInApartment
          ? Number(form.roomsInApartment)
          : null,

        privateBathroom: form.privateBathroom || null,

        // Коммерция
        premisesType: form.premisesType || null,
        technicalParameters: form.technicalParameters || null,
        firstLine: form.firstLine || null,
        separateEntrance: form.separateEntrance || null,
        rentalBusiness: form.rentalBusiness || null,

        // Паркинг / гараж
        ceilingHeight: form.ceilingHeight || null,
        parkingType: form.parkingType || null,
        material: form.material || null,
        security: form.security || null,
        gates: form.gates || null,
        inspectionPit: form.inspectionPit || null,
        basement: form.basement || null,
        truckAccess: form.truckAccess || null,
        gateType: form.gateType || null,

        // Дополнительные
        wifi: form.wifi || null,
        pool: form.pool || null,
        bath: form.bath || null,
        view: form.view || null,
        parking: form.parking || null,
        beach: form.beach || null,
        pets: form.pets || null,
        children: form.children || null,
        buildingType: form.buildingType || null,
        repair: form.repair || null,

        // Все выбранные общие удобства
        amenities: generalSelectedAmenities,
      };

      // =========================
      // PAYLOAD
      // =========================

      const payload = {
        // =========================
        // ОСНОВНОЕ
        // =========================

        title: form.title.trim(),

        description,

        propertyType: form.category,

        // =========================
        // СДЕЛКА
        // =========================

        dealType: form.dealType,

        rentPeriod:
          form.dealType === "rent"
            ? form.rentalPeriod === "longTerm"
              ? "long_term"
              : form.rentalPeriod === "shortTerm"
                ? "weekly"
                : form.rentalPeriod || null
            : null,

        // =========================
        // МЕСТОПОЛОЖЕНИЕ
        // =========================

        country: form.country || "Кыргызстан",

        region: form.country === "turkey" ? "TURKEY" : form.region || "BISHKEK",

        city:
          (form.country === "turkey"
            ? form.city
            : form.region === "BISHKEK" || form.region === "bishkek"
              ? "Бишкек"
              : form.settlement || form.city || form.location) || null,

        district: form.district || null,

        // =========================
        // АДРЕС
        // =========================

        address: form.address || null,

        latitude: form.latitude ?? null,

        longitude: form.longitude ?? null,

        // =========================
        // ЦЕНА
        // =========================

        price: derivedPrice,

        priceFrom: price > 0 ? price : null,

        priceTo: price > 0 ? price : null,

        currency: "USD",

        // =========================
        // ПЛОЩАДЬ
        // =========================

        area: derivedArea,

        areaFrom: derivedArea,

        areaTo: derivedArea,

        // =========================
        // ИССЫК-КУЛЬ
        // =========================

        beachDistanceFrom: beachDistanceValue,

        beachDistanceTo: beachDistanceValue,

        // =========================
        // ЗАСТРОЙЩИК / ЖК
        // =========================

        developerOrComplex: form.developerOrComplex || null,

        // =========================
        // ТИП РАЗМЕЩЕНИЯ
        // =========================

        listingType: form.listingType || "standard",

        // =========================
        // ФОТО
        // =========================

        photos,

        // =========================
        // ОСНОВНЫЕ ПАРАМЕТРЫ
        // =========================

        rooms: form.rooms ? Number(form.rooms) : null,

        floor: form.floor ? Number(form.floor) : null,

        totalFloors: form.floors ? Number(form.floors) : null,

        // =========================
        // FEATURES
        // =========================

        features,

        // =========================
        // RESORT
        // =========================

        isResort: isIssykKul,

        resortFilters: {
          beachDistanceFrom: beachDistanceValue,

          beachDistanceTo: beachDistanceValue,

          developerOrComplex: form.developerOrComplex || null,

          amenities: resortSelectedAmenities,
        },
      };

      console.log("📦 Данные объявления:", payload);

      // =========================
      // СОЗДАНИЕ ОБЪЯВЛЕНИЯ
      // =========================

      const result = await createListing(token, payload);

      setSubmitMessage(result?.message || "Объявление успешно опубликовано");

      // =========================
      // ОЧИСТКА BLOB URL
      // =========================

      form.images?.forEach((image) => {
        if (image?.url?.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });

      // =========================
      // RESET
      // =========================

      setForm(initialForm);

      setStep(1);

      // =========================
      // REDIRECT
      // =========================

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
