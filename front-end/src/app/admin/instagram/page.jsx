"use client";

import { useState } from "react";
import { Check, Clock3, Search, ExternalLink, Camera } from "lucide-react";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

import styles from "./Instagram.module.css";

const MOCK_REQUESTS = [
  {
    id: 1,

    listing: {
      id: 101,
      title: "3-комнатная квартира в центре Бишкека",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
      type: "Квартира",
      location: "ул. Токтогула, 125",
      rooms: 3,
      area: "86 м²",
      price: "8 500 000 сом",
      status: "vip",
    },

    user: {
      name: "Айбек Т.",
      phone: "+996 555 123 456",
    },

    createdAt: "30 августа 2026, 18:42",
    status: "pending",
  },

  {
    id: 2,

    listing: {
      id: 102,
      title: "Современный дом в Асанбае",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
      type: "Дом",
      location: "мкр. Асанбай",
      area: "210 м²",
      price: "15 500 000 сом",
      status: "urgent",
    },

    user: {
      name: "Нурбек С.",
      phone: "+996 700 456 789",
    },

    createdAt: "30 августа 2026, 16:15",
    status: "pending",
  },

  {
    id: 3,

    listing: {
      id: 103,
      title: "2-комнатная квартира возле парка",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
      type: "Квартира",
      location: "ул. Исанова, 44",
      rooms: 2,
      area: "64 м²",
      price: "5 800 000 сом",
    },

    user: {
      name: "Мадина К.",
      phone: "+996 555 987 321",
    },

    createdAt: "29 августа 2026, 12:30",
    status: "published",
  },
];

const STATUS_LABELS = {
  pending: "На проверке",
  published: "Опубликовано",
};

export default function InstagramPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredRequests = requests.filter((request) => {
    const matchesFilter =
      activeFilter === "all" || request.status === activeFilter;

    const query = search.toLowerCase().trim();

    if (!query) {
      return matchesFilter;
    }

    const searchableText = [
      request.listing.title,
      request.listing.location,
      request.user.name,
    ]
      .join(" ")
      .toLowerCase();

    return matchesFilter && searchableText.includes(query);
  });

  function publishRequest(id) {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "published",
            }
          : request,
      ),
    );

    /*
      TODO: API

      await publishInstagramRequest(id);
    */
  }

  const pendingCount = requests.filter(
    (request) => request.status === "pending",
  ).length;

  const publishedCount = requests.filter(
    (request) => request.status === "published",
  ).length;

  return (
    <div className={styles.page}>
      <Sidebar />

      <div className={styles.content}>
        <Header
          title="Instagram"
          subtitle="Управление публикациями объявлений"
        />

        <main className={styles.main}>
          {/* =========================
              TOP
          ========================= */}

          <section className={styles.top}>
            <div className={styles.titleBlock}>
              <div className={styles.titleIcon}>
                <Camera />
              </div>

              <div>
                <h1>Публикации Instagram</h1>

                <p>Проверяйте заявки и отмечайте опубликованные объявления.</p>
              </div>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <strong>{pendingCount}</strong>
                <span>ожидают</span>
              </div>

              <div className={styles.stat}>
                <strong>{publishedCount}</strong>
                <span>опубликовано</span>
              </div>
            </div>
          </section>

          {/* =========================
              CONTROLS
          ========================= */}

          <section className={styles.controls}>
            <div className={styles.search}>
              <Search />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Поиск по объявлению или пользователю..."
              />
            </div>

            <div className={styles.filters}>
              <button
                type="button"
                className={activeFilter === "all" ? styles.active : ""}
                onClick={() => setActiveFilter("all")}
              >
                Все
              </button>

              <button
                type="button"
                className={activeFilter === "pending" ? styles.active : ""}
                onClick={() => setActiveFilter("pending")}
              >
                <Clock3 />
                Ожидают
              </button>

              <button
                type="button"
                className={activeFilter === "published" ? styles.active : ""}
                onClick={() => setActiveFilter("published")}
              >
                <Check />
                Опубликовано
              </button>
            </div>
          </section>

          {/* =========================
              REQUESTS
          ========================= */}

          {filteredRequests.length > 0 ? (
            <section className={styles.grid}>
              {filteredRequests.map((request) => {
                const isPublished = request.status === "published";

                return (
                  <article
                    key={request.id}
                    className={`${styles.request} ${
                      isPublished ? styles.published : styles.pending
                    }`}
                  >
                    {/* HEADER */}

                    <div className={styles.requestHeader}>
                      <div className={styles.requestUser}>
                        <div className={styles.avatar}>
                          {request.user.name.charAt(0)}
                        </div>

                        <div className={styles.userInfo}>
                          <strong>{request.user.name}</strong>
                          <span>{request.user.phone}</span>
                        </div>
                      </div>

                      <div
                        className={`${styles.status} ${
                          isPublished
                            ? styles.statusPublished
                            : styles.statusPending
                        }`}
                      >
                        {isPublished ? <Check /> : <Clock3 />}

                        {STATUS_LABELS[request.status]}
                      </div>
                    </div>

                    {/* LISTING */}

                    <div className={styles.listing}>
                      <div className={styles.listingImage}>
                        <img
                          src={request.listing.image}
                          alt={request.listing.title}
                        />

                        {request.listing.status && (
                          <span
                            className={`${styles.listingBadge} ${
                              styles[request.listing.status]
                            }`}
                          >
                            {request.listing.status === "vip"
                              ? "VIP"
                              : "Срочно"}
                          </span>
                        )}
                      </div>

                      <div className={styles.listingContent}>
                        <span className={styles.listingType}>
                          {request.listing.type}
                        </span>

                        <h2>{request.listing.title}</h2>

                        <p className={styles.location}>
                          {request.listing.location}
                        </p>

                        <div className={styles.specs}>
                          {request.listing.rooms && (
                            <span>{request.listing.rooms} комн.</span>
                          )}

                          {request.listing.area && (
                            <span>{request.listing.area}</span>
                          )}
                        </div>

                        <strong className={styles.price}>
                          {request.listing.price}
                        </strong>
                      </div>
                    </div>

                    {/* META */}

                    <div className={styles.meta}>
                      <div>
                        <span>Заявка создана</span>
                        <strong>{request.createdAt}</strong>
                      </div>

                      <button
                        type="button"
                        className={styles.openButton}
                        onClick={() =>
                          window.open(
                            `/all-products/${request.listing.id}`,
                            "_blank",
                          )
                        }
                      >
                        <ExternalLink />
                        Объявление
                      </button>
                    </div>

                    {/* PUBLISH */}

                    {!isPublished && (
                      <div className={styles.publishArea}>
                        <button
                          type="button"
                          className={styles.publishButton}
                          onClick={() => publishRequest(request.id)}
                        >
                          <Check />
                          Опубликовано
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          ) : (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <Camera />
              </div>

              <h2>Заявок не найдено</h2>

              <p>Попробуйте изменить фильтр или поисковый запрос.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
