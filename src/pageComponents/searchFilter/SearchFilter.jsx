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
  Sofa,
  ShieldCheck,
  CalendarDays,
  BadgeCheck,
  Home,
  DoorOpen,
  Store,
  Car,
  LandPlot,
} from "lucide-react";

import CustomSelect from "../../components/ui/customSelect/CustomSelect";

import styles from "./SearchFilter.module.css";

export default function SearchFilter() {
  const [mode, setMode] = useState("normal");

  const [deal, setDeal] = useState("buy");

  const [category, setCategory] = useState("Квартиры");

  const [advanced, setAdvanced] = useState(false);

  const [location, setLocation] = useState("Любая");

  const [type, setType] = useState("Любая");

  const [rooms, setRooms] = useState("Количество");

  const [priceFrom, setPriceFrom] = useState("");

  const [priceTo, setPriceTo] = useState("");

  const [floor, setFloor] = useState("Любой");

  const [condition, setCondition] = useState("Любое");

  const [walls, setWalls] = useState("Любые");

  const [heating, setHeating] = useState("Любое");

  const [documents, setDocuments] = useState("Любые");

  const [furniture, setFurniture] = useState("Любая");

  // аренда

  const [comfort, setComfort] = useState("Любые");

  const [rentPeriod, setRentPeriod] = useState("Любой");

  const [offerType, setOfferType] = useState("Любой");

  const categories = [
    {
      name: "Квартиры",
      icon: Building2,
    },

    {
      name: "Дома",
      icon: Home,
    },

    {
      name: "Участки",
      icon: LandPlot,
    },

    {
      name: "Комнаты",
      icon: DoorOpen,
    },

    {
      name: "Коммерция",
      icon: Store,
    },

    {
      name: "Паркинг / Гараж",
      icon: Car,
    },
  ];

  const resetFilters = () => {
    setLocation("Любая");
    setType("Любая");
    setRooms("Количество");

    setPriceFrom("");
    setPriceTo("");

    setFloor("Любой");
    setCondition("Любое");
    setWalls("Любые");
    setHeating("Любое");
    setDocuments("Любые");
    setFurniture("Любая");

    setComfort("Любые");
    setRentPeriod("Любой");
    setOfferType("Любой");
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        {/* режим */}

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

        {/* купить снять */}

        <div className={styles.tabs}>
          {[
            ["buy", "Купить"],
            ["rent", "Снять"],
            ["daily", "Посуточно"],
          ].map(([key, text]) => (
            <button
              key={key}
              className={deal === key ? styles.selected : ""}
              onClick={() => setDeal(key)}
            >
              {text}
            </button>
          ))}
        </div>

        {/* категории */}

        <div className={styles.categories}>
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={category === item.name ? styles.categoryActive : ""}
                onClick={() => setCategory(item.name)}
              >
                <Icon className={styles.categoryIcon} />

                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* основные */}

        <div className={styles.mainFilters}>
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

              "Джалал-Абадская область",

              "Нарынская область",

              "Таласская область",

              "Иссык-Кульская область",

              "Баткенская область",
            ]}
          />

          <div className={styles.priceBox}>
            <DollarSign className={styles.priceIcon} />

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

          <CustomSelect
            icon={Building2}
            title="Серия / тип"
            value={type}
            setValue={setType}
            options={[
              "Любая",

              "Новостройка",

              "102 тип",

              "104 тип",

              "104 тип улучшенная",

              "105 тип",

              "106 тип",

              "107 тип",

              "108 тип",

              "Сталинка",

              "Хрущевка",

              "Индивидуальная",

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
            options={[
              "Количество",

              "1 комната",

              "2 комнаты",

              "3 комнаты",

              "4+ комнаты",
            ]}
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
              options={[
                "Любой",
                "1 этаж",
                "2-5 этаж",
                "6-10 этаж",
                "11-20+ этаж",
              ]}
            />

            <CustomSelect
              title="Состояние"
              value={condition}
              setValue={setCondition}
              options={[
                "Любое",

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
                "Любые",

                "Газоблок",

                "Кирпич",

                "Бетон",

                "Газобетон",

                "Монолитная",

                "Монолитно-каркасная",

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
                "Любое",

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
                "Любые",

                "Красная книга",

                "Тех паспорт",

                "Договор купли-продажи",

                "Долевое участие",

                "Акт приема-передачи",
              ]}
            />

            <CustomSelect
              icon={Sofa}
              title="Мебель"
              value={furniture}
              setValue={setFurniture}
              options={["Любая", "Полная", "Частичная", "Без мебели"]}
            />

            {deal === "rent" && category === "Квартиры" && (
              <>
                <CustomSelect
                  icon={ShieldCheck}
                  title="Удобства"
                  value={comfort}
                  setValue={setComfort}
                  options={[
                    "Любые",

                    "Балкон / лоджия",

                    "Бытовая техника",

                    "Кондиционер",

                    "Лифт",

                    "Охрана",

                    "Парковка",

                    "Видео наблюдение",

                    "Вид на горы",

                    "Животные не проживали",

                    "Закрытая территория",

                    "Раздельный санузел",

                    "Совмещенный санузел",

                    "С мебелью",
                  ]}
                />

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

                    "На сезон",

                    "Помесячно",

                    "Долгосрочно",
                  ]}
                />

                <CustomSelect
                  icon={BadgeCheck}
                  title="Тип предложения"
                  value={offerType}
                  setValue={setOfferType}
                  options={[
                    "Любой",

                    "Наличный расчет",

                    "В рассрочку",

                    "Возможен обмен",

                    "В ипотеку",

                    "Срочное предложение",
                  ]}
                />
              </>
            )}
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
