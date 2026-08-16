"use client";

import Image from "next/image";
import {
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { getListings } from "@/utils/api";
import ListingCard from "@/components/ui/ListingCard/ListingCard";
import { mapListingData } from "@/utils/mapListingData";

import styles from "./AllProducts.module.css";

/*
const listings = [
  {
    id: 1,
    title: "Уютный дом у озера Иссык-Куль",
    type: "Дом",
    dealType: "Куплю",
    status: "vip",
    location: "Чолпон-Ата",
    price: "120 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 24,
    rooms: 5,
    area: "180 м²",
  },

  {
    id: 2,
    title: "Современный коттедж с бассейном",
    type: "Коттедж",
    dealType: "Сниму в аренду",
    status: "urgent",
    location: "Бостери",
    price: "250 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 41,
    rooms: 7,
    area: "320 м²",
  },

  {
    id: 3,
    title: "Участок 10 соток возле пляжа",
    type: "Участок",
    dealType: "Куплю",
    status: null,
    location: "Кара-Ой",
    price: "45 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 18,
    rooms: null,
    area: "10 соток",
  },

  {
    id: 4,
    title: "Большой семейный дом",
    type: "Дом",
    dealType: "Сниму в аренду",
    status: "vip",
    location: "Боконбаево",
    price: "95 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 31,
    rooms: 6,
    area: "210 м²",
  },

  {
    id: 5,
    title: "Квартира с видом на горы",
    type: "Квартира",
    dealType: "Куплю",
    status: "urgent",
    location: "Бишкек",
    price: "85 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 56,
    rooms: 3,
    area: "95 м²",
  },

  {
    id: 6,
    title: "Земельный участок под строительство",
    type: "Участок",
    dealType: "Куплю",
    status: null,
    location: "Кант",
    price: "32 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 12,
    rooms: null,
    area: "8 соток",
  },

  {
    id: 7,
    title: "Коммерческое помещение в центре",
    type: "Коммерция",
    dealType: "Куплю",
    status: "vip",
    location: "Бишкек",
    price: "180 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 27,
    rooms: null,
    area: "150 м²",
  },

  {
    id: 8,
    title: "Паркинг возле центра города",
    type: "Паркинг/гараж",
    dealType: "Куплю",
    status: "urgent",
    location: "Бишкек",
    price: "18 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 15,
    rooms: null,
    area: "24 м²",
  },

  {
    id: 9,
    title: "Уютная комната рядом с университетом",
    type: "Комнаты",
    dealType: "Сниму в аренду",
    status: null,
    location: "Бишкек",
    price: "25 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    likes: 34,
    rooms: 1,
    area: "22 м²",
  },
];
*/

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

export default function AllProducts() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [dealType, setDealType] = useState("Все");

  const [listingsList, setListingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);
    setError(null);

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

    const urlDealType = searchParams.get("dealType");
    if (urlDealType) {
      const dealTypeMapping = {
        sale: "Продажа",
        rent: "Сниму в аренду",
      };
      setDealType(dealTypeMapping[urlDealType] || "Все");
    } else {
      setDealType("Все");
    }

    const queryParams = { page: 1, limit: 20 };
    searchParams.forEach((value, key) => {
      if (value !== "" && value !== "null" && value !== "undefined") {
        queryParams[key] = value;
      }
    });

    getListings(queryParams)
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
  }, [searchParams]);

  const mappedListings = useMemo(() => {
    return listingsList.map(item => mapListingData(item));
  }, [listingsList]);

  const filteredListings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = mappedListings.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        activeCategory === "Все" || item.type === activeCategory;

      const matchesDealType = dealType === "Все" || item.dealType === dealType;

      return matchesSearch && matchesCategory && matchesDealType;
    });

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
  }, [search, activeCategory, dealType, mappedListings]);

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
          <Search />

          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          type="button"
          className={styles.filter}
          onClick={() => router.push("/#search")}
        >
          <SlidersHorizontal />
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

      {/* RESULT & PRODUCTS */}
      {!loading && !error && (
        <>
          <div className={styles.result}>
            <span>Найдено объявлений: </span>

            <strong>{filteredListings.length}</strong>
          </div>

          {filteredListings.length > 0 ? (
            <section className={styles.grid}>
              {filteredListings.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </section>
          ) : (
            /* EMPTY */

            <div className={styles.empty}>
              <Search />

              <h2>Ничего не найдено</h2>

              <p>
                Попробуйте изменить поисковый запрос или выбрать другую категорию.
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
