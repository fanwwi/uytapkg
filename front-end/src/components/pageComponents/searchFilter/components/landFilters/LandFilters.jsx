"use client";

import {
  Map,
  Mountain,
  Droplets,
  Zap,
  FileCheck,
  BadgeCheck,
} from "lucide-react";

import CustomSelect from "../../../../../components/ui/customSelect/CustomSelect";

import styles from "./LandFilters.module.css";

export default function LandFilters({
  locationType,
  setLocationType,

  relief,
  setRelief,

  communications,
  setCommunications,

  documents,
  setDocuments,

  offerType,
  setOfferType,
}) {
  return (
    <div className={styles.wrapper}>
      <CustomSelect
        icon={Map}
        title="Расположение"
        value={locationType}
        setValue={setLocationType}
        options={[
          "У города",
          "В черте города",
          "Пригород",
          "У трассы",
          "Экологическая зона",
          "С видом на горы",
        ]}
      />

      <CustomSelect
        icon={Mountain}
        title="Рельеф"
        value={relief}
        setValue={setRelief}
        options={[
          "Ровный участок",
          "С уклоном",
          "Гористый",
          "Низина",
          "Возле воды",
        ]}
      />

      <CustomSelect
        icon={Droplets}
        title="Коммуникации"
        value={communications}
        setValue={setCommunications}
        options={[
          "Все коммуникации",
          "Вода",
          "Газ",
          "Электричество",
          "Канализация",
          "Нет коммуникаций",
        ]}
      />

      <CustomSelect
        icon={FileCheck}
        title="Документы"
        value={documents}
        setValue={setDocuments}
        options={[
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
        options={["Наличный расчет", "Ипотека", "Рассрочка", "Обмен"]}
      />
    </div>
  );
}
