"use client";

import { Search } from "lucide-react";

import ListingCard from "@/components/ui/ListingCard/ListingCard";

import styles from "../../AllProducts.module.css";

export default function ProductsResults({
  loading,
  error,

  listings,
  favIds,

  onFavoriteClick,

  hasFilters,
  onReset,
}) {
  return (
    <>
      {/* =================================================
          RESULTS HEADER
      ================================================= */}

      <div className={styles.resultsHeader}>
        <div>
          <span>РЕЗУЛЬТАТЫ ПОИСКА</span>

          <strong>{loading ? "..." : listings.length}</strong>

          <small>объявлений</small>
        </div>
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className={styles.loading}>
          <div />
          Загружаем объявления...
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && <div className={styles.error}>{error}</div>}

      {/* =================================================
          RESULTS
      ================================================= */}

      {!loading && !error && listings.length > 0 && (
        <section className={styles.grid}>
          {listings.map((item) => (
            <ListingCard
              key={item.id}
              item={item}
              isFavorite={favIds.has(String(item.id))}
              onFavoriteClick={onFavoriteClick}
            />
          ))}
        </section>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading && !error && listings.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Search size={27} />
          </div>

          <h2>Ничего не найдено</h2>

          <p>Попробуйте изменить параметры поиска.</p>

          {hasFilters && (
            <button type="button" onClick={onReset}>
              Сбросить фильтры
            </button>
          )}
        </div>
      )}
    </>
  );
}
