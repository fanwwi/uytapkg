"use client";

import {
  Ruler,
  Car,
  BrickWall,
  DoorOpen,
  Warehouse,
  Truck,
  FileText,
  CreditCard,
  Clock3,
} from "lucide-react";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";

import styles from "./ParkingFilters.module.css";

const ceilingHeight = ["Любая", "До 2.5 м", "2.5–3 м", "3–4 м", "4+ м"];

const parkingTypes = [
  "Любой",
  "Подземный",
  "Наземный",
  "Многоуровневый",
  "Гараж",
  "Паркинг",
];

const materials = ["Любой", "Кирпич", "Бетон", "Металл", "Панель", "Другое"];

const yesNo = ["Любое", "Есть", "Нет"];

const truckAccess = ["Любой", "Да", "Нет"];

const gateTypes = [
  "Любой",
  "Распашные",
  "Секционные",
  "Откатные",
  "Роллетные",
  "Автоматические",
];

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
  "Освещение",
  "Электричество",
  "Отопление",
  "Видеонаблюдение",
  "Охрана",
  "Автоматические ворота",
  "Смотровая яма",
  "Погреб",
  "Вода",
  "Удобный заезд",
];

export default function ParkingFilters({ filters, updateFilter }) {
  const isRent = filters.dealType === "rent";

  return (
    <div className={styles.grid}>
      <MultiSelect
        icon={Ruler}
        title="Высота потолка"
        options={ceilingHeight}
        value={filters.ceilingHeight || []}
        setValue={(value) => updateFilter("ceilingHeight", value)}
      />

      <MultiSelect
        icon={Car}
        title="Тип"
        options={parkingTypes}
        value={filters.parkingType || []}
        setValue={(value) => updateFilter("parkingType", value)}
      />

      <MultiSelect
        icon={BrickWall}
        title="Материал"
        options={materials}
        value={filters.material || []}
        setValue={(value) => updateFilter("material", value)}
      />

      <MultiSelect
        icon={DoorOpen}
        title="Ворота"
        options={yesNo}
        value={filters.gates || []}
        setValue={(value) => updateFilter("gates", value)}
      />

      <MultiSelect
        icon={Warehouse}
        title="Подвал"
        options={yesNo}
        value={filters.basement || []}
        setValue={(value) => updateFilter("basement", value)}
      />

      <MultiSelect
        icon={Truck}
        title="Заезд грузовых"
        options={truckAccess}
        value={filters.truckAccess || []}
        setValue={(value) => updateFilter("truckAccess", value)}
      />

      <MultiSelect
        icon={DoorOpen}
        title="Тип ворот"
        options={gateTypes}
        value={filters.gateType || []}
        setValue={(value) => updateFilter("gateType", value)}
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
          icon={Car}
          title="Удобства"
          options={amenities}
          value={filters.amenities || []}
          setValue={(value) => updateFilter("amenities", value)}
        />
      </div>
    </div>
  );
}
