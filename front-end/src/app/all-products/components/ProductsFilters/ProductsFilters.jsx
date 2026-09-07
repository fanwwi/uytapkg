"use client";

import { Search, X } from "lucide-react";

import CommonFilters from "../CommonFilters/CommonFilters";
import SearchModeSlider from "../SearchModeSlider/SearchModeSlider";
import SmartSearch from "../SmartSearch/SmartSearch";

import styles from "../../AllProducts.module.css";

export default function ProductsFilters({
  searchMode,
  setSearchMode,

  filters,
  updateFilter,

  updateUrl,
  handleSmartSearch,

  resetFilters,
  hasFilters,

  categories,
  categoryLabels,
  CategoryFilters,

  showBeachDistance,
}) {
  return (
    <>
      <SearchModeSlider value={searchMode} onChange={setSearchMode} />

      {searchMode === "smart" && (
        <SmartSearch onFiltersDetected={handleSmartSearch} />
      )}

      {searchMode === "filters" && (
        <section id="filters" className={styles.filters}>
          {/* =================================================
              HEADER
          ================================================= */}

          <div className={styles.filterHeader}>
            <div>
              <span>ФИЛЬТРЫ</span>

              <h2>Настройте поиск</h2>
            </div>

            {hasFilters && (
              <button
                type="button"
                className={styles.reset}
                onClick={resetFilters}
              >
                <X size={14} />
                Сбросить
              </button>
            )}
          </div>

          {/* =================================================
              PROPERTY TYPE
          ================================================= */}

          <div className={styles.section}>
            <label>Тип недвижимости</label>

            <div className={styles.categoryList}>
              {categories.map((category) => {
                const active = filters.propertyType === category.value;

                return (
                  <button
                    key={category.value}
                    type="button"
                    className={active ? styles.categoryActive : ""}
                    onClick={() => updateFilter("propertyType", category.value)}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              DEAL
          ================================================= */}

          <div className={styles.section}>
            <label>Тип сделки</label>

            <div className={styles.dealList}>
              <button
                type="button"
                className={filters.dealType === "sale" ? styles.dealActive : ""}
                onClick={() => updateFilter("dealType", "sale")}
              >
                Продажа
              </button>

              <button
                type="button"
                className={filters.dealType === "rent" ? styles.dealActive : ""}
                onClick={() => updateFilter("dealType", "rent")}
              >
                Аренда
              </button>
            </div>
          </div>

          {/* =================================================
              COMMON FILTERS
          ================================================= */}

          <div className={styles.section}>
            <label>Основные параметры</label>

            <CommonFilters
              filters={filters}
              updateFilter={updateFilter}
              showBeachDistance={showBeachDistance}
            />
          </div>

          {/* =================================================
              CATEGORY FILTERS
          ================================================= */}

          <div className={styles.categoryFilters}>
            <div className={styles.categoryTitle}>
              <div>
                <span>ХАРАКТЕРИСТИКИ</span>

                <h3>{categoryLabels[filters.propertyType]}</h3>
              </div>
            </div>

            <CategoryFilters filters={filters} updateFilter={updateFilter} />
          </div>

          {/* =================================================
              APPLY
          ================================================= */}

          <button
            type="button"
            className={styles.apply}
            onClick={() => updateUrl(filters)}
          >
            <Search size={17} />
            Показать объявления
          </button>
        </section>
      )}
    </>
  );
}
