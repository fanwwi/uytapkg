"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  Coffee,
  ShoppingBag,
  UsersRound,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import styles from "./ComplexDetail.module.css";

/*
const residentialComplex = {
  id: 1,
  name: "ЖК MALINA",
  subtitle: "Премиальный жилой комплекс в Бишкеке",
  class: "Премиум-класс",
  status: "В продаже",
  location: "Бишкек",
  address: "Юго-восточная часть города",
  developer: "MALINA Development",
  completion: "III квартал 2027",
  floors: 10,
  blocks: 3,
  landArea: "1 га",
  apartments: "120 квартир",
  ceilingHeight: "до 3,6 м",
  constructionType: "Монолитно-каркасная",
  heating: "Автономная газовая котельная",
  parking: "Подземный паркинг",
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
  galleryLabel: "Галерея комплекса",
  createdAt: "12 августа 2026",
};
*/

const defaultResidentialComplex = {
  id: 1,
  name: "ЖК MALINA",
  subtitle: "Премиальный жилой комплекс в Бишкеке",
  class: "Премиум-класс",
  status: "В продаже",
  location: "Бишкек",
  address: "Юго-восточная часть города",
  developer: "MALINA Development",
  completion: "III квартал 2027",
  floors: 10,
  blocks: 3,
  landArea: "1 га",
  apartments: "120 квартир",
  ceilingHeight: "до 3,6 м",
  constructionType: "Монолитно-каркасная",
  heating: "Автономная газовая котельная",
  parking: "Подземный паркинг",
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
  galleryLabel: "Галерея комплекса",
  createdAt: "12 августа 2026",
};

export default function ComplexesDetails() {
  const router = useRouter();
  const params = useParams();
  const complexId = params?.id;

  const [residentialComplex, setResidentialComplex] = useState(defaultResidentialComplex);
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
        const res = await getComplexById(complexId);
        if (res && res.success && res.data) {
          const mapped = mapComplexData(res.data);
          setResidentialComplex({
            ...defaultResidentialComplex,
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
            images: res.data.cover_photo
              ? [res.data.cover_photo, ...defaultResidentialComplex.images.slice(1)]
              : defaultResidentialComplex.images,
          });
        }
      } catch (err) {
        console.error("Failed to load complex detail:", err);
        setError(err.message || "Ошибка загрузки жилого комплекса");
      } finally {
        setLoading(false);
      }
    }

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
                className={styles.favorite}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
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
                <span>ЖИЛОЙ КОМПЛЕКС</span>
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
            <div className={styles.eyebrow}>
              <Building2 size={15} />
              ЖИЛОЙ КОМПЛЕКС
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

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() =>
                document
                  .getElementById("apartments")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
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
              <h2>О проекте</h2>
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

          <div className={styles.address}>
            <div>
              <strong>{residentialComplex.address}</strong>
            </div>
          </div>
        </section>

        {/* APARTMENTS CTA */}

        <section className={styles.apartmentsCta} id="apartments">
          <div>
            <span>ВЫБОР КВАРТИРЫ</span>

            <h2>Найдите своё пространство</h2>

            <p>
              Выберите планировку, этаж и площадь квартиры в{" "}
              {residentialComplex.name}.
            </p>
          </div>

          <button type="button" onClick={() => router.push("/apartments")}>
            Смотреть профиль застройщика
            <ArrowRight size={18} />
          </button>
        </section>
      </div>
    </main>
  );
}
