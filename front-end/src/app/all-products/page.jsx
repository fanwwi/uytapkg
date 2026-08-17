"use client";

import { SlidersHorizontal, Search, X, Home } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getListings,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/utils/api";
import ListingCard from "@/components/ui/ListingCard/ListingCard";
import { mapListingData } from "@/utils/mapListingData";

import styles from "./AllProducts.module.css";

const categories = [
  { value: "Все", label: "Все" },
  { value: "Дом", label: "Дома" },
  { value: "Квартира", label: "Квартиры" },
  { value: "Коттедж", label: "Коттеджи" },
  { value: "Участок", label: "Участки" },
  { value: "Коммерция", label: "Коммерция" },
  { value: "Паркинг/гараж", label: "Паркинг" },
  { value: "Комнаты", label: "Комнаты" },
];

const dealTypes = [
  { value: "Все", label: "Все объявления" },
  { value: "Продажа", label: "Продажа" },
  { value: "Сниму в аренду", label: "Сниму в аренду" },
];

export default function AllProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [dealType, setDealType] = useState("Все");
  const [listingsList, setListingsList] = useState([]);
  const [favIds, setFavIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * =====================================================
   * ЗАГРУЗКА ОБЪЯВЛЕНИЙ
   * =====================================================
   *
   * Здесь НЕ передаём category/dealType.
   *
   * Мы сначала получаем объявления,
   * потом фильтруем их прямо в React.
   */

  useEffect(() => {
    let cancelled = false;

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

    // Sync URL parameters with UI tabs
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      const categoryMapping = {
        house: "Дом",
        apartment: "Квартира",
        cottage: "Коттедж",
        land: "Участок",
        commercial: "Коммерция",
        garage: "Паркинг/гараж",
        room: "Комнаты",
      };
      setActiveCategory(categoryMapping[urlCategory] || "Все");
    } else {
      setActiveCategory("Все");
    }

    async function loadListings() {
      try {
        setLoading(true);
        setError("");

        const response = await getListings({
          page: 1,
          limit: 100,
        });

        if (!response?.success) {
          throw new Error(
            response?.message || "Не удалось загрузить объявления",
          );
        }

        if (!cancelled) {
          setListingsList(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Failed to load listings:", err);

        if (!cancelled) {
          setError(err?.message || "Ошибка соединения с сервером");
          setListingsList([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadListings();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  /*
   * =====================================================
   * API -> CARD DATA
   * =====================================================
   */

  const mappedListings = useMemo(() => {
    return listingsList
      .map((item) => {
        try {
          return mapListingData(item);
        } catch (error) {
          console.error("Ошибка преобразования объявления:", item, error);
          return null;
        }
      })
      .filter(Boolean);
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

  /*
   * =====================================================
   * ФИЛЬТРАЦИЯ
   * =====================================================
   */

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (
      mappedListings
        .filter((item) => {
          /*
           * ---------------------------------------------
           * ПОИСК
           * ---------------------------------------------
           */

          const title = String(item.title || "").toLowerCase();

          const location = String(item.location || "").toLowerCase();

          const address = String(item.address || "").toLowerCase();

          const description = String(item.description || "").toLowerCase();

          const matchesSearch =
            !query ||
            title.includes(query) ||
            location.includes(query) ||
            address.includes(query) ||
            description.includes(query);

          /*
           * ---------------------------------------------
           * КАТЕГОРИЯ
           * ---------------------------------------------
           */

          const itemType = String(item.type || "")
            .trim()
            .toLowerCase();

          const selectedType = String(activeCategory || "")
            .trim()
            .toLowerCase();

          const matchesCategory =
            activeCategory === "Все" || itemType === selectedType;

          /*
           * ---------------------------------------------
           * ТИП СДЕЛКИ
           * ---------------------------------------------
           */

          const itemDeal = String(item.dealType || "")
            .trim()
            .toLowerCase();

          const selectedDeal = String(dealType || "")
            .trim()
            .toLowerCase();

          const matchesDeal = dealType === "Все" || itemDeal === selectedDeal;

          return matchesSearch && matchesCategory && matchesDeal;
        })

        /*
         * VIP → URGENT → остальные
         */
        .sort((a, b) => {
          const priority = {
            vip: 0,
            urgent: 1,
            null: 2,
          };

          const aStatus = a.status ?? "null";

          const bStatus = b.status ?? "null";

          return (priority[aStatus] ?? 2) - (priority[bStatus] ?? 2);
        })
    );
  }, [mappedListings, search, activeCategory, dealType]);

  /*
   * =====================================================
   * СБРОС
   * =====================================================
   */

  function resetFilters() {
    setSearch("");
    setActiveCategory("Все");
    setDealType("Все");
  }

  const hasFilters =
    search.trim() !== "" || activeCategory !== "Все" || dealType !== "Все";

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <main className={styles.page}>
      {/* HEADER */}

      <div className={styles.header}>
        <div>
          <button
            type="button"
            className={styles.homeButton}
            onClick={() => router.push("/")}
          >
            <Home size={18} />
            На главную
          </button>
          <h1>Все объявления</h1>

          <p>Найдите подходящую недвижимость среди доступных предложений</p>
        </div>
      </div>

      {/* SEARCH */}

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Search size={21} />

          <input
            type="text"
            placeholder="Поиск по названию или адресу..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {search && (
            <button
              type="button"
              className={styles.clearSearch}
              onClick={() => setSearch("")}
              aria-label="Очистить поиск"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={styles.filter}
          onClick={() => {
            document.getElementById("filters")?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
        >
          <SlidersHorizontal size={19} />

          <span>Фильтры</span>
        </button>
      </div>

      {/* FILTERS */}

      <div id="filters">
        {/* CATEGORY */}

        <section className={styles.filterSection}>
          <span className={styles.filterTitle}>Тип недвижимости</span>

          <div className={styles.categories}>
            {categories.map((category) => {
              const active = activeCategory === category.value;

              return (
                <button
                  key={category.value}
                  type="button"
                  className={active ? styles.categoryActive : ""}
                  onClick={() => {
                    setActiveCategory(category.value);
                  }}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* DEAL */}

        <section className={styles.filterSection}>
          <span className={styles.filterTitle}>Тип сделки</span>

          <div className={styles.dealTypes}>
            {dealTypes.map((deal) => {
              const active = dealType === deal.value;

              return (
                <button
                  key={deal.value}
                  type="button"
                  className={active ? styles.dealActive : ""}
                  onClick={() => {
                    setDealType(deal.value);
                  }}
                >
                  {deal.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* RESULTS HEADER */}

      <div className={styles.resultsHeader}>
        <div className={styles.result}>
          <span>Найдено объявлений:</span>

          <strong>{loading ? "..." : filteredListings.length}</strong>
        </div>

        {hasFilters && !loading && (
          <button
            type="button"
            className={styles.resetButton}
            onClick={resetFilters}
          >
            <X size={15} />
            Сбросить
          </button>
        )}
      </div>

      {/* LOADING */}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />

          <span>Загружаем объявления...</span>
        </div>
      )}

      {/* ERROR */}

      {!loading && error && <div className={styles.error}>{error}</div>}

      {/* RESULTS */}

      {!loading && !error && (
        <>
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
              <Search size={42} />

              <h2>Ничего не найдено</h2>

              <p>
                По вашему запросу нет подходящих объявлений. Попробуйте изменить
                параметры поиска.
              </p>

              {hasFilters && (
                <button type="button" onClick={resetFilters}>
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
