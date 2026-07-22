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
  Maximize,
  Sofa,
  ShieldCheck,
  CalendarDays,
  BadgeCheck,
  Flame,
  Crown,
  Layers,
  Thermometer,
  FileCheck,
  Home,
  Trees,
  Store,
  Car,
} from "lucide-react";

import CustomSelect from "../../components/ui/customSelect/CustomSelect";

import styles from "./SearchFilter.module.css";

export default function SearchFilter() {
  const [mode, setMode] = useState("normal");

  const [deal, setDeal] = useState("buy");

  const [category, setCategory] = useState("Квартиры");

  const [advanced, setAdvanced] = useState(false);

  const [urgent, setUrgent] = useState(false);

  const [vip, setVip] = useState(false);

  const [location, setLocation] = useState("Любой");

  const [type, setType] = useState("Любой");

  const [rooms, setRooms] = useState("Любой");

  const [priceFrom, setPriceFrom] = useState("");

  const [priceTo, setPriceTo] = useState("");

  const [areaFrom, setAreaFrom] = useState("");

  const [areaTo, setAreaTo] = useState("");

  const [floor, setFloor] = useState("Любой");

  const [condition, setCondition] = useState("Любое");

  const [walls, setWalls] = useState("Любые");

  const [heating, setHeating] = useState("Любое");

  const [documents, setDocuments] = useState("Любые");

  const [furniture, setFurniture] = useState("Любая");

  const [comfort, setComfort] = useState("Любые");

  const [offerType, setOfferType] = useState("Любой");

  const [rentPeriod, setRentPeriod] = useState("Любой");

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
      icon: Trees,
    },
    {
      name: "Комнаты",
      icon: BedDouble,
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

  const reset = () => {
    setLocation("Любой");
    setType("Любой");
    setRooms("Любой");

    setPriceFrom("");
    setPriceTo("");

    setAreaFrom("");
    setAreaTo("");

    setFloor("Любой");
    setCondition("Любое");
    setWalls("Любые");
    setHeating("Любое");
    setDocuments("Любые");
    setFurniture("Любая");

    setComfort("Любые");
    setOfferType("Любой");
    setRentPeriod("Любой");

    setUrgent(false);
    setVip(false);
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
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

        <div className={styles.tabs}>
          {[
            ["buy", "Купить"],
            ["rent", "Снять"],
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

        <div className={styles.categories}>
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={category === item.name ? styles.categoryActive : ""}
                onClick={() => setCategory(item.name)}
              >
                <Icon />

                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.specialFilters}>
          <button
            className={urgent ? styles.specialActive : ""}
            onClick={() => setUrgent(!urgent)}
          >
            <Flame />
            Срочно
          </button>

          <button
            className={vip ? styles.vipActive : ""}
            onClick={() => setVip(!vip)}
          >
            <Crown />
            VIP
          </button>
        </div>

        <div className={styles.mainFilters}>
          <CustomSelect
            icon={MapPin}
            title="Локация"
            value={location}
            setValue={setLocation}
            options={[
              "Любой",
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
            <div className={styles.bigIcon}>
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

          <div className={styles.priceBox}>
            <div className={styles.bigIcon}>
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
              "102 тип",
              "104 тип",
              "104 улучшенный",
              "105 тип",
              "106 тип",
              "107 тип",
              "108 тип",
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
        </div>

        <button className={styles.more} onClick={() => setAdvanced(!advanced)}>
          <SlidersHorizontal />
          Все фильтры
        </button>

        {advanced && (
          <div className={styles.extra}>
            <CustomSelect
              icon={Layers}
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
                "Монолит",
                "Панель",
                "Пеноблок",
                "Саман",
              ]}
            />

            <CustomSelect
              icon={Thermometer}
              title="Отопление"
              value={heating}
              setValue={setHeating}
              options={[
                "Любое",
                "Автономное",
                "Газовое",
                "Центральное",
                "Электрическое",
              ]}
            />

            <CustomSelect
              icon={FileCheck}
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

            <CustomSelect
              icon={ShieldCheck}
              title="Удобства"
              value={comfort}
              setValue={setComfort}
              options={[
                "Любые",
                "Балкон / лоджия",
                "Кондиционер",
                "Лифт",
                "Охрана",
                "Парковка",
                "Видео наблюдение",
                "Вид на горы",
                "Закрытая территория",
                "Раздельный санузел",
                "Совмещенный санузел",
                "С мебелью",
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
                "Рассрочка",
                "Возможен обмен",
                "Ипотека",
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
                  "На сезон",
                  "Помесячно",
                  "Долгосрочно",
                ]}
              />
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

          <button className={styles.resetBtn} onClick={reset}>
            <RotateCcw />
            Сбросить
          </button>
        </div>
      </div>
    </section>
  );
}
