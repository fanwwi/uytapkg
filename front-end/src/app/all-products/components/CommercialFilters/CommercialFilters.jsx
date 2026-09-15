"use client";

import {
  Building2,
  Layers3,
  Paintbrush,
  BrickWall,
  Flame,
  Store,
  ShieldCheck,
  DoorOpen,
  BriefcaseBusiness,
  CreditCard,
  FileText,
  Clock3,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";

import styles from "./CommercialFilters.module.css";

/* =========================================================
   OPTIONS
========================================================= */

const floors = [
  "Любой",
  "Цоколь",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10+",
];

const conditions = [
  "Любое",
  "Дизайнерский ремонт",
  "Евроремонт",
  "Косметический",
  "Под самоотделку",
  "Старый ремонт",
  "Без ремонта",
];

const walls = [
  "Любые",
  "Кирпич",
  "Бетон",
  "Газобетон",
  "Панельные",
  "Монолитные",
  "Монолитно-кирпичные",
  "Монолитно-каркасные",
];

const heating = [
  "Любое",
  "Автономное",
  "Газовое",
  "Центральное",
  "Электрическое",
  "Комбинированное",
];

const premisesTypes = [
  "Любое",
  "Офис",
  "Магазин",
  "Склад",
  "Производство",
  "Общепит",
  "Гостиница",
  "Промбаза",
];

const yesNoAny = ["Любое", "Да", "Нет"];

const rentalBusiness = ["Любое", "Да", "Нет"];

const offerTypes = [
  "Любой",
  "Наличный расчет",
  "Ипотека",
  "Рассрочка",
  "Возможен обмен",
];

const rentalPeriods = ["По часам", "Посуточно", "Помесячно", "На долгий срок"];

const documents = [
  "Любые",
  "Красная книга",
  "Техпаспорт",
  "Договор купли-продажи",
  "Договор долевого участия",
  "Акт приема-передачи",
];

const technicalParameters = [
  "Центральная канализация",
  "Трехфазное питание",
  "Приточно-вытяжная вентиляция",
  "Кондиционирование",
  "Охранная / пожарная сигнализация",
];

const amenities = [
  "Парковка",
  "Отдельный вход",
  "Первая линия",
  "Витринные окна",
  "Охрана",
  "Видеонаблюдение",
  "Пожарная сигнализация",
  "Кондиционер",
  "Вентиляция",
  "Интернет",
  "Мебель",
  "Готовый ремонт",
  "Грузовой вход",
  "Санузел",
];

/* =========================================================
   HELPERS
========================================================= */

function translateOptions(options, t, translationKey) {
  return options.map((value) => ({
    value,
    label: t(`${translationKey}.${value}`),
  }));
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CommercialFilters({ filters, updateFilter }) {
  const { t } = useLanguage();

  const isRent = filters.dealType === "rent";

  /* =======================================================
     TRANSLATED OPTIONS
  ======================================================= */

  const translatedFloors = translateOptions(
    floors,
    t,
    "commercialFilters.options.floors",
  );

  const translatedConditions = translateOptions(
    conditions,
    t,
    "commercialFilters.options.conditions",
  );

  const translatedWalls = translateOptions(
    walls,
    t,
    "commercialFilters.options.walls",
  );

  const translatedHeating = translateOptions(
    heating,
    t,
    "commercialFilters.options.heating",
  );

  const translatedPremisesTypes = translateOptions(
    premisesTypes,
    t,
    "commercialFilters.options.premisesTypes",
  );

  const translatedYesNoAny = translateOptions(
    yesNoAny,
    t,
    "commercialFilters.options.yesNoAny",
  );

  const translatedRentalBusiness = translateOptions(
    rentalBusiness,
    t,
    "commercialFilters.options.rentalBusiness",
  );

  const translatedOfferTypes = translateOptions(
    offerTypes,
    t,
    "commercialFilters.options.offerTypes",
  );

  const translatedRentalPeriods = translateOptions(
    rentalPeriods,
    t,
    "commercialFilters.options.rentalPeriods",
  );

  const translatedDocuments = translateOptions(
    documents,
    t,
    "commercialFilters.options.documents",
  );

  const translatedTechnicalParameters = translateOptions(
    technicalParameters,
    t,
    "commercialFilters.options.technicalParameters",
  );

  const translatedAmenities = translateOptions(
    amenities,
    t,
    "commercialFilters.options.amenities",
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className={styles.grid}>
      <MultiSelect
        icon={Layers3}
        title={t("commercialFilters.floor")}
        options={translatedFloors}
        value={filters.floor || []}
        setValue={(value) => updateFilter("floor", value)}
      />

      <MultiSelect
        icon={Paintbrush}
        title={t("commercialFilters.condition")}
        options={translatedConditions}
        value={filters.condition || []}
        setValue={(value) => updateFilter("condition", value)}
      />

      <MultiSelect
        icon={BrickWall}
        title={t("commercialFilters.walls")}
        options={translatedWalls}
        value={filters.walls || []}
        setValue={(value) => updateFilter("walls", value)}
      />

      <MultiSelect
        icon={Flame}
        title={t("commercialFilters.heating")}
        options={translatedHeating}
        value={filters.heating || []}
        setValue={(value) => updateFilter("heating", value)}
      />

      <MultiSelect
        icon={Store}
        title={t("commercialFilters.premisesType")}
        options={translatedPremisesTypes}
        value={filters.premisesType || []}
        setValue={(value) => updateFilter("premisesType", value)}
      />

      <MultiSelect
        icon={ShieldCheck}
        title={t("commercialFilters.firstLine")}
        options={translatedYesNoAny}
        value={filters.firstLine || []}
        setValue={(value) => updateFilter("firstLine", value)}
      />

      <MultiSelect
        icon={DoorOpen}
        title={t("commercialFilters.separateEntrance")}
        options={translatedYesNoAny}
        value={filters.separateEntrance || []}
        setValue={(value) => updateFilter("separateEntrance", value)}
      />

      <MultiSelect
        icon={BriefcaseBusiness}
        title={t("commercialFilters.readyBusiness")}
        options={translatedRentalBusiness}
        value={filters.rentalBusiness || []}
        setValue={(value) => updateFilter("rentalBusiness", value)}
      />

      {!isRent && (
        <>
          <MultiSelect
            icon={FileText}
            title={t("commercialFilters.documents")}
            options={translatedDocuments}
            value={filters.documents || []}
            setValue={(value) => updateFilter("documents", value)}
          />

          <MultiSelect
            icon={CreditCard}
            title={t("commercialFilters.payment")}
            options={translatedOfferTypes}
            value={filters.offerType || []}
            setValue={(value) => updateFilter("offerType", value)}
          />
        </>
      )}

      {isRent && (
        <MultiSelect
          icon={Clock3}
          title={t("commercialFilters.rentalPeriod")}
          options={translatedRentalPeriods}
          value={filters.rentalPeriod || []}
          setValue={(value) => updateFilter("rentalPeriod", value)}
        />
      )}

      <div className={styles.full}>
        <MultiSelect
          icon={Building2}
          title={t("commercialFilters.technicalParameters")}
          options={translatedTechnicalParameters}
          value={filters.technicalParameters || []}
          setValue={(value) => updateFilter("technicalParameters", value)}
        />
      </div>

      <div className={styles.full}>
        <MultiSelect
          icon={Building2}
          title={t("commercialFilters.amenities")}
          options={translatedAmenities}
          value={filters.amenities || []}
          setValue={(value) => updateFilter("amenities", value)}
        />
      </div>
    </div>
  );
}
