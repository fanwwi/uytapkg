"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

import styles from "./Tarrifs.module.css";
import AddTariffModal from "./AddTarrifModal/AddTarrifModal";
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
    isActive: true,
  },
];

export default function Tarrifs() {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTariffs(MOCK_TARIFFS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTariff = async (tariff) => {
    const newTariff = {
      id: Date.now(),
      ...tariff,
      isActive: true,
    };

    setTariffs((prev) => [newTariff, ...prev]);
  };

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

  return (
    <div className={styles.page}>
      <Sidebar />

      <div className={styles.content}>
        <header className={styles.header}>
          <div>
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

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Package size={22} />
            </div>

            <div>
              <span className={styles.statLabel}>Всего тарифов</span>

              <strong className={styles.statValue}>{tariffs.length}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Check size={22} />
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
              <Megaphone size={22} />
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

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Мои активные тарифы</h2>

              <p>Все индивидуально выданные тарифы пользователей.</p>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <Loader2 className={styles.spinner} size={26} />
              <span>Загрузка тарифов...</span>
            </div>
          ) : tariffs.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <Package size={30} />
              </div>

              <h3>Тарифов пока нет</h3>

              <p>Выдайте первый индивидуальный тариф пользователю.</p>

              <button
                type="button"
                className={styles.emptyButton}
                onClick={openModal}
              >
                <Plus size={19} />
                Добавить тариф
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {tariffs.map((tariff) => (
                <article
                  key={tariff.id}
                  className={`${styles.tariffCard} ${
                    !tariff.isActive ? styles.tariffDisabled : ""
                  }`}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.packageIcon}>
                      <Package size={23} />
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

                  <div className={styles.tariffName}>{tariff.name}</div>

                  <div className={styles.user}>
                    <div className={styles.userIcon}>
                      <User size={18} />
                    </div>

                    <div className={styles.userInfo}>
                      <span className={styles.userLabel}>Тариф выдан</span>

                      <strong>
                        {tariff.userName || tariff.user?.name || "Пользователь"}
                      </strong>

                      <span className={styles.phone}>
                        <Phone size={14} />

                        {tariff.phone || tariff.user?.phone || "—"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.divider} />

                  <div className={styles.features}>
                    <div className={styles.feature}>
                      <div className={styles.featureIcon}>
                        <Megaphone size={18} />
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
                        <Crown size={18} />
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
                        <ArrowUp size={18} />
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

      <AddTariffModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateTariff}
      />
    </div>
  );
}
