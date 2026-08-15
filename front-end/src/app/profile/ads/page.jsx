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
  Clock3,
  Layers3,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./Ads.module.css";
import DeleteModal from "@/components/ui/deleteModal/DeleteMidal";
import AdsEditModal from "./AdsEditModal/AdsEditModal";

const initialListings = [
  {
    id: 1,
    title: "Уютный дом у озера Иссык-Куль",
    type: "Дом",
    location: "Чолпон-Ата",
    address: "ул. Советская, 24",
    price: "120 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    status: "Активно",
    likes: 12,
    dealType: "Сдаю",
    area: "180 м²",
    rooms: 5,
    floors: 2,
    description:
      "Просторный и уютный дом в живописном районе Чолпон-Аты. До озера несколько минут пешком.",
  },

  {
    id: 2,
    title: "Современный коттедж с бассейном",
    type: "Коттедж",
    location: "Бостери",
    address: "",
    price: "250 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    status: "Активно",
    likes: 27,
    dealType: "Продажа",
    area: "240 м²",
    rooms: 6,
    floors: 2,
    description: "",
  },

  {
    id: 3,
    title: "Участок 10 соток возле пляжа",
    type: "Участок",
    location: "Кара-Ой",
    address: "",
    price: "45 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAPyE1_cDUmR3d8OUVHVSlPr8dssvtQW7pvssq74Xc-_5uW0a8S5RXO9T&s=10",
    status: "На модерации",
    likes: 8,
    dealType: "Продажа",
    area: "10 соток",
    rooms: null,
    floors: null,
    description: "",
  },
];

export default function Ads() {
  const router = useRouter();

  const [listings, setListings] = useState(initialListings);

  // DELETE
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // EDIT
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const activeCount = listings.filter(
    (item) => item.status === "Активно",
  ).length;

  const pendingCount = listings.filter(
    (item) => item.status === "На модерации",
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
    if (!selectedListing || isDeleting) return;

    try {
      setIsDeleting(true);

      // Здесь потом API:
      //
      // await fetch(`/api/ads/${selectedListing.id}`, {
      //   method: "DELETE",
      // });

      await new Promise((resolve) => setTimeout(resolve, 700));

      setListings((prev) =>
        prev.filter((item) => item.id !== selectedListing.id),
      );

      console.log("Удалено объявление:", selectedListing.id);

      setIsDeleteModalOpen(false);
      setSelectedListing(null);
    } catch (error) {
      console.error("Ошибка удаления:", error);
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
    if (!editingListing || isSaving) return;

    try {
      setIsSaving(true);

      // Здесь потом реальный API:
      //
      // const response = await fetch(`/api/ads/${editingListing.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(updatedListing),
      // });
      //
      // if (!response.ok) {
      //   throw new Error("Не удалось обновить объявление");
      // }

      await new Promise((resolve) => setTimeout(resolve, 700));

      setListings((prev) =>
        prev.map((item) =>
          item.id === editingListing.id
            ? {
                ...item,
                ...updatedListing,
              }
            : item,
        ),
      );

      console.log("Обновлено объявление:", editingListing.id);

      setIsEditModalOpen(false);
      setEditingListing(null);
    } catch (error) {
      console.error("Ошибка обновления:", error);
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
            <span className={styles.eyebrow}>Личный кабинет</span>

            <h1>Мои объявления</h1>

            <p>
              Управляйте своими объектами недвижимости, редактируйте публикации
              и следите за их статусом.
            </p>
          </div>

          <button
            type="button"
            className={styles.addButton}
            onClick={() => router.push("/add-product")}
          >
            <Plus size={19} />
            Добавить объявление
          </button>
        </header>

        {/* STATISTICS */}

        <section className={styles.stats}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.pink}`}>
              <Layers3 size={21} />
            </div>

            <div>
              <span>Всего объявлений</span>
              <strong>{listings.length}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.green}`}>
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Активные</span>
              <strong>{activeCount}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.orange}`}>
              <Clock3 size={21} />
            </div>

            <div>
              <span>На модерации</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.red}`}>
              <Heart size={21} />
            </div>

            <div>
              <span>Всего избранных</span>
              <strong>{totalLikes}</strong>
            </div>
          </div>
        </section>

        {/* RESULT BAR */}

        <div className={styles.resultBar}>
          <div>
            <strong>{listings.length}</strong>
            <span> объявления</span>
          </div>
        </div>

        {/* LISTINGS */}

        {listings.length > 0 ? (
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
                    <span className={styles.typeBadge}>{item.type}</span>

                    <span
                      className={`${styles.statusBadge} ${
                        item.status === "Активно"
                          ? styles.statusActive
                          : styles.statusPending
                      }`}
                    >
                      {item.status === "Активно" ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <AlertCircle size={13} />
                      )}

                      {item.status}
                    </span>
                  </div>

                  <div className={styles.imageDeal}>{item.dealType}</div>
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
                        {item.rooms} комнат
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
                      <span>Цена</span>
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
                      Подробнее
                    </button>

                    {/* EDIT */}

                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label="Изменить объявление"
                      title="Изменить"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(item);
                      }}
                    >
                      <Pencil size={18} />
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      className={`${styles.iconButton} ${styles.deleteButton}`}
                      aria-label="Удалить объявление"
                      title="Удалить"
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

            <h2>У вас пока нет объявлений</h2>

            <p>Добавьте первый объект недвижимости, чтобы он появился здесь.</p>

            <button type="button" onClick={() => router.push("/add-product")}>
              <Plus size={18} />
              Добавить объявление
            </button>
          </div>
        )}

        {/* DELETE MODAL */}

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={isDeleting}
          title="Удалить объявление?"
          description={
            selectedListing
              ? `Вы действительно хотите удалить объявление «${selectedListing.title}»? Это действие нельзя отменить.`
              : "Это действие нельзя отменить. Объявление будет удалено без возможности восстановления."
          }
          confirmText="Удалить"
          cancelText="Отмена"
        />

        {/* EDIT MODAL */}

        <AdsEditModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          listing={editingListing}
          onSave={handleSaveEdit}
          loading={isSaving}
        />
      </div>
    </main>
  );
}
