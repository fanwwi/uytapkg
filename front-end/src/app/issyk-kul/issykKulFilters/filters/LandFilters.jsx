"use client";

import { useState } from "react";

import {
  MapPin,
  DollarSign,
  Ruler,
  Waves,
  Zap,
  Droplets,
  Flame,
  Wifi,
  CircleOff,
} from "lucide-react";

import CustomSelect from "../../../../components/ui/customSelect/CustomSelect";

import styles from "../shared/SharedFilters.module.css";

export default function LandFilters() {
  const [location, setLocation] = useState("Любой");

  const [purpose, setPurpose] = useState("Любое");

  const [electricity, setElectricity] = useState("Любое");
  const [water, setWater] = useState("Любая");
  const [gas, setGas] = useState("Любой");
  const [wifi, setWifi] = useState("Любой");

  return (
    <>
      <div className={styles.grid}>
        <CustomSelect
          icon={MapPin}
          title="Район Иссык-Куля"
          value={location}
          setValue={setLocation}
          options={[
            "Любой",
            "Чолпон-Ата",
            "Бостери",
            "Кара-Ой",
            "Булан-Соготту",
            "Тамчы",
            "Чон-Сары-Ой",
            "Сары-Ой",
            "Кызыл-Суу",
          ]}
        />

        <div className={styles.inputBox}>
          <DollarSign />

          <input type="number" placeholder="Цена от $" />
        </div>

        <div className={styles.inputBox}>
          <DollarSign />

          <input type="number" placeholder="Цена до $" />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.inputBox}>
          <Ruler />

          <input type="number" placeholder="Площадь от (соток)" />
        </div>

        <div className={styles.inputBox}>
          <Ruler />

          <input type="number" placeholder="Площадь до (соток)" />
        </div>

        <CustomSelect
          icon={CircleOff}
          title="Назначение участка"
          value={purpose}
          setValue={setPurpose}
          options={[
            "Любое",
            "ИЖС",
            "Коммерция",
            "Сельхоз",
            "Инвестиционный",
            "Под гостевой дом",
            "Под гостиницу",
          ]}
        />

        <div className={styles.inputBox}>
          <Waves />

          <input type="number" placeholder="До пляжа (м)" />
        </div>

        <CustomSelect
          icon={Zap}
          title="Электричество"
          value={electricity}
          setValue={setElectricity}
          options={["Любое", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Droplets}
          title="Вода"
          value={water}
          setValue={setWater}
          options={["Любая", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Flame}
          title="Газ"
          value={gas}
          setValue={setGas}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Wifi}
          title="Интернет"
          value={wifi}
          setValue={setWifi}
          options={["Любой", "Да", "Нет"]}
        />
      </div>
    </>
  );
}
