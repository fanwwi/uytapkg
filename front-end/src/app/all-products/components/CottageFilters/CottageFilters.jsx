"use client";

import {
  Home,
  Layers3,
  Flame,
  Droplets,
  Zap,
  FileText,
  CreditCard,
  Waves,
  Clock3,
} from "lucide-react";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";

import styles from "./CottageFilters.module.css";

const houseTypes = [
  "Любой",
  "Коттедж",
  "Особняк",
  "Таунхаус",
  "Загородный дом",
];

const floors = ["Любой", "1", "2", "3", "4+"];

const heating = [
  "Любой",
  "Автономное",
  "Газовое",
  "Центральное",
  "Электрическое",
  "Комбинированное",
];

const sewerage = [
  "Любая",
  "Возможно подведение",
  "Центральная",
  "Септик",
  "Нет",
];

const water = [
  "Любая",
  "Центральная",
  "Скважина",
  "Возможно подведение",
  "Нет",
];

const electricity = ["Любая", "Есть", "Возможно подведение", "Нет"];

const documents = [
  "Любые",
  "Красная книга",
  "Техпаспорт",
  "Договор купли-продажи",
  "Договор долевого участия",
  "Акт приема-передачи",
];

const offerTypes = [
  "Любой",
  "Наличный расчет",
  "Ипотека",
  "Рассрочка",
  "Возможен обмен",
];

const rentalPeriods = ["По часам", "Посуточно", "Помесячно", "На долгий срок"];

const amenities = [
  "Бассейн",
  "Сауна",
  "Баня",
  "Терраса",
  "Балкон",
  "Гараж",
  "Парковка",
  "Сад",
  "Беседка",
  "Мангал",
  "Вид на горы",
  "Первая линия",
  "Закрытая территория",
  "Охрана",
  "Видеонаблюдение",
  "Мебель",
  "Бытовая техника",
];

export default function CottageFilters({ filters, updateFilter }) {
  const isRent = filters.dealType === "rent";

  return (
    <div className={styles.grid}>
      <MultiSelect
        icon={Home}
        title="Тип"
        options={houseTypes}
        value={filters.houseType || []}
        setValue={(value) => updateFilter("houseType", value)}
      />

      <MultiSelect
        icon={Layers3}
        title="Этажность"
        options={floors}
        value={filters.floors || []}
        setValue={(value) => updateFilter("floors", value)}
      />

      <MultiSelect
        icon={Flame}
        title="Отопление"
        options={heating}
        value={filters.heating || []}
        setValue={(value) => updateFilter("heating", value)}
      />

      <MultiSelect
        icon={Droplets}
        title="Канализация"
        options={sewerage}
        value={filters.sewerage || []}
        setValue={(value) => updateFilter("sewerage", value)}
      />

      <MultiSelect
        icon={Droplets}
        title="Вода"
        options={water}
        value={filters.water || []}
        setValue={(value) => updateFilter("water", value)}
      />

      <MultiSelect
        icon={Zap}
        title="Электричество"
        options={electricity}
        value={filters.electricity || []}
        setValue={(value) => updateFilter("electricity", value)}
      />

      {!isRent && (
        <>
          <MultiSelect
            icon={FileText}
            title="Документы"
            options={documents}
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
          icon={Home}
          title="Удобства"
          options={amenities}
          value={filters.amenities || []}
          setValue={(value) => updateFilter("amenities", value)}
        />
      </div>
    </div>
  );
}
