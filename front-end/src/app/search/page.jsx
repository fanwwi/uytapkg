"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, House } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { getListings } from "@/utils/api";
import { mapListingData } from "@/utils/mapListingData";

import styles from "./SearchPage.module.css";
import ListingCardBlack from "@/components/ui/ListingCardBlack/ListingCardBlack";

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
  ["Все", "Все"],
  ["Продажа", "Продажа"],
  ["Сниму в аренду", "Аренда"],
];

export default function SearchMode() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [dealType, setDealType] = useState("Все");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        setError("");

        const params = {
          page: 1,
          limit: 20,
        };

        searchParams.forEach((value, key) => {
          if (value !== "" && value !== "null" && value !== "undefined") {
            params[key] = value;
          }
        });

        const response = await getListings(params);

        if (!response?.success) {
          throw new Error(
            response?.message || "Не удалось загрузить объявления",
          );
        }

        setListings(response.data || []);
      } catch (err) {
        console.error("Failed to load listings:", err);
        setError(err?.message || "Не удалось загрузить объявления");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, [searchParams]);

  const mappedListings = useMemo(() => {
    return listings.map((item) => mapListingData(item));
  }, [listings]);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mappedListings
      .filter((item) => {
        const title = item.title || "";
        const location = item.location || "";

        const matchesSearch =
          !query ||
          title.toLowerCase().includes(query) ||
          location.toLowerCase().includes(query);

        const matchesCategory =
          activeCategory === "Все" || item.type === activeCategory;

        const matchesDeal = dealType === "Все" || item.dealType === dealType;

        return matchesSearch && matchesCategory && matchesDeal;
      })
      .sort((a, b) => {
        const priority = {
          vip: 0,
          urgent: 1,
          null: 2,
        };

        const aStatus = a.status ?? "null";
        const bStatus = b.status ?? "null";

        return (priority[aStatus] ?? 2) - (priority[bStatus] ?? 2);
      });
  }, [mappedListings, search, activeCategory, dealType]);

  const hasFilters = search || activeCategory !== "Все" || dealType !== "Все";

  function resetFilters() {
    setSearch("");
    setActiveCategory("Все");
    setDealType("Все");
  }

  return (
    <main className={styles.page}>
      <div className={styles.glow.glowOne} />
      <div className={styles.glow.glowTwo} />

      <div className={styles.container}>
        {/* TOP */}

        <div className={styles.topLine}>
          <div className={styles.titleBlock}>
            <button
              type="button"
              className={styles.homeButton}
              onClick={() => router.push("/")}
            >
              <House size={18} />
              <span>На главную</span>
            </button>
            
            <div className={styles.eyebrow}>
              <span />
              РЕЗУЛЬТАТЫ ПОИСКА
            </div>

            <h1>
              Найденная
              <span> недвижимость</span>
            </h1>

            <p>Подходящие объявления по вашему запросу</p>
          </div>

          <div className={styles.topActions}>
            <div className={styles.counter}>
              <div className={styles.counterNumber}>
                {filteredListings.length}
              </div>

              <div className={styles.counterText}>объявлений</div>
            </div>
          </div>
        </div>

        {/* SEARCH */}

        <section className={styles.searchPanel}>
          <div className={styles.searchBox}>
            <Search size={20} className={styles.searchIcon} />

            <input
              type="text"
              placeholder="Поиск по названию или адресу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            className={styles.filterButton}
            onClick={() => router.push("/#search")}
          >
            <SlidersHorizontal size={18} />
            <span>Фильтры</span>
          </button>
        </section>

        {/* FILTERS */}

        <section className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterTitle}>Тип недвижимости</span>

            <div className={styles.categories}>
              {categories.map((category) => {
                const active = activeCategory === category.value;

                return (
                  <button
                    key={category.value}
                    type="button"
                    className={active ? styles.categoryActive : ""}
                    onClick={() => setActiveCategory(category.value)}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterTitle}>Тип сделки</span>

            <div className={styles.dealTypes}>
              {dealTypes.map(([value, label]) => {
                const active = dealType === value;

                return (
                  <button
                    key={value}
                    type="button"
                    className={active ? styles.dealActive : ""}
                    onClick={() => setDealType(value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* RESULTS HEADER */}

        <div className={styles.resultsHeader}>
          <div className={styles.resultsTitle}>
            <span>Объявления</span>

            <strong>{filteredListings.length}</strong>
          </div>

          {hasFilters && (
            <button
              type="button"
              className={styles.resetButton}
              onClick={resetFilters}
            >
              <X size={14} />
              Сбросить
            </button>
          )}
        </div>

        {/* LOADING */}

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />

            <span>
              Загружаем объявления
              <span className={styles.loadingDots}>...</span>
            </span>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className={styles.error}>
            <div className={styles.errorMark}>!</div>

            <div>
              <strong>Не удалось загрузить объявления</strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        {/* RESULTS */}

        {!loading && !error && (
          <>
            {filteredListings.length > 0 ? (
              <section className={styles.grid}>
                {filteredListings.map((item) => (
                  <ListingCardBlack key={item.id} item={item} />
                ))}
              </section>
            ) : (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <Search size={27} />
                </div>

                <h2>Ничего не найдено</h2>

                <p>
                  По вашему запросу нет подходящих объявлений. Попробуйте
                  изменить параметры поиска.
                </p>

                <button type="button" onClick={resetFilters}>
                  Сбросить поиск
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
