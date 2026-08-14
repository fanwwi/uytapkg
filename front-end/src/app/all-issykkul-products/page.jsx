"use client";

import Image from "next/image";
import {
  MapPin,
  Heart,
  SlidersHorizontal,
  Search,
  Crown,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import styles from "./IssykKulProducts.module.css";

const listings = [
  {
    id: 1,
    title: "Уютный дом у озера Иссык-Куль",
    type: "Дом",
    dealType: "Куплю",
    status: "vip",
    region: "Иссык-Куль",
    location: "Чолпон-Ата",
    price: "120 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtBgjTX3QLD8mlKzUOBsNBrqI9INeEgfksIYtAfvgGbA&s=10",
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
    region: "Иссык-Куль",
    location: "Бостери",
    price: "250 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtBgjTX3QLD8mlKzUOBsNBrqI9INeEgfksIYtAfvgGbA&s=10",
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
    region: "Иссык-Куль",
    location: "Кара-Ой",
    price: "45 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtBgjTX3QLD8mlKzUOBsNBrqI9INeEgfksIYtAfvgGbA&s=10",
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
    region: "Иссык-Куль",
    location: "Боконбаево",
    price: "95 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtBgjTX3QLD8mlKzUOBsNBrqI9INeEgfksIYtAfvgGbA&s=10",
    likes: 31,
    rooms: 6,
    area: "210 м²",
  },

  {
    id: 5,
    title: "Гостевой дом рядом с пляжем",
    type: "Гостевой дом",
    dealType: "Сниму в аренду",
    status: "urgent",
    region: "Иссык-Куль",
    location: "Тамчы",
    price: "65 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtBgjTX3QLD8mlKzUOBsNBrqI9INeEgfksIYtAfvgGbA&s=10",
    likes: 37,
    rooms: 8,
    area: "280 м²",
  },

  {
    id: 6,
    title: "Земельный участок под строительство",
    type: "Участок",
    dealType: "Куплю",
    status: null,
    region: "Иссык-Куль",
    location: "Чолпон-Ата",
    price: "32 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtBgjTX3QLD8mlKzUOBsNBrqI9INeEgfksIYtAfvgGbA&s=10",
    likes: 12,
    rooms: null,
    area: "8 соток",
  },

  // Не Иссык-Куль — специально оставляем для проверки фильтра.
  {
    id: 7,
    title: "Квартира с видом на горы",
    type: "Квартира",
    dealType: "Куплю",
    status: "vip",
    region: "Бишкек",
    location: "Бишкек",
    price: "85 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtBgjTX3QLD8mlKzUOBsNBrqI9INeEgfksIYtAfvgGbA&s=10",
    likes: 56,
    rooms: 3,
    area: "95 м²",
  },
];

const categories = [
  "Все",
  "Дом/Дача",
  "Квартира",
  "Коттедж",
  "Гостевой дом",
  "Участок",
  "Коммерция",
];

export default function IssykKulProducts() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [dealType, setDealType] = useState("Все");

  const filteredListings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    /*
     * ГЛАВНЫЙ ФИЛЬТР:
     * показываем ТОЛЬКО Иссык-Куль.
     */
    const filtered = listings.filter((item) => {
      const isIssykKul = item.region === "Иссык-Куль";

      const matchesSearch =
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.location.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        activeCategory === "Все" || item.type === activeCategory;

      const matchesDealType = dealType === "Все" || item.dealType === dealType;

      return isIssykKul && matchesSearch && matchesCategory && matchesDealType;
    });

    /*
     * Приоритет:
     * VIP → Срочно → обычное
     */
    return [...filtered].sort((a, b) => {
      const priority = {
        vip: 0,
        urgent: 1,
        null: 2,
      };

      return priority[a.status] - priority[b.status];
    });
  }, [search, activeCategory, dealType]);

  return (
    <main className={styles.page}>
      {/* HEADER */}

      <header className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.regionBadge}>
            <MapPin size={15} />
            Иссык-Куль
          </span>

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

        <button
          type="button"
          className={styles.filter}
          onClick={() => router.push("/issyk-kul/#searchIssykKul")}
        >
          <SlidersHorizontal size={19} />
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

      {/* RESULT */}

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
            <article
              key={item.id}
              className={styles.card}
              onClick={() => router.push(`/ads/${item.id}`)}
            >
              {/* IMAGE */}

              <div className={styles.image}>
                <Image
                  src={item.image}
                  fill
                  alt={item.title}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                />

                <div className={styles.imageGradient} />

                {/* BADGES */}

                <div className={styles.badges}>
                  {item.status === "vip" && (
                    <span className={`${styles.status} ${styles.vip}`}>
                      <Crown size={14} />
                      VIP
                    </span>
                  )}

                  {item.status === "urgent" && (
                    <span className={`${styles.status} ${styles.urgent}`}>
                      <Zap size={14} />
                      Срочно
                    </span>
                  )}

                  <span className={styles.type}>{item.type}</span>
                </div>

                {/* FAVORITE */}

                <button
                  type="button"
                  className={styles.favorite}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  aria-label="Добавить в избранное"
                >
                  <Heart size={19} />
                </button>
              </div>

              {/* CONTENT */}

              <div className={styles.content}>
                <h2>{item.title}</h2>

                <div className={styles.location}>
                  <MapPin size={16} />
                  <span>{item.location}</span>
                </div>

                <div className={styles.details}>
                  {item.rooms && (
                    <span>
                      {item.rooms} {item.rooms === 1 ? "комната" : "комнат"}
                    </span>
                  )}

                  <span>{item.area}</span>
                </div>

                <div className={styles.bottom}>
                  <strong>{item.price}</strong>

                  <button
                    type="button"
                    className={styles.more}
                    onClick={(event) => {
                      event.stopPropagation();
                      router.push(`/all-products/${item.id}`);
                    }}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </article>
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
            выбранным параметрам.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategory("Все");
              setDealType("Все");
            }}
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </main>
  );
}
