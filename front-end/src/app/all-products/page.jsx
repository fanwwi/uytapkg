"use client";

import {
  SlidersHorizontal,
  Search,
  X,
  Home,
  MapPin,
  Building2,
  DoorOpen,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getListings,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/utils/api";

import CustomSelectBlack from "@/components/ui/customSelectBlack/CustomSelectBlack";
import { mapListingData } from "@/utils/mapListingData";

import styles from "./AllProducts.module.css";
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
  { value: "Все", label: "Все объявления" },
  { value: "Продажа", label: "Продажа" },
  { value: "Сниму в аренду", label: "Сниму в аренду" },
];

const cityOptions = ["Все", "Бишкек", "Ош", "Иссык-Куль", "Турция"];

const roomOptions = ["Все", "1", "2", "3", "4+"];

export default function AllProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [dealType, setDealType] = useState("Все");

  const [city, setCity] = useState("Все");
  const [rooms, setRooms] = useState("Все");

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  const [areaFrom, setAreaFrom] = useState("");
  const [areaTo, setAreaTo] = useState("");

  const [listingsList, setListingsList] = useState([]);
  const [favIds, setFavIds] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * =========================
   * URL → FILTERS
   * =========================
   */

  useEffect(() => {
    const urlCategory = searchParams.get("category");

    const categoryMapping = {
      house: "Дом",
      apartment: "Квартира",
      cottage: "Коттедж",
      land: "Участок",
      commercial: "Коммерция",
      garage: "Паркинг/гараж",
      room: "Комнаты",
    };

    setActiveCategory(
      urlCategory ? categoryMapping[urlCategory] || urlCategory : "Все",
    );

    const urlDeal = searchParams.get("dealType");

    const dealMapping = {
      sale: "Продажа",
      rent: "Сниму в аренду",
    };

    setDealType(urlDeal ? dealMapping[urlDeal] || urlDeal : "Все");

    const urlSearch = searchParams.get("search");
    setSearch(urlSearch || "");

    const urlCity = searchParams.get("city") || searchParams.get("settlement") || searchParams.get("location");
    const urlRegion = searchParams.get("region");

    if (urlCity) {
      if (urlCity === "BISHKEK" || urlCity === "bishkek") setCity("Бишкек");
      else if (urlCity === "ISSYK_KUL" || urlCity === "issyk_kul" || urlCity === "issykKul" || urlCity === "issyk") setCity("Иссык-Куль");
      else if (urlCity === "OSH" || urlCity === "osh") setCity("Ош");
      else setCity(urlCity);
    } else if (urlRegion) {
      const normalizedRegion = urlRegion.toLowerCase();

      if (
        normalizedRegion === "bishkek" ||
        normalizedRegion === "BISHKEK".toLowerCase()
      ) {
        setCity("Бишкек");
      } else if (
        normalizedRegion === "issyk_kul" ||
        normalizedRegion === "issyk-kul"
      ) {
        setCity("Иссык-Куль");
      } else if (normalizedRegion === "osh") {
        setCity("Ош");
      } else {
        setCity(urlRegion);
      }
    } else {
      setCity("Все");
    }

    const urlRooms = searchParams.get("rooms");
    setRooms(urlRooms || "Все");

    setPriceFrom(searchParams.get("priceFrom") || "");
    setPriceTo(searchParams.get("priceTo") || "");

    setAreaFrom(searchParams.get("areaFrom") || "");
    setAreaTo(searchParams.get("areaTo") || "");
  }, [searchParams]);

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
          console.error("Ошибка преобразования объявления:", item, err);

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
         * SEARCH
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
         * CATEGORY
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
         * DEAL
         */

        const itemDeal = String(item.dealType || "")
          .trim()
          .toLowerCase();

        const selectedDeal = String(dealType || "")
          .trim()
          .toLowerCase();

        const matchesDeal = dealType === "Все" || itemDeal === selectedDeal;

        /*
         * CITY
         */

        const matchesCity = (() => {
          if (city === "Все") {
            return true;
          }

          const itemLocation = String(item.location || "").toLowerCase();

          const itemRegion = String(item.region || "").toLowerCase();

          const selectedCity = String(city).toLowerCase();

          if (selectedCity === "иссык-куль") {
            return (
              itemLocation.includes("куль") ||
              itemLocation.includes("каракол") ||
              itemLocation.includes("чолпон") ||
              itemRegion.includes("issyk") ||
              itemRegion.includes("issykkul")
            );
          }

          return (
            itemLocation.includes(selectedCity) ||
            itemRegion.includes(selectedCity)
          );
        })();

        /*
         * ROOMS
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
         * PRICE
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
         * AREA
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

        // Все остальные динамические параметры из URL (фильтры шагов)
        for (const [key, value] of searchParams.entries()) {
          if ([
            "category", "propertyType", "dealType", "search", "query", "city", "region",
            "rooms", "priceFrom", "priceTo", "areaFrom", "areaTo",
            "page", "limit", "searchMode", "location"
          ].includes(key)) {
            continue;
          }

          if (value && value !== "" && value !== "Все" && value !== "Любой" && value !== "Любое" && value !== "Любые") {
            const itemValue = String(item[key] || "").toLowerCase();
            const filterValue = String(value).toLowerCase();
            if (itemValue !== filterValue && !itemValue.includes(filterValue)) {
              return false;
            }
          }
        }

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
   * RESET
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

    router.replace("/products");
  };

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

      {/* HEADER */}

      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button
            type="button"
            className={styles.homeButton}
            onClick={() => router.push("/")}
          >
            <Home size={18} />
            <span>На главную</span>
          </button>

          <div className={styles.headerBadge}>
            <span className={styles.badgeDot} />
            Все объявления
          </div>
        </div>

        <h1>
          Найдите свою
          <span> недвижимость</span>
        </h1>

        <p>
          Дома, квартиры, участки и другие объекты недвижимости в Кыргызстане.
        </p>
      </header>

      {/* SEARCH */}

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

      {/* FILTERS */}

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
              title="Город / Регион"
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

      {/* RESULTS HEADER */}

      <div className={styles.resultsHeader}>
        <div className={styles.result}>
          <span>Найдено</span>

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

      {/* LOADING */}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Загружаем объявления...</span>
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className={styles.error}>
          <X size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* RESULTS */}

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
