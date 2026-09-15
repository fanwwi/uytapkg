"use client";

import { useState, useEffect } from "react";
import { MapPin, Globe2, Check, ChevronRight } from "lucide-react";

import { getConstants } from "@/utils/api";
import { useLanguage } from "@/context/LanguageContext";

import CustomSelect from "@/components/ui/customSelect/CustomSelect";
import styles from "./StepLocation.module.css";

const fallbackLocations = {
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
          "Кочкор-Ата",
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

const originalTurkey = {
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
};

export default function StepLocation({ form, updateForm, onNext }) {
  const { t } = useLanguage();

  const [locationsData, setLocationsData] = useState(null);

  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    getConstants()
      .then((res) => {
        const locations =
          res?.data?.locationsByRegion || res?.locationsByRegion;

        if (locations) {
          setLocationsData({
            kyrgyzstan: {
              name: "Кыргызстан",

              regions: {
                BISHKEK: {
                  name: "Бишкек",
                  type: "bishkek",
                  districts: locations.BISHKEK || [],
                },

                CHUY: {
                  name: "Чуйская область",
                  type: "region",
                  settlements: locations.CHUY || [],
                },

                OSH_REGION: {
                  name: "Ошская область",
                  type: "region",
                  settlements: [
                    ...(locations.OSH_CITY || []),
                    ...(locations.OSH_REGION || []),
                  ],
                },

                ISSYK_KUL: {
                  name: "Иссык-Кульская область",
                  type: "region",
                  settlements: locations.ISSYK_KUL || [],
                },

                JALAL_ABAD: {
                  name: "Джалал-Абадская область",
                  type: "region",
                  settlements: locations.JALAL_ABAD || [],
                },

                NARYN: {
                  name: "Нарынская область",
                  type: "region",
                  settlements: locations.NARYN || [],
                },

                TALAS: {
                  name: "Таласская область",
                  type: "region",
                  settlements: locations.TALAS || [],
                },

                BATKEN: {
                  name: "Баткенская область",
                  type: "region",
                  settlements: locations.BATKEN || [],
                },
              },
            },

            turkey: originalTurkey,
          });
        } else {
          throw new Error("No data returned");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch constants", err);

        setApiError(true);

        setLocationsData({
          kyrgyzstan: fallbackLocations.kyrgyzstan,
          turkey: originalTurkey,
        });
      });
  }, []);

  const countryData = locationsData ? locationsData[form.country] : null;

  const isKyrgyzstan = form.country === "kyrgyzstan";

  const isTurkey = form.country === "turkey";

  const selectedRegion = isKyrgyzstan
    ? countryData?.regions?.[form.region]
    : null;

  const selectedCity = isTurkey ? countryData?.cities?.[form.city] : null;

  const isBishkek =
    isKyrgyzstan && (form.region === "BISHKEK" || form.region === "bishkek");

  /*
   * Переводим только отображаемые названия.
   * В value остаются реальные ключи формы.
   */
  const getRegionLabel = (regionKey, name) => {
    const key = `stepLocation.regions.${regionKey}`;
    const translated = t(key);

    return translated === key ? name : translated;
  };

  const regionOptions = isKyrgyzstan
    ? Object.entries(countryData?.regions || {}).map(([value, item]) => ({
        value,
        label: getRegionLabel(value, item.name),
      }))
    : [];

  const kyrgyzSettlementOptions = selectedRegion?.settlements || [];

  const turkeyCityOptions = isTurkey
    ? Object.entries(countryData?.cities || {}).map(([value, item]) => ({
        value,
        label: item.name,
      }))
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
    if (!countryData?.regions?.[value]) {
      return;
    }

    updateForm({
      region: value,
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
    if (!countryData?.cities?.[value]) {
      return;
    }

    updateForm({
      city: value,
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

  const selectedRegionDisplay = form.region
    ? getRegionLabel(form.region, selectedRegionName)
    : "";

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <div className={styles.stepBadge}>
          <span className={styles.stepDot} />

          {t("stepLocation.step")}
        </div>

        <h1>{t("stepLocation.title")}</h1>

        <p>{t("stepLocation.description")}</p>
      </div>

      {apiError && (
        <div
          style={{
            color: "#e53e3e",
            background: "#fed7d7",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize: "14px",
          }}
        >
          {t("stepLocation.apiError")}
        </div>
      )}

      {/* COUNTRY */}

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon}>
            <Globe2 size={19} />
          </div>

          <div>
            <label>{t("stepLocation.country.title")}</label>

            <span>{t("stepLocation.country.description")}</span>
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
              <span
                style={{
                  color: "#483df6",
                  marginTop: "-5px",
                }}
              >
                🇰🇬
              </span>
            </div>

            <div className={styles.choiceContent}>
              <strong>{t("stepLocation.countries.kyrgyzstan")}</strong>

              <span>{t("stepLocation.countries.kyrgyzstanDescription")}</span>
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
              <span
                style={{
                  color: "#483df6",
                  marginTop: "-5px",
                }}
              >
                🇹🇷
              </span>
            </div>

            <div className={styles.choiceContent}>
              <strong>{t("stepLocation.countries.turkey")}</strong>

              <span>{t("stepLocation.countries.turkeyDescription")}</span>
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
              title={t("stepLocation.fields.region")}
              value={form.region || ""}
              setValue={selectKyrgyzRegion}
              options={regionOptions}
            />
          </div>

          {isBishkek && (
            <div className={styles.grid}>
              <CustomSelect
                title={t("stepLocation.fields.bishkekDistrict")}
                value={form.district || ""}
                setValue={selectDistrict}
                options={districtOptions}
              />
            </div>
          )}

          {!isBishkek && selectedRegion && (
            <div className={styles.grid}>
              <CustomSelect
                title={t("stepLocation.fields.settlement")}
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
              title={t("stepLocation.fields.city")}
              value={form.city || ""}
              setValue={selectTurkeyCity}
              options={turkeyCityOptions}
            />
          </div>

          {selectedCity && (
            <div className={styles.grid}>
              <CustomSelect
                title={t("stepLocation.fields.district")}
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
            <strong>{t("stepLocation.ready.title")}</strong>

            <span>
              {isBishkek
                ? `${selectedRegionDisplay} · ${form.district}`
                : isKyrgyzstan
                  ? `${selectedRegionDisplay} · ${form.settlement}`
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
          {t("stepLocation.continue")}

          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
