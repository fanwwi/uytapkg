"use client";

import CustomSelect from "@/components/ui/customSelect/CustomSelect";
import styles from "./steps.module.css";

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
    "Тех паспорт",
    "Договор купли-продажи",
    "Договор долевого участия",
    "Акт приема-передачи",
  ],

  furniture: ["Полностью меблирована", "Частично меблирована", "Без мебели"],

  yesNo: ["Да", "Нет"],

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

function getFieldOptions(field) {
  return options[field] || [];
}

export default function StepCategory({ form, updateForm, onNext, onBack }) {
  const category = categories[form.category];

  function updateField(name, value) {
    updateForm({
      [name]: value,
    });
  }

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <span>Шаг 3 из 5</span>

        <h1>Параметры объекта</h1>

        <p>Укажите основные характеристики недвижимости.</p>
      </div>

      {!category && (
        <>
          <label className={styles.label}>Категория</label>

          <div className={styles.categoryGrid}>
            {Object.entries(categories).map(([key, item]) => (
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
                <strong>{item.title}</strong>

                <span>Заполнить параметры</span>
              </button>
            ))}
          </div>
        </>
      )}

      {category && (
        <>
          <div className={styles.selectedCategory}>
            <div>
              <span>Категория</span>

              <strong>{category.title}</strong>
            </div>

            <button
              type="button"
              onClick={() =>
                updateForm({
                  category: "",
                })
              }
            >
              Изменить
            </button>
          </div>

          <div className={styles.priceGrid}>
            <div className={styles.field}>
              <label>Цена от, $</label>

              <input
                type="number"
                min="0"
                placeholder="Например 50 000"
                value={form.priceFrom || ""}
                onChange={(e) =>
                  updateForm({
                    priceFrom: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.field}>
              <label>Цена до, $</label>

              <input
                type="number"
                min="0"
                placeholder="Например 100 000"
                value={form.priceTo || ""}
                onChange={(e) =>
                  updateForm({
                    priceTo: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className={styles.priceGrid}>
            <div className={styles.field}>
              <label>Площадь от, м²</label>

              <input
                type="number"
                min="0"
                placeholder="От"
                value={form.areaFrom || ""}
                onChange={(e) =>
                  updateForm({
                    areaFrom: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.field}>
              <label>Площадь до, м²</label>

              <input
                type="number"
                min="0"
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

          <div className={styles.fieldsGrid}>
            {category.fields.map(([name, label]) => {
              const fieldOptions = getFieldOptions(name);

              if (fieldOptions.length > 0) {
                return (
                  <CustomSelect
                    key={name}
                    title={label}
                    value={form[name] || ""}
                    setValue={(value) => updateField(name, value)}
                    options={fieldOptions}
                  />
                );
              }

              return (
                <div className={styles.field} key={name}>
                  <label>{label}</label>

                  <input
                    value={form[name] || ""}
                    onChange={(e) => updateField(name, e.target.value)}
                    placeholder="Укажите значение"
                  />
                </div>
              );
            })}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={onBack}>
              Назад
            </button>

            <button type="button" className={styles.primary} onClick={onNext}>
              Продолжить
            </button>
          </div>
        </>
      )}
    </div>
  );
}
