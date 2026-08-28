"use client";

import {
  Check,
  Crown,
  Sparkles,
  Zap,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
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
  {
    id: "top",
    title: "Поднять в ТОП",
    description:
      "Поднимите объявление выше других и получите больше просмотров.",
    icon: TrendingUp,
  },
];

const regionNames = {
  BISHKEK: "Бишкек",
  CHUY: "Чуйская область",
  OSH_REGION: "Ошская область",
  JALAL_ABAD: "Джалал-Абадская область",
  ISSYK_KUL: "Иссык-Кульская область",
  NARYN: "Нарынская область",
  TALAS: "Таласская область",
  BATKEN: "Баткенская область",
  OSH_CITY: "Ош",

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
  const title = form.title || "";
  const description = form.description || "";

  const isTitleValid = title.trim().length > 0;
  const isDescriptionValid = description.trim().length > 0;
  const isListingTypeValid = Boolean(form.listingType);

  const isReady = isTitleValid && isDescriptionValid && isListingTypeValid;

  const handleTitleChange = (event) => {
    updateForm({
      title: event.target.value,
    });
  };

  const handleDescriptionChange = (event) => {
    updateForm({
      description: event.target.value,
    });
  };

  const handleSelectType = (typeId) => {
    updateForm({
      listingType: typeId,
    });
  };

  const selectedType = types.find((item) => item.id === form.listingType);

  const countryName = form.country === "turkey" ? "Турция" : "Кыргызстан";

  const regionName = regionNames[form.region] || form.region || "Не указан";

  const dealName =
    form.dealType === "sale"
      ? "Продажа"
      : form.dealType === "rent"
        ? "Аренда"
        : "Не указан";

  const categoryName = categoryLabels[form.category] || "Не указана";

  return (
    <div className={styles.step}>
      {/* =========================
          HEADER
      ========================= */}

      <div className={styles.header}>
        <span className={styles.stepBadge}>
          <span className={styles.stepDot} />
          Шаг 6 из 6
        </span>

        <h1>Завершите публикацию</h1>

        <p>
          Добавьте название и описание объявления, а затем выберите подходящий
          вариант размещения.
        </p>
      </div>

      {/* =========================
          01 — TITLE
      ========================= */}

      <section className={styles.section}>
        <div className={styles.sectionLabel}>
          <span>01</span>

          <div>
            <strong>Название объявления</strong>
            <small>Придумайте короткое и понятное название</small>
          </div>
        </div>

        <div className={styles.titleField}>
          <div
            className={`${styles.inputWrapper} ${
              !isTitleValid && title.length > 0 ? styles.inputWrapperError : ""
            }`}
          >
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Например: Уютная квартира у озера"
              maxLength={100}
              autoComplete="off"
              autoFocus
            />

            <span className={styles.titleCounter}>{title.length}/100</span>
          </div>

          <div className={styles.titleFooter}>
            <span>Хорошее название поможет быстрее привлечь внимание.</span>

            {!isTitleValid && (
              <strong className={styles.required}>Обязательное поле</strong>
            )}
          </div>
        </div>
      </section>

      {/* =========================
          02 — DESCRIPTION
      ========================= */}

      <section className={styles.section}>
        <div className={styles.sectionLabel}>
          <span>02</span>

          <div>
            <strong>Описание объявления</strong>
            <small>Расскажите подробнее об объекте</small>
          </div>
        </div>

        <div className={styles.descriptionField}>
          <div
            className={`${styles.textareaWrapper} ${
              !isDescriptionValid && description.length > 0
                ? styles.inputWrapperError
                : ""
            }`}
          >
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Например: Светлая двухкомнатная квартира в центре города. Рядом магазины, школы и остановки общественного транспорта..."
              maxLength={2000}
              rows={7}
            />

            <span className={styles.descriptionCounter}>
              {description.length}/2000
            </span>
          </div>

          <div className={styles.titleFooter}>
            <span>
              Укажите площадь, состояние, расположение, инфраструктуру и другие
              важные детали.
            </span>

            {!isDescriptionValid && (
              <strong className={styles.required}>Обязательное поле</strong>
            )}
          </div>
        </div>
      </section>

      {/* =========================
          03 — LISTING TYPE
      ========================= */}

      <section className={styles.section}>
        <div className={styles.sectionLabel}>
          <span>03</span>

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
                key={item.id}
                type="button"
                className={`${styles.typeCard} ${
                  styles[`type-${item.id}`] || ""
                } ${isSelected ? styles.selected : ""}`}
                onClick={() => handleSelectType(item.id)}
                disabled={isSubmitting}
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
      </section>

      {/* =========================
          04 — SUMMARY
      ========================= */}

      <section className={styles.summary}>
        <div className={styles.summaryHeader}>
          <div className={styles.summaryTitle}>
            <span className={styles.summaryEyebrow}>04</span>

            <div>
              <h3>Проверьте объявление</h3>

              <p>Основная информация перед публикацией</p>
            </div>
          </div>

          <div
            className={`${styles.readyBadge} ${
              !isReady ? styles.notReady : ""
            }`}
          >
            <span />

            {isReady ? "Готово" : "Не заполнено"}
          </div>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryItemWide}>
            <span>Название</span>

            <strong>{title.trim() || "Не указано"}</strong>
          </div>

          <div className={styles.summaryItemWide}>
            <span>Описание</span>

            <strong className={styles.summaryDescription}>
              {description.trim() || "Не указано"}
            </strong>
          </div>

          <div className={styles.summaryItem}>
            <span>Страна</span>

            <strong>{countryName}</strong>
          </div>

          <div className={styles.summaryItem}>
            <span>Регион</span>

            <strong>{regionName}</strong>
          </div>

          <div className={styles.summaryItem}>
            <span>Тип сделки</span>

            <strong>{dealName}</strong>
          </div>

          <div className={styles.summaryItem}>
            <span>Категория</span>

            <strong>{categoryName}</strong>
          </div>

          <div className={styles.summaryItemWide}>
            <span>Адрес</span>

            <strong>{form.address || "Не указан"}</strong>
          </div>

          <div className={styles.summaryItemWide}>
            <span>Размещение</span>

            <strong>{selectedType?.title || "Не выбрано"}</strong>
          </div>
        </div>
      </section>

      {/* =========================
          ACTIONS
      ========================= */}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondary}
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft size={17} />
          Назад
        </button>

        <button
          type="button"
          className={styles.primary}
          disabled={!isReady || isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? "Публикация..." : "Опубликовать"}

          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
