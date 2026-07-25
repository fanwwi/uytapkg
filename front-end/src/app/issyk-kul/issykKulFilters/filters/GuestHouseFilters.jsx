"use client";

import { useState } from "react";

import {
  MapPin,
  DollarSign,
  Hotel,
  BedDouble,
  Layers,
  Crown,
  Waves,
  Bath,
  Flame,
  Wifi,
  Trees,
  Car,
  Utensils,
  Snowflake,
} from "lucide-react";

import CustomSelect from "../../../../components/ui/customSelect/CustomSelect";

import styles from "../shared/SharedFilters.module.css";

export default function GuestHouseFilters() {
  const [location, setLocation] = useState("Любой");

  const [type, setType] = useState("Любой");

  const [floors, setFloors] = useState("Любой");

  const [classType, setClassType] = useState("Любой");

  const [pool, setPool] = useState("Любой");
  const [sauna, setSauna] = useState("Любой");
  const [wifi, setWifi] = useState("Любой");
  const [grill, setGrill] = useState("Любой");
  const [gazebo, setGazebo] = useState("Любой");
  const [parking, setParking] = useState("Любой");
  const [kitchen, setKitchen] = useState("Любой");
  const [conditioner, setConditioner] = useState("Любой");

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
          icon={Hotel}
          title="Тип объекта"
          value={type}
          setValue={setType}
          options={[
            "Любой",
            "Гостевой дом",
            "Мини-отель",
            "Бутик-отель",
            "Семейный гостевой дом",
            "Хостел",
          ]}
        />

        <div className={styles.inputBox}>
          <BedDouble />

          <input placeholder="Количество комнат" type="number" />
        </div>

        <CustomSelect
          icon={Layers}
          title="Количество этажей"
          value={floors}
          setValue={setFloors}
          options={[
            "Любой",
            "1 этаж",
            "2 этажа",
            "3 этажа",
            "4 этажа",
            "5 этажей",
          ]}
        />

        <CustomSelect
          icon={Crown}
          title="Класс"
          value={classType}
          setValue={setClassType}
          options={["Любой", "Эконом", "Комфорт", "Бизнес", "Премиум", "Люкс"]}
        />

        <CustomSelect
          icon={Waves}
          title="Бассейн"
          value={pool}
          setValue={setPool}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Bath}
          title="Баня / сауна"
          value={sauna}
          setValue={setSauna}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Flame}
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
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Car}
          title="Парковка"
          value={parking}
          setValue={setParking}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Utensils}
          title="Кухня"
          value={kitchen}
          setValue={setKitchen}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Snowflake}
          title="Кондиционер"
          value={conditioner}
          setValue={setConditioner}
          options={["Любой", "Да", "Нет"]}
        />
      </div>
    </>
  );
}
