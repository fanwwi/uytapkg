"use client";

import { useEffect, useState } from "react";
import { Image, Plus, Megaphone, CalendarDays, AlertCircle, LoaderCircle } from "lucide-react";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

import styles from "./Banners.module.css";
import BannerForm from "./BannerForm/BannerForm";
import BannerCard from "./BannerCard/BannerCard";
import DeleteModal from "@/components/ui/deleteModal/DeleteMidal";
import {
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBanner,
} from "@/utils/api";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // DELETE MODAL
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("uytap_token");

    getAdminBanners(token)
      .then((data) => setBanners(data))
      .catch((err) => {
        console.error("Ошибка загрузки баннеров:", err);
        setLoadError(err.message || "Не удалось загрузить баннеры");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleAddBanner(data) {
    const token = localStorage.getItem("uytap_token");

    const created = await createBanner(token, {
      title: data.title,
      imageUrl: data.imageUrl,
      link: data.link || null,
      startDate: data.startDate,
      endDate: data.endDate || null,
      imagePositionX: data.imagePositionX,
      imagePositionY: data.imagePositionY,
    });

    setBanners((prev) => [created, ...prev]);
    setShowForm(false);
  }

  async function handleEditBanner(data) {
    const token = localStorage.getItem("uytap_token");

    const updated = await updateBanner(token, editingBanner.id, {
      title: data.title,
      imageUrl: data.imageUrl,
      link: data.link || null,
      startDate: data.startDate,
      endDate: data.endDate || null,
      imagePositionX: data.imagePositionX,
      imagePositionY: data.imagePositionY,
    });

    setBanners((prev) =>
      prev.map((banner) => (banner.id === updated.id ? updated : banner)),
    );

    setEditingBanner(null);
    setShowForm(false);
  }

  // ОТКРЫТЬ DELETE MODAL
  function openDeleteModal(id) {
    const banner = banners.find((item) => item.id === id);
    setBannerToDelete(banner || null);
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
      const token = localStorage.getItem("uytap_token");
      await deleteBanner(token, bannerToDelete.id);

      setBanners((prev) =>
        prev.filter((banner) => banner.id !== bannerToDelete.id),
      );

      setDeleteModalOpen(false);
      setBannerToDelete(null);
    } catch (error) {
      console.error(error);

      alert(error.message || "Не удалось удалить баннер.");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleToggle(id) {
    const token = localStorage.getItem("uytap_token");

    // Оптимистично переключаем локально, откатываем при ошибке.
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id ? { ...banner, active: !banner.active } : banner,
      ),
    );

    try {
      const updated = await toggleBanner(token, id);

      setBanners((prev) =>
        prev.map((banner) => (banner.id === id ? updated : banner)),
      );
    } catch (error) {
      console.error(error);

      setBanners((prev) =>
        prev.map((banner) =>
          banner.id === id ? { ...banner, active: !banner.active } : banner,
        ),
      );

      alert(error.message || "Не удалось изменить статус баннера.");
    }
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

            {loading ? (
              <div className={styles.empty}>
                <LoaderCircle className={styles.spin} />
                <h3>Загружаем баннеры...</h3>
              </div>
            ) : loadError ? (
              <div className={styles.empty}>
                <AlertCircle />
                <h3>Не удалось загрузить баннеры</h3>
                <p>{loadError}</p>
              </div>
            ) : banners.length > 0 ? (
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
