// MyProductDetails.jsx

"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";

import { getListingById } from "@/utils/api";
import { mapListingDetail } from "@/utils/mapListingData";

import {
  ArrowLeft,
  Heart,
  MapPin,
  Home,
  Ruler,
  BedDouble,
  Building2,
  Layers3,
  Flame,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Tag,
  Droplets,
  Zap,
  FileCheck,
  CarFront,
  Waves,
  Pencil,
  Trash2,
  CalendarDays,
  LandPlot,
  Bath,
  Sofa,
  Trees,
  Compass,
  Maximize,
  DoorOpen,
  Building,
  CircleDollarSign,
  CheckCircle2,
} from "lucide-react";

import styles from "./MyAdsDetails.module.css";

import DeleteModal from "@/components/ui/deleteModal/DeleteMidal";
import AdsEditModal from "../AdsEditModal/AdsEditModal";

export default function MyProductDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    setLoading(true);
    setError(null);

    getListingById(id)
      .then((res) => {
        if (!mounted) return;

        if (res.success && res.data) {
          const mapped = mapListingDetail(res.data);

          setProduct(mapped);
        } else {
          setError(res.message || "Объявление не найдено");
        }
      })
      .catch((err) => {
        console.error("Fetch my listing details error:", err);

        if (mounted) {
          setError("Ошибка загрузки объявления");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  /*
   * =========================================================
   * RAW DATA
   * =========================================================
   */

  const raw = product?.rawFeatures || {};

  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  const hasValue = (value) => {
    if (value === undefined || value === null) return false;
    if (value === "") return false;
    if (value === false) return false;

    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    return true;
  };

  const normalizeKey = (key) => {
    return String(key)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .trim()
      .toLowerCase();
  };

  const formatKey = (key) => {
    const normalized = normalizeKey(key);

    const labels = {
      residentialcomplex: "Жилой комплекс",
      residentialcomplexname: "Жилой комплекс",
      residential_complex: "Жилой комплекс",
      residential_complex_name: "Жилой комплекс",
      developerorcomplex: "Застройщик / ЖК",
      developer_or_complex: "Застройщик / ЖК",
      developer: "Застройщик",
      developername: "Застройщик",
      developer_name: "Застройщик",

      buildingtype: "Тип дома",
      building_type: "Тип дома",
      housetype: "Тип дома",
      house_type: "Тип дома",

      floor: "Этаж",
      floors: "Этажность",

      rooms: "Комнаты",
      area: "Площадь",

      year: "Год",
      yearbuilt: "Год постройки",
      year_built: "Год постройки",

      repair: "Ремонт",
      condition: "Состояние",
      furniture: "Мебель",

      ceilingheight: "Высота потолков",
      ceiling_height: "Высота потолков",

      bathroom: "Санузел",
      bathrooms: "Количество санузлов",

      heating: "Отопление",
      heatingtype: "Тип отопления",
      heating_type: "Тип отопления",

      sewerage: "Канализация",
      sewer: "Канализация",

      water: "Водоснабжение",
      watersupply: "Водоснабжение",
      water_supply: "Водоснабжение",

      electricity: "Электричество",
      gas: "Газ",

      documents: "Документы",
      document: "Документы",

      parking: "Парковка",
      parkingtype: "Тип парковки",
      parking_type: "Тип парковки",

      view: "Вид",
      orientation: "Ориентация",

      landarea: "Площадь участка",
      land_area: "Площадь участка",

      areasotka: "Площадь участка",
      area_sotka: "Площадь участка",
      sotka: "Площадь участка",
      sotok: "Площадь участка",

      blocks: "Количество блоков",
      blockcount: "Количество блоков",
      block_count: "Количество блоков",

      construction: "Конструкция",
      constructiontype: "Тип конструкции",
      construction_type: "Тип конструкции",

      entrances: "Количество входов",
      entrancecount: "Количество входов",
      entrance_count: "Количество входов",

      yardarea: "Площадь двора",
      yard_area: "Площадь двора",

      landwidth: "Ширина участка",
      land_width: "Ширина участка",

      landlength: "Длина участка",
      land_length: "Длина участка",

      offerType: "Тип предложения",
      offertype: "Тип предложения",

      purpose: "Назначение",
      fence: "Ограждение",
      terrain: "Рельеф",
      landlocation: "Расположение участка",

      roomlocation: "Расположение комнаты",
      roomsinapartment: "Комнат в квартире",
      privatebathroom: "Личный санузел",

      premisesType: "Тип помещения",
      premisestype: "Тип помещения",
      technicalparameters: "Технические параметры",
      firstline: "Первая линия",
      separateentrance: "Отдельный вход",
      rentalbusiness: "Готовый арендный бизнес",

      material: "Материал",
      gates: "Ворота",
      truckaccess: "Заезд для грузовых",
      gatetype: "Тип ворот",

      pets: "Домашние животные",
      internet: "Интернет",
      balcony: "Балкон",
      elevator: "Лифт",
      security: "Охрана",
      parkingplace: "Парковочное место",
    };

    const compact = normalized.replace(/\s/g, "");

    return (
      labels[normalized] ||
      labels[compact] ||
      String(key)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    );
  };

  const getRaw = (...keys) => {
    for (const key of keys) {
      if (hasValue(raw[key])) {
        return raw[key];
      }
    }

    return null;
  };

  const formatDisplayValue = (value) => {
    if (!hasValue(value)) return null;

    if (typeof value === "boolean") {
      return value ? "Есть" : "Нет";
    }

    if (Array.isArray(value)) {
      return value
        .filter(Boolean)
        .map((item) => {
          if (typeof item === "object") {
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
        .join(", ");
    }

    if (typeof value === "object") {
      return (
        value.name ||
        value.title ||
        value.label ||
        value.value ||
        JSON.stringify(value)
      );
    }

    return String(value);
  };

  /*
   * =========================================================
   * CHARACTERISTICS
   *
   * Основные поля идут первыми.
   * После них автоматически добавляются все остальные
   * значения из rawFeatures.
   * =========================================================
   */

  const characteristics = useMemo(() => {
    if (!product) return [];

    const items = [];
    const usedKeys = new Set();

    const markUsed = (...keys) => {
      keys.forEach((key) => usedKeys.add(key));
    };

    const add = (icon, label, value, ...keys) => {
      if (!hasValue(value)) return;

      items.push({
        icon,
        label,
        value: formatDisplayValue(value),
      });

      if (keys.length > 0) {
        markUsed(...keys);
      }
    };

    /*
     * =======================================================
     * ОСНОВНЫЕ
     * =======================================================
     */

    add(BedDouble, "Комнаты", product.rooms, "rooms");

    add(Ruler, "Площадь", product.area, "area");

    add(Layers3, "Этаж", getRaw("floor") ?? product.floor, "floor");

    add(Building2, "Этажность", getRaw("floors") ?? product.floors, "floors");

    add(Home, "Тип недвижимости", product.type, "type");

    /*
     * =======================================================
     * ЖК
     * =======================================================
     */

    const residentialComplex = getRaw(
      "residentialComplex",
      "residential_complex",
      "residentialComplexName",
      "residential_complex_name",
      "developerOrComplex",
      "developer_or_complex",
      "complex",
      "complexName",
      "complex_name",
      "zhk",
    );

    if (hasValue(residentialComplex)) {
      add(
        Building2,
        "Жилой комплекс",
        residentialComplex,
        "residentialComplex",
        "residential_complex",
        "residentialComplexName",
        "residential_complex_name",
        "developerOrComplex",
        "developer_or_complex",
        "complex",
        "complexName",
        "complex_name",
        "zhk",
      );
    }

    /*
     * =======================================================
     * ЗАСТРОЙЩИК
     * =======================================================
     */

    const developer = getRaw("developer", "developerName", "developer_name");

    if (
      hasValue(developer) &&
      formatDisplayValue(developer) !== formatDisplayValue(residentialComplex)
    ) {
      add(
        Building2,
        "Застройщик",
        developer,
        "developer",
        "developerName",
        "developer_name",
      );
    }

    /*
     * =======================================================
     * ДОМ
     * =======================================================
     */

    add(
      Building,
      "Тип дома",
      getRaw("buildingType", "building_type", "houseType", "house_type"),
      "buildingType",
      "building_type",
      "houseType",
      "house_type",
    );

    /*
     * =======================================================
     * ГОД
     * =======================================================
     */

    add(
      CalendarDays,
      "Год постройки",
      getRaw(
        "yearBuilt",
        "year_built",
        "year",
        "constructionYear",
        "construction_year",
      ),
      "year",
      "yearBuilt",
      "year_built",
      "constructionYear",
      "construction_year",
    );

    /*
     * =======================================================
     * СОСТОЯНИЕ
     * =======================================================
     */

    add(
      Sparkles,
      "Ремонт",
      getRaw("repair", "condition", "state"),
      "repair",
      "condition",
      "state",
    );

    add(
      Sofa,
      "Мебель",
      getRaw("furniture", "furnished"),
      "furniture",
      "furnished",
    );

    /*
     * =======================================================
     * ПОТОЛКИ
     * =======================================================
     */

    const ceilingHeight = getRaw("ceilingHeight", "ceiling_height");

    if (hasValue(ceilingHeight)) {
      add(
        Maximize,
        "Высота потолков",
        String(ceilingHeight).includes("м")
          ? ceilingHeight
          : `${ceilingHeight} м`,
        "ceilingHeight",
        "ceiling_height",
      );
    }

    /*
     * =======================================================
     * САНУЗЕЛ
     * =======================================================
     */

    add(
      Bath,
      "Санузел",
      getRaw("bathroom", "bathroomType", "bathroom_type"),
      "bathroom",
      "bathroomType",
      "bathroom_type",
    );

    add(
      Bath,
      "Количество санузлов",
      getRaw("bathrooms", "bathroomCount", "bathroom_count"),
      "bathrooms",
      "bathroomCount",
      "bathroom_count",
    );

    /*
     * =======================================================
     * ОТОПЛЕНИЕ
     * =======================================================
     */

    add(
      Flame,
      "Отопление",
      getRaw("heating", "heatingType", "heating_type"),
      "heating",
      "heatingType",
      "heating_type",
    );

    /*
     * =======================================================
     * КОММУНИКАЦИИ
     * =======================================================
     */

    add(
      Droplets,
      "Канализация",
      getRaw("sewerage", "sewer", "sewerageType", "sewerage_type"),
      "sewerage",
      "sewer",
      "sewerageType",
      "sewerage_type",
    );

    add(
      Droplets,
      "Водоснабжение",
      getRaw("water", "waterSupply", "water_supply"),
      "water",
      "waterSupply",
      "water_supply",
    );

    const electricity = getRaw(
      "electricity",
      "electricityType",
      "electricity_type",
    );

    if (hasValue(electricity)) {
      add(
        Zap,
        "Электричество",
        electricity === true ? "Есть" : electricity,
        "electricity",
        "electricityType",
        "electricity_type",
      );
    }

    const gas = getRaw("gas", "gasSupply", "gas_supply");

    if (hasValue(gas)) {
      add(
        Flame,
        "Газ",
        gas === true ? "Есть" : gas,
        "gas",
        "gasSupply",
        "gas_supply",
      );
    }

    /*
     * =======================================================
     * ДОКУМЕНТЫ
     * =======================================================
     */

    add(
      FileCheck,
      "Документы",
      getRaw("documents", "document", "documentStatus", "document_status"),
      "documents",
      "document",
      "documentStatus",
      "document_status",
    );

    /*
     * =======================================================
     * ПАРКОВКА
     * =======================================================
     */

    add(
      CarFront,
      "Парковка",
      getRaw("parking", "parkingType", "parking_type"),
      "parking",
      "parkingType",
      "parking_type",
    );

    /*
     * =======================================================
     * ВИД
     * =======================================================
     */

    add(
      Waves,
      "Вид",
      getRaw("view", "viewType", "view_type"),
      "view",
      "viewType",
      "view_type",
    );

    add(
      Compass,
      "Ориентация",
      getRaw("orientation", "direction"),
      "orientation",
      "direction",
    );

    /*
     * =======================================================
     * УЧАСТОК
     * =======================================================
     */

    const landArea = getRaw("landArea", "land_area");

    if (hasValue(landArea)) {
      add(LandPlot, "Площадь участка", landArea, "landArea", "land_area");
    }

    const areaSotka = getRaw("areaSotka", "area_sotka", "sotka", "sotok");

    if (hasValue(areaSotka)) {
      add(
        LandPlot,
        "Площадь участка",
        String(areaSotka).includes("сот") ? areaSotka : `${areaSotka} соток`,
        "areaSotka",
        "area_sotka",
        "sotka",
        "sotok",
      );
    }

    /*
     * =======================================================
     * БЛОКИ
     * =======================================================
     */

    const blocks = getRaw("blocks", "blockCount", "block_count");

    if (hasValue(blocks)) {
      add(
        Layers3,
        "Количество блоков",
        String(blocks).includes("блок") ? blocks : `${blocks} блоков`,
        "blocks",
        "blockCount",
        "block_count",
      );
    }

    /*
     * =======================================================
     * КОНСТРУКЦИЯ
     * =======================================================
     */

    add(
      Building2,
      "Конструкция",
      getRaw("construction", "constructionType", "construction_type"),
      "construction",
      "constructionType",
      "construction_type",
    );

    /*
     * =======================================================
     * ДОПОЛНИТЕЛЬНЫЕ ПОЛЯ
     * =======================================================
     */

    add(
      DoorOpen,
      "Количество входов",
      getRaw("entrances", "entranceCount", "entrance_count"),
      "entrances",
      "entranceCount",
      "entrance_count",
    );

    add(
      Trees,
      "Площадь двора",
      getRaw("yardArea", "yard_area"),
      "yardArea",
      "yard_area",
    );

    add(
      Ruler,
      "Ширина участка",
      getRaw("landWidth", "land_width"),
      "landWidth",
      "land_width",
    );

    add(
      Ruler,
      "Длина участка",
      getRaw("landLength", "land_length"),
      "landLength",
      "land_length",
    );

    /*
     * =======================================================
     * СПЕЦИФИЧЕСКИЕ ПОЛЯ
     * =======================================================
     */

    const specificFields = [
      {
        keys: ["purpose"],
        icon: Tag,
      },
      {
        keys: ["fence"],
        icon: Home,
      },
      {
        keys: ["terrain"],
        icon: LandPlot,
      },
      {
        keys: ["landLocation", "land_location"],
        icon: MapPin,
      },
      {
        keys: ["roomLocation", "room_location"],
        icon: Home,
      },
      {
        keys: ["roomsInApartment", "rooms_in_apartment"],
        icon: BedDouble,
      },
      {
        keys: ["privateBathroom", "private_bathroom"],
        icon: Bath,
      },
      {
        keys: ["premisesType", "premises_type"],
        icon: Building,
      },
      {
        keys: ["technicalParameters", "technical_parameters"],
        icon: Ruler,
      },
      {
        keys: ["firstLine", "first_line"],
        icon: DoorOpen,
      },
      {
        keys: ["separateEntrance", "separate_entrance"],
        icon: DoorOpen,
      },
      {
        keys: ["rentalBusiness", "rental_business"],
        icon: CircleDollarSign,
      },
      {
        keys: ["material"],
        icon: Building2,
      },
      {
        keys: ["gates"],
        icon: DoorOpen,
      },
      {
        keys: ["truckAccess", "truck_access"],
        icon: CarFront,
      },
      {
        keys: ["gateType", "gate_type"],
        icon: DoorOpen,
      },
      {
        keys: ["offerType", "offer_type"],
        icon: Tag,
      },
    ];

    specificFields.forEach(({ keys, icon }) => {
      const value = getRaw(...keys);

      if (!hasValue(value)) return;

      const existingKey = keys.find((key) => usedKeys.has(key));

      if (existingKey) return;

      add(icon, formatKey(keys[0]), value, ...keys);
    });

    /*
     * =======================================================
     * ВСЕ ОСТАЛЬНЫЕ RAW FEATURES
     *
     * Это гарантирует, что новое поле из формы не потеряется.
     * =======================================================
     */

    Object.entries(raw).forEach(([key, value]) => {
      if (!hasValue(value)) return;

      if (usedKeys.has(key)) return;

      const normalized = normalizeKey(key);

      /*
       * Не показываем технические поля.
       */

      const technicalKeys = [
        "id",
        "listing id",
        "listingid",
        "created at",
        "createdat",
        "updated at",
        "updatedat",
        "image",
        "images",
        "photo",
        "photos",
      ];

      if (technicalKeys.includes(normalized)) {
        return;
      }

      /*
       * Amenities показываются отдельным блоком.
       */

      if (
        key === "amenities" ||
        normalized === "amenities" ||
        normalized === "удобства"
      ) {
        return;
      }

      const Icon = key.toLowerCase().includes("floor")
        ? Layers3
        : key.toLowerCase().includes("area")
          ? Ruler
          : key.toLowerCase().includes("water")
            ? Droplets
            : key.toLowerCase().includes("heating")
              ? Flame
              : key.toLowerCase().includes("parking")
                ? CarFront
                : key.toLowerCase().includes("document")
                  ? FileCheck
                  : key.toLowerCase().includes("year")
                    ? CalendarDays
                    : key.toLowerCase().includes("bath")
                      ? Bath
                      : key.toLowerCase().includes("view")
                        ? Waves
                        : key.toLowerCase().includes("electric")
                          ? Zap
                          : key.toLowerCase().includes("entrance")
                            ? DoorOpen
                            : Tag;

      const formattedValue = formatDisplayValue(value);

      if (!hasValue(formattedValue)) return;

      items.push({
        icon: Icon,
        label: formatKey(key),
        value: formattedValue,
      });

      usedKeys.add(key);
    });

    /*
     * =======================================================
     * РАССТОЯНИЕ ДО ПЛЯЖА
     * =======================================================
     */

    if (
      hasValue(product.beachDistance) &&
      !items.some((item) => item.label === "Расстояние до пляжа")
    ) {
      items.push({
        icon: Waves,
        label: "Расстояние до пляжа",
        value: `${product.beachDistance} м`,
      });
    }

    return items;
  }, [product]);

  /*
   * =========================================================
   * AMENITIES
   * =========================================================
   */

  const amenities = useMemo(() => {
    if (!product) return [];

    const source = raw.amenities;

    if (Array.isArray(source)) {
      return source
        .filter(Boolean)
        .map((item) => {
          if (typeof item === "object") {
            return item.name || item.title || item.label || item.value;
          }

          return String(item);
        })
        .filter(Boolean);
    }

    if (source) {
      return [String(source)];
    }

    return [];
  }, [product]);

  /*
   * =========================================================
   * GALLERY
   * =========================================================
   */

  const images = Array.isArray(product?.images) ? product.images : [];

  const nextImage = () => {
    if (!images.length) return;

    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    if (!images.length) return;

    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  /*
   * =========================================================
   * EDIT
   * =========================================================
   */

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
  };

  const handleSave = async (updatedProduct) => {
    try {
      const updatedImages = updatedProduct.image
        ? [updatedProduct.image, ...(product.images?.slice(1) || [])]
        : product.images;

      setProduct((prev) => ({
        ...prev,
        ...updatedProduct,
        images: updatedImages,
      }));

      setCurrentImage(0);
      setShowEditModal(false);
    } catch (err) {
      console.error("Ошибка сохранения объявления:", err);
    }
  };

  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  const handleDelete = async () => {
    try {
      console.log("Удаление объявления:", product.id);

      setShowDeleteModal(false);

      router.push("/profile/ads");
    } catch (err) {
      console.error("Ошибка удаления объявления:", err);
    }
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.state}>
          <div className={styles.stateLoader} />

          <h2>Загрузка объявления...</h2>

          <p>Получаем информацию об объекте</p>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (error || !product) {
    return (
      <main className={styles.page}>
        <div className={styles.state}>
          <div className={styles.stateIcon}>
            <Home size={28} />
          </div>

          <h2>Объявление не найдено</h2>

          <p>{error || "Не удалось загрузить данные объявления."}</p>

          <button
            type="button"
            className={styles.stateButton}
            onClick={() => router.push("/profile/ads")}
          >
            <ArrowLeft size={18} />
            Вернуться к объявлениям
          </button>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* TOP BAR */}

        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.back}
            onClick={() => router.push("/profile/ads")}
          >
            <ArrowLeft size={18} />
            Мои объявления
          </button>

          <span className={styles.ownerBadge}>
            <Home size={15} />
            МОЁ ОБЪЯВЛЕНИЕ
          </span>
        </div>

        {/* TOP */}

        <section className={styles.top}>
          {/* GALLERY */}

          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              {images.length > 0 ? (
                <Image
                  src={images[currentImage]}
                  alt={product.title || "Объект недвижимости"}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 65vw"
                />
              ) : (
                <div className={styles.noImage}>
                  <Home size={48} />
                  <span>Нет фотографий</span>
                </div>
              )}

              <div className={styles.imageOverlay} />

              {/* BADGES */}

              <div className={styles.badges}>
                {product.status === "vip" && (
                  <span className={`${styles.badge} ${styles.vip}`}>
                    <Sparkles size={14} />
                    VIP
                  </span>
                )}

                {product.status === "urgent" && (
                  <span className={`${styles.badge} ${styles.urgent}`}>
                    <Flame size={14} />
                    Срочно
                  </span>
                )}

                {product.type && (
                  <span className={styles.categoryBadge}>{product.type}</span>
                )}
              </div>

              {/* ACTIONS */}

              <div className={styles.imageActions}>
                <button
                  type="button"
                  className={styles.imageEdit}
                  onClick={handleEdit}
                >
                  <Pencil size={16} />
                  Изменить
                </button>

                <button
                  type="button"
                  className={styles.imageDelete}
                  onClick={() => setShowDeleteModal(true)}
                  aria-label="Удалить объявление"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* FAVORITE */}

              <button
                type="button"
                className={`${styles.favorite} ${
                  isFavorite ? styles.favoriteActive : ""
                }`}
                onClick={() => setIsFavorite((prev) => !prev)}
                aria-label="Добавить в избранное"
              >
                <Heart size={23} fill={isFavorite ? "currentColor" : "none"} />
              </button>

              {/* ARROWS */}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.left}`}
                    onClick={previousImage}
                    aria-label="Предыдущее фото"
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.right}`}
                    onClick={nextImage}
                    aria-label="Следующее фото"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}

              {/* COUNTER */}

              {images.length > 0 && (
                <div className={styles.imageCounter}>
                  {currentImage + 1} / {images.length}
                </div>
              )}

              {/* IMAGE TITLE */}

              <div className={styles.imageTitle}>
                <span>МОЯ НЕДВИЖИМОСТЬ</span>

                <strong>{product.title}</strong>
              </div>
            </div>

            {/* THUMBNAILS */}

            {images.length > 1 && (
              <>
                <div className={styles.thumbnails}>
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={
                        index === currentImage
                          ? `${styles.thumbnail} ${styles.thumbnailActive}`
                          : styles.thumbnail
                      }
                      onClick={() => setCurrentImage(index)}
                    >
                      <Image
                        src={image}
                        alt={`Фото ${index + 1}`}
                        fill
                        sizes="100px"
                      />
                    </button>
                  ))}
                </div>

                <div className={styles.dots}>
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={
                        index === currentImage
                          ? `${styles.dot} ${styles.dotActive}`
                          : styles.dot
                      }
                      onClick={() => setCurrentImage(index)}
                      aria-label={`Фото ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* SUMMARY */}

          <div className={styles.summary}>
            <div className={styles.summaryTop}>
              {product.dealType && (
                <span className={styles.deal}>{product.dealType}</span>
              )}

              <span className={styles.published}>
                <CheckCircle2 size={13} />
                Опубликовано
              </span>
            </div>

            <h1>{product.title}</h1>

            {(product.location || product.address) && (
              <div className={styles.location}>
                <MapPin size={20} />

                <div>
                  {product.location && <strong>{product.location}</strong>}

                  {product.address && <span>{product.address}</span>}
                </div>
              </div>
            )}

            <div className={styles.price}>{product.price}</div>

            {/* QUICK INFO */}

            <div className={styles.quickInfo}>
              {hasValue(product.rooms) && (
                <div>
                  <BedDouble />

                  <span>
                    <b>{product.rooms}</b>
                    комнат
                  </span>
                </div>
              )}

              {hasValue(product.area) && (
                <div>
                  <Ruler />

                  <span>
                    <b>{product.area}</b>
                    площадь
                  </span>
                </div>
              )}

              {hasValue(raw.floor ?? product.floor) && (
                <div>
                  <Layers3 />

                  <span>
                    <b>{raw.floor ?? product.floor}</b>
                    этаж
                  </span>
                </div>
              )}

              {hasValue(product.beachDistance) && (
                <div>
                  <Waves />

                  <span>
                    <b>{product.beachDistance} м</b>
                    до пляжа
                  </span>
                </div>
              )}
            </div>

            {/* MANAGEMENT */}

            <div className={styles.management}>
              <button
                type="button"
                className={styles.editButton}
                onClick={handleEdit}
              >
                <Pencil size={17} />
                Редактировать
              </button>

              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={17} />
                Удалить
              </button>
            </div>
          </div>
        </section>

        {/* CONTENT */}

        <div className={styles.contentGrid}>
          <div className={styles.mainContent}>
            {/* DESCRIPTION */}

            {product.description && (
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

                <p className={styles.description}>{product.description}</p>
              </section>
            )}

            {/* CHARACTERISTICS */}

            {characteristics.length > 0 && (
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

                <div className={styles.characteristics}>
                  {characteristics.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        className={styles.characteristic}
                        key={`${item.label}-${index}`}
                      >
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
              </section>
            )}

            {/* AMENITIES */}

            {amenities.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <Sparkles />
                  </div>

                  <div>
                    <span>ДОПОЛНИТЕЛЬНО</span>

                    <h2>Удобства</h2>
                  </div>
                </div>

                <div className={styles.amenities}>
                  {amenities.map((item, index) => (
                    <div className={styles.amenity} key={`${item}-${index}`}>
                      <ShieldCheck size={17} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ADDRESS */}

            {(product.location || product.address) && (
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
                    {product.location && <strong>{product.location}</strong>}

                    {product.address && <p>{product.address}</p>}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR */}

          <aside className={styles.sidebar}>
            {/* INFORMATION */}

            <div className={styles.sideCard}>
              <div className={styles.sideTop}>
                <Tag />
                <span>Информация</span>
              </div>

              {product.type && (
                <div className={styles.sideRow}>
                  <span>Категория</span>

                  <strong>{product.type}</strong>
                </div>
              )}

              {product.dealType && (
                <div className={styles.sideRow}>
                  <span>Тип предложения</span>

                  <strong>{product.dealType}</strong>
                </div>
              )}

              {product.createdAt && (
                <div className={styles.sideRow}>
                  <span>Дата публикации</span>

                  <strong>{product.createdAt}</strong>
                </div>
              )}

              {product.price && (
                <div className={styles.sideRow}>
                  <span>Стоимость</span>

                  <strong>{product.price}</strong>
                </div>
              )}

              {product.beachDistance && (
                <div className={styles.sideRow}>
                  <span>До пляжа</span>

                  <strong>{product.beachDistance} м</strong>
                </div>
              )}
            </div>

            {/* MANAGEMENT */}

            <div className={styles.ownerCard}>
              <div className={styles.ownerHeader}>
                <Building2 />
                Управление объявлением
              </div>

              <button
                type="button"
                onClick={handleEdit}
                className={styles.sideEdit}
              >
                <Pencil size={16} />
                Редактировать
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className={styles.sideDelete}
              >
                <Trash2 size={16} />
                Удалить объявление
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* DELETE */}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Удалить объявление?"
        description={`Вы действительно хотите удалить «${product.title}»? Это действие нельзя будет отменить.`}
      />

      {/* EDIT */}

      <AdsEditModal
        isOpen={showEditModal}
        listing={product}
        onClose={handleCloseEdit}
        onSave={handleSave}
      />
    </main>
  );
}
