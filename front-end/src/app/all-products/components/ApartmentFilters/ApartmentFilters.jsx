"use client";

import {
  Building2,
  Layers3,
  Paintbrush,
  BrickWall,
  Flame,
  FileText,
  Sofa,
  CreditCard,
  Clock3,
  PawPrint,
} from "lucide-react";

import { useEffect } from "react";

import { useLanguage } from "@/context/LanguageContext";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";

import styles from "./ApartmentFilters.module.css";
import ResidentialComplexFilter from "../ResidentalComplexFilter/ResidentalComplexFilter";

/* =========================================================
   OPTIONS
========================================================= */

const series = [
  "Новостройка",
  "102 серия",
  "104 серия",
  "105 серия",
  "106 обычная",
  "106 улучшенная",
  "107 обычная",
  "107 улучшенная",
  "Индивидуалка",
  "Сталинка",
  "Хрущевка",
  "Элитка",
  "Пентхаус",
];

const floors = ["Цоколь", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

const conditions = [
  "Дизайнерский ремонт",
  "Евроремонт",
  "Косметический",
  "Под самоотделку",
  "Старый ремонт",
  "Без ремонта",
];

const walls = [
  "Кирпич",
  "Бетон",
  "Газобетон",
  "Панельные",
  "Монолитные",
  "Монолитно-кирпичные",
  "Монолитно-каркасные",
];

const heating = [
  "Автономное",
  "Газовое",
  "Центральное",
  "Электрическое",
  "Комбинированное",
];

const documents = [
  "Красная книга",
  "Техпаспорт",
  "Договор купли-продажи",
  "Договор долевого участия",
  "Акт приема-передачи",
];

const furniture = [
  "Полностью меблирована",
  "Частично меблирована",
  "Без мебели",
];

const offerTypes = [
  "Наличный расчет",
  "Ипотека",
  "Рассрочка",
  "Возможен обмен",
];

const rentalPeriods = ["По часам", "Посуточно", "Помесячно", "На долгий срок"];

const petsOptions = ["Да", "Нет"];

const amenities = [
  "Балкон / лоджия",
  "Лифт",
  "Раздельный санузел",
  "Совмещенный санузел",
  "Встроенная кухня",
  "Бытовая техника",
  "Видеонаблюдение",
  "Охрана",
  "Парковка",
  "Закрытая территория",
  "Вид на горы",
  "Не угловая",
  "Не затапливалась",
  "Не сдавалась квартирантам",
  "Бронированные двери",
];

/* =========================================================
   ЖК ПО СЕРИЯМ
========================================================= */

const residentialComplexSeries = [
  "Новостройка",
  "Элитка",
  "Индивидуалка",
  "106 обычная",
  "106 улучшенная",
  "107 обычная",
  "107 улучшенная",
];

/* =========================================================
   HELPERS
========================================================= */

function normalizeMultiValue(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value;
}

function translateOptions(options, t, translationKey) {
  return options.map((value) => ({
    value,
    label: t(`${translationKey}.${value}`),
  }));
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ApartmentFilters({ filters, updateFilter }) {
  const { t } = useLanguage();

  const seriesValue = normalizeMultiValue(filters.series);

  const floorValue = normalizeMultiValue(filters.floor);

  const conditionValue = normalizeMultiValue(filters.condition);

  const wallsValue = normalizeMultiValue(filters.walls);

  const heatingValue = normalizeMultiValue(filters.heating);

  const documentsValue = normalizeMultiValue(filters.documents);

  const furnitureValue = normalizeMultiValue(filters.furniture);

  const offerTypeValue = normalizeMultiValue(filters.offerType);

  const residentialComplexValue = normalizeMultiValue(
    filters.residentialComplex,
  );

  const rentalPeriodValue = normalizeMultiValue(filters.rentalPeriod);

  const petsValue = normalizeMultiValue(filters.pets);

  const amenitiesValue = normalizeMultiValue(filters.amenities);

  /* =======================================================
     TRANSLATED OPTIONS
  ======================================================= */

  const translatedSeries = translateOptions(
    series,
    t,
    "apartmentFilters.options.series",
  );

  const translatedFloors = translateOptions(
    floors,
    t,
    "apartmentFilters.options.floors",
  );

  const translatedConditions = translateOptions(
    conditions,
    t,
    "apartmentFilters.options.conditions",
  );

  const translatedWalls = translateOptions(
    walls,
    t,
    "apartmentFilters.options.walls",
  );

  const translatedHeating = translateOptions(
    heating,
    t,
    "apartmentFilters.options.heating",
  );

  const translatedDocuments = translateOptions(
    documents,
    t,
    "apartmentFilters.options.documents",
  );

  const translatedFurniture = translateOptions(
    furniture,
    t,
    "apartmentFilters.options.furniture",
  );

  const translatedOfferTypes = translateOptions(
    offerTypes,
    t,
    "apartmentFilters.options.offerTypes",
  );

  const translatedRentalPeriods = translateOptions(
    rentalPeriods,
    t,
    "apartmentFilters.options.rentalPeriods",
  );

  const translatedPetsOptions = translateOptions(
    petsOptions,
    t,
    "apartmentFilters.options.pets",
  );

  const translatedAmenities = translateOptions(
    amenities,
    t,
    "apartmentFilters.options.amenities",
  );

  /* =======================================================
     DEAL
  ======================================================= */

  const isRent = filters.dealType === "rent";

  /* =======================================================
     ЖК
  ======================================================= */

  const showResidentialComplex = seriesValue.some((value) =>
    residentialComplexSeries.includes(value),
  );

  /*
   * Если пользователь убрал все серии,
   * для которых доступен ЖК,
   * очищаем выбранные ЖК.
   */
  useEffect(() => {
    if (!showResidentialComplex && residentialComplexValue.length > 0) {
      updateFilter("residentialComplex", []);
    }
  }, [showResidentialComplex, residentialComplexValue.length]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className={styles.grid}>
      {/* =================================================
          SERIES
      ================================================= */}

      <MultiSelect
        icon={Building2}
        title={t("apartmentFilters.series")}
        options={translatedSeries}
        value={seriesValue}
        setValue={(value) => updateFilter("series", value)}
      />

      {/* =================================================
          ЖК
      ================================================= */}

      {showResidentialComplex && (
        <div className={styles.full}>
          <ResidentialComplexFilter
            value={residentialComplexValue}
            setValue={(value) => updateFilter("residentialComplex", value)}
          />
        </div>
      )}

      {/* =================================================
          FLOOR
      ================================================= */}

      <MultiSelect
        icon={Layers3}
        title={t("apartmentFilters.floor")}
        options={translatedFloors}
        value={floorValue}
        setValue={(value) => updateFilter("floor", value)}
      />

      {/* =================================================
          CONDITION
      ================================================= */}

      <MultiSelect
        icon={Paintbrush}
        title={t("apartmentFilters.condition")}
        options={translatedConditions}
        value={conditionValue}
        setValue={(value) => updateFilter("condition", value)}
      />

      {/* =================================================
          WALLS
      ================================================= */}

      <MultiSelect
        icon={BrickWall}
        title={t("apartmentFilters.walls")}
        options={translatedWalls}
        value={wallsValue}
        setValue={(value) => updateFilter("walls", value)}
      />

      {/* =================================================
          HEATING
      ================================================= */}

      <MultiSelect
        icon={Flame}
        title={t("apartmentFilters.heating")}
        options={translatedHeating}
        value={heatingValue}
        setValue={(value) => updateFilter("heating", value)}
      />

      {/* =================================================
          SALE / DOCUMENTS
      ================================================= */}

      {!isRent && (
        <>
          <MultiSelect
            icon={FileText}
            title={t("apartmentFilters.documents")}
            options={translatedDocuments}
            value={documentsValue}
            setValue={(value) => updateFilter("documents", value)}
          />

          <MultiSelect
            icon={CreditCard}
            title={t("apartmentFilters.paymentMethod")}
            options={translatedOfferTypes}
            value={offerTypeValue}
            setValue={(value) => updateFilter("offerType", value)}
          />
        </>
      )}

      {/* =================================================
          RENTAL PERIOD
      ================================================= */}

      {isRent && (
        <MultiSelect
          icon={Clock3}
          title={t("apartmentFilters.rentalPeriod")}
          options={translatedRentalPeriods}
          value={rentalPeriodValue}
          setValue={(value) => updateFilter("rentalPeriod", value)}
        />
      )}

      {/* =================================================
          PETS
      ================================================= */}

      {isRent && (
        <MultiSelect
          icon={PawPrint}
          title={t("apartmentFilters.pets")}
          options={translatedPetsOptions}
          value={petsValue}
          setValue={(value) => updateFilter("pets", value)}
        />
      )}

      {/* =================================================
          FURNITURE
      ================================================= */}

      <MultiSelect
        icon={Sofa}
        title={t("apartmentFilters.furniture")}
        options={translatedFurniture}
        value={furnitureValue}
        setValue={(value) => updateFilter("furniture", value)}
      />

      {/* =================================================
          AMENITIES
      ================================================= */}

      <div className={styles.full}>
        <MultiSelect
          icon={Building2}
          title={t("apartmentFilters.amenities")}
          options={translatedAmenities}
          value={amenitiesValue}
          setValue={(value) => updateFilter("amenities", value)}
        />
      </div>
    </div>
  );
}
