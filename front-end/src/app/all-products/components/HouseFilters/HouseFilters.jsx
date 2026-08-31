"use client";

import {
  Home,
  Layers3,
  Flame,
  Droplets,
  Zap,
  FileText,
  CreditCard,
} from "lucide-react";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";


import styles from "./HouseFilters.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

const houseTypes = [
  "Любой",
  "Частный дом",
  "Особняк",
  "Коттедж",
  "Таунхаус",
  "Дача",
  "Времянка",
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

const amenities = [
  "Гараж",
  "Парковка",
  "Баня",
  "Сауна",
  "Бассейн",
  "Терраса",
  "Балкон",
  "Подвал",
  "Погреб",
  "Мебель",
  "Бытовая техника",
  "Охрана",
  "Видеонаблюдение",
  "Закрытая территория",
  "Сад",
  "Огород",
  "Вид на горы",
];

export default function HouseFilters({ filters, updateFilter }) {
  return (
    <div className={styles.grid}>
      <CustomSelect
        icon={Home}
        title="Тип дома"
        options={houseTypes}
        value={filters.houseType || "Любой"}
        setValue={(value) => updateFilter("houseType", value)}
      />

      <CustomSelect
        icon={Layers3}
        title="Этажность"
        options={floors}
        value={filters.floors || "Любой"}
        setValue={(value) => updateFilter("floors", value)}
      />

      <CustomSelect
        icon={Flame}
        title="Отопление"
        options={heating}
        value={filters.heating || "Любой"}
        setValue={(value) => updateFilter("heating", value)}
      />

      <CustomSelect
        icon={Droplets}
        title="Канализация"
        options={sewerage}
        value={filters.sewerage || "Любая"}
        setValue={(value) => updateFilter("sewerage", value)}
      />

      <CustomSelect
        icon={Droplets}
        title="Вода"
        options={water}
        value={filters.water || "Любая"}
        setValue={(value) => updateFilter("water", value)}
      />

      <CustomSelect
        icon={Zap}
        title="Электричество"
        options={electricity}
        value={filters.electricity || "Любая"}
        setValue={(value) => updateFilter("electricity", value)}
      />

      <CustomSelect
        icon={FileText}
        title="Документы"
        options={documents}
        value={filters.documents || "Любые"}
        setValue={(value) => updateFilter("documents", value)}
      />

      <CustomSelect
        icon={CreditCard}
        title="Способ оплаты"
        options={offerTypes}
        value={filters.offerType || "Любой"}
        setValue={(value) => updateFilter("offerType", value)}
      />

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
