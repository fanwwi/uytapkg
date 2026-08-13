"use client";

import Image from "next/image";
import {
  MapPin,
  Heart,
  SlidersHorizontal,
  Search,
  Crown,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import styles from "./AllProducts.module.css";

const listings = [
  {
    id: 1,
    title: "Уютный дом у озера Иссык-Куль",
    type: "Дом",
    dealType: "Куплю",
    status: "vip",
    location: "Чолпон-Ата",
    price: "120 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 24,
    rooms: 5,
    area: "180 м²",
  },

  {
    id: 2,
    title: "Современный коттедж с бассейном",
    type: "Коттедж",
    dealType: "Сниму в аренду",
    status: "urgent",
    location: "Бостери",
    price: "250 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 41,
    rooms: 7,
    area: "320 м²",
  },

  {
    id: 3,
    title: "Участок 10 соток возле пляжа",
    type: "Участок",
    dealType: "Куплю",
    status: null,
    location: "Кара-Ой",
    price: "45 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 18,
    rooms: null,
    area: "10 соток",
  },

  {
    id: 4,
    title: "Большой семейный дом",
    type: "Дом",
    dealType: "Сниму в аренду",
    status: "vip",
    location: "Боконбаево",
    price: "95 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 31,
    rooms: 6,
    area: "210 м²",
  },

  {
    id: 5,
    title: "Квартира с видом на горы",
    type: "Квартира",
    dealType: "Куплю",
    status: "urgent",
    location: "Бишкек",
    price: "85 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 56,
    rooms: 3,
    area: "95 м²",
  },

  {
    id: 6,
    title: "Земельный участок под строительство",
    type: "Участок",
    dealType: "Куплю",
    status: null,
    location: "Кант",
    price: "32 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 12,
    rooms: null,
    area: "8 соток",
  },

  {
    id: 7,
    title: "Коммерческое помещение в центре",
    type: "Коммерция",
    dealType: "Куплю",
    status: "vip",
    location: "Бишкек",
    price: "180 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 27,
    rooms: null,
    area: "150 м²",
  },

  {
    id: 8,
    title: "Паркинг возле центра города",
    type: "Паркинг/гараж",
    dealType: "Куплю",
    status: "urgent",
    location: "Бишкек",
    price: "18 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 15,
    rooms: null,
    area: "24 м²",
  },

  {
    id: 9,
    title: "Уютная комната рядом с университетом",
    type: "Комнаты",
    dealType: "Сниму в аренду",
    status: null,
    location: "Бишкек",
    price: "25 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 34,
    rooms: 1,
    area: "22 м²",
  },
];

const categories = [
  "Все",
  "Дом",
  "Квартира",
  "Коттедж",
  "Участок",
  "Коммерция",
  "Паркинг/гараж",
  "Комнаты",
];

export default function AllProducts() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [dealType, setDealType] = useState("Все");

  const filteredListings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = listings.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        activeCategory === "Все" || item.type === activeCategory;

      const matchesDealType = dealType === "Все" || item.dealType === dealType;

      return matchesSearch && matchesCategory && matchesDealType;
    });

    /*
      Приоритет:

      0 — VIP
      1 — Срочно
      2 — Обычное
    */

    return [...filtered].sort((a, b) => {
      const priority = {
        vip: 0,
        urgent: 1,
        null: 2,
      };

      return priority[a.status] - priority[b.status];
    });
  }, [search, activeCategory, dealType]);

  return (
    <main className={styles.page}>
      {/* HEADER */}

      <div className={styles.header}>
        <div>
          <h1>Все объявления</h1>

          <p>Найдите подходящую недвижимость среди доступных предложений</p>
        </div>
      </div>

      {/* SEARCH */}

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Search />

          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          type="button"
          className={styles.filter}
          onClick={() => router.push("/#search")}
        >
          <SlidersHorizontal />
          Фильтры
        </button>
      </div>

      {/* CATEGORIES */}

      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={activeCategory === category ? styles.categoryActive : ""}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* DEAL TYPE */}

      <div className={styles.dealTypes}>
        <button
          type="button"
          className={dealType === "Все" ? styles.dealActive : ""}
          onClick={() => setDealType("Все")}
        >
          Все объявления
        </button>

        <button
          type="button"
          className={dealType === "Куплю" ? styles.dealActive : ""}
          onClick={() => setDealType("Куплю")}
        >
          Куплю
        </button>

        <button
          type="button"
          className={dealType === "Сниму в аренду" ? styles.dealActive : ""}
          onClick={() => setDealType("Сниму в аренду")}
        >
          Сниму в аренду
        </button>
      </div>

      {/* RESULT */}

      <div className={styles.result}>
        <span>Найдено объявлений: </span>

        <strong>{filteredListings.length}</strong>
      </div>

      {/* PRODUCTS */}

      {filteredListings.length > 0 ? (
        <section className={styles.grid}>
          {filteredListings.map((item) => (
            <article
              key={item.id}
              className={styles.card}
              onClick={() => router.push(`/ads/${item.id}`)}
            >
              {/* IMAGE */}

              <div className={styles.image}>
                <Image
                  src={item.image}
                  fill
                  alt={item.title}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                />

                {/* BADGES */}

                <div className={styles.badges}>
                  {item.status === "vip" && (
                    <span className={`${styles.status} ${styles.vip}`}>
                      <Crown />
                      VIP
                    </span>
                  )}

                  {item.status === "urgent" && (
                    <span className={`${styles.status} ${styles.urgent}`}>
                      <Zap />
                      Срочно
                    </span>
                  )}

                  <span className={styles.type}>{item.type}</span>
                </div>

                {/* FAVORITE */}

                <button
                  type="button"
                  className={styles.favorite}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart />
                </button>
              </div>

              {/* CONTENT */}

              <div className={styles.content}>
                <h2>{item.title}</h2>

                <div className={styles.location}>
                  <MapPin />

                  <span>{item.location}</span>
                </div>

                <div className={styles.details}>
                  {item.rooms && (
                    <span>
                      {item.rooms} {item.rooms === 1 ? "комната" : "комнат"}
                    </span>
                  )}

                  <span>{item.area}</span>
                </div>

                {/* BOTTOM */}

                <div className={styles.bottom}>
                  <strong>{item.price}</strong>

                  <button
                    type="button"
                    className={styles.more}
                    onClick={(e) => {
                      e.stopPropagation();

                      router.push(`/all-products/${item.id}`);
                    }}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        /* EMPTY */

        <div className={styles.empty}>
          <Search />

          <h2>Ничего не найдено</h2>

          <p>
            Попробуйте изменить поисковый запрос или выбрать другую категорию.
          </p>
        </div>
      )}
    </main>
  );
}
