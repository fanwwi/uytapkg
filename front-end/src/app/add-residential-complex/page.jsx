"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createComplex, uploadComplexPhoto } from "@/utils/api";

import {
  ArrowLeft,
  Building2,
  MapPin,
  ImagePlus,
  X,
  Check,
  Layers3,
  Home,
  Car,
  CalendarDays,
  Ruler,
  Upload,
  Maximize,
  Blocks,
  FileCheck,
  AlignLeft,
} from "lucide-react";

import styles from "./AddResidentialComplex.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";
import { useLanguage } from "@/context/LanguageContext";
import LoadingScreen from "@/components/ui/loadingScreen/LoadingScreen";

const statuses = ["Проект", "Строительство", "Сдан"];

const classes = ["Эконом", "Комфорт", "Бизнес", "Премиум"];

const constructions = [
  "Монолит",
  "Монолитно-каркасный",
  "Кирпичный",
  "Панельный",
  "Газобетон",
  "Комбинированный",
];

const amenities = [
  "Детская площадка",
  "Парковка",
  "Подземный паркинг",
  "Закрытая территория",
  "Охрана",
  "Видеонаблюдение",
  "Лифт",
  "Детский сад",
  "Школа",
  "Фитнес-зал",
  "Зеленая зона",
  "Коммерческие помещения",
];

const MAX_IMAGES = 20;

export default function AddResidentialComplex() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    city: "Бишкек",
    address: "",
    description: "",

    status: "Строительство",
    class: "Комфорт",
    construction: "Монолитно-каркасный",
    completionDate: "",

    floors: "",
    blocks: "",
    apartments: "",
    parking: "",
    ceilingHeight: "",

    area: "",
    areaSotka: "",

    documentsUrl: "",
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);

  const getTranslation = (key, fallback) => {
    const translated = t(key);

    return translated === key ? fallback : translated;
  };

  const getStatusLabel = (value) =>
    getTranslation(`addResidentialComplex.options.status.${value}`, value);

  const getClassLabel = (value) =>
    getTranslation(`addResidentialComplex.options.class.${value}`, value);

  const getConstructionLabel = (value) =>
    getTranslation(
      `addResidentialComplex.options.construction.${value}`,
      value,
    );

  const getAmenityLabel = (value) =>
    getTranslation(`addResidentialComplex.amenities.items.${value}`, value);

  const translatedStatuses = statuses.map((value) => ({
    value,
    label: getStatusLabel(value),
  }));

  const translatedClasses = classes.map((value) => ({
    value,
    label: getClassLabel(value),
  }));

  const translatedConstructions = constructions.map((value) => ({
    value,
    label: getConstructionLabel(value),
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const setField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const toggleAmenity = (item) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const availableSlots = MAX_IMAGES - images.length;

    if (availableSlots <= 0) {
      e.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, availableSlots);

    const newImages = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const image = prev[index];

      if (image?.url) {
        URL.revokeObjectURL(image.url);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("uytap_token");

      if (!token) {
        throw new Error(t("addResidentialComplex.errors.unauthorized"));
      }

      if (!form.name.trim()) {
        throw new Error(t("addResidentialComplex.errors.nameRequired"));
      }

      if (!form.city.trim()) {
        throw new Error(t("addResidentialComplex.errors.cityRequired"));
      }

      if (!form.address.trim()) {
        throw new Error(t("addResidentialComplex.errors.addressRequired"));
      }

      if (form.documentsUrl.trim()) {
        try {
          new URL(form.documentsUrl.trim());
        } catch {
          throw new Error(
            t("addResidentialComplex.errors.invalidDocumentsUrl"),
          );
        }
      }

      /*
       * =========================
       * UPLOAD IMAGES
       * =========================
       */

      const uploadedUrls = [];

      for (const image of images) {
        try {
          const url = await uploadComplexPhoto(token, image.file);

          if (url) {
            uploadedUrls.push(url);
          }
        } catch (uploadError) {
          console.error(
            `Ошибка загрузки изображения ${image.file.name}:`,
            uploadError,
          );
        }
      }

      /*
       * =========================
       * PAYLOAD
       * =========================
       */

      const payload = {
        name: form.name.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        description: form.description.trim(),

        /*
         * ВАЖНО:
         * Эти значения оставляем каноническими.
         * Переводятся только labels в UI.
         */
        status: form.status,
        class: form.class,
        construction: form.construction,

        completionDate: form.completionDate || null,

        floors: form.floors ? Number(form.floors) : 0,
        blocks: form.blocks ? Number(form.blocks) : 0,
        apartments: form.apartments ? Number(form.apartments) : 0,
        parking: form.parking ? Number(form.parking) : 0,

        ceilingHeight: form.ceilingHeight ? Number(form.ceilingHeight) : 0,

        area: form.area ? Number(form.area) : 0,
        areaSotka: form.areaSotka ? Number(form.areaSotka) : 0,

        amenities: selectedAmenities,
        images: uploadedUrls,

        documentsUrl: form.documentsUrl.trim() || null,
      };

      console.log("CREATE COMPLEX PAYLOAD:", payload);

      const res = await createComplex(token, payload);

      if (!res?.success) {
        throw new Error(
          res?.message || t("addResidentialComplex.errors.createFailed"),
        );
      }

      router.push("/profile/projects");
    } catch (err) {
      console.error("Ошибка добавления ЖК:", err);

      setError(err?.message || t("addResidentialComplex.errors.saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGlowTwo} />

      <div className={styles.container}>
        {/* =========================
            HEADER
        ========================= */}

        <header className={styles.header}>
          <button
            type="button"
            className={styles.back}
            onClick={() => router.push("/profile")}
          >
            <ArrowLeft size={18} />
            <span>{t("addResidentialComplex.backToProfile")}</span>
          </button>

          <div className={styles.headerContent}>
            <div className={styles.eyebrow}>
              <Building2 size={16} />
              {t("addResidentialComplex.developerPanel")}
            </div>

            <h1>{t("addResidentialComplex.title")}</h1>

            <p>{t("addResidentialComplex.description")}</p>
          </div>
        </header>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className={styles.error}>
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* =========================
              01 — ОСНОВНАЯ ИНФОРМАЦИЯ
          ========================= */}

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Building2 />
              </div>

              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>01</span>

                <h2>{t("addResidentialComplex.sections.basic.title")}</h2>

                <p>{t("addResidentialComplex.sections.basic.description")}</p>
              </div>
            </div>

            <div className={styles.grid}>
              {/* NAME */}

              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="complex-name">
                  {t("addResidentialComplex.fields.name")} <span>*</span>
                </label>

                <div className={styles.inputWithIcon}>
                  <Building2 />

                  <input
                    id="complex-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t("addResidentialComplex.placeholders.name")}
                    required
                  />
                </div>
              </div>

              {/* CITY */}

              <div className={styles.field}>
                <label htmlFor="complex-city">
                  {t("addResidentialComplex.fields.city")} <span>*</span>
                </label>

                <div className={styles.inputWithIcon}>
                  <MapPin />

                  <input
                    id="complex-city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    placeholder={t("addResidentialComplex.placeholders.city")}
                    required
                  />
                </div>
              </div>

              {/* ADDRESS */}

              <div className={styles.field}>
                <label htmlFor="complex-address">
                  {t("addResidentialComplex.fields.address")} <span>*</span>
                </label>

                <div className={styles.inputWithIcon}>
                  <MapPin />

                  <input
                    id="complex-address"
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    placeholder={t(
                      "addResidentialComplex.placeholders.address",
                    )}
                    autoComplete="street-address"
                    required
                  />
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="complex-description">
                  {t("addResidentialComplex.fields.description")}
                </label>

                <div className={styles.textareaWrapper}>
                  <AlignLeft className={styles.textareaIcon} />

                  <textarea
                    id="complex-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder={t(
                      "addResidentialComplex.placeholders.description",
                    )}
                    rows={7}
                    maxLength={1000}
                  />

                  <span className={styles.counter}>
                    {form.description.length}/1000
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              02 — ХАРАКТЕРИСТИКИ
          ========================= */}

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Layers3 />
              </div>

              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>02</span>

                <h2>
                  {t("addResidentialComplex.sections.characteristics.title")}
                </h2>

                <p>
                  {t(
                    "addResidentialComplex.sections.characteristics.description",
                  )}
                </p>
              </div>
            </div>

            <div className={styles.grid}>
              {/* STATUS */}

              <div className={styles.field}>
                <label>{t("addResidentialComplex.fields.status")}</label>

                <CustomSelect
                  icon={Layers3}
                  title={t("addResidentialComplex.selectTitles.status")}
                  options={translatedStatuses}
                  value={form.status}
                  setValue={(value) => setField("status", value)}
                />
              </div>

              {/* CLASS */}

              <div className={styles.field}>
                <label>{t("addResidentialComplex.fields.class")}</label>

                <CustomSelect
                  icon={Building2}
                  title={t("addResidentialComplex.selectTitles.class")}
                  options={translatedClasses}
                  value={form.class}
                  setValue={(value) => setField("class", value)}
                />
              </div>

              {/* CONSTRUCTION */}

              <div className={styles.field}>
                <label>{t("addResidentialComplex.fields.construction")}</label>

                <CustomSelect
                  icon={Building2}
                  title={t("addResidentialComplex.selectTitles.construction")}
                  options={translatedConstructions}
                  value={form.construction}
                  setValue={(value) => setField("construction", value)}
                />
              </div>

              {/* COMPLETION DATE */}

              <div className={styles.field}>
                <label htmlFor="completion-date">
                  {t("addResidentialComplex.fields.completionDate")}
                </label>

                <div className={styles.inputWithIcon}>
                  <CalendarDays />

                  <input
                    id="completion-date"
                    type="date"
                    name="completionDate"
                    value={form.completionDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* FLOORS */}

              <div className={styles.field}>
                <label htmlFor="floors">
                  {t("addResidentialComplex.fields.floors")}
                </label>

                <div className={styles.inputWithIcon}>
                  <Layers3 />

                  <input
                    id="floors"
                    type="number"
                    name="floors"
                    value={form.floors}
                    onChange={handleChange}
                    placeholder="12"
                    min="1"
                  />
                </div>
              </div>

              {/* BLOCKS */}

              <div className={styles.field}>
                <label htmlFor="blocks">
                  {t("addResidentialComplex.fields.blocks")}
                </label>

                <div className={styles.inputWithIcon}>
                  <Blocks />

                  <input
                    id="blocks"
                    type="number"
                    name="blocks"
                    value={form.blocks}
                    onChange={handleChange}
                    placeholder="4"
                    min="1"
                  />
                </div>
              </div>

              {/* APARTMENTS */}

              <div className={styles.field}>
                <label htmlFor="apartments">
                  {t("addResidentialComplex.fields.apartments")}
                </label>

                <div className={styles.inputWithIcon}>
                  <Home />

                  <input
                    id="apartments"
                    type="number"
                    name="apartments"
                    value={form.apartments}
                    onChange={handleChange}
                    placeholder="240"
                    min="0"
                  />
                </div>
              </div>

              {/* PARKING */}

              <div className={styles.field}>
                <label htmlFor="parking">
                  {t("addResidentialComplex.fields.parking")}
                </label>

                <div className={styles.inputWithIcon}>
                  <Car />

                  <input
                    id="parking"
                    type="number"
                    name="parking"
                    value={form.parking}
                    onChange={handleChange}
                    placeholder="120"
                    min="0"
                  />
                </div>
              </div>

              {/* CEILING */}

              <div className={styles.field}>
                <label htmlFor="ceiling-height">
                  {t("addResidentialComplex.fields.ceilingHeight")}
                </label>

                <div className={styles.inputWithIcon}>
                  <Maximize />

                  <input
                    id="ceiling-height"
                    type="number"
                    name="ceilingHeight"
                    value={form.ceilingHeight}
                    onChange={handleChange}
                    placeholder="2.8"
                    min="1"
                    step="0.1"
                  />
                </div>
              </div>

              {/* AREA */}

              <div className={styles.field}>
                <label htmlFor="area">
                  {t("addResidentialComplex.fields.area")}
                </label>

                <div className={styles.inputWithIcon}>
                  <Ruler />

                  <input
                    id="area"
                    type="number"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    placeholder="25000"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* AREA SOTKA */}

              <div className={styles.field}>
                <label htmlFor="area-sotka">
                  {t("addResidentialComplex.fields.areaSotka")}
                </label>

                <div className={styles.inputWithIcon}>
                  <Ruler />

                  <input
                    id="area-sotka"
                    type="number"
                    name="areaSotka"
                    value={form.areaSotka}
                    onChange={handleChange}
                    placeholder="250"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              03 — ИНФРАСТРУКТУРА
          ========================= */}

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Check />
              </div>

              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>03</span>

                <h2>
                  {t("addResidentialComplex.sections.infrastructure.title")}
                </h2>

                <p>
                  {t(
                    "addResidentialComplex.sections.infrastructure.description",
                  )}
                </p>
              </div>
            </div>

            <div className={styles.amenities}>
              {amenities.map((item) => {
                const active = selectedAmenities.includes(item);

                return (
                  <button
                    type="button"
                    key={item}
                    className={`${styles.amenity} ${
                      active ? styles.amenityActive : ""
                    }`}
                    onClick={() => toggleAmenity(item)}
                    aria-pressed={active}
                  >
                    <span className={styles.amenityCheck}>
                      {active && <Check size={14} />}
                    </span>

                    <span>{getAmenityLabel(item)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* =========================
              04 — ФОТОГРАФИИ
          ========================= */}

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <ImagePlus />
              </div>

              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>04</span>

                <h2>{t("addResidentialComplex.sections.photos.title")}</h2>

                <p>{t("addResidentialComplex.sections.photos.description")}</p>
              </div>
            </div>

            <div className={styles.uploadTop}>
              <div>
                <strong>{t("addResidentialComplex.photos.title")}</strong>

                <span>{t("addResidentialComplex.photos.description")}</span>
              </div>

              <div className={styles.imageCount}>
                {images.length} / {MAX_IMAGES}
              </div>
            </div>

            {images.length < MAX_IMAGES && (
              <label className={styles.upload}>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleImages}
                />

                <div className={styles.uploadIcon}>
                  <Upload />
                </div>

                <strong>{t("addResidentialComplex.photos.add")}</strong>

                <span>
                  {t("addResidentialComplex.photos.formats")} ·{" "}
                  {t("addResidentialComplex.photos.upTo")} {MAX_IMAGES}{" "}
                  {t("addResidentialComplex.photos.images")}
                </span>
              </label>
            )}

            {images.length === MAX_IMAGES && (
              <div className={styles.limitReached}>
                <Check />
                {t("addResidentialComplex.photos.limitReached")}
              </div>
            )}

            {images.length > 0 && (
              <div className={styles.images}>
                {images.map((image, index) => (
                  <div className={styles.image} key={image.url}>
                    <img
                      src={image.url}
                      alt={`${t(
                        "addResidentialComplex.photos.photoAlt",
                      )} ${index + 1}`}
                    />

                    {index === 0 && (
                      <span className={styles.cover}>
                        {t("addResidentialComplex.photos.cover")}
                      </span>
                    )}

                    <span className={styles.imageNumber}>{index + 1}</span>

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className={styles.removeImage}
                      aria-label={`${t(
                        "addResidentialComplex.photos.remove",
                      )} ${index + 1}`}
                    >
                      <X />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =========================
              05 — ОФИЦИАЛЬНАЯ ИНФОРМАЦИЯ
          ========================= */}

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FileCheck />
              </div>

              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>05</span>

                <h2>{t("addResidentialComplex.sections.official.title")}</h2>

                <p>
                  {t("addResidentialComplex.sections.official.description")}
                </p>
              </div>
            </div>

            <div className={styles.documentForm}>
              <div className={styles.field}>
                <label htmlFor="complex-documents">
                  {t("addResidentialComplex.fields.documentsUrl")}
                </label>

                <div className={styles.inputWithIcon}>
                  <FileCheck />

                  <input
                    id="complex-documents"
                    name="documentsUrl"
                    type="url"
                    value={form.documentsUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>

                <small className={styles.fieldHint}>
                  {t("addResidentialComplex.fields.documentsHint")}
                </small>
              </div>
            </div>
          </section>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancel}
              onClick={() => router.push("/profile")}
              disabled={loading}
            >
              {t("common.cancel")}
            </button>

            <button type="submit" className={styles.submit} disabled={loading}>
              <Building2 size={18} />

              {loading ? <LoadingScreen /> : <LoadingScreen />}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
