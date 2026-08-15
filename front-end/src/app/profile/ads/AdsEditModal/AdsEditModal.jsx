"use client";

import { useEffect, useRef, useState } from "react";
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
  ChevronDown,
} from "lucide-react";

import styles from "./AdsEditModal.module.css";
import CustomSelectBlack from "@/components/ui/customSelectBlack/CustomSelectBlack";

const typeOptions = [
  "Дом",
  "Коттедж",
  "Квартира",
  "Участок",
  "Коммерция",
  "Дача",
];

const dealOptions = ["Продажа", "Сдаю"];

function CustomSelect({ value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className={styles.customSelect} ref={ref}>
      <button
        type="button"
        className={`${styles.selectButton} ${
          open ? styles.selectButtonOpen : ""
        } ${!value ? styles.selectPlaceholder : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{value || placeholder}</span>

        <ChevronDown
          size={17}
          className={`${styles.selectArrow} ${
            open ? styles.selectArrowOpen : ""
          }`}
        />
      </button>

      {open && (
        <div className={styles.selectDropdown}>
          {options.map((option) => (
            <button
              type="button"
              key={option}
              className={`${styles.selectOption} ${
                value === option ? styles.selectOptionActive : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              <span>{option}</span>

              {value === option && (
                <span className={styles.selectCheck}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdsEditModal({
  isOpen,
  onClose,
  listing,
  onSave,
  loading = false,
}) {
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
            <span className={styles.label}>УПРАВЛЕНИЕ ОБЪЯВЛЕНИЕМ</span>

            <h2 id="edit-modal-title">Изменить объявление</h2>

            <p>Измените информацию об объекте и сохраните обновления.</p>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            disabled={loading}
            aria-label="Закрыть"
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
                <span>ОСНОВНАЯ ИНФОРМАЦИЯ</span>
                <h3>Об объекте</h3>
              </div>
            </div>

            <div className={styles.fields}>
              {/* TITLE */}

              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="title">Название объявления</label>

                <div className={styles.inputWrapper}>
                  <FileText size={17} />

                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Название объекта"
                    required
                  />
                </div>
              </div>

              {/* TYPE */}

              <div className={styles.field}>
                <label>Тип объекта</label>

                <CustomSelectBlack
                  value={form.type}
                  options={typeOptions}
                  placeholder="Выберите тип"
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      type: value,
                    }))
                  }
                />
              </div>

              {/* DEAL TYPE */}

              <div className={styles.field}>
                <label>Тип предложения</label>

                <CustomSelectBlack
                  value={form.dealType}
                  options={dealOptions}
                  placeholder="Выберите тип"
                  onChange={(value) =>
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
                <span>РАСПОЛОЖЕНИЕ</span>
                <h3>Адрес объекта</h3>
              </div>
            </div>

            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="location">Город / район</label>

                <div className={styles.inputWrapper}>
                  <MapPin size={17} />

                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Например, Чолпон-Ата"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="address">Адрес</label>

                <div className={styles.inputWrapper}>
                  <MapPin size={17} />

                  <input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Улица, дом"
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
                <span>ХАРАКТЕРИСТИКИ</span>
                <h3>Параметры объекта</h3>
              </div>
            </div>

            <div className={styles.fields}>
              {/* PRICE */}

              <div className={styles.field}>
                <label htmlFor="price">Цена</label>

                <div className={styles.inputWrapper}>
                  <DollarSign size={17} />

                  <input
                    id="price"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="120 000 $"
                    required
                  />
                </div>
              </div>

              {/* AREA */}

              <div className={styles.field}>
                <label htmlFor="area">Площадь</label>

                <div className={styles.inputWrapper}>
                  <Ruler size={17} />

                  <input
                    id="area"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    placeholder="180 м²"
                  />
                </div>
              </div>

              {/* ROOMS */}

              <div className={styles.field}>
                <label htmlFor="rooms">Комнаты</label>

                <div className={styles.inputWrapper}>
                  <BedDouble size={17} />

                  <input
                    id="rooms"
                    name="rooms"
                    type="number"
                    min="0"
                    value={form.rooms}
                    onChange={handleChange}
                    placeholder="5"
                  />
                </div>
              </div>

              {/* FLOORS */}

              <div className={styles.field}>
                <label htmlFor="floors">Этажность</label>

                <div className={styles.inputWrapper}>
                  <Layers3 size={17} />

                  <input
                    id="floors"
                    name="floors"
                    type="number"
                    min="1"
                    value={form.floors}
                    onChange={handleChange}
                    placeholder="2"
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
                <span>ОБЪЕКТ</span>
                <h3>Описание</h3>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="description">Описание объявления</label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Расскажите подробнее об объекте..."
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
              Отмена
            </button>

            <button type="submit" className={styles.save} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={17} className={styles.loader} />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Сохранить изменения
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
