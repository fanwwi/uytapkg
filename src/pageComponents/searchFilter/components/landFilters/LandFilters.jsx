"use client";

import {
  Trees,
  Ruler,
  FileCheck,
  Droplets,
  Zap,
  Flame,
  Route,
  Mountain,
  BadgeCheck,
  CalendarDays,
} from "lucide-react";

import CustomSelect from "../../../../components/ui/customSelect/CustomSelect";

import styles from "./LandFilters.module.css";

export default function LandFilters({
  deal,

  purpose,
  setPurpose,

  landFrom,
  setLandFrom,

  landTo,
  setLandTo,

  documents,
  setDocuments,

  water,
  setWater,

  electricity,
  setElectricity,

  sewage,
  setSewage,

  gas,
  setGas,

  road,
  setRoad,

  relief,
  setRelief,

  offerType,
  setOfferType,

  rentPeriod,
  setRentPeriod,
}) {
  return (
    <div className={styles.wrapper}>
      {/* назначение */}

      <CustomSelect
        icon={Trees}
        title="Назначение участка"
        value={purpose}
        setValue={setPurpose}
        options={[
          "Любое",

          "ИЖС",

          "Сельхозназначение",

          "Коммерция",

          "Под строительство",

          "Дачное строительство",
        ]}
      />

      {/* площадь */}

      <div className={styles.area}>
        <div className={styles.icon}>
          <Ruler />
        </div>

        <input
          placeholder="От м²"
          value={landFrom}
          onChange={(e) => setLandFrom(e.target.value.replace(/\D/g, ""))}
        />

        <span>-</span>

        <input
          placeholder="До м²"
          value={landTo}
          onChange={(e) => setLandTo(e.target.value.replace(/\D/g, ""))}
        />
      </div>

      <CustomSelect
        icon={Droplets}
        title="Вода"
        value={water}
        setValue={setWater}
        options={[
          "Любая",

          "Центральная",

          "Скважина",

          "Возможно подведение",

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
        icon={Droplets}
        title="Канализация"
        value={sewage}
        setValue={setSewage}
        options={[
          "Любая",

          "Центральная",

          "Септик",

          "Возможно подведение",

          "Нет",
        ]}
      />

      <CustomSelect
        icon={Flame}
        title="Газ"
        value={gas}
        setValue={setGas}
        options={["Любой", "Есть", "Возможно подведение", "Нет"]}
      />

      <CustomSelect
        icon={Route}
        title="Подъезд"
        value={road}
        setValue={setRoad}
        options={[
          "Любой",

          "Асфальт",

          "Грунтовая дорога",

          "Щебень",

          "Нет дороги",
        ]}
      />

      <CustomSelect
        icon={Mountain}
        title="Рельеф"
        value={relief}
        setValue={setRelief}
        options={["Любой", "Ровный", "Наклонный", "Холмистый"]}
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

          "Нет документов",
        ]}
      />

      <CustomSelect
        icon={BadgeCheck}
        title="Тип предложения"
        value={offerType}
        setValue={setOfferType}
        options={["Любой", "Наличный расчет", "Рассрочка", "Ипотека", "Обмен"]}
      />

      {deal === "rent" && (
        <CustomSelect
          icon={CalendarDays}
          title="Период аренды"
          value={rentPeriod}
          setValue={setRentPeriod}
          options={["Любой", "Помесячно", "Долгосрочно"]}
        />
      )}
    </div>
  );
}
