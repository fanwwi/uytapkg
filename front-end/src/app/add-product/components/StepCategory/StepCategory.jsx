"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  House,
  Map,
  MapPin,
  DoorOpen,
  Store,
  CarFront,
  Tag,
  Ruler,
  ArrowLeft,
  ArrowRight,
  Pencil,
  DollarSign,
  Maximize,
  ChevronRight,
  Check,
} from "lucide-react";

import { getConstants } from "@/utils/api";

import CustomSelect from "@/components/ui/customSelect/CustomSelect";
import styles from "./StepCategory.module.css";

/* =========================================================
   ICONS
========================================================= */

const fieldIcons = {
  series: Tag,
  rooms: Building2,
  floor: Building2,
  condition: Pencil,
  walls: Building2,
  heating: Tag,
  documents: Tag,
  furniture: House,
  offerType: Tag,

  houseType: House,
  floors: Building2,
  sewerage: Tag,
  water: Tag,
  electricity: Tag,

  purpose: Map,
  fence: Tag,
  location: Map,
  terrain: Map,
  communications: Tag,

  roomsInApartment: Building2,
  privateBathroom: DoorOpen,

  premisesType: Store,
  technicalParameters: Tag,
  firstLine: Store,
  separateEntrance: DoorOpen,
  rentalBusiness: Store,

  ceilingHeight: Ruler,
  parkingType: CarFront,
  material: Building2,
  security: Tag,
  gates: DoorOpen,
  inspectionPit: Tag,
  basement: Building2,
  truckAccess: CarFront,
  gateType: DoorOpen,
};

/* =========================================================
   CATEGORY ICONS
========================================================= */

const categoryIcons = {
  apartment: Building2,
  house: House,
  cottage: House,
  land: Map,
  room: DoorOpen,
  commercial: Store,
  parking: CarFront,
};

/* =========================================================
   CATEGORIES
========================================================= */

const categories = {
  apartment: {
    title: "Квартира",
    description: "Квартиры и апартаменты",

    fields: [
      ["series", "Серия / тип"],
      ["rooms", "Количество комнат"],
      ["floor", "Этаж"],
      ["condition", "Состояние"],
      ["walls", "Материал стен"],
      ["heating", "Отопление"],
      ["documents", "Документы"],
      ["furniture", "Мебель"],
      ["offerType", "Тип предложения"],
    ],

    amenities: [
      "Балкон / лоджия",
      "Лифт",
      "Раздельный санузел",
      "Совмещенный санузел",
      "Встроенная кухня",
      "Бытовая техника",
      "Видеонаблюдение",
      "Охрана",
      "Парковка",
      "Закрытая территория",
      "Вид на горы",
      "Не угловая",
      "Не затапливалась",
      "Не сдавалась квартирантам",
      "Бронированные двери",
    ],
  },

  house: {
    title: "Дом",
    description: "Частные дома и особняки",

    fields: [
      ["houseType", "Тип дома"],
      ["floors", "Этажность"],
      ["rooms", "Количество комнат"],
      ["heating", "Отопление"],
      ["sewerage", "Канализация"],
      ["water", "Питьевая вода"],
      ["electricity", "Электричество"],
      ["documents", "Документы"],
      ["offerType", "Тип предложения"],
    ],

    amenities: [
      "Гараж",
      "Парковка",
      "Баня",
      "Сауна",
      "Бассейн",
      "Терраса",
      "Балкон",
      "Подвал",
      "Погреб",
      "Мебель",
      "Бытовая техника",
      "Охрана",
      "Видеонаблюдение",
      "Закрытая территория",
      "Сад",
      "Огород",
      "Вид на горы",
    ],
  },

  cottage: {
    title: "Коттедж",
    description: "Коттеджи и загородные дома",

    fields: [
      ["houseType", "Тип объекта"],
      ["floors", "Этажность"],
      ["rooms", "Количество комнат"],
      ["heating", "Отопление"],
      ["sewerage", "Канализация"],
      ["water", "Питьевая вода"],
      ["electricity", "Электричество"],
      ["documents", "Документы"],
      ["offerType", "Тип предложения"],
    ],

    amenities: [
      "Бассейн",
      "Сауна",
      "Баня",
      "Терраса",
      "Балкон",
      "Гараж",
      "Парковка",
      "Сад",
      "Беседка",
      "Мангал",
      "Вид на горы",
      "Первая линия",
      "Закрытая территория",
      "Охрана",
      "Видеонаблюдение",
      "Мебель",
      "Бытовая техника",
    ],
  },

  land: {
    title: "Участок",
    description: "Земельные участки",

    fields: [
      ["purpose", "Назначение"],
      ["fence", "Забор"],
      ["documents", "Документы"],
      ["offerType", "Тип предложения"],
      ["location", "Расположение"],
      ["terrain", "Рельеф"],
      ["communications", "Коммуникации"],
    ],

    amenities: [
      "Электричество",
      "Газ",
      "Вода",
      "Канализация",
      "Интернет",
      "Отопление",
      "Подъездная дорога",
      "Огороженная территория",
      "Сад",
      "Плодовые деревья",
      "Вид на горы",
    ],
  },

  room: {
    title: "Комната",
    description: "Отдельные комнаты",

    fields: [
      ["location", "Расположение"],
      ["roomsInApartment", "Комнат в квартире"],
      ["floor", "Этаж"],
      ["condition", "Состояние"],
      ["walls", "Материал стен"],
      ["heating", "Отопление"],
      ["privateBathroom", "Свой санузел"],
      ["documents", "Документы"],
      ["offerType", "Тип предложения"],
    ],

    amenities: [
      "Мебель",
      "Бытовая техника",
      "Балкон / лоджия",
      "Лифт",
      "Интернет",
      "Видеонаблюдение",
      "Охрана",
      "Парковка",
      "Закрытая территория",
      "Вид на горы",
    ],
  },

  commercial: {
    title: "Коммерция",
    description: "Офисы, магазины и другие помещения",

    fields: [
      ["floor", "Этаж"],
      ["condition", "Состояние"],
      ["walls", "Материал стен"],
      ["heating", "Отопление"],
      ["premisesType", "Тип помещения"],
      ["technicalParameters", "Технические параметры"],
      ["firstLine", "Первая линия"],
      ["separateEntrance", "Отдельный вход"],
      ["rentalBusiness", "Готовый арендный бизнес"],
      ["offerType", "Тип предложения"],
    ],

    amenities: [
      "Парковка",
      "Отдельный вход",
      "Первая линия",
      "Витринные окна",
      "Охрана",
      "Видеонаблюдение",
      "Пожарная сигнализация",
      "Кондиционер",
      "Вентиляция",
      "Интернет",
      "Мебель",
      "Готовый ремонт",
      "Грузовой вход",
      "Санузел",
    ],
  },

  parking: {
    title: "Паркинг / гараж",
    description: "Гаражи и парковочные места",

    fields: [
      ["ceilingHeight", "Высота потолков"],
      ["parkingType", "Тип парковки"],
      ["material", "Материал"],
      ["security", "Видеонаблюдение"],
      ["gates", "Ворота"],
      ["inspectionPit", "Смотровая яма"],
      ["basement", "Погреб"],
      ["electricity", "Электричество"],
      ["truckAccess", "Для грузового авто"],
      ["gateType", "Тип ворот"],
      ["documents", "Документы"],
      ["offerType", "Тип предложения"],
    ],

    amenities: [
      "Освещение",
      "Электричество",
      "Отопление",
      "Видеонаблюдение",
      "Охрана",
      "Автоматические ворота",
      "Смотровая яма",
      "Погреб",
      "Вода",
      "Удобный заезд",
    ],
  },
};

/* =========================================================
   OPTIONS
========================================================= */

const options = {
  series: [
    "Любой",
    "Новостройка",
    "102 серия",
    "104 серия",
    "105 серия",
    "106 серия",
    "Сталинка",
    "Хрущевка",
    "Элитка",
    "Пентхаус",
  ],

  rooms: ["1", "2", "3", "4+"],

  floor: ["Цоколь", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],

  condition: [
    "Любое",
    "Дизайнерский ремонт",
    "Евроремонт",
    "Косметический",
    "Под самоотделку",
    "Старый ремонт",
    "Без ремонта",
  ],

  walls: [
    "Любые",
    "Кирпич",
    "Бетон",
    "Газобетон",
    "Панельные",
    "Монолитные",
    "Монолитно-кирпичные",
    "Монолитно-каркасные",
  ],

  heating: [
    "Любое",
    "Автономное",
    "Газовое",
    "Центральное",
    "Электрическое",
    "Комбинированное",
  ],

  documents: [
    "Любые",
    "Красная книга",
    "Техпаспорт",
    "Договор купли-продажи",
    "Договор долевого участия",
    "Акт приема-передачи",
  ],

  furniture: ["Полностью меблирована", "Частично меблирована", "Без мебели"],

  offerType: [
    "Любой",
    "Наличный расчет",
    "Ипотека",
    "Рассрочка",
    "Возможен обмен",
  ],

  houseType: [
    "Любой",
    "Частный дом",
    "Особняк",
    "Коттедж",
    "Таунхаус",
    "Дача",
    "Времянка",
  ],

  floors: ["1", "2", "3", "4+"],

  sewerage: ["Любая", "Возможно подведение", "Центральная", "Септик", "Нет"],

  water: ["Любая", "Центральная", "Скважина", "Возможно подведение", "Нет"],

  electricity: ["Любое", "Есть", "Возможно подведение", "Нет"],

  purpose: [
    "ИЖС",
    "ЛПХ",
    "Коммерческое",
    "Сельхозназначение",
    "Многоэтажное строительство",
    "Другое",
  ],

  fence: ["Есть", "Нет", "Частично"],

  location: ["В городе", "В пригороде", "За городом", "У трассы", "В центре"],

  terrain: ["Ровный", "С уклоном", "Горный", "Холмистый"],

  communications: [
    "Все коммуникации",
    "Электричество",
    "Газ",
    "Вода",
    "Канализация",
    "Интернет",
    "Отопление",
    "Нет коммуникаций",
  ],

  roomsInApartment: ["1", "2", "3", "4", "5+"],

  privateBathroom: ["Есть", "Нет"],

  premisesType: [
    "Любой",
    "Офис",
    "Магазин",
    "Склад",
    "Производство",
    "Общепит",
    "Гостиница",
    "Промбаза",
  ],

  technicalParameters: [
    "Центральная канализация",
    "Трехфазное питание",
    "Приточно-вытяжная вентиляция",
    "Кондиционирование",
    "Охранная / пожарная сигнализация",
  ],

  firstLine: ["Да", "Нет", "Не важно"],

  separateEntrance: ["Да", "Нет", "Любой"],

  rentalBusiness: ["Да", "Нет", "Любой"],

  ceilingHeight: ["До 2.5 м", "2.5–3 м", "3–4 м", "4+ м"],

  parkingType: ["Подземный", "Наземный", "Многоуровневый", "Гараж", "Паркинг"],

  material: ["Кирпич", "Бетон", "Металл", "Панель", "Другое"],

  security: ["Есть", "Нет"],

  gates: ["Есть", "Нет"],

  inspectionPit: ["Есть", "Нет"],

  basement: ["Есть", "Нет"],

  truckAccess: ["Да", "Нет"],

  gateType: [
    "Распашные",
    "Секционные",
    "Откатные",
    "Роллетные",
    "Автоматические",
  ],
};

/* =========================================================
   HELPERS
========================================================= */

function getFieldOptions(field, dynamicOptions) {
  return dynamicOptions[field] || options[field] || [];
}

export default function StepCategory({ form, updateForm, onNext, onBack }) {
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    getConstants()
      .then((res) => {
        const data = res?.data || res;

        if (!data?.amenities) {
          throw new Error("No data returned");
        }

        setDynamicOptions((prev) => ({
          ...prev,
          apiAmenities: [
            ...(data.amenities.general || []),
            ...(data.amenities.resort || []),
          ],
        }));
      })
      .catch((err) => {
        console.error("Failed to fetch constants", err);
        setApiError(true);
      });
  }, []);

  /* =========================================================
     REGION
  ========================================================= */

  const isIssykKul =
    form.region === "ISSYK_KUL" ||
    form.region === "issykKul" ||
    form.region === "ISSYK-KUL" ||
    form.region === "issyk-kul";

  /* =========================================================
     CATEGORY
  ========================================================= */

  const visibleCategories = Object.entries(categories).filter(
    ([key]) => key !== "cottage" || isIssykKul,
  );

  const category = categories[form.category];
  const CategoryIcon = categoryIcons[form.category];

  const isLand = form.category === "land";

  /* =========================================================
     RESET COTTAGE
  ========================================================= */

  useEffect(() => {
    if (!isIssykKul && form.category === "cottage") {
      updateForm({
        category: "",
        beachDistance: "",
        amenities: [],
      });
    }
  }, [isIssykKul, form.category]);

  /* =========================================================
     UPDATE FIELD
  ========================================================= */

  function updateField(name, value) {
    updateForm({
      [name]: value,
    });
  }

  /* =========================================================
     CATEGORY SELECT
  ========================================================= */

  function selectCategory(key) {
    updateForm({
      category: key,
      amenities: [],
    });
  }

  /* =========================================================
     AMENITIES
  ========================================================= */

  const selectedAmenities = Array.isArray(form.amenities) ? form.amenities : [];

  const categoryAmenities = category?.amenities || [];

  function toggleAmenity(amenity) {
    const exists = selectedAmenities.includes(amenity);

    const nextAmenities = exists
      ? selectedAmenities.filter((item) => item !== amenity)
      : [...selectedAmenities, amenity];

    updateForm({
      amenities: nextAmenities,
    });
  }

  return (
    <div className={styles.step}>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className={styles.header}>
        <div className={styles.stepBadge}>
          <span className={styles.stepDot} />
          Шаг 4 из 6
        </div>

        <h1>Параметры объекта</h1>

        <p>
          Укажите основные характеристики недвижимости — это поможет покупателям
          быстрее понять, подходит ли им объект.
        </p>
      </div>

      {/* =====================================================
          API ERROR
      ===================================================== */}

      {apiError && (
        <div className={styles.apiError}>
          Не удалось загрузить дополнительные данные. Основные характеристики
          доступны.
        </div>
      )}

      {/* =====================================================
          CATEGORY
      ===================================================== */}

      {!category && (
        <div className={styles.categorySection}>
          <div className={styles.sectionTitle}>
            <div>
              <span>01</span>
              <h2>Выберите категорию</h2>
            </div>

            <p>
              {isIssykKul
                ? "Для Иссык-Куля доступны дополнительные категории."
                : "Это поможет подобрать нужные параметры."}
            </p>
          </div>

          <div className={styles.categoryGrid}>
            {visibleCategories.map(([key, item]) => {
              const Icon = categoryIcons[key];

              return (
                <button
                  type="button"
                  key={key}
                  className={`${styles.categoryCard} ${
                    key === "cottage" ? styles.cottageCard : ""
                  }`}
                  onClick={() => selectCategory(key)}
                >
                  <div className={styles.categoryIcon}>
                    <Icon size={25} strokeWidth={2.1} />
                  </div>

                  <div className={styles.categoryContent}>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>

                  <ArrowRight className={styles.categoryArrow} size={19} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================
          SELECTED CATEGORY
      ===================================================== */}

      {category && (
        <>
          <div className={styles.selectedCategory}>
            <div className={styles.selectedCategoryMain}>
              <div className={styles.selectedCategoryIcon}>
                {CategoryIcon && <CategoryIcon size={23} strokeWidth={2.1} />}
              </div>

              <div className={styles.selectedCategoryInfo}>
                <span>Вы выбрали</span>
                <strong>{category.title}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                updateForm({
                  category: "",
                  amenities: [],
                })
              }
            >
              <Pencil size={14} />
              Изменить
            </button>
          </div>

          {/* =================================================
              PRICE / AREA
          ================================================= */}

          <div className={styles.sectionBlock}>
            <div className={styles.sectionTitle}>
              <div>
                <span>02</span>
                <h2>Цена и площадь</h2>
              </div>

              <p>Основные параметры объекта</p>
            </div>

            <div className={styles.priceGrid}>
              <div className={styles.inputCard}>
                <div className={styles.inputIcon}>
                  <DollarSign size={19} />
                </div>

                <div className={styles.field}>
                  <label>Цена, $</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="Например 75 000"
                    value={form.price || ""}
                    onChange={(e) =>
                      updateForm({
                        price: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.inputCard}>
                <div className={styles.inputIcon}>
                  <Maximize size={18} />
                </div>

                <div className={styles.field}>
                  <label>Площадь, {isLand ? "соток" : "м²"}</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={isLand ? "Например 6 соток" : "Например 85 м²"}
                    value={form.area || ""}
                    onChange={(e) =>
                      updateForm({
                        area: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              ISSYK KUL — BEACH DISTANCE
          ================================================= */}

          {isIssykKul && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionTitle}>
                <div>
                  <span>03</span>
                  <h2>Расстояние до пляжа</h2>
                </div>

                <p>
                  Укажите примерное расстояние от объекта до ближайшего пляжа
                </p>
              </div>

              <div className={styles.beachDistanceGrid}>
                <div className={styles.inputCard}>
                  <div className={styles.inputIcon}>
                    <MapPin size={19} />
                  </div>

                  <div className={styles.field}>
                    <label>Расстояние до пляжа, м</label>

                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Например 300"
                      value={form.beachDistance || ""}
                      onChange={(e) =>
                        updateForm({
                          beachDistance: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              CHARACTERISTICS
          ================================================= */}

          <div className={styles.sectionBlock}>
            <div className={styles.sectionTitle}>
              <div>
                <span>{isIssykKul ? "04" : "03"}</span>
                <h2>Характеристики</h2>
              </div>

              <p>Выберите подходящие значения</p>
            </div>

            <div className={styles.fieldsGrid}>
              {category.fields.map(([name, label]) => {
                const fieldOptions = getFieldOptions(name, dynamicOptions);

                const Icon = fieldIcons[name] || Tag;

                if (fieldOptions.length > 0) {
                  return (
                    <div className={styles.selectWrapper} key={name}>
                      <CustomSelect
                        icon={Icon}
                        title={label}
                        value={form[name] || ""}
                        setValue={(value) => updateField(name, value)}
                        options={fieldOptions}
                      />
                    </div>
                  );
                }

                return (
                  <div className={styles.inputCard} key={name}>
                    <div className={styles.inputIcon}>
                      <Icon size={18} />
                    </div>

                    <div className={styles.field}>
                      <label>{label}</label>

                      <input
                        value={form[name] || ""}
                        onChange={(e) => updateField(name, e.target.value)}
                        placeholder="Укажите значение"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================
              AMENITIES
          ================================================= */}

          {categoryAmenities.length > 0 && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionTitle}>
                <div>
                  <span>{isIssykKul ? "05" : "04"}</span>

                  <h2>Удобства</h2>
                </div>

                <p>Можно выбрать несколько вариантов</p>
              </div>

              <div className={styles.amenitiesGrid}>
                {categoryAmenities.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity);

                  return (
                    <button
                      key={amenity}
                      type="button"
                      className={`${styles.amenityCard} ${
                        isSelected ? styles.amenitySelected : ""
                      }`}
                      onClick={() => toggleAmenity(amenity)}
                    >
                      <span className={styles.amenityCheckbox}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </span>

                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>

              {selectedAmenities.length > 0 && (
                <div className={styles.amenitiesSelectedCount}>
                  Выбрано удобств: <strong>{selectedAmenities.length}</strong>
                </div>
              )}
            </div>
          )}

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={onBack}>
              <ArrowLeft size={17} />
              Назад
            </button>

            <button type="button" className={styles.primary} onClick={onNext}>
              Продолжить
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
