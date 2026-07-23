"use client";

import {
  Layers,
  Thermometer,
  FileCheck,
  Sofa,
  ShieldCheck,
  BadgeCheck,
  CalendarDays,
  Home,
  Droplets,
  Zap,
  MapPin,
  Mountain,
  Building2,
} from "lucide-react";

import CustomSelect from "../../../../components/ui/customSelect/CustomSelect";

import styles from "./AdvancedFilters.module.css";

export default function AdvancedFilters({
  category,
  deal,

  // common
  documents,
  setDocuments,

  offerType,
  setOfferType,

  rentPeriod,
  setRentPeriod,

  // apartment / room / commercial
  floor,
  setFloor,

  condition,
  setCondition,

  walls,
  setWalls,

  heating,
  setHeating,

  comfort,
  setComfort,

  // apartment
  furniture,
  setFurniture,

  // house
  houseType,
  setHouseType,

  sewage,
  setSewage,

  water,
  setWater,

  electricity,
  setElectricity,

  // land
  landLocation,
  setLandLocation,

  relief,
  setRelief,

  communications,
  setCommunications,

  // rooms
  roomLocation,
  setRoomLocation,

  totalRooms,
  setTotalRooms,

  privateBathroom,
  setPrivateBathroom,

  // commercial
  commercialTypeAdvanced,
  setCommercialTypeAdvanced,

  technicalParams,
  setTechnicalParams,

  firstLine,
  setFirstLine,

  separateEntrance,
  setSeparateEntrance,

  rentalBusiness,
  setRentalBusiness,

  includedCost,
  setIncludedCost,

  paymentTerms,
  setPaymentTerms,

  // parking
  parkingAreaFrom,
  setParkingAreaFrom,

  parkingAreaTo,
  setParkingAreaTo,

  ceilingHeight,
  setCeilingHeight,

  parkingKind,
  setParkingKind,

  material,
  setMaterial,

  gateType,
  setGateType,

  hasGate,
  setHasGate,

  camera,
  setCamera,

  inspectionPit,
  setInspectionPit,

  electricityParking,
  setElectricityParking,

  cellar,
  setCellar,

  truckAccess,
  setTruckAccess,
}) {
  if (category === "Участки") {
    return (
      <div className={styles.wrapper}>
        <CustomSelect
          icon={FileCheck}
          title="Документы"
          value={documents}
          setValue={setDocuments}
          options={[
            "Любые",
            "Красная книга",
            "Синяя книга",
            "Договор аренды",
            "Акт на земельный участок",
            "Договор купли-продажи",
          ]}
        />

        <CustomSelect
          icon={BadgeCheck}
          title="Тип предложения"
          value={offerType}
          setValue={setOfferType}
          options={[
            "Любой",
            "Наличный расчет",
            "Ипотека",
            "Рассрочка",
            "Возможен обмен",
            "Срочное предложение",
          ]}
        />

        <CustomSelect
          icon={MapPin}
          title="Расположение"
          value={landLocation}
          setValue={setLandLocation}
          options={[
            "Любое",
            "В городе",
            "В пригороде",
            "В предгорьях",
            "Возле трассы",
            "Возле водоема",
            "В дачном массиве",
          ]}
        />

        <CustomSelect
          icon={Mountain}
          title="Рельеф"
          value={relief}
          setValue={setRelief}
          options={["Любой", "Ровный", "Небольшой уклон", "Крутой уклон"]}
        />

        <CustomSelect
          icon={Zap}
          title="Коммуникации"
          value={communications}
          setValue={setCommunications}
          options={[
            "Любые",
            "Электричество",
            "Вода",
            "Газ",
            "Канализация",
            "Интернет",
            "Отопление",
            "Телефон",
          ]}
        />

        {deal === "rent" && (
          <CustomSelect
            icon={CalendarDays}
            title="Период аренды"
            value={rentPeriod}
            setValue={setRentPeriod}
            options={[
              "Любой",
              "Посуточно",
              "По часам",
              "По недельно",
              "Помесячно",
              "На сезон",
              "Долгосрочно",
            ]}
          />
        )}
      </div>
    );
  }

  if (category === "Дома") {
    return (
      <div className={styles.wrapper}>
        <CustomSelect
          icon={Home}
          title="Тип дома"
          value={houseType}
          setValue={setHouseType}
          options={[
            "Любой",
            "Частный дом",
            "Особняк",
            "Коттедж",
            "Таунхаус",
            "Дача",
            "Времянка",
          ]}
        />

        <CustomSelect
          icon={Layers}
          title="Этажность"
          value={floor}
          setValue={setFloor}
          options={["Любая", "1 этаж", "2 этажа", "3 этажа", "4+ этажа"]}
        />

        <CustomSelect
          icon={Thermometer}
          title="Отопление"
          value={heating}
          setValue={setHeating}
          options={[
            "Любое",
            "Газовое",
            "Центральное",
            "Твердое топливо",
            "Электрическое",
            "Комбинированное",
          ]}
        />

        <CustomSelect
          icon={Droplets}
          title="Канализация"
          value={sewage}
          setValue={setSewage}
          options={[
            "Любая",
            "Возможно подведение",
            "Центральная",
            "Септик",
            "Нет",
          ]}
        />

        <CustomSelect
          icon={Droplets}
          title="Питьевая вода"
          value={water}
          setValue={setWater}
          options={[
            "Любая",
            "Централизованное",
            "Возможно подведение",
            "Скважина",
            "Нет",
          ]}
        />

        <CustomSelect
          icon={Zap}
          title="Электричество"
          value={electricity}
          setValue={setElectricity}
          options={["Любое", "Есть", "Возможно подведение", "Нет"]}
        />

        <CustomSelect
          icon={FileCheck}
          title="Документы"
          value={documents}
          setValue={setDocuments}
          options={[
            "Любые",
            "Красная книга",
            "Тех паспорт",
            "Договор купли-продажи",
            "Акт на земельный участок",
          ]}
        />

        <CustomSelect
          icon={BadgeCheck}
          title="Тип предложения"
          value={offerType}
          setValue={setOfferType}
          options={[
            "Любой",
            "Наличный расчет",
            "Ипотека",
            "Рассрочка",
            "Возможен обмен",
            "Срочное предложение",
          ]}
        />

        {deal === "rent" && (
          <CustomSelect
            icon={CalendarDays}
            title="Период аренды"
            value={rentPeriod}
            setValue={setRentPeriod}
            options={[
              "Любой",
              "Посуточно",
              "По часам",
              "По недельно",
              "Помесячно",
              "На сезон",
              "Долгосрочно",
            ]}
          />
        )}
      </div>
    );
  }

  if (category === "Комнаты") {
    return (
      <div className={styles.wrapper}>
        <CustomSelect
          icon={MapPin}
          title="Расположение"
          value={roomLocation}
          setValue={setRoomLocation}
          options={[
            "В квартире",
            "В доме",
            "В хостеле",
            "В гостинице",
            "В общежитии",
            "В колливинге",
          ]}
        />

        <CustomSelect
          icon={Home}
          title="Комнат в квартире"
          value={totalRooms}
          setValue={setTotalRooms}
          options={[
            "Любое",
            "1-комнатная",
            "2-комнатная",
            "3-комнатная",
            "4+ комнат",
            "Свободная планировка",
          ]}
        />

        <CustomSelect
          icon={Layers}
          title="Этаж"
          value={floor}
          setValue={setFloor}
          options={[
            "Любой",
            "1 этаж",
            "2-3 этаж",
            "4-5 этаж",
            "6-7 этаж",
            "8-9 этаж",
            "10-11 этаж",
            "11+ этаж",
          ]}
        />

        <CustomSelect
          title="Состояние"
          value={condition}
          setValue={setCondition}
          options={[
            "Любое",
            "Дизайнерский ремонт",
            "Евроремонт",
            "Косметический",
            "Под самоотделку",
            "Старый ремонт",
            "Без ремонта",
          ]}
        />

        <CustomSelect
          title="Стены"
          value={walls}
          setValue={setWalls}
          options={[
            "Любые",
            "Кирпич",
            "Бетон",
            "Газобетон",
            "Панельные",
            "Монолитные",
            "Монолитно-кирпичные",
            "Монолитно-каркасные",
            "Газоблок",
            "Пеноблок",
            "Саман",
            "Другие",
          ]}
        />

        <CustomSelect
          icon={Thermometer}
          title="Отопление"
          value={heating}
          setValue={setHeating}
          options={[
            "Любое",
            "Комбинированное",
            "Центральное",
            "Автономное",
            "Газовое",
            "Электрическое",
          ]}
        />

        <CustomSelect
          icon={ShieldCheck}
          title="Удобства"
          value={comfort}
          setValue={setComfort}
          options={[
            "Любые",
            "Чистая",
            "Уютная",
            "Стиральная машина-автомат",
            "Кабельное ТВ",
            "Вся бытовая техника",
            "Холодильник",
          ]}
        />

        <CustomSelect
          icon={Home}
          title="Свой санузел"
          value={privateBathroom}
          setValue={setPrivateBathroom}
          options={["Да", "Нет"]}
        />

        <CustomSelect
          icon={FileCheck}
          title="Документы"
          value={documents}
          setValue={setDocuments}
          options={[
            "Любые",
            "Красная книга",
            "Зеленая книга",
            "Тех паспорт",
            "ДДУ",
            "Купля-продажа",
            "Дарственная",
            "Свидетельство о наследстве",
          ]}
        />

        <CustomSelect
          icon={BadgeCheck}
          title="Тип предложения"
          value={offerType}
          setValue={setOfferType}
          options={[
            "Любой",
            "Наличный расчет",
            "Ипотека",
            "Рассрочка",
            "Возможен обмен",
            "Срочное предложение",
          ]}
        />

        {deal === "rent" && (
          <CustomSelect
            icon={CalendarDays}
            title="Период аренды"
            value={rentPeriod}
            setValue={setRentPeriod}
            options={[
              "Любой",
              "Посуточно",
              "По часам",
              "По недельно",
              "Помесячно",
              "На сезон",
              "Долгосрочно",
            ]}
          />
        )}
      </div>
    );
  }

  if (category === "Коммерция") {
    return (
      <div className={styles.wrapper}>
        <CustomSelect
          icon={Layers}
          title="Этаж"
          value={floor}
          setValue={setFloor}
          options={["Любой", "Цоколь", "1 этаж", "2-5 этаж", "6+ этаж"]}
        />

        <CustomSelect
          title="Состояние"
          value={condition}
          setValue={setCondition}
          options={[
            "Любое",
            "Без внутренней отделки",
            "White box",
            "Требует ремонта",
            "С ремонтом",
          ]}
        />

        <CustomSelect
          title="Стены"
          value={walls}
          setValue={setWalls}
          options={[
            "Любые",
            "Кирпич",
            "Бетон",
            "Газобетон",
            "Панельные",
            "Монолитные",
            "Монолитно-кирпичные",
            "Монолитно-каркасные",
            "Газоблок",
            "Пеноблок",
            "Саман",
            "Другие",
          ]}
        />

        <CustomSelect
          icon={Thermometer}
          title="Отопление"
          value={heating}
          setValue={setHeating}
          options={[
            "Любое",
            "Центральное",
            "Автономное",
            "Газовое",
            "Электрическое",
            "Комбинированное",
          ]}
        />

        <CustomSelect
          icon={Building2}
          title="Тип помещения"
          value={commercialTypeAdvanced}
          setValue={setCommercialTypeAdvanced}
          options={[
            "Любой",
            "Офис",
            "Магазин",
            "Склад",
            "Производство",
            "Общепит",
            "Производство",
            "Гостиница",
            "Промбаза",
          ]}
        />

        <CustomSelect
          title="Технические параметры"
          value={technicalParams}
          setValue={setTechnicalParams}
          options={[
            "Любые",
            "Центральная канализация",
            "Трехфазное питание",
            "Приточно-вытяжная вентиляция",
            "Кондиционирование",
            "Охранная/Пожарная сигнализация",
          ]}
        />

        <CustomSelect
          title="Первая линия"
          value={firstLine}
          setValue={setFirstLine}
          options={["Любая", "Да", "Нет"]}
        />

        <CustomSelect
          title="Отдельный вход"
          value={separateEntrance}
          setValue={setSeparateEntrance}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          title="Готовый арендный бизнес"
          value={rentalBusiness}
          setValue={setRentalBusiness}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={BadgeCheck}
          title="Тип предложения"
          value={offerType}
          setValue={setOfferType}
          options={[
            "Любой",
            "Наличный расчет",
            "Ипотека",
            "Рассрочка",
            "Возможен обмен",
            "Срочное предложение",
          ]}
        />

        {deal === "rent" && (
          <>
            <CustomSelect
              title="В стоимость включено"
              value={includedCost}
              setValue={setIncludedCost}
              options={["Коммунальные услуги", "НДС", "Охрана"]}
            />

            <CustomSelect
              title="Условия оплаты"
              value={paymentTerms}
              setValue={setPaymentTerms}
              options={[
                "Любые",
                "Предоплата 1 месяц",
                "Предоплата от 3х месяцев",
                "Требуется депозит/залог",
              ]}
            />

            <CustomSelect
              icon={CalendarDays}
              title="Период аренды"
              value={rentPeriod}
              setValue={setRentPeriod}
              options={[
                "Любой",
                "Посуточно",
                "По часам",
                "По недельно",
                "Помесячно",
                "На сезон",
                "Долгосрочно",
              ]}
            />
          </>
        )}
      </div>
    );
  }

  if (category === "Паркинг / Гараж") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.area}>
          <input
            placeholder="Площадь от м²"
            value={parkingAreaFrom}
            onChange={(e) =>
              setParkingAreaFrom(e.target.value.replace(/\D/g, ""))
            }
          />

          <span>-</span>

          <input
            placeholder="Площадь до м²"
            value={parkingAreaTo}
            onChange={(e) =>
              setParkingAreaTo(e.target.value.replace(/\D/g, ""))
            }
          />
        </div>

        <CustomSelect
          title="Высота потолков"
          value={ceilingHeight}
          setValue={setCeilingHeight}
          options={["Любая", "До 2 м", "2-3 м", "3-4 м", "4+ м"]}
        />

        <CustomSelect
          title="Тип парковки"
          value={parkingKind}
          setValue={setParkingKind}
          options={["Любой", "Подземный", "Надземный", "Многоуровневый"]}
        />

        <CustomSelect
          title="Материал"
          value={material}
          setValue={setMaterial}
          options={["Любой", "Металлический", "Кирпичный", "Железобетонный"]}
        />

        {[
          ["Ворота", hasGate, setHasGate],
          ["Видеонаблюдение", camera, setCamera],
          ["Смотровая яма", inspectionPit, setInspectionPit],
          ["Электричество", electricityParking, setElectricityParking],
          ["Погреб", cellar, setCellar],
          ["Для грузового авто", truckAccess, setTruckAccess],
        ].map(([title, value, setter]) => (
          <CustomSelect
            key={title}
            title={title}
            value={value}
            setValue={setter}
            options={["Любое", "Да", "Нет"]}
          />
        ))}

        <CustomSelect
          title="Тип ворот"
          value={gateType}
          setValue={setGateType}
          options={["Любой", "Распашные", "Подъемный", "Рулонные"]}
        />

        <CustomSelect
          icon={FileCheck}
          title="Документы"
          value={documents}
          setValue={setDocuments}
          options={[
            "Любые",
            "Красная книга",
            "Тех паспорт",
            "ДДУ",
            "Купля-продажа",
            "Зеленая книга",
            "Дарственная",
            "Свидетельство о наследстве",
          ]}
        />

        <CustomSelect
          icon={BadgeCheck}
          title="Тип предложения"
          value={offerType}
          setValue={setOfferType}
          options={[
            "Любой",
            "Наличный расчет",
            "Ипотека",
            "Рассрочка",
            "Возможен обмен",
            "Срочное предложение",
          ]}
        />

        {deal === "rent" && (
          <CustomSelect
            icon={CalendarDays}
            title="Период аренды"
            value={rentPeriod}
            setValue={setRentPeriod}
            options={[
              "Любой",
              "Посуточно",
              "По часам",
              "По недельно",
              "Помесячно",
              "На сезон",
              "Долгосрочно",
            ]}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <CustomSelect
        icon={Layers}
        title="Этаж"
        value={floor}
        setValue={setFloor}
        options={[
          "Любой",
          "1 этаж",
          "2-3 этаж",
          "4-5 этаж",
          "6-7 этаж",
          "8-9 этаж",
          "10-11 этаж",
          "11+ этаж",
        ]}
      />

      <CustomSelect
        title="Состояние"
        value={condition}
        setValue={setCondition}
        options={[
          "Любое",
          "Дизайнерский ремонт",
          "Евроремонт",
          "Косметический",
          "Под самоотделку",
          "Старый ремонт",
          "Без ремонта",
        ]}
      />

      <CustomSelect
        title="Стены"
        value={walls}
        setValue={setWalls}
        options={[
          "Любые",
          "Кирпич",
          "Бетон",
          "Газобетон",
          "Панельные",
          "Монолитные",
          "Монолитно-кирпичные",
          "Монолитно-каркасные",
          "Газоблок",
          "Пеноблок",
          "Саман",
          "Другие",
        ]}
      />

      <CustomSelect
        icon={Thermometer}
        title="Отопление"
        value={heating}
        setValue={setHeating}
        options={[
          "Любое",
          "Автономное",
          "Газовое",
          "Центральное",
          "Электрическое",
          "Комбинированное",
        ]}
      />

      <CustomSelect
        icon={FileCheck}
        title="Документы"
        value={documents}
        setValue={setDocuments}
        options={[
          "Любые",
          "Красная книга",
          "Тех паспорт",
          "Договор купли-продажи",
          "Договор долевого участия",
          "Акт приема-передачи",
        ]}
      />

      <CustomSelect
        icon={Sofa}
        title="Мебель"
        value={furniture}
        setValue={setFurniture}
        options={["Любая", "Полная", "Частичная", "Без мебели"]}
      />

      <CustomSelect
        icon={ShieldCheck}
        title="Удобства"
        value={comfort}
        setValue={setComfort}
        options={[
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
          "Кондиционер",
        ]}
      />

      <CustomSelect
        icon={BadgeCheck}
        title="Тип предложения"
        value={offerType}
        setValue={setOfferType}
        options={[
          "Любой",
          "Наличный расчет",
          "Ипотека",
          "Рассрочка",
          "Возможен обмен",
          "Срочное предложение",
        ]}
      />

      {deal === "rent" && (
        <CustomSelect
          icon={CalendarDays}
          title="Период аренды"
          value={rentPeriod}
          setValue={setRentPeriod}
          options={[
            "Любой",
            "Посуточно",
            "По часам",
            "По недельно",
            "Помесячно",
            "На сезон",
            "Долгосрочно",
          ]}
        />
      )}
    </div>
  );
}
