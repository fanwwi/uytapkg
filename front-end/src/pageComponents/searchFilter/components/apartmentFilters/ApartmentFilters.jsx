"use client";

import { BadgeCheck, CalendarDays } from "lucide-react";

import CustomSelect from "../../../ui/customSelect/CustomSelect";

import styles from "./ApartmentFilters.module.css";

export default function ApartmentFilters({
  deal,
  offerType,
  setOfferType,
  rentPeriod,
  setRentPeriod,
}) {
  return (
    <div className={styles.wrapper}>
      <CustomSelect
        icon={BadgeCheck}
        title="Тип предложения"
        value={offerType}
        setValue={setOfferType}
        options={[
          "Любой",
          "Наличный расчет",
          "Рассрочка",
          "Ипотека",
          "Обмен",
          "Срочное предложение",
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
            "Помесячно",
            "Долгосрочно",
          ]}
        />
      )}
    </div>
  );
}
