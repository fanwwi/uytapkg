"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createComplex, uploadImage } from "@/utils/api";

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
  ExternalLink,
  AlignLeft,
} from "lucide-react";

import styles from "./AddResidentialComplex.module.css";
import CustomSelectBlack from "@/components/ui/customSelectBlack/CustomSelectBlack";

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        throw new Error("Вы не авторизованы. Пожалуйста, войдите в аккаунт.");
      }

      if (!form.name.trim()) {
        throw new Error("Введите название жилого комплекса.");
      }

      if (!form.city.trim()) {
        throw new Error("Введите город.");
      }

      if (!form.address.trim()) {
        throw new Error("Введите адрес жилого комплекса.");
      }

      if (!form.documentsUrl.trim()) {
        throw new Error(
          "Добавьте ссылку на официальный паспорт или документы ЖК.",
        );
      }

      try {
        new URL(form.documentsUrl);
      } catch {
        throw new Error("Ссылка на документы должна быть корректным URL.");
      }

      /* =========================
         UPLOAD IMAGES
      ========================= */

      const uploadedUrls = [];

      for (const image of images) {
        try {
          const url = await uploadImage(image.file);

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

      /* =========================
         PAYLOAD
      ========================= */

      const payload = {
        name: form.name.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        description: form.description.trim(),

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

        documentsUrl: form.documentsUrl.trim(),
      };

      console.log("CREATE COMPLEX PAYLOAD:", payload);

      const res = await createComplex(token, payload);

      if (!res?.success) {
        throw new Error(res?.message || "Не удалось добавить жилой комплекс.");
      }

      router.push("/profile/projects");
    } catch (err) {
      console.error("Ошибка добавления ЖК:", err);

      setError(
        err?.message || "Произошла ошибка при сохранении жилого комплекса.",
      );
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
            <span>Назад в профиль</span>
          </button>

          <div className={styles.headerContent}>
            <div className={styles.eyebrow}>
              <Building2 size={16} />
              Панель застройщика
            </div>

            <h1>Добавить жилой комплекс</h1>

            <p>
              Заполните информацию о жилом комплексе, добавьте характеристики,
              инфраструктуру, фотографии и официальные документы.
            </p>
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

                <h2>Основная информация</h2>

                <p>Название, расположение и описание жилого комплекса.</p>
              </div>
            </div>

            <div className={styles.grid}>
              {/* NAME */}

              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="complex-name">
                  Название ЖК <span>*</span>
                </label>

                <div className={styles.inputWithIcon}>
                  <Building2 />

                  <input
                    id="complex-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Например: ЖК Ала-Тоо"
                    required
                  />
                </div>
              </div>

              {/* CITY */}

              <div className={styles.field}>
                <label htmlFor="complex-city">
                  Город <span>*</span>
                </label>

                <div className={styles.inputWithIcon}>
                  <MapPin />

                  <input
                    id="complex-city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Бишкек"
                    required
                  />
                </div>
              </div>

              {/* ADDRESS */}

              <div className={styles.field}>
                <label htmlFor="complex-address">
                  Адрес <span>*</span>
                </label>

                <div className={styles.inputWithIcon}>
                  <MapPin />

                  <input
                    id="complex-address"
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Улица, номер дома"
                    autoComplete="street-address"
                    required
                  />
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="complex-description">Описание</label>

                <div className={styles.textareaWrapper}>
                  <AlignLeft className={styles.textareaIcon} />

                  <textarea
                    id="complex-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Расскажите о концепции ЖК, архитектуре, расположении, инфраструктуре и преимуществах..."
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

                <h2>Характеристики комплекса</h2>

                <p>Основные параметры здания, территории и квартир.</p>
              </div>
            </div>

            <div className={styles.grid}>
              {/* STATUS */}

              <div className={styles.field}>
                <label>Статус строительства</label>

                <CustomSelectBlack
                  icon={Layers3}
                  title="Статус"
                  options={statuses}
                  value={form.status}
                  setValue={(value) => setField("status", value)}
                />
              </div>

              {/* CLASS */}

              <div className={styles.field}>
                <label>Класс жилья</label>

                <CustomSelectBlack
                  icon={Building2}
                  title="Класс"
                  options={classes}
                  value={form.class}
                  setValue={(value) => setField("class", value)}
                />
              </div>

              {/* CONSTRUCTION */}

              <div className={styles.field}>
                <label>Конструкция здания</label>

                <CustomSelectBlack
                  icon={Building2}
                  title="Конструкция"
                  options={constructions}
                  value={form.construction}
                  setValue={(value) => setField("construction", value)}
                />
              </div>

              {/* COMPLETION DATE */}

              <div className={styles.field}>
                <label htmlFor="completion-date">Дата сдачи</label>

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
                <label htmlFor="floors">Количество этажей</label>

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
                <label htmlFor="blocks">Количество блоков</label>

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
                <label htmlFor="apartments">Количество квартир</label>

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
                <label htmlFor="parking">Парковочных мест</label>

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
                <label htmlFor="ceiling-height">Высота потолков, м</label>

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
                <label htmlFor="area">Площадь комплекса, м²</label>

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
                <label htmlFor="area-sotka">Площадь территории, соток</label>

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

                <h2>Инфраструктура</h2>

                <p>Выберите объекты и удобства, доступные жителям.</p>
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

                    <span>{item}</span>
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

                <h2>Фотографии</h2>

                <p>Первое изображение станет главным фото жилого комплекса.</p>
              </div>
            </div>

            <div className={styles.uploadTop}>
              <div>
                <strong>Фотографии жилого комплекса</strong>

                <span>Добавьте фасад, территорию, дворы и инфраструктуру.</span>
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

                <strong>Добавить фотографии</strong>

                <span>PNG, JPG или WEBP · до {MAX_IMAGES} изображений</span>
              </label>
            )}

            {images.length === MAX_IMAGES && (
              <div className={styles.limitReached}>
                <Check />
                Максимальное количество фотографий добавлено
              </div>
            )}

            {images.length > 0 && (
              <div className={styles.images}>
                {images.map((image, index) => (
                  <div className={styles.image} key={image.url}>
                    <img src={image.url} alt={`Фото ЖК ${index + 1}`} />

                    {index === 0 && (
                      <span className={styles.cover}>Главное фото</span>
                    )}

                    <span className={styles.imageNumber}>{index + 1}</span>

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className={styles.removeImage}
                      aria-label={`Удалить фото ${index + 1}`}
                    >
                      <X />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =========================
              05 — ДОКУМЕНТЫ
          ========================= */}

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FileCheck />
              </div>

              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>05</span>

                <h2>Официальная информация</h2>

                <p>
                  Добавьте ссылку на официальный паспорт или документы
                  строительного объекта.
                </p>
              </div>
            </div>

            <div className={styles.documentForm}>
              <div className={styles.field}>
                <label htmlFor="complex-documents">
                  Ссылка на официальный паспорт / документы ЖК
                  <span>*</span>
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
                    required
                  />
                </div>

                <small className={styles.fieldHint}>
                  Укажите ссылку на официальный ресурс Министерства
                  строительства КР или другой официальный источник.
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
              Отмена
            </button>

            <button type="submit" className={styles.submit} disabled={loading}>
              <Building2 size={18} />

              {loading ? "Добавление..." : "Добавить ЖК"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
