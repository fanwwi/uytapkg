"use client";

import { MapPin, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function IssykKulProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");

  useEffect(() => {
    const urlSearch = searchParams.get("search") || searchParams.get("query");
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

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
     * ПОКАЗЫВАЕМ ТОЛЬКО ИССЫК-КУЛЬСКИЕ ОБЪЯВЛЕНИЯ
     */
    const filtered = mappedListings.filter((item) => {
      const region = String(item.region || "").toLowerCase();

      const isIssykKul =
        region === "issyk_kul" ||
        region === "issykkul" ||
        region === "issyk kul" ||
        region.includes("issyk") ||
        region.includes("иссык");

      if (!isIssykKul) return false;

      /*
       * ПОИСК
       */
      const matchesSearch =
        !normalizedSearch ||
        String(item.title || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(item.location || "")
          .toLowerCase()
          .includes(normalizedSearch);

      if (!matchesSearch) return false;

      // 1. City / Location match
      const urlCity = searchParams.get("city") || searchParams.get("settlement") || searchParams.get("location");
      if (urlCity && urlCity !== "Все") {
        const itemLoc = String(item.location || "").toLowerCase();
        const itemReg = String(item.region || "").toLowerCase();
        const selectedLoc = urlCity.toLowerCase();
        if (!itemLoc.includes(selectedLoc) && !itemReg.includes(selectedLoc)) {
          return false;
        }
      }

      // 2. Rooms match
      const urlRooms = searchParams.get("rooms");
      if (urlRooms && urlRooms !== "Все") {
        const itemRooms = Number(item.rooms);
        if (urlRooms === "4+") {
          if (itemRooms < 4) return false;
        } else if (itemRooms !== Number(urlRooms)) {
          return false;
        }
      }

      // 3. Price match
      const priceVal = Number(item.rawPrice);
      const urlPriceFrom = searchParams.get("priceFrom") || searchParams.get("minPrice");
      if (urlPriceFrom && priceVal < Number(urlPriceFrom)) return false;

      const urlPriceTo = searchParams.get("priceTo") || searchParams.get("maxPrice");
      if (urlPriceTo && priceVal > Number(urlPriceTo)) return false;

      // 4. Area match
      const areaVal = Number(item.rawArea);
      const urlAreaFrom = searchParams.get("areaFrom") || searchParams.get("minArea");
      if (urlAreaFrom && areaVal < Number(urlAreaFrom)) return false;

      const urlAreaTo = searchParams.get("areaTo") || searchParams.get("maxArea");
      if (urlAreaTo && areaVal > Number(urlAreaTo)) return false;

      // 5. Все остальные динамические параметры из URL (фильтры шагов)
      for (const [key, value] of searchParams.entries()) {
        if ([
          "category", "propertyType", "dealType", "search", "query", "city", "region",
          "rooms", "priceFrom", "priceTo", "areaFrom", "areaTo",
          "page", "limit", "searchMode", "location",
          "country", "settlement", "district", "rentalPeriod", "address", "latitude", "longitude", "listingType"
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

      return true;
    });

    /*
     * VIP → Срочно → обычные
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
  }, [mappedListings, search, searchParams]);

  return (
    <main className={styles.page}>
      {/* HEADER */}

      <header className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.homeButton}
              onClick={() => router.push("/")}
            >
              На главную
            </button>

            <span className={styles.regionBadge}>
              <MapPin size={15} />
              Иссык-Куль
            </span>
          </div>

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
      </div>

      {/* LOADING */}

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
            fontSize: "16px",
            color: "#666",
          }}
        >
          Загрузка объявлений...
        </div>
      )}

      {/* ERROR */}

      {error && !loading && (
        <div
          style={{
            color: "#e53e3e",
            background: "#fed7d7",
            padding: "15px",
            borderRadius: "8px",
            margin: "20px 0",
            textAlign: "center",
          }}
        >
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
                <ListingCardBlack
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
                поиску.
              </p>

              {search && (
                <button type="button" onClick={() => setSearch("")}>
                  Очистить поиск
                </button>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
