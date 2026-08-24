"use client";

import {
  Building2,
  House,
  Map,
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
} from "lucide-react";

import CustomSelect from "@/components/ui/customSelect/CustomSelect";
import styles from "./StepCategory.module.css";

const fieldIcons = {
  series: Tag,
  rooms: Building2,
  floor: Building2,
  condition: Pencil,
  walls: Building2,
  heating: Tag,
  documents: Tag,
  furniture: House,
  amenities: Tag,
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

const categoryIcons = {
  apartment: Building2,
  house: House,
  land: Map,
  room: DoorOpen,
  commercial: Store,
  parking: CarFront,
};

const categories = {
  apartment: {
    title: "Квартира",
    fields: [
      ["series", "Серия / тип"],
      ["rooms", "Количество комнат"],
      ["floor", "Этаж"],
      ["condition", "Состояние"],
      ["walls", "Стены"],
      ["heating", "Отопление"],
      ["documents", "Документы"],
      ["furniture", "Мебель"],
      ["amenities", "Удобства"],
      ["offerType", "Тип предложения"],
    ],
  },

  house: {
    title: "Дом",
    fields: [
      ["houseType", "Тип дома"],
      ["floors", "Этажность"],
      ["heating", "Отопление"],
      ["sewerage", "Канализация"],
      ["water", "Питьевая вода"],
      ["electricity", "Электричество"],
      ["documents", "Документы"],
      ["offerType", "Тип предложения"],
    ],
  },

  land: {
    title: "Участок",
    fields: [
      ["purpose", "Назначение"],
      ["fence", "Забор"],
      ["documents", "Документы"],
      ["offerType", "Тип предложения"],
      ["location", "Расположение"],
      ["terrain", "Рельеф"],
      ["communications", "Коммуникации"],
    ],
  },

  room: {
    title: "Комната",
    fields: [
      ["location", "Расположение"],
      ["roomsInApartment", "Комнат в квартире"],
      ["floor", "Этаж"],
      ["condition", "Состояние"],
      ["walls", "Стены"],
      ["heating", "Отопление"],
      ["amenities", "Удобства"],
      ["privateBathroom", "Свой санузел"],
      ["documents", "Документы"],
      ["offerType", "Тип предложения"],
    ],
  },

  commercial: {
    title: "Коммерция",
    fields: [
      ["floor", "Этаж"],
      ["condition", "Состояние"],
      ["walls", "Стены"],
      ["heating", "Отопление"],
      ["premisesType", "Тип помещения"],
      ["technicalParameters", "Технические параметры"],
      ["firstLine", "Первая линия"],
      ["separateEntrance", "Отдельный вход"],
      ["rentalBusiness", "Готовый арендный бизнес"],
      ["offerType", "Тип предложения"],
    ],
  },

  parking: {
    title: "Паркинг / гараж",
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
  },
};

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
    "Синяя книга",
    "Тех паспорт",
    "Договор аренды",
    "Договор купли-продажи",
    "Договор долевого участия",
    "Акт приема-передачи",
    "Акт на земельный участок",
    "ДДУ",
    "Свидетельство о наследстве",
    "Дарственная",
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

  amenities: [
    "Любые",
    "Балкон/Лоджия",
    "Нет балкона/лоджии",
    "Бронированные двери",
    "Бытовая техника",
    "Видеонаблюдение",
    "Вид на горы",
    "Животные не проживали",
    "Закрытая территория",
    "Не затапливалась",
    "Не сдавалась квартирантам",
    "Не угловая",
    "Раздельный санузел",
    "Совместные санузел",
    "Угловая квартира",
    "Не угловая квартира",
    "Лифт",
    "Охрана",
    "Парковка",
  ],

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
    "Охранная/Пожарная сигнализация",
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

const categoryDescriptions = {
  apartment: "Квартиры и апартаменты",
  house: "Частные дома, коттеджи и дачи",
  land: "Земельные участки",
  room: "Отдельные комнаты",
  commercial: "Офисы, магазины и другие помещения",
  parking: "Гаражи и парковочные места",
};

function getFieldOptions(field) {
  return options[field] || [];
}

export default function StepCategory({
  form,
  updateForm,
  onNext,
  onBack,
  onSubmit,
  isLoading,
}) {
  const category = categories[form.category];
  const CategoryIcon = categoryIcons[form.category];

  const isLand = form.category === "land";

  /*
   * Проверяем именно регион.
   *
   * Здесь учитываем разные варианты значения,
   * которые могут приходить из формы/API.
   */
  const isIssykKul =
    form.region === "ISSYK_KUL" ||
    form.region === "issykKul" ||
    form.region === "issyk-kul" ||
    form.region === "issyk_kul" ||
    form.region === "Иссык-Кульская область";

  function updateField(name, value) {
    updateForm({
      [name]: value,
    });
  }

  function handleSubmit() {
    const searchData = {
      // Местоположение
      country: form.country || "",
      region: form.region || "",
      city: form.city || "",
      settlement: form.settlement || "",
      district: form.district || "",

      // Сделка
      dealType: form.dealType || "",
      rentalPeriod: form.rentalPeriod || "",

      // Категория
      category: form.category || "",

      // Цена
      priceFrom: form.priceFrom || "",
      priceTo: form.priceTo || "",

      // Площадь
      areaFrom: form.areaFrom || "",
      areaTo: form.areaTo || "",

      // Расстояние до пляжа
      beachDistanceFrom: isIssykKul ? form.beachDistanceFrom || "" : "",

      beachDistanceTo: isIssykKul ? form.beachDistanceTo || "" : "",

      // Характеристики категории
      ...(category?.fields
        ? Object.fromEntries(
            category.fields.map(([name]) => [name, form[name] || ""]),
          )
        : {}),
    };

    console.log("🔎 Данные поиска:", searchData);

    if (onSubmit) {
      onSubmit(searchData);
    }
  }

  return (
    <div className={styles.step}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>Параметры объекта</h1>

        <p>Укажите основные характеристики недвижимости, которую ищите.</p>
      </div>

      {/* CATEGORY */}
      {!category && (
        <div className={styles.categorySection}>
          <div className={styles.sectionTitle}>
            <div>
              <span>01</span>
              <h2>Выберите категорию</h2>
            </div>

            <p>Это поможет подобрать нужные параметры.</p>
          </div>

          <div className={styles.categoryGrid}>
            {Object.entries(categories).map(([key, item]) => {
              const Icon = categoryIcons[key];

              return (
                <button
                  type="button"
                  key={key}
                  className={styles.categoryCard}
                  onClick={() =>
                    updateForm({
                      category: key,
                    })
                  }
                >
                  <div className={styles.categoryIcon}>
                    <Icon size={25} strokeWidth={2.1} />
                  </div>

                  <div className={styles.categoryContent}>
                    <strong>{item.title}</strong>

                    <span>{categoryDescriptions[key]}</span>
                  </div>

                  <ArrowRight className={styles.categoryArrow} size={19} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SELECTED CATEGORY */}
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
                })
              }
            >
              <Pencil size={14} />
              Изменить
            </button>
          </div>

          {/* PRICE + AREA */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionTitle}>
              <div>
                <span>02</span>

                <h2>Цена и площадь</h2>
              </div>

              <p>Укажите желаемый диапазон</p>
            </div>

            <div className={styles.priceGrid}>
              {/* PRICE */}
              <div className={styles.inputCard}>
                <div className={styles.inputIcon}>
                  <DollarSign size={19} />
                </div>

                <div className={styles.field}>
                  <label>Цена, $</label>

                  <div className={styles.rangeInputs}>
                    <input
                      type="number"
                      min="0"
                      placeholder="От"
                      value={form.priceFrom || ""}
                      onChange={(e) =>
                        updateForm({
                          priceFrom: e.target.value,
                        })
                      }
                    />

                    <input
                      type="number"
                      min="0"
                      placeholder="До"
                      value={form.priceTo || ""}
                      onChange={(e) =>
                        updateForm({
                          priceTo: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* AREA */}
              <div className={styles.inputCard}>
                <div className={styles.inputIcon}>
                  <Maximize size={18} />
                </div>

                <div className={styles.field}>
                  <label>Площадь, {isLand ? "соток" : "м²"}</label>

                  <div className={styles.rangeInputs}>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="От"
                      value={form.areaFrom || ""}
                      onChange={(e) =>
                        updateForm({
                          areaFrom: e.target.value,
                        })
                      }
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="До"
                      value={form.areaTo || ""}
                      onChange={(e) =>
                        updateForm({
                          areaTo: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ISSYK-KUL BEACH DISTANCE */}
          {isIssykKul && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionTitle}>
                <div>
                  <span>03</span>

                  <h2>Расстояние до пляжа</h2>
                </div>

                <p>Насколько далеко объект может находиться от озера</p>
              </div>

              <div className={styles.beachDistanceCard}>
                <div className={styles.beachDistanceIcon}>
                  <Map size={20} strokeWidth={2.1} />
                </div>

                <div className={styles.beachDistanceContent}>
                  <div className={styles.rangeInputs}>
                    <div className={styles.unitInput}>
                      <input
                        type="number"
                        min="0"
                        placeholder="От"
                        value={form.beachDistanceFrom || ""}
                        onChange={(e) =>
                          updateForm({
                            beachDistanceFrom: e.target.value,
                          })
                        }
                      />

                      <span>м</span>
                    </div>

                    <div className={styles.unitInput}>
                      <input
                        type="number"
                        min="0"
                        placeholder="До"
                        value={form.beachDistanceTo || ""}
                        onChange={(e) =>
                          updateForm({
                            beachDistanceTo: e.target.value,
                          })
                        }
                      />

                      <span>м</span>
                    </div>
                  </div>

                  <small>Например: от 100 до 3000 м от пляжа</small>
                </div>
              </div>
            </div>
          )}

          {/* CHARACTERISTICS */}
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
                const fieldOptions = getFieldOptions(name);

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

          {/* ACTIONS */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondary}
              onClick={onBack}
              disabled={isLoading}
            >
              <ArrowLeft size={17} />
              Назад
            </button>

            <button
              type="button"
              className={styles.primary}
              disabled={!form.dealType || isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? "Поиск..." : "Найти подходящие объявления"}

              {!isLoading && <ChevronRight size={18} />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
