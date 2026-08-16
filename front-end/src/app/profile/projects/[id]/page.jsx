"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getComplexById, updateComplex as updateComplexApi, deleteComplex as deleteComplexApi } from "@/utils/api";
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

  floors: 10,
  blocks: 3,

  landArea: "1 га",
  area: 1,

  apartments: "120 квартир",
  parking: "Подземный паркинг",

  ceilingHeight: "до 3,6 м",
  constructionType: "Монолитно-каркасная",
  heating: "Автономная газовая котельная",

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

  const loadComplex = async () => {
    if (!complexId) return;
    try {
      setLoading(true);
      setError("");
      const res = await getComplexById(complexId);
      if (res && res.success && res.data) {
        const mapped = mapComplexData(res.data);
        setResidentialComplex({
          ...initialResidentialComplex,
          id: res.data.id,
          name: mapped.name,
          subtitle: `${mapped.housingClass} в регионе ${mapped.address}`,
          class: mapped.housingClass,
          status: mapped.completionStatus,
          location: res.data.city || res.data.region || "Кыргызстан",
          address: mapped.address,
          developer: mapped.developer,
          completion: res.data.completion_date || "Уточняйте у застройщика",
          description: mapped.description,
          concept: res.data.description || initialResidentialComplex.concept,
          floors: res.data.features?.floors || initialResidentialComplex.floors,
          apartments: res.data.features?.apartments ? `${res.data.features.apartments} квартир` : initialResidentialComplex.apartments,
          parking: res.data.features?.parking ? `${res.data.features.parking} мест` : initialResidentialComplex.parking,
          landArea: res.data.features?.area ? `${res.data.features.area} м²` : initialResidentialComplex.landArea,
          images: (res.data.features?.images && res.data.features.images.length > 0)
            ? res.data.features.images
            : (res.data.cover_photo ? [res.data.cover_photo] : initialResidentialComplex.images),
        });
      }
    } catch (err) {
      console.error("Failed to load complex detail:", err);
      setError(err.message || "Ошибка загрузки жилого комплекса");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplex();
  }, [complexId]);

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === residentialComplex.images.length - 1 ? 0 : prev + 1,
    );
  };

  const previousImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? residentialComplex.images.length - 1 : prev - 1,
    );
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSave = async (updatedComplex) => {
    try {
      const token = localStorage.getItem("uytap_token");
      if (!token) throw new Error("Вы не авторизованы");

      const payload = {
        name: updatedComplex.name,
        address: updatedComplex.address,
        status: updatedComplex.status,
        class: updatedComplex.class,
        completionDate: updatedComplex.completionDate,
        floors: Number(updatedComplex.floors) || 0,
        apartments: Number(updatedComplex.apartments) || 0,
        parking: Number(updatedComplex.parking) || 0,
        area: Number(updatedComplex.area) || 0,
      };

      const res = await updateComplexApi(token, residentialComplex.id, payload);
      if (!res.success) throw new Error(res.message || "Ошибка сохранения");

      await loadComplex();
      setCurrentImage(0);
      setShowEditModal(false);
    } catch (err) {
      alert(err.message || "Не удалось сохранить изменения");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("uytap_token");
      if (!token) throw new Error("Вы не авторизованы");

      const res = await deleteComplexApi(token, residentialComplex.id);
      if (!res.success) throw new Error(res.message || "Ошибка удаления");

      setShowDeleteModal(false);
      router.push("/profile/projects");
    } catch (error) {
      console.error("Ошибка при удалении ЖК:", error);
      alert(error.message || "Не удалось удалить ЖК");
    }
  };

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

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0", color: "#888", fontSize: "16px" }}>
            <span style={{ display: "inline-block", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #ff3d99", borderRadius: "50%", width: "30px", height: "30px", animation: "spin 1s linear infinite", marginBottom: "15px" }} />
            <div>Загрузка информации о жилом комплексе...</div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ color: "#e53e3e", background: "#fed7d7", padding: "15px", borderRadius: "10px", margin: "40px 0", textAlign: "center", border: "1px solid #feb2b2" }}>
            {error}
          </div>
        ) : (
          <>
            {/* HERO */}

            <section className={styles.hero}>
          <div className={styles.heroGallery}>
            <div className={styles.mainImage}>
              <Image
                src={residentialComplex.images[currentImage]}
                alt={residentialComplex.name}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 68vw"
              />

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
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.galleryRight}`}
                    onClick={nextImage}
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

            <div className={styles.thumbnails}>
              {residentialComplex.images.map((image, index) => (
                <button
                  key={index}
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

            <p className={styles.heroSubtitle}>{residentialComplex.subtitle}</p>

            <div className={styles.heroLocation}>
              <MapPin size={19} />

              <div>
                <strong>{residentialComplex.location}</strong>
                <span>{residentialComplex.address}</span>
              </div>
            </div>

            <div className={styles.heroDivider} />

            {/* OWNER */}

            <div className={styles.developer}>
              <div className={styles.developerIcon}>
                <Building2 size={18} />
              </div>

              <div>
                <span>ЗАСТРОЙЩИК</span>
                <strong>{residentialComplex.developer}</strong>
              </div>
            </div>

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

              <p className={styles.description}>{residentialComplex.concept}</p>
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
                <span>0{index + 1}</span>

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
