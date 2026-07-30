"use client";

import {
  MapPin,
  BedDouble,
  Layers,
  Thermometer,
  ShieldCheck,
  FileCheck,
  BadgeCheck,
  Building2,
  Bath,
} from "lucide-react";

import CustomSelect from "../../../../ui/customSelect/CustomSelect";

import styles from "./AdvancedFilters.module.css";

export default function RoomFilters({
  roomCount,
  setRoomCount,

  floor,
  setFloor,

  condition,
  setCondition,

  walls,
  setWalls,

  heating,
  setHeating,

  roomComfort,
  setRoomComfort,

  privateBathroom,
  setPrivateBathroom,

  roomLocation,
  setRoomLocation,

  documents,
  setDocuments,

  offerType,
  setOfferType,
}) {
  return (
    <div className={styles.wrapper}>
      <CustomSelect
        icon={MapPin}
        title="Расположение комнаты"
        value={roomLocation}
        setValue={setRoomLocation}
        options={[
          "Любое",
          "В квартире",
          "В доме",
          "В общежитии",
          "Гостевой дом",
        ]}
      />

      <CustomSelect
        icon={Building2}
        title="Комнат в объекте"
        value={roomCount}
        setValue={setRoomCount}
        options={[
          "Любое",
          "1 комната",
          "2 комнаты",
          "3 комнаты",
          "4 комнаты",
          "5+ комнат",
        ]}
      />

      <CustomSelect
        icon={Layers}
        title="Этаж"
        value={floor}
        setValue={setFloor}
        options={["Любой", "1 этаж", "2-5 этаж", "6-10 этаж", "11+ этаж"]}
      />

      <CustomSelect
        icon={BedDouble}
        title="Состояние"
        value={condition}
        setValue={setCondition}
        options={[
          "Любое",
          "Дизайнерский ремонт",
          "Евроремонт",
          "Косметический",
          "Без ремонта",
        ]}
      />

      <CustomSelect
        title="Стены"
        value={walls}
        setValue={setWalls}
        options={["Любые", "Кирпич", "Панель", "Монолит", "Газоблок"]}
      />

      <CustomSelect
        icon={Thermometer}
        title="Отопление"
        value={heating}
        setValue={setHeating}
        options={[
          "Любое",
          "Автономное",
          "Газовое",
          "Центральное",
          "Электрическое",
        ]}
      />

      <CustomSelect
        icon={ShieldCheck}
        title="Удобства комнаты"
        value={roomComfort}
        setValue={setRoomComfort}
        options={[
          "Любые",
          "Кондиционер",
          "Балкон",
          "Интернет",
          "Телевизор",
          "Холодильник",
          "Стиральная машина",
          "Меблирована",
        ]}
      />

      <CustomSelect
        icon={Bath}
        title="Свой санузел"
        value={privateBathroom}
        setValue={setPrivateBathroom}
        options={["Не важно", "Да", "Нет"]}
      />

      <CustomSelect
        icon={FileCheck}
        title="Документы"
        value={documents}
        setValue={setDocuments}
        options={[
          "Любые",
          "Красная книга",
          "Тех паспорт",
          "Договор купли-продажи",
        ]}
      />

      <CustomSelect
        icon={BadgeCheck}
        title="Тип предложения"
        value={offerType}
        setValue={setOfferType}
        options={["Любой", "Наличный расчет", "Ипотека", "Рассрочка", "Обмен"]}
      />
    </div>
  );
}
