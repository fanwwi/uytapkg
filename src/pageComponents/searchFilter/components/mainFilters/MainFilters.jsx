"use client";

import {
  MapPin,
  DollarSign,
  Maximize,
  Building2,
  BedDouble,
  Ruler,
  Fence,
  ShieldCheck,
} from "lucide-react";

import CustomSelect from "../../../../components/ui/customSelect/CustomSelect";

import styles from "./MainFilters.module.css";

export default function MainFilters({
  category,

  commercialType,
  setCommercialType,

  parkingType,
  setParkingType,

  security,
  setSecurity,

  location,
  setLocation,

  type,
  setType,

  rooms,
  setRooms,

  priceFrom,
  setPriceFrom,

  priceTo,
  setPriceTo,

  areaFrom,
  setAreaFrom,

  areaTo,
  setAreaTo,

  landFrom,
  setLandFrom,

  landTo,
  setLandTo,

  purpose,
  setPurpose,

  fence,
  setFence,
}) {
  return (
    <div className={styles.wrapper}>
      {/* Локация */}

      <CustomSelect
        icon={MapPin}
        title="Локация"
        value={location}
        setValue={setLocation}
        options={[
          "Любая",
          "Бишкек",
          "Чуйская область",
          "Ошская область",
          "Иссык-Кульская область",
          "Нарынская область",
          "Таласская область",
          "Баткенская область",
        ]}
      />

      {/* Цена */}

      <div className={styles.inputBox}>
        <div className={styles.icon}>
          <DollarSign />
        </div>

        <input
          placeholder="От $"
          value={priceFrom}
          onChange={(e) => setPriceFrom(e.target.value.replace(/\D/g, ""))}
        />

        <span>-</span>

        <input
          placeholder="До $"
          value={priceTo}
          onChange={(e) => setPriceTo(e.target.value.replace(/\D/g, ""))}
        />
      </div>

      {category === "Комнаты" && (
        <>
          <div className={styles.inputBox}>
            <div className={styles.icon}>
              <Maximize />
            </div>

            <input
              placeholder="От м²"
              value={areaFrom}
              onChange={(e) => setAreaFrom(e.target.value.replace(/\D/g, ""))}
            />

            <span>-</span>

            <input
              placeholder="До м²"
              value={areaTo}
              onChange={(e) => setAreaTo(e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </>
      )}

      {category === "Паркинг / Гараж" && (
        <>
          <CustomSelect
            icon={Building2}
            title="Тип"
            value={parkingType}
            setValue={setParkingType}
            options={[
              "Любой",
              "Гараж",
              "Паркинг",
              "Подземный паркинг",
              "Наземный паркинг",
            ]}
          />

          <CustomSelect
            icon={ShieldCheck}
            title="Охрана"
            value={security}
            setValue={setSecurity}
            options={["Любая", "Есть", "Нет", "Круглосуточная"]}
          />
        </>
      )}

      {/* =====================
          КВАРТИРЫ
      ====================== */}

      {category === "Квартиры" && (
        <>
          <div className={styles.inputBox}>
            <div className={styles.icon}>
              <Maximize />
            </div>

            <input
              placeholder="От м²"
              value={areaFrom}
              onChange={(e) => setAreaFrom(e.target.value.replace(/\D/g, ""))}
            />

            <span>-</span>

            <input
              placeholder="До м²"
              value={areaTo}
              onChange={(e) => setAreaTo(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <CustomSelect
            icon={Building2}
            title="Серия / тип"
            value={type}
            setValue={setType}
            options={[
              "Любой",
              "Новостройка",
              "102 серия",
              "104 серия",
              "104 улучшенный",
              "105 серия",
              "106 серия",
              "107 серия",
              "108 серия",
              "Сталинка",
              "Хрущевка",
              "Индивидуальная",
              "Элитка",
              "Пентхаус",
            ]}
          />

          <CustomSelect
            icon={BedDouble}
            title="Комнаты"
            value={rooms}
            setValue={setRooms}
            options={[
              "Любой",
              "1 комната",
              "2 комнаты",
              "3 комнаты",
              "4+ комнаты",
            ]}
          />
        </>
      )}

      {/* =====================
          ДОМА
      ====================== */}

      {category === "Дома" && (
        <div className={styles.inputBox}>
          <div className={styles.icon}>
            <Maximize />
          </div>

          <input
            placeholder="От м²"
            value={areaFrom}
            onChange={(e) => setAreaFrom(e.target.value.replace(/\D/g, ""))}
          />

          <span>-</span>

          <input
            placeholder="До м²"
            value={areaTo}
            onChange={(e) => setAreaTo(e.target.value.replace(/\D/g, ""))}
          />
        </div>
      )}

      {category === "Коммерция" && (
        <>
          <div className={styles.inputBox}>
            <div className={styles.icon}>
              <Maximize />
            </div>

            <input
              placeholder="От м²"
              value={areaFrom}
              onChange={(e) => setAreaFrom(e.target.value.replace(/\D/g, ""))}
            />

            <span>-</span>

            <input
              placeholder="До м²"
              value={areaTo}
              onChange={(e) => setAreaTo(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <CustomSelect
            icon={Building2}
            title="Тип помещения"
            value={commercialType}
            setValue={setCommercialType}
            options={[
              "Любой",
              "Офис",
              "Магазин",
              "Склад",
              "Производство",
              "Кафе/ресторан",
              "Салон красоты",
              "Аптека",
              "Свободное назначение",
            ]}
          />
        </>
      )}

      {/* =====================
          УЧАСТКИ
      ====================== */}

      {category === "Участки" && (
        <>
          <div className={styles.inputBox}>
            <div className={styles.icon}>
              <Ruler />
            </div>

            <input
              placeholder="От соток"
              value={landFrom}
              onChange={(e) => setLandFrom(e.target.value.replace(/\D/g, ""))}
            />

            <span>-</span>

            <input
              placeholder="До соток"
              value={landTo}
              onChange={(e) => setLandTo(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <CustomSelect
            icon={Ruler}
            title="Назначение"
            value={purpose}
            setValue={setPurpose}
            options={["ИЖС", "Сельхоз", "Коммерция", "Дача", "Производство"]}
          />

          <CustomSelect
            icon={Fence}
            title="Забор"
            value={fence}
            setValue={setFence}
            options={["Есть", "Нет", "Частично"]}
          />
        </>
      )}
    </div>
  );
}
