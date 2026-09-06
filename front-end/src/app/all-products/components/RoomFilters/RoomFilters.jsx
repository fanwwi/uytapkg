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
  Clock3,
} from "lucide-react";

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

const rentalPeriods = ["По часам", "Посуточно", "Помесячно", "На долгий срок"];

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
  const isRent = filters.dealType === "rent";

  return (
    <div className={styles.grid}>
      <MultiSelect
        icon={MapPin}
        title="Расположение"
        options={locations}
        value={filters.location || []}
        setValue={(value) => updateFilter("location", value)}
      />

      <MultiSelect
        icon={DoorOpen}
        title="Комнат в квартире"
        options={rooms}
        value={filters.roomsInApartment || []}
        setValue={(value) => updateFilter("roomsInApartment", value)}
      />

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
        icon={DoorOpen}
        title="Свой санузел"
        options={bathroom}
        value={filters.privateBathroom || []}
        setValue={(value) => updateFilter("privateBathroom", value)}
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
