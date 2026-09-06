"use client";

import {
  MapPin,
  DoorOpen,
  DollarSign,
  Ruler,
  Waves,
  FileText,
  Globe2,
} from "lucide-react";

import styles from "./CommonFilters.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

/* =========================================================
   OPTIONS
========================================================= */

const roomsOptions = ["Все", "1", "2", "3", "4+"];

const currencyOptions = ["USD", "KGS", "EUR"];

/* =========================================================
   FALLBACK LOCATIONS
========================================================= */

const locations = {
  kyrgyzstan: {
    name: "Кыргызстан",

    regions: {
      BISHKEK: {
        name: "Бишкек",
        type: "bishkek",

        districts: [
          "Центр",
          "Верхняя часть города",
          "Нижняя часть города",
          "Верхний Джал",
          "Средний Джал",
          "Нижний Джал",
          "Арча-Бешик",
          "Орто-Сай",
          "Ак-Орго",
          "Кызыл-Аскер",
          "Ынтымак",
          "Тенир-Тоо",
          "Ак-Кеме",
          "Пишпек",
          "69-га",
          "3–12 мкр",
          "Асанбай",
          "Кара-Жыгач",
          "Кок-Жар",
          "Тунгуч",
          "Магистраль",
          "Улан",
          "Вефа",
          "ЦУМ",
          "Маевка",
          "Политех",
          "Юг-2",
          "Достук",
          "Золотой квадрат",
          "КНУ",
          "Тынчтык",
          "Мурас-Ордо",
          "Аламедин-1",
          "Восток-5",
          "Дордой",
          "Лебединовка",
          "Учкун",
          "Таатан",
          "Юбилейка",
        ],
      },

      CHUY: {
        name: "Чуйская область",
        type: "region",

        settlements: [
          "Токмок",
          "Кант",
          "Кара-Балта",
          "Шопоков",
          "Каинды",
          "Кемин",
          "Беловодское",
          "Сокулук",
          "Аламедин",
          "Лебединовка",
          "Военно-Антоновка",
          "Новопавловка",
          "Александровка",
          "Петровка",
          "Московское",
          "Бишкекское",
        ],
      },

      OSH_REGION: {
        name: "Ошская область",
        type: "region",

        settlements: [
          "Ош",
          "Ноокат",
          "Кара-Суу",
          "Араванский район",
          "Узгенский район",
          "Чон-Алайский район",
          "Кара-Сууйский район",
          "Кара-Кульджинский район",
          "Узген",
          "Гульча",
          "Жаны-Ноокат",
          "Эркеш-Там",
          "Гулбаар",
        ],
      },

      ISSYK_KUL: {
        name: "Иссык-Кульская область",
        type: "region",

        settlements: [
          "Каракол",
          "Чолпон-Ата",
          "Бостери",
          "Балыкчы",
          "Каджи-Сай",
          "Тамчы",
          "Боконбаево",
          "Тюп",
          "Тамга",
          "Григорьевка",
          "Ананьево",
          "Барскоон",
          "Жыргалан",
        ],
      },

      JALAL_ABAD: {
        name: "Джалал-Абадская область",
        type: "region",

        settlements: [
          "Джалал-Абад",
          "Таш-Кумыр",
          "Кара-Куль",
          "Майлуу-Суу",
          "Кочкор-Ата",
          "Базар-Коргон",
          "Кербен",
          "Токтогул",
          "Сузак",
          "Ала-Бука",
        ],
      },

      NARYN: {
        name: "Нарынская область",
        type: "region",

        settlements: [
          "Нарын",
          "Кочкор",
          "Ат-Башы",
          "Чаек",
          "Баетов",
          "Казарман",
          "Мин-Куш",
          "Достук",
        ],
      },

      TALAS: {
        name: "Таласская область",
        type: "region",

        settlements: [
          "Талас",
          "Бакай-Ата",
          "Покровка",
          "Кара-Буура",
          "Манас",
          "Кызыл-Адыр",
        ],
      },

      BATKEN: {
        name: "Баткенская область",
        type: "region",

        settlements: [
          "Баткен",
          "Кызыл-Кыя",
          "Сулюкта",
          "Раззаков",
          "Кадамжай",
          "Айдаркен",
          "Исфана",
          "Самаркандек",
        ],
      },
    },
  },

  turkey: {
    name: "Турция",

    cities: {
      istanbul: {
        name: "Стамбул",
        districts: [
          "Авджилар",
          "Адалар",
          "Арнавуткёй",
          "Аташехир",
          "Багджилар",
          "Байрампаша",
          "Бакыркёй",
          "Башакшехир",
          "Бейкоз",
          "Бейликдюзю",
          "Бейоглу",
          "Бешикташ",
          "Бююкчекмедже",
          "Газиосманпаша",
          "Гюнгёрен",
          "Зейтинбурну",
          "Кадыкёй",
          "Картал",
          "Кючюкчекмедже",
          "Кягытхане",
          "Малтепе",
          "Пендик",
          "Санджактепе",
          "Сарыер",
          "Силиври",
          "Султанбейли",
          "Султангази",
          "Тузла",
          "Умрание",
          "Ускюдар",
          "Фатих",
          "Чаталджа",
          "Чекмекёй",
          "Шиле",
          "Шишли",
          "Эсенлер",
          "Эсеньюрт",
          "Эюпсултан",
        ],
      },

      ankara: {
        name: "Анкара",
        districts: [
          "Акюрт",
          "Алтындаг",
          "Аяш",
          "Бала",
          "Бейпазары",
          "Гёльбаши",
          "Гюдюл",
          "Енимахалле",
          "Каледжик",
          "Кахраманказан",
          "Кечиорен",
          "Кызылджахамам",
          "Мамак",
          "Наллыхан",
          "Полатлы",
          "Пурсаклар",
          "Синджан",
          "Хаймана",
          "Чамлыдере",
          "Чанкая",
          "Чубук",
          "Шерефликочхисар",
          "Эврен",
          "Эльмадаг",
          "Эриаман",
        ],
      },

      antalya: {
        name: "Анталья",
        districts: [
          "Аксеки",
          "Аксу",
          "Аланья",
          "Демре",
          "Дёшемеалты",
          "Ибрады",
          "Каш",
          "Кемер",
          "Кепез",
          "Коньяалты",
          "Коркутели",
          "Кумлуджа",
          "Манавгат",
          "Муратпаша",
          "Серик",
          "Финике",
          "Газипаша",
          "Гюндогмуш",
          "Эльмалы",
        ],
      },

      izmir: {
        name: "Измир",
        districts: [
          "Алиага",
          "Балчова",
          "Байындыр",
          "Байраклы",
          "Бергама",
          "Бейдаг",
          "Борнова",
          "Буджа",
          "Чешме",
          "Чигли",
          "Дикили",
          "Фоча",
          "Газиэмир",
          "Гюзелбахче",
          "Карабаглар",
          "Карабурун",
          "Каршияка",
          "Кемальпаша",
          "Кынык",
          "Кираз",
          "Конак",
          "Мендерес",
          "Менемен",
          "Нарлыдере",
          "Одемиш",
          "Сеферихисар",
          "Селчук",
          "Тире",
          "Торбалы",
          "Урла",
        ],
      },

      bursa: {
        name: "Бурса",
        districts: [
          "Бююк Орхан",
          "Гемлик",
          "Гюрсу",
          "Изник",
          "Караджабей",
          "Келес",
          "Кестель",
          "Муданья",
          "Мустафакемальпаша",
          "Нилюфер",
          "Орхангази",
          "Орханели",
          "Османгази",
          "Енишехир",
          "Инегёль",
          "Харманджик",
          "Йылдырым",
        ],
      },

      mersin: {
        name: "Аланья",
        districts: [
          "Авсаллар",
          "Бекташ",
          "Гюллер Пынары",
          "Демирташ",
          "Джикджилли",
          "Инджекум",
          "Кадипаша",
          "Каргыджак",
          "Кестель",
          "Кизлар Пынары",
          "Конаклы",
          "Махмутлар",
          "Оба",
          "Окурджалар",
          "Паяллар",
          "Сарай",
          "Сугёзю",
          "Тосмур",
          "Тюрклер",
          "Хаджэт",
          "Хисаричи",
          "Чиплаклы",
          "Шекерхане",
        ],
      },

      mugla: {
        name: "Бодрум",
        districts: [
          "Акьярлар",
          "Битез",
          "Гёльтюркбюкю",
          "Гюмюшлюк",
          "Гюндоган",
          "Гюмбет",
          "Давутлар",
          "Ичмелер",
          "Кадикалеси",
          "Караова",
          "Конаджик",
          "Кумбахче",
          "Мумджулар",
          "Ортакент",
          "Торба",
          "Тургутреис",
          "Тюркбюкю",
          "Умюрча",
          "Чарши",
          "Чеч",
          "Ялыкавак",
        ],
      },

      adana: {
        name: "Мармарис",
        districts: [
          "Армуталан",
          "Бельдиби",
          "Бозбурун",
          "Ичмелер",
          "Кемерсереф",
          "Орхание",
          "Селимие",
          "Сителер",
          "Согут",
          "Тепе",
          "Тургют",
          "Турунч",
          "Хатирими",
          "Чамлы",
          "Чилдыр",
        ],
      },
    },
  },
};

/* =========================================================
   HELPERS
========================================================= */

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/* =========================================================
   ISSYK-KUL DETECTOR
========================================================= */

function isIssykKul(filters) {
  const city = normalize(filters?.city);
  const region = normalize(filters?.region);
  const settlement = normalize(filters?.settlement);

  if (
    region === "issyk_kul" ||
    region === "issyk-kul" ||
    region === "issyk kul" ||
    (region.includes("иссык") && region.includes("куль"))
  ) {
    return true;
  }

  if (city.includes("иссык") && city.includes("куль")) {
    return true;
  }

  const issykKulCities = [
    "каракол",
    "чолпон-ата",
    "чолпоната",
    "бостери",
    "тамчы",
    "чон-сары-ой",
    "чон сары ой",
    "сары-ой",
    "сары ой",
    "боконбаево",
    "барскоон",
    "тамга",
    "каджи-сай",
    "каджисай",
    "тосор",
    "ананьево",
    "пристань-пржевальск",
    "рыбачье",
    "балыкчы",
    "иссык-куль",
  ];

  return issykKulCities.some(
    (name) => city.includes(name) || settlement.includes(name),
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CommonFilters({ filters, updateFilter }) {
  const isKyrgyzstan = filters?.country === "kyrgyzstan" || !filters?.country;

  const isTurkey = filters?.country === "turkey";

  /* =======================================================
     KYRGYZSTAN DATA
  ======================================================= */

  const kyrgyzRegions = Object.values(locations.kyrgyzstan.regions);

  const selectedKyrgyzRegion =
    locations.kyrgyzstan.regions[filters?.region] || null;

  const isBishkek = filters?.region === "BISHKEK";

  const kyrgyzRegionOptions = [
    "Все",
    ...kyrgyzRegions.map((item) => item.name),
  ];

  const kyrgyzSettlementOptions = selectedKyrgyzRegion?.settlements || [];

  const bishkekDistrictOptions = selectedKyrgyzRegion?.districts || [];

  /* =======================================================
     TURKEY DATA
  ======================================================= */

  const turkeyCities = Object.values(locations.turkey.cities);

  const selectedTurkeyCity = locations.turkey.cities[filters?.city] || null;

  const turkeyCityOptions = ["Все", ...turkeyCities.map((item) => item.name)];

  const turkeyDistrictOptions = selectedTurkeyCity?.districts || [];

  /* =======================================================
     LOCATION HANDLERS
  ======================================================= */

  function selectCountry(value) {
    if (value === "Все") {
      updateFilter("country", "");
      updateFilter("region", "");
      updateFilter("city", "");
      updateFilter("settlement", "");
      updateFilter("district", "");

      return;
    }

    const country = value === "Кыргызстан" ? "kyrgyzstan" : "turkey";

    updateFilter("country", country);
    updateFilter("region", "");
    updateFilter("city", "");
    updateFilter("settlement", "");
    updateFilter("district", "");
  }

  function selectKyrgyzRegion(value) {
    if (value === "Все") {
      updateFilter("region", "");
      updateFilter("city", "");
      updateFilter("settlement", "");
      updateFilter("district", "");

      return;
    }

    const regionEntry = Object.entries(locations.kyrgyzstan.regions).find(
      ([, item]) => item.name === value,
    );

    if (!regionEntry) return;

    const [region] = regionEntry;

    updateFilter("region", region);
    updateFilter("city", "");
    updateFilter("settlement", "");
    updateFilter("district", "");
  }

  function selectKyrgyzSettlement(value) {
    if (value === "Все") {
      updateFilter("settlement", "");
      updateFilter("city", "");
      updateFilter("district", "");

      return;
    }

    updateFilter("settlement", value);
    updateFilter("city", "");
    updateFilter("district", "");
  }

  function selectBishkekDistrict(value) {
    if (value === "Все") {
      updateFilter("district", "");

      return;
    }

    updateFilter("district", value);
  }

  function selectTurkeyCity(value) {
    if (value === "Все") {
      updateFilter("city", "");
      updateFilter("district", "");

      return;
    }

    const cityEntry = Object.entries(locations.turkey.cities).find(
      ([, item]) => item.name === value,
    );

    if (!cityEntry) return;

    const [city] = cityEntry;

    updateFilter("city", city);
    updateFilter("region", "");
    updateFilter("settlement", "");
    updateFilter("district", "");
  }

  function selectTurkeyDistrict(value) {
    if (value === "Все") {
      updateFilter("district", "");

      return;
    }

    updateFilter("district", value);
  }

  /* =======================================================
     DISPLAY VALUES
  ======================================================= */

  const selectedKyrgyzRegionName = selectedKyrgyzRegion?.name || "Все";

  const selectedKyrgyzSettlement = filters?.settlement || "Все";

  const selectedBishkekDistrict = filters?.district || "Все";

  const selectedTurkeyCityName = selectedTurkeyCity?.name || "Все";

  const selectedTurkeyDistrict = filters?.district || "Все";

  /* =======================================================
     BEACH DISTANCE
  ======================================================= */

  const showBeachDistance = isIssykKul(filters);

  /* =======================================================
     COUNTRY DISPLAY
  ======================================================= */

  const countryValue = isTurkey
    ? "Турция"
    : isKyrgyzstan
      ? "Кыргызстан"
      : "Все";

  /* =======================================================
     PROPERTY TYPE
  ======================================================= */

  const showRooms = ["apartment", "house", "cottage", "room"].includes(
    filters?.propertyType,
  );

  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {/* =================================================
            COUNTRY
        ================================================= */}

        <CustomSelect
          icon={Globe2}
          title="Страна"
          options={["Все", "Кыргызстан", "Турция"]}
          value={countryValue}
          setValue={selectCountry}
        />

        {/* =================================================
            KYRGYZSTAN — REGION
        ================================================= */}

        {isKyrgyzstan && (
          <CustomSelect
            icon={MapPin}
            title="Область / город"
            options={kyrgyzRegionOptions}
            value={selectedKyrgyzRegionName}
            setValue={selectKyrgyzRegion}
          />
        )}

        {/* =================================================
            KYRGYZSTAN — BISHKEK DISTRICT
        ================================================= */}

        {isKyrgyzstan && isBishkek && (
          <CustomSelect
            icon={MapPin}
            title="Район Бишкека"
            options={["Все", ...bishkekDistrictOptions]}
            value={selectedBishkekDistrict}
            setValue={selectBishkekDistrict}
          />
        )}

        {/* =================================================
            KYRGYZSTAN — SETTLEMENT
        ================================================= */}

        {isKyrgyzstan && selectedKyrgyzRegion && !isBishkek && (
          <CustomSelect
            icon={MapPin}
            title="Город / село"
            options={["Все", ...kyrgyzSettlementOptions]}
            value={selectedKyrgyzSettlement}
            setValue={selectKyrgyzSettlement}
          />
        )}

        {/* =================================================
            TURKEY — CITY
        ================================================= */}

        {isTurkey && (
          <CustomSelect
            icon={MapPin}
            title="Город"
            options={turkeyCityOptions}
            value={selectedTurkeyCityName}
            setValue={selectTurkeyCity}
          />
        )}

        {/* =================================================
            TURKEY — DISTRICT
        ================================================= */}

        {isTurkey && selectedTurkeyCity && (
          <CustomSelect
            icon={MapPin}
            title="Район"
            options={["Все", ...turkeyDistrictOptions]}
            value={selectedTurkeyDistrict}
            setValue={selectTurkeyDistrict}
          />
        )}

        {/* =================================================
            CURRENCY
        ================================================= */}

        <CustomSelect
          icon={FileText}
          title="Валюта"
          options={currencyOptions}
          value={filters?.currency || "USD"}
          setValue={(value) => updateFilter("currency", value)}
        />

        {/* =================================================
            PRICE
        ================================================= */}

        <div className={styles.range}>
          <div className={styles.rangeTitle}>
            <DollarSign size={17} />
            <span>Цена</span>
          </div>

          <div className={styles.inputs}>
            <input
              type="number"
              min="0"
              placeholder="От"
              value={filters?.priceFrom || ""}
              onChange={(event) =>
                updateFilter("priceFrom", event.target.value)
              }
            />

            <input
              type="number"
              min="0"
              placeholder="До"
              value={filters?.priceTo || ""}
              onChange={(event) => updateFilter("priceTo", event.target.value)}
            />
          </div>
        </div>

        {/* =================================================
            AREA
        ================================================= */}

        <div className={styles.range}>
          <div className={styles.rangeTitle}>
            <Ruler size={17} />
            <span>Площадь, м²</span>
          </div>

          <div className={styles.inputs}>
            <input
              type="number"
              min="0"
              placeholder="От"
              value={filters?.areaFrom || ""}
              onChange={(event) => updateFilter("areaFrom", event.target.value)}
            />

            <input
              type="number"
              min="0"
              placeholder="До"
              value={filters?.areaTo || ""}
              onChange={(event) => updateFilter("areaTo", event.target.value)}
            />
          </div>
        </div>

        {/* =================================================
            ROOMS
        ================================================= */}

        {showRooms && (
          <CustomSelect
            icon={DoorOpen}
            title="Комнаты"
            options={roomsOptions}
            value={filters?.rooms || "Все"}
            setValue={(value) => updateFilter("rooms", value)}
          />
        )}

        {/* =================================================
            BEACH DISTANCE
        ================================================= */}

        {showBeachDistance && (
          <div className={styles.range}>
            <div className={styles.rangeTitle}>
              <Waves size={17} />
              <span>До пляжа, м</span>
            </div>

            <div className={styles.inputs}>
              <input
                type="number"
                min="0"
                placeholder="От"
                value={filters?.beachDistanceFrom || ""}
                onChange={(event) =>
                  updateFilter("beachDistanceFrom", event.target.value)
                }
              />

              <input
                type="number"
                min="0"
                placeholder="До"
                value={filters?.beachDistanceTo || ""}
                onChange={(event) =>
                  updateFilter("beachDistanceTo", event.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
