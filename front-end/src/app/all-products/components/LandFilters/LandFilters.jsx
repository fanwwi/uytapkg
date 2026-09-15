"use client";

import {
  Map,
  Fence,
  FileText,
  CreditCard,
  Mountain,
  Clock3,
} from "lucide-react";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./LandFilters.module.css";

/* =========================================================
   OPTIONS
========================================================= */

const purposes = [
  "Любое",
  "ИЖС",
  "ЛПХ",
  "Коммерческое",
  "Сельхозназначение",
  "Многоэтажное строительство",
  "Другое",
];

const fence = ["Любой", "Есть", "Нет", "Частично"];

const documents = [
  "Любые",
  "Красная книга",
  "Техпаспорт",
  "Договор купли-продажи",
  "Договор долевого участия",
  "Акт приема-передачи",
];

const offerTypes = [
  "Любой",
  "Наличный расчет",
  "Ипотека",
  "Рассрочка",
  "Возможен обмен",
];

const locations = [
  "Любое",
  "В городе",
  "В пригороде",
  "За городом",
  "У трассы",
  "В центре",
];

const terrains = ["Любой", "Ровный", "С уклоном", "Горный", "Холмистый"];

const rentalPeriods = ["По часам", "Посуточно", "Помесячно", "На долгий срок"];

const communications = [
  "Электричество",
  "Газ",
  "Вода",
  "Канализация",
  "Интернет",
  "Отопление",
];

const amenities = [
  "Подъездная дорога",
  "Огороженная территория",
  "Сад",
  "Плодовые деревья",
  "Вид на горы",
];

/* =========================================================
   TRANSLATION KEYS
========================================================= */

const optionKeys = {
  purposes: {
    Любое: "any",
    ИЖС: "individualHousing",
    ЛПХ: "privateSubsidiary",
    Коммерческое: "commercial",
    Сельхозназначение: "agricultural",
    "Многоэтажное строительство": "multiStoreyConstruction",
    Другое: "other",
  },

  fence: {
    Любой: "any",
    Есть: "yes",
    Нет: "no",
    Частично: "partially",
  },

  documents: {
    Любые: "any",
    "Красная книга": "redBook",
    Техпаспорт: "technicalPassport",
    "Договор купли-продажи": "saleContract",
    "Договор долевого участия": "equityParticipation",
    "Акт приема-передачи": "acceptanceAct",
  },

  offerTypes: {
    Любой: "any",
    "Наличный расчет": "cash",
    Ипотека: "mortgage",
    Рассрочка: "installment",
    "Возможен обмен": "exchange",
  },

  locations: {
    Любое: "any",
    "В городе": "inCity",
    "В пригороде": "suburb",
    "За городом": "outsideCity",
    "У трассы": "nearHighway",
    "В центре": "inCenter",
  },

  terrains: {
    Любой: "any",
    Ровный: "flat",
    "С уклоном": "sloped",
    Горный: "mountainous",
    Холмистый: "hilly",
  },

  rentalPeriods: {
    "По часам": "hourly",
    Посуточно: "daily",
    Помесячно: "monthly",
    "На долгий срок": "longTerm",
  },

  communications: {
    Электричество: "electricity",
    Газ: "gas",
    Вода: "water",
    Канализация: "sewerage",
    Интернет: "internet",
    Отопление: "heating",
  },

  amenities: {
    "Подъездная дорога": "accessRoad",
    "Огороженная территория": "fencedArea",
    Сад: "garden",
    "Плодовые деревья": "fruitTrees",
    "Вид на горы": "mountainView",
  },
};

/* =========================================================
   HELPERS
========================================================= */

function translateOptions(options, group, t) {
  return options.map((value) => {
    const key = optionKeys[group]?.[value];

    if (!key) {
      return {
        value,
        label: value,
      };
    }

    return {
      value,
      label: t(`landFilters.options.${group}.${key}`),
    };
  });
}

/* =========================================================
   COMPONENT
========================================================= */

export default function LandFilters({ filters, updateFilter }) {
  const { t } = useLanguage();

  const isRent = filters.dealType === "rent";

  const translatedPurposes = translateOptions(purposes, "purposes", t);

  const translatedFence = translateOptions(fence, "fence", t);

  const translatedDocuments = translateOptions(documents, "documents", t);

  const translatedOfferTypes = translateOptions(offerTypes, "offerTypes", t);

  const translatedLocations = translateOptions(locations, "locations", t);

  const translatedTerrains = translateOptions(terrains, "terrains", t);

  const translatedRentalPeriods = translateOptions(
    rentalPeriods,
    "rentalPeriods",
    t,
  );

  const translatedCommunications = translateOptions(
    communications,
    "communications",
    t,
  );

  const translatedAmenities = translateOptions(amenities, "amenities", t);

  return (
    <div className={styles.grid}>
      <MultiSelect
        icon={Map}
        title={t("landFilters.titles.purpose")}
        options={translatedPurposes}
        value={filters.purpose || []}
        setValue={(value) => updateFilter("purpose", value)}
      />

      <MultiSelect
        icon={Fence}
        title={t("landFilters.titles.fence")}
        options={translatedFence}
        value={filters.fence || []}
        setValue={(value) => updateFilter("fence", value)}
      />

      <MultiSelect
        icon={Map}
        title={t("landFilters.titles.location")}
        options={translatedLocations}
        value={filters.location || []}
        setValue={(value) => updateFilter("location", value)}
      />

      <MultiSelect
        icon={Mountain}
        title={t("landFilters.titles.terrain")}
        options={translatedTerrains}
        value={filters.terrain || []}
        setValue={(value) => updateFilter("terrain", value)}
      />

      {!isRent && (
        <>
          <MultiSelect
            icon={FileText}
            title={t("landFilters.titles.documents")}
            options={translatedDocuments}
            value={filters.documents || []}
            setValue={(value) => updateFilter("documents", value)}
          />

          <MultiSelect
            icon={CreditCard}
            title={t("landFilters.titles.payment")}
            options={translatedOfferTypes}
            value={filters.offerType || []}
            setValue={(value) => updateFilter("offerType", value)}
          />
        </>
      )}

      {isRent && (
        <MultiSelect
          icon={Clock3}
          title={t("landFilters.titles.rentalPeriod")}
          options={translatedRentalPeriods}
          value={filters.rentalPeriod || []}
          setValue={(value) => updateFilter("rentalPeriod", value)}
        />
      )}

      <div className={styles.full}>
        <MultiSelect
          icon={Map}
          title={t("landFilters.titles.communications")}
          options={translatedCommunications}
          value={filters.communications || []}
          setValue={(value) => updateFilter("communications", value)}
        />
      </div>

      <div className={styles.full}>
        <MultiSelect
          icon={Map}
          title={t("landFilters.titles.amenities")}
          options={translatedAmenities}
          value={filters.amenities || []}
          setValue={(value) => updateFilter("amenities", value)}
        />
      </div>
    </div>
  );
}
