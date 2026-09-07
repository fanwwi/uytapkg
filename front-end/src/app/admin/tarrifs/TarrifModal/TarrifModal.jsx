"use client";

import { useEffect, useState } from "react";
import { Crown, User, CalendarDays, WalletCards, X } from "lucide-react";

import CustomSelectBlack from "@/components/ui/CustomSelectBlack/CustomSelectBlack";

import styles from "./TarrifModal.module.css";

const EMPTY_FORM = {
  name: "",
  description: "",
  activeListings: "",
  topUps: "",
  vipUps: "",
  issuedTo: "",
  issuedToId: "",
  price: "",
  duration: 30,
  type: "agent",
};

const TYPE_OPTIONS = ["Риелтор", "Агентство", "Застройщик"];

const TYPE_VALUE_MAP = {
  Риелтор: "agent",
  Агентство: "agency",
  Застройщик: "developer",
};

const TYPE_LABEL_MAP = {
  agent: "Риелтор",
  agency: "Агентство",
  developer: "Застройщик",
};

export default function TariffModal({ tariff = null, onClose, onSave }) {
  const isEditing = Boolean(tariff);

  const [form, setForm] = useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!tariff) {
      setForm(EMPTY_FORM);
      return;
    }

    setForm({
      name: tariff.name,
      description: tariff.description,
      activeListings: String(tariff.activeListings),
      topUps: String(tariff.topUps),
      vipUps: String(tariff.vipUps),
      issuedTo: tariff.issuedTo,
      issuedToId: tariff.issuedToId,
      price: String(tariff.price),
      duration: tariff.duration,
      type: tariff.type,
    });
  }, [tariff]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, saving]);

  function updateForm(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function getTypeLabel(type) {
    return TYPE_LABEL_MAP[type] || "Риелтор";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    setSaving(true);

    try {
      const normalizedTariff = {
        name: form.name.trim(),

        description: form.description.trim(),

        activeListings: Number(form.activeListings) || 0,

        topUps: Number(form.topUps) || 0,

        vipUps: Number(form.vipUps) || 0,

        issuedTo: form.issuedTo.trim() || "Не назначен",

        issuedToId: form.issuedToId.trim() || "—",

        price: Number(form.price) || 0,

        duration: Number(form.duration) || 30,

        type: form.type,
      };

      await Promise.resolve(onSave(normalizedTariff));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div className={styles.modal}>
        {/* HEADER */}

        <div className={styles.header}>
          <div className={styles.heading}>
            <div className={styles.icon}>
              <Crown size={21} />
            </div>

            <div>
              <span>{isEditing ? "РЕДАКТИРОВАНИЕ" : "НОВЫЙ ТАРИФ"}</span>

              <h2>{isEditing ? "Изменить тариф" : "Добавить тариф"}</h2>
            </div>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            {/* BASIC */}

            <section className={styles.section}>
              <div className={styles.sectionTitle}>Основная информация</div>

              <div className={styles.formGroup}>
                <label>Название тарифа</label>

                <input
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  placeholder="Например, Профессиональный"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Описание</label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  placeholder="Краткое описание тарифа"
                  rows={3}
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Тип пользователя</label>

                  <CustomSelectBlack
                    icon={User}
                    title="Тип пользователя"
                    options={TYPE_OPTIONS}
                    value={getTypeLabel(form.type)}
                    setValue={(value) =>
                      updateForm("type", TYPE_VALUE_MAP[value])
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Срок действия</label>

                  <div className={styles.inputWithIcon}>
                    <CalendarDays size={17} />

                    <input
                      type="number"
                      min="1"
                      value={form.duration}
                      onChange={(event) =>
                        updateForm("duration", event.target.value)
                      }
                    />

                    <span>дней</span>
                  </div>
                </div>
              </div>
            </section>

            {/* LIMITS */}

            <section className={styles.section}>
              <div className={styles.sectionTitle}>Лимиты тарифа</div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Активные объявления</label>

                  <input
                    type="number"
                    min="0"
                    value={form.activeListings}
                    onChange={(event) =>
                      updateForm("activeListings", event.target.value)
                    }
                    placeholder="10"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Поднятия в TOP</label>

                  <input
                    type="number"
                    min="0"
                    value={form.topUps}
                    onChange={(event) =>
                      updateForm("topUps", event.target.value)
                    }
                    placeholder="5"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Поднятия в VIP</label>

                  <input
                    type="number"
                    min="0"
                    value={form.vipUps}
                    onChange={(event) =>
                      updateForm("vipUps", event.target.value)
                    }
                    placeholder="1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Стоимость</label>

                  <div className={styles.inputWithIcon}>
                    <WalletCards size={17} />

                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) =>
                        updateForm("price", event.target.value)
                      }
                      placeholder="3000"
                    />

                    <span>сом</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ISSUED */}

            <section className={styles.section}>
              <div className={styles.sectionTitle}>Кому выдан тариф</div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Получатель</label>

                  <input
                    value={form.issuedTo}
                    onChange={(event) =>
                      updateForm("issuedTo", event.target.value)
                    }
                    placeholder="Например, Риелторы"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>ID / роль</label>

                  <input
                    value={form.issuedToId}
                    onChange={(event) =>
                      updateForm("issuedToId", event.target.value)
                    }
                    placeholder="role:agent или user ID"
                  />
                </div>
              </div>

              <div className={styles.hint}>
                Например: <b>role:agent</b> для всех риелторов или конкретный ID
                пользователя.
              </div>
            </section>
          </div>

          {/* FOOTER */}

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancel}
              onClick={onClose}
              disabled={saving}
            >
              Отмена
            </button>

            <button type="submit" className={styles.save} disabled={saving}>
              {saving
                ? "Сохранение..."
                : isEditing
                  ? "Сохранить изменения"
                  : "Создать тариф"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
