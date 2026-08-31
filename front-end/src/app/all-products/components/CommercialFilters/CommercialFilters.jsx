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
} from "lucide-react";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";


import styles from "./CommercialFilters.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

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

export default function CommercialFilters({ filters, updateFilter }) {
  return (
    <div className={styles.grid}>
      <CustomSelect
        icon={Layers3}
        title="Этаж"
        options={floors}
        value={filters.floor || "Любой"}
        setValue={(value) => updateFilter("floor", value)}
      />

      <CustomSelect
        icon={Paintbrush}
        title="Состояние"
        options={conditions}
        value={filters.condition || "Любое"}
        setValue={(value) => updateFilter("condition", value)}
      />

      <CustomSelect
        icon={BrickWall}
        title="Стены"
        options={walls}
        value={filters.walls || "Любые"}
        setValue={(value) => updateFilter("walls", value)}
      />

      <CustomSelect
        icon={Flame}
        title="Отопление"
        options={heating}
        value={filters.heating || "Любое"}
        setValue={(value) => updateFilter("heating", value)}
      />

      <CustomSelect
        icon={Store}
        title="Тип помещения"
        options={premisesTypes}
        value={filters.premisesType || "Любое"}
        setValue={(value) => updateFilter("premisesType", value)}
      />

      <CustomSelect
        icon={ShieldCheck}
        title="Первая линия"
        options={yesNoAny}
        value={filters.firstLine || "Любое"}
        setValue={(value) => updateFilter("firstLine", value)}
      />

      <CustomSelect
        icon={DoorOpen}
        title="Отдельный вход"
        options={yesNoAny}
        value={filters.separateEntrance || "Любое"}
        setValue={(value) => updateFilter("separateEntrance", value)}
      />

      <CustomSelect
        icon={BriefcaseBusiness}
        title="Готовый бизнес"
        options={rentalBusiness}
        value={filters.rentalBusiness || "Любое"}
        setValue={(value) => updateFilter("rentalBusiness", value)}
      />

      <CustomSelect
        icon={CreditCard}
        title="Оплата"
        options={offerTypes}
        value={filters.offerType || "Любой"}
        setValue={(value) => updateFilter("offerType", value)}
      />

      <div className={styles.full}>
        <MultiSelect
          icon={Building2}
          title="Технические параметры"
          options={technicalParameters}
          value={filters.technicalParameters || []}
          setValue={(value) => updateFilter("technicalParameters", value)}
        />
      </div>

      <div className={styles.full}>
        <MultiSelect
          icon={Building2}
          title="Удобства"
          options={amenities}
          value={filters.amenities || []}
          setValue={(value) => updateFilter("amenities", value)}
        />
      </div>
    </div>
  );
}
