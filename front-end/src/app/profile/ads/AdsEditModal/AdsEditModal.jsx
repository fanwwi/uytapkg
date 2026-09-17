"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Save,
  MapPin,
  Home,
  DollarSign,
  Ruler,
  BedDouble,
  Layers3,
  FileText,
  Loader2,
} from "lucide-react";

import styles from "./AdsEditModal.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";
import { useLanguage } from "@/context/LanguageContext";

const typeOptions = [
  "Дом",
  "Коттедж",
  "Квартира",
  "Участок",
  "Коммерция",
  "Дача",
];

const dealOptions = ["Продажа", "Сдаю"];

export default function AdsEditModal({
  isOpen,
  onClose,
  listing,
  onSave,
  loading = false,
}) {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    title: "",
    type: "",
    dealType: "",
    location: "",
    address: "",
    price: "",
    area: "",
    rooms: "",
    floors: "",
    description: "",
  });

  useEffect(() => {
    if (!listing) return;

    setForm({
      title: listing.title || "",
      type: listing.type || "",
      dealType: listing.dealType || "",
      location: listing.location || "",
      address: listing.address || "",
      price: listing.price || "",
      area: listing.area || "",
      rooms: listing.rooms ?? "",
      floors: listing.floors ?? "",
      description: listing.description || "",
    });
  }, [listing]);

  const translatedTypeOptions = useMemo(() => {
    return typeOptions.map((type) => {
      const key = {
        Дом: "house",
        Коттедж: "cottage",
        Квартира: "apartment",
        Участок: "land",
        Коммерция: "commercial",
        Дача: "dacha",
      }[type];

      return {
        value: type,
        label: key ? t(`adsEditModal.propertyTypes.${key}`) : type,
      };
    });
  }, [t]);

  const translatedDealOptions = useMemo(() => {
    return dealOptions.map((deal) => {
      const key = {
        Продажа: "sale",
        Сдаю: "rent",
      }[deal];

      return {
        value: deal,
        label: key ? t(`adsEditModal.dealTypes.${key}`) : deal,
      };
    });
  }, [t]);

  if (!isOpen || !listing) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    await onSave({
      ...listing,
      ...form,
    });
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        {/* HEADER */}

        <div className={styles.header}>
          <div>
            <span className={styles.label}>
              {t("adsEditModal.header.label")}
            </span>

            <h2 id="edit-modal-title">{t("adsEditModal.header.title")}</h2>

            <p>{t("adsEditModal.header.description")}</p>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            disabled={loading}
            aria-label={t("adsEditModal.actions.close")}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* BASIC INFO */}

          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionIcon}>
                <Home size={18} />
              </div>

              <div>
                <span>{t("adsEditModal.sections.basic.label")}</span>

                <h3>{t("adsEditModal.sections.basic.title")}</h3>
              </div>
            </div>

            <div className={styles.fields}>
              {/* TITLE */}

              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="title">
                  {t("adsEditModal.fields.title.label")}
                </label>

                <div className={styles.inputWrapper}>
                  <FileText size={17} />

                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder={t("adsEditModal.fields.title.placeholder")}
                    required
                  />
                </div>
              </div>

              {/* TYPE */}

              <div className={styles.field}>
                <label>{t("adsEditModal.fields.type.label")}</label>

                <CustomSelect
                  value={form.type}
                  options={translatedTypeOptions}
                  title={t("adsEditModal.fields.type.title")}
                  setValue={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      type: value,
                    }))
                  }
                />
              </div>

              {/* DEAL TYPE */}

              <div className={styles.field}>
                <label>{t("adsEditModal.fields.dealType.label")}</label>

                <CustomSelect
                  value={form.dealType}
                  options={translatedDealOptions}
                  title={t("adsEditModal.fields.dealType.title")}
                  setValue={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      dealType: value,
                    }))
                  }
                />
              </div>
            </div>
          </section>

          {/* LOCATION */}

          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionIcon}>
                <MapPin size={18} />
              </div>

              <div>
                <span>{t("adsEditModal.sections.location.label")}</span>

                <h3>{t("adsEditModal.sections.location.title")}</h3>
              </div>
            </div>

            <div className={styles.fields}>
              {/* LOCATION */}

              <div className={styles.field}>
                <label htmlFor="location">
                  {t("adsEditModal.fields.location.label")}
                </label>

                <div className={styles.inputWrapper}>
                  <MapPin size={17} />

                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder={t("adsEditModal.fields.location.placeholder")}
                    required
                  />
                </div>
              </div>

              {/* ADDRESS */}

              <div className={styles.field}>
                <label htmlFor="address">
                  {t("adsEditModal.fields.address.label")}
                </label>

                <div className={styles.inputWrapper}>
                  <MapPin size={17} />

                  <input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder={t("adsEditModal.fields.address.placeholder")}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* DETAILS */}

          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionIcon}>
                <Ruler size={18} />
              </div>

              <div>
                <span>{t("adsEditModal.sections.details.label")}</span>

                <h3>{t("adsEditModal.sections.details.title")}</h3>
              </div>
            </div>

            <div className={styles.fields}>
              {/* PRICE */}

              <div className={styles.field}>
                <label htmlFor="price">
                  {t("adsEditModal.fields.price.label")}
                </label>

                <div className={styles.inputWrapper}>
                  <DollarSign size={17} />

                  <input
                    id="price"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder={t("adsEditModal.fields.price.placeholder")}
                    required
                  />
                </div>
              </div>

              {/* AREA */}

              <div className={styles.field}>
                <label htmlFor="area">
                  {t("adsEditModal.fields.area.label")}
                </label>

                <div className={styles.inputWrapper}>
                  <Ruler size={17} />

                  <input
                    id="area"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    placeholder={t("adsEditModal.fields.area.placeholder")}
                  />
                </div>
              </div>

              {/* ROOMS */}

              <div className={styles.field}>
                <label htmlFor="rooms">
                  {t("adsEditModal.fields.rooms.label")}
                </label>

                <div className={styles.inputWrapper}>
                  <BedDouble size={17} />

                  <input
                    id="rooms"
                    name="rooms"
                    type="number"
                    min="0"
                    value={form.rooms}
                    onChange={handleChange}
                    placeholder={t("adsEditModal.fields.rooms.placeholder")}
                  />
                </div>
              </div>

              {/* FLOORS */}

              <div className={styles.field}>
                <label htmlFor="floors">
                  {t("adsEditModal.fields.floors.label")}
                </label>

                <div className={styles.inputWrapper}>
                  <Layers3 size={17} />

                  <input
                    id="floors"
                    name="floors"
                    type="number"
                    min="1"
                    value={form.floors}
                    onChange={handleChange}
                    placeholder={t("adsEditModal.fields.floors.placeholder")}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* DESCRIPTION */}

          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionIcon}>
                <FileText size={18} />
              </div>

              <div>
                <span>{t("adsEditModal.sections.description.label")}</span>

                <h3>{t("adsEditModal.sections.description.title")}</h3>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="description">
                {t("adsEditModal.fields.description.label")}
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder={t("adsEditModal.fields.description.placeholder")}
                rows={5}
              />
            </div>
          </section>

          {/* ACTIONS */}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancel}
              onClick={onClose}
              disabled={loading}
            >
              {t("adsEditModal.actions.cancel")}
            </button>

            <button type="submit" className={styles.save} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={17} className={styles.loader} />

                  {t("adsEditModal.actions.saving")}
                </>
              ) : (
                <>
                  <Save size={17} />

                  {t("adsEditModal.actions.save")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
