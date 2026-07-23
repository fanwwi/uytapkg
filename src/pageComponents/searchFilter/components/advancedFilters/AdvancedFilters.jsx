"use client";

import {
  Layers,
  Thermometer,
  FileCheck,
  Sofa,
  ShieldCheck,
  BadgeCheck,
  CalendarDays,
  Home,
  Droplets,
  Zap,
  Ruler,
  MapPin,
  Mountain,
} from "lucide-react";

import CustomSelect from "../../../../components/ui/customSelect/CustomSelect";

import styles from "./AdvancedFilters.module.css";

export default function AdvancedFilters({
  category,
  deal,

  roomLocation,
  setRoomLocation,

  totalRooms,
  setTotalRooms,

  privateBathroom,
  setPrivateBathroom,

  floor,
  setFloor,

  condition,
  setCondition,

  walls,
  setWalls,

  heating,
  setHeating,

  documents,
  setDocuments,

  furniture,
  setFurniture,

  comfort,
  setComfort,

  offerType,
  setOfferType,

  rentPeriod,
  setRentPeriod,

  houseType,
  setHouseType,

  sewage,
  setSewage,

  water,
  setWater,

  electricity,
  setElectricity,

  landLocation,
  setLandLocation,

  relief,
  setRelief,

  communications,
  setCommunications,
}) {
  /*
=========================
УЧАСТКИ
=========================
*/

  if (category === "Участки") {
    return (
      <div className={styles.wrapper}>
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
          options={[
            "Любой",
            "Наличный расчет",
            "Ипотека",
            "Рассрочка",
            "Обмен",
          ]}
        />

        <CustomSelect
          icon={MapPin}
          title="Расположение"
          value={landLocation}
          setValue={setLandLocation}
          options={[
            "Любое",
            "В городе",
            "Пригород",
            "У трассы",
            "У водоема",
            "В горах",
          ]}
        />

        <CustomSelect
          icon={Mountain}
          title="Рельеф"
          value={relief}
          setValue={setRelief}
          options={["Любой", "Ровный", "С уклоном", "Холмистый", "Склон"]}
        />

        <CustomSelect
          icon={Zap}
          title="Коммуникации"
          value={communications}
          setValue={setCommunications}
          options={[
            "Любые",
            "Электричество",
            "Вода",
            "Газ",
            "Канализация",
            "Интернет",
          ]}
        />

        {deal === "rent" && (
          <CustomSelect
            icon={CalendarDays}
            title="Период аренды"
            value={rentPeriod}
            setValue={setRentPeriod}
            options={[
              "Любой",
              "По часам",
              "Посуточно",
              "Понедельно",
              "На сезон",
              "Помесячно",
              "Долгосрочно",
            ]}
          />
        )}
      </div>
    );
  }

  /*
=========================
ДОМА
=========================
*/

  if (category === "Дома") {
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
          value={floor}
          setValue={setFloor}
          options={["Любая", "1 этаж", "2 этажа", "3 этажа", "4+ этажа"]}
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
          icon={BadgeCheck}
          title="Тип предложения"
          value={offerType}
          setValue={setOfferType}
          options={[
            "Любой",
            "Наличный расчет",
            "Ипотека",
            "Рассрочка",
            "Обмен",
          ]}
        />

        {deal === "rent" && (
          <CustomSelect
            icon={CalendarDays}
            title="Период аренды"
            value={rentPeriod}
            setValue={setRentPeriod}
            options={[
              "Любой",
              "По часам",
              "Посуточно",
              "Понедельно",
              "На сезон",
              "Помесячно",
              "Долгосрочно",
            ]}
          />
        )}
      </div>
    );
  }

  /*
=========================
КОМНАТЫ
=========================
*/

  if (category === "Комнаты") {
    return (
      <div className={styles.wrapper}>
        <CustomSelect
          icon={MapPin}
          title="Расположение"
          value={roomLocation}
          setValue={setRoomLocation}
          options={["Любое", "Центр", "Микрорайон", "Пригород"]}
        />

        <CustomSelect
          icon={Home}
          title="Комнат в квартире"
          value={totalRooms}
          setValue={setTotalRooms}
          options={[
            "Любое",
            "1-комнатная",
            "2-комнатная",
            "3-комнатная",
            "4+ комнат",
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
          title="Состояние"
          value={condition}
          setValue={setCondition}
          options={["Любое", "Евроремонт", "Косметический", "Без ремонта"]}
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
            "Центральное",
            "Автономное",
            "Газовое",
            "Электрическое",
          ]}
        />

        <CustomSelect
          icon={ShieldCheck}
          title="Удобства комнаты"
          value={comfort}
          setValue={setComfort}
          options={[
            "Любые",
            "Интернет",
            "Балкон",
            "Кондиционер",
            "Холодильник",
            "Стиральная машина",
          ]}
        />

        <CustomSelect
          icon={Home}
          title="Свой санузел"
          value={privateBathroom}
          setValue={setPrivateBathroom}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={FileCheck}
          title="Документы"
          value={documents}
          setValue={setDocuments}
          options={["Любые", "Красная книга", "Тех паспорт", "Договор"]}
        />

        <CustomSelect
          icon={BadgeCheck}
          title="Тип предложения"
          value={offerType}
          setValue={setOfferType}
          options={[
            "Любой",
            "Наличный расчет",
            "Ипотека",
            "Рассрочка",
            "Обмен",
          ]}
        />

        {deal === "rent" && (
          <CustomSelect
            icon={CalendarDays}
            title="Период аренды"
            value={rentPeriod}
            setValue={setRentPeriod}
            options={[
              "Любой",
              "По часам",
              "Посуточно",
              "Помесячно",
              "Долгосрочно",
            ]}
          />
        )}
      </div>
    );
  }
  /*
=========================
КВАРТИРЫ
=========================
*/

  return (
    <div className={styles.wrapper}>
      <CustomSelect
        icon={Layers}
        title="Этаж"
        value={floor}
        setValue={setFloor}
        options={["Любой", "1 этаж", "2-5 этаж", "6-10 этаж", "11+ этаж"]}
      />

      <CustomSelect
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
        icon={ShieldCheck}
        title="Удобства"
        value={comfort}
        setValue={setComfort}
        options={[
          "Любые",
          "Балкон",
          "Лифт",
          "Охрана",
          "Парковка",
          "Кондиционер",
        ]}
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
          options={[
            "Любой",
            "По часам",
            "Посуточно",
            "Помесячно",
            "Долгосрочно",
          ]}
        />
      )}
    </div>
  );
}
