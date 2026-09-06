"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Search,
  Users,
  Megaphone,
  Crown,
  ArrowUp,
  X,
  Check,
  Building2,
  User,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import styles from "./Tarrifs.module.css";
import TariffModal from "./TarrifModal/TarrifModal";


const INITIAL_TARIFFS = [
  {
    id: "TRF-001",
    name: "Старт",
    description: "Базовый тариф для активных специалистов",
    activeListings: 10,
    topUps: 3,
    vipUps: 0,
    issuedTo: "Риелторы",
    issuedToId: "role:agent",
    price: 1500,
    duration: 30,
    status: true,
    type: "agent",
  },
  {
    id: "TRF-002",
    name: "Оптимальный",
    description: "Расширенный тариф для профессиональных специалистов",
    activeListings: 20,
    topUps: 5,
    vipUps: 1,
    issuedTo: "Риелторы",
    issuedToId: "role:agent",
    price: 3000,
    duration: 30,
    status: true,
    type: "agent",
  },
  {
    id: "TRF-003",
    name: "Для агентства",
    description: "Тариф для агентств и команд",
    activeListings: 40,
    topUps: 10,
    vipUps: 3,
    issuedTo: "Агентства недвижимости",
    issuedToId: "role:agency",
    price: 6000,
    duration: 30,
    status: true,
    type: "agency",
  },
  {
    id: "TRF-004",
    name: "Индивидуальный",
    description: "Специальный тариф для застройщиков",
    activeListings: 100,
    topUps: 20,
    vipUps: 10,
    issuedTo: "Строительные компании",
    issuedToId: "role:developer",
    price: 15000,
    duration: 30,
    status: false,
    type: "developer",
  },
];

function getTypeIcon(type) {
  if (type === "agency") return Building2;
  if (type === "developer") return Sparkles;

  return User;
}

export default function TariffsPage() {
  const [tariffs, setTariffs] = useState(INITIAL_TARIFFS);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingTariff, setEditingTariff] = useState(null);

  const filteredTariffs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return tariffs;
    }

    return tariffs.filter((tariff) => {
      return (
        tariff.name.toLowerCase().includes(query) ||
        tariff.id.toLowerCase().includes(query) ||
        tariff.issuedTo.toLowerCase().includes(query) ||
        tariff.issuedToId.toLowerCase().includes(query)
      );
    });
  }, [tariffs, search]);

  const activeCount = tariffs.filter((tariff) => tariff.status).length;

  const totalTopUps = tariffs.reduce((sum, tariff) => sum + tariff.topUps, 0);

  const totalVipUps = tariffs.reduce((sum, tariff) => sum + tariff.vipUps, 0);

  function openCreateModal() {
    setEditingTariff(null);
    setModalOpen(true);
  }

  function openEditModal(tariff) {
    setEditingTariff(tariff);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTariff(null);
  }

  function handleSaveTariff(normalizedTariff) {
    if (editingTariff) {
      setTariffs((prev) =>
        prev.map((tariff) =>
          tariff.id === editingTariff.id
            ? {
                ...tariff,
                ...normalizedTariff,
              }
            : tariff,
        ),
      );
    } else {
      const nextNumber =
        Math.max(
          0,
          ...tariffs.map((tariff) => {
            const number = Number(tariff.id.replace("TRF-", ""));

            return Number.isFinite(number) ? number : 0;
          }),
        ) + 1;

      const newTariff = {
        ...normalizedTariff,
        id: `TRF-${String(nextNumber).padStart(3, "0")}`,
        status: true,
      };

      setTariffs((prev) => [newTariff, ...prev]);
    }

    closeModal();
  }

  function toggleTariff(id) {
    setTariffs((prev) =>
      prev.map((tariff) =>
        tariff.id === id
          ? {
              ...tariff,
              status: !tariff.status,
            }
          : tariff,
      ),
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />

      <section className={styles.container}>
        {/* HEADER */}

        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.eyebrow}>
              <ShieldCheck size={15} />
              ADMINISTRATION
            </div>

            <h1>Управление тарифами</h1>

            <p>Мои активные созданные тарифы</p>
          </div>

          <button
            type="button"
            className={styles.createButton}
            onClick={openCreateModal}
          >
            <Plus size={19} />
            Добавить тариф
          </button>
        </header>

        {/* STATS */}

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Crown size={19} />
            </div>

            <div className={styles.statContent}>
              <span>Всего тарифов</span>
              <strong>{tariffs.length}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Check size={19} />
            </div>

            <div className={styles.statContent}>
              <span>Активных тарифов</span>
              <strong>{activeCount}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Megaphone size={19} />
            </div>

            <div className={styles.statContent}>
              <span>Всего TOP поднятий</span>
              <strong>{totalTopUps}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <ArrowUp size={19} />
            </div>

            <div className={styles.statContent}>
              <span>Всего VIP поднятий</span>
              <strong>{totalVipUps}</strong>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}

        <div className={styles.toolbar}>
          <div className={styles.search}>
            <Search size={18} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск тарифа, ID или пользователя..."
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className={styles.clearSearch}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <span className={styles.resultInfo}>
            Показано: <b>{filteredTariffs.length}</b>
          </span>
        </div>

        {/* TABLE */}

        <div className={styles.tableWrapper}>
          <div className={styles.tableHeader}>
            <div>Название тарифа</div>
            <div>Активные объявления</div>
            <div>TOP</div>
            <div>VIP</div>
            <div>Кому выдан</div>
            <div>Статус</div>
            <div />
          </div>

          <div className={styles.tableBody}>
            {filteredTariffs.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <Search size={24} />
                </div>

                <strong>Тарифы не найдены</strong>

                <span>Попробуйте изменить поисковый запрос</span>
              </div>
            ) : (
              filteredTariffs.map((tariff) => {
                const TypeIcon = getTypeIcon(tariff.type);

                return (
                  <div className={styles.tariffRow} key={tariff.id}>
                    {/* NAME */}

                    <div className={styles.nameCell}>
                      <div className={styles.tariffIcon}>
                        <Crown size={18} />
                      </div>

                      <div>
                        <strong>{tariff.name}</strong>

                        <span>
                          {tariff.id}
                          {" · "}
                          {tariff.price.toLocaleString("ru-RU")}
                          {" сом"}
                        </span>
                      </div>
                    </div>

                    {/* LISTINGS */}

                    <div className={styles.numberCell}>
                      <strong>{tariff.activeListings}</strong>
                      <span>объектов</span>
                    </div>

                    {/* TOP */}

                    <div className={styles.numberCell}>
                      <strong>{tariff.topUps}</strong>
                      <span>поднятий</span>
                    </div>

                    {/* VIP */}

                    <div className={styles.numberCell}>
                      <strong>{tariff.vipUps}</strong>
                      <span>поднятий</span>
                    </div>

                    {/* ISSUED */}

                    <div className={styles.issuedCell}>
                      <div className={styles.userIcon}>
                        <TypeIcon size={16} />
                      </div>

                      <div>
                        <strong>{tariff.issuedTo}</strong>
                        <span>{tariff.issuedToId}</span>
                      </div>
                    </div>

                    {/* STATUS */}

                    <div>
                      <button
                        type="button"
                        className={`${styles.switch} ${
                          tariff.status ? styles.switchActive : ""
                        }`}
                        onClick={() => toggleTariff(tariff.id)}
                        aria-label={
                          tariff.status
                            ? "Деактивировать тариф"
                            : "Активировать тариф"
                        }
                      >
                        <span />
                      </button>
                    </div>

                    {/* EDIT */}

                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => openEditModal(tariff)}
                      >
                        <Pencil size={16} />
                        Изменить
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className={styles.footer}>
          <div>
            <Users size={16} />

            <span>
              Управление тарифами определяет доступные пользователю лимиты и
              возможности размещения.
            </span>
          </div>

          <span>
            Активных: <b>{activeCount}</b> / {tariffs.length}
          </span>
        </div>
      </section>

      {/* MODAL */}

      {modalOpen && (
        <TariffModal
          tariff={editingTariff}
          onClose={closeModal}
          onSave={handleSaveTariff}
        />
      )}
    </main>
  );
}
