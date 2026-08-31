"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getListingById,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/utils/api";

import { mapListingDetail } from "@/utils/mapListingData";

import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MapPin,
  Home,
  Ruler,
  BedDouble,
  Building2,
  UserRound,
  Phone,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Tag,
  Layers3,
  Flame,
  Sparkles,
  CarFront,
  Waves,
  Zap,
  Droplets,
  FileCheck,
  CalendarDays,
  KeyRound,
  Map,
  CircleDollarSign,
  Trees,
  Bath,
  Sofa,
  Wifi,
  Wind,
  CheckCircle2,
  DoorOpen,
  Compass,
  LandPlot,
} from "lucide-react";

import styles from "./ProductDetails.module.css";

const FALLBACK_AMENITIES = [
  "Парковка",
  "Закрытая территория",
  "Видеонаблюдение",
];

/*
 * Комнаты имеют смысл только для этих типов недвижимости.
 *
 * Все остальные типы, например:
 * - Паркинг
 * - Коммерция
 * - Гараж
 *
 * не должны показывать количество комнат.
 */
const ROOM_TYPES = ["квартира", "дом", "коттедж", "комната"];

function normalizeType(value) {
  if (!value) return "";

  return String(value).trim().toLowerCase().replace(/ё/g, "е");
}

function canShowRooms(product) {
  const type = normalizeType(getRawValue(product, "type", "category"));

  return ROOM_TYPES.some((allowedType) => type.includes(allowedType));
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value ? "Есть" : "Нет";
  }

  return String(value);
}

function formatArea(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const stringValue = String(value);

  if (
    stringValue.includes("м²") ||
    stringValue.includes("м2") ||
    stringValue.includes("сот")
  ) {
    return stringValue;
  }

  return `${stringValue} м²`;
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return `${new Intl.NumberFormat("ru-RU").format(value)} сом`;
  }

  return String(value);
}

function getRawValue(product, ...keys) {
  for (const key of keys) {
    const value = product?.rawFeatures?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }

    const productValue = product?.[key];

    if (
      productValue !== undefined &&
      productValue !== null &&
      productValue !== ""
    ) {
      return productValue;
    }
  }

  return null;
}

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    getListingById(id)
      .then((res) => {
        if (res.success && res.data) {
          setProduct(mapListingDetail(res.data));
        } else {
          setError(res.message || "Объявление не найдено");
        }
      })
      .catch((err) => {
        console.error("Fetch listing details error:", err);
        setError("Ошибка при загрузке данных объявления");
      })
      .finally(() => {
        setLoading(false);
      });

    const token = localStorage.getItem("uytap_token");

    if (!token) return;

    getFavorites(token)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const isFav = res.data.some(
            (listing) => String(listing.id) === String(id),
          );

          setIsFavorite(isFav);
        }
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
      });
  }, [id]);

  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem("uytap_token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (isFavoriteLoading) return;

    setIsFavoriteLoading(true);

    try {
      if (isFavorite) {
        const res = await removeFavorite(token, id);

        if (res.success) {
          setIsFavorite(false);
        }
      } else {
        const res = await addFavorite(token, id);

        if (res.success) {
          setIsFavorite(true);
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const nextImage = () => {
    if (!product?.images?.length) return;

    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const previousImage = () => {
    if (!product?.images?.length) return;

    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  /*
   * ========================================================
   * ХАРАКТЕРИСТИКИ
   * ========================================================
   */

  const characteristics = useMemo(() => {
    if (!product) return [];

    const result = [];

    const add = (icon, label, value, formatter = formatValue) => {
      const formatted = formatter(value);

      if (formatted !== null) {
        result.push({
          icon,
          label,
          value: formatted,
        });
      }
    };

    /*
     * Количество комнат добавляем только для:
     * квартира / дом / коттедж / комната
     */
    if (canShowRooms(product)) {
      add(BedDouble, "Количество комнат", getRawValue(product, "rooms"));
    }

    add(Ruler, "Площадь", getRawValue(product, "area", "areaFrom"), formatArea);

    add(
      LandPlot,
      "Площадь участка",
      getRawValue(product, "landArea", "areaSotka", "plotArea"),
      formatArea,
    );

    add(Layers3, "Этаж", getRawValue(product, "floor", "currentFloor"));

    add(Building2, "Этажность", getRawValue(product, "floors", "totalFloors"));

    add(Home, "Тип объекта", getRawValue(product, "type", "category"));

    add(Tag, "Категория", getRawValue(product, "category", "type"));

    add(CircleDollarSign, "Тип сделки", getRawValue(product, "dealType"));

    add(CalendarDays, "Период аренды", getRawValue(product, "rentalPeriod"));

    add(KeyRound, "Тип объявления", getRawValue(product, "listingType"));

    /*
     * ЛОКАЦИЯ
     */

    add(Map, "Страна", getRawValue(product, "country"));

    add(MapPin, "Область / регион", getRawValue(product, "region"));

    add(MapPin, "Город", getRawValue(product, "city"));

    add(MapPin, "Населённый пункт", getRawValue(product, "settlement"));

    add(MapPin, "Район", getRawValue(product, "district"));

    /*
     * ДОПОЛНИТЕЛЬНЫЕ ПОЛЯ
     */

    add(Flame, "Отопление", getRawValue(product, "heating"));

    add(Droplets, "Канализация", getRawValue(product, "sewerage"));

    add(Zap, "Электричество", getRawValue(product, "electricity"));

    add(FileCheck, "Документы", getRawValue(product, "documents"));

    add(CarFront, "Парковка", getRawValue(product, "parking"));

    add(
      Ruler,
      "Высота потолков",
      getRawValue(product, "ceilingHeight"),
      (value) => {
        const formatted = formatValue(value);

        if (!formatted) return null;

        return formatted.includes("м") ? formatted : `${formatted} м`;
      },
    );

    add(Building2, "Тип дома", getRawValue(product, "buildingType"));

    add(Sparkles, "Ремонт", getRawValue(product, "repair"));

    add(
      Building2,
      "Застройщик / ЖК",
      getRawValue(product, "developerOrComplex"),
    );

    add(
      Layers3,
      "Количество блоков",
      getRawValue(product, "blocks"),
      (value) => {
        const formatted = formatValue(value);

        if (!formatted) return null;

        return formatted.toLowerCase().includes("блок")
          ? formatted
          : `${formatted} блоков`;
      },
    );

    add(
      Building2,
      "Конструкция",
      getRawValue(product, "construction", "constructionType"),
    );

    add(Compass, "Вид", getRawValue(product, "view"));

    add(
      Trees,
      "Расстояние до пляжа",
      getRawValue(product, "beachDistance"),
      (value) => {
        const formatted = formatValue(value);

        if (!formatted) return null;

        return formatted.includes("м") ? formatted : `${formatted} м`;
      },
    );

    add(Bath, "Санузел", getRawValue(product, "bathroom", "bathrooms"));

    add(Sofa, "Мебель", getRawValue(product, "furniture"));

    add(Wifi, "Интернет", getRawValue(product, "internet", "wifi"));

    add(Wind, "Кондиционер", getRawValue(product, "airConditioning"));

    add(DoorOpen, "Балкон", getRawValue(product, "balcony"));

    return result;
  }, [product]);

  /*
   * ========================================================
   * УДОБСТВА
   * ========================================================
   */

  const amenities = useMemo(() => {
    if (!product) return [];

    const rawAmenities = product.rawFeatures?.amenities;

    if (Array.isArray(rawAmenities)) {
      return rawAmenities.filter(Boolean);
    }

    if (rawAmenities) {
      return [rawAmenities];
    }

    return FALLBACK_AMENITIES;
  }, [product]);

  /*
   * ========================================================
   * ЛОКАЦИЯ
   * ========================================================
   */

  const locationParts = useMemo(() => {
    if (!product) return [];

    const values = [product.country, product.city].filter(
      (value) =>
        value !== null && value !== undefined && String(value).trim() !== "",
    );

    return [...new Set(values.map(String))];
  }, [product]);

  /*
   * ========================================================
   * QUICK INFO
   * ========================================================
   */

  const quickInfo = useMemo(() => {
    if (!product) return [];

    const result = [];

    /*
     * Комнаты показываем только разрешённым типам.
     */
    if (canShowRooms(product)) {
      const rooms = getRawValue(product, "rooms");

      if (rooms !== null && Number(rooms) > 0) {
        result.push({
          icon: BedDouble,
          value: rooms,
          label: "комнат",
        });
      }
    }

    const area = getRawValue(product, "area");

    const floor = getRawValue(product, "floor");

    const floors = getRawValue(product, "floors");

    const landArea = getRawValue(product, "landArea", "areaSotka");

    if (area) {
      result.push({
        icon: Ruler,
        value: formatArea(area),
        label: "",
      });
    }

    if (landArea) {
      result.push({
        icon: LandPlot,
        value: formatArea(landArea),
        label: "участок",
      });
    }

    if (floor) {
      result.push({
        icon: Layers3,
        value: floors ? `${floor} / ${floors}` : floor,
        label: floors ? "этаж" : "",
      });
    }

    const beachDistance = getRawValue(product, "beachDistance");

    if (beachDistance) {
      result.push({
        icon: Waves,
        value: `${beachDistance} м`,
        label: "до пляжа",
      });
    }

    return result.slice(0, 5);
  }, [product]);

  /*
   * ========================================================
   * LOADING
   * ========================================================
   */

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />

          <h2>Загрузка объявления...</h2>

          <p>Получаем информацию об объекте</p>
        </div>
      </main>
    );
  }

  /*
   * ========================================================
   * ERROR
   * ========================================================
   */

  if (error || !product) {
    return (
      <main className={styles.page}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>
            <Home size={28} />
          </div>

          <h2>Объявление не найдено</h2>

          <p>{error || "Не удалось загрузить данные."}</p>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => router.push("/all-products")}
          >
            <ArrowLeft size={18} />
            Вернуться к объявлениям
          </button>
        </div>
      </main>
    );
  }

  const images =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : ["/placeholder-property.jpg"];

  const currentImageSrc = images[currentImage] || images[0];

  const price = product.price || formatPrice(getRawValue(product, "price"));

  const address = product.address || locationParts.join(", ");

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* BACK */}

        <button
          type="button"
          className={styles.back}
          onClick={() => router.push("/all-products")}
        >
          <ArrowLeft size={18} />
          Вернуться к объявлениям
        </button>

        {/* TOP */}

        <section className={styles.top}>
          {/* GALLERY */}

          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <Image
                src={currentImageSrc}
                alt={product.title || "Объект недвижимости"}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 65vw"
              />

              <div className={styles.imageOverlay} />

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

              <button
                type="button"
                className={`${styles.favorite} ${
                  isFavorite ? styles.favoriteActive : ""
                }`}
                onClick={handleFavoriteToggle}
                disabled={isFavoriteLoading}
                aria-label="Добавить в избранное"
              >
                <Heart size={23} fill={isFavorite ? "currentColor" : "none"} />
              </button>

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

              <div className={styles.imageCounter}>
                {currentImage + 1} / {images.length}
              </div>
            </div>

            {images.length > 1 && (
              <>
                <div className={styles.thumbnails}>
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={`${styles.thumbnail} ${
                        index === currentImage ? styles.thumbnailActive : ""
                      }`}
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
                      className={`${styles.dot} ${
                        index === currentImage ? styles.dotActive : ""
                      }`}
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
              <div className={styles.summaryLabels}>
                {product.dealType && (
                  <span className={styles.deal}>{product.dealType}</span>
                )}

                {product.listingType && (
                  <span className={styles.listingType}>
                    {product.listingType}
                  </span>
                )}
              </div>
            </div>

            <h1>{product.title || "Объект недвижимости"}</h1>

            <div className={styles.location}>
              <MapPin size={20} />

              <div>
                {locationParts.length > 0 ? (
                  <strong>{locationParts.join(", ")}</strong>
                ) : (
                  <strong>Местоположение не указано</strong>
                )}

                {product.address && <span>{product.address}</span>}
              </div>
            </div>

            {price && <div className={styles.price}>{price}</div>}

            {product.rentalPeriod && (
              <div className={styles.rentalInfo}>
                <CalendarDays size={16} />

                <span>
                  Период аренды: <strong>{product.rentalPeriod}</strong>
                </span>
              </div>
            )}

            {quickInfo.length > 0 && (
              <div
                className={`${styles.quickInfo} ${
                  quickInfo.length === 1 ? styles.quickInfoOne : ""
                }`}
              >
                {quickInfo.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div key={index}>
                      <Icon />

                      <span>
                        <b>{item.value}</b>

                        {item.label && <small>{item.label}</small>}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CONTENT */}

        <div className={styles.contentGrid}>
          <div className={styles.mainContent}>
            {/* ABOUT */}

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

            {/* MAIN INFORMATION */}

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

                  {address && <p>{address}</p>}

                  {product.latitude && product.longitude && (
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

              {product.category && (
                <div className={styles.sideRow}>
                  <span>Категория</span>

                  <strong>{product.category}</strong>
                </div>
              )}

              {product.type && (
                <div className={styles.sideRow}>
                  <span>Тип объекта</span>

                  <strong>{product.type}</strong>
                </div>
              )}

              {product.dealType && (
                <div className={styles.sideRow}>
                  <span>Тип сделки</span>

                  <strong>{product.dealType}</strong>
                </div>
              )}

              {product.rentalPeriod && (
                <div className={styles.sideRow}>
                  <span>Период аренды</span>

                  <strong>{product.rentalPeriod}</strong>
                </div>
              )}

              {product.listingType && (
                <div className={styles.sideRow}>
                  <span>Тип объявления</span>

                  <strong>{product.listingType}</strong>
                </div>
              )}

              {product.createdAt && (
                <div className={styles.sideRow}>
                  <span>Дата публикации</span>

                  <strong>{product.createdAt}</strong>
                </div>
              )}

              {product.beachDistance && (
                <div className={styles.sideRow}>
                  <span>До пляжа</span>

                  <strong>{product.beachDistance} м</strong>
                </div>
              )}
            </div>

            {/* LOCATION SUMMARY */}

            {locationParts.length > 0 && (
              <div className={styles.sideCard}>
                <div className={styles.sideTop}>
                  <MapPin />
                  <span>Локация</span>
                </div>

                {getRawValue(product, "country") && (
                  <div className={styles.sideRow}>
                    <span>Страна</span>

                    <strong>{getRawValue(product, "country")}</strong>
                  </div>
                )}

                {getRawValue(product, "region") && (
                  <div className={styles.sideRow}>
                    <span>Регион</span>

                    <strong>{getRawValue(product, "region")}</strong>
                  </div>
                )}

                {getRawValue(product, "city") && (
                  <div className={styles.sideRow}>
                    <span>Город</span>

                    <strong>{getRawValue(product, "city")}</strong>
                  </div>
                )}

                {getRawValue(product, "settlement") && (
                  <div className={styles.sideRow}>
                    <span>Населённый пункт</span>

                    <strong>{getRawValue(product, "settlement")}</strong>
                  </div>
                )}

                {getRawValue(product, "district") && (
                  <div className={styles.sideRow}>
                    <span>Район</span>

                    <strong>{getRawValue(product, "district")}</strong>
                  </div>
                )}
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
                      src={product.owner.avatar || "/default-avatar.png"}
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
                    <ArrowRight size={17} />
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
                  Хотите убедиться в юридической чистоте объекта? Запросите
                  проверку объявления у юриста.
                </p>
              </div>

              <button
                type="button"
                className={styles.lawyerButton}
                onClick={() => router.push("/lawyers")}
              >
                Запросить проверку
                <ArrowRight size={17} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
