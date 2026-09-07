"use client";

import { useState, useEffect } from "react";
import { Check, Clock3, Search, ExternalLink, Camera, Loader2 } from "lucide-react";

import {
  getAdminInstagramRequests,
  completeInstagramRequest,
} from "@/utils/api";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

import styles from "./Instagram.module.css";

const STATUS_LABELS = {
  pending: "На проверке",
  published: "Опубликовано",
};

const PROPERTY_TYPE_LABELS = {
  apartment: "Квартира",
  house: "Дом",
  land: "Участок",
  room: "Комната",
  commercial: "Коммерция",
  parking: "Паркинг / гараж",
};

function formatPrice(price, currency) {
  if (price === null || price === undefined) return "Цена не указана";
  const formatted = new Intl.NumberFormat("ru-RU").format(price);
  return `${formatted} ${currency || ""}`.trim();
}

function formatLocation(listing) {
  return [listing?.district, listing?.address].filter(Boolean).join(", ") || listing?.city || "";
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return value;
  }
}

// Приводит ответ бэкенда (см. adminController.listInstagramRequestsAdmin) к
// форме, которую ожидает разметка ниже.
function mapRequest(raw) {
  return {
    id: raw.id,
    status: raw.status,
    createdAt: formatDate(raw.createdAt),
    listing: raw.listing
      ? {
          id: raw.listing.id,
          title: raw.listing.title,
          image: raw.listing.image,
          type: PROPERTY_TYPE_LABELS[raw.listing.propertyType] || raw.listing.propertyType,
          location: formatLocation(raw.listing),
          rooms: raw.listing.rooms,
          area: raw.listing.area ? `${raw.listing.area} м²` : null,
          price: formatPrice(raw.listing.price, raw.listing.currency),
          status:
            raw.listing.promotionStatus && raw.listing.promotionStatus !== "regular"
              ? raw.listing.promotionStatus
              : raw.listing.isUrgent
                ? "urgent"
                : null,
        }
      : null,
    user: raw.user,
  };
}

export default function InstagramPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [publishingId, setPublishingId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("uytap_token");
    if (!token) {
      setError("Требуется авторизация администратора");
      setLoading(false);
      return;
    }
    try {
      const data = await getAdminInstagramRequests(token);
      setRequests((data || []).map(mapRequest));
    } catch (err) {
      console.error("Error loading instagram requests:", err);
      setError(err.message || "Ошибка загрузки заявок на Instagram");
    } finally {
      setLoading(false);
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesFilter =
      activeFilter === "all" || request.status === activeFilter;

    const query = search.toLowerCase().trim();

    if (!query) {
      return matchesFilter;
    }

    const searchableText = [
      request.listing?.title,
      request.listing?.location,
      request.user?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesFilter && searchableText.includes(query);
  });

  async function publishRequest(id) {
    const token = localStorage.getItem("uytap_token");
    if (!token) return;

    setPublishingId(id);
    try {
      await completeInstagramRequest(token, id);
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
    } catch (err) {
      console.error("Error completing instagram request:", err);
      alert(err.message || "Не удалось обновить заявку");
    } finally {
      setPublishingId(null);
    }
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

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <Loader2 className={styles.spinIcon} size={32} style={{ color: "#6d28d9" }} />
            </div>
          ) : error ? (
            <div style={{ padding: "20px", color: "#e53e3e", background: "#fed7d7", borderRadius: "10px" }}>
              {error}
            </div>
          ) : filteredRequests.length > 0 ? (
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

                    {request.listing ? (
                      <div className={styles.listing}>
                        <div className={styles.listingImage}>
                          {request.listing.image && (
                            <img
                              src={request.listing.image}
                              alt={request.listing.title}
                            />
                          )}

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
                    ) : (
                      <div className={styles.listing}>
                        <div className={styles.listingContent}>
                          <p className={styles.location}>
                            Объявление было удалено
                          </p>
                        </div>
                      </div>
                    )}

                    {/* META */}

                    <div className={styles.meta}>
                      <div>
                        <span>Заявка создана</span>
                        <strong>{request.createdAt}</strong>
                      </div>

                      {request.listing && (
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
                      )}
                    </div>

                    {/* PUBLISH */}

                    {!isPublished && (
                      <div className={styles.publishArea}>
                        <button
                          type="button"
                          className={styles.publishButton}
                          disabled={publishingId === request.id}
                          onClick={() => publishRequest(request.id)}
                        >
                          <Check />
                          {publishingId === request.id
                            ? "Сохранение..."
                            : "Опубликовано"}
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
