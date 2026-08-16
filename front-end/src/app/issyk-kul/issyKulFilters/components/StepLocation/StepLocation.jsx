import { useState, useEffect } from "react";
import { MapPin, Waves, Check, ChevronRight } from "lucide-react";
import { getConstants } from "@/utils/api";

import CustomSelect from "@/components/ui/customSelect/CustomSelect";
import styles from "./StepLocation.module.css";

/*
  Иссык-Куль.
  
  Для фильтра поиска специально не делаем
  "Кыргызстан -> область -> город -> ...".

  Пользователь сразу выбирает нужный населённый пункт.
*/

/*
const issykKulLocations = {
  karakol: {
    name: "Каракол",
    type: "city",
    districts: [
      "Центр",
      "Восточная часть",
      "Западная часть",
      "Юго-Восток",
      "Пристань-Пржевальск",
    ],
  },

  cholponAta: {
    name: "Чолпон-Ата",
    type: "city",
    districts: ["Центр", "Прибрежная зона", "Северная часть", "Южная часть"],
  },

  balykchy: {
    name: "Балыкчы",
    type: "city",
    districts: ["Центр", "Восточная часть", "Западная часть"],
  },

  // Северный берег
  bosterI: {
    name: "Бостери",
    type: "village",
  },

  baktyuDolonotu: {
    name: "Бактуу-Долоноту",
    type: "village",
  },

  tamchy: {
    name: "Тамчы",
    type: "village",
  },

  chokTal: {
    name: "Чок-Тал",
    type: "village",
  },

  koshKol: {
    name: "Кош-Көл",
    type: "village",
  },

  chonSaryOy: {
    name: "Чон-Сары-Ой",
    type: "village",
  },

  saryOy: {
    name: "Сары-Ой",
    type: "village",
  },

  grigorievka: {
    name: "Григорьевка",
    type: "village",
  },

  semenovka: {
    name: "Семёновка",
    type: "village",
  },

  ananyevo: {
    name: "Ананьево",
    type: "village",
  },

  tyup: {
    name: "Тюп",
    type: "village",
  },

  akSuu: {
    name: "Ак-Суу",
    type: "village",
  },

  teploklyuchenka: {
    name: "Теплоключенка",
    type: "village",
  },

  // Южный берег
  kyzylSuu: {
    name: "Кызыл-Суу",
    type: "village",
  },

  jetiOguz: {
    name: "Джети-Огуз",
    type: "village",
  },

  barksoon: {
    name: "Барскоон",
    type: "village",
  },

  tamga: {
    name: "Тамга",
    type: "village",
  },

  tosor: {
    name: "Тосор",
    type: "village",
  },

  bokonbaevo: {
    name: "Боконбаево",
    type: "village",
  },

  kadjiSai: {
    name: "Каджи-Сай",
    type: "village",
  },

  sasanovka: {
    name: "Сазановка",
    type: "village",
  },

  chychkan: {
    name: "Чычкан",
    type: "village",
  },

  orgochoR: {
    name: "Оргочор",
    type: "village",
  },

  keregeTash: {
    name: "Кереге-Таш",
    type: "village",
  },

  korumdu: {
    name: "Корумду",
    type: "village",
  },

  bulanSogottu: {
    name: "Булан-Сөгөттү",
    type: "village",
  },
};
*/

const fallbackIssykKulLocations = {
  karakol: {
    name: "Каракол",
    type: "city",
    districts: [
      "Центр",
      "Восточная часть",
      "Западная часть",
      "Юго-Восток",
      "Пристань-Пржевальск",
    ],
  },

  cholponAta: {
    name: "Чолпон-Ата",
    type: "city",
    districts: ["Центр", "Прибрежная зона", "Северная часть", "Южная часть"],
  },

  balykchy: {
    name: "Балыкчы",
    type: "city",
    districts: ["Центр", "Восточная часть", "Западная часть"],
  },

  // Северный берег
  bosterI: {
    name: "Бостери",
    type: "village",
  },

  baktyuDolonotu: {
    name: "Бактуу-Долоноту",
    type: "village",
  },

  tamchy: {
    name: "Тамчы",
    type: "village",
  },

  chokTal: {
    name: "Чок-Тал",
    type: "village",
  },

  koshKol: {
    name: "Кош-Көл",
    type: "village",
  },

  chonSaryOy: {
    name: "Чон-Сары-Ой",
    type: "village",
  },

  saryOy: {
    name: "Сары-Ой",
    type: "village",
  },

  grigorievka: {
    name: "Григорьевка",
    type: "village",
  },

  semenovka: {
    name: "Семёновка",
    type: "village",
  },

  ananyevo: {
    name: "Ананьево",
    type: "village",
  },

  tyup: {
    name: "Тюп",
    type: "village",
  },

  akSuu: {
    name: "Ак-Суу",
    type: "village",
  },

  teploklyuchenka: {
    name: "Теплоключенка",
    type: "village",
  },

  // Южный берег
  kyzylSuu: {
    name: "Кызыл-Суу",
    type: "village",
  },

  jetiOguz: {
    name: "Джети-Огуз",
    type: "village",
  },

  barksoon: {
    name: "Барскоон",
    type: "village",
  },

  tamga: {
    name: "Тамга",
    type: "village",
  },

  tosor: {
    name: "Тосор",
    type: "village",
  },

  bokonbaevo: {
    name: "Боконбаево",
    type: "village",
  },

  kadjiSai: {
    name: "Каджи-Сай",
    type: "village",
  },

  sasanovka: {
    name: "Сазановка",
    type: "village",
  },

  chychkan: {
    name: "Чычкан",
    type: "village",
  },

  orgochoR: {
    name: "Оргочор",
    type: "village",
  },

  keregeTash: {
    name: "Кереге-Таш",
    type: "village",
  },

  korumdu: {
    name: "Корумду",
    type: "village",
  },

  bulanSogottu: {
    name: "Булан-Сөгөттү",
    type: "village",
  },
};

export default function StepLocation({ form, updateForm, onNext }) {
  const [locationsData, setLocationsData] = useState(null);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    getConstants()
      .then((data) => {
        if (data && data.locationsByRegion && data.locationsByRegion.ISSYK_KUL) {
          const apiIssykKul = data.locationsByRegion.ISSYK_KUL;
          const merged = {};

          apiIssykKul.forEach((name) => {
            const foundKeyEntry = Object.entries(fallbackIssykKulLocations).find(
              ([, item]) => item.name === name || item.name.toLowerCase() === name.toLowerCase()
            );

            if (foundKeyEntry) {
              merged[foundKeyEntry[0]] = foundKeyEntry[1];
            } else {
              const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
              merged[key || name] = { name, type: "village" };
            }
          });

          Object.entries(fallbackIssykKulLocations).forEach(([key, item]) => {
            if (!merged[key]) {
              merged[key] = item;
            }
          });

          setLocationsData(merged);
        } else {
          throw new Error("No ISSYK_KUL locations returned");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch constants for Issyk-Kul", err);
        setApiError(true);
        setLocationsData(fallbackIssykKulLocations);
      });
  }, []);

  const currentLocations = locationsData || fallbackIssykKulLocations;

  const selectedLocation = currentLocations[form.location] || 
    Object.values(currentLocations).find((item) => item.name === form.location);

  const locationOptions = Object.values(currentLocations).map(
    (item) => item.name
  );

  const districtOptions = selectedLocation?.districts || [];

  function selectLocation(value) {
    const locationEntry = Object.entries(currentLocations).find(
      ([, item]) => item.name === value
    );
    const location = locationEntry ? locationEntry[0] : value;

    if (!location) return;

    updateForm({
      location,
      district: "",
    });
  }

  function selectDistrict(value) {
    updateForm({
      district: value,
    });
  }

  const needsDistrict = selectedLocation?.districts?.length > 0;

  const canContinue =
    Boolean(form.location) && (!needsDistrict || Boolean(form.district));

  const locationName = selectedLocation?.name || "";

  return (
    <div className={styles.step}>
      {/* =========================
          HEADER
      ========================= */}

      <div className={styles.header}>
        <div className={styles.stepBadge}>
          <span className={styles.stepDot} />
          Шаг 1 из 5
        </div>

        <h1>Где находится недвижимость?</h1>

        <p>
          Выберите населённый пункт на Иссык-Куле. Если для выбранного города
          доступен район, укажите его дополнительно.
        </p>
      </div>

      {apiError && (
        <div style={{ color: "#e53e3e", background: "#fed7d7", padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "14px" }}>
          Не удалось загрузить актуальный справочник локаций. Попробуйте обновить страницу.
        </div>
      )}

      {/* =========================
          LOCATION
      ========================= */}

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon}>
            <Waves size={20} />
          </div>

          <div>
            <label>Иссык-Куль</label>

            <span>Город или населённый пункт</span>
          </div>
        </div>

        <div className={styles.locationSelect}>
          <CustomSelect
            title="Населённый пункт"
            value={locationName}
            setValue={selectLocation}
            options={locationOptions}
          />
        </div>
      </div>

      {/* =========================
          DISTRICT
      ========================= */}

      {needsDistrict && (
        <div className={styles.locationFields}>
          <div className={styles.grid}>
            <CustomSelect
              title="Район"
              value={form.district || ""}
              setValue={selectDistrict}
              options={districtOptions}
            />
          </div>
        </div>
      )}

      {/* =========================
          SELECTED LOCATION
      ========================= */}

      {canContinue && (
        <div className={styles.locationReady}>
          <div className={styles.readyIcon}>
            <MapPin size={18} />
          </div>

          <div className={styles.readyContent}>
            <strong>Местоположение выбрано</strong>

            <span>
              {form.district
                ? `${locationName} · ${form.district}`
                : locationName}
            </span>
          </div>

          <div className={styles.readyCheck}>
            <Check size={15} />
          </div>
        </div>
      )}

      {/* =========================
          ACTION
      ========================= */}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          disabled={!canContinue}
          onClick={onNext}
        >
          <span>Продолжить</span>

          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
