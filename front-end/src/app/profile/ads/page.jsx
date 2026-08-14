"use client";

import Image from "next/image";
import {
  MapPin,
  Heart,
  Edit,
  Trash2,
  Eye,
  Plus,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./Ads.module.css";

const listings = [
  {
    id: 1,
    title: "Уютный дом у озера Иссык-Куль",
    type: "Дом",
    location: "Чолпон-Ата",
    price: "120 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    status: "Активно",
    likes: 12,
    views: 184,
  },
  {
    id: 2,
    title: "Современный коттедж с бассейном",
    type: "Коттедж",
    location: "Бостери",
    price: "250 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    status: "Активно",
    likes: 27,
    views: 341,
  },
  {
    id: 3,
    title: "Участок 10 соток возле пляжа",
    type: "Участок",
    location: "Кара-Ой",
    price: "45 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    status: "На модерации",
    likes: 8,
    views: 72,
  },
];

export default function Ads() {
  const router = useRouter();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}

        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Личный кабинет</span>

            <h1>Мои объявления</h1>

            <p>
              Управляйте своими объектами недвижимости, отслеживайте просмотры и
              редактируйте публикации.
            </p>
          </div>

          <button
            type="button"
            className={styles.add}
            onClick={() => router.push("/add-product")}
          >
            <Plus />
            Добавить объявление
          </button>
        </header>

        {/* RESULT */}

        <div className={styles.result}>
          <div>
            <strong>{listings.length}</strong>
            <span> объявления</span>
          </div>
        </div>

        {/* PRODUCTS */}

        {listings.length > 0 ? (
          <section className={styles.grid}>
            {listings.map((item) => (
              <article key={item.id} className={styles.card}>
                {/* IMAGE */}

                <div
                  className={styles.image}
                  onClick={() => router.push(`/ads/${item.id}`)}
                >
                  <Image
                    src={item.image}
                    fill
                    alt={item.title}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  />

                  <div className={styles.badges}>
                    <span className={styles.type}>{item.type}</span>

                    <span
                      className={`${styles.status} ${
                        item.status === "Активно"
                          ? styles.active
                          : styles.pending
                      }`}
                    >
                      {item.status === "Активно" ? (
                        <CheckCircle2 />
                      ) : (
                        <AlertCircle />
                      )}

                      {item.status}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}

                <div className={styles.content}>
                  <h2>{item.title}</h2>

                  <div className={styles.location}>
                    <MapPin />
                    <span>{item.location}</span>
                  </div>

                  <div className={styles.metrics}>
                    <span>
                      <Eye />
                      {item.views}
                    </span>

                    <span>
                      <Heart />
                      {item.likes}
                    </span>
                  </div>

                  <div className={styles.bottom}>
                    <strong>{item.price}</strong>
                  </div>

                  {/* ACTIONS */}

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.edit}
                      onClick={() => router.push(`/ads/${item.id}/edit`)}
                    >
                      <Edit />
                      Изменить
                    </button>

                    <button
                      type="button"
                      className={styles.delete}
                      onClick={() => {
                        console.log("Удалить:", item.id);
                      }}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Plus />
            </div>

            <h2>У вас пока нет объявлений</h2>

            <p>Добавьте первый объект недвижимости, чтобы он появился здесь.</p>

            <button type="button" onClick={() => router.push("/add-product")}>
              <Plus />
              Добавить объявление
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
