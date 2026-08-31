"use client";

import { useMemo, useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Eye,
  Download,
  CalendarDays,
  Settings2,
  Crown,
  Zap,
  Rocket,
  Building2,
  Sparkles,
  Camera,
} from "lucide-react";

import styles from "./Payments.module.css";
import CustomSelectBlack from "@/components/ui/customSelectBlack/CustomSelectBlack";
import Sidebar from "../components/Sidebar/Sidebar";
import PricingEditModal from "./PricingModal/PricingModal";


const PAYMENTS = [
  {
    id: "PAY-00124",
    user: "Айбек Токтогулов",
    email: "aibek@gmail.com",
    tariff: "Premium",
    price: 2990,
    period: "30 дней",
    startDate: "20.08.2026",
    endDate: "19.09.2026",
    status: "paid",
    receipt: true,
  },
  {
    id: "PAY-00123",
    user: "Нурсултан Б.",
    email: "nursultan@gmail.com",
    tariff: "Business",
    price: 5990,
    period: "30 дней",
    startDate: "19.08.2026",
    endDate: "18.09.2026",
    status: "paid",
    receipt: true,
  },
  {
    id: "PAY-00122",
    user: "ОсОО СтройДом",
    email: "stroydom@gmail.com",
    tariff: "Developer",
    price: 9990,
    period: "90 дней",
    startDate: "18.08.2026",
    endDate: "16.11.2026",
    status: "paid",
    receipt: true,
  },
  {
    id: "PAY-00121",
    user: "Алина К.",
    email: "alina@gmail.com",
    tariff: "Premium",
    price: 2990,
    period: "30 дней",
    startDate: "17.08.2026",
    endDate: "16.09.2026",
    status: "paid",
    receipt: true,
  },
  {
    id: "PAY-00120",
    user: "Эльдар С.",
    email: "eldar@gmail.com",
    tariff: "Basic",
    price: 990,
    period: "30 дней",
    startDate: "16.08.2026",
    endDate: "15.09.2026",
    status: "paid",
    receipt: true,
  },
  {
    id: "PAY-00119",
    user: "Марат Абдрахманов",
    email: "marat@gmail.com",
    tariff: "Business",
    price: 5990,
    period: "30 дней",
    startDate: "15.08.2026",
    endDate: "14.09.2026",
    status: "paid",
    receipt: true,
  },
];

const STATUS_CONFIG = {
  paid: {
    label: "Оплачено",
    icon: CheckCircle2,
  },
};

const formatPrice = (price) => {
  return `${Number(price).toLocaleString("ru-RU")} сом`;
};

const formatServicePrice = (price, suffix) => {
  return `${Number(price).toLocaleString("ru-RU")} сом ${suffix}`;
};

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [tariffFilter, setTariffFilter] = useState("Все тарифы");

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  /*
   * =========================================================
   * CURRENT PRICING
   *
   * Пока хранится локально.
   * После подключения backend эти значения
   * можно загружать через API.
   * =========================================================
   */

  const [pricing, setPricing] = useState({
    tariffs: {
      start: 390,
      optimal: 790,
      business: 1890,

      developer: {
        mode: "individual",
        value: "",
      },
    },

    services: {
      vip: 290,
      urgent: 70,
      top: 190,
      instagram: 390,
    },
  });

  /*
   * =========================================================
   * FILTER PAYMENTS
   * =========================================================
   */

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return PAYMENTS.filter((payment) => {
      const matchesSearch =
        !query ||
        payment.user.toLowerCase().includes(query) ||
        payment.email.toLowerCase().includes(query);

      const matchesTariff =
        tariffFilter === "Все тарифы" || payment.tariff === tariffFilter;

      return matchesSearch && matchesTariff;
    });
  }, [search, tariffFilter]);

  /*
   * =========================================================
   * STATS
   * =========================================================
   */

  const totalRevenue = PAYMENTS.reduce(
    (sum, payment) => sum + payment.price,
    0,
  );

  const paidCount = PAYMENTS.length;

  /*
   * =========================================================
   * SAVE PRICING
   * =========================================================
   */

  const handleSavePricing = (nextPricing) => {
    setPricing(nextPricing);

    console.log("UPDATED PRICING:", nextPricing);

    /*
     * Здесь потом можно подключить API:
     *
     * await updatePricing(token, nextPricing);
     */
  };

  /*
   * =========================================================
   * DEVELOPER PRICE
   * =========================================================
   */

  const developerPrice =
    pricing.tariffs.developer.mode === "individual"
      ? "Индивидуально"
      : `${Number(pricing.tariffs.developer.value).toLocaleString(
          "ru-RU",
        )} сом`;

  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.content}>
        <main className={styles.page}>
          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className={styles.pageHeader}>
            <div className={styles.titleRow}>
              <div className={styles.titleIcon}>
                <CreditCard />
              </div>

              <div>
                <h1>Оплаты</h1>

                <p>Управление платежами, тарифами и услугами</p>
              </div>
            </div>

            <button
              type="button"
              className={styles.pricingButton}
              onClick={() => setIsPricingModalOpen(true)}
            >
              <Settings2 size={17} />

              <span>Изменить цены</span>
            </button>
          </div>

          {/* =====================================================
              STATS
          ===================================================== */}

          <section className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <span>Выручка</span>

                <div className={styles.statIcon}>
                  <CreditCard />
                </div>
              </div>

              <strong>{formatPrice(totalRevenue)}</strong>

              <small>За последние 30 дней</small>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <span>Оплаты</span>

                <div className={styles.statIcon}>
                  <CheckCircle2 />
                </div>
              </div>

              <strong>{paidCount}</strong>

              <small>За последние 30 дней</small>
            </div>
          </section>

          {/* =====================================================
              CURRENT PRICES
          ===================================================== */}

          <section className={styles.pricingPanel}>
            <div className={styles.pricingPanelHeader}>
              <div className={styles.pricingPanelTitle}>
                <div className={styles.pricingPanelIcon}>
                  <Settings2 size={18} />
                </div>

                <div>
                  <span>НАСТРОЙКИ СИСТЕМЫ</span>

                  <h2>Текущие цены</h2>

                  <p>Стоимость тарифов и дополнительных услуг UyTap</p>
                </div>
              </div>

              <button
                type="button"
                className={styles.pricingEditButton}
                onClick={() => setIsPricingModalOpen(true)}
              >
                <Settings2 size={16} />
                Изменить цены
              </button>
            </div>

            {/* =================================================
                TARIFFS
            ================================================= */}

            <div className={styles.pricingGroupTitle}>
              <span>01</span>

              <div>
                <strong>Тарифы</strong>

                <small>Ежемесячная стоимость</small>
              </div>
            </div>

            <div className={styles.currentPricingGrid}>
              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Rocket size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>СТАРТ</span>

                  <strong>
                    {Number(pricing.tariffs.start).toLocaleString("ru-RU")} сом
                  </strong>

                  <small>в месяц</small>
                </div>
              </div>

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Crown size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>ОПТИМАЛЬНЫЙ</span>

                  <strong>
                    {Number(pricing.tariffs.optimal).toLocaleString("ru-RU")}{" "}
                    сом
                  </strong>

                  <small>в месяц</small>
                </div>
              </div>

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Building2 size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>БИЗНЕС</span>

                  <strong>
                    {Number(pricing.tariffs.business).toLocaleString("ru-RU")}{" "}
                    сом
                  </strong>

                  <small>в месяц</small>
                </div>
              </div>

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Sparkles size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>ЗАСТРОЙЩИК</span>

                  <strong>{developerPrice}</strong>

                  <small>
                    {pricing.tariffs.developer.mode === "individual"
                      ? "особые условия"
                      : "в месяц"}
                  </small>
                </div>
              </div>
            </div>

            {/* =================================================
                SERVICES
            ================================================= */}

            <div
              className={`${styles.pricingGroupTitle} ${styles.servicesTitle}`}
            >
              <span>02</span>

              <div>
                <strong>Дополнительные услуги</strong>

                <small>Продвижение и SMM</small>
              </div>
            </div>

            <div className={styles.currentPricingGrid}>
              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Crown size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>VIP</span>

                  <strong>{pricing.services.vip} сом</strong>

                  <small>в день</small>
                </div>
              </div>

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Zap size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>СРОЧНО</span>

                  <strong>{pricing.services.urgent} сом</strong>

                  <small>в день</small>
                </div>
              </div>

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Rocket size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>ТОП</span>

                  <strong>{pricing.services.top} сом</strong>

                  <small>в день</small>
                </div>
              </div>

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Camera size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>INSTAGRAM</span>

                  <strong>{pricing.services.instagram} сом</strong>

                  <small>за публикацию</small>
                </div>
              </div>
            </div>

            <div className={styles.pricingPanelFooter}>
              <span>Цены применяются к новым покупкам и услугам.</span>

              <button
                type="button"
                className={styles.pricingInlineButton}
                onClick={() => setIsPricingModalOpen(true)}
              >
                Настроить
                <Settings2 size={14} />
              </button>
            </div>
          </section>

          {/* =====================================================
              PAYMENT HISTORY
          ===================================================== */}

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>История платежей</h2>

                <p>
                  За последние 30 дней: <b>{filteredPayments.length}</b>
                </p>
              </div>
            </div>

            {/* FILTERS */}

            <div className={styles.filters}>
              <div className={styles.search}>
                <Search />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Поиск по пользователю..."
                />
              </div>

              <div className={styles.customSelect}>
                <CustomSelectBlack
                  icon={Filter}
                  title="Тариф"
                  options={[
                    "Все тарифы",
                    "Basic",
                    "Premium",
                    "Business",
                    "Developer",
                  ]}
                  value={tariffFilter}
                  setValue={setTariffFilter}
                />
              </div>
            </div>

            {/* TABLE */}

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Пользователь</th>

                    <th>Тариф</th>
                    <th>Сумма</th>
                    <th>Период</th>
                    <th>Дата</th>
                    <th>Чек</th>
                    <th>Статус</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map((payment) => {
                    const status = STATUS_CONFIG[payment.status];

                    const StatusIcon = status.icon;

                    return (
                      <tr key={payment.id}>
                        <td>
                          <div className={styles.user}>
                            <div className={styles.avatar}>
                              {payment.user.charAt(0)}
                            </div>

                            <div>
                              <strong>{payment.user}</strong>

                              <span>{payment.email}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className={styles.tariff}>
                            {payment.tariff}
                          </span>
                        </td>

                        <td>
                          <strong className={styles.price}>
                            {formatPrice(payment.price)}
                          </strong>
                        </td>

                        <td>
                          <div className={styles.period}>
                            <strong>{payment.period}</strong>

                            <span>
                              {payment.startDate} — {payment.endDate}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className={styles.date}>
                            {payment.startDate}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className={styles.receiptButton}
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye />
                            Посмотреть
                          </button>
                        </td>

                        <td>
                          <span
                            className={`${styles.status} ${styles.status_paid}`}
                          >
                            <StatusIcon />
                            {status.label}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className={styles.moreButton}
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {!filteredPayments.length && (
                <div className={styles.empty}>
                  <CreditCard />

                  <strong>Платежи не найдены</strong>

                  <span>Попробуйте изменить параметры поиска.</span>
                </div>
              )}
            </div>
          </section>

          {/* =====================================================
              PAYMENT DETAILS MODAL
          ===================================================== */}

          {selectedPayment && (
            <div
              className={styles.overlay}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setSelectedPayment(null);
                }
              }}
            >
              <div className={styles.modal}>
                <div className={styles.modalHeader}>
                  <div>
                    <span>Платёж</span>

                    <h2>{selectedPayment.user}</h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPayment(null)}
                    className={styles.modalClose}
                  >
                    ×
                  </button>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.modalUser}>
                    <div className={styles.modalAvatar}>
                      {selectedPayment.user.charAt(0)}
                    </div>

                    <div>
                      <strong>{selectedPayment.user}</strong>

                      <span>{selectedPayment.email}</span>
                    </div>
                  </div>

                  <div className={styles.detailsGrid}>
                    <div>
                      <span>Тариф</span>

                      <strong>{selectedPayment.tariff}</strong>
                    </div>

                    <div>
                      <span>Стоимость</span>

                      <strong>{formatPrice(selectedPayment.price)}</strong>
                    </div>

                    <div>
                      <span>Период</span>

                      <strong>{selectedPayment.period}</strong>
                    </div>

                    <div>
                      <span>Начало</span>

                      <strong>{selectedPayment.startDate}</strong>
                    </div>

                    <div>
                      <span>Окончание</span>

                      <strong>{selectedPayment.endDate}</strong>
                    </div>

                    <div>
                      <span>Статус</span>

                      <strong>Оплачено</strong>
                    </div>
                  </div>

                  <div className={styles.receiptPreview}>
                    <div className={styles.receiptHeader}>
                      <div>
                        <CalendarDays />

                        <span>Чек об оплате</span>
                      </div>

                      <button type="button">
                        <Download />
                        Скачать
                      </button>
                    </div>

                    <div className={styles.receiptImage}>
                      <div>
                        <CreditCard />

                        <span>Здесь будет изображение чека</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================
              PRICING EDIT MODAL
          ===================================================== */}

          <PricingEditModal
            isOpen={isPricingModalOpen}
            onClose={() => setIsPricingModalOpen(false)}
            values={pricing}
            onSave={handleSavePricing}
          />
        </main>
      </div>
    </div>
  );
}
