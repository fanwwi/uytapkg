"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Loader2,
  Pencil,
  Search,
  UserRound,
  Users,
} from "lucide-react";


import EditDataModal from "./EditDataModal/EditDataModal";

import styles from "./DefaultTarrifs.module.css";
import Sidebar from "../components/Sidebar/Sidebar";

import {
  getDefaultTariffs,
  toggleDefaultTariff as toggleDefaultTariffRequest,
  updateDefaultTariffPeriod,
} from "@/utils/api";

const TARIFF_CONFIG = {
  start: {
    label: "Start",
    color: "#60a5fa",
  },
  optimal: {
    label: "Optimal",
    color: "#a78bfa",
  },
  business: {
    label: "Business",
    color: "#f59e0b",
  },
};

const FALLBACK_TARIFF = { label: "—", color: "#94a3b8" };

const formatDate = (date) => {
  if (!date) return "—";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) return date;

  return `${day}.${month}.${year}`;
};

export default function DefaultTarrifs() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [savingPeriod, setSavingPeriod] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("uytap_token");

    getDefaultTariffs(token)
      .then((data) => {
        setUsers(data || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки тарифов:", err);
        setLoadError(err.message || "Не удалось загрузить тарифы");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        (user.email || "").toLowerCase().includes(query) ||
        (user.phone || "").toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  const activeUsers = users.filter((user) => user.active).length;

  const tariffStats = Object.entries(TARIFF_CONFIG).map(([key, config]) => ({
    key,
    ...config,
    count: users.filter((user) => user.tariff === key).length,
  }));

  const updateUser = (id, updates) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              ...updates,
            }
          : user,
      ),
    );
  };

  const toggleUser = async (id) => {
    const token = localStorage.getItem("uytap_token");

    try {
      const updated = await toggleDefaultTariffRequest(token, id);
      updateUser(id, { active: updated.active });
    } catch (err) {
      console.error("Ошибка изменения статуса тарифа:", err);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  const handleSavePeriod = async ({ startDate, endDate }) => {
    if (!editingUser) return;

    const token = localStorage.getItem("uytap_token");

    try {
      setSavingPeriod(true);

      const updated = await updateDefaultTariffPeriod(token, editingUser.id, {
        startDate,
        endDate,
      });

      updateUser(editingUser.id, {
        startDate: updated.startDate,
        endDate: updated.endDate,
      });

      setEditingUser(null);
    } catch (err) {
      console.error("Ошибка изменения периода тарифа:", err);
    } finally {
      setSavingPeriod(false);
    }
  };

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <div className={styles.eyebrow}>TARIFF MANAGEMENT</div>

            <h1 className={styles.title}>Дефолтные тарифы</h1>

            <p className={styles.subtitle}>
              Управление тарифами и периодами подписки пользователей
            </p>
          </div>
        </div>

        {/* INFO */}
        <section className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <CalendarDays size={20} />
          </div>

          <div>
            <h3>Управление периодом тарифа</h3>

            <p>
              Вы можете изменить даты действия тарифа или быстро продлить
              текущий период на неделю, месяц или три месяца.
            </p>
          </div>
        </section>

        {/* STATS */}
        <section className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users size={18} />
            </div>

            <div className={styles.statContent}>
              <span className={styles.statLabel}>Всего пользователей</span>

              <strong className={styles.statValue}>{users.length}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CheckCircle2 size={18} />
            </div>

            <div className={styles.statContent}>
              <span className={styles.statLabel}>Активных</span>

              <strong className={styles.statValue}>{activeUsers}</strong>
            </div>
          </div>

          {tariffStats.map((tariff) => (
            <div className={styles.statCard} key={tariff.key}>
              <div
                className={styles.statIcon}
                style={{
                  color: tariff.color,
                }}
              >
                <CreditCard size={18} />
              </div>

              <div className={styles.statContent}>
                <span className={styles.statLabel}>{tariff.label}</span>

                <strong className={styles.statValue}>{tariff.count}</strong>
              </div>
            </div>
          ))}
        </section>

        {/* USERS */}
        <section className={styles.usersSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Пользователи</h2>

              <p>{filteredUsers.length} пользователей найдено</p>
            </div>

            <div className={styles.search}>
              <Search size={16} />

              <input
                type="text"
                placeholder="Поиск пользователя..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          {loading && (
            <div className={styles.empty}>
              <Loader2 size={24} className={styles.spinner} />
              <span>Загрузка тарифов...</span>
            </div>
          )}

          {!loading && loadError && (
            <div className={styles.empty}>
              <span>{loadError}</span>
            </div>
          )}

          {!loading && !loadError && (
            <>
          {/* DESKTOP */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Контакты</th>
                  <th>Тариф</th>
                  <th>Текущий период</th>
                  <th>Изменить период</th>
                  <th>Статус</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => {
                  const tariff = TARIFF_CONFIG[user.tariff] || FALLBACK_TARIFF;

                  return (
                    <tr key={user.id}>
                      {/* USER */}
                      <td>
                        <div className={styles.user}>
                          <div className={styles.avatar}>
                            <UserRound size={17} />
                          </div>

                          <div className={styles.userInfo}>
                            <strong>{user.name}</strong>
                          </div>
                        </div>
                      </td>

                      {/* CONTACTS */}
                      <td>
                        <div className={styles.contacts}>
                          <span>{user.email}</span>
                          <span>{user.phone}</span>
                        </div>
                      </td>

                      {/* TARIFF */}
                      <td>
                        <div
                          className={styles.tariff}
                          style={{
                            "--tariff-color": tariff.color,
                          }}
                        >
                          <span className={styles.tariffDot} />

                          <span>{tariff.label}</span>
                        </div>
                      </td>

                      {/* PERIOD */}
                      <td>
                        <div className={styles.period}>
                          <span>{formatDate(user.startDate)}</span>

                          <span className={styles.periodSeparator}>→</span>

                          <span>{formatDate(user.endDate)}</span>
                        </div>
                      </td>

                      {/* EDIT */}
                      <td>
                        <button
                          type="button"
                          className={styles.editButton}
                          onClick={() => openEditModal(user)}
                        >
                          <Pencil size={14} />
                          Изменить
                        </button>
                      </td>

                      {/* STATUS */}
                      <td>
                        <button
                          type="button"
                          className={`${styles.status} ${
                            user.active
                              ? styles.statusActive
                              : styles.statusInactive
                          }`}
                          onClick={() => toggleUser(user.id)}
                        >
                          <span />

                          {user.active ? "Активен" : "Неактивен"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className={styles.mobileList}>
            {filteredUsers.map((user) => {
              const tariff = TARIFF_CONFIG[user.tariff];

              return (
                <div className={styles.mobileCard} key={user.id}>
                  <div className={styles.mobileTop}>
                    <div className={styles.user}>
                      <div className={styles.avatar}>
                        <UserRound size={17} />
                      </div>

                      <div className={styles.userInfo}>
                        <strong>{user.name}</strong>

                        <span>{user.email}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`${styles.status} ${
                        user.active
                          ? styles.statusActive
                          : styles.statusInactive
                      }`}
                      onClick={() => toggleUser(user.id)}
                    >
                      <span />

                      {user.active ? "Активен" : "Неактивен"}
                    </button>
                  </div>

                  <div className={styles.mobileContacts}>
                    <span>{user.phone}</span>
                  </div>

                  <div
                    className={styles.mobileTariff}
                    style={{
                      "--tariff-color": tariff.color,
                    }}
                  >
                    <span className={styles.tariffDot} />

                    <span>{tariff.label}</span>
                  </div>

                  <div className={styles.mobilePeriod}>
                    <div>
                      <span>НАЧАЛО</span>
                      <strong>{formatDate(user.startDate)}</strong>
                    </div>

                    <div className={styles.mobilePeriodArrow}>→</div>

                    <div>
                      <span>ОКОНЧАНИЕ</span>
                      <strong>{formatDate(user.endDate)}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.mobileEditButton}
                    onClick={() => openEditModal(user)}
                  >
                    <Pencil size={14} />
                    Изменить период
                  </button>
                </div>
              );
            })}
          </div>

          {filteredUsers.length === 0 && (
            <div className={styles.empty}>
              <Search size={24} />

              <span>Пользователи не найдены</span>
            </div>
          )}
            </>
          )}
        </section>
      </main>

      {/* EDIT MODAL */}
      <EditDataModal
        isOpen={Boolean(editingUser)}
        saving={savingPeriod}
        user={editingUser}
        onClose={closeEditModal}
        onSave={handleSavePeriod}
      />
    </div>
  );
}
