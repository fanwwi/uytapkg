"use client";

import { useState } from "react";

import {
  MapPin,
  DollarSign,
  Building2,
  Waves,
  CheckCircle,
  Wifi,
  Car,
  Crown,
  Zap,
  Droplets,
} from "lucide-react";

import CustomSelect from "../../../../components/ui/customSelect/CustomSelect";

import styles from "../shared/SharedFilters.module.css";

export default function CommercialFilters() {
  const [location, setLocation] = useState("Любой");

  const [type, setType] = useState("Любой");

  const [ready, setReady] = useState("Любая");

  const [communication, setCommunication] = useState("Любые");

  const [parking, setParking] = useState("Любая");

  const [classType, setClassType] = useState("Любой");

  const [electricity, setElectricity] = useState("Любое");
  const [water, setWater] = useState("Любая");
  const [sewerage, setSewerage] = useState("Любая");
  const [internet, setInternet] = useState("Любой");

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
          icon={Building2}
          title="Тип коммерции"
          value={type}
          setValue={setType}
          options={[
            "Любой",
            "Отель",
            "Гостиница",
            "Ресторан / кафе",
            "Магазин",
            "Офис",
            "Торговое помещение",
            "База отдыха",
            "Склад",
            "Производство",
            "Земля под бизнес",
            "Другое",
          ]}
        />

        <div className={styles.inputBox}>
          <Waves />

          <input placeholder="До пляжа (м)" type="number" />
        </div>

        <CustomSelect
          icon={CheckCircle}
          title="Готовность бизнеса"
          value={ready}
          setValue={setReady}
          options={[
            "Любая",
            "Готовый бизнес",
            "Работает сейчас",
            "Без ремонта",
            "После ремонта",
            "Новый объект",
            "Строится",
          ]}
        />

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
          icon={Waves}
          title="Канализация"
          value={sewerage}
          setValue={setSewerage}
          options={["Любая", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Wifi}
          title="Интернет"
          value={internet}
          setValue={setInternet}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Car}
          title="Парковка"
          value={parking}
          setValue={setParking}
          options={["Любая", "Да", "Нет"]}
        />

        <CustomSelect
          icon={Crown}
          title="Класс объекта"
          value={classType}
          setValue={setClassType}
          options={["Любой", "Эконом", "Комфорт", "Бизнес", "Премиум"]}
        />
      </div>
    </>
  );
}
