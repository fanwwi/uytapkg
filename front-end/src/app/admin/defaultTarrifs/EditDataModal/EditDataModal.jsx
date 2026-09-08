"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, Clock3, X } from "lucide-react";

import styles from "./EditDataModal.module.css";

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("ru-RU");
};

const addDays = (dateString, days) => {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);

  return date.toISOString().split("T")[0];
};

export default function EditDataModal({ isOpen, user, onClose, onSave }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!user) return;

    setStartDate(user.startDate || "");
    setEndDate(user.endDate || "");
  }, [user]);

  if (!isOpen || !user) {
    return null;
  }

  const handleQuickAdd = (days) => {
    const baseDate = endDate || startDate;

    if (!baseDate) return;

    setEndDate(addDays(baseDate, days));
  };

  const handleSave = () => {
    if (!startDate || !endDate) {
      return;
    }

    if (new Date(`${endDate}T00:00:00`) < new Date(`${startDate}T00:00:00`)) {
      return;
    }

    onSave({
      startDate,
      endDate,
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* HEADER */}

        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>УПРАВЛЕНИЕ ТАРИФОМ</span>

            <h2>Изменить период</h2>

            <p>Измените даты действия тарифа для пользователя</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </div>

        {/* USER */}

        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {user.name
              ?.split(" ")
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase()}
          </div>

          <div className={styles.userInfo}>
            <strong>{user.name}</strong>

            <span>{user.email}</span>

            <small>{user.phone}</small>
          </div>

          <div className={styles.tariffBadge}>{user.tariff}</div>
        </div>

        {/* CURRENT PERIOD */}

        <div className={styles.currentPeriod}>
          <div className={styles.currentIcon}>
            <Clock3 size={17} />
          </div>

          <div>
            <span>ТЕКУЩИЙ ПЕРИОД</span>

            <strong>
              {formatDate(user.startDate)} — {formatDate(user.endDate)}
            </strong>
          </div>
        </div>

        {/* DATES */}

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <CalendarDays size={16} />

            <span>Период действия</span>
          </div>

          <div className={styles.dates}>
            <div className={styles.field}>
              <label>Дата начала</label>

              <div className={styles.dateInput}>
                <CalendarDays size={15} />

                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>
            </div>

            <div className={styles.arrow}>→</div>

            <div className={styles.field}>
              <label>Дата окончания</label>

              <div className={styles.dateInput}>
                <CalendarDays size={15} />

                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Clock3 size={16} />

            <span>Быстро продлить</span>
          </div>

          <p className={styles.quickDescription}>
            Добавьте срок к текущей дате окончания тарифа
          </p>

          <div className={styles.quickActions}>
            <button type="button" onClick={() => handleQuickAdd(7)}>
              <span>+7</span>
              <small>дней</small>
            </button>

            <button type="button" onClick={() => handleQuickAdd(30)}>
              <span>+1</span>
              <small>месяц</small>
            </button>

            <button type="button" onClick={() => handleQuickAdd(90)}>
              <span>+3</span>
              <small>месяца</small>
            </button>
          </div>
        </div>

        {/* PREVIEW */}

        <div className={styles.preview}>
          <div>
            <span>НОВЫЙ ПЕРИОД</span>

            <strong>
              {formatDate(startDate)} — {formatDate(endDate)}
            </strong>
          </div>

          <Check size={18} />
        </div>

        {/* ACTIONS */}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Отмена
          </button>

          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
          >
            <Check size={16} />
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}
