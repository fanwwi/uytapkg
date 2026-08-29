"use client";

import { useState } from "react";
import { Image, Plus, Megaphone, CalendarDays } from "lucide-react";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

import styles from "./Banners.module.css";
import BannerForm from "./BannerForm/BannerForm";
import BannerCard from "./BannerCard/BannerCard";
import DeleteModal from "@/components/ui/deleteModal/DeleteMidal";

const initialBanners = [
  {
    id: 1,
    title: "Ипотека от Optima Bank",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=85",
    link: "https://optimabank.kg",
    startDate: "2026-08-01",
    endDate: "2026-09-01",
    active: true,
  },
  {
    id: 2,
    title: "Новые жилые комплексы",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85",
    link: "/complexes",
    startDate: "2026-08-15",
    endDate: null,
    active: true,
  },
];

export default function BannersPage() {
  const [banners, setBanners] = useState(initialBanners);

  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // DELETE MODAL
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function handleAddBanner(data) {
    const newBanner = {
      ...data,
      id: Date.now(),
      active: true,
    };

    setBanners((prev) => [newBanner, ...prev]);
    setShowForm(false);
  }

  function handleEditBanner(data) {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === editingBanner.id
          ? {
              ...banner,
              ...data,
            }
          : banner,
      ),
    );

    setEditingBanner(null);
    setShowForm(false);
  }

  // ОТКРЫТЬ DELETE MODAL
  function openDeleteModal(banner) {
    setBannerToDelete(banner);
    setDeleteModalOpen(true);
  }

  // ЗАКРЫТЬ DELETE MODAL
  function closeDeleteModal() {
    if (deleteLoading) return;

    setDeleteModalOpen(false);
    setBannerToDelete(null);
  }

  // ПОДТВЕРДИТЬ УДАЛЕНИЕ
  async function handleDelete() {
    if (!bannerToDelete || deleteLoading) return;

    setDeleteLoading(true);

    try {
      /*
        TODO: API

        await deleteBanner(bannerToDelete.id);
      */

      setBanners((prev) =>
        prev.filter((banner) => banner.id !== bannerToDelete.id),
      );

      setDeleteModalOpen(false);
      setBannerToDelete(null);
    } catch (error) {
      console.error(error);

      alert("Не удалось удалить баннер.");
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleToggle(id) {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id
          ? {
              ...banner,
              active: !banner.active,
            }
          : banner,
      ),
    );
  }

  function openEdit(banner) {
    setEditingBanner(banner);
    setShowForm(true);
  }

  function openCreate() {
    setEditingBanner(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingBanner(null);
  }

  return (
    <div className={styles.admin}>
      <Sidebar />

      <div className={styles.content}>
        <Header title="Баннеры" subtitle="Управление рекламными баннерами" />

        <main className={styles.main}>
          {/* =========================
              HEADER
          ========================= */}

          <div className={styles.pageHeader}>
            <div className={styles.titleBlock}>
              <div className={styles.titleIcon}>
                <Megaphone />
              </div>

              <div>
                <h1>Рекламные баннеры</h1>

                <p>Добавляйте, редактируйте и управляйте размещением рекламы</p>
              </div>
            </div>

            <button
              type="button"
              className={styles.addButton}
              onClick={openCreate}
            >
              <Plus />
              Добавить баннер
            </button>
          </div>

          {/* =========================
              STATS
          ========================= */}

          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Image />
              </div>

              <div>
                <span>Всего баннеров</span>

                <strong>{banners.length}</strong>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Megaphone />
              </div>

              <div>
                <span>Активные</span>

                <strong>
                  {banners.filter((banner) => banner.active).length}
                </strong>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <CalendarDays />
              </div>

              <div>
                <span>Бессрочные</span>

                <strong>
                  {banners.filter((banner) => !banner.endDate).length}
                </strong>
              </div>
            </div>
          </div>

          {/* =========================
              FORM
          ========================= */}

          {showForm && (
            <BannerForm
              initialData={editingBanner}
              onSubmit={editingBanner ? handleEditBanner : handleAddBanner}
              onCancel={closeForm}
            />
          )}

          {/* =========================
              LIST
          ========================= */}

          <section className={styles.listSection}>
            <div className={styles.listHeader}>
              <div>
                <h2>Все баннеры</h2>

                <p>Рекламные размещения на сайте UYTap</p>
              </div>
            </div>

            {banners.length > 0 ? (
              <div className={styles.bannerGrid}>
                {banners.map((banner) => (
                  <BannerCard
                    key={banner.id}
                    banner={banner}
                    onEdit={openEdit}
                    onDelete={openDeleteModal}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <Image />
                </div>

                <h3>Баннеров пока нет</h3>

                <p>
                  Добавьте первый рекламный баннер, чтобы он появился здесь.
                </p>

                <button type="button" onClick={openCreate}>
                  <Plus />
                  Добавить баннер
                </button>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* =========================
          DELETE MODAL
      ========================= */}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Удалить баннер?"
        description={
          bannerToDelete
            ? `Баннер «${bannerToDelete.title}» будет удалён без возможности восстановления.`
            : "Это действие нельзя отменить. Баннер будет удалён без возможности восстановления."
        }
        confirmText="Удалить баннер"
        cancelText="Отмена"
      />
    </div>
  );
}
