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
} from "lucide-react";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";


import styles from "./CottageFilters.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

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
  return (
    <div className={styles.grid}>
      <CustomSelect
        icon={Home}
        title="Тип"
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
        title="Оплата"
        options={offerTypes}
        value={filters.offerType || "Любой"}
        setValue={(value) => updateFilter("offerType", value)}
      />

      <div className={styles.beach}>
        <div className={styles.beachTitle}>
          <Waves size={17} />
          <span>До пляжа, м</span>
        </div>

        <div className={styles.inputs}>
          <input
            type="number"
            placeholder="От"
            value={filters.beachDistanceFrom || ""}
            onChange={(event) =>
              updateFilter("beachDistanceFrom", event.target.value)
            }
          />

          <input
            type="number"
            placeholder="До"
            value={filters.beachDistanceTo || ""}
            onChange={(event) =>
              updateFilter("beachDistanceTo", event.target.value)
            }
          />
        </div>
      </div>

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
