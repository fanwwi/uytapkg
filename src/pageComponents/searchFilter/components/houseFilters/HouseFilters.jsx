"use client";

import {
  Home,
  Layers,
  Ruler,
  Thermometer,
  Droplets,
  Zap,
  FileCheck,
  Sofa,
  BadgeCheck,
  Building2,
  CalendarDays,
} from "lucide-react";

import CustomSelect from "../../../../components/ui/customSelect/CustomSelect";

import styles from "./HouseFilters.module.css";

export default function HouseFilters({
  deal,

  houseType,
  setHouseType,

  floors,
  setFloors,

  condition,
  setCondition,

  walls,
  setWalls,

  heating,
  setHeating,

  sewage,
  setSewage,

  water,
  setWater,

  electricity,
  setElectricity,

  documents,
  setDocuments,

  furniture,
  setFurniture,

  offerType,
  setOfferType,

  rentPeriod,
  setRentPeriod,

  landFrom,
  setLandFrom,

  landTo,
  setLandTo,
}) {
  return (
    <div className={styles.wrapper}>
      <CustomSelect
        icon={Home}
        title="Тип дома"
        value={houseType}
        setValue={setHouseType}
        options={[
          "Любой",
          "Частный дом",
          "Особняк",
          "Коттедж",
          "Таунхаус",
          "Дача",
          "Времянка",
        ]}
      />

      <CustomSelect
        icon={Layers}
        title="Этажность"
        value={floors}
        setValue={setFloors}
        options={["Любая", "1 этаж", "2 этажа", "3 этажа", "4+ этажа"]}
      />

      <div className={styles.area}>
        <div className={styles.icon}>
          <Ruler />
        </div>

        <input
          placeholder="Участок от м²"
          value={landFrom}
          onChange={(e) => setLandFrom(e.target.value.replace(/\D/g, ""))}
        />

        <span>-</span>

        <input
          placeholder="Участок до м²"
          value={landTo}
          onChange={(e) => setLandTo(e.target.value.replace(/\D/g, ""))}
        />
      </div>

      <CustomSelect
        icon={Building2}
        title="Состояние"
        value={condition}
        setValue={setCondition}
        options={[
          "Любое",
          "Новый дом",
          "Евроремонт",
          "Косметический ремонт",
          "Без ремонта",
          "Недостроенный",
        ]}
      />

      <CustomSelect
        title="Материал стен"
        value={walls}
        setValue={setWalls}
        options={[
          "Любые",
          "Кирпич",
          "Газоблок",
          "Газобетон",
          "Монолит",
          "Панель",
          "Саман",
        ]}
      />

      <CustomSelect
        icon={Thermometer}
        title="Отопление"
        value={heating}
        setValue={setHeating}
        options={[
          "Любое",
          "Газовое",
          "Центральное",
          "Автономное",
          "Электрическое",
          "Печное",
        ]}
      />

      <CustomSelect
        icon={Droplets}
        title="Канализация"
        value={sewage}
        setValue={setSewage}
        options={[
          "Любая",
          "Центральная",
          "Возможно подведение",
          "Септик",
          "Нет",
        ]}
      />

      <CustomSelect
        icon={Droplets}
        title="Питьевая вода"
        value={water}
        setValue={setWater}
        options={[
          "Любая",
          "Централизованное",
          "Возможно подведение",
          "Скважина",
          "Нет",
        ]}
      />

      <CustomSelect
        icon={Zap}
        title="Электричество"
        value={electricity}
        setValue={setElectricity}
        options={["Любое", "Есть", "Возможно подведение", "Нет"]}
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
        icon={Sofa}
        title="Мебель"
        value={furniture}
        setValue={setFurniture}
        options={["Любая", "Полная", "Частичная", "Без мебели"]}
      />

      <CustomSelect
        icon={BadgeCheck}
        title="Тип предложения"
        value={offerType}
        setValue={setOfferType}
        options={["Любой", "Наличный расчет", "Ипотека", "Рассрочка", "Обмен"]}
      />

      {deal === "rent" && (
        <CustomSelect
          icon={CalendarDays}
          title="Период аренды"
          value={rentPeriod}
          setValue={setRentPeriod}
          options={["Любой", "Посуточно", "Помесячно", "Долгосрочно"]}
        />
      )}
    </div>
  );
}
