"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

import { useLanguage } from "@/context/LanguageContext";

import { getComplexById, getComplexListings } from "@/utils/api";
import { mapComplexData } from "@/utils/mapComplexData";
import { mapListingData } from "@/utils/mapListingData";

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

const formatValue = (value, suffix = "", fallback = "Не указано") => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    Number(value) === 0
  ) {
    return fallback;
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
    };
  } catch (error) {
    console.error("Ошибка mapListingData для квартиры:", error, item);

    return null;
  }
}

export default function ComplexDetails() {
  const router = useRouter();
  const params = useParams();

  const { t, language } = useLanguage();

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
     DATE
  ========================================================= */

  const formatDate = (value) => {
    if (!value) {
      return t("complexDetails.date.askDeveloper");
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(language === "ky" ? "ky-KG" : "ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
          getComplexListings(complexId),
        ]);

        if (cancelled) return;

        /* =========================
           COMPLEX
        ========================= */

        if (!complexResponse?.success || !complexResponse?.data) {
          throw new Error(
            complexResponse?.message || t("complexDetails.errors.notFound"),
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
          const mappedApartments = listingsResponse.data
            .map(normalizeApartmentListing)
            .filter(Boolean);

          setApartments(mappedApartments);
        } else {
          setApartments([]);

          if (listingsResponse && !listingsResponse.success) {
            setApartmentsError(
              listingsResponse.message || t("complexDetails.errors.apartments"),
            );
          }
        }
      } catch (err) {
        console.error("Failed to load complex detail:", err);

        if (!cancelled) {
          setError(err?.message || t("complexDetails.errors.load"));

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
  }, [complexId, t]);

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
      return `${t("complexDetails.price.from")} ${from}`;
    }

    return t("complexDetails.price.onRequest");
  }, [complex.priceFrom, complex.priceTo, t]);

  /* =========================================================
     DETAIL ITEMS
  ========================================================= */

  const detailItems = [
    {
      label: t("complexDetails.details.class"),
      value: complex.housingClass,
      icon: Sparkles,
    },
    {
      label: t("complexDetails.details.apartments"),
      value: formatValue(
        complex.apartments,
        ` ${t("complexDetails.units.apartments")}`,
        t("complexDetails.notSpecified"),
      ),
      icon: Home,
    },
    {
      label: t("complexDetails.details.floors"),
      value: formatValue(
        complex.floors,
        ` ${t("complexDetails.units.floors")}`,
        t("complexDetails.notSpecified"),
      ),
      icon: Layers3,
    },
    {
      label: t("complexDetails.details.blocks"),
      value: formatValue(
        complex.blocks,
        ` ${t("complexDetails.units.blocks")}`,
        t("complexDetails.notSpecified"),
      ),
      icon: Building2,
    },
    {
      label: t("complexDetails.details.area"),
      value: complex.areaSotka
        ? `${complex.areaSotka} ${t("complexDetails.units.sotkas")}`
        : complex.area
          ? `${complex.area} м²`
          : t("complexDetails.notSpecified"),
      icon: Ruler,
    },
    {
      label: t("complexDetails.details.ceiling"),
      value: formatValue(
        complex.ceilingHeight,
        " м",
        t("complexDetails.notSpecified"),
      ),
      icon: Maximize,
    },
    {
      label: t("complexDetails.details.construction"),
      value: formatValue(
        complex.construction,
        "",
        t("complexDetails.notSpecified"),
      ),
      icon: Grid3X3,
    },
    {
      label: t("complexDetails.details.parking"),
      value: formatValue(
        complex.parking,
        ` ${t("complexDetails.units.places")}`,
        t("complexDetails.notSpecified"),
      ),
      icon: CarFront,
    },
  ];

  /* =========================================================
     ENGINEERING
  ========================================================= */

  const engineeringItems = [
    {
      icon: Zap,
      title: t("complexDetails.engineering.heating"),
      value: complex.heating,
    },
    {
      icon: Zap,
      title: t("complexDetails.engineering.electricity"),
      value: complex.electricity,
    },
    {
      icon: ShieldCheck,
      title: t("complexDetails.engineering.security"),
      value: complex.security,
    },
    {
      icon: Camera,
      title: t("complexDetails.engineering.video"),
      value: complex.videoSurveillance,
    },
  ].filter(
    (item) =>
      item.value !== null && item.value !== undefined && item.value !== "",
  );

  /* =========================================================
     APARTMENT COUNT LABEL
  ========================================================= */

  const apartmentCountLabel = useMemo(() => {
    const count = apartments.length;

    if (language === "ky") {
      return t("complexDetails.apartments.available");
    }

    if (count === 1) {
      return t("complexDetails.apartments.one");
    }

    if (count < 5) {
      return t("complexDetails.apartments.few");
    }

    return t("complexDetails.apartments.many");
  }, [apartments.length, language, t]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner} />

            <span>{t("complexDetails.loading.complex")}</span>
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

            {t("complexDetails.back.back")}
          </button>

          <div className={styles.error}>
            <div className={styles.errorIcon}>
              <Building2 size={28} />
            </div>

            <h1>{t("complexDetails.errors.title")}</h1>

            <p>{error}</p>

            <button type="button" onClick={() => window.location.reload()}>
              {t("complexDetails.errors.retry")}
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

          {t("complexDetails.back.toListings")}
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
                aria-label={t("complexDetails.aria.addFavorite")}
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
                    aria-label={t("complexDetails.aria.previousImage")}
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.galleryRight}`}
                    onClick={nextImage}
                    aria-label={t("complexDetails.aria.nextImage")}
                  >
                    <ChevronRight />
                  </button>
                </>
              )}

              <div className={styles.imageCounter}>
                {currentImage + 1} / {images.length}
              </div>

              <div className={styles.heroImageText}>
                <span>{t("complexDetails.labels.residentialComplex")}</span>

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

              {t("complexDetails.labels.residentialComplex")}
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
              <span>{t("complexDetails.labels.apartmentPrice")}</span>

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
                <span>{t("complexDetails.labels.developer")}</span>

                <strong>{complex.developer}</strong>
              </div>
            </div>

            <div className={styles.heroStats}>
              <div>
                <Layers3 />

                <span>
                  <strong>
                    {formatValue(
                      complex.floors,
                      "",
                      t("complexDetails.notSpecified"),
                    )}
                  </strong>

                  {t("complexDetails.units.floors")}
                </span>
              </div>

              <div>
                <Building2 />

                <span>
                  <strong>
                    {formatValue(
                      complex.blocks,
                      "",
                      t("complexDetails.notSpecified"),
                    )}
                  </strong>

                  {t("complexDetails.units.blocks")}
                </span>
              </div>

              <div>
                <Home />

                <span>
                  <strong>
                    {formatValue(
                      complex.apartments,
                      "",
                      t("complexDetails.notSpecified"),
                    )}
                  </strong>

                  {t("complexDetails.units.apartments")}
                </span>
              </div>
            </div>

            <div className={styles.completion}>
              <div className={styles.completionIcon}>
                <CalendarDays size={19} />
              </div>

              <div>
                <span>{t("complexDetails.labels.completion")}</span>

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
              {t("complexDetails.buttons.developerProfile")}

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
              <span>{t("complexDetails.sections.availableApartments")}</span>

              <h2>
                {t("complexDetails.apartments.title")} {complex.name}
              </h2>
            </div>
          </div>

          {apartmentsLoading ? (
            <div className={styles.apartmentsLoading}>
              <div className={styles.loadingSpinner} />

              <span>{t("complexDetails.loading.apartments")}</span>
            </div>
          ) : apartments.length > 0 ? (
            <>
              <div className={styles.apartmentsHeader}>
                <div>
                  <strong>{apartments.length}</strong>

                  <span>{apartmentCountLabel}</span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("apartments")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                >
                  {t("complexDetails.buttons.allApartments")}

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

              <h3>{t("complexDetails.apartments.emptyTitle")}</h3>

              <p>{t("complexDetails.apartments.emptyDescription")}</p>
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
              <span>{t("complexDetails.sections.about")}</span>

              <h2>{t("complexDetails.about.title")}</h2>
            </div>
          </div>

          <div className={styles.aboutGrid}>
            <div>
              <p className={styles.description}>{complex.description}</p>
            </div>

            <div className={styles.aboutHighlight}>
              <Sparkles />

              <strong>{complex.name}</strong>

              <span>{t("complexDetails.about.highlight")}</span>
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
              <span>{t("complexDetails.sections.parameters")}</span>

              <h2>{t("complexDetails.project.title")}</h2>
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
                <span>{t("complexDetails.sections.engineering")}</span>

                <h2>{t("complexDetails.engineering.title")}</h2>
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
                <span>{t("complexDetails.sections.territory")}</span>

                <h2>{t("complexDetails.infrastructure.title")}</h2>
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
              <span>{t("complexDetails.sections.location")}</span>

              <h2>{t("complexDetails.location.title")}</h2>
            </div>
          </div>

          <div className={styles.locationCard}>
            <div className={styles.locationContent}>
              <span>{t("complexDetails.location.address")}</span>

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
                <span>{t("complexDetails.sections.layouts")}</span>

                <h2>{t("complexDetails.layouts.title")}</h2>
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
                          alt={`${t(
                            "complexDetails.layouts.alt",
                          )} ${index + 1}`}
                          fill
                          sizes="(max-width: 700px) 100vw, 300px"
                        />
                      </div>
                    ) : (
                      <div className={styles.layoutPlaceholder}>
                        <Home size={38} />

                        <span>{t("complexDetails.layouts.placeholder")}</span>
                      </div>
                    )}

                    <div className={styles.layoutContent}>
                      <div className={styles.layoutTop}>
                        <span>
                          {rooms !== null
                            ? `${rooms} ${t("complexDetails.layouts.rooms")}`
                            : `${t(
                                "complexDetails.layouts.variant",
                              )} ${index + 1}`}
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
                            {floor} {t("complexDetails.units.floor")}
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
              <span>{t("complexDetails.sections.officialInfo")}</span>

              <h2>{t("complexDetails.documents.title")}</h2>
            </div>
          </div>

          <div className={styles.ministryCard}>
            <div className={styles.ministryInfo}>
              <div className={styles.ministryIcon}>
                <FileCheck size={22} />
              </div>

              <div className={styles.ministryText}>
                <strong>{t("complexDetails.documents.official")}</strong>

                <p>{t("complexDetails.documents.description")}</p>
              </div>
            </div>

            <button
              type="button"
              className={styles.ministryButton}
              onClick={openMinstroy}
            >
              <FileCheck size={18} />

              {t("complexDetails.buttons.documents")}

              <ExternalLink size={16} />
            </button>
          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className={styles.apartmentsCta}>
          <div>
            <span>{t("complexDetails.cta.label")}</span>

            <h2>{t("complexDetails.cta.title")}</h2>

            <p>
              {t("complexDetails.cta.description")} {complex.name}.
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
                {t("complexDetails.buttons.viewApartments")}

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
                {t("complexDetails.buttons.developerProfileShort")}

                <ArrowRight size={18} />
              </button>
            )}

            <button type="button" onClick={openMinstroy}>
              <FileCheck size={18} />

              {t("complexDetails.buttons.documents")}

              <ExternalLink size={16} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
