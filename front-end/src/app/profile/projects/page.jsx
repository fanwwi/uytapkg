"use client";

import Image from "next/image";
import {
  Building2,
  CalendarDays,
  Edit,
  Eye,
  Home,
  Layers3,
  MapPin,
  MoreVertical,
  Plus,
  Trash2,
  TrendingUp,
  X,
  Save,
  HomeIcon,
  UserRoundArrowLeft,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMyComplexes,
  updateComplex as updateComplexApi,
  deleteComplex as deleteComplexApi,
} from "@/utils/api";

import styles from "./ResidentialComplexes.module.css";
import CustomSelectBlack from "@/components/ui/customSelectBlack/CustomSelectBlack";
import DeleteModal from "@/components/ui/deleteModal/DeleteMidal";
import { ImProfile } from "react-icons/im";
import { RiProfileFill } from "react-icons/ri";

const initialComplexes = [
  {
    id: 1,
    name: "ЖК Ала-Тоо",
    address: "ул. Токтогула, 125, Бишкек",
    status: "Строительство",
    class: "Бизнес",
    completionLabel: "Сентябрь 2027",
    completionDate: "2027-09-01",
    progress: 68,
    floors: 16,
    apartments: 384,
    sold: 217,
    parking: 240,
    area: "42 500 м²",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Паркинг", "Охрана", "Детская площадка", "Лифт"],
  },
  {
    id: 2,
    name: "ЖК Mountain Residence",
    address: "мкр. Джал, Бишкек",
    status: "Строительство",
    class: "Премиум",
    completionLabel: "Май 2028",
    completionDate: "2028-05-01",
    progress: 34,
    floors: 20,
    apartments: 520,
    sold: 143,
    parking: 310,
    area: "61 800 м²",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Подземный паркинг", "Фитнес", "Охрана", "Закрытая территория"],
  },
  {
    id: 3,
    name: "ЖК Green Park",
    address: "ул. Байтик Баатыра, 72, Бишкек",
    status: "Сдан",
    class: "Комфорт",
    completionLabel: "Ноябрь 2025",
    completionDate: "2025-11-01",
    progress: 100,
    floors: 12,
    apartments: 288,
    sold: 276,
    parking: 180,
    area: "31 200 м²",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Детская площадка", "Парковка", "Зеленая зона", "Лифт"],
  },
  {
    id: 4,
    name: "ЖК Nova City",
    address: "ул. Масалиева, 44, Бишкек",
    status: "Проект",
    class: "Комфорт",
    completionLabel: "Март 2029",
    completionDate: "2029-03-01",
    progress: 8,
    floors: 14,
    apartments: 420,
    sold: 0,
    parking: 260,
    area: "48 000 м²",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Паркинг", "Детский сад", "Зеленая зона"],
  },
];

const statusOptions = ["Все статусы", "Проект", "Строительство", "Сдан"];

const editStatusOptions = ["Проект", "Строительство", "Сдан"];

const classOptions = ["Эконом", "Комфорт", "Бизнес", "Премиум"];

const statusClass = {
  Проект: "project",
  Строительство: "construction",
  Сдан: "completed",
};

export default function ResidentialComplexes() {
  const router = useRouter();

  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("uytap_token");
    if (!token) {
      router.push("/login");
      return;
    }

    getMyComplexes(token)
      .then((res) => {
        if (res.success && res.data) {
          const mapped = res.data.map((item) => {
            const compl = item;
            let completion_status = "Строительство";
            if (compl.completion_status === "planning")
              completion_status = "Проект";
            if (compl.completion_status === "completed")
              completion_status = "Сдан";

            return {
              id: compl.id,
              name: compl.name,
              address: compl.address,
              status: completion_status,
              class: compl.housing_class || "Комфорт",
              completionLabel: getCompletionLabel(compl.completion_date),
              completionDate: compl.completion_date,
              floors: compl.features?.floors || 0,
              apartments: compl.features?.apartments || 0,
              parking: compl.features?.parking || 0,
              area: compl.features?.area ? `${compl.features.area} м²` : "0 м²",
              image:
                compl.cover_photo ||
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85",
              amenities: compl.features?.amenities || [],
            };
          });
          setComplexes(mapped);
        } else {
          setError(res.message || "Ошибка загрузки жилых комплексов");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Не удалось загрузить жилые комплексы с сервера");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const [status, setStatus] = useState("Все статусы");
  const [search, setSearch] = useState("");

  // ЖК для удаления
  const [deleteComplex, setDeleteComplex] = useState(null);

  // ЖК для редактирования
  const [editComplex, setEditComplex] = useState(null);

  // Данные формы редактирования
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    status: "Строительство",
    class: "Комфорт",
    completionDate: "",
    floors: "",
    apartments: "",
    parking: "",
    area: "",
  });

  const filteredComplexes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return complexes.filter((item) => {
      const matchesStatus = status === "Все статусы" || item.status === status;

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.address.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [complexes, status, search]);

  const totalApartments = complexes.reduce(
    (sum, item) => sum + item.apartments,
    0,
  );

  const constructionCount = complexes.filter(
    (item) => item.status === "Строительство",
  ).length;

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDeleteClick = (item) => {
    setDeleteComplex(item);
  };

  const closeDeleteModal = () => {
    setDeleteComplex(null);
  };

  const confirmDelete = async () => {
    if (!deleteComplex) return;

    try {
      const token = localStorage.getItem("uytap_token");
      if (!token) throw new Error("Вы не авторизованы");

      const res = await deleteComplexApi(token, deleteComplex.id);
      if (!res.success) throw new Error(res.message || "Ошибка удаления");

      setComplexes((prev) =>
        prev.filter((item) => item.id !== deleteComplex.id),
      );
    } catch (err) {
      alert(err.message || "Не удалось удалить жилой комплекс");
    } finally {
      setDeleteComplex(null);
    }
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEditClick = (item) => {
    setEditComplex(item);

    setEditForm({
      name: item.name || "",
      address: item.address || "",
      status: item.status || "Строительство",
      class: item.class || "Комфорт",
      completionDate: item.completionDate || "",
      floors: item.floors ?? "",
      apartments: item.apartments ?? "",
      parking: item.parking ?? "",
      area: item.area
        ? String(item.area).replace(/\s?м²/g, "").replace(/\s/g, "")
        : "",
    });
  };

  const closeEditModal = () => {
    setEditComplex(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setEditField = (name, value) => {
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCompletionLabel = (date) => {
    if (!date) return "";

    const [year, month] = date.split("-");

    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    const monthIndex = Number(month) - 1;

    if (!months[monthIndex]) return "";

    return `${months[monthIndex]} ${year}`;
  };

  const saveEdit = async () => {
    if (!editComplex) return;

    try {
      const token = localStorage.getItem("uytap_token");
      if (!token) throw new Error("Вы не авторизованы");

      const payload = {
        name: editForm.name,
        address: editForm.address,
        status: editForm.status,
        class: editForm.class,
        completionDate: editForm.completionDate,
        floors: Number(editForm.floors) || 0,
        apartments: Number(editForm.apartments) || 0,
        parking: Number(editForm.parking) || 0,
        area: Number(editForm.area) || 0,
      };

      const res = await updateComplexApi(token, editComplex.id, payload);
      if (!res.success) throw new Error(res.message || "Ошибка обновления");

      const compl = res.data;
      let completion_status = "Строительство";
      if (compl.completion_status === "planning") completion_status = "Проект";
      if (compl.completion_status === "completed") completion_status = "Сдан";

      const updated = {
        id: compl.id,
        name: compl.name,
        address: compl.address,
        status: completion_status,
        class: compl.housing_class || "Комфорт",
        completionLabel: getCompletionLabel(compl.completion_date),
        completionDate: compl.completion_date,
        floors: compl.features?.floors || 0,
        apartments: compl.features?.apartments || 0,
        parking: compl.features?.parking || 0,
        area: compl.features?.area ? `${compl.features.area} м²` : "0 м²",
        image: compl.cover_photo || editComplex.image,
        amenities: compl.features?.amenities || editComplex.amenities,
      };

      setComplexes((prev) =>
        prev.map((item) => (item.id === editComplex.id ? updated : item)),
      );
      setEditComplex(null);
    } catch (err) {
      alert(err.message || "Не удалось обновить жилой комплекс");
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* =========================================================
            HEADER
        ========================================================= */}

        <header className={styles.header}>
          <div className={styles.headerText}>
            <div className={styles.btns}>
              <button
                type="button"
                className={styles.homeButton}
                onClick={() => router.push("/profile")}
              >
                <UserRoundArrowLeft size={18} />
                В профиль
              </button>

              <span className={styles.eyebrow}>
                <Building2 />
                Кабинет застройщика
              </span>
            </div>

            <h1>Мои жилые комплексы</h1>

            <p>
              Управляйте своими ЖК, следите за строительством и обновляйте
              информацию для покупателей.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => router.push("/add-residential-complex")}
            >
              <Plus size={19} />
              Добавить ЖК
            </button>
          </div>
        </header>

        {/* =========================================================
            OVERVIEW
        ========================================================= */}

        <section className={styles.overview}>
          <div className={styles.overviewCard}>
            <div className={styles.overviewIcon}>
              <Building2 />
            </div>

            <div>
              <span>Всего ЖК</span>
              <strong>{complexes.length}</strong>
            </div>
          </div>

          <div className={styles.overviewCard}>
            <div className={styles.overviewIcon}>
              <TrendingUp />
            </div>

            <div>
              <span>В строительстве</span>
              <strong>{constructionCount}</strong>
            </div>
          </div>

          <div className={styles.overviewCard}>
            <div className={styles.overviewIcon}>
              <Home />
            </div>

            <div>
              <span>Всего квартир</span>
              <strong>{totalApartments.toLocaleString("ru-RU")}</strong>
            </div>
          </div>
        </section>

        {/* =========================================================
            FILTERS
        ========================================================= */}

        <section className={styles.filters}>
          <div className={styles.search}>
            <Building2 />

            <input
              type="text"
              placeholder="Поиск по названию или адресу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.statusSelect}>
            <CustomSelectBlack
              icon={TrendingUp}
              title="Статус"
              options={statusOptions}
              value={status}
              setValue={setStatus}
            />
          </div>
        </section>

        {/* =========================================================
            RESULT
        ========================================================= */}

        <div className={styles.resultRow}>
          <div>
            <span>Ваши проекты</span>
            <strong>{filteredComplexes.length}</strong>
          </div>

          <span className={styles.resultHint}>
            Управляйте каждым жилым комплексом отдельно
          </span>
        </div>

        {/* =========================================================
            GRID
        ========================================================= */}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "#888",
              fontSize: "16px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                border: "3px solid rgba(255,255,255,0.1)",
                borderTop: "3px solid #ff3d99",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                animation: "spin 1s linear infinite",
                marginBottom: "15px",
              }}
            />
            <div>Загрузка ваших жилых комплексов...</div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div
            style={{
              color: "#e53e3e",
              background: "#fed7d7",
              padding: "15px",
              borderRadius: "10px",
              margin: "20px 0",
              textAlign: "center",
              border: "1px solid #feb2b2",
            }}
          >
            {error}
          </div>
        ) : filteredComplexes.length > 0 ? (
          <section className={styles.grid}>
            {filteredComplexes.map((item) => (
              <article key={item.id} className={styles.card}>
                {/* IMAGE */}

                <div className={styles.image}>
                  <Image
                    src={item.image}
                    fill
                    alt={item.name}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 600px"
                  />

                  <div className={styles.imageOverlay} />

                  <div className={styles.topBadges}>
                    <span
                      className={`${styles.status} ${
                        styles[statusClass[item.status]]
                      }`}
                    >
                      <i />
                      {item.status}
                    </span>

                    <span className={styles.classBadge}>{item.class}</span>
                  </div>

                  <button
                    type="button"
                    className={styles.moreButton}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <MoreVertical />
                  </button>
                </div>

                {/* CONTENT */}

                <div className={styles.content}>
                  <div className={styles.titleRow}>
                    <div>
                      <h2>{item.name}</h2>

                      <div className={styles.location}>
                        <MapPin />
                        <span>{item.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* SPECS */}

                  <div className={styles.specs}>
                    <div>
                      <Layers3 />

                      <span>
                        <b>{item.floors}</b>
                        этажей
                      </span>
                    </div>

                    <div>
                      <Home />

                      <span>
                        <b>{item.apartments}</b>
                        квартир
                      </span>
                    </div>

                    <div>
                      <CalendarDays />

                      <span>
                        <b>{item.completionLabel}</b>
                        сдача
                      </span>
                    </div>
                  </div>

                  {/* AMENITIES */}

                  <div className={styles.amenities}>
                    {item.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity}>{amenity}</span>
                    ))}

                    {item.amenities.length > 3 && (
                      <span>+{item.amenities.length - 3}</span>
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.primaryAction}
                      onClick={() =>
                        router.push(`/profile/projects/${item.id}`)
                      }
                    >
                      <Eye />
                      Подробнее
                    </button>

                    {/* EDIT */}

                    <button
                      type="button"
                      className={styles.editAction}
                      onClick={() => handleEditClick(item)}
                      aria-label={`Редактировать ${item.name}`}
                    >
                      <Edit />
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      className={styles.deleteAction}
                      onClick={() => handleDeleteClick(item)}
                      aria-label={`Удалить ${item.name}`}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Building2 />
            </div>

            <h2>ЖК не найдены</h2>

            <p>
              По вашему запросу ничего не найдено. Попробуйте изменить параметры
              поиска.
            </p>
          </div>
        )}

        {/* =========================================================
            DELETE MODAL
        ========================================================= */}

        <DeleteModal
          isOpen={Boolean(deleteComplex)}
          title="Удалить жилой комплекс?"
          description={
            deleteComplex
              ? `Вы действительно хотите удалить «${deleteComplex.name}»? Это действие нельзя будет отменить.`
              : ""
          }
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
        />

        {/* =========================================================
            EDIT MODAL
        ========================================================= */}

        {editComplex && (
          <div className={styles.editModalOverlay} onMouseDown={closeEditModal}>
            <div
              className={styles.editModal}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* MODAL HEADER */}

              <div className={styles.editModalHeader}>
                <div>
                  <span className={styles.editModalEyebrow}>
                    <Edit />
                    Редактирование
                  </span>

                  <h2>Изменить жилой комплекс</h2>

                  <p>Обновите информацию о «{editComplex.name}».</p>
                </div>

                <button
                  type="button"
                  className={styles.editModalClose}
                  onClick={closeEditModal}
                  aria-label="Закрыть"
                >
                  <X />
                </button>
              </div>

              {/* MODAL BODY */}

              <div className={styles.editModalBody}>
                <div className={styles.editGrid}>
                  {/* NAME */}

                  <div
                    className={`${styles.editField} ${styles.editFieldFull}`}
                  >
                    <label>
                      Название ЖК <span>*</span>
                    </label>

                    <div className={styles.editInput}>
                      <Building2 />

                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        placeholder="Название ЖК"
                      />
                    </div>
                  </div>

                  {/* ADDRESS */}

                  <div
                    className={`${styles.editField} ${styles.editFieldFull}`}
                  >
                    <label>
                      Адрес <span>*</span>
                    </label>

                    <div className={styles.editInput}>
                      <MapPin />

                      <input
                        name="address"
                        value={editForm.address}
                        onChange={handleEditChange}
                        placeholder="Адрес"
                      />
                    </div>
                  </div>

                  {/* STATUS */}

                  <div className={styles.editField}>
                    <label>Статус</label>

                    <CustomSelectBlack
                      icon={TrendingUp}
                      title="Статус"
                      options={editStatusOptions}
                      value={editForm.status}
                      setValue={(value) => setEditField("status", value)}
                    />
                  </div>

                  {/* CLASS */}

                  <div className={styles.editField}>
                    <label>Класс жилья</label>

                    <CustomSelectBlack
                      icon={Building2}
                      title="Класс"
                      options={classOptions}
                      value={editForm.class}
                      setValue={(value) => setEditField("class", value)}
                    />
                  </div>

                  {/* DATE */}

                  <div className={styles.editField}>
                    <label>Дата сдачи</label>

                    <div className={styles.editInput}>
                      <CalendarDays />

                      <input
                        type="date"
                        name="completionDate"
                        value={editForm.completionDate}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>

                  {/* FLOORS */}

                  <div className={styles.editField}>
                    <label>Количество этажей</label>

                    <div className={styles.editInput}>
                      <Layers3 />

                      <input
                        type="number"
                        name="floors"
                        min="1"
                        value={editForm.floors}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>

                  {/* APARTMENTS */}

                  <div className={styles.editField}>
                    <label>Количество квартир</label>

                    <div className={styles.editInput}>
                      <Home />

                      <input
                        type="number"
                        name="apartments"
                        min="0"
                        value={editForm.apartments}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>

                  {/* PARKING */}

                  <div className={styles.editField}>
                    <label>Парковочных мест</label>

                    <div className={styles.editInput}>
                      <span className={styles.editInputSimpleIcon}>P</span>

                      <input
                        type="number"
                        name="parking"
                        min="0"
                        value={editForm.parking}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>

                  {/* AREA */}

                  <div className={styles.editField}>
                    <label>Площадь территории, м²</label>

                    <div className={styles.editInput}>
                      <Layers3 />

                      <input
                        type="number"
                        name="area"
                        min="0"
                        value={editForm.area}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}

              <div className={styles.editModalFooter}>
                <button
                  type="button"
                  className={styles.editCancel}
                  onClick={closeEditModal}
                >
                  Отмена
                </button>

                <button
                  type="button"
                  className={styles.editSave}
                  onClick={saveEdit}
                >
                  <Save />
                  Сохранить изменения
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
