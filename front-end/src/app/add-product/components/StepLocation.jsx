"use client";

import CustomSelect from "@/components/ui/customSelect/CustomSelect";
import styles from "./steps.module.css";

const locations = {
  kyrgyzstan: {
    name: "Кыргызстан",

    regions: {
      bishkek: {
        name: "Бишкек",
        type: "bishkek",

        districts: [
          "Ленинский район",
          "Октябрьский район",
          "Первомайский район",
          "Свердловский район",
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
          "Кара-Суу",
          "Ноокат",
          "Узген",
          "Гульча",
          "Найман",
          "Кара-Кульджа",
          "Кызыл-Кыштак",
          "Мады",
          "Папан",
          "Кашгар-Кыштак",
        ],
      },

      issykKul: {
        name: "Иссык-Кульская область",
        type: "region",

        settlements: [
          "Каракол",
          "Балыкчы",
          "Чолпон-Ата",
          "Боконбаево",
          "Тюп",
          "Кызыл-Суу",
          "Барскоон",
          "Теплоключенка",
          "Ак-Суу",
          "Тосор",
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
          "Adalar",
          "Arnavutköy",
          "Ataşehir",
          "Avcılar",
          "Bağcılar",
          "Bahçelievler",
          "Bakırköy",
          "Başakşehir",
          "Bayrampaşa",
          "Beşiktaş",
          "Beykoz",
          "Beylikdüzü",
          "Beyoğlu",
          "Büyükçekmece",
          "Çatalca",
          "Çekmeköy",
          "Esenler",
          "Esenyurt",
          "Eyüpsultan",
          "Fatih",
          "Gaziosmanpaşa",
          "Güngören",
          "Kadıköy",
          "Kağıthane",
          "Kartal",
          "Küçükçekmece",
          "Maltepe",
          "Pendik",
          "Sancaktepe",
          "Sarıyer",
          "Silivri",
          "Sultanbeyli",
          "Sultangazi",
          "Şile",
          "Şişli",
          "Tuzla",
          "Ümraniye",
          "Üsküdar",
          "Zeytinburnu",
        ],
      },

      ankara: {
        name: "Анкара",

        districts: [
          "Altındağ",
          "Ayaş",
          "Bala",
          "Beypazarı",
          "Çamlıdere",
          "Çankaya",
          "Çubuk",
          "Elmadağ",
          "Etimesgut",
          "Evren",
          "Gölbaşı",
          "Güdül",
          "Haymana",
          "Kahramankazan",
          "Kalecik",
          "Keçiören",
          "Kızılcahamam",
          "Mamak",
          "Nallıhan",
          "Polatlı",
          "Pursaklar",
          "Sincan",
          "Şereflikoçhisar",
          "Yenimahalle",
        ],
      },

      antalya: {
        name: "Анталья",

        districts: [
          "Aksu",
          "Akseki",
          "Alanya",
          "Demre",
          "Döşemealtı",
          "Elmalı",
          "Finike",
          "Gazipaşa",
          "Gündoğmuş",
          "İbradı",
          "Kaş",
          "Kemer",
          "Kepez",
          "Konyaaltı",
          "Korkuteli",
          "Kumluca",
          "Manavgat",
          "Muratpaşa",
          "Serik",
        ],
      },

      izmir: {
        name: "Измир",

        districts: [
          "Aliağa",
          "Balçova",
          "Bayındır",
          "Bayraklı",
          "Bergama",
          "Beydağ",
          "Bornova",
          "Buca",
          "Çeşme",
          "Çiğli",
          "Dikili",
          "Foça",
          "Gaziemir",
          "Güzelbahçe",
          "Karabağlar",
          "Karaburun",
          "Karşıyaka",
          "Kemalpaşa",
          "Kınık",
          "Kiraz",
          "Konak",
          "Menderes",
          "Menemen",
          "Narlıdere",
          "Ödemiş",
          "Seferihisar",
          "Selçuk",
          "Tire",
          "Torbalı",
          "Urla",
        ],
      },

      bursa: {
        name: "Бурса",

        districts: [
          "Büyükorhan",
          "Gemlik",
          "Gürsu",
          "Harmancık",
          "İnegöl",
          "İznik",
          "Karacabey",
          "Keles",
          "Kestel",
          "Mudanya",
          "Mustafakemalpaşa",
          "Nilüfer",
          "Orhaneli",
          "Orhangazi",
          "Osmangazi",
          "Yenişehir",
          "Yıldırım",
        ],
      },

      mersin: {
        name: "Мерсин",

        districts: [
          "Akdeniz",
          "Anamur",
          "Aydıncık",
          "Bozyazı",
          "Çamlıyayla",
          "Erdemli",
          "Gülnar",
          "Mezitli",
          "Mut",
          "Silifke",
          "Tarsus",
          "Toroslar",
          "Yenişehir",
        ],
      },

      mugla: {
        name: "Мугла",

        districts: [
          "Bodrum",
          "Dalaman",
          "Datça",
          "Fethiye",
          "Kavaklıdere",
          "Köyceğiz",
          "Marmaris",
          "Menteşe",
          "Milas",
          "Ortaca",
          "Seydikemer",
          "Ula",
          "Yatağan",
        ],
      },

      adana: {
        name: "Адана",

        districts: [
          "Aladağ",
          "Ceyhan",
          "Çukurova",
          "Feke",
          "İmamoğlu",
          "Karaisalı",
          "Karataş",
          "Kozan",
          "Pozantı",
          "Saimbeyli",
          "Sarıçam",
          "Seyhan",
          "Tufanbeyli",
          "Yumurtalık",
          "Yüreğir",
        ],
      },

      izmit: {
        name: "Измит / Коджаэли",

        districts: [
          "Başiskele",
          "Çayırova",
          "Darıca",
          "Derince",
          "Dilovası",
          "Gebze",
          "Gölcük",
          "İzmit",
          "Kandıra",
          "Karamürsel",
          "Kartepe",
          "Körfez",
        ],
      },

      trabzon: {
        name: "Трабзон",

        districts: [
          "Akçaabat",
          "Araklı",
          "Arsin",
          "Beşikdüzü",
          "Çarşıbaşı",
          "Çaykara",
          "Dernekpazarı",
          "Düzköy",
          "Hayrat",
          "Köprübaşı",
          "Maçka",
          "Of",
          "Ortahisar",
          "Sürmene",
          "Şalpazarı",
          "Tonya",
          "Vakfıkebir",
          "Yomra",
        ],
      },

      gaziantep: {
        name: "Газиантеп",

        districts: [
          "Araban",
          "İslahiye",
          "Karkamış",
          "Nizip",
          "Nurdağı",
          "Oğuzeli",
          "Şahinbey",
          "Şehitkamil",
          "Yavuzeli",
        ],
      },

      denizli: {
        name: "Денизли",

        districts: [
          "Acıpayam",
          "Babadağ",
          "Baklan",
          "Bekilli",
          "Beyağaç",
          "Bozkurt",
          "Buldan",
          "Çal",
          "Çameli",
          "Çardak",
          "Çivril",
          "Güney",
          "Honaz",
          "Merkezefendi",
          "Pamukkale",
          "Sarayköy",
          "Serinhisar",
          "Tavas",
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
        <span>Шаг 1 из 5</span>

        <h1>Где находится объект?</h1>

        <p>Укажите страну и точное местоположение недвижимости.</p>
      </div>

      {/* COUNTRY */}
      <div className={styles.section}>
        <label>Страна</label>

        <div className={styles.cards}>
          <button
            type="button"
            className={`${styles.choiceCard} ${
              form.country === "kyrgyzstan" ? styles.selected : ""
            }`}
            onClick={() => selectCountry("kyrgyzstan")}
          >
            <strong>🇰🇬 Кыргызстан</strong>

            <span>Область или Бишкек</span>
          </button>

          <button
            type="button"
            className={`${styles.choiceCard} ${
              form.country === "turkey" ? styles.selected : ""
            }`}
            onClick={() => selectCountry("turkey")}
          >
            <strong>🇹🇷 Турция</strong>

            <span>Город и район</span>
          </button>
        </div>
      </div>

      {/* KYRGYZSTAN */}
      {isKyrgyzstan && (
        <>
          {/* ОБЛАСТЬ / БИШКЕК */}
          <div className={styles.grid}>
            <CustomSelect
              title="Область / город"
              value={selectedRegionName}
              setValue={selectKyrgyzRegion}
              options={regionOptions}
            />
          </div>

          {/* БИШКЕК → РАЙОН */}
          {isBishkek && (
            <div className={styles.grid} style={{ marginTop: "18px" }}>
              <CustomSelect
                title="Район Бишкека"
                value={form.district || ""}
                setValue={selectDistrict}
                options={districtOptions}
              />
            </div>
          )}

          {/* ОБЛАСТЬ → ГОРОД / СЕЛО */}
          {!isBishkek && selectedRegion && (
            <div className={styles.grid} style={{ marginTop: "18px" }}>
              <CustomSelect
                title="Город / село"
                value={form.settlement || ""}
                setValue={selectKyrgyzSettlement}
                options={kyrgyzSettlementOptions}
              />
            </div>
          )}
        </>
      )}

      {/* TURKEY */}
      {isTurkey && (
        <>
          {/* ГОРОД */}
          <div className={styles.grid}>
            <CustomSelect
              title="Город"
              value={selectedCityName}
              setValue={selectTurkeyCity}
              options={turkeyCityOptions}
            />
          </div>

          {/* РАЙОН */}
          {selectedCity && (
            <div className={styles.grid} style={{ marginTop: "18px" }}>
              <CustomSelect
                title="Район"
                value={form.district || ""}
                setValue={selectDistrict}
                options={districtOptions}
              />
            </div>
          )}
        </>
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
        </button>
      </div>
    </div>
  );
}
