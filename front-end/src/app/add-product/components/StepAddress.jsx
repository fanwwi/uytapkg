"use client";

import styles from "./steps.module.css";

export default function StepAddress({ form, updateForm, onNext, onBack }) {
  const canContinue = form.address.trim().length > 3;

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <span>Шаг 4 из 5</span>

        <h1>Где находится объект?</h1>

        <p>Укажите точный адрес или выберите точку на карте.</p>
      </div>

      <div className={styles.field}>
        <label>Адрес</label>

        <input
          value={form.address}
          onChange={(e) =>
            updateForm({
              address: e.target.value,
            })
          }
          placeholder="Улица, дом, квартира"
        />
      </div>

      <div className={styles.map}>
        <div className={styles.mapPlaceholder}>
          <div className={styles.mapPin}>📍</div>

          <strong>Карта объекта</strong>

          <span>Здесь будет интерактивная карта</span>

          <small>Можно будет выбрать точку непосредственно на карте</small>
        </div>
      </div>

      <div className={styles.coordinates}>
        <div className={styles.field}>
          <label>Широта</label>

          <input
            value={form.latitude ?? ""}
            onChange={(e) =>
              updateForm({
                latitude: e.target.value,
              })
            }
            placeholder="Не указана"
          />
        </div>

        <div className={styles.field}>
          <label>Долгота</label>

          <input
            value={form.longitude ?? ""}
            onChange={(e) =>
              updateForm({
                longitude: e.target.value,
              })
            }
            placeholder="Не указана"
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={onBack}>
          Назад
        </button>

        <button
          type="button"
          className={styles.primary}
          disabled={!canContinue}
          onClick={onNext}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}
