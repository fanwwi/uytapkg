"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  getComplexById,
  updateComplex as updateComplexApi,
  deleteComplex as deleteComplexApi,
} from "@/utils/api";

import { mapComplexData } from "@/utils/mapComplexData";

import {
  ArrowLeft,
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
  Pencil,
  Trash2,
  FileCheck,
  ExternalLink,
} from "lucide-react";

import styles from "./MycomplexDetails.module.css";

import DeleteModal from "@/components/ui/deleteModal/DeleteMidal";
import EditResidentialComplexModal from "../EditResidentialComplexModal/EditResidentialComplexModal";

const initialResidentialComplex = {
  id: 1,

  name: "ЖК MALINA",
  subtitle: "Премиальный жилой комплекс в Бишкеке",

  class: "Премиум-класс",
  status: "В продаже",

  location: "Бишкек",
  city: "Бишкек",

  address: "Юго-восточная часть города",

  developer: "MALINA Development",

  completion: "III квартал 2027",
  completionDate: "2027-09-01",

  floors: "Не указано",
  blocks: "Не указано",

  landArea: "Не указано",
  area: null,

  apartments: "Не указано",
  parking: "Не указано",

  ceilingHeight: "Не указано",
  constructionType: "Не указано",
  heating: "Не указано",

  description:
    "MALINA — современный жилой комплекс премиального класса, созданный для людей, которые ценят приватность, архитектуру и качество городской среды. Комплекс объединяет выразительную архитектуру, озеленённую территорию, продуманную инфраструктуру и современные инженерные решения.",

  concept:
    "Главная идея MALINA — создать не просто место для проживания, а закрытую жилую среду, где архитектура, природа, безопасность и повседневный комфорт работают как единая система.",

  images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1800&auto=format&fit=crop",
  ],

  amenities: [
    "Закрытая территория",
    "Двор без машин",
    "Детская площадка",
    "Взрослая зона отдыха",
    "Ландшафтный дизайн",
    "Подземный паркинг",
    "Видеонаблюдение",
    "Охрана 24/7",
    "Современное лобби",
    "Зоны отдыха",
    "Фитнес-инфраструктура",
    "Коммерческие помещения",
  ],

  advantages: [
    {
      icon: Trees,
      title: "Просторная территория",
      description: "Озеленённый двор с ландшафтным дизайном и зонами отдыха.",
    },
    {
      icon: ShieldCheck,
      title: "Безопасность 24/7",
      description:
        "Закрытая территория, видеонаблюдение и контролируемый доступ.",
    },
    {
      icon: CarFront,
      title: "Подземный паркинг",
      description: "Безопасное парковочное пространство для жителей комплекса.",
    },
    {
      icon: Waves,
      title: "Зоны отдыха",
      description: "Продуманные пространства для отдыха жителей и гостей.",
    },
    {
      icon: Dumbbell,
      title: "Фитнес",
      description: "Спортивная инфраструктура для активного образа жизни.",
    },
    {
      icon: DoorOpen,
      title: "Премиальное лобби",
      description: "Современная входная группа с качественными материалами.",
    },
  ],

  infrastructure: [
    "Закрытая территория",
    "Двор без машин",
    "Детская площадка",
    "Взрослая зона отдыха",
    "Ландшафтный дизайн",
    "Подземный паркинг",
    "Видеонаблюдение",
    "Охрана 24/7",
    "Современное лобби",
    "Зоны отдыха",
    "Фитнес-инфраструктура",
    "Коммерческие помещения",
  ],

  architecture: [
    {
      title: "Современная архитектура",
      text: "Чистые линии, панорамное остекление и выразительные фасады формируют узнаваемый облик комплекса.",
    },
    {
      title: "Продуманные пространства",
      text: "Архитектура комплекса создаёт баланс между приватностью жителей и комфортными общественными пространствами.",
    },
    {
      title: "Панорамное остекление",
      text: "Большие окна обеспечивают естественное освещение и визуально расширяют пространство квартир.",
    },
  ],

  engineering: [
    {
      icon: Flame,
      title: "Отопление",
      value: "Автономная газовая котельная",
    },
    {
      icon: Zap,
      title: "Электроснабжение",
      value: "Современная инженерная система",
    },
    {
      icon: ShieldCheck,
      title: "Безопасность",
      value: "Контролируемый доступ",
    },
    {
      icon: Camera,
      title: "Видеонаблюдение",
      value: "24/7",
    },
  ],
};

export default function MyComplexDetail() {
  const router = useRouter();
  const params = useParams();

  const complexId = params?.id;

  const [residentialComplex, setResidentialComplex] = useState(
    initialResidentialComplex,
  );

  const [currentImage, setCurrentImage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * LOAD COMPLEX
   */
  useEffect(() => {
    if (!complexId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getComplexById(complexId);

        if (!res || !res.success || !res.data) {
          throw new Error("Жилой комплекс не найден");
        }

        const f = res.data.features || {};

        const formatBlocks = (val) => {
          if (val === undefined || val === null || val === "" || val === 0) return "Не указано";
          const str = String(val).trim();
          return str.includes("блок") ? str : `${str} блоков`;
        };

        const formatHeight = (val) => {
          if (val === undefined || val === null || val === "" || val === 0) return "Не указано";
          const str = String(val).trim();
          return str.includes("м") ? str : `${str} м`;
        };

        setResidentialComplex({
          ...initialResidentialComplex,
          id: res.data.id,
          name: mapped.name,
          subtitle: `${mapped.housingClass} в регионе ${mapped.address}`,
          class: mapped.housingClass,
          status: mapped.completionStatus,
          location: res.data.city || res.data.region || "Кыргызстан",
          city: res.data.city || res.data.region || "Кыргызстан",
          address: mapped.address,
          developer: mapped.developer,
          completion: res.data.completion_date || "Уточняйте у застройщика",
          completionDate: res.data.completion_date || "",
          description: mapped.description,
          concept: res.data.description || "Описание проекта от застройщика.",
          floors: f.floors ? `${f.floors}` : "Не указано",
          blocks: formatBlocks(f.blocks),
          apartments: f.apartments ? `${f.apartments} квартир` : "Не указано",
          parking: f.parking ? `${f.parking} мест` : "Не указано",
          landArea: f.areaSotka ? `${f.areaSotka} соток` : (f.area ? `${f.area} м²` : "Не указано"),
          ceilingHeight: formatHeight(f.ceilingHeight),
          constructionType: f.construction || "Не указано",
          images: (f.images && f.images.length > 0)
            ? f.images
            : (res.data.cover_photo ? [res.data.cover_photo] : []),
          rawFeatures: f,
        });

        setCurrentImage(0);
      } catch (err) {
        console.error("Failed to load complex detail:", err);
        setError(err.message || "Ошибка загрузки жилого комплекса");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [complexId]);

  /*
   * CURRENT IMAGE
   */
  const currentImageSrc =
    residentialComplex.images[currentImage] || residentialComplex.images[0];

  /*
   * GALLERY
   */
  const nextImage = () => {
    if (residentialComplex.images.length <= 1) return;

    setCurrentImage((prev) =>
      prev >= residentialComplex.images.length - 1 ? 0 : prev + 1,
    );
  };

  const previousImage = () => {
    if (residentialComplex.images.length <= 1) return;

    setCurrentImage((prev) =>
      prev <= 0 ? residentialComplex.images.length - 1 : prev - 1,
    );
  };

  /*
   * EDIT
   */
  const handleEdit = () => {
    setShowEditModal(true);
  };

  /*
   * SAVE
   */
  const handleSave = async (updatedComplex) => {
    try {
      const token = localStorage.getItem("uytap_token");

      if (!token) {
        throw new Error("Вы не авторизованы");
      }

      const parseNum = (val) => {
        if (val === undefined || val === null || val === "") return null;
        const num = parseFloat(String(val).replace(",", "."));
        return isNaN(num) ? val : num;
      };

      const payload = {
        name: updatedComplex.name,
        address: updatedComplex.address,
        status: updatedComplex.status,
        class: updatedComplex.class,
        construction: updatedComplex.construction,
        completionDate: updatedComplex.completionDate,
        floors: parseNum(updatedComplex.floors),
        blocks: parseNum(updatedComplex.blocks),
        apartments: parseNum(updatedComplex.apartments),
        parking: parseNum(updatedComplex.parking),
        ceilingHeight: parseNum(updatedComplex.ceilingHeight),
        area: parseNum(updatedComplex.area),
        areaSotka: parseNum(updatedComplex.landArea || updatedComplex.areaSotka),
        amenities: updatedComplex.amenities || [],
      };

      const res = await updateComplexApi(token, residentialComplex.id, payload);

      if (!res || !res.success) {
        throw new Error(res?.message || "Ошибка сохранения");
      }

      /*
       * Reload fresh data
       */
      const refreshed = await getComplexById(residentialComplex.id);

      if (refreshed && refreshed.success && refreshed.data) {
        const mapped = mapComplexData(refreshed.data);

        const images =
          refreshed.data.features?.images &&
          Array.isArray(refreshed.data.features.images) &&
          refreshed.data.features.images.length > 0
            ? refreshed.data.features.images
            : refreshed.data.cover_photo
              ? [refreshed.data.cover_photo]
              : initialResidentialComplex.images;

        setResidentialComplex((prev) => ({
          ...prev,

          id: refreshed.data.id,

          name: mapped.name || refreshed.data.name || prev.name,

          subtitle: `${mapped.housingClass || prev.class} в регионе ${
            mapped.address || prev.address
          }`,

          class: mapped.housingClass || prev.class,

          status: mapped.completionStatus || prev.status,

          location:
            refreshed.data.city || refreshed.data.region || prev.location,

          city: refreshed.data.city || refreshed.data.region || prev.city,

          address: mapped.address || refreshed.data.address || prev.address,

          developer:
            mapped.developer || refreshed.data.developer || prev.developer,

          completion: refreshed.data.completion_date || prev.completion,

          completionDate: refreshed.data.completion_date || prev.completionDate,

          description: mapped.description || prev.description,

          concept: refreshed.data.description || prev.concept,

          floors: refreshed.data.features?.floors ?? prev.floors,

          blocks: refreshed.data.features?.blocks ?? prev.blocks,

          apartments: refreshed.data.features?.apartments
            ? `${refreshed.data.features.apartments} квартир`
            : prev.apartments,

          parking: refreshed.data.features?.parking
            ? `${refreshed.data.features.parking} мест`
            : prev.parking,

          landArea: refreshed.data.features?.area
            ? `${refreshed.data.features.area} м²`
            : prev.landArea,

          area: Number(refreshed.data.features?.area) || prev.area,

          images,
        }));
      } else {
        /*
         * Fallback
         */
        const mapped = mapComplexData(res.data || updatedComplex);

        setResidentialComplex((prev) => ({
          ...prev,

          name: mapped.name || updatedComplex.name || prev.name,

          address: mapped.address || updatedComplex.address || prev.address,

          class: mapped.housingClass || updatedComplex.class || prev.class,

          status:
            mapped.completionStatus || updatedComplex.status || prev.status,
        }));
      }

      setCurrentImage(0);
      setShowEditModal(false);
    } catch (err) {
      console.error("Ошибка при сохранении ЖК:", err);

      alert(
        err instanceof Error ? err.message : "Не удалось сохранить изменения",
      );
    }
  };

  /*
   * DELETE
   */
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("uytap_token");

      if (!token) {
        throw new Error("Вы не авторизованы");
      }

      const res = await deleteComplexApi(token, residentialComplex.id);

      if (!res || !res.success) {
        throw new Error(res?.message || "Ошибка удаления");
      }

      setShowDeleteModal(false);

      router.push("/profile/projects");
    } catch (err) {
      console.error("Ошибка при удалении ЖК:", err);

      alert(err instanceof Error ? err.message : "Не удалось удалить ЖК");
    }
  };

  /*
   * MINSTROY
   */
  const openMinstroy = () => {
    window.open("https://minstroy.gov.kg/", "_blank", "noopener,noreferrer");
  };

  /*
   * RENDER
   */
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* TOP BAR */}

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

        {/* LOADING */}

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "100px 0",
              color: "#888",
              fontSize: "16px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                border: "3px solid rgba(255,255,255,0.1)",
                borderTop: "3px solid #ff3d99",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                animation: "spin 1s linear infinite",
                marginBottom: "15px",
              }}
            />

            <div>Загрузка информации о жилом комплексе...</div>

            <style>{`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }

                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div
            style={{
              color: "#e53e3e",
              background: "#fed7d7",
              padding: "15px",
              borderRadius: "10px",
              margin: "40px 0",
              textAlign: "center",
              border: "1px solid #feb2b2",
            }}
          >
            {error}
          </div>
        )}

        {/* CONTENT */}

        {!loading && !error && (
          <>
            {/* HERO */}

            <section className={styles.hero}>
              <div className={styles.heroGallery}>
                <div className={styles.mainImage}>
                  {currentImageSrc && (
                    <Image
                      src={currentImageSrc}
                      alt={residentialComplex.name}
                      fill
                      priority
                      sizes="(max-width: 900px) 100vw, 68vw"
                    />
                  )}

                  <div className={styles.imageGradient} />

                  <div className={styles.heroBadges}>
                    <span className={styles.premiumBadge}>
                      <Sparkles size={14} />

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

                  {residentialComplex.images.length > 1 && (
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
                    {currentImage + 1} / {residentialComplex.images.length}
                  </div>

                  <div className={styles.heroImageText}>
                    <span>МОЙ ЖИЛОЙ КОМПЛЕКС</span>

                    <strong>{residentialComplex.name}</strong>
                  </div>
                </div>

                {/* THUMBNAILS */}

                {residentialComplex.images.length > 1 && (
                  <div className={styles.thumbnails}>
                    {residentialComplex.images.map((image, index) => (
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
                <div className={styles.managementRow}>
                  <div className={styles.eyebrow}>
                    <Building2 size={15} />
                    МОЙ ЖИЛОЙ КОМПЛЕКС
                  </div>
                </div>

                <h1>{residentialComplex.name}</h1>

                <p className={styles.heroSubtitle}>
                  {residentialComplex.subtitle}
                </p>

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
                      блока
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

                {/* COMPLETION */}

                <div className={styles.completion}>
                  <div className={styles.completionIcon}>
                    <CalendarDays size={19} />
                  </div>

                  <div>
                    <span>СРОК СДАЧИ</span>

                    <strong>{residentialComplex.completion}</strong>
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
                  <p className={styles.description}>
                    {residentialComplex.description}
                  </p>

                  <p className={styles.description}>
                    {residentialComplex.concept}
                  </p>
                </div>

                <div className={styles.aboutHighlight}>
                  <Sparkles />

                  <strong>
                    Пространство,
                    <br />
                    созданное для жизни
                  </strong>

                  <span>
                    Архитектура, природа и приватность объединены в единую
                    концепцию.
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

                  <strong>{residentialComplex.floors} этажей</strong>
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

            {/* ADVANTAGES */}

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <Sparkles />
                </div>

                <div>
                  <span>ПРЕИМУЩЕСТВА</span>

                  <h2>Почему этот ЖК</h2>
                </div>
              </div>

              <div className={styles.advantages}>
                {residentialComplex.advantages.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div className={styles.advantage} key={index}>
                      <div className={styles.advantageIcon}>
                        <Icon size={21} />
                      </div>

                      <div>
                        <strong>{item.title}</strong>

                        <p>{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ARCHITECTURE */}

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <Building2 />
                </div>

                <div>
                  <span>АРХИТЕКТУРА</span>

                  <h2>Архитектурная концепция</h2>
                </div>
              </div>

              <div className={styles.architectureGrid}>
                {residentialComplex.architecture.map((item, index) => (
                  <div className={styles.architectureItem} key={index}>
                    <span>{String(index + 1).padStart(2, "0")}</span>

                    <h3>{item.title}</h3>

                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* INFRASTRUCTURE */}

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
                {residentialComplex.infrastructure.map((item, index) => (
                  <div className={styles.infrastructureItem} key={index}>
                    <CheckCircle2 size={17} />

                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* ENGINEERING */}

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
                {residentialComplex.engineering.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div className={styles.engineeringItem} key={index}>
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

              <div className={styles.addressBlock}>
                <strong>{residentialComplex.address}</strong>
              </div>
            </section>

            {/* OFFICIAL DOCUMENTS */}

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
                    <strong>Информация о строительстве моего объекта</strong>

                    <p>
                      Перейти на официальный ресурс Министерства строительства
                      и проверить паспорт строительного объекта и доступную
                      информацию о моем жилом комплексе.
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
          </>
        )}
      </div>

      {/* DELETE MODAL */}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Удалить жилой комплекс?"
        description={`Вы действительно хотите удалить «${residentialComplex.name}»? Это действие нельзя будет отменить.`}
      />

      {/* EDIT MODAL */}

      <EditResidentialComplexModal
        complex={showEditModal ? residentialComplex : null}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
      />
    </main>
  );
}
