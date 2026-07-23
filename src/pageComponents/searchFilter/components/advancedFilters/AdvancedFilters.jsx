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
} from "lucide-react";

import CustomSelect from "../../../../components/ui/customSelect/CustomSelect";

import styles from "./AdvancedFilters.module.css";

export default function AdvancedFilters({
  category,
  deal,

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

  landFrom,
  setLandFrom,

  landTo,
  setLandTo,
}) {
  // =========================
  // ДОМА
  // =========================

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

        <div className={styles.area}>
          <div className={styles.icon}>
            <Ruler />
          </div>

          <input
            placeholder="Участок от соток"
            value={landFrom}
            onChange={(e) => setLandFrom(e.target.value.replace(/\D/g, ""))}
          />

          <span>-</span>

          <input
            placeholder="Участок до соток"
            value={landTo}
            onChange={(e) => setLandTo(e.target.value.replace(/\D/g, ""))}
          />
        </div>

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
            options={["Любой", "Посуточно", "Помесячно", "Долгосрочно"]}
          />
        )}
      </div>
    );
  }

  // =========================
  // КВАРТИРЫ
  // =========================

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
          "Под самоотделку",
          "Старый ремонт",
          "Без ремонта",
        ]}
      />

      <CustomSelect
        title="Стены"
        value={walls}
        setValue={setWalls}
        options={[
          "Любые",
          "Кирпич",
          "Панельные",
          "Монолитные",
          "Газоблок",
          "Бетон",
          "Газобетон",
          "Монолитно-каркасные",
          "Монолитно-кирпичные",
          "Пеноблок",
          "Саман",
          "Другие",
        ]}
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
          "Комбинированное",
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
          "Договор долевого участия",
          "Акт приема передачи",
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
          "Балкон/Лоджия",
          "Нет балкона/лоджии",
          "Бронированные двери",
          "Бытовая техника",
          "Видеонаблюдение",
          "Вид на горы",
          "Животные не проживали",
          "Закрытая территория",
          "Не затапливалась",
          "Не сдавалась квартирантам",
          "Угловая",
          "Не уголовая",
          "Раздельный санузел",
          "Совместный санузел",
          "С мебелью",
          "Без мебели",
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
            "По недельно",
            "На сезон",
            "Помесячно",
            "Долгосрочно",
          ]}
        />
      )}
    </div>
  );
}
