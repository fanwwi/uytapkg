"use client";

import {
  MapPin,
  Search,
  X,
  Home,
  SlidersHorizontal,
  DoorOpen,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

import {
  getListings,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/utils/api";

import { mapListingData } from "@/utils/mapListingData";

import styles from "./IssykKulProducts.module.css";
import ListingCardBlack from "@/components/ui/ListingCardBlack/ListingCardBlack";
import CustomSelectBlack from "@/components/ui/customSelectBlack/CustomSelectBlack";

/*
 * =========================
 * FILTER OPTIONS
 * =========================
 */

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

const cityOptions = [
  "Все",
  "Каракол",
  "Чолпон-Ата",
  "Бостери",
  "Чон-Сары-Ой",
  "Боконбаево",
];

const roomOptions = ["Все", "1", "2", "3", "4+"];

/*
 * =========================
 * COMPONENT
 * =========================
 */

export default function IssykKulProducts() {
  const router = useRouter();

  /*
   * =========================
   * SEARCH
   * =========================
   */

  const [search, setSearch] = useState("");

  /*
   * =========================
   * FILTERS
   * =========================
   */

  const [activeCategory, setActiveCategory] = useState("Все");
  const [dealType, setDealType] = useState("Все");

  const [city, setCity] = useState("Все");
  const [rooms, setRooms] = useState("Все");

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  const [areaFrom, setAreaFrom] = useState("");
  const [areaTo, setAreaTo] = useState("");

  /*
   * =========================
   * DATA
   * =========================
   */

  const [listingsList, setListingsList] = useState([]);
  const [favIds, setFavIds] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * =========================
   * LOAD DATA
   * =========================
   */

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("uytap_token");

        const [listingsResponse, favoritesResponse] = await Promise.all([
          getListings({
            page: 1,
            limit: 100,
            region: "issyk",
          }),

          token ? getFavorites(token) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        if (!listingsResponse?.success) {
          throw new Error(
            listingsResponse?.message || "Не удалось загрузить объявления",
          );
        }

        setListingsList(
          Array.isArray(listingsResponse.data) ? listingsResponse.data : [],
        );

        if (
          favoritesResponse?.success &&
          Array.isArray(favoritesResponse.data)
        ) {
          setFavIds(
            new Set(favoritesResponse.data.map((item) => String(item.id))),
          );
        } else {
          setFavIds(new Set());
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

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =========================
   * MAP DATA
   * =========================
   */

  const mappedListings = useMemo(() => {
    return listingsList
      .map((item) => {
        try {
          return mapListingData(item);
        } catch (err) {
          console.error("Listing mapping error:", err, item);

          return null;
        }
      })
      .filter(Boolean);
  }, [listingsList]);

  /*
   * =========================
   * FAVORITES
   * =========================
   */

  const handleFavoriteClick = async (clickedItem) => {
    const token = localStorage.getItem("uytap_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const id = String(clickedItem.id);
    const isFavorite = favIds.has(id);

    try {
      if (isFavorite) {
        const response = await removeFavorite(token, id);

        if (response?.success) {
          setFavIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }
      } else {
        const response = await addFavorite(token, id);

        if (response?.success) {
          setFavIds((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
          });
        }
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  /*
   * =========================
   * FILTERING
   * =========================
   */

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mappedListings
      .filter((item) => {
        /*
         * =========================
         * ONLY ISSYK-KUL
         * =========================
         */

        const region = String(item.region || "").toLowerCase();

        const location = String(item.location || "").toLowerCase();

        const cityValue = String(item.city || "").toLowerCase();

        const isIssykKul =
          region === "issyk_kul" ||
          region === "issykkul" ||
          region === "issyk kul" ||
          region.includes("issyk") ||
          region.includes("иссык") ||
          location.includes("иссык") ||
          location.includes("каракол") ||
          location.includes("чолпон") ||
          cityValue.includes("каракол") ||
          cityValue.includes("чолпон");

        if (!isIssykKul) {
          return false;
        }

        /*
         * =========================
         * SEARCH
         * =========================
         */

        const title = String(item.title || "").toLowerCase();

        const address = String(item.address || "").toLowerCase();

        const description = String(item.description || "").toLowerCase();

        const matchesSearch =
          !query ||
          title.includes(query) ||
          location.includes(query) ||
          address.includes(query) ||
          description.includes(query);

        /*
         * =========================
         * CATEGORY
         * =========================
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
         * =========================
         * DEAL TYPE
         * =========================
         */

        const itemDeal = String(item.dealType || "")
          .trim()
          .toLowerCase();

        const selectedDeal = String(dealType || "")
          .trim()
          .toLowerCase();

        const matchesDeal = dealType === "Все" || itemDeal === selectedDeal;

        /*
         * =========================
         * CITY
         * =========================
         */

        const matchesCity = (() => {
          if (city === "Все") {
            return true;
          }

          const selectedCity = city.toLowerCase().trim();

          return (
            location.includes(selectedCity) || cityValue.includes(selectedCity)
          );
        })();

        /*
         * =========================
         * ROOMS
         * =========================
         */

        const matchesRooms = (() => {
          if (rooms === "Все") {
            return true;
          }

          const itemRooms = Number(item.rooms);

          if (rooms === "4+") {
            return itemRooms >= 4;
          }

          return itemRooms === Number(rooms);
        })();

        /*
         * =========================
         * PRICE
         * =========================
         */

        const matchesPrice = (() => {
          const min = priceFrom ? Number(priceFrom) : null;

          const max = priceTo ? Number(priceTo) : null;

          const price = Number(item.rawPrice);

          if (min !== null && !Number.isNaN(min) && price < min) {
            return false;
          }

          if (max !== null && !Number.isNaN(max) && price > max) {
            return false;
          }

          return true;
        })();

        /*
         * =========================
         * AREA
         * =========================
         */

        const matchesArea = (() => {
          const min = areaFrom ? Number(areaFrom) : null;

          const max = areaTo ? Number(areaTo) : null;

          const area = Number(item.rawArea);

          if (min !== null && !Number.isNaN(min) && area < min) {
            return false;
          }

          if (max !== null && !Number.isNaN(max) && area > max) {
            return false;
          }

          return true;
        })();

        return (
          matchesSearch &&
          matchesCategory &&
          matchesDeal &&
          matchesCity &&
          matchesRooms &&
          matchesPrice &&
          matchesArea
        );
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
  }, [
    mappedListings,
    search,
    activeCategory,
    dealType,
    city,
    rooms,
    priceFrom,
    priceTo,
    areaFrom,
    areaTo,
  ]);

  /*
   * =========================
   * RESET FILTERS
   * =========================
   */

  const resetFilters = () => {
    setSearch("");

    setActiveCategory("Все");
    setDealType("Все");

    setCity("Все");
    setRooms("Все");

    setPriceFrom("");
    setPriceTo("");

    setAreaFrom("");
    setAreaTo("");
  };

  /*
   * =========================
   * CHECK FILTERS
   * =========================
   */

  const hasFilters =
    search.trim() !== "" ||
    activeCategory !== "Все" ||
    dealType !== "Все" ||
    city !== "Все" ||
    rooms !== "Все" ||
    priceFrom !== "" ||
    priceTo !== "" ||
    areaFrom !== "" ||
    areaTo !== "";

  /*
   * =========================
   * UI
   * =========================
   */

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />

      {/* =========================
          HEADER
      ========================= */}

      <header className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.homeButton}
              onClick={() => router.push("/")}
            >
              <Home size={17} />
              На главную
            </button>

            <span className={styles.regionBadge}>
              <MapPin size={15} />
              Иссык-Куль
            </span>
          </div>

          <h1>
            Недвижимость
            <span> Иссык-Куля</span>
          </h1>

          <p>
            Дома, квартиры, коттеджи, участки и другие объекты недвижимости в
            лучших районах Иссык-Кульской области.
          </p>
        </div>
      </header>

      {/* =========================
          SEARCH
      ========================= */}

      <section className={styles.toolbar}>
        <div className={styles.search}>
          <Search size={21} />

          <input
            type="text"
            placeholder="Поиск по названию, адресу или городу..."
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
          className={styles.filterButton}
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
      </section>

      {/* =========================
          FILTERS
      ========================= */}

      <section id="filters" className={styles.filtersContainer}>
        {/* CATEGORY */}

        <div className={styles.filterBlock}>
          <div className={styles.filterHeading}>
            <span>Тип недвижимости</span>
          </div>

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

        {/* DEAL */}

        <div className={styles.filterBlock}>
          <div className={styles.filterHeading}>
            <span>Тип сделки</span>
          </div>

          <div className={styles.dealTypes}>
            {dealTypes.map((deal) => {
              const active = dealType === deal.value;

              return (
                <button
                  key={deal.value}
                  type="button"
                  className={active ? styles.dealActive : ""}
                  onClick={() => setDealType(deal.value)}
                >
                  {deal.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ADVANCED */}

        <div className={styles.advancedFilters}>
          <div className={styles.advancedGrid}>
            {/* CITY */}

            <CustomSelectBlack
              icon={MapPin}
              title="Город / Район"
              options={cityOptions}
              value={city}
              setValue={setCity}
            />

            {/* ROOMS */}

            <CustomSelectBlack
              icon={DoorOpen}
              title="Количество комнат"
              options={roomOptions}
              value={rooms}
              setValue={setRooms}
            />

            {/* PRICE */}

            <div className={styles.rangeField}>
              <label>Цена ($)</label>

              <div className={styles.rangeInputs}>
                <input
                  type="number"
                  placeholder="От"
                  value={priceFrom}
                  onChange={(event) => setPriceFrom(event.target.value)}
                />

                <input
                  type="number"
                  placeholder="До"
                  value={priceTo}
                  onChange={(event) => setPriceTo(event.target.value)}
                />
              </div>
            </div>

            {/* AREA */}

            <div className={styles.rangeField}>
              <label>Площадь (м²)</label>

              <div className={styles.rangeInputs}>
                <input
                  type="number"
                  placeholder="От"
                  value={areaFrom}
                  onChange={(event) => setAreaFrom(event.target.value)}
                />

                <input
                  type="number"
                  placeholder="До"
                  value={areaTo}
                  onChange={(event) => setAreaTo(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          RESULTS HEADER
      ========================= */}

      <div className={styles.resultsHeader}>
        <div className={styles.result}>
          <span>Объявления Иссык-Куля</span>

          <strong>{loading ? "..." : filteredListings.length}</strong>

          <span>объявлений</span>
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

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />

          <span>Загружаем объявления...</span>
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {!loading && error && (
        <div className={styles.error}>
          <X size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* =========================
          RESULTS
      ========================= */}

      {!loading && !error && (
        <>
          {filteredListings.length > 0 ? (
            <section className={styles.grid}>
              {filteredListings.map((item) => (
                <ListingCardBlack
                  key={item.id}
                  item={item}
                  isFavorite={favIds.has(String(item.id))}
                  onFavoriteClick={handleFavoriteClick}
                />
              ))}
            </section>
          ) : (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <Search size={30} />
              </div>

              <h2>Ничего не найдено</h2>

              <p>
                В Иссык-Кульской области нет объявлений, соответствующих
                выбранным параметрам.
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
