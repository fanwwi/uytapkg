"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  X,
  Check,
  Loader2,
  Phone,
  Megaphone,
  Crown,
  ArrowUp,
  User,
  Package,
  Pencil,
  CalendarDays,
  RotateCcw,
} from "lucide-react";

import styles from "./Tarrifs.module.css";
import AddTariffModal from "./AddTarrifModal/AddTarrifModal";
import EditTariffModal from "./EditTarrifModal/EditTarrifModal";
import Sidebar from "../components/Sidebar/Sidebar";

const MOCK_TARIFFS = [
  {
    id: 1,
    name: "Premium",
    userId: 101,
    userName: "Азизбек Маматов",
    phone: "+996 555 123 456",
    activeListings: 15,
    vipBoosts: 8,
    topBoosts: 5,
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    isActive: true,
  },
  {
    id: 2,
    name: "Business",
    userId: 102,
    userName: "Нурбек Садыков",
    phone: "+996 700 456 789",
    activeListings: 30,
    vipBoosts: 15,
    topBoosts: 10,
    startDate: "2026-08-10",
    endDate: "2026-09-10",
    isActive: true,
  },
  {
    id: 3,
    name: "Start",
    userId: 103,
    userName: "Айдана Токтосунова",
    phone: "+996 777 321 654",
    activeListings: 5,
    vipBoosts: 2,
    topBoosts: 1,
    startDate: "2026-07-15",
    endDate: "2026-08-15",
    isActive: false,
  },
  {
    id: 4,
    name: "Premium",
    userId: 104,
    userName: "Бекзат Абдрахманов",
    phone: "+996 550 987 321",
    activeListings: 20,
    vipBoosts: 10,
    topBoosts: 7,
    startDate: "2026-08-20",
    endDate: "2026-09-20",
    isActive: true,
  },
];

const getDefaultDates = () => {
  const start = new Date();
  const end = new Date();

  end.setDate(end.getDate() + 30);

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const normalizeSearch = (value) => {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
};

const normalizePhone = (value) => {
  return value.replace(/\D/g, "");
};

export default function Tarrifs() {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");

  // Только тариф, который сейчас редактируется
  const [editingTariff, setEditingTariff] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTariffs(MOCK_TARIFFS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  /*
   * ---------------------------------------------------------
   * SEARCH
   * ---------------------------------------------------------
   */

  const filteredTariffs = useMemo(() => {
    const value = normalizeSearch(search);

    if (!value) {
      return tariffs;
    }

    const phoneSearch = normalizePhone(value);

    return tariffs.filter((tariff) => {
      const name = normalizeSearch(tariff.userName || tariff.user?.name || "");

      const tariffName = normalizeSearch(tariff.name || "");

      const phone = normalizePhone(tariff.phone || tariff.user?.phone || "");

      const matchesName = name.includes(value) || tariffName.includes(value);

      const matchesPhone =
        phoneSearch.length > 0 && phone.includes(phoneSearch);

      return matchesName || matchesPhone;
    });
  }, [tariffs, search]);

  /*
   * ---------------------------------------------------------
   * CREATE
   * ---------------------------------------------------------
   */

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTariff = async (tariff) => {
    const defaultDates = getDefaultDates();

    const newTariff = {
      id: Date.now(),
      ...tariff,
      startDate: tariff.startDate || defaultDates.startDate,
      endDate: tariff.endDate || defaultDates.endDate,
      isActive: true,
    };

    setTariffs((prev) => [newTariff, ...prev]);
  };

  /*
   * ---------------------------------------------------------
   * TOGGLE
   * ---------------------------------------------------------
   */

  const toggleTariff = (tariff) => {
    setTariffs((prev) =>
      prev.map((item) =>
        item.id === tariff.id
          ? {
              ...item,
              isActive: !item.isActive,
            }
          : item,
      ),
    );
  };

  /*
   * ---------------------------------------------------------
   * EDIT MODAL
   * ---------------------------------------------------------
   */

  const openEditModal = (tariff) => {
    setEditingTariff(tariff);
  };

  const closeEditModal = () => {
    setEditingTariff(null);
  };

  const handleUpdateTariff = (updatedTariff) => {
    setTariffs((prev) =>
      prev.map((item) =>
        item.id === updatedTariff.id
          ? {
              ...item,
              ...updatedTariff,
            }
          : item,
      ),
    );

    closeEditModal();
  };

  /*
   * ---------------------------------------------------------
   * RESET SEARCH
   * ---------------------------------------------------------
   */

  const clearSearch = () => {
    setSearch("");
  };

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <div className={styles.page}>
      <Sidebar />

      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.eyebrow}>ADMINISTRATION</div>

            <h1 className={styles.title}>Управление тарифами</h1>

            <p className={styles.subtitle}>
              Управляйте тарифами, выданными пользователям и застройщикам.
            </p>
          </div>

          <button
            type="button"
            className={styles.addButton}
            onClick={openModal}
          >
            <Plus size={20} />
            Добавить тариф
          </button>
        </header>

        {/* SEARCH */}

        <div className={styles.searchSection}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={21} />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по имени или номеру телефона..."
              className={styles.searchInput}
            />

            {search && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={clearSearch}
                aria-label="Очистить поиск"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className={styles.searchInfo}>
            {search ? (
              <>
                Найдено: <strong>{filteredTariffs.length}</strong>
              </>
            ) : (
              <>
                Всего тарифов: <strong>{tariffs.length}</strong>
              </>
            )}
          </div>
        </div>

        {/* STATS */}

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Package size={23} />
            </div>

            <div>
              <span className={styles.statLabel}>Всего тарифов</span>

              <strong className={styles.statValue}>{tariffs.length}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Check size={23} />
            </div>

            <div>
              <span className={styles.statLabel}>Активные</span>

              <strong className={styles.statValue}>
                {tariffs.filter((item) => item.isActive).length}
              </strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Megaphone size={23} />
            </div>

            <div>
              <span className={styles.statLabel}>Активных объявлений</span>

              <strong className={styles.statValue}>
                {tariffs.reduce(
                  (sum, item) => sum + Number(item.activeListings || 0),
                  0,
                )}
              </strong>
            </div>
          </div>
        </div>

        {/* SECTION */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Мои активные тарифы</h2>

              <p>Все индивидуально выданные тарифы пользователей.</p>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <Loader2 className={styles.spinner} size={28} />

              <span>Загрузка тарифов...</span>
            </div>
          ) : filteredTariffs.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                {search ? <Search size={31} /> : <Package size={31} />}
              </div>

              <h3>{search ? "Ничего не найдено" : "Тарифов пока нет"}</h3>

              <p>
                {search
                  ? "Попробуйте изменить имя или номер телефона."
                  : "Выдайте первый индивидуальный тариф пользователю."}
              </p>

              {search ? (
                <button
                  type="button"
                  className={styles.emptyButton}
                  onClick={clearSearch}
                >
                  <RotateCcw size={18} />
                  Сбросить поиск
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.emptyButton}
                  onClick={openModal}
                >
                  <Plus size={19} />
                  Добавить тариф
                </button>
              )}
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredTariffs.map((tariff) => (
                <article
                  key={tariff.id}
                  className={`${styles.tariffCard} ${
                    !tariff.isActive ? styles.tariffDisabled : ""
                  }`}
                >
                  {/* CARD TOP */}

                  <div className={styles.cardTop}>
                    <div className={styles.packageIcon}>
                      <Package size={24} />
                    </div>

                    <div className={styles.statusWrapper}>
                      <span
                        className={`${styles.status} ${
                          tariff.isActive
                            ? styles.statusActive
                            : styles.statusInactive
                        }`}
                      >
                        <span className={styles.statusDot} />

                        {tariff.isActive ? "Активен" : "Неактивен"}
                      </span>

                      <button
                        type="button"
                        className={`${styles.switch} ${
                          tariff.isActive ? styles.switchActive : ""
                        }`}
                        onClick={() => toggleTariff(tariff)}
                        aria-label={
                          tariff.isActive
                            ? "Отключить тариф"
                            : "Активировать тариф"
                        }
                      >
                        <span />
                      </button>
                    </div>
                  </div>

                  {/* NAME */}

                  <div className={styles.tariffNameRow}>
                    <div className={styles.tariffName}>{tariff.name}</div>

                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => openEditModal(tariff)}
                    >
                      <Pencil size={16} />
                      Изменить
                    </button>
                  </div>

                  {/* USER */}

                  <div className={styles.user}>
                    <div className={styles.userIcon}>
                      <User size={19} />
                    </div>

                    <div className={styles.userInfo}>
                      <span className={styles.userLabel}>Тариф выдан</span>

                      <strong>
                        {tariff.userName || tariff.user?.name || "Пользователь"}
                      </strong>

                      <span className={styles.phone}>
                        <Phone size={15} />

                        {tariff.phone || tariff.user?.phone || "—"}
                      </span>
                    </div>
                  </div>

                  {/* PERIOD */}

                  <div className={styles.period}>
                    <div className={styles.periodIcon}>
                      <CalendarDays size={17} />
                    </div>

                    <div className={styles.periodContent}>
                      <span className={styles.periodLabel}>
                        Период действия
                      </span>

                      <strong>
                        {formatDate(tariff.startDate)} —{" "}
                        {formatDate(tariff.endDate)}
                      </strong>
                    </div>
                  </div>

                  <div className={styles.divider} />

                  {/* FEATURES */}

                  <div className={styles.features}>
                    <div className={styles.feature}>
                      <div className={styles.featureIcon}>
                        <Megaphone size={19} />
                      </div>

                      <div>
                        <strong>{tariff.activeListings ?? 0}</strong>

                        <span>
                          активных
                          <br />
                          объявлений
                        </span>
                      </div>
                    </div>

                    <div className={styles.feature}>
                      <div className={styles.featureIcon}>
                        <Crown size={19} />
                      </div>

                      <div>
                        <strong>{tariff.vipBoosts ?? 0}</strong>

                        <span>
                          поднятий
                          <br />в VIP
                        </span>
                      </div>
                    </div>

                    <div className={styles.feature}>
                      <div className={styles.featureIcon}>
                        <ArrowUp size={19} />
                      </div>

                      <div>
                        <strong>{tariff.topBoosts ?? 0}</strong>

                        <span>
                          поднятий
                          <br />в TOP
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ADD MODAL */}

      <AddTariffModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateTariff}
      />

      {/* EDIT MODAL */}

      <EditTariffModal
        isOpen={Boolean(editingTariff)}
        tariff={editingTariff}
        onClose={closeEditModal}
        onSubmit={handleUpdateTariff}
      />
    </div>
  );
}
