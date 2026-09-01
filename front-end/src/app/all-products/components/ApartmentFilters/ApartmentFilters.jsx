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
} from "lucide-react";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";

import styles from "./ApartmentFilters.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

const series = [
  "Любой",
  "Новостройка",
  "102 серия",
  "104 серия",
  "105 серия",
  "106 серия",
  "Сталинка",
  "Хрущевка",
  "Элитка",
  "Пентхаус",
];

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
  "Любой",
  "Дизайнерский ремонт",
  "Евроремонт",
  "Косметический",
  "Под самоотделку",
  "Старый ремонт",
  "Без ремонта",
];

const walls = [
  "Любой",
  "Кирпич",
  "Бетон",
  "Газобетон",
  "Панельные",
  "Монолитные",
  "Монолитно-кирпичные",
  "Монолитно-каркасные",
];

const heating = [
  "Любой",
  "Автономное",
  "Газовое",
  "Центральное",
  "Электрическое",
  "Комбинированное",
];

const documents = [
  "Любые",
  "Красная книга",
  "Техпаспорт",
  "Договор купли-продажи",
  "Договор долевого участия",
  "Акт приема-передачи",
];

const furniture = [
  "Любая",
  "Полностью меблирована",
  "Частично меблирована",
  "Без мебели",
];

const offerTypes = [
  "Любой",
  "Наличный расчет",
  "Ипотека",
  "Рассрочка",
  "Возможен обмен",
];

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

export default function ApartmentFilters({ filters, updateFilter }) {
  return (
    <div className={styles.grid}>
      <CustomSelect
        icon={Building2}
        title="Серия"
        options={series}
        value={filters.series || "Любой"}
        setValue={(value) => updateFilter("series", value)}
      />

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
        value={filters.condition || "Любой"}
        setValue={(value) => updateFilter("condition", value)}
      />

      <CustomSelect
        icon={BrickWall}
        title="Стены"
        options={walls}
        value={filters.walls || "Любой"}
        setValue={(value) => updateFilter("walls", value)}
      />

      <CustomSelect
        icon={Flame}
        title="Отопление"
        options={heating}
        value={filters.heating || "Любой"}
        setValue={(value) => updateFilter("heating", value)}
      />

      <CustomSelect
        icon={FileText}
        title="Документы"
        options={documents}
        value={filters.documents || "Любые"}
        setValue={(value) => updateFilter("documents", value)}
      />

      <CustomSelect
        icon={Sofa}
        title="Мебель"
        options={furniture}
        value={filters.furniture || "Любая"}
        setValue={(value) => updateFilter("furniture", value)}
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
