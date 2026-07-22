"use client";

import { useState } from "react";

import {
  Search,
  Map,
  RotateCcw,
  SlidersHorizontal,
  MapPin,
  Building2,
  BedDouble,
  DollarSign,
} from "lucide-react";

import CustomSelect from "../../components/ui/customSelect/CustomSelect";

import styles from "./SearchFilter.module.css";

export default function SearchFilter() {
  const [mode, setMode] = useState("normal");

  const [deal, setDeal] = useState("buy");

  const [category, setCategory] = useState("Квартиры");

  // основные фильтры

  const [location, setLocation] = useState("");

  const [type, setType] = useState("");

  const [rooms, setRooms] = useState("");

  const [priceFrom, setPriceFrom] = useState("");

  const [priceTo, setPriceTo] = useState("");

  // дополнительные фильтры

  const [floor, setFloor] = useState("");

  const [condition, setCondition] = useState("");

  const [walls, setWalls] = useState("");

  const [heating, setHeating] = useState("");

  const [documents, setDocuments] = useState("");

  const [furniture, setFurniture] = useState("");

  const [advanced, setAdvanced] = useState(false);

  const categories = [
    "Квартиры",

    "Дома",

    "Участки",

    "Комнаты",

    "Коммерция",

    "Паркинг / Гараж",
  ];

  const resetFilters = () => {
    setLocation("");

    setType("");

    setRooms("");

    setPriceFrom("");

    setPriceTo("");

    setFloor("");

    setCondition("");

    setWalls("");

    setHeating("");

    setDocuments("");

    setFurniture("");
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        {/* режим поиска */}

        <div className={styles.switch}>
          <button
            className={mode === "normal" ? styles.active : ""}
            onClick={() => setMode("normal")}
          >
            Обычный поиск
          </button>

          <button
            className={mode === "smart" ? styles.active : ""}
            onClick={() => setMode("smart")}
          >
            ✨ Умный поиск
          </button>
        </div>

        {/* купить / снять */}

        <div className={styles.tabs}>
          {[
            ["buy", "Купить"],
            ["rent", "Снять"],
            ["daily", "Посуточно"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={deal === key ? styles.selected : ""}
              onClick={() => setDeal(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* категории */}

        <div className={styles.categories}>
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? styles.categoryActive : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className={styles.mainFilters}>
          <CustomSelect
            icon={MapPin}
            title="Локация"
            value={location}
            setValue={setLocation}
            options={[
              "Бишкек",

              "Чуйская область",

              "Ошская область",

              "Джалал-Абадская область",

              "Nарынская область",

              "Таласская область",

              "Иссык-Кульская область",

              "Баткенская область",
            ]}
          />

          <div className={styles.priceBox}>
            <DollarSign className={styles.priceIcon} />

            <input
              placeholder="От"
              value={priceFrom}
              inputMode="numeric"
              onChange={(e) => setPriceFrom(e.target.value.replace(/\D/g, ""))}
            />

            <span>-</span>

            <input
              placeholder="До"
              value={priceTo}
              inputMode="numeric"
              onChange={(e) => setPriceTo(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <CustomSelect
            icon={Building2}
            title="Серия / тип"
            value={type}
            setValue={setType}
            options={[
              "Новостройка",

              "102 тип",

              "104 тип",

              "104 тип улучшенная",

              "105 тип",

              "105 тип улучшенная",

              "106 тип",

              "106 тип улучшенная",

              "107 тип",

              "108 тип",

              "Сталинка",

              "Хрущевка",

              "Индивидуальная планировка",

              "Элитка",

              "Малосемейка",

              "Пентхаус",
            ]}
          />

          <CustomSelect
            icon={BedDouble}
            title="Комнаты"
            value={rooms}
            setValue={setRooms}
            options={["1 комната", "2 комнаты", "3 комнаты", "4+ комнаты"]}
          />
        </div>

        <button className={styles.more} onClick={() => setAdvanced(!advanced)}>
          <SlidersHorizontal />
          Все фильтры
        </button>

        {advanced && (
          <div className={styles.extra}>
            <CustomSelect
              title="Этаж"
              value={floor}
              setValue={setFloor}
              options={["1 этаж", "2-5 этаж", "6-10 этаж", "11-20+ этаж"]}
            />

            <CustomSelect
              title="Состояние"
              value={condition}
              setValue={setCondition}
              options={[
                "Дизайнерский ремонт",

                "Евроремонт",

                "Косметический",

                "Под самоотделку",

                "Старый фонд",

                "Недостроенный",
              ]}
            />

            <CustomSelect
              title="Стены"
              value={walls}
              setValue={setWalls}
              options={[
                "Газоблок",

                "Кирпич",

                "Бетон",

                "Газобетон",

                "Монолит",

                "Монолитно-каркасная",

                "Монолитно-кирпичная",

                "Панельная",

                "Пеноблок",

                "Саман",

                "Другая",
              ]}
            />

            <CustomSelect
              title="Отопление"
              value={heating}
              setValue={setHeating}
              options={[
                "Автономное",

                "Газовое",

                "Комбинированное",

                "Центральное",

                "Электрическое",
              ]}
            />

            <CustomSelect
              title="Документы"
              value={documents}
              setValue={setDocuments}
              options={[
                "Красная книга",

                "Тех паспорт",

                "Договор купли-продажи",

                "Долевое участие",

                "Акт приема-передачи",
              ]}
            />

            <CustomSelect
              title="Мебель"
              value={furniture}
              setValue={setFurniture}
              options={["Полная", "Частичная", "Без мебели"]}
            />
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.searchBtn}>
            <Search />
            Найти
          </button>

          <button className={styles.mapBtn}>
            <Map />
            На карте
          </button>

          <button className={styles.resetBtn} onClick={resetFilters}>
            <RotateCcw />
            Сбросить
          </button>
        </div>
      </div>
    </section>
  );
}
