"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getComplexById, getListings } from "@/utils/api";
import { mapComplexData } from "@/utils/mapComplexData";
import { mapListingData } from "@/utils/mapListingData";


import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MapPin,
  Building2,
  Ruler,
  Layers3,
  CalendarDays,
  CarFront,
  ShieldCheck,
  Sparkles,
  Trees,
  Zap,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  ExternalLink,
  Home,
  Maximize,
  Grid3X3,
} from "lucide-react";

import styles from "./ComplexDetail.module.css";
import ListingCard from "@/components/ui/ListingCard/ListingCard";

const MINSTROY_URL = "https://minstroy.gov.kg/ru/map";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1800&auto=format&fit=crop";

const EMPTY_COMPLEX = {
  id: null,
  name: "Жилой комплекс",
  developer: "Застройщик не указан",
  developerId: null,
  logo: null,

  address: "Кыргызстан",
  city: null,
  region: null,

  description: "Описание жилого комплекса отсутствует.",

  housingClass: "Класс не указан",
  completionStatus: "Статус не указан",
  completionDate: null,

  priceFrom: null,
  priceTo: null,

  images: [],

  floors: null,
  blocks: null,
  apartments: null,
  parking: null,
  ceilingHeight: null,
  construction: null,
  area: null,
  areaSotka: null,

  heating: null,
  electricity: null,
  security: null,
  videoSurveillance: null,

  documentsUrl: null,

  amenities: [],
  layouts: [],
};

const formatValue = (value, suffix = "") => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    Number(value) === 0
  ) {
    return "Не указано";
  }

  return `${value}${suffix}`;
};

const formatPrice = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    Number(value) <= 0
  ) {
    return null;
  }

  return `${Number(value).toLocaleString("ru-RU")} $`;
};

const formatDate = (value) => {
  if (!value) return "Уточняйте у застройщика";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getLayoutValue = (layout, keys) => {
  for (const key of keys) {
    if (
      layout?.[key] !== undefined &&
      layout?.[key] !== null &&
      layout?.[key] !== ""
    ) {
      return layout[key];
    }
  }

  return null;
};

/* =========================================================
   COMPLEX RELATION
========================================================= */

function getComplexReference(listing) {
  if (!listing) return null;

  const directIds = [
    listing.complexId,
    listing.complex_id,
    listing.residentialComplexId,
    listing.residential_complex_id,
    listing.projectId,
    listing.project_id,
    listing.complexID,
    listing.projectID,
  ];

  for (const value of directIds) {
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      Number.isFinite(Number(value))
    ) {
      return String(value);
    }

    if (value !== null && value !== undefined && value !== "") {
      return String(value);
    }
  }

  const nestedIds = [
    listing.complex?.id,
    listing.complex?.complexId,
    listing.residentialComplex?.id,
    listing.residential_complex?.id,
    listing.project?.id,
    listing.project?.projectId,
  ];

  for (const value of nestedIds) {
    if (value !== null && value !== undefined && value !== "") {
      return String(value);
    }
  }

  return null;
}

/* =========================================================
   CHECK AVAILABLE LISTING
========================================================= */

function isListingAvailable(item) {
  if (!item) return false;

  const booleanAvailability = [
    item.available,
    item.isAvailable,
    item.is_available,
    item.active,
    item.isActive,
    item.is_active,
    item.published,
    item.isPublished,
    item.is_published,
  ];

  const explicitBoolean = booleanAvailability.find(
    (value) => typeof value === "boolean",
  );

  if (explicitBoolean === false) {
    return false;
  }

  const status = String(
    item.availabilityStatus ??
      item.availability_status ??
      item.statusName ??
      item.listingStatus ??
      item.listing_status ??
      item.saleStatus ??
      item.sale_status ??
      item.status ??
      "",
  )
    .trim()
    .toLowerCase();

  if (
    status.includes("продан") ||
    status.includes("sold") ||
    status.includes("архив") ||
    status.includes("archive") ||
    status.includes("закрыт") ||
    status.includes("closed") ||
    status.includes("недоступ")
  ) {
    return false;
  }

  return true;
}

/* =========================================================
   NORMALIZE LISTING
========================================================= */

function normalizeApartmentListing(item) {
  if (!item) return null;

  try {
    const mapped = mapListingData(item);

    return {
      ...mapped,

      id: item.id ?? mapped.id,

      title:
        mapped.title || item.title || item.name || "Квартира в жилом комплексе",

      image:
        mapped.image ||
        mapped.images?.[0] ||
        item.cover_photo ||
        item.coverPhoto ||
        item.images?.[0] ||
        item.image ||
        null,

      location:
        mapped.location ||
        mapped.address ||
        item.address ||
        item.city ||
        "Адрес не указан",

      type:
        mapped.type ||
        item.type ||
        item.category ||
        item.propertyType ||
        "Квартира",

      description: mapped.description || item.description || "",

      rawComplexId: getComplexReference({
        ...item,
        ...mapped,
      }),

      isAvailable: isListingAvailable({
        ...item,
        ...mapped,
      }),
    };
  } catch (error) {
    console.error("Ошибка mapListingData для квартиры:", error, item);

    return null;
  }
}

export default function ComplexDetails() {
  const router = useRouter();
  const params = useParams();

  const complexId = params?.id;

  const [complex, setComplex] = useState(EMPTY_COMPLEX);

  const [apartments, setApartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [apartmentsLoading, setApartmentsLoading] = useState(true);

  const [error, setError] = useState("");
  const [apartmentsError, setApartmentsError] = useState("");

  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  /* =========================================================
     LOAD COMPLEX + APARTMENTS
  ========================================================= */

  useEffect(() => {
    if (!complexId) return;

    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setApartmentsLoading(true);
      setError("");
      setApartmentsError("");

      try {
        const [complexResponse, listingsResponse] = await Promise.all([
          getComplexById(complexId),
          getListings({
            page: 1,
            limit: 200,
          }),
        ]);

        if (cancelled) return;

        /* =========================
           COMPLEX
        ========================= */

        if (!complexResponse?.success || !complexResponse?.data) {
          throw new Error(
            complexResponse?.message || "Жилой комплекс не найден",
          );
        }

        const mappedComplex = mapComplexData(complexResponse.data);

        setComplex({
          ...EMPTY_COMPLEX,
          ...mappedComplex,
        });

        setCurrentImage(0);

        /* =========================
           APARTMENTS
        ========================= */

        if (listingsResponse?.success && Array.isArray(listingsResponse.data)) {
          const currentComplexId = String(complexId);

          const mappedApartments = listingsResponse.data
            .map(normalizeApartmentListing)
            .filter(Boolean)
            .filter((item) => {
              const propertyType = String(
                item.type || item.category || item.propertyType || "",
              )
                .trim()
                .toLowerCase();

              const isApartment =
                propertyType.includes("apartment") ||
                propertyType.includes("квартир") ||
                propertyType === "flat";

              if (!isApartment) {
                return false;
              }

              if (!item.isAvailable) {
                return false;
              }

              return item.rawComplexId === currentComplexId;
            });

          setApartments(mappedApartments);
        } else {
          setApartments([]);
        }
      } catch (err) {
        console.error("Failed to load complex detail:", err);

        if (!cancelled) {
          setError(err?.message || "Ошибка загрузки жилого комплекса");

          setApartments([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setApartmentsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [complexId]);

  /* =========================================================
     IMAGES
  ========================================================= */

  const images = useMemo(() => {
    if (complex.images?.length) {
      return complex.images;
    }

    return [FALLBACK_IMAGE];
  }, [complex.images]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
  };

  /* =========================================================
     DOCUMENTS
  ========================================================= */

  const openMinstroy = () => {
    const url = complex.documentsUrl || MINSTROY_URL;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* =========================================================
     PRICE
  ========================================================= */

  const priceText = useMemo(() => {
    const from = formatPrice(complex.priceFrom);
    const to = formatPrice(complex.priceTo);

    if (from && to && from !== to) {
      return `${from} — ${to}`;
    }

    if (from) {
      return `от ${from}`;
    }

    return "Цена по запросу";
  }, [complex.priceFrom, complex.priceTo]);

  /* =========================================================
     DETAIL ITEMS
  ========================================================= */

  const detailItems = [
    {
      label: "Класс",
      value: complex.housingClass,
      icon: Sparkles,
    },
    {
      label: "Количество квартир",
      value: formatValue(complex.apartments, " квартир"),
      icon: Home,
    },
    {
      label: "Этажность",
      value: formatValue(complex.floors, " этажей"),
      icon: Layers3,
    },
    {
      label: "Количество блоков",
      value: formatValue(complex.blocks, " блоков"),
      icon: Building2,
    },
    {
      label: "Площадь территории",
      value: complex.areaSotka
        ? `${complex.areaSotka} соток`
        : complex.area
          ? `${complex.area} м²`
          : "Не указано",
      icon: Ruler,
    },
    {
      label: "Высота потолков",
      value: formatValue(complex.ceilingHeight, " м"),
      icon: Maximize,
    },
    {
      label: "Конструкция",
      value: formatValue(complex.construction),
      icon: Grid3X3,
    },
    {
      label: "Паркинг",
      value: formatValue(complex.parking, " мест"),
      icon: CarFront,
    },
  ];

  /* =========================================================
     ENGINEERING
  ========================================================= */

  const engineeringItems = [
    {
      icon: Zap,
      title: "Отопление",
      value: complex.heating,
    },
    {
      icon: Zap,
      title: "Электроснабжение",
      value: complex.electricity,
    },
    {
      icon: ShieldCheck,
      title: "Безопасность",
      value: complex.security,
    },
    {
      icon: Camera,
      title: "Видеонаблюдение",
      value: complex.videoSurveillance,
    },
  ].filter(
    (item) =>
      item.value !== null && item.value !== undefined && item.value !== "",
  );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner} />
            <span>Загрузка жилого комплекса...</span>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <button
            type="button"
            className={styles.back}
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
            Вернуться назад
          </button>

          <div className={styles.error}>
            <div className={styles.errorIcon}>
              <Building2 size={28} />
            </div>

            <h1>Не удалось загрузить ЖК</h1>

            <p>{error}</p>

            <button type="button" onClick={() => window.location.reload()}>
              Попробовать снова
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* =====================================================
            BACK
        ===================================================== */}

        <button
          type="button"
          className={styles.back}
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} />
          Вернуться к объявлениям
        </button>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className={styles.hero}>
          {/* GALLERY */}

          <div className={styles.heroGallery}>
            <div className={styles.mainImage}>
              <Image
                src={images[currentImage]}
                alt={complex.name}
                fill
                priority
                sizes="(max-width: 1100px) 100vw, 68vw"
              />

              <div className={styles.imageGradient} />

              <div className={styles.heroBadges}>
                <span className={styles.premiumBadge}>
                  <Sparkles size={14} />
                  {complex.housingClass}
                </span>

                <span className={styles.statusBadge}>
                  {complex.completionStatus}
                </span>
              </div>

              <button
                type="button"
                className={styles.favorite}
                aria-label="Добавить в избранное"
                onClick={() => setIsFavorite((prev) => !prev)}
              >
                <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.galleryLeft}`}
                    onClick={previousImage}
                    aria-label="Предыдущее изображение"
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.galleryRight}`}
                    onClick={nextImage}
                    aria-label="Следующее изображение"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}

              <div className={styles.imageCounter}>
                {currentImage + 1} / {images.length}
              </div>

              <div className={styles.heroImageText}>
                <span>ЖИЛОЙ КОМПЛЕКС</span>
                <strong>{complex.name}</strong>
              </div>
            </div>

            {images.length > 1 && (
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
                      alt={`${complex.name} ${index + 1}`}
                      fill
                      sizes="110px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* HERO INFO */}

          <div className={styles.heroInfo}>
            <div className={styles.eyebrow}>
              <Building2 size={15} />
              ЖИЛОЙ КОМПЛЕКС
            </div>

            <h1>{complex.name}</h1>

            <p className={styles.heroSubtitle}>{complex.housingClass}</p>

            <div className={styles.heroLocation}>
              <MapPin size={19} />

              <div>
                {complex.city && <strong>{complex.city}</strong>}

                <span>{complex.address}</span>
              </div>
            </div>

            <div className={styles.heroDivider} />

            <div className={styles.priceBlock}>
              <span>СТОИМОСТЬ КВАРТИР</span>

              <strong>{priceText}</strong>
            </div>

            <div className={styles.developer}>
              <div className={styles.developerIcon}>
                {complex.logo ? (
                  <img src={complex.logo} alt={complex.developer} />
                ) : (
                  <Building2 size={18} />
                )}
              </div>

              <div>
                <span>ЗАСТРОЙЩИК</span>
                <strong>{complex.developer}</strong>
              </div>
            </div>

            <div className={styles.heroStats}>
              <div>
                <Layers3 />

                <span>
                  <strong>{formatValue(complex.floors)}</strong>
                  этажей
                </span>
              </div>

              <div>
                <Building2 />

                <span>
                  <strong>{formatValue(complex.blocks)}</strong>
                  блоков
                </span>
              </div>

              <div>
                <Home />

                <span>
                  <strong>{formatValue(complex.apartments)}</strong>
                  квартир
                </span>
              </div>
            </div>

            <div className={styles.completion}>
              <div className={styles.completionIcon}>
                <CalendarDays size={19} />
              </div>

              <div>
                <span>СРОК СДАЧИ</span>

                <strong>{formatDate(complex.completionDate)}</strong>
              </div>
            </div>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => {
                if (complex.developerId) {
                  router.push(`/public-profile/${complex.developerId}`);
                } else {
                  document.getElementById("apartments")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }}
            >
              Смотреть профиль застройщика
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* =====================================================
            AVAILABLE APARTMENTS
        ===================================================== */}

        <section
          className={`${styles.section} ${styles.apartmentsSection}`}
          id="apartments"
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Home />
            </div>

            <div>
              <span>ДОСТУПНЫЕ КВАРТИРЫ</span>

              <h2>Квартиры в {complex.name}</h2>
            </div>
          </div>

          {apartmentsLoading ? (
            <div className={styles.apartmentsLoading}>
              <div className={styles.loadingSpinner} />

              <span>Загружаем доступные квартиры...</span>
            </div>
          ) : apartments.length > 0 ? (
            <>
              <div className={styles.apartmentsHeader}>
                <div>
                  <strong>{apartments.length}</strong>

                  <span>
                    {apartments.length === 1
                      ? "доступная квартира"
                      : apartments.length < 5
                        ? "доступные квартиры"
                        : "доступных квартир"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("apartments")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                >
                  Все квартиры
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className={styles.apartmentsGrid}>
                {apartments.map((apartment) => (
                  <ListingCard
                    key={apartment.id}
                    item={apartment}
                    isFavorite={false}
                    onFavoriteClick={() => {}}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.noApartments}>
              <div className={styles.noApartmentsIcon}>
                <Home />
              </div>

              <h3>Свободных квартир пока нет</h3>

              <p>
                Сейчас в этом жилом комплексе нет доступных объявлений о продаже
                квартир.
              </p>
            </div>
          )}

          {apartmentsError && (
            <div className={styles.apartmentsError}>{apartmentsError}</div>
          )}
        </section>

        {/* =====================================================
            ABOUT
        ===================================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Building2 />
            </div>

            <div>
              <span>О ПРОЕКТЕ</span>
              <h2>О жилом комплексе</h2>
            </div>
          </div>

          <div className={styles.aboutGrid}>
            <div>
              <p className={styles.description}>{complex.description}</p>
            </div>

            <div className={styles.aboutHighlight}>
              <Sparkles />

              <strong>{complex.name}</strong>

              <span>
                Современный жилой комплекс с продуманной инфраструктурой и
                комфортной городской средой.
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            PROJECT DETAILS
        ===================================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Layers3 />
            </div>

            <div>
              <span>ОСНОВНЫЕ ПАРАМЕТРЫ</span>
              <h2>О проекте</h2>
            </div>
          </div>

          <div className={styles.projectDetails}>
            {detailItems.map((item) => {
              const Icon = item.icon;

              return (
                <div className={styles.detailCard} key={item.label}>
                  <div className={styles.detailIcon}>
                    <Icon size={18} />
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

        {/* =====================================================
            ENGINEERING
        ===================================================== */}

        {engineeringItems.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Zap />
              </div>

              <div>
                <span>ИНЖЕНЕРИЯ</span>
                <h2>Инженерные решения и безопасность</h2>
              </div>
            </div>

            <div className={styles.engineering}>
              {engineeringItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div className={styles.engineeringItem} key={item.title}>
                    <Icon />

                    <div>
                      <span>{item.title}</span>
                      <strong>{item.value}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =====================================================
            AMENITIES
        ===================================================== */}

        {complex.amenities?.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Trees />
              </div>

              <div>
                <span>ТЕРРИТОРИЯ</span>
                <h2>Инфраструктура комплекса</h2>
              </div>
            </div>

            <div className={styles.infrastructure}>
              {complex.amenities.map((item, index) => {
                const text =
                  typeof item === "string"
                    ? item
                    : item?.name || item?.title || item?.label || "";

                if (!text) return null;

                return (
                  <div
                    className={styles.infrastructureItem}
                    key={`${text}-${index}`}
                  >
                    <CheckCircle2 size={17} />
                    {text}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =====================================================
            LOCATION
        ===================================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <MapPin />
            </div>

            <div>
              <span>ЛОКАЦИЯ</span>
              <h2>Расположение</h2>
            </div>
          </div>

          <div className={styles.locationCard}>
            <div className={styles.locationContent}>
              <span>АДРЕС</span>

              <strong>{complex.address}</strong>

              {complex.city && <p>{complex.city}</p>}
            </div>
          </div>
        </section>

        {/* =====================================================
            APARTMENT LAYOUTS
        ===================================================== */}

        {complex.layouts?.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Home />
              </div>

              <div>
                <span>ПЛАНИРОВКИ</span>
                <h2>Планировки</h2>
              </div>
            </div>

            <div className={styles.layouts}>
              {complex.layouts.map((layout, index) => {
                const layoutImage = getLayoutValue(layout, [
                  "image",
                  "photo",
                  "image_url",
                  "photo_url",
                ]);

                const rooms = getLayoutValue(layout, [
                  "rooms",
                  "room_count",
                  "bedrooms",
                ]);

                const area = getLayoutValue(layout, [
                  "area",
                  "square",
                  "total_area",
                  "area_m2",
                ]);

                const floor = getLayoutValue(layout, ["floor"]);

                const price = getLayoutValue(layout, ["price"]);

                return (
                  <div
                    className={styles.layoutCard}
                    key={layout.id || layout.layout_id || index}
                  >
                    {layoutImage ? (
                      <div className={styles.layoutImage}>
                        <Image
                          src={layoutImage}
                          alt={`Планировка ${index + 1}`}
                          fill
                          sizes="(max-width: 700px) 100vw, 300px"
                        />
                      </div>
                    ) : (
                      <div className={styles.layoutPlaceholder}>
                        <Home size={38} />
                        <span>Планировка</span>
                      </div>
                    )}

                    <div className={styles.layoutContent}>
                      <div className={styles.layoutTop}>
                        <span>
                          {rooms !== null
                            ? `${rooms}-комнатная`
                            : `Вариант ${index + 1}`}
                        </span>

                        {price && <strong>{formatPrice(price)}</strong>}
                      </div>

                      <div className={styles.layoutMeta}>
                        {area !== null && (
                          <span>
                            <Ruler size={14} />
                            {area} м²
                          </span>
                        )}

                        {floor !== null && (
                          <span>
                            <Layers3 size={14} />
                            {floor} этаж
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =====================================================
            DOCUMENTS
        ===================================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FileCheck />
            </div>

            <div>
              <span>ОФИЦИАЛЬНАЯ ИНФОРМАЦИЯ</span>

              <h2>Документы о жилом комплексе</h2>
            </div>
          </div>

          <div className={styles.ministryCard}>
            <div className={styles.ministryInfo}>
              <div className={styles.ministryIcon}>
                <FileCheck size={22} />
              </div>

              <div className={styles.ministryText}>
                <strong>Официальные документы</strong>

                <p>
                  Здесь можно проверить доступную официальную информацию о жилом
                  комплексе и строительном объекте.
                </p>
              </div>
            </div>

            <button
              type="button"
              className={styles.ministryButton}
              onClick={openMinstroy}
            >
              <FileCheck size={18} />
              Смотреть документы
              <ExternalLink size={16} />
            </button>
          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className={styles.apartmentsCta}>
          <div>
            <span>ВЫБОР КВАРТИРЫ</span>

            <h2>Найдите своё пространство</h2>

            <p>
              Посмотрите доступные квартиры, планировки и цены в {complex.name}.
            </p>
          </div>

          <div className={styles.ctaActions}>
            {apartments.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  document.getElementById("apartments")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                Смотреть квартиры
                <ArrowRight size={18} />
              </button>
            )}

            {complex.developerId && (
              <button
                type="button"
                onClick={() =>
                  router.push(`/public-profile/${complex.developerId}`)
                }
              >
                Профиль застройщика
                <ArrowRight size={18} />
              </button>
            )}

            <button type="button" onClick={openMinstroy}>
              <FileCheck size={18} />
              Документы
              <ExternalLink size={16} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
