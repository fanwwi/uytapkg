"use client";

import {
  Map,
  Fence,
  FileText,
  CreditCard,
  Mountain,
  Clock3,
} from "lucide-react";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";

import styles from "./LandFilters.module.css";

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

const rentalPeriods = ["По часам", "Посуточно", "Помесячно", "На долгий срок"];

const communications = [
  "Электричество",
  "Газ",
  "Вода",
  "Канализация",
  "Интернет",
  "Отопление",
];

const amenities = [
  "Подъездная дорога",
  "Огороженная территория",
  "Сад",
  "Плодовые деревья",
  "Вид на горы",
];

export default function LandFilters({ filters, updateFilter }) {
  const isRent = filters.dealType === "rent";

  return (
    <div className={styles.grid}>
      <MultiSelect
        icon={Map}
        title="Назначение"
        options={purposes}
        value={filters.purpose || []}
        setValue={(value) => updateFilter("purpose", value)}
      />

      <MultiSelect
        icon={Fence}
        title="Забор"
        options={fence}
        value={filters.fence || []}
        setValue={(value) => updateFilter("fence", value)}
      />

      <MultiSelect
        icon={Map}
        title="Расположение"
        options={locations}
        value={filters.location || []}
        setValue={(value) => updateFilter("location", value)}
      />

      <MultiSelect
        icon={Mountain}
        title="Рельеф"
        options={terrains}
        value={filters.terrain || []}
        setValue={(value) => updateFilter("terrain", value)}
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
