"use client";

import Image from "next/image";
import {
  MapPin,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { getListings, getFavorites, addFavorite, removeFavorite } from "@/utils/api";
import ListingCard from "@/components/ui/ListingCard/ListingCard";
import { mapListingData } from "@/utils/mapListingData";

import styles from "./IssykKulProducts.module.css";



const categories = [
  "Все",
  "Дом/Дача",
  "Квартира",
  "Коттедж",
  "Гостевой дом",
  "Участок",
  "Коммерция",
];

export default function IssykKulProducts() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [dealType, setDealType] = useState("Все");

  const [listingsList, setListingsList] = useState([]);
  const [favIds, setFavIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("uytap_token");
    if (token) {
      getFavorites(token)
        .then((res) => {
          if (res.success && res.data) {
            setFavIds(new Set(res.data.map((l) => l.id)));
          }
        })
        .catch((err) => console.error("Error loading favs:", err));
    }

    getListings({ page: 1, limit: 100, region: "issyk" })
      .then((res) => {
        if (res && res.success) {
          setListingsList(res.data || []);
        } else {
          throw new Error(res?.message || "Не удалось загрузить объявления");
        }
      })
      .catch((err) => {
        console.error("Failed to load listings", err);
        setError(err.message || "Ошибка соединения с сервером");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const mappedListings = useMemo(() => {
    return listingsList.map((item) => mapListingData(item));
  }, [listingsList]);

  const handleFavoriteClick = async (clickedItem) => {
    const token = localStorage.getItem("uytap_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const isFav = favIds.has(clickedItem.id);
    try {
      if (isFav) {
        const res = await removeFavorite(token, clickedItem.id);
        if (res.success) {
          setFavIds((prev) => {
            const next = new Set(prev);
            next.delete(clickedItem.id);
            return next;
          });
        }
      } else {
        const res = await addFavorite(token, clickedItem.id);
        if (res.success) {
          setFavIds((prev) => {
            const next = new Set(prev);
            next.add(clickedItem.id);
            return next;
          });
        }
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  const filteredListings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    /*
     * ГЛАВНЫЙ ФИЛЬТР:
     * показываем ТОЛЬКО Иссык-Куль.
     */
    const filtered = mappedListings.filter((item) => {
      const regionLower = (item.region || "").toLowerCase();
      const cityLower = (item.location || "").toLowerCase();
      const isIssykKul =
        (item.region === "issykKul" ||
        item.region === "ISSYK_KUL" ||
        regionLower.includes("issyk") ||
        regionLower.includes("иссык")) &&
        !cityLower.includes("бишкек") &&
        !cityLower.includes("ош");

      const matchesSearch =
        String(item.title || "").toLowerCase().includes(normalizedSearch) ||
        String(item.location || "").toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        activeCategory === "Все" || item.type === activeCategory;

      const matchesDealType = dealType === "Все" || item.dealType === dealType;

      return isIssykKul && matchesSearch && matchesCategory && matchesDealType;
    });

    /*
     * Приоритет:
     * VIP → Срочно → обычное
     */
    return [...filtered].sort((a, b) => {
      const priority = {
        vip: 0,
        urgent: 1,
        null: 2,
      };

      const aStatus = a.status === null ? "null" : a.status;
      const bStatus = b.status === null ? "null" : b.status;
      return (priority[aStatus] ?? 2) - (priority[bStatus] ?? 2);
    });
  }, [search, activeCategory, dealType]);

  return (
    <main className={styles.page}>
      {/* HEADER */}

      <header className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.regionBadge}>
            <MapPin size={15} />
            Иссык-Куль
          </span>

          <h1>Недвижимость Иссык-Куля</h1>

          <p>
            Дома, коттеджи, участки и другие объекты недвижимости в лучших
            районах Иссык-Кульской области.
          </p>
        </div>
      </header>

      {/* SEARCH */}

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Search size={21} />

          <input
            type="text"
            placeholder="Поиск по названию или городу..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {search && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}
        </div>

        <button
          type="button"
          className={styles.filter}
          onClick={() => router.push("/issyk-kul/#searchIssykKul")}
        >
          <SlidersHorizontal size={19} />
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

      {/* LOADING */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px", fontSize: "16px", color: "#666" }}>
          Загрузка объявлений...
        </div>
      )}

      {/* ERROR */}
      {error && !loading && (
        <div style={{ color: "#e53e3e", background: "#fed7d7", padding: "15px", borderRadius: "8px", margin: "20px 0", textAlign: "center" }}>
          {error}
        </div>
      )}

      {/* RESULT */}

      {!loading && !error && (
        <>
          <div className={styles.result}>
            <div>
              <span>Объявления Иссык-Куля</span>
              <strong>{filteredListings.length}</strong>
            </div>

            <span className={styles.resultHint}>
              VIP и срочные объявления показываются первыми
            </span>
          </div>

      {/* PRODUCTS */}

          {filteredListings.length > 0 ? (
            <section className={styles.grid}>
              {filteredListings.map((item) => (
                <ListingCard
                  key={item.id}
                  item={item}
                  isFavorite={favIds.has(item.id)}
                  onFavoriteClick={handleFavoriteClick}
                />
              ))}
            </section>
          ) : (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <Search size={25} />
              </div>

              <h2>Ничего не найдено</h2>

              <p>
                В Иссык-Кульской области пока нет объявлений, соответствующих
                выбранным параметрам.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("Все");
                  setDealType("Все");
                }}
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
