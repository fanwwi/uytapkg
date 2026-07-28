"use client";

import {
  MapPin,
  DollarSign,
  BedDouble,
  Maximize,
  Waves,
  Building2,
  Crown,
  Bath,
  Wifi,
  PawPrint,
} from "lucide-react";

import { useState } from "react";

import CustomSelect from "../../../../components/ui/customSelect/CustomSelect";

import styles from "../shared/SharedFilters.module.css";

export default function HouseFilters() {
  const [location, setLocation] = useState("Любой");

  const [classType, setClassType] = useState("Любой");

  const [pool, setPool] = useState("Любой");

  const [sauna, setSauna] = useState("Любой");

  const [wifi, setWifi] = useState("Любой");

  const [pets, setPets] = useState("Любой");

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
        <div className={styles.inputBox}>
          <BedDouble />

          <input placeholder="Количество комнат" type="number" />
        </div>

        <div className={styles.inputBox}>
          <Maximize />

          <input placeholder="Площадь от м²" type="number" />
        </div>

        <div className={styles.inputBox}>
          <Maximize />

          <input placeholder="Площадь до м²" type="number" />
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
          title="Класс жилья"
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
          icon={Bath}
          title="Баня / сауна"
          value={sauna}
          setValue={setSauna}
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
          icon={PawPrint}
          title="Животные"
          value={pets}
          setValue={setPets}
          options={["Любой", "Да", "Нет"]}
        />
      </div>
    </>
  );
}
