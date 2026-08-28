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
  Clock3,
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

    setLoading(true);
    setError(null);

    getListingById(id)
      .then((res) => {
        if (res.success && res.data) {
          const mapped = mapListingDetail(res.data);

          setProduct(mapped);
        } else {
          setError(res.message || "Объявление не найдено");
        }
      })
      .catch((err) => {
        console.error("Fetch my listing details error:", err);
        setError("Ошибка загрузки объявления");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  const raw = product?.rawFeatures || {};

  const hasValue = (value) => {
    return (
      value !== undefined && value !== null && value !== "" && value !== false
    );
  };

  const formatValue = (value, suffix = "") => {
    if (!hasValue(value)) return null;

    if (typeof value === "boolean") {
      return value ? "Есть" : null;
    }

    return `${value}${suffix}`;
  };

  /*
   * =========================================================
   * CHARACTERISTICS
   * Все новые поля собираются здесь.
   * Пустые значения автоматически не отображаются.
   * =========================================================
   */

  const characteristics = useMemo(() => {
    if (!product) return [];

    const items = [];

    const add = (icon, label, value) => {
      if (hasValue(value)) {
        items.push({
          icon,
          label,
          value: String(value),
        });
      }
    };

    // Общие
    add(BedDouble, "Комнаты", product.rooms);
    add(Ruler, "Площадь", product.area);

    // Этажи
    add(Layers3, "Этаж", raw.floor ?? product.floor);

    add(Building2, "Этажность", raw.floors ?? product.floors);

    // Тип
    add(Home, "Тип недвижимости", product.type);

    // Тип дома
    add(Building, "Тип дома", raw.buildingType);

    // Год
    add(CalendarDays, "Год постройки", raw.year);

    add(CalendarDays, "Год сдачи", raw.yearBuilt);

    // Состояние / ремонт
    add(Sparkles, "Ремонт", raw.repair);

    add(Sofa, "Мебель", raw.furniture);

    // Потолки
    if (hasValue(raw.ceilingHeight)) {
      add(
        Maximize,
        "Высота потолков",
        String(raw.ceilingHeight).includes("м")
          ? raw.ceilingHeight
          : `${raw.ceilingHeight} м`,
      );
    }

    // Санузел
    add(Bath, "Санузел", raw.bathroom);

    add(Bath, "Количество санузлов", raw.bathrooms);

    // Отопление
    add(Flame, "Отопление", raw.heating);

    // Канализация
    add(Droplets, "Канализация", raw.sewerage);

    // Вода
    add(Droplets, "Водоснабжение", raw.water);

    // Электричество
    if (hasValue(raw.electricity)) {
      add(
        Zap,
        "Электричество",
        raw.electricity === true ? "Есть" : raw.electricity,
      );
    }

    // Газ
    if (hasValue(raw.gas)) {
      add(Flame, "Газ", raw.gas === true ? "Есть" : raw.gas);
    }

    // Документы
    add(FileCheck, "Документы", raw.documents);

    // Парковка
    add(CarFront, "Парковка", raw.parking);

    // Вид
    add(Waves, "Вид", raw.view);

    // Ориентация
    add(Compass, "Ориентация", raw.orientation);

    // Территория
    add(LandPlot, "Площадь участка", raw.landArea);

    if (hasValue(raw.areaSotka)) {
      add(
        LandPlot,
        "Площадь участка",
        String(raw.areaSotka).includes("сот")
          ? raw.areaSotka
          : `${raw.areaSotka} соток`,
      );
    }

    // Количество блоков
    if (hasValue(raw.blocks)) {
      add(
        Layers3,
        "Количество блоков",
        String(raw.blocks).includes("блок")
          ? raw.blocks
          : `${raw.blocks} блоков`,
      );
    }

    // Конструкция
    add(Building2, "Конструкция", raw.construction ?? raw.constructionType);

    // Застройщик / ЖК
    add(Building2, "Застройщик / ЖК", raw.developerOrComplex);

    // Расстояние до пляжа
    if (hasValue(product.beachDistance)) {
      add(Waves, "Расстояние до пляжа", `${product.beachDistance} м`);
    }

    // Дополнительные новые поля
    add(DoorOpen, "Количество входов", raw.entrances);

    add(Trees, "Площадь двора", raw.yardArea);

    add(Ruler, "Ширина участка", raw.landWidth);

    add(Ruler, "Длина участка", raw.landLength);

    return items;
  }, [product, raw]);

  /*
   * =========================================================
   * AMENITIES
   * =========================================================
   */

  const amenities = useMemo(() => {
    if (!product) return [];

    const source = raw.amenities;

    if (Array.isArray(source)) {
      return source.filter(Boolean);
    }

    if (source) {
      return [source];
    }

    return [];
  }, [product, raw]);

  /*
   * =========================================================
   * GALLERY
   * =========================================================
   */

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

  const images = product.images || [];

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

        {/* =====================================================
            TOP
        ===================================================== */}

        <section className={styles.top}>
          {/* GALLERY */}

          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              {images.length > 0 ? (
                <Image
                  src={images[currentImage]}
                  alt={product.title}
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
                className={styles.favorite}
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

        {/* =====================================================
            CONTENT
        ===================================================== */}

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

                  <div>
                    {product.location && <strong>{product.location}</strong>}

                    {product.address && <p>{product.address}</p>}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* =====================================================
              SIDEBAR
          ===================================================== */}

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
