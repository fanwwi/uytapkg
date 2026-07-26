"use client";

import Image from "next/image";
import { Heart, MapPin, BedDouble, Ruler, Trash2 } from "lucide-react";

import styles from "./Favorites.module.css";

const favorites = [
  {
    id: 1,
    title: "Современный коттедж у озера",
    type: "Коттедж",
    location: "Чолпон-Ата",
    price: "180 000 $",
    rooms: 5,
    area: "240 м²",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPfrqLOj1vCIyxuhut0ikPn4I5aU4Pa_INWbZA7KVmfbvbDyM1PGxTYN4&s=10",
  },
  {
    id: 2,
    title: "Дом с бассейном возле пляжа",
    type: "Дом",
    location: "Бостери",
    price: "120 000 $",
    rooms: 4,
    area: "180 м²",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPfrqLOj1vCIyxuhut0ikPn4I5aU4Pa_INWbZA7KVmfbvbDyM1PGxTYN4&s=10",
  },
  {
    id: 3,
    title: "Участок под строительство",
    type: "Участок",
    location: "Кара-Ой",
    price: "45 000 $",
    rooms: "-",
    area: "8 соток",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPfrqLOj1vCIyxuhut0ikPn4I5aU4Pa_INWbZA7KVmfbvbDyM1PGxTYN4&s=10",
  },
];

export default function FavoritesPage() {
  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div className={styles.icon}>
          <Heart />
        </div>

        <div>
          <h1>Избранное</h1>
          <p>Здесь находятся сохранённые вами объявления</p>
        </div>
      </section>

      {favorites.length === 0 ? (
        <div className={styles.empty}>
          <Heart />

          <h2>У вас пока нет избранных объектов</h2>

          <p>
            Добавляйте понравившиеся объявления, чтобы быстро найти их позже
          </p>
        </div>
      ) : (
        <section className={styles.grid}>
          {favorites.map((item) => (
            <article className={styles.card} key={item.id}>
              <div className={styles.image}>
                <Image src={item.image} alt={item.title} fill />

                <button className={styles.remove}>
                  <Trash2 />
                </button>
              </div>

              <div className={styles.content}>
                <span className={styles.type}>{item.type}</span>

                <h2>{item.title}</h2>

                <div className={styles.info}>
                  <p>
                    <MapPin />
                    {item.location}
                  </p>

                  <p>
                    <BedDouble />
                    {item.rooms} комнат
                  </p>

                  <p>
                    <Ruler />
                    {item.area}
                  </p>
                </div>

                <div className={styles.bottom}>
                  <strong>{item.price}</strong>

                  <button>Смотреть</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
