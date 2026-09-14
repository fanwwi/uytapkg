"use client";

import { Heart, Search, House, GitCompare, Check } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFavorites, removeFavorite as removeFavoriteApi } from "@/utils/api";
import { mapListingData } from "@/utils/mapListingData";

import styles from "./Favorites.module.css";
import ListingCard from "@/components/ui/ListingCard/ListingCard";
import CompareListingsModal from "./CompareListingsModal/CompareListingsModal";

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

  // COMPARE
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

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

        setSelectedForCompare((prev) => prev.filter((item) => item.id !== id));
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

  /*
   * =========================================================
   * COMPARE
   * =========================================================
   */

  const selectedType = selectedForCompare[0]?.type || null;

  function toggleCompareMode() {
    setCompareMode((prev) => !prev);
    setSelectedForCompare([]);
  }

  function toggleCompareItem(item) {
    if (!compareMode) return;

    const alreadySelected = selectedForCompare.some(
      (selected) => selected.id === item.id,
    );

    if (alreadySelected) {
      setSelectedForCompare((prev) =>
        prev.filter((selected) => selected.id !== item.id),
      );

      return;
    }

    // Только одинаковый тип
    if (selectedType && item.type !== selectedType) {
      return;
    }

    setSelectedForCompare((prev) => [...prev, item]);
  }

  function isCompareDisabled(item) {
    if (!compareMode) return false;

    if (!selectedType) return false;

    return item.type !== selectedType;
  }

  function openCompare() {
    if (selectedForCompare.length < 2) return;

    setCompareOpen(true);
  }

  function closeCompare() {
    setCompareOpen(false);
  }

  function clearCompare() {
    setSelectedForCompare([]);
  }

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

            {/* COMPARE BUTTON */}

            <button
              type="button"
              className={`${styles.compareButton} ${
                compareMode ? styles.compareButtonActive : ""
              }`}
              onClick={toggleCompareMode}
            >
              {compareMode ? <Check size={17} /> : <GitCompare size={17} />}

              <span>
                {compareMode ? "Отменить сравнение" : "Сравнить объекты"}
              </span>
            </button>
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

          {/* COMPARE INFO */}

          {compareMode && (
            <div className={styles.compareHint}>
              <GitCompare size={16} />

              <div>
                <strong>
                  {selectedForCompare.length > 0
                    ? `Выбрано: ${selectedForCompare.length}`
                    : "Выберите объекты для сравнения"}
                </strong>

                <span>
                  {selectedType
                    ? `Можно выбирать только: ${selectedType}`
                    : "Можно сравнивать только объекты одного типа"}
                </span>
              </div>
            </div>
          )}

          {/* RESULT */}

          <div className={styles.result}>
            <span>В избранном найдено:</span>

            <strong>{filteredFavorites.length}</strong>
          </div>
        </>
      )}

      {/* PRODUCTS */}

      {loading ? (
        <div className={styles.loading}>
          <span className={styles.loadingSpinner} />

          <div>Загрузка избранного...</div>
        </div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : filteredFavorites.length > 0 ? (
        <section
          className={`${styles.grid} ${
            compareMode ? styles.gridCompareMode : ""
          }`}
        >
          {filteredFavorites.map((item) => {
            const selected = selectedForCompare.some(
              (selectedItem) => selectedItem.id === item.id,
            );

            const disabled = isCompareDisabled(item);

            return (
              <div
                key={item.id}
                className={`${styles.compareWrapper} ${
                  compareMode && selected ? styles.compareWrapperSelected : ""
                } ${
                  compareMode && disabled ? styles.compareWrapperDisabled : ""
                }`}
              >
                {compareMode && (
                  <button
                    type="button"
                    className={`${styles.compareCheck} ${
                      selected ? styles.compareCheckSelected : ""
                    }`}
                    disabled={disabled}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleCompareItem(item);
                    }}
                    aria-label={
                      selected ? "Убрать из сравнения" : "Добавить к сравнению"
                    }
                  >
                    {selected && <Check size={15} />}
                  </button>
                )}

                <ListingCard
                  item={item}
                  isFavorite={true}
                  onFavoriteClick={(clickedItem) =>
                    removeFavorite(clickedItem.id)
                  }
                />

                {compareMode && disabled && (
                  <div className={styles.compareDisabledOverlay}></div>
                )}
              </div>
            );
          })}
        </section>
      ) : favorites.length > 0 ? (
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

      {/* FLOATING COMPARE BAR */}

      {compareMode && selectedForCompare.length > 0 && (
        <div className={styles.compareBar}>
          <div className={styles.compareBarInfo}>
            <GitCompare size={19} />

            <div>
              <strong>
                {selectedForCompare.length}{" "}
                {selectedForCompare.length === 1
                  ? "объект выбран"
                  : "объекта выбрано"}
              </strong>

              <span>{selectedType}</span>
            </div>
          </div>

          <div className={styles.compareBarActions}>
            <button
              type="button"
              className={styles.clearCompare}
              onClick={clearCompare}
            >
              Очистить
            </button>

            <button
              type="button"
              className={styles.startCompare}
              disabled={selectedForCompare.length < 2}
              onClick={openCompare}
            >
              <GitCompare size={16} />
              Сравнить
              {selectedForCompare.length >= 2 &&
                ` (${selectedForCompare.length})`}
            </button>
          </div>
        </div>
      )}

      {/* COMPARE MODAL */}

      <CompareListingsModal
        isOpen={compareOpen}
        items={selectedForCompare}
        onClose={closeCompare}
      />
    </main>
  );
}
