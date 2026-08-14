"use client";

import Image from "next/image";
import {
  Building2,
  CalendarDays,
  ChevronRight,
  Edit,
  Eye,
  Home,
  Layers3,
  MapPin,
  MoreVertical,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./ResidentialComplexes.module.css";
import CustomSelectBlack from "@/components/ui/customSelectBlack/CustomSelectBlack";

const complexes = [
  {
    id: 1,
    name: "ЖК Ала-Тоо",
    address: "ул. Токтогула, 125, Бишкек",
    status: "Строительство",
    class: "Бизнес",
    completionDate: "2027-09-01",
    completionLabel: "Сентябрь 2027",
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
    completionDate: "2028-05-01",
    completionLabel: "Май 2028",
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
    completionDate: "2025-11-01",
    completionLabel: "Ноябрь 2025",
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
    completionDate: "2029-03-01",
    completionLabel: "Март 2029",
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

const statusClass = {
  Проект: "project",
  Строительство: "construction",
  Сдан: "completed",
};

export default function ResidentialComplexes() {
  const router = useRouter();

  const [status, setStatus] = useState("Все статусы");
  const [search, setSearch] = useState("");

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
  }, [status, search]);

  const totalApartments = complexes.reduce(
    (sum, item) => sum + item.apartments,
    0,
  );

  const totalSold = complexes.reduce((sum, item) => sum + item.sold, 0);

  const constructionCount = complexes.filter(
    (item) => item.status === "Строительство",
  ).length;

  function handleDelete(id) {
    const item = complexes.find((complex) => complex.id === id);

    if (!item) return;

    const confirmed = window.confirm(
      `Удалить «${item.name}»?\n\nЭто действие нельзя будет отменить.`,
    );

    if (!confirmed) return;

    console.log("Удаление ЖК:", id);

    // Здесь потом:
    // await api.delete(`/residential-complexes/${id}`);
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}

        <header className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.eyebrow}>
              <Building2 />
              Кабинет застройщика
            </span>

            <h1>Мои жилые комплексы</h1>

            <p>
              Управляйте своими ЖК, следите за строительством и обновляйте
              информацию для покупателей.
            </p>
          </div>

          <button
            type="button"
            className={styles.addButton}
            onClick={() => router.push("/add-residential-complex")}
          >
            <Plus />
            Добавить ЖК
          </button>
        </header>

        {/* OVERVIEW */}

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

        {/* FILTERS */}

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

        {/* RESULT */}

        <div className={styles.resultRow}>
          <div>
            <span>Ваши проекты</span>
            <strong>{filteredComplexes.length}</strong>
          </div>

          <span className={styles.resultHint}>
            Управляйте каждым жилым комплексом отдельно
          </span>
        </div>

        {/* GRID */}

        {filteredComplexes.length > 0 ? (
          <section className={styles.grid}>
            {filteredComplexes.map((item) => {
              const soldPercent =
                item.apartments > 0
                  ? Math.round((item.sold / item.apartments) * 100)
                  : 0;

              return (
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
                        console.log("Меню ЖК:", item.id);
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

                    {/* SALES */}

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
                          router.push(`/residential-complexes/${item.id}`)
                        }
                      >
                        <Eye />
                        Подробнее
                      </button>

                      <button
                        type="button"
                        className={styles.editAction}
                        onClick={() =>
                          router.push(`/residential-complexes/${item.id}/edit`)
                        }
                      >
                        <Edit />
                      </button>

                      <button
                        type="button"
                        className={styles.deleteAction}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
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
      </div>
    </main>
  );
}
