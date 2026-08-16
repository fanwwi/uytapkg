"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
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
} from "lucide-react";

import styles from "./MyAdsDetails.module.css";
import DeleteModal from "@/components/ui/deleteModal/DeleteMidal";
import AdsEditModal from "../AdsEditModal/AdsEditModal";

/*
const initialProduct = {
  id: 1,

  title: "Уютный дом у озера Иссык-Куль",

  price: "120 000 $",

  type: "Дом",

  dealType: "Продажа",

  location: "Чолпон-Ата",

  address: "ул. Советская, 24",

  area: "180 м²",

  rooms: 5,

  floors: 2,

  year: 2021,

  status: "vip",

  description:
    "Просторный и уютный дом в живописном районе Чолпон-Аты. До озера несколько минут пешком. Дом отлично подходит как для постоянного проживания, так и для отдыха всей семьёй.",

  images: [
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1800&auto=format&fit=crop",
  ],

  characteristics: [
    {
      icon: BedDouble,
      label: "Комнаты",
      value: "5 комнат",
    },
    {
      icon: Ruler,
      label: "Площадь",
      value: "180 м²",
    },
    {
      icon: Layers3,
      label: "Этажность",
      value: "2 этажа",
    },
    {
      icon: Home,
      label: "Тип дома",
      value: "Частный дом",
    },
    {
      icon: Flame,
      label: "Отопление",
      value: "Автономное",
    },
    {
      icon: Droplets,
      label: "Канализация",
      value: "Септик",
    },
    {
      icon: Zap,
      label: "Электричество",
      value: "Есть",
    },
    {
      icon: FileCheck,
      label: "Документы",
      value: "Красная книга",
    },
    {
      icon: CarFront,
      label: "Парковка",
      value: "Есть",
    },
    {
      icon: Waves,
      label: "Вид",
      value: "Вид на озеро",
    },
  ],

  amenities: [
    "Балкон / лоджия",
    "Видеонаблюдение",
    "Закрытая территория",
    "Парковка",
    "Бытовая техника",
    "Вид на горы",
    "Охрана",
    "Не затапливалась",
  ],

  createdAt: "12 августа 2026",
};
*/

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
          
          // Build characteristics dynamically and attach to mapped object
          const dynamicCharacteristics = [
            {
              icon: BedDouble,
              label: "Комнаты",
              value: `${mapped.rooms} комнат`,
            },
            {
              icon: Ruler,
              label: "Площадь",
              value: mapped.area || "Не указана",
            },
            {
              icon: Layers3,
              label: "Этажность / Этаж",
              value: `${mapped.floors} этаж(а)`,
            },
            {
              icon: Home,
              label: "Тип",
              value: mapped.type,
            },
          ];

          if (mapped.rawFeatures?.heating) {
            dynamicCharacteristics.push({
              icon: Flame,
              label: "Отопление",
              value: mapped.rawFeatures.heating,
            });
          }
          if (mapped.rawFeatures?.sewerage) {
            dynamicCharacteristics.push({
              icon: Droplets,
              label: "Канализация",
              value: mapped.rawFeatures.sewerage,
            });
          }
          if (mapped.rawFeatures?.electricity) {
            dynamicCharacteristics.push({
              icon: Zap,
              label: "Электричество",
              value: mapped.rawFeatures.electricity === true ? "Есть" : mapped.rawFeatures.electricity,
            });
          }
          if (mapped.rawFeatures?.documents) {
            dynamicCharacteristics.push({
              icon: FileCheck,
              label: "Документы",
              value: mapped.rawFeatures.documents,
            });
          }
          if (mapped.rawFeatures?.parking) {
            dynamicCharacteristics.push({
              icon: CarFront,
              label: "Парковка",
              value: mapped.rawFeatures.parking,
            });
          }
          if (mapped.rawFeatures?.view) {
            dynamicCharacteristics.push({
              icon: Waves,
              label: "Вид",
              value: mapped.rawFeatures.view,
            });
          }

          mapped.characteristics = dynamicCharacteristics;

          mapped.amenities = Array.isArray(mapped.rawFeatures?.amenities)
            ? mapped.rawFeatures.amenities
            : mapped.rawFeatures?.amenities
              ? [mapped.rawFeatures.amenities]
              : ["Парковка", "Закрытая территория", "Видеонаблюдение"];

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
   * =========================
   * GALLERY
   * =========================
   */

  const nextImage = () => {
    if (!product.images?.length) return;

    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const previousImage = () => {
    if (!product.images?.length) return;

    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  /*
   * =========================
   * EDIT
   * =========================
   */

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
  };

  const handleSave = async (updatedProduct) => {
    try {
      /*
       * Здесь потом можно поставить API:
       *
       * await api.put(`/ads/${product.id}`, updatedProduct);
       */

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
    } catch (error) {
      console.error("Ошибка сохранения объявления:", error);
    }
  };

  /*
   * =========================
   * DELETE
   * =========================
   */

  const handleDelete = async () => {
    try {
      /*
       * Здесь потом:
       *
       * await api.delete(`/ads/${product.id}`);
       */

      console.log("Удаление объявления:", product.id);

      setShowDeleteModal(false);

      router.push("/profile/ads");
    } catch (error) {
      console.error("Ошибка удаления объявления:", error);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container} style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Загрузка объявления...</h2>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className={styles.page}>
        <div className={styles.container} style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Объявление не найдено</h2>
          <p style={{ marginTop: "10px", color: "#666" }}>{error || "Не удалось загрузить данные."}</p>
          <button
            type="button"
            className={styles.back}
            style={{ margin: "20px auto 0" }}
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
   * =========================
   * RENDER
   * =========================
   */

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* BACK */}

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
              <Image
                src={product.images[currentImage]}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 65vw"
              />

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
                    Срочно
                  </span>
                )}

                <span className={styles.categoryBadge}>{product.type}</span>
              </div>

              {/* IMAGE MANAGEMENT */}

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

              {product.images.length > 1 && (
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

              <div className={styles.imageCounter}>
                {currentImage + 1} / {product.images.length}
              </div>

              {/* IMAGE TITLE */}

              <div className={styles.imageTitle}>
                <span>МОЯ НЕДВИЖИМОСТЬ</span>

                <strong>{product.title}</strong>
              </div>
            </div>

            {/* THUMBNAILS */}

            <div className={styles.thumbnails}>
              {product.images.map((image, index) => (
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

            {/* DOTS */}

            <div className={styles.dots}>
              {product.images.map((_, index) => (
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
          </div>

          {/* SUMMARY */}

          <div className={styles.summary}>
            <div className={styles.summaryTop}>
              <span className={styles.deal}>{product.dealType}</span>

              <span className={styles.published}>Опубликовано</span>
            </div>

            <h1>{product.title}</h1>

            <div className={styles.location}>
              <MapPin size={20} />

              <div>
                <strong>{product.location}</strong>

                <span>{product.address}</span>
              </div>
            </div>

            <div className={styles.price}>{product.price}</div>

            <div className={styles.quickInfo}>
              <div>
                <BedDouble />

                <span>
                  <b>{product.rooms}</b>
                  комнат
                </span>
              </div>

              <div>
                <Ruler />

                <span>
                  <b>{product.area}</b>
                  площадь
                </span>
              </div>

              <div>
                <Layers3 />

                <span>
                  <b>{product.floors}</b>
                  этажа
                </span>
              </div>
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
                Удалить объявление
              </button>
            </div>
          </div>
        </section>

        {/* CONTENT */}

        <div className={styles.contentGrid}>
          <div className={styles.mainContent}>
            {/* DESCRIPTION */}

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

            {/* CHARACTERISTICS */}

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
                {product.characteristics.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div className={styles.characteristic} key={index}>
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

            {/* AMENITIES */}

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
                {product.amenities.map((item, index) => (
                  <div className={styles.amenity} key={index}>
                    <ShieldCheck size={17} />
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* ADDRESS */}

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
                  <strong>{product.location}</strong>

                  <p>{product.address}</p>
                </div>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}

          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <div className={styles.sideTop}>
                <Tag />
                <span>Информация</span>
              </div>

              <div className={styles.sideRow}>
                <span>Категория</span>
                <strong>{product.type}</strong>
              </div>

              <div className={styles.sideRow}>
                <span>Тип предложения</span>
                <strong>{product.dealType}</strong>
              </div>

              <div className={styles.sideRow}>
                <span>Дата публикации</span>
                <strong>{product.createdAt}</strong>
              </div>
            </div>

            <div className={styles.ownerCard}>
              <div className={styles.ownerHeader}>
                <Building2 />
                Управление
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
                Удалить
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* =========================
          DELETE MODAL
          ========================= */}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Удалить объявление?"
        description={`Вы действительно хотите удалить «${product.title}»? Это действие нельзя будет отменить.`}
      />

      {/* =========================
          EDIT MODAL
          ========================= */}

      <AdsEditModal
        isOpen={showEditModal}
        listing={product}
        onClose={handleCloseEdit}
        onSave={handleSave}
      />
    </main>
  );
}
