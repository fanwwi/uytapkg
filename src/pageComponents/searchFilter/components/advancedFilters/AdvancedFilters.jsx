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

  roomLocation,
  setRoomLocation,

  parkingAreaFrom,
  parkingAreaTo,

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

  totalRooms,
  setTotalRooms,

  privateBathroom,
  setPrivateBathroom,

  floor,
  setFloor,

  condition,
  setCondition,

  walls,
  setWalls,

  heating,
  setHeating,

  documents,
  setDocuments,

  furniture,
  setFurniture,

  comfort,
  setComfort,

  offerType,
  setOfferType,

  rentPeriod,
  setRentPeriod,

  houseType,
  setHouseType,

  sewage,
  setSewage,

  water,
  setWater,

  electricity,
  setElectricity,

  landLocation,
  setLandLocation,

  relief,
  setRelief,

  communications,
  setCommunications,

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
}) {
  /*
=========================
УЧАСТКИ
=========================
*/

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
            "Тех паспорт",
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
            "Обмен",
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
            "Пригород",
            "У трассы",
            "У водоема",
            "В горах",
          ]}
        />

        <CustomSelect
          icon={Mountain}
          title="Рельеф"
          value={relief}
          setValue={setRelief}
          options={["Любой", "Ровный", "С уклоном", "Холмистый", "Склон"]}
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
              "По часам",
              "Посуточно",
              "Понедельно",
              "На сезон",
              "Помесячно",
              "Долгосрочно",
            ]}
          />
        )}
      </div>
    );
  }

  /*
=========================
ДОМА
=========================
*/

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
            "Автономное",
            "Электрическое",
            "Печное",
          ]}
        />

        <CustomSelect
          icon={Droplets}
          title="Канализация"
          value={sewage}
          setValue={setSewage}
          options={[
            "Любая",
            "Центральная",
            "Возможно подведение",
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
            "Обмен",
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
              "По часам",
              "Посуточно",
              "Понедельно",
              "На сезон",
              "Помесячно",
              "Долгосрочно",
            ]}
          />
        )}
      </div>
    );
  }

  /*
=========================
КОМНАТЫ
=========================
*/

  if (category === "Комнаты") {
    return (
      <div className={styles.wrapper}>
        <CustomSelect
          icon={MapPin}
          title="Расположение"
          value={roomLocation}
          setValue={setRoomLocation}
          options={["Любое", "Центр", "Микрорайон", "Пригород"]}
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
          ]}
        />

        <CustomSelect
          icon={Layers}
          title="Этаж"
          value={floor}
          setValue={setFloor}
          options={["Любой", "1 этаж", "2-5 этаж", "6-10 этаж", "11+ этаж"]}
        />

        <CustomSelect
          title="Состояние"
          value={condition}
          setValue={setCondition}
          options={["Любое", "Евроремонт", "Косметический", "Без ремонта"]}
        />

        <CustomSelect
          title="Стены"
          value={walls}
          setValue={setWalls}
          options={["Любые", "Кирпич", "Панель", "Монолит", "Газоблок"]}
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
          ]}
        />

        <CustomSelect
          icon={ShieldCheck}
          title="Удобства комнаты"
          value={comfort}
          setValue={setComfort}
          options={[
            "Любые",
            "Интернет",
            "Балкон",
            "Кондиционер",
            "Холодильник",
            "Стиральная машина",
          ]}
        />

        <CustomSelect
          icon={Home}
          title="Свой санузел"
          value={privateBathroom}
          setValue={setPrivateBathroom}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          icon={FileCheck}
          title="Документы"
          value={documents}
          setValue={setDocuments}
          options={["Любые", "Красная книга", "Тех паспорт", "Договор"]}
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
            "Обмен",
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
              "По часам",
              "Посуточно",
              "Помесячно",
              "Долгосрочно",
            ]}
          />
        )}
      </div>
    );
  }

  /*
=========================
КОММЕРЦИЯ
=========================
*/

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
            "Новое",
            "После ремонта",
            "Требует ремонта",
            "Чистовая отделка",
          ]}
        />

        <CustomSelect
          title="Стены"
          value={walls}
          setValue={setWalls}
          options={["Любые", "Кирпич", "Панель", "Монолит", "Газоблок"]}
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
          ]}
        />

        <CustomSelect
          icon={Building2}
          title="Тип"
          value={commercialTypeAdvanced}
          setValue={setCommercialTypeAdvanced}
          options={[
            "Любой",
            "Торговое",
            "Офисное",
            "Производственное",
            "Складское",
          ]}
        />

        <CustomSelect
          title="Технические параметры"
          value={technicalParams}
          setValue={setTechnicalParams}
          options={[
            "Любые",
            "Вентиляция",
            "Кондиционирование",
            "Грузовой лифт",
            "Высокие потолки",
            "Мощность электросети",
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
          options={["Любой", "Наличный расчет", "Ипотека", "Рассрочка"]}
        />

        {deal === "rent" && (
          <>
            <CustomSelect
              title="В стоимость включено"
              value={includedCost}
              setValue={setIncludedCost}
              options={[
                "Любое",
                "Коммунальные услуги",
                "Интернет",
                "Охрана",
                "Уборка",
              ]}
            />

            <CustomSelect
              title="Условия оплаты"
              value={paymentTerms}
              setValue={setPaymentTerms}
              options={[
                "Любые",
                "Предоплата",
                "После месяца",
                "Депозит",
                "Без депозита",
              ]}
            />

            <CustomSelect
              icon={CalendarDays}
              title="Период аренды"
              value={rentPeriod}
              setValue={setRentPeriod}
              options={["Любой", "Посуточно", "Помесячно", "Долгосрочно"]}
            />
          </>
        )}
      </div>
    );
  }
  /*
=========================
КВАРТИРЫ
=========================
*/

  /*
=========================
ПАРКИНГ / ГАРАЖ
=========================
*/

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
          options={["Любая", "до 2 м", "2-3 м", "3-4 м", "4+ м"]}
        />

        <CustomSelect
          title="Тип парковки"
          value={parkingKind}
          setValue={setParkingKind}
          options={[
            "Любой",
            "Открытая",
            "Закрытая",
            "Подземная",
            "Многоуровневая",
          ]}
        />

        <CustomSelect
          title="Материал"
          value={material}
          setValue={setMaterial}
          options={["Любой", "Кирпич", "Бетон", "Металл", "Сэндвич панели"]}
        />

        <CustomSelect
          title="Тип ворот"
          value={gateType}
          setValue={setGateType}
          options={[
            "Любой",
            "Распашные",
            "Секционные",
            "Рулонные",
            "Автоматические",
          ]}
        />

        <CustomSelect
          title="Ворота"
          value={hasGate}
          setValue={hasGate}
          options={["Любые", "Да", "Нет"]}
        />

        <CustomSelect
          title="Видеонаблюдение"
          value={camera}
          setValue={setCamera}
          options={["Любое", "Да", "Нет"]}
        />

        <CustomSelect
          title="Смотровая яма"
          value={inspectionPit}
          setValue={setInspectionPit}
          options={["Любая", "Да", "Нет"]}
        />

        <CustomSelect
          title="Электричество"
          value={electricityParking}
          setValue={setElectricityParking}
          options={["Любое", "Да", "Нет"]}
        />

        <CustomSelect
          title="Погреб"
          value={cellar}
          setValue={setCellar}
          options={["Любой", "Да", "Нет"]}
        />

        <CustomSelect
          title="Для грузового авто"
          value={truckAccess}
          setValue={setTruckAccess}
          options={["Любой", "Да", "Нет"]}
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
          ]}
        />

        <CustomSelect
          icon={BadgeCheck}
          title="Тип предложения"
          value={offerType}
          setValue={setOfferType}
          options={["Любой", "Наличный расчет", "Ипотека", "Рассрочка"]}
        />

        {deal === "rent" && (
          <CustomSelect
            icon={CalendarDays}
            title="Период аренды"
            value={rentPeriod}
            setValue={setRentPeriod}
            options={["Любой", "Посуточно", "Помесячно", "Долгосрочно"]}
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
        options={["Любой", "1 этаж", "2-5 этаж", "6-10 этаж", "11+ этаж"]}
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
          "Без ремонта",
        ]}
      />

      <CustomSelect
        title="Стены"
        value={walls}
        setValue={setWalls}
        options={["Любые", "Кирпич", "Панель", "Монолит", "Газоблок"]}
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
          "Балкон",
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
        options={["Любой", "Наличный расчет", "Ипотека", "Рассрочка", "Обмен"]}
      />

      {deal === "rent" && (
        <CustomSelect
          icon={CalendarDays}
          title="Период аренды"
          value={rentPeriod}
          setValue={setRentPeriod}
          options={[
            "Любой",
            "По часам",
            "Посуточно",
            "Помесячно",
            "Долгосрочно",
          ]}
        />
      )}
    </div>
  );
}
