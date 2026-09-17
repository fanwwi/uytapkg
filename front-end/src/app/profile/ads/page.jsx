"use client";

import Image from "next/image";
import {
  MapPin,
  Heart,
  Pencil,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Home,
  Layers3,
  UserRoundArrowLeft,
  Rocket,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  getMyListings,
  updateListing as updateListingApi,
  deleteListing as deleteListingApi,
} from "@/utils/api";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./Ads.module.css";
import DeleteModal from "@/components/ui/deleteModal/DeleteMidal";
import AdsEditModal from "./AdsEditModal/AdsEditModal";
import PromoteListingModal from "./PromoteListingModal/PromoteListingModal";

export default function Ads() {
  const router = useRouter();
  const { t } = useLanguage();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mapBackendListing = (l) => {
    const mainPhoto =
      l.listing_photos?.find((p) => p.is_main)?.url ||
      l.listing_photos?.[0]?.url ||
      "";

    const propertyTypeMapping = {
      apartment: "apartment",
      house: "house",
      land: "land",
      commercial: "commercial",
      room: "room",
      garage: "garage",
    };

    const statusMapping = {
      active: "active",
      moderation: "moderation",
      draft: "draft",
      hidden: "hidden",
    };

    return {
      id: l.id,
      title: l.title || t("ads.fallback.noTitle"),
      type: propertyTypeMapping[l.property_type] || "other",
      location: l.city || l.region || t("ads.fallback.country"),
      address: l.address || "",
      price: `${l.price?.toLocaleString() || 0} ${
        l.currency === "USD" ? "$" : t("ads.currency.som")
      }`,
      image:
        mainPhoto ||
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400",
      status: statusMapping[l.status] || "active",
      likes: l.favorites_count || 0,
      dealType: l.deal_type === "sale" ? "sale" : "rent",
      area: l.area ? `${l.area} м²` : "",
      rooms: l.rooms,
      floors: l.total_floors,
      description: l.description || "",
      raw: l,
    };
  };

  const translatePropertyType = (type) => {
    return t(`ads.propertyTypes.${type}`);
  };

  const translateStatus = (status) => {
    return t(`ads.statuses.${status}`);
  };

  const translateDealType = (dealType) => {
    return t(`ads.dealTypes.${dealType}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("uytap_token");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    getMyListings(token)
      .then((res) => {
        if (res.success && res.data) {
          setListings(res.data.map(mapBackendListing));
        } else {
          setError(res.message || "ads.errors.load");
        }
      })
      .catch((err) => {
        console.error("Load my listings error:", err);

        setError("ads.errors.server");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  // DELETE
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedListing, setSelectedListing] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // EDIT
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editingListing, setEditingListing] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  // PROMOTE
  const [promotingListing, setPromotingListing] = useState(null);

  const activeCount = listings.filter(
    (item) => item.status === "active",
  ).length;

  const pendingCount = listings.filter(
    (item) => item.status === "moderation",
  ).length;

  const totalLikes = listings.reduce((total, item) => total + item.likes, 0);

  /* =========================
     DELETE
  ========================= */

  const openDeleteModal = (listing) => {
    setSelectedListing(listing);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setIsDeleteModalOpen(false);
    setSelectedListing(null);
  };

  const handleDelete = async () => {
    if (!selectedListing || isDeleting) {
      return;
    }

    const token = localStorage.getItem("uytap_token");

    if (!token) return;

    try {
      setIsDeleting(true);

      const res = await deleteListingApi(token, selectedListing.id);

      if (res.success) {
        setListings((prev) =>
          prev.filter((item) => item.id !== selectedListing.id),
        );

        setIsDeleteModalOpen(false);
        setSelectedListing(null);
      } else {
        alert(res.message || t("ads.errors.delete"));
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);

      alert(t("ads.errors.delete"));
    } finally {
      setIsDeleting(false);
    }
  };

  /* =========================
     EDIT
  ========================= */

  const openEditModal = (listing) => {
    setEditingListing(listing);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    if (isSaving) return;

    setIsEditModalOpen(false);
    setEditingListing(null);
  };

  const handleSaveEdit = async (updatedListing) => {
    if (!editingListing || isSaving) {
      return;
    }

    const token = localStorage.getItem("uytap_token");

    if (!token) return;

    try {
      setIsSaving(true);

      const priceVal =
        typeof updatedListing.price === "string"
          ? Number(updatedListing.price.replace(/[^0-9]/g, ""))
          : Number(updatedListing.price);

      const areaVal =
        typeof updatedListing.area === "string"
          ? Number(updatedListing.area.replace(/[^0-9.]/g, ""))
          : Number(updatedListing.area);

      const propertyTypeMapping = {
        apartment: "apartment",
        house: "house",
        land: "land",
        commercial: "commercial",
        room: "room",
        garage: "garage",

        Квартира: "apartment",
        Дом: "house",
        Участок: "land",
        Коммерция: "commercial",
        Комнаты: "room",
        "Паркинг/гараж": "garage",
      };

      const dealTypeMapping = {
        sale: "sale",
        rent: "rent",

        Продажа: "sale",
        Сдаю: "rent",
      };

      const payload = {
        title: updatedListing.title,
        description: updatedListing.description,

        propertyType:
          propertyTypeMapping[updatedListing.type] ||
          editingListing.raw?.property_type ||
          "apartment",

        dealType: dealTypeMapping[updatedListing.dealType] || "rent",

        price: priceVal || 100000,

        area: areaVal || null,

        rooms: updatedListing.rooms ? Number(updatedListing.rooms) : null,

        totalFloors: updatedListing.floors
          ? Number(updatedListing.floors)
          : null,

        address: updatedListing.address || "",

        region: editingListing.raw?.region || "BISHKEK",

        city: editingListing.raw?.city || null,

        country: editingListing.raw?.country || "Кыргызстан",

        features: {
          ...(editingListing.raw?.features || {}),
          ...(updatedListing.features || {}),
        },
      };

      const res = await updateListingApi(token, editingListing.id, payload);

      if (res.success && res.data) {
        const mapped = mapBackendListing(res.data);

        setListings((prev) =>
          prev.map((item) => (item.id === editingListing.id ? mapped : item)),
        );

        setIsEditModalOpen(false);
        setEditingListing(null);
      } else {
        alert(res.message || t("ads.errors.update"));
      }
    } catch (error) {
      console.error("Ошибка обновления:", error);

      alert(t("ads.errors.update"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}

        <header className={styles.header}>
          <div className={styles.headerText}>
            <button
              type="button"
              className={styles.homeButton}
              onClick={() => router.push("/profile")}
            >
              <UserRoundArrowLeft size={19} />

              {t("ads.header.profile")}
            </button>

            <span className={styles.eyebrow}>{t("ads.header.eyebrow")}</span>

            <h1>{t("ads.header.title")}</h1>

            <p>{t("ads.header.description")}</p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => router.push("/add-product")}
            >
              <Plus size={19} />

              {t("ads.actions.add")}
            </button>
          </div>
        </header>

        {/* STATISTICS */}

        <section className={styles.stats}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.pink}`}>
              <Layers3 size={21} />
            </div>

            <div>
              <span>{t("ads.stats.total")}</span>

              <strong>{listings.length}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.green}`}>
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>{t("ads.stats.active")}</span>

              <strong>{activeCount}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.red}`}>
              <Heart size={21} />
            </div>

            <div>
              <span>{t("ads.stats.favorites")}</span>

              <strong>{totalLikes}</strong>
            </div>
          </div>
        </section>

        {/* RESULT BAR */}

        <div className={styles.resultBar}>
          <div>
            <strong>{listings.length}</strong>

            <span> {t("ads.resultBar.listings")}</span>
          </div>
        </div>

        {/* LISTINGS */}

        {loading ? (
          <div className={styles.loading}>
            <span className={styles.spinner} />

            <div>{t("ads.loading")}</div>
          </div>
        ) : error ? (
          <div className={styles.error}>
            {error.startsWith("ads.") ? t(error) : error}
          </div>
        ) : listings.length > 0 ? (
          <section className={styles.grid}>
            {listings.map((item) => (
              <article key={item.id} className={styles.card}>
                {/* IMAGE */}

                <div
                  className={styles.imageWrapper}
                  onClick={() => router.push(`/profile/ads/${item.id}`)}
                >
                  <Image
                    src={item.image}
                    fill
                    alt={item.title}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px"
                  />

                  <div className={styles.imageOverlay} />

                  <div className={styles.badges}>
                    <span className={styles.typeBadge}>
                      {translatePropertyType(item.type)}
                    </span>

                    <span
                      className={`${styles.statusBadge} ${
                        item.status === "active"
                          ? styles.statusActive
                          : styles.statusPending
                      }`}
                    >
                      {item.status === "active" ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <AlertCircle size={13} />
                      )}

                      {translateStatus(item.status)}
                    </span>
                  </div>

                  <div className={styles.imageDeal}>
                    {translateDealType(item.dealType)}
                  </div>
                </div>

                {/* CONTENT */}

                <div className={styles.cardContent}>
                  <h2>{item.title}</h2>

                  <div className={styles.location}>
                    <MapPin size={17} />

                    <span>{item.location}</span>
                  </div>

                  <div className={styles.infoRow}>
                    {item.rooms && (
                      <span>
                        <Home size={15} />
                        {item.rooms} {t("ads.card.rooms")}
                      </span>
                    )}

                    <span>{item.area}</span>

                    <span>
                      <Heart size={15} />

                      {item.likes}
                    </span>
                  </div>

                  <div className={styles.priceRow}>
                    <div>
                      <span>{t("ads.card.price")}</span>

                      <strong>{item.price}</strong>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.detailsButton}
                      onClick={() => router.push(`/profile/ads/${item.id}`)}
                    >
                      {t("ads.actions.details")}
                    </button>

                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={t("ads.actions.promoteAria")}
                      title={t("ads.actions.promote")}
                      onClick={(e) => {
                        e.stopPropagation();

                        setPromotingListing(item);
                      }}
                    >
                      <Rocket size={18} />
                    </button>

                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={t("ads.actions.editAria")}
                      title={t("ads.actions.edit")}
                      onClick={(e) => {
                        e.stopPropagation();

                        openEditModal(item);
                      }}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      type="button"
                      className={`${styles.iconButton} ${styles.deleteButton}`}
                      aria-label={t("ads.actions.deleteAria")}
                      title={t("ads.actions.delete")}
                      onClick={(e) => {
                        e.stopPropagation();

                        openDeleteModal(item);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Plus size={29} />
            </div>

            <h2>{t("ads.empty.title")}</h2>

            <p>{t("ads.empty.description")}</p>

            <button type="button" onClick={() => router.push("/add-product")}>
              <Plus size={18} />

              {t("ads.actions.add")}
            </button>
          </div>
        )}

        {/* DELETE MODAL */}

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={isDeleting}
          title={t("ads.deleteModal.title")}
          description={
            selectedListing
              ? `${t(
                  "ads.deleteModal.descriptionStart",
                )} «${selectedListing.title}»? ${t(
                  "ads.deleteModal.descriptionEnd",
                )}`
              : t("ads.deleteModal.descriptionFallback")
          }
          confirmText={t("ads.actions.delete")}
          cancelText={t("ads.actions.cancel")}
        />

        {/* EDIT MODAL */}

        <AdsEditModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          listing={editingListing}
          onSave={handleSaveEdit}
          loading={isSaving}
        />

        {/* PROMOTE MODAL */}

        <PromoteListingModal
          isOpen={Boolean(promotingListing)}
          onClose={() => setPromotingListing(null)}
          listing={promotingListing}
        />
      </div>
    </main>
  );
}
