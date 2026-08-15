"use client";

import { useEffect, useState } from "react";
import {
  X,
  Building2,
  MapPin,
  Layers3,
  Home,
  Car,
  CalendarDays,
  Ruler,
  Check,
  ImagePlus,
  Upload,
  Trash2,
} from "lucide-react";

import styles from "./EditResidentialComplexModal.module.css";
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

const initialForm = {
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
};

export default function EditResidentialComplexModal({
  complex,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(initialForm);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!complex) return;

    setForm({
      name: complex.name || "",
      address: complex.address || "",
      city: complex.city || "Бишкек",
      description: complex.description || "",
      status: complex.status || "Строительство",
      class: complex.class || "Комфорт",
      completionDate: complex.completionDate || "",
      floors: complex.floors ?? "",
      apartments: complex.apartments ?? "",
      parking: complex.parking ?? "",
      area: complex.area ?? "",
    });

    setSelectedAmenities(complex.amenities || []);

    setImages(
      (complex.images || []).map((image) => ({
        file: null,
        url: image,
      })),
    );
  }, [complex]);

  useEffect(() => {
    if (!complex) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [complex, onClose]);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image?.file && image?.url?.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, []);

  if (!complex) return null;

  function handleChange(event) {
    const { name, value } = event.target;

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
      prev.includes(item)
        ? prev.filter((value) => value !== item)
        : [...prev, item],
    );
  }

  function handleImages(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const availableSlots = MAX_IMAGES - images.length;

    if (availableSlots <= 0) {
      event.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, availableSlots);

    const newImages = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    event.target.value = "";
  }

  function removeImage(index) {
    setImages((prev) => {
      const image = prev[index];

      if (image?.file && image?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(image.url);
      }

      return prev.filter((_, imageIndex) => imageIndex !== index);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const updatedComplex = {
      ...complex,
      ...form,

      floors: Number(form.floors) || 0,
      apartments: Number(form.apartments) || 0,
      parking: Number(form.parking) || 0,
      area: Number(form.area) || 0,

      amenities: selectedAmenities,

      images: images.map((image) => image.url),
    };

    onSave(updatedComplex);
  }

  function handleOverlayMouseDown(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayMouseDown}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-residential-complex-title"
      >
        {/* HEADER */}

        <header className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <span className={styles.eyebrow}>
              <Building2 />
              Редактирование ЖК
            </span>

            <h2 id="edit-residential-complex-title">
              {complex.name || "Жилой комплекс"}
            </h2>

            <p>Измените информацию о жилом комплексе и сохраните обновления.</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X />
          </button>
        </header>

        {/* SCROLL AREA */}

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* 01 — BASIC INFO */}

            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <Building2 />
                </div>

                <div>
                  <span>01</span>
                  <h3>Основная информация</h3>
                </div>
              </div>

              <div className={styles.grid}>
                <div className={`${styles.field} ${styles.full}`}>
                  <label htmlFor="complex-name">
                    Название ЖК <b>*</b>
                  </label>

                  <input
                    id="complex-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Введите название жилого комплекса"
                    autoComplete="off"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="complex-city">Город</label>

                  <input
                    id="complex-city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Город"
                    autoComplete="address-level2"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="complex-address">
                    Адрес <b>*</b>
                  </label>

                  <div className={styles.inputWithIcon}>
                    <MapPin />

                    <input
                      id="complex-address"
                      name="address"
                      type="text"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Введите адрес"
                      autoComplete="street-address"
                      required
                    />
                  </div>
                </div>

                <div className={`${styles.field} ${styles.full}`}>
                  <label htmlFor="complex-description">Описание</label>

                  <textarea
                    id="complex-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Расскажите о жилом комплексе..."
                    rows={5}
                    maxLength={1000}
                  />

                  <span className={styles.counter}>
                    {form.description.length}/1000
                  </span>
                </div>
              </div>
            </section>

            {/* 02 — CHARACTERISTICS */}

            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <Layers3 />
                </div>

                <div>
                  <span>02</span>
                  <h3>Характеристики</h3>
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.field}>
                  <label>Статус</label>

                  <CustomSelectBlack
                    icon={Layers3}
                    title="Статус"
                    options={statuses}
                    value={form.status}
                    setValue={(value) => setField("status", value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>Класс</label>

                  <CustomSelectBlack
                    icon={Building2}
                    title="Класс"
                    options={classes}
                    value={form.class}
                    setValue={(value) => setField("class", value)}
                  />
                </div>

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

                <div className={styles.field}>
                  <label htmlFor="complex-floors">Этажей</label>

                  <div className={styles.inputWithIcon}>
                    <Layers3 />

                    <input
                      id="complex-floors"
                      type="number"
                      name="floors"
                      value={form.floors}
                      onChange={handleChange}
                      min="1"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="complex-apartments">Квартир</label>

                  <div className={styles.inputWithIcon}>
                    <Home />

                    <input
                      id="complex-apartments"
                      type="number"
                      name="apartments"
                      value={form.apartments}
                      onChange={handleChange}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="complex-parking">Парковочных мест</label>

                  <div className={styles.inputWithIcon}>
                    <Car />

                    <input
                      id="complex-parking"
                      type="number"
                      name="parking"
                      value={form.parking}
                      onChange={handleChange}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="complex-area">Площадь территории</label>

                  <div className={styles.inputWithIcon}>
                    <Ruler />

                    <input
                      id="complex-area"
                      type="number"
                      name="area"
                      value={form.area}
                      onChange={handleChange}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 03 — AMENITIES */}

            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <Check />
                </div>

                <div>
                  <span>03</span>
                  <h3>Инфраструктура</h3>
                </div>
              </div>

              <div className={styles.amenities}>
                {amenities.map((item) => {
                  const active = selectedAmenities.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      className={`${styles.amenity} ${
                        active ? styles.amenityActive : ""
                      }`}
                      onClick={() => toggleAmenity(item)}
                      aria-pressed={active}
                    >
                      <span className={styles.check}>
                        {active && <Check />}
                      </span>

                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 04 — PHOTOS */}

            {/* SUBMIT */}

            <div className={styles.formBottomSpace} />
          </form>
        </div>

        {/* ACTIONS */}

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Отмена
          </button>

          <button
            type="submit"
            form={undefined}
            className={styles.save}
            onClick={(event) => {
              const formElement = event.currentTarget
                .closest(`.${styles.modal}`)
                ?.querySelector("form");

              formElement?.requestSubmit();
            }}
          >
            <Check />
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}
