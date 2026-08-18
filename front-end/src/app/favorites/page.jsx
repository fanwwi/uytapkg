"use client";

import { Heart, Search, House } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFavorites, removeFavorite as removeFavoriteApi } from "@/utils/api";
import { mapListingData } from "@/utils/mapListingData";

import styles from "./Favorites.module.css";
import ListingCardBlack from "@/components/ui/ListingCardBlack/ListingCardBlack";

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

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");

  useEffect(() => {
    const token = localStorage.getItem("uytap_token");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    getFavorites(token)
      .then((res) => {
        if (res.success && res.data) {
          const mapped = res.data.map((item) => mapListingData(item));
          setFavorites(mapped);
        } else {
          setError(res.message || "Не удалось загрузить список избранного");
        }
      })
      .catch((err) => {
        console.error("Load favorites error:", err);
        setError("Ошибка при подключении к серверу");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  async function removeFavorite(id) {
    const token = localStorage.getItem("uytap_token");

    if (!token) return;

    try {
      const res = await removeFavoriteApi(token, id);

      if (res.success) {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(res.message || "Ошибка при удалении из избранного");
      }
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить из избранного");
    }
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
        <div className={styles.headerMain}>
          <button
            type="button"
            className={styles.homeButton}
            onClick={() => router.push("/")}
          >
            <House size={18} />
            <span>На главную</span>
          </button>
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

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 0",
            color: "#888",
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

          <div>Загрузка избранного...</div>

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
      ) : error ? (
        <div
          style={{
            color: "#e53e3e",
            background: "#fed7d7",
            padding: "15px",
            borderRadius: "10px",
            margin: "20px 0",
            textAlign: "center",
            border: "1px solid #feb2b2",
          }}
        >
          {error}
        </div>
      ) : filteredFavorites.length > 0 ? (
        <section className={styles.grid}>
          {filteredFavorites.map((item) => (
            <ListingCardBlack
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
