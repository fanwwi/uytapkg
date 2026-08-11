"use client";

import { MapPin, Globe2, Building2, Check, ChevronRight } from "lucide-react";

import CustomSelect from "@/components/ui/customSelect/CustomSelect";
import styles from "./StepLocation.module.css";

const locations = {
  kyrgyzstan: {
    name: "Кыргызстан",

    regions: {
      bishkek: {
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

      chui: {
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

      osh: {
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

      issykKul: {
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

      jalalAbad: {
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
          "Кочкор-Ата",
          "Сузак",
          "Ала-Бука",
        ],
      },

      naryn: {
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

      talas: {
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

      batken: {
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

export default function StepLocation({ form, updateForm, onNext }) {
  const countryData = locations[form.country];

  const isKyrgyzstan = form.country === "kyrgyzstan";
  const isTurkey = form.country === "turkey";

  const selectedRegion = isKyrgyzstan
    ? countryData?.regions?.[form.region]
    : null;

  const selectedCity = isTurkey ? countryData?.cities?.[form.city] : null;

  const isBishkek = isKyrgyzstan && form.region === "bishkek";

  const regionOptions = isKyrgyzstan
    ? Object.values(countryData?.regions || {}).map((item) => item.name)
    : [];

  const kyrgyzSettlementOptions = selectedRegion?.settlements || [];

  const turkeyCityOptions = isTurkey
    ? Object.values(countryData?.cities || {}).map((item) => item.name)
    : [];

  const districtOptions = isBishkek
    ? selectedRegion?.districts || []
    : selectedCity?.districts || [];

  const selectedRegionName = selectedRegion?.name || "";

  const selectedCityName = isTurkey
    ? selectedCity?.name || ""
    : form.settlement || "";

  function selectCountry(country) {
    updateForm({
      country,
      region: "",
      city: "",
      settlement: "",
      district: "",
    });
  }

  function selectKyrgyzRegion(value) {
    const region = Object.entries(countryData.regions).find(
      ([, item]) => item.name === value,
    )?.[0];

    if (!region) return;

    updateForm({
      region,
      city: "",
      settlement: "",
      district: "",
    });
  }

  function selectKyrgyzSettlement(value) {
    updateForm({
      settlement: value,
      city: "",
      district: "",
    });
  }

  function selectTurkeyCity(value) {
    const city = Object.entries(countryData.cities).find(
      ([, item]) => item.name === value,
    )?.[0];

    if (!city) return;

    updateForm({
      city,
      region: "",
      settlement: "",
      district: "",
    });
  }

  function selectDistrict(value) {
    updateForm({
      district: value,
    });
  }

  const canContinue = isKyrgyzstan
    ? Boolean(form.region && (isBishkek ? form.district : form.settlement))
    : isTurkey
      ? Boolean(form.city && form.district)
      : false;

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <div className={styles.stepBadge}>
          <span className={styles.stepDot} />
          Шаг 1 из 5
        </div>

        <h1>Где находится объект?</h1>

        <p>
          Укажите страну и точное местоположение недвижимости. Это поможет
          покупателям быстрее найти ваше объявление.
        </p>
      </div>

      {/* COUNTRY */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon}>
            <Globe2 size={19} />
          </div>

          <div>
            <label>Страна</label>
            <span>Выберите страну размещения</span>
          </div>
        </div>

        <div className={styles.cards}>
          <button
            type="button"
            className={`${styles.choiceCard} ${
              form.country === "kyrgyzstan" ? styles.selected : ""
            }`}
            onClick={() => selectCountry("kyrgyzstan")}
          >
            <div className={styles.choiceIcon}>
              <span style={{ color: "#ff3d99", marginTop: "-5px" }}>🇰🇬</span>
            </div>

            <div className={styles.choiceContent}>
              <strong>Кыргызстан</strong>
              <span>Область, город и район</span>
            </div>

            {form.country === "kyrgyzstan" && (
              <div className={styles.check}>
                <Check size={14} />
              </div>
            )}

            <ChevronRight className={styles.cardArrow} size={18} />
          </button>

          <button
            type="button"
            className={`${styles.choiceCard} ${
              form.country === "turkey" ? styles.selected : ""
            }`}
            onClick={() => selectCountry("turkey")}
          >
            <div className={styles.choiceIcon}>
              <span style={{ color: "#ff3d99", marginTop: "-5px" }}>🇹🇷</span>
            </div>

            <div className={styles.choiceContent}>
              <strong>Турция</strong>
              <span>Город и район</span>
            </div>

            {form.country === "turkey" && (
              <div className={styles.check}>
                <Check size={14} />
              </div>
            )}

            <ChevronRight className={styles.cardArrow} size={18} />
          </button>
        </div>
      </div>

      {/* KYRGYZSTAN */}
      {isKyrgyzstan && (
        <div className={styles.locationFields}>
          <div className={styles.grid}>
            <CustomSelect
              title="Область / город"
              value={selectedRegionName}
              setValue={selectKyrgyzRegion}
              options={regionOptions}
            />
          </div>

          {isBishkek && (
            <div className={styles.grid}>
              <CustomSelect
                title="Район Бишкека"
                value={form.district || ""}
                setValue={selectDistrict}
                options={districtOptions}
              />
            </div>
          )}

          {!isBishkek && selectedRegion && (
            <div className={styles.grid}>
              <CustomSelect
                title="Город / село"
                value={form.settlement || ""}
                setValue={selectKyrgyzSettlement}
                options={kyrgyzSettlementOptions}
              />
            </div>
          )}
        </div>
      )}

      {/* TURKEY */}
      {isTurkey && (
        <div className={styles.locationFields}>
          <div className={styles.grid}>
            <CustomSelect
              title="Город"
              value={selectedCityName}
              setValue={selectTurkeyCity}
              options={turkeyCityOptions}
            />
          </div>

          {selectedCity && (
            <div className={styles.grid}>
              <CustomSelect
                title="Район"
                value={form.district || ""}
                setValue={selectDistrict}
                options={districtOptions}
              />
            </div>
          )}
        </div>
      )}

      {/* LOCATION STATUS */}
      {canContinue && (
        <div className={styles.locationReady}>
          <div className={styles.readyIcon}>
            <MapPin size={18} />
          </div>

          <div>
            <strong>Местоположение выбрано</strong>

            <span>
              {isBishkek
                ? `Бишкек · ${form.district}`
                : isKyrgyzstan
                  ? `${selectedRegionName} · ${form.settlement}`
                  : `${selectedCityName} · ${form.district}`}
            </span>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          disabled={!canContinue}
          onClick={onNext}
        >
          Продолжить
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
