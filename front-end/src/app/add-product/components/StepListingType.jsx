"use client";

import styles from "./steps.module.css";

const types = [
  {
    id: "standard",
    title: "Обычное",
    description: "Стандартное размещение объявления.",
    icon: "✦",
  },
  {
    id: "vip",
    title: "VIP",
    description: "Объявление получает самое заметное размещение.",
    icon: "♛",
  },
  {
    id: "urgent",
    title: "Срочное",
    description:
      "Показывает покупателям, что объект нужно продать или сдать быстрее.",
    icon: "⚡",
  },
];

export default function StepListingType({
  form,
  updateForm,
  onBack,
  onSubmit,
}) {
  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <span>Шаг 5 из 5</span>

        <h1>Как разместить объявление?</h1>

        <p>Выберите тип публикации.</p>
      </div>

      <div className={styles.typeGrid}>
        {types.map((item) => {
          const isSelected = form.listingType === item.id;

          return (
            <button
              type="button"
              key={item.id}
              className={`${styles.typeCard} ${
                styles[`type-${item.id}`]
              } ${isSelected ? styles.selected : ""}`}
              onClick={() =>
                updateForm({
                  listingType: item.id,
                })
              }
            >
              <div className={styles.typeIcon}>{item.icon}</div>

              <strong>{item.title}</strong>

              <span>{item.description}</span>

              <div className={styles.typeCheck}>{isSelected ? "✓" : ""}</div>
            </button>
          );
        })}
      </div>

      <div className={styles.summary}>
        <h3>Проверьте объявление</h3>

        <div>
          <span>Страна</span>
          <strong>{form.country === "turkey" ? "Турция" : "Кыргызстан"}</strong>
        </div>

        <div>
          <span>Регион</span>
          <strong>{form.region || "—"}</strong>
        </div>

        <div>
          <span>Город</span>
          <strong>{form.city || "—"}</strong>
        </div>

        <div>
          <span>Сделка</span>
          <strong>{form.dealType === "sale" ? "Продажа" : "Аренда"}</strong>
        </div>

        <div>
          <span>Категория</span>
          <strong>{form.category || "—"}</strong>
        </div>

        <div>
          <span>Адрес</span>
          <strong>{form.address || "—"}</strong>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={onBack}>
          Назад
        </button>

        <button
          type="button"
          className={styles.primary}
          disabled={!form.listingType}
          onClick={onSubmit}
        >
          Опубликовать
        </button>
      </div>
    </div>
  );
}
