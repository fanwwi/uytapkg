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

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";

import styles from "./CommercialFilters.module.css";

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
  const isRent = filters.dealType === "rent";

  return (
    <div className={styles.grid}>
      <MultiSelect
        icon={Layers3}
        title="Этаж"
        options={floors}
        value={filters.floor || []}
        setValue={(value) => updateFilter("floor", value)}
      />

      <MultiSelect
        icon={Paintbrush}
        title="Состояние"
        options={conditions}
        value={filters.condition || []}
        setValue={(value) => updateFilter("condition", value)}
      />

      <MultiSelect
        icon={BrickWall}
        title="Стены"
        options={walls}
        value={filters.walls || []}
        setValue={(value) => updateFilter("walls", value)}
      />

      <MultiSelect
        icon={Flame}
        title="Отопление"
        options={heating}
        value={filters.heating || []}
        setValue={(value) => updateFilter("heating", value)}
      />

      <MultiSelect
        icon={Store}
        title="Тип помещения"
        options={premisesTypes}
        value={filters.premisesType || []}
        setValue={(value) => updateFilter("premisesType", value)}
      />

      <MultiSelect
        icon={ShieldCheck}
        title="Первая линия"
        options={yesNoAny}
        value={filters.firstLine || []}
        setValue={(value) => updateFilter("firstLine", value)}
      />

      <MultiSelect
        icon={DoorOpen}
        title="Отдельный вход"
        options={yesNoAny}
        value={filters.separateEntrance || []}
        setValue={(value) => updateFilter("separateEntrance", value)}
      />

      <MultiSelect
        icon={BriefcaseBusiness}
        title="Готовый бизнес"
        options={rentalBusiness}
        value={filters.rentalBusiness || []}
        setValue={(value) => updateFilter("rentalBusiness", value)}
      />

      {!isRent && (
        <>
          <MultiSelect
            icon={FileText}
            title="Документы"
            options={[
              "Любые",
              "Красная книга",
              "Техпаспорт",
              "Договор купли-продажи",
              "Договор долевого участия",
              "Акт приема-передачи",
            ]}
            value={filters.documents || []}
            setValue={(value) => updateFilter("documents", value)}
          />

          <MultiSelect
            icon={CreditCard}
            title="Оплата"
            options={offerTypes}
            value={filters.offerType || []}
            setValue={(value) => updateFilter("offerType", value)}
          />
        </>
      )}

      {isRent && (
        <MultiSelect
          icon={Clock3}
          title="Период аренды"
          options={rentalPeriods}
          value={filters.rentalPeriod || []}
          setValue={(value) => updateFilter("rentalPeriod", value)}
        />
      )}

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
