"use client";

import Image from "next/image";
import { Heart, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ListingCard from "@/components/ui/ListingCard/ListingCard";

import styles from "./Favorites.module.css";

const initialFavorites = [
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
    rooms: 3,
    area: "95 м²",
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

export default function Favorites() {
  const router = useRouter();

  const [favorites, setFavorites] = useState(initialFavorites);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");

  function removeFavorite(id) {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  }

  const filteredFavorites = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = favorites.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.location.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        activeCategory === "Все" || item.type === activeCategory;

      return matchesSearch && matchesCategory;
    });

    const priority = {
      vip: 0,
      urgent: 1,
      null: 2,
    };

    return [...filtered].sort(
      (a, b) => priority[a.status] - priority[b.status],
    );
  }, [favorites, search, activeCategory]);

  return (
    <main className={styles.page}>
      {/* HEADER */}

      <header className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <div className={styles.titleIcon}>
              <Heart fill="currentColor" />
            </div>

            <div>
              <h1>Избранное</h1>

              <p>Сохранённые объявления, которые вы хотите посмотреть позже</p>
            </div>
          </div>
        </div>

        <div className={styles.counter}>
          <Heart fill="currentColor" />
          <strong>{favorites.length}</strong>
          <span>
            {favorites.length === 1
              ? "объявление"
              : favorites.length < 5
                ? "объявления"
                : "объявлений"}
          </span>
        </div>
      </header>

      {/* SEARCH */}

      {favorites.length > 0 && (
        <>
          <div className={styles.toolbar}>
            <div className={styles.search}>
              <Search />

              <input
                type="text"
                placeholder="Поиск в избранном..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* CATEGORIES */}

          <div className={styles.categories}>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category ? styles.categoryActive : ""
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* RESULT */}

          <div className={styles.result}>
            <span>В избранном найдено:</span>

            <strong>{filteredFavorites.length}</strong>
          </div>
        </>
      )}

      {/* PRODUCTS */}

      {filteredFavorites.length > 0 ? (
        <section className={styles.grid}>
          {filteredFavorites.map((item) => (
            <ListingCard
              key={item.id}
              item={item}
              isFavorite={true}
              onFavoriteClick={(clickedItem) => removeFavorite(clickedItem.id)}
            />
          ))}
        </section>
      ) : favorites.length > 0 ? (
        /* SEARCH EMPTY */

        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Search />
          </div>

          <h2>Ничего не найдено</h2>

          <p>В избранном нет объявлений, соответствующих вашему запросу.</p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategory("Все");
            }}
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        /* EMPTY FAVORITES */

        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Heart />
          </div>

          <h2>Избранное пока пусто</h2>

          <p>
            Сохраняйте понравившиеся объявления, чтобы быстро вернуться к ним
            позже.
          </p>

          <button type="button" onClick={() => router.push("/all-products")}>
            Смотреть объявления
          </button>
        </div>
      )}
    </main>
  );
}
