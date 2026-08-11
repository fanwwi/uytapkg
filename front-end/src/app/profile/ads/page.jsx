"use client";

import Image from "next/image";
import { MapPin, Heart, Edit, Trash2 } from "lucide-react";
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
  },
];

export default function Ads() {
  const router = useRouter();

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Мои объявления</h1>
          <p>Управляйте своими объектами недвижимости</p>
        </div>

        <button
          type="button"
          className={styles.add}
          onClick={() => router.push("/add-product")}
        >
          + Добавить объявление
        </button>
      </div>

      <section className={styles.grid}>
        {listings.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.image}>
              <Image
                src={item.image}
                fill
                alt={item.title}
                sizes="(max-width: 768px) 100vw, 400px"
              />

              <span
                className={
                  item.status === "Активно" ? styles.active : styles.pending
                }
              >
                {item.status}
              </span>
            </div>

            <div className={styles.content}>
              <h2>{item.title}</h2>

              <div className={styles.location}>
                <MapPin />
                {item.location}
              </div>

              <div className={styles.info}>
                <span>{item.type}</span>
                <strong>{item.price}</strong>
              </div>

              <div className={styles.stats}>
                <span>
                  <Heart />
                  12
                </span>
              </div>

              <div className={styles.actions}>
                <button type="button">
                  <Edit />
                  Изменить
                </button>

                <button type="button" className={styles.delete}>
                  <Trash2 />
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
