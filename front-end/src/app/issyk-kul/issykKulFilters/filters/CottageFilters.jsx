"use client";

import {
  MapPin,
  DollarSign,
  Layers,
  Home,
  BedDouble,
  Maximize,
  Waves,
  Building2,
  Crown,
  Flame,
  Wifi,
  Trees,
} from "lucide-react";

import { useState } from "react";

import styles from "../shared/SharedFilters.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

export default function CottageFilters() {
  const [location, setLocation] = useState("Любой");

  const [floors, setFloors] = useState("Любой");

  const [type, setType] = useState("Любой");

  const [classType, setClassType] = useState("Любой");

  const [pool, setPool] = useState("Любой");

  const [bath, setBath] = useState("Любой");

  const [grill, setGrill] = useState("Любой");

  const [wifi, setWifi] = useState("Любой");

  const [gazebo, setGazebo] = useState("Любой");

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

          <input placeholder="Цена от $" type="number" />
        </div>

        <div className={styles.inputBox}>
          <DollarSign />

          <input placeholder="Цена до $" type="number" />
        </div>
      </div>

      <div className={styles.grid}>
        <CustomSelect
          icon={Layers}
          title="Этажность"
          value={floors}
          setValue={setFloors}
          options={["Любая", "1 этаж", "2 этажа", "3 этажа"]}
        />

        <CustomSelect
          icon={Home}
          title="Тип коттеджа"
          value={type}
          setValue={setType}
          options={[
            "Любой",
            "Современный",
            "Семейный",
            "VIP",
            "У озера",
            "Таунхаус",
          ]}
        />

        <div className={styles.inputBox}>
          <BedDouble />

          <input placeholder="Количество комнат" type="number" />
        </div>

        <div className={styles.inputBox}>
          <Maximize />

          <input placeholder="Площадь м²" type="number" />
        </div>

        <div className={styles.inputBox}>
          <Waves />

          <input placeholder="До пляжа (м)" type="number" />
        </div>

        <div className={styles.inputBox}>
          <Building2 />

          <input placeholder="ЖК / Застройщик" />
        </div>

        <CustomSelect
          icon={Crown}
          title="Класс"
          value={classType}
          setValue={setClassType}
          options={["Любой", "Эконом", "Комфорт", "Бизнес", "Премиум"]}
        />

        <CustomSelect
          icon={Waves}
          title="Бассейн"
          value={pool}
          setValue={setPool}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Flame}
          title="Баня"
          value={bath}
          setValue={setBath}
          options={["Любая", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Trees}
          title="Мангал"
          value={grill}
          setValue={setGrill}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Wifi}
          title="Wi-Fi"
          value={wifi}
          setValue={setWifi}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Trees}
          title="Беседка"
          value={gazebo}
          setValue={setGazebo}
          options={["Любая", "Да", "Нет"]}
        />
      </div>
    </>
  );
}
