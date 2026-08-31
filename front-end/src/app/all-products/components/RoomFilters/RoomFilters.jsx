"use client";

import {
  MapPin,
  Layers3,
  Paintbrush,
  BrickWall,
  Flame,
  DoorOpen,
  FileText,
  CreditCard,
} from "lucide-react";

import CustomSelectBlack from "@/components/ui/customSelectBlack/CustomSelectBlack";
import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";


import styles from "./RoomFilters.module.css";

const locations = [
  "Любое",
  "В городе",
  "В пригороде",
  "За городом",
  "У трассы",
  "В центре",
];

const rooms = ["Любое", "1", "2", "3", "4", "5+"];

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

const bathroom = ["Любой", "Есть", "Нет"];

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
  "Мебель",
  "Бытовая техника",
  "Балкон / лоджия",
  "Лифт",
  "Интернет",
  "Видеонаблюдение",
  "Охрана",
  "Парковка",
  "Закрытая территория",
  "Вид на горы",
];

export default function RoomFilters({ filters, updateFilter }) {
  return (
    <div className={styles.grid}>
      <CustomSelectBlack
        icon={MapPin}
        title="Расположение"
        options={locations}
        value={filters.location || "Любое"}
        setValue={(value) => updateFilter("location", value)}
      />

      <CustomSelectBlack
        icon={DoorOpen}
        title="Комнат в квартире"
        options={rooms}
        value={filters.roomsInApartment || "Любое"}
        setValue={(value) => updateFilter("roomsInApartment", value)}
      />

      <CustomSelectBlack
        icon={Layers3}
        title="Этаж"
        options={floors}
        value={filters.floor || "Любой"}
        setValue={(value) => updateFilter("floor", value)}
      />

      <CustomSelectBlack
        icon={Paintbrush}
        title="Состояние"
        options={conditions}
        value={filters.condition || "Любое"}
        setValue={(value) => updateFilter("condition", value)}
      />

      <CustomSelectBlack
        icon={BrickWall}
        title="Стены"
        options={walls}
        value={filters.walls || "Любые"}
        setValue={(value) => updateFilter("walls", value)}
      />

      <CustomSelectBlack
        icon={Flame}
        title="Отопление"
        options={heating}
        value={filters.heating || "Любое"}
        setValue={(value) => updateFilter("heating", value)}
      />

      <CustomSelectBlack
        icon={DoorOpen}
        title="Санузел"
        options={bathroom}
        value={filters.privateBathroom || "Любой"}
        setValue={(value) => updateFilter("privateBathroom", value)}
      />

      <CustomSelectBlack
        icon={FileText}
        title="Документы"
        options={documents}
        value={filters.documents || "Любые"}
        setValue={(value) => updateFilter("documents", value)}
      />

      <CustomSelectBlack
        icon={CreditCard}
        title="Оплата"
        options={offerTypes}
        value={filters.offerType || "Любой"}
        setValue={(value) => updateFilter("offerType", value)}
      />

      <div className={styles.full}>
        <MultiSelect
          icon={DoorOpen}
          title="Удобства"
          options={amenities}
          value={filters.amenities || []}
          setValue={(value) => updateFilter("amenities", value)}
        />
      </div>
    </div>
  );
}
