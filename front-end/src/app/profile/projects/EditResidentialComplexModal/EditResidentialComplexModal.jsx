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
  Warehouse,
  Maximize,
  Blocks,
} from "lucide-react";

import styles from "./EditResidentialComplexModal.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";
import { useLanguage } from "@/context/LanguageContext";

const statuses = ["Проект", "Строительство", "Сдан"];

const classes = ["Эконом", "Комфорт", "Бизнес", "Премиум"];

const constructions = [
  "Монолит",
  "Монолитно-кирпичный",
  "Кирпичный",
  "Панельный",
  "Каркасно-монолитный",
  "Газобетон",
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

const initialForm = {
  name: "",
  address: "",
  city: "Бишкек",
  description: "",
  status: "Строительство",
  class: "Комфорт",
  construction: "Монолит",
  completionDate: "",
  floors: "",
  blocks: "",
  apartments: "",
  parking: "",
  area: "",
  landArea: "",
  ceilingHeight: "",
};

export default function EditResidentialComplexModal({
  complex,
  onClose,
  onSave,
}) {
  const { t } = useLanguage();

  const [form, setForm] = useState(initialForm);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);

  const translateStatus = (value) => {
    const map = {
      Проект: "project",
      Строительство: "construction",
      Сдан: "completed",
    };

    return t(
      `editResidentialComplexModal.statuses.${map[value] || "construction"}`,
    );
  };

  const translateClass = (value) => {
    const map = {
      Эконом: "economy",
      Комфорт: "comfort",
      Бизнес: "business",
      Премиум: "premium",
    };

    return t(`editResidentialComplexModal.classes.${map[value] || "comfort"}`);
  };

  const translateConstruction = (value) => {
    const map = {
      Монолит: "monolith",
      "Монолитно-кирпичный": "monolithBrick",
      Кирпичный: "brick",
      Панельный: "panel",
      "Каркасно-монолитный": "frameMonolith",
      Газобетон: "aeratedConcrete",
    };

    return t(
      `editResidentialComplexModal.constructions.${map[value] || "monolith"}`,
    );
  };

  const translateAmenity = (value) => {
    const map = {
      "Детская площадка": "playground",
      Парковка: "parking",
      "Подземный паркинг": "undergroundParking",
      "Закрытая территория": "gatedArea",
      Охрана: "security",
      Видеонаблюдение: "videoSurveillance",
      Лифт: "elevator",
      "Детский сад": "kindergarten",
      Школа: "school",
      "Фитнес-зал": "fitness",
      "Зеленая зона": "greenArea",
      "Коммерческие помещения": "commercial",
    };

    return t(
      `editResidentialComplexModal.amenities.${map[value] || "playground"}`,
    );
  };

  useEffect(() => {
    if (!complex) return;

    const f = complex.rawFeatures || complex.features || {};

    const extractVal = (rawVal, val) => {
      if (rawVal !== undefined && rawVal !== null && rawVal !== "") {
        return rawVal;
      }

      if (
        val === undefined ||
        val === null ||
        val === "" ||
        val === "Не указано"
      ) {
        return "";
      }

      const cleaned = String(val)
        .replace(/[^\d.,]/g, "")
        .replace(",", ".");

      return cleaned || "";
    };

    setForm({
      name: complex.name || "",
      address: complex.address || "",
      city: complex.city || "Бишкек",
      description: complex.description || "",
      status: complex.status || "Строительство",
      class: complex.class || "Комфорт",
      construction:
        f.construction ||
        complex.constructionVal ||
        (complex.constructionType !== "Не указано"
          ? complex.constructionType
          : "Монолит"),
      completionDate: complex.completionDate || "",
      floors: extractVal(f.floors, complex.floors),
      blocks: extractVal(f.blocks, complex.blocks),
      apartments: extractVal(f.apartments, complex.apartments),
      parking: extractVal(f.parking, complex.parking),
      area: extractVal(f.area, complex.area),
      landArea: extractVal(f.areaSotka, complex.landArea),
      ceilingHeight: extractVal(f.ceilingHeight, complex.ceilingHeight),
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

    const parseNum = (val) => {
      if (val === undefined || val === null || val === "") {
        return null;
      }

      const num = parseFloat(String(val).replace(",", "."));

      return isNaN(num) ? val : num;
    };

    const updatedComplex = {
      ...complex,
      ...form,

      floors: parseNum(form.floors),
      blocks: parseNum(form.blocks),
      apartments: parseNum(form.apartments),
      parking: parseNum(form.parking),
      area: parseNum(form.area),
      landArea: parseNum(form.landArea),
      ceilingHeight: parseNum(form.ceilingHeight),

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

  const translatedStatuses = statuses.map(translateStatus);

  const translatedClasses = classes.map(translateClass);

  const translatedConstructions = constructions.map(translateConstruction);

  const getOriginalValue = (translatedValue, values, translator) => {
    const index = values.findIndex(
      (value) => translator(value) === translatedValue,
    );

    return index >= 0 ? values[index] : values[0];
  };

  const selectedStatusLabel = translateStatus(form.status);

  const selectedClassLabel = translateClass(form.class);

  const selectedConstructionLabel = translateConstruction(form.construction);

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

              {t("editResidentialComplexModal.header.eyebrow")}
            </span>

            <h2 id="edit-residential-complex-title">
              {complex.name ||
                t("editResidentialComplexModal.fallback.complex")}
            </h2>

            <p>{t("editResidentialComplexModal.header.description")}</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t("editResidentialComplexModal.actions.close")}
          >
            <X />
          </button>
        </header>

        {/* BODY */}

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

                  <h3>{t("editResidentialComplexModal.sections.basic")}</h3>
                </div>
              </div>

              <div className={styles.grid}>
                <div className={`${styles.field} ${styles.full}`}>
                  <label htmlFor="complex-name">
                    {t("editResidentialComplexModal.fields.name")} <b>*</b>
                  </label>

                  <input
                    id="complex-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t(
                      "editResidentialComplexModal.placeholders.name",
                    )}
                    autoComplete="off"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="complex-city">
                    {t("editResidentialComplexModal.fields.city")}
                  </label>

                  <input
                    id="complex-city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    placeholder={t(
                      "editResidentialComplexModal.placeholders.city",
                    )}
                    autoComplete="address-level2"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="complex-address">
                    {t("editResidentialComplexModal.fields.address")} <b>*</b>
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
                        "editResidentialComplexModal.placeholders.address",
                      )}
                      autoComplete="street-address"
                      required
                    />
                  </div>
                </div>

                <div className={`${styles.field} ${styles.full}`}>
                  <label htmlFor="complex-description">
                    {t("editResidentialComplexModal.fields.description")}
                  </label>

                  <textarea
                    id="complex-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder={t(
                      "editResidentialComplexModal.placeholders.description",
                    )}
                    rows={5}
                    maxLength={1000}
                  />

                  <span className={styles.counter}>
                    {form.description.length}
                    /1000
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

                  <h3>
                    {t("editResidentialComplexModal.sections.characteristics")}
                  </h3>
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.field}>
                  <label>
                    {t("editResidentialComplexModal.fields.status")}
                  </label>

                  <CustomSelect
                    icon={Layers3}
                    title={t("editResidentialComplexModal.fields.status")}
                    options={translatedStatuses}
                    value={selectedStatusLabel}
                    setValue={(value) =>
                      setField(
                        "status",
                        getOriginalValue(value, statuses, translateStatus),
                      )
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label>{t("editResidentialComplexModal.fields.class")}</label>

                  <CustomSelect
                    icon={Building2}
                    title={t("editResidentialComplexModal.fields.class")}
                    options={translatedClasses}
                    value={selectedClassLabel}
                    setValue={(value) =>
                      setField(
                        "class",
                        getOriginalValue(value, classes, translateClass),
                      )
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label>
                    {t("editResidentialComplexModal.fields.construction")}
                  </label>

                  <CustomSelect
                    icon={Blocks}
                    title={t("editResidentialComplexModal.fields.construction")}
                    options={translatedConstructions}
                    value={selectedConstructionLabel}
                    setValue={(value) =>
                      setField(
                        "construction",
                        getOriginalValue(
                          value,
                          constructions,
                          translateConstruction,
                        ),
                      )
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="completion-date">
                    {t("editResidentialComplexModal.fields.completionDate")}
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

                <div className={styles.field}>
                  <label htmlFor="complex-floors">
                    {t("editResidentialComplexModal.fields.floors")}
                  </label>

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
                  <label htmlFor="complex-blocks">
                    {t("editResidentialComplexModal.fields.blocks")}
                  </label>

                  <div className={styles.inputWithIcon}>
                    <Blocks />

                    <input
                      id="complex-blocks"
                      type="number"
                      name="blocks"
                      value={form.blocks}
                      onChange={handleChange}
                      min="1"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="complex-apartments">
                    {t("editResidentialComplexModal.fields.apartments")}
                  </label>

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
                  <label htmlFor="complex-parking">
                    {t("editResidentialComplexModal.fields.parking")}
                  </label>

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
                  <label htmlFor="complex-land-area">
                    {t("editResidentialComplexModal.fields.landArea")}
                  </label>

                  <div className={styles.inputWithIcon}>
                    <Maximize />

                    <input
                      id="complex-land-area"
                      type="number"
                      name="landArea"
                      value={form.landArea}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="complex-ceiling-height">
                    {t("editResidentialComplexModal.fields.ceilingHeight")}
                  </label>

                  <div className={styles.inputWithIcon}>
                    <Warehouse />

                    <input
                      id="complex-ceiling-height"
                      type="number"
                      name="ceilingHeight"
                      value={form.ceilingHeight}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="2.8"
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

                  <h3>
                    {t("editResidentialComplexModal.sections.infrastructure")}
                  </h3>
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

                      <span>{translateAmenity(item)}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className={styles.formBottomSpace} />
          </form>
        </div>

        {/* ACTIONS */}

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            {t("editResidentialComplexModal.actions.cancel")}
          </button>

          <button
            type="button"
            className={styles.save}
            onClick={(event) => {
              const formElement = event.currentTarget
                .closest(`.${styles.modal}`)
                ?.querySelector("form");

              formElement?.requestSubmit();
            }}
          >
            <Check />

            {t("editResidentialComplexModal.actions.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
