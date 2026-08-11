"use client";

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
    "Сталинка",
    "Хрущёвка",
    "Брежневка",
    "Новостройка",
    "Элитная",
    "Другое",
  ],

  rooms: ["1", "2", "3", "4", "5+"],

  floor: ["Цоколь", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],

  condition: ["Новое", "Евроремонт", "Хорошее", "Среднее", "Требует ремонта"],

  walls: ["Кирпич", "Монолит", "Панель", "Саман", "Другое"],

  heating: [
    "Центральное",
    "Газовое",
    "Электрическое",
    "Твердотопливное",
    "Автономное",
  ],

  documents: ["Есть", "Нет", "В процессе оформления"],

  furniture: ["Полностью меблирована", "Частично меблирована", "Без мебели"],

  yesNo: ["Да", "Нет"],
};

function getFieldType(field) {
  if (options[field]) {
    return "select";
  }

  return "text";
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
                value={form.priceFrom}
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
                value={form.priceTo}
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
                value={form.areaFrom}
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
                value={form.areaTo}
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
              const type = getFieldType(name);

              return (
                <div className={styles.field} key={name}>
                  <label>{label}</label>

                  {type === "select" ? (
                    <select
                      value={form[name] || ""}
                      onChange={(e) => updateField(name, e.target.value)}
                    >
                      <option value="">Выберите</option>

                      {options[name].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={form[name] || ""}
                      onChange={(e) => updateField(name, e.target.value)}
                      placeholder="Укажите значение"
                    />
                  )}
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
