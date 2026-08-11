"use client";

import {
  Check,
  Crown,
  Sparkles,
  Zap,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import styles from "./StepListingType.module.css";

const types = [
  {
    id: "standard",
    title: "Обычное размещение",
    description: "Стандартная публикация объявления с базовым размещением.",
    icon: Sparkles,
  },
  {
    id: "vip",
    title: "VIP-размещение",
    description:
      "Более заметное размещение, чтобы объявление увидело больше людей.",
    icon: Crown,
  },
  {
    id: "urgent",
    title: "Срочная публикация",
    description:
      "Покажите покупателям, что объект нужно продать или сдать быстрее.",
    icon: Zap,
  },
];

const regionNames = {
  bishkek: "Бишкек",
  chui: "Чуйская область",
  osh: "Ошская область",
  jalalAbad: "Джалал-Абадская область",
  issykKul: "Иссык-Кульская область",
  naryn: "Нарынская область",
  talas: "Таласская область",
  batken: "Баткенская область",
  oshCity: "Ош",

  istanbul: "Стамбул",
  ankara: "Анкара",
  izmir: "Измир",
  antalya: "Анталья",
  bursa: "Бурса",
  adana: "Адана",
  gaziantep: "Газиантеп",
  konya: "Конья",
};

const categoryLabels = {
  apartment: "Квартира",
  house: "Дом",
  land: "Участок",
  room: "Комната",
  commercial: "Коммерция",
  parking: "Паркинг / гараж",
};

export default function StepListingType({
  form,
  updateForm,
  onBack,
  onSubmit,
  isSubmitting,
}) {
  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <span className={styles.stepBadge}>
          <span className={styles.stepDot} />
          Шаг 5 из 5
        </span>

        <h1>Как разместить объявление?</h1>

        <p>
          Выберите подходящий вариант публикации. После этого объявление будет
          готово к размещению.
        </p>
      </div>

      <div className={styles.sectionLabel}>
        <span>01</span>
        <div>
          <strong>Тип размещения</strong>
          <small>Выберите один вариант</small>
        </div>
      </div>

      <div className={styles.typeGrid}>
        {types.map((item) => {
          const isSelected = form.listingType === item.id;
          const Icon = item.icon;

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
              <div className={styles.cardGlow} />

              <div className={styles.cardTop}>
                <div className={styles.typeIcon}>
                  <Icon size={21} strokeWidth={2.2} />
                </div>

                {isSelected && (
                  <div className={styles.selectedBadge}>
                    <Check size={13} strokeWidth={3} />
                    Выбрано
                  </div>
                )}
              </div>

              <div className={styles.cardContent}>
                <strong>{item.title}</strong>

                <span>{item.description}</span>
              </div>

              {!isSelected && (
                <div className={styles.cardArrow}>
                  <ArrowRight size={17} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryHeader}>
          <div>
            <span className={styles.summaryEyebrow}>02</span>

            <div>
              <h3>Проверьте объявление</h3>
              <p>Основная информация перед публикацией</p>
            </div>
          </div>

          <div className={styles.readyBadge}>
            <span />
            Готово
          </div>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span>Страна</span>
            <strong>
              {form.country === "turkey" ? "Турция" : "Кыргызстан"}
            </strong>
          </div>

          <div className={styles.summaryItem}>
            <span>Регион</span>
            <strong>{regionNames[form.region] || "Не указан"}</strong>
          </div>

          <div className={styles.summaryItem}>
            <span>Тип сделки</span>
            <strong>{form.dealType === "sale" ? "Продажа" : "Аренда"}</strong>
          </div>

          <div className={styles.summaryItem}>
            <span>Категория</span>
            <strong>{categoryLabels[form.category] || "Не указана"}</strong>
          </div>

          <div className={styles.summaryItemWide}>
            <span>Адрес</span>
            <strong>{form.address || "Не указан"}</strong>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={onBack}>
          <ArrowLeft size={17} />
          Назад
        </button>

        <button
          type="button"
          className={styles.primary}
          disabled={!form.listingType || isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? "Публикация..." : "Опубликовать"}
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
