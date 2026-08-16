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
} from "lucide-react";

import styles from "./AddResidentialComplex.module.css";
import CustomSelectBlack from "@/components/ui/customSelectBlack/CustomSelectBlack";

const statuses = ["Проект", "Строительство", "Сдан"];

const classes = ["Эконом", "Комфорт", "Бизнес", "Премиум"];

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
    address: "",
    city: "Бишкек",
    description: "",
    status: "Строительство",
    class: "Комфорт",
    completionDate: "",
    floors: "",
    apartments: "",
    parking: "",
    area: "",
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function setField(name, value) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function toggleAmenity(item) {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  }

  function handleImages(e) {
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
  }

  function removeImage(index) {
    setImages((prev) => {
      const image = prev[index];

      if (image?.url) {
        URL.revokeObjectURL(image.url);
      }

      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("uytap_token");
      if (!token) {
        throw new Error("Вы не авторизованы. Пожалуйста, войдите в аккаунт.");
      }

      // 1. Загружаем все изображения
      const uploadedUrls = [];
      for (const img of images) {
        try {
          const url = await uploadImage(img.file);
          if (url) {
            uploadedUrls.push(url);
          }
        } catch (uploadErr) {
          console.error("Ошибка загрузки изображения:", img.file.name, uploadErr);
        }
      }

      // 2. Создаем ЖК
      const payload = {
        ...form,
        amenities: selectedAmenities,
        images: uploadedUrls,
      };

      const res = await createComplex(token, payload);
      if (!res.success) {
        throw new Error(res.message || "Не удалось добавить жилой комплекс");
      }

      // Перенаправляем в личный кабинет
      router.push("/profile");
    } catch (err) {
      console.error("Error adding complex:", err);
      setError(err.message || "Произошла ошибка при сохранении ЖК");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGlowTwo} />

      <div className={styles.container}>
        {/* HEADER */}

        <header className={styles.header}>
          <a href="/profile" className={styles.back}>
            <ArrowLeft />
            <span>Назад</span>
          </a>

          <div className={styles.headerContent}>
            <span className={styles.eyebrow}>
              <Building2 />
              Застройщик
            </span>

            <h1>Добавить жилой комплекс</h1>

            <p>
              Заполните информацию о ЖК, добавьте характеристики, инфраструктуру
              и фотографии.
            </p>
          </div>
        </header>

        {error && (
          <div style={{ color: "#e53e3e", background: "#fed7d7", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", border: "1px solid #feb2b2" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* MAIN INFORMATION */}

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Building2 />
              </div>

              <div>
                <span className={styles.sectionNumber}>01</span>
                <h2>Основная информация</h2>
                <p>Название, расположение и описание жилого комплекса.</p>
              </div>
            </div>

            <div className={styles.grid}>
              <div className={`${styles.field} ${styles.fieldLarge}`}>
                <label>
                  Название ЖК <span>*</span>
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Например: ЖК Ала-Тоо"
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Город</label>

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Бишкек"
                />
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label>
                  Адрес <span>*</span>
                </label>

                <div className={styles.inputWithIcon}>
                  <MapPin />

                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Улица, номер дома"
                    required
                  />
                </div>
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label>Описание</label>

                <div className={styles.textareaWrapper}>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Расскажите о жилом комплексе, его концепции, расположении и преимуществах..."
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

          {/* CHARACTERISTICS */}

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Layers3 />
              </div>

              <div>
                <span className={styles.sectionNumber}>02</span>
                <h2>Характеристики</h2>
                <p>Основные параметры и статус строительства.</p>
              </div>
            </div>

            <div className={styles.grid}>
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

              <div className={styles.field}>
                <label>Дата сдачи</label>

                <div className={styles.inputWithIcon}>
                  <CalendarDays />

                  <input
                    type="date"
                    name="completionDate"
                    value={form.completionDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Количество этажей</label>

                <div className={styles.inputWithIcon}>
                  <Layers3 />

                  <input
                    type="number"
                    name="floors"
                    value={form.floors}
                    onChange={handleChange}
                    placeholder="12"
                    min="1"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Количество квартир</label>

                <div className={styles.inputWithIcon}>
                  <Home />

                  <input
                    type="number"
                    name="apartments"
                    value={form.apartments}
                    onChange={handleChange}
                    placeholder="240"
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Парковочных мест</label>

                <div className={styles.inputWithIcon}>
                  <Car />

                  <input
                    type="number"
                    name="parking"
                    value={form.parking}
                    onChange={handleChange}
                    placeholder="120"
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Площадь территории, м²</label>

                <div className={styles.inputWithIcon}>
                  <Ruler />

                  <input
                    type="number"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    placeholder="25000"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* AMENITIES */}

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Check />
              </div>

              <div>
                <span className={styles.sectionNumber}>03</span>
                <h2>Инфраструктура</h2>
                <p>Отметьте всё, что предусмотрено в жилом комплексе.</p>
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
                  >
                    <span className={styles.amenityCheck}>
                      {active && <Check />}
                    </span>

                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* PHOTOS */}

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <ImagePlus />
              </div>

              <div>
                <span className={styles.sectionNumber}>04</span>

                <h2>Фотографии</h2>

                <p>
                  Первое изображение будет использоваться как главное фото ЖК.
                </p>
              </div>
            </div>

            <div className={styles.uploadTop}>
              <div>
                <strong>Фотографии жилого комплекса</strong>

                <span>Можно добавить до {MAX_IMAGES} изображений.</span>
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

                <span>PNG, JPG или WEBP · максимум {MAX_IMAGES} файлов</span>
              </label>
            )}

            {images.length === MAX_IMAGES && (
              <div className={styles.limitReached}>
                <Check />
                Вы добавили максимальное количество фотографий
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
                      aria-label="Удалить фото"
                    >
                      <X />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ACTIONS */}

          <div className={styles.formActions}>
            <a href="/profile" className={styles.cancel}>
              Отмена
            </a>

            <button type="submit" className={styles.submit} disabled={loading}>
              <Building2 />
              {loading ? "Добавление..." : "Добавить ЖК"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
