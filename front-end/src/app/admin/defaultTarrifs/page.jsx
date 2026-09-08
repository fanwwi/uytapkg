"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Pencil,
  Search,
  UserRound,
  Users,
} from "lucide-react";


import EditDataModal from "./EditDataModal/EditDataModal";

import styles from "./DefaultTarrifs.module.css";
import Sidebar from "../components/Sidebar/Sidebar";

const TARIFF_CONFIG = {
  start: {
    label: "Start",
    color: "#60a5fa",
    price: "500 сом",
  },
  optimal: {
    label: "Optimal",
    color: "#a78bfa",
    price: "1 000 сом",
  },
  business: {
    label: "Business",
    color: "#f59e0b",
    price: "2 000 сом",
  },
};

const DEFAULT_USERS = [
  {
    id: 1,
    name: "Асанов Бекзат",
    email: "bekzat@gmail.com",
    phone: "+996 700 123 456",
    tariff: "optimal",
    startDate: "2026-08-01",
    endDate: "2026-09-01",
    active: true,
  },
  {
    id: 2,
    name: "Иванова Алина",
    email: "alina@gmail.com",
    phone: "+996 555 234 567",
    tariff: "start",
    startDate: "2026-08-10",
    endDate: "2026-09-10",
    active: true,
  },
  {
    id: 3,
    name: "Токтогулов Эльдар",
    email: "eldar@gmail.com",
    phone: "+996 777 345 678",
    tariff: "business",
    startDate: "2026-07-15",
    endDate: "2026-10-15",
    active: true,
  },
  {
    id: 4,
    name: "Садыкова Айдана",
    email: "aidana@gmail.com",
    phone: "+996 701 456 789",
    tariff: "optimal",
    startDate: "2026-08-05",
    endDate: "2026-09-05",
    active: false,
  },
  {
    id: 5,
    name: "Маматов Нурсултан",
    email: "nursultan@gmail.com",
    phone: "+996 550 567 890",
    tariff: "start",
    startDate: "2026-08-20",
    endDate: "2026-09-20",
    active: true,
  },
];

const formatDate = (date) => {
  if (!date) return "—";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) return date;

  return `${day}.${month}.${year}`;
};

export default function DefaultTarrifs() {
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query)
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

  const toggleUser = (id) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              active: !user.active,
            }
          : user,
      ),
    );
  };

  const openEditModal = (user) => {
    setEditingUser(user);
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  const handleSavePeriod = ({ startDate, endDate }) => {
    if (!editingUser) return;

    updateUser(editingUser.id, {
      startDate,
      endDate,
    });

    setEditingUser(null);
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
                  const tariff = TARIFF_CONFIG[user.tariff];

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

                    <span className={styles.mobilePrice}>{tariff.price}</span>
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
        </section>
      </main>

      {/* EDIT MODAL */}
      <EditDataModal
        isOpen={Boolean(editingUser)}
        user={editingUser}
        onClose={closeEditModal}
        onSave={handleSavePeriod}
      />
    </div>
  );
}
