"use client";

import { SlidersHorizontal, Search, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getListings, getFavorites, addFavorite, removeFavorite } from "@/utils/api";
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
  
  // Advanced filters states
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

    // Sync URL parameters with UI tabs & inputs
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
      setActiveCategory(categoryMapping[urlCategory] || urlCategory);
    } else {
      setActiveCategory("Все");
    }

    const urlDeal = searchParams.get("dealType");
    if (urlDeal) {
      const dealMapping = {
        sale: "Продажа",
        rent: "Сниму в аренду",
      };
      setDealType(dealMapping[urlDeal] || urlDeal);
    }

    const urlSearch = searchParams.get("search");
    if (urlSearch) setSearch(urlSearch);

    const urlCity = searchParams.get("city");
    const urlRegion = searchParams.get("region");
    if (urlCity) {
      setCity(urlCity);
    } else if (urlRegion) {
      if (urlRegion === "BISHKEK" || urlRegion === "bishkek") {
        setCity("Бишкек");
      } else if (urlRegion === "ISSYK_KUL" || urlRegion === "issyk_kul") {
        setCity("Иссык-Куль");
      } else if (urlRegion === "OSH" || urlRegion === "osh") {
        setCity("Ош");
      } else {
        setCity(urlRegion);
      }
    }

    const urlRooms = searchParams.get("rooms");
    if (urlRooms) setRooms(urlRooms);

    const urlPriceFrom = searchParams.get("priceFrom");
    if (urlPriceFrom) setPriceFrom(urlPriceFrom);

    const urlPriceTo = searchParams.get("priceTo");
    if (urlPriceTo) setPriceTo(urlPriceTo);

    const urlAreaFrom = searchParams.get("areaFrom");
    if (urlAreaFrom) setAreaFrom(urlAreaFrom);

    const urlAreaTo = searchParams.get("areaTo");
    if (urlAreaTo) setAreaTo(urlAreaTo);

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

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (
      mappedListings
        .filter((item) => {
          // 1. Поиск по тексту
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

          // 2. Тип недвижимости
          const itemType = String(item.type || "").trim().toLowerCase();
          const selectedType = String(activeCategory || "").trim().toLowerCase();
          const matchesCategory = activeCategory === "Все" || itemType === selectedType;

          // 3. Тип сделки
          const itemDeal = String(item.dealType || "").trim().toLowerCase();
          const selectedDeal = String(dealType || "").trim().toLowerCase();
          const matchesDeal = dealType === "Все" || itemDeal === selectedDeal;

          // 4. Город / регион
          const matchesCity = (() => {
            if (city === "Все") return true;
            const itemLocLower = String(item.location || "").toLowerCase();
            const itemRegLower = String(item.region || "").toLowerCase();
            const selectedCityLower = String(city).toLowerCase();
            
            if (selectedCityLower === "иссык-куль") {
              return (
                itemLocLower.includes("куль") ||
                itemLocLower.includes("каракол") ||
                itemLocLower.includes("чолпон") ||
                itemRegLower.includes("issykkul") ||
                itemRegLower.includes("issyk_kul")
              );
            }
            return itemLocLower.includes(selectedCityLower) || itemRegLower.includes(selectedCityLower);
          })();

          // 5. Комнаты
          const matchesRooms = (() => {
            if (rooms === "Все") return true;
            const itemRooms = Number(item.rooms);
            if (rooms === "4+") return itemRooms >= 4;
            return itemRooms === Number(rooms);
          })();

          // 6. Диапазон цен
          const matchesPrice = (() => {
            const min = priceFrom ? Number(priceFrom) : null;
            const max = priceTo ? Number(priceTo) : null;
            const priceVal = Number(item.rawPrice);
            if (min !== null && priceVal < min) return false;
            if (max !== null && priceVal > max) return false;
            return true;
          })();

          // 7. Диапазон площади
          const matchesArea = (() => {
            const min = areaFrom ? Number(areaFrom) : null;
            const max = areaTo ? Number(areaTo) : null;
            const areaVal = Number(item.rawArea);
            if (min !== null && areaVal < min) return false;
            if (max !== null && areaVal > max) return false;
            return true;
          })();

          return matchesSearch && matchesCategory && matchesDeal && matchesCity && matchesRooms && matchesPrice && matchesArea;
        })
        .sort((a, b) => {
          const priority = { vip: 0, urgent: 1, null: 2 };
          const aStatus = a.status ?? "null";
          const bStatus = b.status ?? "null";
          return (priority[aStatus] ?? 2) - (priority[bStatus] ?? 2);
        })
    );
  }, [mappedListings, search, activeCategory, dealType, city, rooms, priceFrom, priceTo, areaFrom, areaTo]);

  function resetFilters() {
    setSearch("");
    setActiveCategory("Все");
    setDealType("Все");
    setCity("Все");
    setRooms("Все");
    setPriceFrom("");
    setPriceTo("");
    setAreaFrom("");
    setAreaTo("");
  }

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

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
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
                  onClick={() => setActiveCategory(category.value)}
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
                  onClick={() => setDealType(deal.value)}
                >
                  {deal.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ADVANCED FILTERS */}
        <section className={styles.filterSection} style={{ marginTop: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", background: "rgba(255,255,255,0.02)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
            {/* CITY */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "800", color: "#a0aec0", textTransform: "uppercase" }}>Город / Регион</label>
              <select 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#1a202c", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", cursor: "pointer" }}
              >
                <option value="Все">Все города</option>
                <option value="Бишкек">Бишкек</option>
                <option value="Ош">Ош</option>
                <option value="Иссык-Куль">Иссык-Куль</option>
                <option value="Турция">Турция</option>
              </select>
            </div>

            {/* ROOMS */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "800", color: "#a0aec0", textTransform: "uppercase" }}>Комнаты</label>
              <select 
                value={rooms} 
                onChange={(e) => setRooms(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#1a202c", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", cursor: "pointer" }}
              >
                <option value="Все">Любое число</option>
                <option value="1">1 комната</option>
                <option value="2">2 комнаты</option>
                <option value="3">3 комнаты</option>
                <option value="4+">4+ комнат</option>
              </select>
            </div>

            {/* PRICE RANGE */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "800", color: "#a0aec0", textTransform: "uppercase" }}>Цена ($)</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="number" 
                  placeholder="от" 
                  value={priceFrom} 
                  onChange={(e) => setPriceFrom(e.target.value)}
                  style={{ width: "50%", padding: "12px", borderRadius: "10px", background: "#1a202c", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
                />
                <input 
                  type="number" 
                  placeholder="до" 
                  value={priceTo} 
                  onChange={(e) => setPriceTo(e.target.value)}
                  style={{ width: "50%", padding: "12px", borderRadius: "10px", background: "#1a202c", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
                />
              </div>
            </div>

            {/* AREA RANGE */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "800", color: "#a0aec0", textTransform: "uppercase" }}>Площадь (м²)</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="number" 
                  placeholder="от" 
                  value={areaFrom} 
                  onChange={(e) => setAreaFrom(e.target.value)}
                  style={{ width: "50%", padding: "12px", borderRadius: "10px", background: "#1a202c", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
                />
                <input 
                  type="number" 
                  placeholder="до" 
                  value={areaTo} 
                  onChange={(e) => setAreaTo(e.target.value)}
                  style={{ width: "50%", padding: "12px", borderRadius: "10px", background: "#1a202c", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
                />
              </div>
            </div>
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
              <p>По вашему запросу нет подходящих объявлений. Попробуйте изменить параметры поиска.</p>
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
