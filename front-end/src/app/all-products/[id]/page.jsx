"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MapPin,
  Home,
  Ruler,
  BedDouble,
  Building2,
  CalendarDays,
  UserRound,
  Phone,
  MessageCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Tag,
  Layers3,
  Flame,
  Sparkles,
  DoorOpen,
  CarFront,
  Waves,
  Zap,
  Droplets,
  FileCheck,
} from "lucide-react";

import styles from "./ProductDetails.module.css";

const product = {
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
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
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

  owner: {
    id: "4",
    name: "Александр Иванов",
    role: "Владелец объявления",
    avatar: "https://i.pravatar.cc/150?img=12",
  },

  createdAt: "12 августа 2026",
};

export default function ProductDetails() {
  const router = useRouter();

  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const previousImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
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

                <span className={styles.categoryBadge}>{product.type}</span>
              </div>

              <button
                type="button"
                className={styles.favorite}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart size={23} fill={isFavorite ? "currentColor" : "none"} />
              </button>

              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.left}`}
                    onClick={previousImage}
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.right}`}
                    onClick={nextImage}
                  >
                    <ChevronRight />
                  </button>
                </>
              )}

              <div className={styles.imageCounter}>
                {currentImage + 1} / {product.images.length}
              </div>
            </div>

            {/* THUMBNAILS */}

            <div className={styles.thumbnails}>
              {product.images.map((image, index) => (
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
                />
              ))}
            </div>
          </div>

          {/* SUMMARY */}

          <div className={styles.summary}>
            <div className={styles.summaryTop}>
              <span className={styles.deal}>{product.dealType}</span>
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
          </div>
        </section>

        {/* CONTENT */}

        <div className={styles.contentGrid}>
          <div className={styles.mainContent}>
            {/* ABOUT */}

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

          {/* SIDE */}

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

            <div className={styles.ownerSideCard}>
              <div className={styles.ownerSideHeader}>
                <UserRound />
                Владелец
              </div>

              <div className={styles.ownerSideProfile}>
                <div className={styles.ownerSideAvatar}>
                  <Image
                    src={product.owner.avatar}
                    alt={product.owner.name}
                    fill
                    sizes="55px"
                  />
                </div>

                <div>
                  <strong>{product.owner.name}</strong>
                  <span>{product.owner.role}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push(`/public-profile/${product.owner.id}`)}
              >
                Связаться с владельцем
                <ArrowRight size={17} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
