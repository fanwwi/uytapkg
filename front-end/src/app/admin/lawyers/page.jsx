"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  MessageCircle,
  Phone,
  X,
  UserRound,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

import styles from "./Lawyers.module.css";
import DeleteModal from "@/components/ui/deleteModal/DeleteMidal";
import {
  getAdminLawyers,
  createLawyer as createLawyerRequest,
  updateLawyer as updateLawyerRequest,
  deleteLawyer as deleteLawyerRequest,
} from "@/utils/api";

const EMPTY_FORM = {
  lastName: "",
  firstName: "",
  middleName: "",
  specialization: "",
  experience: "",
  phone: "",
  whatsapp: "",
  description: "",
  active: true,
};

export default function Lawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLawyer, setEditingLawyer] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lawyerToDelete, setLawyerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("uytap_token");

    getAdminLawyers(token)
      .then(setLawyers)
      .catch((err) => {
        console.error("Ошибка загрузки юристов:", err);
        setLoadError(err.message || "Не удалось загрузить юристов");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredLawyers = lawyers.filter((lawyer) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return `
      ${lawyer.lastName}
      ${lawyer.firstName}
      ${lawyer.middleName}
      ${lawyer.specialization}
      ${lawyer.experience}
    `
      .toLowerCase()
      .includes(query);
  });

  function openCreateModal() {
    setEditingLawyer(null);
    setForm({ ...EMPTY_FORM });
    setSubmitError("");
    setIsModalOpen(true);
  }

  function openEditModal(lawyer) {
    setEditingLawyer(lawyer);

    setForm({
      lastName: lawyer.lastName || "",
      firstName: lawyer.firstName || "",
      middleName: lawyer.middleName || "",
      specialization: lawyer.specialization || "",
      experience: lawyer.experience || "",
      phone: lawyer.phone || "",
      whatsapp: lawyer.whatsapp || "",
      description: lawyer.description || "",
      active: lawyer.active ?? true,
    });

    setSubmitError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) return;

    setIsModalOpen(false);
    setEditingLawyer(null);
    setForm({ ...EMPTY_FORM });
    setSubmitError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.lastName.trim()) {
      alert("Введите фамилию");
      return;
    }

    if (!form.firstName.trim()) {
      alert("Введите имя");
      return;
    }

    if (!form.specialization.trim()) {
      alert("Введите специализацию");
      return;
    }

    if (!form.experience.trim()) {
      alert("Введите опыт работы");
      return;
    }

    const token = localStorage.getItem("uytap_token");

    setSubmitError("");
    setIsSaving(true);

    try {
      if (editingLawyer) {
        const updated = await updateLawyerRequest(token, editingLawyer.id, form);

        setLawyers((current) =>
          current.map((lawyer) =>
            lawyer.id === editingLawyer.id ? updated : lawyer,
          ),
        );
      } else {
        const created = await createLawyerRequest(token, form);

        setLawyers((current) => [created, ...current]);
      }

      closeModal();
    } catch (error) {
      console.error("Ошибка сохранения юриста:", error);
      setSubmitError(error.message || "Не удалось сохранить юриста");
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleLawyer(lawyer) {
    const token = localStorage.getItem("uytap_token");
    const nextActive = !lawyer.active;

    // Оптимистичное обновление — сразу переключаем в UI
    setLawyers((current) =>
      current.map((item) =>
        item.id === lawyer.id ? { ...item, active: nextActive } : item,
      ),
    );

    try {
      await updateLawyerRequest(token, lawyer.id, { active: nextActive });
    } catch (error) {
      console.error("Ошибка обновления статуса юриста:", error);

      // Откатываем при ошибке
      setLawyers((current) =>
        current.map((item) =>
          item.id === lawyer.id ? { ...item, active: lawyer.active } : item,
        ),
      );

      alert("Не удалось изменить статус юриста. Попробуйте ещё раз.");
    }
  }

  function openDeleteModal(lawyer) {
    setLawyerToDelete(lawyer);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    if (deleteLoading) return;

    setDeleteModalOpen(false);
    setLawyerToDelete(null);
  }

  async function handleDelete() {
    if (!lawyerToDelete || deleteLoading) return;

    const token = localStorage.getItem("uytap_token");

    setDeleteLoading(true);

    try {
      await deleteLawyerRequest(token, lawyerToDelete.id);

      setLawyers((current) =>
        current.filter((lawyer) => lawyer.id !== lawyerToDelete.id),
      );

      setDeleteModalOpen(false);
      setLawyerToDelete(null);
    } catch (error) {
      console.error(error);

      alert(error.message || "Не удалось удалить юриста.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <Sidebar />

      <div className={styles.content}>
        <Header
          title="Юристы"
          subtitle="Управление специалистами и юридическими консультациями"
        />

        <main className={styles.main}>
          {/* TOP */}

          <section className={styles.top}>
            <div className={styles.heading}>
              <div className={styles.headingIcon}>
                <UserRound />
              </div>

              <div>
                <h1>Юристы</h1>

                <p>
                  Добавляйте специалистов, редактируйте информацию и управляйте
                  их отображением.
                </p>
              </div>
            </div>

            <button
              type="button"
              className={styles.addButton}
              onClick={openCreateModal}
            >
              <Plus />
              Добавить юриста
            </button>
          </section>

          {/* CONTROLS */}

          <section className={styles.controls}>
            <div className={styles.search}>
              <Search />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Поиск по ФИО или специализации..."
              />
            </div>

            <div className={styles.stats}>
              <span>
                Всего: <strong>{lawyers.length}</strong>
              </span>

              <span>
                Активных:{" "}
                <strong>
                  {lawyers.filter((lawyer) => lawyer.active).length}
                </strong>
              </span>
            </div>
          </section>

          {/* LIST */}

          <section className={styles.list}>
            <div className={styles.listHeader}>
              <span>Юрист</span>
              <span>Специализация</span>
              <span>Опыт</span>
              <span>Контакты</span>
              <span>Статус</span>
              <span>Действия</span>
            </div>

            {loading ? (
              <div className={styles.empty}>
                <LoaderCircle className={styles.spin} />
                <strong>Загружаем юристов...</strong>
              </div>
            ) : loadError ? (
              <div className={styles.empty}>
                <AlertCircle />
                <strong>Не удалось загрузить юристов</strong>
                <span>{loadError}</span>
              </div>
            ) : filteredLawyers.length > 0 ? (
              filteredLawyers.map((lawyer) => (
                <div
                  key={lawyer.id}
                  className={`${styles.lawyerRow} ${
                    !lawyer.active ? styles.inactive : ""
                  }`}
                >
                  {/* NAME */}

                  <div className={styles.name}>
                    <div className={styles.avatar}>
                      {lawyer.firstName.charAt(0)}
                      {lawyer.lastName.charAt(0)}
                    </div>

                    <div>
                      <strong>
                        {lawyer.lastName} {lawyer.firstName}
                      </strong>

                      {lawyer.middleName && (
                        <span>{lawyer.middleName}</span>
                      )}
                    </div>
                  </div>

                  {/* SPECIALIZATION */}

                  <div className={styles.specialization}>
                    <span>{lawyer.specialization}</span>
                  </div>

                  {/* EXPERIENCE */}

                  <div className={styles.experience}>
                    {lawyer.experience}
                  </div>

                  {/* CONTACTS */}

                  <div className={styles.contacts}>
                    {lawyer.phone && (
                      <a href={`tel:${lawyer.phone}`}>
                        <Phone />
                        {lawyer.phone}
                      </a>
                    )}

                    {lawyer.whatsapp && (
                      <a
                        href={`https://wa.me/${lawyer.whatsapp.replace(
                          /\D/g,
                          "",
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle />
                        WhatsApp
                      </a>
                    )}
                  </div>

                  {/* STATUS */}

                  <div className={styles.status}>
                    <button
                      type="button"
                      className={`${styles.switch} ${
                        lawyer.active ? styles.switchActive : ""
                      }`}
                      onClick={() => toggleLawyer(lawyer)}
                      aria-label={
                        lawyer.active
                          ? "Выключить юриста"
                          : "Включить юриста"
                      }
                    >
                      <span />
                    </button>

                    <span>
                      {lawyer.active ? "Активен" : "Выключен"}
                    </span>
                  </div>

                  {/* ACTIONS */}

                  <div className={styles.actions}>
                    <button
                      type="button"
                      onClick={() => openEditModal(lawyer)}
                      title="Редактировать"
                    >
                      <Pencil />
                    </button>

                    <button
                      type="button"
                      className={styles.delete}
                      onClick={() => openDeleteModal(lawyer)}
                      title="Удалить"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.empty}>
                <UserRound />

                <strong>Юристы не найдены</strong>

                <span>
                  {lawyers.length === 0
                    ? "Пока не добавлено ни одного юриста."
                    : "Попробуйте изменить поисковый запрос."}
                </span>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* =========================
          LAWYER MODAL
      ========================= */}

      {isModalOpen && (
        <div
          className={styles.overlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h2>
                  {editingLawyer
                    ? "Редактирование юриста"
                    : "Добавление юриста"}
                </h2>

                <p>Заполните информацию о специалисте.</p>
              </div>

              <button
                type="button"
                className={styles.close}
                onClick={closeModal}
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formBody}>
                {submitError && (
                  <div className={styles.submitError}>
                    <AlertCircle size={16} />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* LAST NAME */}

                <div className={styles.field}>
                  <label>Фамилия *</label>

                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Например: Абдрахманова"
                  />
                </div>

                {/* FIRST NAME */}

                <div className={styles.field}>
                  <label>Имя *</label>

                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Например: Айгуль"
                  />
                </div>

                {/* MIDDLE NAME */}

                <div className={styles.field}>
                  <label>Отчество</label>

                  <input
                    name="middleName"
                    value={form.middleName}
                    onChange={handleChange}
                    placeholder="Например: Талгатовна"
                  />
                </div>

                {/* SPECIALIZATION */}

                <div className={styles.field}>
                  <label>Специализация *</label>

                  <input
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    placeholder="Например: Недвижимость и земельное право"
                  />
                </div>

                {/* EXPERIENCE */}

                <div className={styles.field}>
                  <label>Опыт работы *</label>

                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Например: 8 лет"
                  />
                </div>

                {/* PHONE */}

                <div className={styles.field}>
                  <label>Телефон</label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+996 555 123 456"
                  />
                </div>

                {/* WHATSAPP */}

                <div className={styles.field}>
                  <label>WhatsApp</label>

                  <input
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="+996 555 123 456"
                  />
                </div>

                {/* DESCRIPTION */}

                <div className={styles.field}>
                  <label>Описание</label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Кратко расскажите о специалисте, его направлении работы и услугах..."
                    rows={5}
                  />
                </div>

                {/* ACTIVE */}

                <label className={styles.activeField}>
                  <div>
                    <strong>Показывать юриста</strong>

                    <span>
                      Если выключить, юрист не будет отображаться
                      пользователям.
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        active: event.target.checked,
                      }))
                    }
                  />

                  <span className={styles.checkbox}>
                    <span />
                  </span>
                </label>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  Отмена
                </button>

                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <LoaderCircle size={16} className={styles.spin} />
                  ) : editingLawyer ? (
                    "Сохранить изменения"
                  ) : (
                    "Добавить юриста"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          DELETE MODAL
      ========================= */}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Удалить юриста?"
        description={
          lawyerToDelete
            ? `Юрист ${lawyerToDelete.lastName} ${lawyerToDelete.firstName} будет удалён без возможности восстановления.`
            : "Это действие нельзя отменить. Юрист будет удалён без возможности восстановления."
        }
        confirmText="Удалить юриста"
        cancelText="Отмена"
      />
    </div>
  );
}
