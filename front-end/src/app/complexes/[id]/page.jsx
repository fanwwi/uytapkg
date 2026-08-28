"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getComplexById } from "@/utils/api";
import { mapComplexData } from "@/utils/mapComplexData";

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
  Dumbbell,
  Waves,
  DoorOpen,
  Flame,
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
  Landmark,
  BadgeDollarSign,
} from "lucide-react";

import styles from "./ComplexDetail.module.css";

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
  if (value === null || value === undefined || value === "" || value === 0) {
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

export default function ComplexDetails() {
  const router = useRouter();
  const params = useParams();

  const complexId = params?.id;

  const [complex, setComplex] = useState(EMPTY_COMPLEX);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!complexId) return;

    async function loadComplex() {
      try {
        setLoading(true);
        setError("");

        const response = await getComplexById(complexId);

        if (!response?.success || !response?.data) {
          throw new Error(response?.message || "Жилой комплекс не найден");
        }

        const mapped = mapComplexData(response.data);

        setComplex({
          ...EMPTY_COMPLEX,
          ...mapped,
        });

        setCurrentImage(0);
      } catch (err) {
        console.error("Failed to load complex detail:", err);

        setError(err?.message || "Ошибка загрузки жилого комплекса");
      } finally {
        setLoading(false);
      }
    }

    loadComplex();
  }, [complexId]);

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

  const openMinstroy = () => {
    const url = complex.documentsUrl || MINSTROY_URL;

    window.open(url, "_blank", "noopener,noreferrer");
  };

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

  const engineeringItems = [
    {
      icon: Flame,
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
        {/* BACK */}

        <button
          type="button"
          className={styles.back}
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} />
          Вернуться к объявлениям
        </button>

        {/* HERO */}

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

            {/* PRICE */}

            <div className={styles.priceBlock}>
              <span>СТОИМОСТЬ КВАРТИР</span>

              <strong>{priceText}</strong>
            </div>

            {/* DEVELOPER */}

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

            {/* HERO STATS */}

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

            {/* COMPLETION */}

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

        {/* ABOUT */}

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

        {/* PROJECT DETAILS */}

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

        {/* ENGINEERING */}

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

        {/* AMENITIES */}

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

        {/* LOCATION */}

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

        {/* APARTMENT LAYOUTS */}

        {complex.layouts?.length > 0 && (
          <section className={styles.section} id="apartments">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Home />
              </div>

              <div>
                <span>КВАРТИРЫ</span>
                <h2>Планировки и цены</h2>
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

        {/* DOCUMENTS */}

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
                <strong>Проверьте информацию о строительстве</strong>

                <p>
                  Перейдите на официальный ресурс Министерства строительства и
                  проверьте паспорт строительного объекта и доступную информацию
                  о жилом комплексе.
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

        {/* CTA */}

        <section className={styles.apartmentsCta}>
          <div>
            <span>ВЫБОР КВАРТИРЫ</span>

            <h2>Найдите своё пространство</h2>

            <p>
              Посмотрите доступные планировки, характеристики квартир и цены в{" "}
              {complex.name}.
            </p>
          </div>

          <div className={styles.ctaActions}>
            {complex.layouts?.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  document.getElementById("apartments")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                Смотреть планировки
                <ArrowRight size={18} />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (complex.developerId) {
                  router.push(`/public-profile/${complex.developerId}`);
                }
              }}
            >
              Профиль застройщика
              <ArrowRight size={18} />
            </button>

            <button type="button" onClick={openMinstroy}>
              <FileCheck size={18} />
              Документы Минстроя
              <ExternalLink size={16} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
