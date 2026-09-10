"use client";

import Image from "next/image";

import {
  Home,
  Building2,
  Ruler,
  BedDouble,
  UserRound,
  Phone,
  ShieldCheck,
  Tag,
  Layers3,
  Flame,
  CarFront,
  Zap,
  Droplets,
  FileCheck,
  MapPin,
  Bath,
  Sofa,
  CheckCircle2,
  DoorOpen,
  Compass,
  LandPlot,
  Store,
  Map,
  PawPrint,
  CircleDollarSign,
  Waves,
  CalendarDays,
  Trees,
  Maximize,
  Building,
  CircleCheck,
} from "lucide-react";

import styles from "./ProductInfo.module.css";

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function normalize(value) {
  if (value === null || value === undefined) return "";

  return String(value).trim().toLowerCase().replace(/ё/g, "е");
}

function hasValue(value) {
  if (value === null || value === undefined) return false;

  if (typeof value === "string") {
    return value.trim() !== "";
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

/*
|--------------------------------------------------------------------------
| RAW VALUE
|--------------------------------------------------------------------------
*/

function getRawValue(product, ...keys) {
  const raw = product?.rawFeatures || {};

  for (const key of keys) {
    if (hasValue(raw[key])) {
      return raw[key];
    }

    if (hasValue(product?.[key])) {
      return product[key];
    }
  }

  return null;
}

/*
|--------------------------------------------------------------------------
| FORMAT
|--------------------------------------------------------------------------
*/

function formatValue(value) {
  if (!hasValue(value)) {
    return null;
  }

  if (typeof value === "boolean") {
    return value ? "Да" : "Нет";
  }

  if (Array.isArray(value)) {
    const values = value
      .filter((item) => hasValue(item))
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return (
            item.name ||
            item.title ||
            item.label ||
            item.value ||
            JSON.stringify(item)
          );
        }

        return String(item);
      })
      .map((item) => String(item).trim())
      .filter(Boolean);

    return values.length ? values.join(", ") : null;
  }

  if (typeof value === "object" && value !== null) {
    if (value.name) return String(value.name);
    if (value.title) return String(value.title);
    if (value.label) return String(value.label);
    if (value.value !== undefined) return formatValue(value.value);

    const entries = Object.entries(value)
      .filter(([, item]) => hasValue(item))
      .map(([key, item]) => {
        return `${formatFieldLabel(key)}: ${formatValue(item)}`;
      });

    return entries.length ? entries.join(", ") : null;
  }

  return String(value).trim();
}

function formatDistance(value) {
  const formatted = formatValue(value);

  if (!formatted) return null;

  if (
    formatted.includes("м") ||
    formatted.includes("км") ||
    formatted.includes("метр")
  ) {
    return formatted;
  }

  return `${formatted} м`;
}

function formatHeight(value) {
  const formatted = formatValue(value);

  if (!formatted) return null;

  if (formatted.includes("м")) {
    return formatted;
  }

  return `${formatted} м`;
}

function formatArea(value, land = false) {
  const formatted = formatValue(value);

  if (!formatted) return null;

  if (
    formatted.includes("м²") ||
    formatted.includes("м2") ||
    formatted.includes("сот")
  ) {
    return formatted;
  }

  return land ? `${formatted} сот.` : `${formatted} м²`;
}

/*
|--------------------------------------------------------------------------
| FIELD LABELS
|--------------------------------------------------------------------------
*/

const FIELD_LABELS = {
  type: "Тип объекта",
  category: "Категория",

  property_type: "Тип недвижимости",
  propertyType: "Тип недвижимости",

  residentialComplex: "Жилой комплекс",
  residential_complex: "Жилой комплекс",
  residentialComplexName: "Жилой комплекс",
  residential_complex_name: "Жилой комплекс",
  complex: "Жилой комплекс",
  complexName: "Жилой комплекс",
  complex_name: "Жилой комплекс",
  zhk: "Жилой комплекс",
  zhkName: "Жилой комплекс",

  developer: "Застройщик",
  developerName: "Застройщик",
  developer_name: "Застройщик",
  developerOrComplex: "Застройщик / ЖК",
  developer_or_complex: "Застройщик / ЖК",

  series: "Серия / тип",
  apartmentSeries: "Серия / тип",
  apartment_series: "Серия / тип",

  rooms: "Количество комнат",
  roomCount: "Количество комнат",
  room_count: "Количество комнат",

  area: "Площадь",
  totalArea: "Общая площадь",
  total_area: "Общая площадь",

  landArea: "Площадь участка",
  land_area: "Площадь участка",
  areaSotka: "Площадь участка",
  area_sotka: "Площадь участка",
  plotArea: "Площадь участка",
  plot_area: "Площадь участка",

  floor: "Этаж",
  currentFloor: "Этаж",
  current_floor: "Этаж",

  floors: "Этажность",
  totalFloors: "Этажность",
  total_floors: "Этажность",

  condition: "Состояние",
  repair: "Ремонт",

  walls: "Материал стен",
  wallMaterial: "Материал стен",
  wall_material: "Материал стен",

  heating: "Отопление",
  sewerage: "Канализация",
  water: "Вода",
  electricity: "Электричество",
  gas: "Газ",

  documents: "Документы",
  furniture: "Мебель",

  bathroom: "Санузел",
  bathrooms: "Количество санузлов",
  bathroomCount: "Количество санузлов",
  bathroom_count: "Количество санузлов",
  privateBathroom: "Свой санузел",
  private_bathroom: "Свой санузел",

  ceilingHeight: "Высота потолков",
  ceiling_height: "Высота потолков",

  parking: "Парковка",
  parkingType: "Тип парковки",
  parking_type: "Тип парковки",

  view: "Вид из окон",
  orientation: "Ориентация",

  purpose: "Назначение",
  fence: "Забор",
  terrain: "Рельеф",
  communications: "Коммуникации",
  landLocation: "Расположение участка",
  land_location: "Расположение участка",

  houseType: "Тип дома",
  house_type: "Тип дома",

  roomsInApartment: "Комнат в квартире",
  rooms_in_apartment: "Комнат в квартире",

  roomLocation: "Расположение комнаты",
  room_location: "Расположение комнаты",

  premisesType: "Тип помещения",
  premises_type: "Тип помещения",

  technicalParameters: "Технические параметры",
  technical_parameters: "Технические параметры",

  firstLine: "Первая линия",
  first_line: "Первая линия",

  separateEntrance: "Отдельный вход",
  separate_entrance: "Отдельный вход",

  rentalBusiness: "Готовый арендный бизнес",
  rental_business: "Готовый арендный бизнес",

  material: "Материал",

  gates: "Ворота",
  gateType: "Тип ворот",
  gate_type: "Тип ворот",

  truckAccess: "Заезд грузового авто",
  truck_access: "Заезд грузового авто",

  offerType: "Тип предложения",
  offer_type: "Тип предложения",

  pets: "Можно с животными",

  construction: "Тип строительства",
  constructionType: "Тип строительства",
  construction_type: "Тип строительства",

  developerOrComplex: "Застройщик / ЖК",

  beachDistance: "До пляжа",
  beach_distance: "До пляжа",

  entrances: "Количество подъездов",
  entranceCount: "Количество подъездов",
  entrance_count: "Количество подъездов",

  yardArea: "Площадь двора",
  yard_area: "Площадь двора",

  landWidth: "Ширина участка",
  land_width: "Ширина участка",

  landLength: "Длина участка",
  land_length: "Длина участка",

  dealType: "Тип сделки",
  deal_type: "Тип сделки",

  rentalPeriod: "Период аренды",
  rental_period: "Период аренды",

  amenities: "Удобства",

  country: "Страна",
  region: "Регион",
  city: "Город",
  settlement: "Населённый пункт",
  district: "Район",
  address: "Адрес",
};

/*
|--------------------------------------------------------------------------
| FIELD LABEL
|--------------------------------------------------------------------------
*/

function formatFieldLabel(key) {
  if (!key) return "";

  if (FIELD_LABELS[key]) {
    return FIELD_LABELS[key];
  }

  return String(key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

/*
|--------------------------------------------------------------------------
| FIELD ICON
|--------------------------------------------------------------------------
*/

function getFieldIcon(key) {
  const normalized = normalize(key);

  if (
    normalized.includes("complex") ||
    normalized.includes("zhk") ||
    normalized.includes("developer")
  ) {
    return Building2;
  }

  if (normalized.includes("room")) {
    return BedDouble;
  }

  if (
    normalized.includes("area") ||
    normalized.includes("square") ||
    normalized.includes("площад")
  ) {
    return Ruler;
  }

  if (normalized.includes("floor")) {
    return Layers3;
  }

  if (normalized.includes("heating") || normalized.includes("отоп")) {
    return Flame;
  }

  if (
    normalized.includes("water") ||
    normalized.includes("вода") ||
    normalized.includes("sewer")
  ) {
    return Droplets;
  }

  if (normalized.includes("electric") || normalized.includes("электр")) {
    return Zap;
  }

  if (normalized.includes("document")) {
    return FileCheck;
  }

  if (normalized.includes("parking") || normalized.includes("garage")) {
    return CarFront;
  }

  if (normalized.includes("bath") || normalized.includes("сануз")) {
    return Bath;
  }

  if (normalized.includes("furniture") || normalized.includes("мебел")) {
    return Sofa;
  }

  if (normalized.includes("wall") || normalized.includes("material")) {
    return Building2;
  }

  if (normalized.includes("house") || normalized.includes("дом")) {
    return Home;
  }

  if (normalized.includes("land") || normalized.includes("участ")) {
    return LandPlot;
  }

  if (normalized.includes("entrance") || normalized.includes("вход")) {
    return DoorOpen;
  }

  if (normalized.includes("view") || normalized.includes("orientation")) {
    return Compass;
  }

  if (normalized.includes("beach") || normalized.includes("пляж")) {
    return Waves;
  }

  if (normalized.includes("pet") || normalized.includes("живот")) {
    return PawPrint;
  }

  if (normalized.includes("offer") || normalized.includes("deal")) {
    return CircleDollarSign;
  }

  return Tag;
}

/*
|--------------------------------------------------------------------------
| CATEGORY
|--------------------------------------------------------------------------
*/

function getCategoryKey(product) {
  const rawCategory = normalize(
    getRawValue(product, "property_type", "propertyType", "category", "type"),
  );

  if (rawCategory.includes("квартир")) {
    return "apartment";
  }

  if (rawCategory.includes("коттедж")) {
    return "cottage";
  }

  if (rawCategory.includes("дом") || rawCategory.includes("особняк")) {
    return "house";
  }

  if (rawCategory.includes("участ") || rawCategory.includes("зем")) {
    return "land";
  }

  if (rawCategory.includes("комнат") || rawCategory.includes("комната")) {
    return "room";
  }

  if (
    rawCategory.includes("коммерц") ||
    rawCategory.includes("офис") ||
    rawCategory.includes("магазин")
  ) {
    return "commercial";
  }

  if (rawCategory.includes("паркинг") || rawCategory.includes("гараж")) {
    return "parking";
  }

  return "apartment";
}

/*
|--------------------------------------------------------------------------
| CATEGORY CONFIG
|--------------------------------------------------------------------------
*/

const CATEGORY_CONFIG = {
  apartment: [
    ["series", "Серия / тип", Tag],
    ["rooms", "Количество комнат", BedDouble],
    ["area", "Площадь", Ruler],
    ["floor", "Этаж", Layers3],
    ["floors", "Этажность", Layers3],
    ["condition", "Состояние", Home],
    ["walls", "Материал стен", Building2],
    ["heating", "Отопление", Flame],
    ["furniture", "Мебель", Sofa],
    ["bathroom", "Санузел", Bath],
    ["bathrooms", "Количество санузлов", Bath],
    ["ceilingHeight", "Высота потолков", Ruler],
    ["view", "Вид из окон", Compass],
    ["orientation", "Ориентация", Compass],
    ["parking", "Парковка", CarFront],
    ["documents", "Документы", FileCheck],
    ["offerType", "Тип предложения", CircleDollarSign],
  ],

  house: [
    ["houseType", "Тип дома", Home],
    ["area", "Площадь", Ruler],
    ["landArea", "Площадь участка", LandPlot],
    ["floors", "Этажность", Layers3],
    ["rooms", "Количество комнат", BedDouble],
    ["heating", "Отопление", Flame],
    ["sewerage", "Канализация", Droplets],
    ["water", "Вода", Droplets],
    ["electricity", "Электричество", Zap],
    ["gas", "Газ", Flame],
    ["bathrooms", "Количество санузлов", Bath],
    ["parking", "Парковка", CarFront],
    ["documents", "Документы", FileCheck],
    ["offerType", "Тип предложения", CircleDollarSign],
  ],

  cottage: [
    ["houseType", "Тип объекта", Home],
    ["area", "Площадь", Ruler],
    ["landArea", "Площадь участка", LandPlot],
    ["floors", "Этажность", Layers3],
    ["rooms", "Количество комнат", BedDouble],
    ["heating", "Отопление", Flame],
    ["sewerage", "Канализация", Droplets],
    ["water", "Вода", Droplets],
    ["electricity", "Электричество", Zap],
    ["gas", "Газ", Flame],
    ["bathrooms", "Количество санузлов", Bath],
    ["parking", "Парковка", CarFront],
    ["documents", "Документы", FileCheck],
    ["offerType", "Тип предложения", CircleDollarSign],
  ],

  land: [
    ["purpose", "Назначение", Map],
    ["landArea", "Площадь участка", LandPlot],
    ["fence", "Забор", LandPlot],
    ["landLocation", "Расположение", MapPin],
    ["terrain", "Рельеф", Compass],
    ["communications", "Коммуникации", Zap],
    ["water", "Вода", Droplets],
    ["electricity", "Электричество", Zap],
    ["gas", "Газ", Flame],
    ["documents", "Документы", FileCheck],
    ["offerType", "Тип предложения", CircleDollarSign],
  ],

  room: [
    ["roomLocation", "Расположение комнаты", MapPin],
    ["area", "Площадь", Ruler],
    ["roomsInApartment", "Комнат в квартире", BedDouble],
    ["floor", "Этаж", Layers3],
    ["floors", "Этажность", Layers3],
    ["condition", "Состояние", Home],
    ["walls", "Материал стен", Building2],
    ["heating", "Отопление", Flame],
    ["privateBathroom", "Свой санузел", Bath],
    ["furniture", "Мебель", Sofa],
    ["documents", "Документы", FileCheck],
    ["offerType", "Тип предложения", CircleDollarSign],
  ],

  commercial: [
    ["area", "Площадь", Ruler],
    ["floor", "Этаж", Layers3],
    ["condition", "Состояние", Home],
    ["walls", "Материал стен", Building2],
    ["heating", "Отопление", Flame],
    ["premisesType", "Тип помещения", Store],
    ["technicalParameters", "Технические параметры", Tag],
    ["firstLine", "Первая линия", Store],
    ["separateEntrance", "Отдельный вход", DoorOpen],
    ["rentalBusiness", "Готовый арендный бизнес", Store],
    ["parking", "Парковка", CarFront],
    ["documents", "Документы", FileCheck],
    ["offerType", "Тип предложения", CircleDollarSign],
  ],

  parking: [
    ["area", "Площадь", Ruler],
    ["ceilingHeight", "Высота потолков", Ruler],
    ["parkingType", "Тип парковки", CarFront],
    ["material", "Материал", Building2],
    ["gates", "Ворота", DoorOpen],
    ["truckAccess", "Для грузового авто", CarFront],
    ["gateType", "Тип ворот", DoorOpen],
    ["documents", "Документы", FileCheck],
    ["offerType", "Тип предложения", CircleDollarSign],
  ],
};

/*
|--------------------------------------------------------------------------
| SERIES
|--------------------------------------------------------------------------
*/

function formatSeries(value) {
  if (!value) return null;

  const normalized = normalize(value);

  const labels = {
    "106_normal": "106 обычная",
    "106_improved": "106 улучшенная",
    "107_normal": "107 обычная",
    "107_improved": "107 улучшенная",

    "106_обычная": "106 обычная",
    "106_улучшенная": "106 улучшенная",
    "107_обычная": "107 обычная",
    "107_улучшенная": "107 улучшенная",

    new_building: "Новостройка",
    newbuilding: "Новостройка",

    elite: "Элитка",
    элитка: "Элитка",

    individual: "Индивидуалка",
    individualka: "Индивидуалка",
    индивидуалка: "Индивидуалка",

    сталинка: "Сталинка",
    хрущевка: "Хрущевка",
    пентхаус: "Пентхаус",
  };

  return (
    labels[normalized] ||
    labels[normalized.replace(/\s+/g, "_")] ||
    String(value).trim()
  );
}

/*
|--------------------------------------------------------------------------
| RENT
|--------------------------------------------------------------------------
*/

function isRent(product) {
  const dealType = normalize(getRawValue(product, "dealType", "deal_type"));

  return (
    dealType.includes("аренд") ||
    dealType.includes("сним") ||
    dealType === "rent"
  );
}

/*
|--------------------------------------------------------------------------
| CHARACTERISTICS
|--------------------------------------------------------------------------
*/

function buildCharacteristics(product) {
  const categoryKey = getCategoryKey(product);
  const config = CATEGORY_CONFIG[categoryKey] || [];

  const rent = isRent(product);

  const result = [];
  const usedKeys = new Set();

  const addCharacteristic = (key, label, Icon, value) => {
    if (!hasValue(value)) return;

    const formatted = formatValue(value);

    if (!formatted) return;

    if (usedKeys.has(key)) return;

    usedKeys.add(key);

    result.push({
      key,
      label,
      value: formatted,
      icon: Icon || getFieldIcon(key),
    });
  };

  /*
   * --------------------------------------------------------
   * CATEGORY FIELDS
   * --------------------------------------------------------
   */

  for (const [key, label, Icon] of config) {
    if (rent && (key === "documents" || key === "offerType")) {
      continue;
    }

    let value = getRawValue(product, key);

    if (!hasValue(value)) {
      continue;
    }

    if (key === "series") {
      value = formatSeries(value);
    }

    if (key === "ceilingHeight") {
      value = formatHeight(value);
    }

    if (key === "area") {
      value = formatArea(value);
    }

    if (key === "landArea" || key === "areaSotka" || key === "plotArea") {
      value = formatArea(value, true);
    }

    addCharacteristic(key, label, Icon, value);
  }

  /*
   * --------------------------------------------------------
   * RESIDENTIAL COMPLEX
   * --------------------------------------------------------
   */

  const complex = getRawValue(
    product,
    "residentialComplex",
    "residential_complex",
    "residentialComplexName",
    "residential_complex_name",
    "complex",
    "complexName",
    "complex_name",
    "zhk",
    "zhkName",
  );

  if (hasValue(complex)) {
    result.unshift({
      key: "residentialComplex",
      label: "Жилой комплекс",
      value: formatValue(complex),
      icon: Building2,
    });

    usedKeys.add("residentialComplex");
    usedKeys.add("residential_complex");
    usedKeys.add("residentialComplexName");
    usedKeys.add("residential_complex_name");
    usedKeys.add("complex");
    usedKeys.add("complexName");
    usedKeys.add("complex_name");
    usedKeys.add("zhk");
    usedKeys.add("zhkName");
  }

  /*
   * --------------------------------------------------------
   * DEVELOPER
   * --------------------------------------------------------
   */

  const developer = getRawValue(
    product,
    "developer",
    "developerName",
    "developer_name",
  );

  if (hasValue(developer)) {
    addCharacteristic("developer", "Застройщик", Building, developer);

    usedKeys.add("developerName");
    usedKeys.add("developer_name");
  }

  /*
   * --------------------------------------------------------
   * PETS
   * --------------------------------------------------------
   */

  if (categoryKey === "apartment" && rent) {
    const pets = getRawValue(product, "pets");

    if (hasValue(pets)) {
      addCharacteristic("pets", "Можно с животными", PawPrint, pets);
    }
  }

  /*
   * --------------------------------------------------------
   * GENERIC RAW FEATURES
   *
   * Всё, что не вошло в CATEGORY_CONFIG,
   * всё равно показываем.
   * --------------------------------------------------------
   */

  const raw = product?.rawFeatures || {};

  Object.entries(raw).forEach(([key, value]) => {
    /*
     * Системные / служебные поля.
     */

    if (
      [
        "amenities",
        "images",
        "photos",
        "gallery",
        "latitude",
        "longitude",
        "lat",
        "lng",
      ].includes(key)
    ) {
      return;
    }

    /*
     * Уже показано.
     */

    if (usedKeys.has(key)) {
      return;
    }

    /*
     * Пустое значение.
     */

    if (!hasValue(value)) {
      return;
    }

    /*
     * Не показываем внутренние технические поля.
     */

    const normalizedKey = normalize(key);

    if (
      normalizedKey.startsWith("id") ||
      normalizedKey.endsWith("id") ||
      normalizedKey.includes("createdat") ||
      normalizedKey.includes("updatedat") ||
      normalizedKey.includes("deletedat")
    ) {
      return;
    }

    /*
     * Форматируем отдельные поля.
     */

    let formattedValue = value;

    if (
      key === "series" ||
      key === "apartmentSeries" ||
      key === "apartment_series"
    ) {
      formattedValue = formatSeries(value);
    }

    if (key === "ceilingHeight" || key === "ceiling_height") {
      formattedValue = formatHeight(value);
    }

    if (key === "area" || key === "totalArea" || key === "total_area") {
      formattedValue = formatArea(value);
    }

    if (
      key === "landArea" ||
      key === "land_area" ||
      key === "areaSotka" ||
      key === "area_sotka" ||
      key === "plotArea" ||
      key === "plot_area"
    ) {
      formattedValue = formatArea(value, true);
    }

    addCharacteristic(
      key,
      formatFieldLabel(key),
      getFieldIcon(key),
      formattedValue,
    );
  });

  return result;
}

/*
|--------------------------------------------------------------------------
| AMENITIES
|--------------------------------------------------------------------------
*/

function getAmenities(product) {
  const raw = product?.rawFeatures || {};

  const value =
    raw.amenities ?? product?.amenities ?? raw.features ?? product?.features;

  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return item.name || item.title || item.label || item.value || null;
        }

        return String(item);
      })
      .filter(Boolean);
  }

  if (hasValue(value)) {
    return [String(value)];
  }

  return [];
}

/*
|--------------------------------------------------------------------------
| LOCATION
|--------------------------------------------------------------------------
*/

function getLocationParts(product) {
  const values = [
    getRawValue(product, "country"),
    getRawValue(product, "region"),
    getRawValue(product, "city"),
    getRawValue(product, "settlement"),
    getRawValue(product, "district"),
  ]
    .filter(hasValue)
    .map((value) => String(value).trim())
    .filter(Boolean);

  return values.filter(
    (value, index, array) =>
      array.findIndex((item) => normalize(item) === normalize(value)) === index,
  );
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function ProductInfo({ product, router }) {
  const characteristics = buildCharacteristics(product);

  const amenities = getAmenities(product);

  const locationParts = getLocationParts(product);

  const beachDistance = getRawValue(product, "beachDistance", "beach_distance");

  const category = getRawValue(product, "category");

  const type = getRawValue(product, "type", "propertyType", "property_type");

  const dealType = getRawValue(product, "dealType", "deal_type");

  const rentalPeriod = getRawValue(product, "rentalPeriod", "rental_period");

  const listingType = getRawValue(product, "listingType", "listing_type");

  const createdAt = getRawValue(product, "createdAt", "created_at");

  return (
    <div className={styles.contentGrid}>
      <div className={styles.mainContent}>
        {/* DESCRIPTION */}

        {(product.description || product.title) && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Home />
              </div>

              <div>
                <span>ОБ ОБЪЕКТЕ</span>
                <h2>Описание</h2>
              </div>
            </div>

            <p className={styles.description}>
              {product.description || "Описание объекта не указано."}
            </p>
          </section>
        )}

        {/* CHARACTERISTICS */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Building2 />
            </div>

            <div>
              <span>ПОДРОБНОСТИ</span>
              <h2>Характеристики объекта</h2>
            </div>
          </div>

          {characteristics.length > 0 ? (
            <div className={styles.characteristics}>
              {characteristics.map((item) => {
                const Icon = item.icon;

                return (
                  <div className={styles.characteristic} key={item.key}>
                    <div className={styles.characteristicIcon}>
                      <Icon size={19} />
                    </div>

                    <div>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyBlock}>
              <CheckCircle2 size={20} />
              <span>Дополнительные характеристики не указаны.</span>
            </div>
          )}
        </section>

        {/* AMENITIES */}

        {amenities.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <ShieldCheck />
              </div>

              <div>
                <span>ДОПОЛНИТЕЛЬНО</span>
                <h2>Удобства</h2>
              </div>
            </div>

            <div className={styles.amenities}>
              {amenities.map((item, index) => (
                <div className={styles.amenity} key={`${item}-${index}`}>
                  <CheckCircle2 size={17} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LOCATION */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <MapPin />
            </div>

            <div>
              <span>РАСПОЛОЖЕНИЕ</span>
              <h2>Адрес объекта</h2>
            </div>
          </div>

          <div className={styles.addressCard}>
            <div className={styles.addressIcon}>
              <MapPin />
            </div>

            <div className={styles.addressContent}>
              <strong>
                {locationParts.length
                  ? locationParts.join(", ")
                  : "Местоположение не указано"}
              </strong>

              {product.address && <p>{product.address}</p>}

              {product.latitude != null && product.longitude != null && (
                <div className={styles.coordinates}>
                  <Compass size={14} />
                  Координаты объекта указаны
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* SIDEBAR */}

      <aside className={styles.sidebar}>
        {/* INFORMATION */}

        <div className={styles.sideCard}>
          <div className={styles.sideTop}>
            <Tag />
            <span>Информация</span>
          </div>

          {hasValue(category) && (
            <div className={styles.sideRow}>
              <span>Категория</span>
              <strong>{formatValue(category)}</strong>
            </div>
          )}

          {hasValue(type) && (
            <div className={styles.sideRow}>
              <span>Тип объекта</span>
              <strong>{formatValue(type)}</strong>
            </div>
          )}

          {hasValue(dealType) && (
            <div className={styles.sideRow}>
              <span>Тип сделки</span>
              <strong>{formatValue(dealType)}</strong>
            </div>
          )}

          {hasValue(rentalPeriod) && (
            <div className={styles.sideRow}>
              <span>Период аренды</span>
              <strong>{formatValue(rentalPeriod)}</strong>
            </div>
          )}

          {hasValue(listingType) && (
            <div className={styles.sideRow}>
              <span>Тип объявления</span>
              <strong>{formatValue(listingType)}</strong>
            </div>
          )}

          {hasValue(createdAt) && (
            <div className={styles.sideRow}>
              <span>Дата публикации</span>
              <strong>{formatValue(createdAt)}</strong>
            </div>
          )}

          {hasValue(beachDistance) && (
            <div className={styles.sideRow}>
              <span>До пляжа</span>
              <strong>{formatDistance(beachDistance)}</strong>
            </div>
          )}
        </div>

        {/* LOCATION */}

        {locationParts.length > 0 && (
          <div className={styles.sideCard}>
            <div className={styles.sideTop}>
              <MapPin />
              <span>Локация</span>
            </div>

            {locationParts.map((value, index) => (
              <div className={styles.sideRow} key={`${value}-${index}`}>
                <span>
                  {index === 0
                    ? "Страна"
                    : index === 1
                      ? "Регион"
                      : index === 2
                        ? "Город"
                        : index === 3
                          ? "Населённый пункт"
                          : "Район"}
                </span>

                <strong>{value}</strong>
              </div>
            ))}
          </div>
        )}

        {/* OWNER */}

        {product.owner && (
          <div className={styles.ownerSideCard}>
            <div className={styles.ownerSideHeader}>
              <UserRound />
              Владелец
            </div>

            <div className={styles.ownerSideProfile}>
              <div className={styles.ownerSideAvatar}>
                <Image
                  src={
                    product.owner.avatar || "https://i.pravatar.cc/150?img=12"
                  }
                  alt={product.owner.name || "Владелец"}
                  fill
                  sizes="55px"
                />
              </div>

              <div>
                <strong>{product.owner.name}</strong>

                <span>{product.owner.role || "Владелец объявления"}</span>
              </div>
            </div>

            {product.owner.phone && (
              <a
                href={`tel:${product.owner.phone}`}
                className={styles.phoneButton}
              >
                <Phone size={16} />
                {product.owner.phone}
              </a>
            )}

            {product.owner.id && (
              <button
                type="button"
                onClick={() =>
                  router.push(`/public-profile/${product.owner.id}`)
                }
              >
                Связаться с владельцем
              </button>
            )}
          </div>
        )}

        {/* LAWYER */}

        <div className={styles.lawyerCard}>
          <div className={styles.lawyerIcon}>
            <ShieldCheck size={22} />
          </div>

          <div className={styles.lawyerContent}>
            <strong>Проверка у юриста</strong>

            <p>
              Хотите убедиться в юридической чистоте объекта? Запросите проверку
              объявления у юриста.
            </p>
          </div>

          <button
            type="button"
            className={styles.lawyerButton}
            onClick={() => router.push("/lawyers")}
          >
            Запросить проверку
          </button>
        </div>
      </aside>
    </div>
  );
}
