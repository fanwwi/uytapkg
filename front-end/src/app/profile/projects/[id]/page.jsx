"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  getComplexById,
  getListings,
  updateComplex as updateComplexApi,
  deleteComplex as deleteComplexApi,
} from "@/utils/api";

import { mapComplexData } from "@/utils/mapComplexData";
import { mapListingData } from "@/utils/mapListingData";


import {
  ArrowLeft,
  MapPin,
  Building2,
  Ruler,
  Layers3,
  Pencil,
  Trash2,
  FileCheck,
  ExternalLink,
  Home,
  ArrowRight,
  Trees,
} from "lucide-react";

import styles from "./MycomplexDetails.module.css";

import DeleteModal from "@/components/ui/deleteModal/DeleteMidal";
import EditResidentialComplexModal from "../EditResidentialComplexModal/EditResidentialComplexModal";
import ListingCard from "@/components/ui/ListingCard/ListingCard";

const FALLBACK_IMAGE =
  "https://storage.googleapis.com/bd-kg-02/buildings-v2/800x630/2336.jpg";

const DEFAULT_DEVELOPER = "Застройщик не указан";

const formatValue = (value, suffix = "") => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === 0 ||
    value === "0"
  ) {
    return "Не указано";
  }

  return `${value}${suffix}`;
};

const formatBlocks = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === 0 ||
    value === "0"
  ) {
    return "Не указано";
  }

  const stringValue = String(value);

  if (stringValue.toLowerCase().includes("блок")) {
    return stringValue;
  }

  return `${stringValue} блоков`;
};

const formatHeight = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === 0 ||
    value === "0"
  ) {
    return "Не указано";
  }

  const stringValue = String(value);

  if (stringValue.includes("м")) {
    return stringValue;
  }

  return `${stringValue} м`;
};

const getDateLabel = (date) => {
  if (!date) return "Уточняйте у застройщика";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/* =========================================================
   GET COMPLEX REFERENCE FROM LISTING
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
    if (value !== undefined && value !== null && value !== "") {
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
    if (value !== undefined && value !== null && value !== "") {
      return String(value);
    }
  }

  return null;
}

/* =========================================================
   CHECK LISTING AVAILABILITY
========================================================= */

function isListingAvailable(item) {
  if (!item) return false;

  const booleanValues = [
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

  const explicitBoolean = booleanValues.find(
    (value) => typeof value === "boolean",
  );

  if (explicitBoolean === false) {
    return false;
  }

  const status = String(
    item.availabilityStatus ??
      item.availability_status ??
      item.listingStatus ??
      item.listing_status ??
      item.saleStatus ??
      item.sale_status ??
      item.statusName ??
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
   NORMALIZE APARTMENT
========================================================= */

function normalizeApartmentListing(item) {
  if (!item) return null;

  try {
    const mapped = mapListingData(item);

    const merged = {
      ...item,
      ...mapped,
    };

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

      rawComplexId: getComplexReference(merged),

      isAvailable: isListingAvailable(merged),
    };
  } catch (error) {
    console.error("Ошибка mapListingData для квартиры:", item, error);

    return null;
  }
}

export default function MyComplexDetail() {
  const router = useRouter();
  const params = useParams();

  const complexId = params?.id;

  const [residentialComplex, setResidentialComplex] = useState(null);

  const [apartments, setApartments] = useState([]);
  const [apartmentsLoading, setApartmentsLoading] = useState(true);
  const [apartmentsError, setApartmentsError] = useState("");

  const [currentImage, setCurrentImage] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD COMPLEX + APARTMENTS
  ========================================================= */

  useEffect(() => {
    if (!complexId) return;

    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setApartmentsLoading(true);

        setError("");
        setApartmentsError("");

        const [complexResponse, listingsResponse] = await Promise.all([
          getComplexById(complexId),

          getListings({
            page: 1,
            limit: 200,
          }),
        ]);

        if (cancelled) return;

        /* =====================================================
           COMPLEX
        ===================================================== */

        if (!complexResponse?.success || !complexResponse?.data) {
          throw new Error("Жилой комплекс не найден");
        }

        const raw = complexResponse.data;
        const mapped = mapComplexData(raw);

        if (!mapped) {
          throw new Error("Не удалось обработать данные жилого комплекса");
        }

        const features = raw.features || {};

        const images =
          Array.isArray(mapped.images) && mapped.images.length > 0
            ? mapped.images.filter(Boolean)
            : raw.cover_photo
              ? [raw.cover_photo]
              : [FALLBACK_IMAGE];

        setResidentialComplex({
          id: raw.id,

          name: mapped.name,

          subtitle:
            mapped.housingClass && mapped.address
              ? `${mapped.housingClass} · ${mapped.address}`
              : "Жилой комплекс",

          class: mapped.housingClass,

          status: mapped.completionStatus,

          location: raw.city || raw.region || "Кыргызстан",

          city: raw.city || raw.region || "Кыргызстан",

          address: mapped.address,

          developer: mapped.developer || DEFAULT_DEVELOPER,

          developerId: mapped.developerId,

          completion: getDateLabel(raw.completion_date),

          completionDate: raw.completion_date || "",

          floors: formatValue(features.floors),

          blocks: formatBlocks(features.blocks),

          apartments: formatValue(features.apartments, " квартир"),

          parking: formatValue(features.parking, " мест"),

          ceilingHeight: formatHeight(features.ceilingHeight),

          constructionType: features.construction || "Не указано",

          landArea: features.areaSotka
            ? `${features.areaSotka} соток`
            : features.area
              ? `${features.area} м²`
              : "Не указано",

          area: features.area || null,

          areaSotka: features.areaSotka || null,

          description: mapped.description || "Описание не указано",

          concept: raw.description || "",

          images,

          amenities: Array.isArray(mapped.amenities) ? mapped.amenities : [],

          documentsUrl: mapped.documentsUrl || null,

          rawFeatures: features,

          raw,
        });

        setCurrentImage(0);

        /* =====================================================
           APARTMENTS
        ===================================================== */

        if (listingsResponse?.success && Array.isArray(listingsResponse.data)) {
          const currentComplexId = String(complexId);

          const complexApartments = listingsResponse.data
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

          setApartments(complexApartments);
        } else {
          setApartments([]);
        }
      } catch (err) {
        console.error("Failed to load complex detail:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Ошибка загрузки жилого комплекса",
          );

          setApartments([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setApartmentsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [complexId]);

  /* =========================================================
     IMAGES
  ========================================================= */

  const images = useMemo(() => {
    if (!residentialComplex) {
      return [];
    }

    if (
      Array.isArray(residentialComplex.images) &&
      residentialComplex.images.length > 0
    ) {
      return residentialComplex.images.filter(Boolean);
    }

    return [FALLBACK_IMAGE];
  }, [residentialComplex]);

  const currentImageSrc = images[currentImage] || images[0] || FALLBACK_IMAGE;

  const nextImage = () => {
    if (images.length <= 1) return;

    setCurrentImage((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    if (images.length <= 1) return;

    setCurrentImage((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = () => {
    if (!residentialComplex) return;

    setShowEditModal(true);
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async (updatedComplex) => {
    if (!residentialComplex) return;

    try {
      const token = localStorage.getItem("uytap_token");

      if (!token) {
        throw new Error("Вы не авторизованы");
      }

      const parseNum = (value) => {
        if (value === undefined || value === null || value === "") {
          return null;
        }

        const number = parseFloat(
          String(value)
            .replace(",", ".")
            .replace(/[^\d.-]/g, ""),
        );

        return Number.isNaN(number) ? null : number;
      };

      const payload = {
        name: updatedComplex.name,

        address: updatedComplex.address,

        status: updatedComplex.status,

        class: updatedComplex.class,

        construction:
          updatedComplex.construction || updatedComplex.constructionType,

        completionDate: updatedComplex.completionDate,

        floors: parseNum(updatedComplex.floors),

        blocks: parseNum(updatedComplex.blocks),

        apartments: parseNum(updatedComplex.apartments),

        parking: parseNum(updatedComplex.parking),

        ceilingHeight: parseNum(updatedComplex.ceilingHeight),

        area: parseNum(updatedComplex.area),

        areaSotka: parseNum(
          updatedComplex.landArea || updatedComplex.areaSotka,
        ),

        amenities: Array.isArray(updatedComplex.amenities)
          ? updatedComplex.amenities
          : [],
      };

      const response = await updateComplexApi(
        token,
        residentialComplex.id,
        payload,
      );

      if (!response?.success) {
        throw new Error(response?.message || "Ошибка сохранения");
      }

      const refreshed = await getComplexById(residentialComplex.id);

      if (!refreshed?.success || !refreshed?.data) {
        throw new Error("Изменения сохранены, но данные не удалось обновить");
      }

      const raw = refreshed.data;

      const mapped = mapComplexData(raw);

      const features = raw.features || {};

      const refreshedImages =
        Array.isArray(mapped?.images) && mapped.images.length > 0
          ? mapped.images.filter(Boolean)
          : raw.cover_photo
            ? [raw.cover_photo]
            : [FALLBACK_IMAGE];

      setResidentialComplex((prev) => ({
        ...prev,

        id: raw.id,

        name: mapped?.name || raw?.name || prev.name,

        subtitle:
          mapped?.housingClass && mapped?.address
            ? `${mapped.housingClass} · ${mapped.address}`
            : prev.subtitle,

        class: mapped?.housingClass || prev.class,

        status: mapped?.completionStatus || prev.status,

        location: raw.city || raw.region || prev.location,

        city: raw.city || raw.region || prev.city,

        address: mapped?.address || raw.address || prev.address,

        developer: mapped?.developer || prev.developer,

        developerId: mapped?.developerId || prev.developerId,

        completion: getDateLabel(raw.completion_date),

        completionDate: raw.completion_date || prev.completionDate,

        description: mapped?.description || prev.description,

        concept: raw.description || prev.concept,

        floors: formatValue(features.floors),

        blocks: formatBlocks(features.blocks),

        apartments: formatValue(features.apartments, " квартир"),

        parking: formatValue(features.parking, " мест"),

        ceilingHeight: formatHeight(features.ceilingHeight),

        constructionType: features.construction || prev.constructionType,

        landArea: features.areaSotka
          ? `${features.areaSotka} соток`
          : features.area
            ? `${features.area} м²`
            : prev.landArea,

        area: features.area || prev.area,

        areaSotka: features.areaSotka || prev.areaSotka,

        images: refreshedImages,

        amenities: Array.isArray(mapped?.amenities)
          ? mapped.amenities
          : prev.amenities,

        documentsUrl: mapped?.documentsUrl || prev.documentsUrl,

        rawFeatures: features,

        raw,
      }));

      setCurrentImage(0);
      setShowEditModal(false);
    } catch (err) {
      console.error("Ошибка при сохранении ЖК:", err);

      alert(
        err instanceof Error ? err.message : "Не удалось сохранить изменения",
      );
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {
    if (!residentialComplex) return;

    try {
      const token = localStorage.getItem("uytap_token");

      if (!token) {
        throw new Error("Вы не авторизованы");
      }

      const response = await deleteComplexApi(token, residentialComplex.id);

      if (!response?.success) {
        throw new Error(response?.message || "Ошибка удаления");
      }

      setShowDeleteModal(false);

      router.push("/profile/projects");
    } catch (err) {
      console.error("Ошибка при удалении ЖК:", err);

      alert(err instanceof Error ? err.message : "Не удалось удалить ЖК");
    }
  };

  /* =========================================================
     MINSTROY
  ========================================================= */

  const openMinstroy = () => {
    const url = residentialComplex?.documentsUrl || "https://minstroy.gov.kg/";

    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <span className={styles.loader} />

            <span>Загрузка информации о жилом комплексе...</span>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !residentialComplex) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.topBar}>
            <button
              type="button"
              className={styles.back}
              onClick={() => router.push("/profile/projects")}
            >
              <ArrowLeft size={18} />
              Мои ЖК
            </button>
          </div>

          <div className={styles.errorState}>
            <strong>Не удалось загрузить ЖК</strong>

            <span>{error || "Жилой комплекс не найден"}</span>

            <button
              type="button"
              className={styles.errorButton}
              onClick={() => router.push("/profile/projects")}
            >
              Вернуться к моим ЖК
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.back}
            onClick={() => router.push("/profile/projects")}
          >
            <ArrowLeft size={18} />
            Мои ЖК
          </button>

          <div className={styles.ownerLabel}>
            <Building2 size={16} />
            <span>КАБИНЕТ ЗАСТРОЙЩИКА</span>
          </div>
        </div>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className={styles.hero}>
          {/* GALLERY */}

          <div className={styles.heroGallery}>
            <div className={styles.mainImage}>
              <Image
                src={currentImageSrc}
                alt={residentialComplex.name}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 68vw"
              />

              <div className={styles.imageGradient} />

              <div className={styles.heroBadges}>
                <span className={styles.premiumBadge}>
                  {residentialComplex.class}
                </span>

                <span className={styles.statusBadge}>
                  {residentialComplex.status}
                </span>
              </div>

              <button
                type="button"
                className={styles.editImageButton}
                onClick={handleEdit}
              >
                <Pencil size={17} />
                Изменить
              </button>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.galleryLeft}`}
                    onClick={previousImage}
                    aria-label="Предыдущее изображение"
                  >
                    <ArrowLeft />
                  </button>

                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.galleryRight}`}
                    onClick={nextImage}
                    aria-label="Следующее изображение"
                  >
                    <ArrowRight />
                  </button>
                </>
              )}

              <div className={styles.imageCounter}>
                {currentImage + 1} / {images.length}
              </div>

              <div className={styles.heroImageText}>
                <span>МОЙ ЖИЛОЙ КОМПЛЕКС</span>

                <strong>{residentialComplex.name}</strong>
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
                      alt={`${residentialComplex.name} ${index + 1}`}
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
              МОЙ ЖИЛОЙ КОМПЛЕКС
            </div>

            <h1>{residentialComplex.name}</h1>

            <div className={styles.heroLocation}>
              <MapPin size={19} />

              <div>
                <strong>{residentialComplex.location}</strong>

                <span>{residentialComplex.address}</span>
              </div>
            </div>

            <div className={styles.heroDivider} />

            {/* DEVELOPER */}

            <div className={styles.developer}>
              <div className={styles.developerIcon}>
                <Building2 size={18} />
              </div>

              <div>
                <span>ЗАСТРОЙЩИК</span>

                <strong>{residentialComplex.developer}</strong>
              </div>
            </div>

            {/* STATS */}

            <div className={styles.heroStats}>
              <div>
                <Layers3 />

                <span>
                  <strong>{residentialComplex.floors}</strong>
                  этажей
                </span>
              </div>

              <div>
                <Building2 />

                <span>
                  <strong>{residentialComplex.blocks}</strong>
                  блоков
                </span>
              </div>

              <div>
                <Ruler />

                <span>
                  <strong>{residentialComplex.landArea}</strong>
                  территория
                </span>
              </div>
            </div>

            {/* MANAGEMENT */}

            <div className={styles.managementButtons}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleEdit}
              >
                <Pencil size={18} />
                Редактировать ЖК
              </button>

              <button
                type="button"
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => setShowDeleteModal(true)}
                aria-label="Удалить ЖК"
              >
                <Trash2 size={17} />
              </button>
            </div>
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

              <h2>Квартиры в {residentialComplex.name}</h2>
            </div>
          </div>

          {apartmentsLoading ? (
            <div className={styles.apartmentsLoading}>
              <span className={styles.loader} />

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

              <p>В этом ЖК пока нет доступных объявлений о продаже квартир.</p>
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

          <div className={styles.aboutContent}>
            {residentialComplex.concept && (
              <p className={styles.description}>{residentialComplex.concept}</p>
            )}
          </div>
        </section>

        {/* =====================================================
            DETAILS
        ===================================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Layers3 />
            </div>

            <div>
              <span>ОСНОВНЫЕ ПАРАМЕТРЫ</span>

              <h2>Характеристики ЖК</h2>
            </div>
          </div>

          <div className={styles.projectDetails}>
            <div>
              <span>Класс</span>
              <strong>{residentialComplex.class}</strong>
            </div>

            <div>
              <span>Количество квартир</span>

              <strong>{residentialComplex.apartments}</strong>
            </div>

            <div>
              <span>Этажность</span>

              <strong>{residentialComplex.floors}</strong>
            </div>

            <div>
              <span>Количество блоков</span>

              <strong>{residentialComplex.blocks}</strong>
            </div>

            <div>
              <span>Площадь территории</span>

              <strong>{residentialComplex.landArea}</strong>
            </div>

            <div>
              <span>Высота потолков</span>

              <strong>{residentialComplex.ceilingHeight}</strong>
            </div>

            <div>
              <span>Конструкция</span>

              <strong>{residentialComplex.constructionType}</strong>
            </div>

            <div>
              <span>Паркинг</span>

              <strong>{residentialComplex.parking}</strong>
            </div>
          </div>
        </section>

        {/* =====================================================
            INFRASTRUCTURE
        ===================================================== */}

        {residentialComplex.amenities?.length > 0 && (
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
              {residentialComplex.amenities.map((item, index) => (
                <div
                  className={styles.infrastructureItem}
                  key={`${item}-${index}`}
                >
                  {item}
                </div>
              ))}
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

          <div className={styles.addressBlock}>
            <MapPin size={20} />

            <strong>{residentialComplex.address}</strong>
          </div>
        </section>

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
                <strong>Информация о строительстве объекта</strong>

                <p>
                  Перейдите на официальный ресурс Министерства строительства,
                  чтобы проверить доступную информацию о строительном объекте.
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
      </div>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Удалить жилой комплекс?"
        description={`Вы действительно хотите удалить «${residentialComplex.name}»? Это действие нельзя будет отменить.`}
      />

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      <EditResidentialComplexModal
        complex={showEditModal ? residentialComplex : null}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
      />
    </main>
  );
}
