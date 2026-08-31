"use client";

import {
  Ruler,
  Car,
  BrickWall,
  ShieldCheck,
  DoorOpen,
  Warehouse,
  Zap,
  Truck,
  FileText,
  CreditCard,
} from "lucide-react";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";


import styles from "./ParkingFilters.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

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

const electricity = ["Любая", "Есть", "Возможно подведение", "Нет"];

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
  return (
    <div className={styles.grid}>
      <CustomSelect
        icon={Ruler}
        title="Высота потолка"
        options={ceilingHeight}
        value={filters.ceilingHeight || "Любая"}
        setValue={(value) => updateFilter("ceilingHeight", value)}
      />

      <CustomSelect
        icon={Car}
        title="Тип"
        options={parkingTypes}
        value={filters.parkingType || "Любой"}
        setValue={(value) => updateFilter("parkingType", value)}
      />

      <CustomSelect
        icon={BrickWall}
        title="Материал"
        options={materials}
        value={filters.material || "Любой"}
        setValue={(value) => updateFilter("material", value)}
      />

      <CustomSelect
        icon={ShieldCheck}
        title="Охрана"
        options={yesNo}
        value={filters.security || "Любая"}
        setValue={(value) => updateFilter("security", value)}
      />

      <CustomSelect
        icon={DoorOpen}
        title="Ворота"
        options={yesNo}
        value={filters.gates || "Любое"}
        setValue={(value) => updateFilter("gates", value)}
      />

      <CustomSelect
        icon={Warehouse}
        title="Смотровая яма"
        options={yesNo}
        value={filters.inspectionPit || "Любая"}
        setValue={(value) => updateFilter("inspectionPit", value)}
      />

      <CustomSelect
        icon={Warehouse}
        title="Подвал"
        options={yesNo}
        value={filters.basement || "Любой"}
        setValue={(value) => updateFilter("basement", value)}
      />

      <CustomSelect
        icon={Zap}
        title="Электричество"
        options={electricity}
        value={filters.electricity || "Любая"}
        setValue={(value) => updateFilter("electricity", value)}
      />

      <CustomSelect
        icon={Truck}
        title="Заезд грузовых"
        options={truckAccess}
        value={filters.truckAccess || "Любой"}
        setValue={(value) => updateFilter("truckAccess", value)}
      />

      <CustomSelect
        icon={DoorOpen}
        title="Тип ворот"
        options={gateTypes}
        value={filters.gateType || "Любой"}
        setValue={(value) => updateFilter("gateType", value)}
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
