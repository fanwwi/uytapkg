"use client";

import { Map, Fence, FileText, CreditCard, Mountain } from "lucide-react";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";


import styles from "./LandFilters.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

const purposes = [
  "Любое",
  "ИЖС",
  "ЛПХ",
  "Коммерческое",
  "Сельхозназначение",
  "Многоэтажное строительство",
  "Другое",
];

const fence = ["Любой", "Есть", "Нет", "Частично"];

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

const locations = [
  "Любое",
  "В городе",
  "В пригороде",
  "За городом",
  "У трассы",
  "В центре",
];

const terrains = ["Любой", "Ровный", "С уклоном", "Горный", "Холмистый"];

const communications = [
  "Электричество",
  "Газ",
  "Вода",
  "Канализация",
  "Интернет",
  "Отопление",
];

const amenities = [
  "Электричество",
  "Газ",
  "Вода",
  "Канализация",
  "Интернет",
  "Отопление",
  "Подъездная дорога",
  "Огороженная территория",
  "Сад",
  "Плодовые деревья",
  "Вид на горы",
];

export default function LandFilters({ filters, updateFilter }) {
  return (
    <div className={styles.grid}>
      <CustomSelect
        icon={Map}
        title="Назначение"
        options={purposes}
        value={filters.purpose || "Любое"}
        setValue={(value) => updateFilter("purpose", value)}
      />

      <CustomSelect
        icon={Fence}
        title="Забор"
        options={fence}
        value={filters.fence || "Любой"}
        setValue={(value) => updateFilter("fence", value)}
      />

      <CustomSelect
        icon={Map}
        title="Расположение"
        options={locations}
        value={filters.location || "Любое"}
        setValue={(value) => updateFilter("location", value)}
      />

      <CustomSelect
        icon={Mountain}
        title="Рельеф"
        options={terrains}
        value={filters.terrain || "Любой"}
        setValue={(value) => updateFilter("terrain", value)}
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

      <div className={styles.full}>
        <MultiSelect
          icon={Map}
          title="Коммуникации"
          options={communications}
          value={filters.communications || []}
          setValue={(value) => updateFilter("communications", value)}
        />
      </div>

      <div className={styles.full}>
        <MultiSelect
          icon={Map}
          title="Удобства"
          options={amenities}
          value={filters.amenities || []}
          setValue={(value) => updateFilter("amenities", value)}
        />
      </div>
    </div>
  );
}
