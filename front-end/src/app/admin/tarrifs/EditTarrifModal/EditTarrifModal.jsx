"use client";

import { useEffect, useState } from "react";
import { X, User, Phone, Check, CalendarDays } from "lucide-react";

import styles from "./EditTarrifModal.module.css";

const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const addMonths = (dateString, months) => {
  const date = new Date(`${dateString}T00:00:00`);

  date.setMonth(date.getMonth() + months);

  return formatDateForInput(date);
};

const getToday = () => {
  return formatDateForInput(new Date());
};

const getDefaultEndDate = (startDate) => {
  return addMonths(startDate, 1);
};

export default function EditTariffModal({ isOpen, onClose, onSubmit, tariff }) {
  const [form, setForm] = useState({
    name: "",
    activeListings: "",
    vipBoosts: "",
    topBoosts: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!isOpen || !tariff) {
      return;
    }

    const startDate = tariff.startDate || getToday();

    setForm({
      name: tariff.name || "",
      activeListings: tariff.activeListings ?? 0,
      vipBoosts: tariff.vipBoosts ?? 0,
      topBoosts: tariff.topBoosts ?? 0,
      startDate,
      endDate: tariff.endDate || getDefaultEndDate(startDate),
    });
  }, [isOpen, tariff]);

  if (!isOpen || !tariff) {
    return null;
  }

  const userName = tariff.userName || tariff.user?.name || "Пользователь";

  const userPhone = tariff.phone || tariff.user?.phone || "—";

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStartDateChange = (value) => {
    setForm((prev) => ({
      ...prev,
      startDate: value,
      endDate: prev.endDate < value ? addMonths(value, 1) : prev.endDate,
    }));
  };

  const handlePeriodSelect = (months) => {
    setForm((prev) => ({
      ...prev,
      endDate: addMonths(prev.startDate, months),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.startDate || !form.endDate) {
      return;
    }

    if (form.endDate < form.startDate) {
      return;
    }

    const updatedTariff = {
      ...tariff,

      name: form.name.trim(),

      activeListings: Number(form.activeListings) || 0,

      vipBoosts: Number(form.vipBoosts) || 0,

      topBoosts: Number(form.topBoosts) || 0,

      startDate: form.startDate,
      endDate: form.endDate,
    };

    try {
      if (onSubmit) {
        await onSubmit(updatedTariff);
      }

      onClose();
    } catch (error) {
      console.error("Ошибка изменения тарифа:", error);
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <div className={styles.eyebrow}>УПРАВЛЕНИЕ ТАРИФАМИ</div>

            <h2>Изменить тариф</h2>

            <p>Измените параметры и период действия тарифа.</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            {/* USER */}

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Пользователь</div>

              <div className={styles.selectedUser}>
                <div className={styles.userAvatar}>
                  <User size={20} />
                </div>

                <div className={styles.userInfo}>
                  <strong>{userName}</strong>

                  <span>
                    <Phone size={14} />
                    {userPhone}
                  </span>
                </div>

                <div className={styles.selectedBadge}>
                  <Check size={15} />
                  Пользователь
                </div>
              </div>
            </div>

            {/* TARIFF */}

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Параметры тарифа</div>

              <div className={styles.field}>
                <label className={styles.label}>Название тарифа</label>

                <input
                  type="text"
                  className={styles.input}
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  placeholder="Например, Premium"
                  required
                />
              </div>

              <div className={styles.grid}>
                <div className={styles.field}>
                  <label className={styles.label}>Активные объявления</label>

                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    value={form.activeListings}
                    onChange={(event) =>
                      handleChange("activeListings", event.target.value)
                    }
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Поднятия в VIP</label>

                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    value={form.vipBoosts}
                    onChange={(event) =>
                      handleChange("vipBoosts", event.target.value)
                    }
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Поднятия в TOP</label>

                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    value={form.topBoosts}
                    onChange={(event) =>
                      handleChange("topBoosts", event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* PERIOD */}

              <div className={styles.periodSection}>
                <div className={styles.periodHeader}>
                  <div className={styles.periodTitle}>
                    <CalendarDays size={18} />

                    <span>Период действия тарифа</span>
                  </div>

                  <span className={styles.periodHint}>
                    Измените даты вручную или выберите срок
                  </span>
                </div>

                <div className={styles.dateGrid}>
                  <div className={styles.field} style={{marginTop: "16px"}}>
                    <label className={styles.label}>Дата начала</label>

                    <div className={styles.dateInputWrapper}>
                      <CalendarDays size={17} />

                      <input
                        type="date"
                        className={styles.dateInput}
                        value={form.startDate}
                        onChange={(event) =>
                          handleStartDateChange(event.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Дата окончания</label>

                    <div className={styles.dateInputWrapper}>
                      <CalendarDays size={17} />

                      <input
                        type="date"
                        className={styles.dateInput}
                        min={form.startDate}
                        value={form.endDate}
                        onChange={(event) =>
                          handleChange("endDate", event.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.quickPeriods}>
                  <span className={styles.quickPeriodsLabel}>
                    Быстро изменить срок:
                  </span>

                  <div className={styles.quickPeriodsButtons}>
                    <button
                      type="button"
                      className={styles.periodButton}
                      onClick={() => handlePeriodSelect(2)}
                    >
                      2 месяца
                    </button>

                    <button
                      type="button"
                      className={styles.periodButton}
                      onClick={() => handlePeriodSelect(4)}
                    >
                      4 месяца
                    </button>

                    <button
                      type="button"
                      className={styles.periodButton}
                      onClick={() => handlePeriodSelect(6)}
                    >
                      6 месяцев
                    </button>

                    <button
                      type="button"
                      className={styles.periodButton}
                      onClick={() => handlePeriodSelect(12)}
                    >
                      1 год
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Отмена
            </button>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={
                !form.name.trim() ||
                !form.startDate ||
                !form.endDate ||
                form.endDate < form.startDate
              }
            >
              <Check size={19} />
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
