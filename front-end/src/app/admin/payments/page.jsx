"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  LoaderCircle,
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
import CustomSelect from "@/components/ui/customSelect/CustomSelect";
import Sidebar from "../components/Sidebar/Sidebar";
import { getAdminPayments } from "@/utils/api";
import { generateReceiptPdf } from "@/utils/generateReceiptPdf";
import ReceiptDocument from "@/app/payment/PaymentReceiptModal/ReceiptDocument";
import PricingEditModal from "./PricingModal/PricingModal";

const TARIFF_OPTIONS = ["Все тарифы", "СТАРТ", "ОПТИМАЛЬНЫЙ", "БИЗНЕС"];

const STATUS_CONFIG = {
  approved: { label: "Оплачено", icon: CheckCircle2, cls: "status_paid" },
  processing: { label: "Ожидает оплаты", icon: Clock3, cls: "status_pending" },
  pending: { label: "Ожидает оплаты", icon: Clock3, cls: "status_pending" },
  canceled: { label: "Отменён", icon: XCircle, cls: "status_canceled" },
  failed: { label: "Ошибка", icon: AlertCircle, cls: "status_canceled" },
};

const formatPrice = (price) => {
  return `${Number(price).toLocaleString("ru-RU")} сом`;
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("ru-RU");
};

const formatServicePrice = (price, suffix) => {
  return `${Number(price).toLocaleString("ru-RU")} сом ${suffix}`;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, paidCount: 0 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [tariffFilter, setTariffFilter] = useState("Все тарифы");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const receiptRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("uytap_token");

    getAdminPayments(token)
      .then((res) => {
        setPayments(res.data || []);
        setStats(res.stats || { totalRevenue: 0, paidCount: 0 });
      })
      .catch((err) => {
        console.error("Ошибка загрузки платежей:", err);
        setLoadError(err.message || "Не удалось загрузить платежи");
      })
      .finally(() => setLoading(false));
  }, []);

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

    return payments.filter((payment) => {
      const matchesSearch =
        !query ||
        (payment.userEmail || "").toLowerCase().includes(query) ||
        (payment.userPhone || "").toLowerCase().includes(query) ||
        payment.orderId.toLowerCase().includes(query);

      const matchesTariff =
        tariffFilter === "Все тарифы" || payment.tariffTitle === tariffFilter;

      return matchesSearch && matchesTariff;
    });
  }, [payments, search, tariffFilter]);

  const receiptData = selectedPayment
    ? {
        tariff: selectedPayment.tariffTitle,
        price: selectedPayment.pricePerMonth ?? selectedPayment.amount,
        months: selectedPayment.months,
        discount: selectedPayment.discountPercent || 0,
        total: selectedPayment.amount,
        paymentId: selectedPayment.orderId,
        date: new Date(selectedPayment.paidAt || selectedPayment.createdAt),
      }
    : null;

  const downloadReceipt = async () => {
    if (!receiptRef.current || !receiptData || isDownloading) return;

    try {
      setIsDownloading(true);
      await generateReceiptPdf(receiptRef.current, receiptData);
    } catch (error) {
      console.error("Ошибка создания PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

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

              <strong>{formatPrice(stats.totalRevenue)}</strong>

              <small>По всем оплаченным платежам</small>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <span>Оплаты</span>

                <div className={styles.statIcon}>
                  <CheckCircle2 />
                </div>
              </div>

              <strong>{stats.paidCount}</strong>

              <small>Успешно оплаченных счетов</small>
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

                  <strong>{formatServicePrice(pricing.services.vip, "")}</strong>

                  <small>в день</small>
                </div>
              </div>

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Zap size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>СРОЧНО</span>

                  <strong>{formatServicePrice(pricing.services.urgent, "")}</strong>

                  <small>в день</small>
                </div>
              </div>

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Rocket size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>ТОП</span>

                  <strong>{formatServicePrice(pricing.services.top, "")}</strong>

                  <small>в день</small>
                </div>
              </div>

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Camera size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>INSTAGRAM</span>

                  <strong>{formatServicePrice(pricing.services.instagram, "")}</strong>

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
                  Всего: <b>{filteredPayments.length}</b>
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
                  placeholder="Поиск по email, телефону, ID..."
                />
              </div>

              <div className={styles.customSelect}>
                <CustomSelect
                  icon={Filter}
                  title="Тариф"
                  options={TARIFF_OPTIONS}
                  value={tariffFilter}
                  setValue={setTariffFilter}
                />
              </div>
            </div>

            {/* TABLE */}

            <div className={styles.tableWrapper}>
              {loading ? (
                <div className={styles.empty}>
                  <LoaderCircle className={styles.spin} />
                  <strong>Загружаем платежи...</strong>
                </div>
              ) : loadError ? (
                <div className={styles.empty}>
                  <AlertCircle />
                  <strong>Не удалось загрузить платежи</strong>
                  <span>{loadError}</span>
                </div>
              ) : (
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
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPayments.map((payment) => {
                      const status =
                        STATUS_CONFIG[payment.status] || STATUS_CONFIG.pending;
                      const StatusIcon = status.icon;

                      return (
                        <tr key={payment.orderId}>
                          {/* USER */}
                          <td>
                            <div className={styles.user}>
                              <div className={styles.avatar}>
                                {(payment.userEmail || "?").charAt(0).toUpperCase()}
                              </div>

                              <div>
                                <strong>{payment.userEmail || "—"}</strong>
                                <span>{payment.userPhone || ""}</span>
                              </div>
                            </div>
                          </td>

                          {/* TARIFF */}
                          <td>
                            <span className={styles.tariff}>
                              {payment.tariffTitle}
                            </span>
                          </td>

                          {/* PRICE */}
                          <td>
                            <strong className={styles.price}>
                              {formatPrice(payment.amount)}
                            </strong>
                          </td>

                          {/* PERIOD */}
                          <td>
                            <div className={styles.period}>
                              <strong>{payment.months} мес.</strong>
                            </div>
                          </td>

                          {/* DATE */}
                          <td>
                            <span className={styles.date}>
                              {formatDate(payment.paidAt || payment.createdAt)}
                            </span>
                          </td>

                          {/* RECEIPT */}
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

                          {/* STATUS */}
                          <td>
                            <span
                              className={`${styles.status} ${styles[status.cls]}`}
                            >
                              <StatusIcon />
                              {status.label}
                            </span>
                          </td>

                          {/* MORE */}
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
              )}

              {!loading && !loadError && !filteredPayments.length && (
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

                    <h2>{selectedPayment.userEmail || "Пользователь"}</h2>
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
                      {(selectedPayment.userEmail || "?").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <strong>{selectedPayment.userEmail || "—"}</strong>
                      <span>{selectedPayment.userPhone || ""}</span>
                    </div>
                  </div>

                  <div className={styles.detailsGrid}>
                    <div>
                      <span>Тариф</span>
                      <strong>{selectedPayment.tariffTitle}</strong>
                    </div>

                    <div>
                      <span>Стоимость</span>
                      <strong>{formatPrice(selectedPayment.amount)}</strong>
                    </div>

                    <div>
                      <span>Период</span>
                      <strong>{selectedPayment.months} мес.</strong>
                    </div>

                    <div>
                      <span>ID платежа</span>
                      <strong>{selectedPayment.orderId}</strong>
                    </div>

                    <div>
                      <span>Дата</span>
                      <strong>
                        {formatDate(
                          selectedPayment.paidAt || selectedPayment.createdAt
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Статус</span>

                      <strong>
                        {(STATUS_CONFIG[selectedPayment.status] || STATUS_CONFIG.pending)
                          .label}
                      </strong>
                    </div>
                  </div>

                  {/* RECEIPT */}
                  {selectedPayment.status === "approved" && (
                    <div className={styles.receiptPreview}>
                      <div className={styles.receiptHeader}>
                        <div>
                          <CalendarDays />

                          <span>Чек об оплате</span>
                        </div>

                        <button
                          type="button"
                          onClick={downloadReceipt}
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <LoaderCircle className={styles.spin} />
                          ) : (
                            <Download />
                          )}
                          Скачать
                        </button>
                      </div>

                      <div className={styles.receiptImage}>
                        <div>
                          <CreditCard />
                          <span>Чек сформирован — нажмите «Скачать»</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Скрытый исходник для генерации PDF-чека (html2canvas требует
              реально отрисованный DOM-узел, поэтому не display:none) */}
          {receiptData && (
            <div style={{ position: "fixed", top: 0, left: "-9999px" }}>
              <ReceiptDocument ref={receiptRef} paymentData={receiptData} />
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
