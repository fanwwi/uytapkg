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
  ListChecks,
  ArrowUp,
} from "lucide-react";

import styles from "./Payments.module.css";
import Sidebar from "../components/Sidebar/Sidebar";
import { getAdminPayments, getPricing, updatePricing } from "@/utils/api";
import { generateReceiptPdf } from "@/utils/generateReceiptPdf";
import ReceiptDocument from "@/app/payment/PaymentReceiptModal/ReceiptDocument";
import PricingEditModal from "./PricingModal/PricingModal";
import CustomSelectBlack from "@/components/ui/CustomSelectBlack/CustomSelectBlack";

const TARIFF_OPTIONS = [
  "Все тарифы",
  "СТАРТ",
  "ОПТИМАЛЬНЫЙ",
  "БИЗНЕС",
  "VIP-размещение",
  "Поднятие в ТОП",
  "Срочная публикация",
  "Instagram-продвижение",
];

const STATUS_CONFIG = {
  approved: {
    label: "Оплачено",
    icon: CheckCircle2,
    cls: "status_paid",
  },

  processing: {
    label: "Ожидает оплаты",
    icon: Clock3,
    cls: "status_pending",
  },

  pending: {
    label: "Ожидает оплаты",
    icon: Clock3,
    cls: "status_pending",
  },

  canceled: {
    label: "Отменён",
    icon: XCircle,
    cls: "status_canceled",
  },

  failed: {
    label: "Ошибка",
    icon: AlertCircle,
    cls: "status_canceled",
  },
};

const DEFAULT_PRICING = {
  tariffs: {
    start: {
      price: 390,
      activeListings: 3,
      vipLifts: 1,
      topLifts: 3,
    },

    optimal: {
      price: 790,
      activeListings: 10,
      vipLifts: 3,
      topLifts: 7,
    },

    business: {
      price: 1890,
      activeListings: 30,
      vipLifts: 7,
      topLifts: 15,
    },

    developer: {
      mode: "individual",
      value: "",
      activeListings: null,
      vipLifts: null,
      topLifts: null,
    },
  },

  services: {
    vip: 290,
    urgent: 70,
    top: 190,
    instagram: 390,
  },
};

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "—";
  }

  return `${Number(price).toLocaleString("ru-RU")} сом`;
};

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("ru-RU");
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return Number(value).toLocaleString("ru-RU");
};

const formatServicePrice = (price) => {
  return `${Number(price).toLocaleString("ru-RU")} сом`;
};

const getTariffValue = (tariff, field) => {
  if (!tariff) return null;

  /*
   * Поддерживаем и новый формат:
   *
   * start: {
   *   price,
   *   activeListings,
   *   vipLifts,
   *   topLifts
   * }
   *
   * и старый формат:
   *
   * start: 390
   *
   * чтобы страница не падала во время обновления API.
   */

  if (typeof tariff === "object") {
    return tariff[field] ?? null;
  }

  return null;
};

const getTariffPrice = (tariff) => {
  if (typeof tariff === "object") {
    return tariff.price ?? 0;
  }

  return tariff ?? 0;
};

const normalizePricing = (data) => {
  if (!data) {
    return DEFAULT_PRICING;
  }

  /*
   * Новый формат API
   */
  if (
    typeof data.tariffs?.start === "object" ||
    typeof data.tariffs?.optimal === "object" ||
    typeof data.tariffs?.business === "object"
  ) {
    return {
      ...DEFAULT_PRICING,
      ...data,
      tariffs: {
        ...DEFAULT_PRICING.tariffs,
        ...data.tariffs,
      },

      services: {
        ...DEFAULT_PRICING.services,
        ...data.services,
      },
    };
  }

  /*
   * Совместимость со старым API,
   * где start / optimal / business были числами.
   */
  return {
    ...DEFAULT_PRICING,

    ...data,

    tariffs: {
      ...DEFAULT_PRICING.tariffs,

      ...data.tariffs,

      start: {
        ...DEFAULT_PRICING.tariffs.start,
        price: data.tariffs?.start ?? DEFAULT_PRICING.tariffs.start.price,
      },

      optimal: {
        ...DEFAULT_PRICING.tariffs.optimal,
        price: data.tariffs?.optimal ?? DEFAULT_PRICING.tariffs.optimal.price,
      },

      business: {
        ...DEFAULT_PRICING.tariffs.business,
        price: data.tariffs?.business ?? DEFAULT_PRICING.tariffs.business.price,
      },

      developer: {
        ...DEFAULT_PRICING.tariffs.developer,
        ...(data.tariffs?.developer || {}),
      },
    },

    services: {
      ...DEFAULT_PRICING.services,
      ...(data.services || {}),
    },
  };
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [tariffFilter, setTariffFilter] = useState("Все тарифы");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const [pricing, setPricing] = useState(DEFAULT_PRICING);

  const receiptRef = useRef(null);

  /*
   * =========================================================
   * LOAD PAYMENTS
   * =========================================================
   */

  useEffect(() => {
    const token = localStorage.getItem("uytap_token");

    getAdminPayments(token)
      .then((res) => {
        setPayments(res.data || []);

        setStats(
          res.stats || {
            totalRevenue: 0,
            paidCount: 0,
          },
        );
      })
      .catch((err) => {
        console.error("Ошибка загрузки платежей:", err);

        setLoadError(err.message || "Не удалось загрузить платежи");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /*
   * =========================================================
   * LOAD PRICING
   * =========================================================
   */

  useEffect(() => {
    getPricing()
      .then((data) => {
        setPricing(normalizePricing(data));
      })
      .catch((err) => {
        console.error("Ошибка загрузки цен:", err);
      });
  }, []);

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
        (payment.orderId || "").toLowerCase().includes(query);

      const matchesTariff =
        tariffFilter === "Все тарифы" || payment.tariffTitle === tariffFilter;

      return matchesSearch && matchesTariff;
    });
  }, [payments, search, tariffFilter]);

  /*
   * =========================================================
   * RECEIPT
   * =========================================================
   */

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
    if (!receiptRef.current || !receiptData || isDownloading) {
      return;
    }

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

  const handleSavePricing = async (nextPricing) => {
    const token = localStorage.getItem("uytap_token");

    const saved = await updatePricing(token, nextPricing);

    setPricing(normalizePricing(saved));
  };

  /*
   * =========================================================
   * DEVELOPER PRICE
   * =========================================================
   */

  const developerMode = pricing.tariffs.developer?.mode;

  const developerValue = pricing.tariffs.developer?.value;

  const developerPrice =
    developerMode === "individual"
      ? "Индивидуально"
      : `${Number(developerValue || 0).toLocaleString("ru-RU")} сом`;

  /*
   * =========================================================
   * TARIFFS
   * =========================================================
   */

  const tariffCards = [
    {
      key: "start",
      title: "СТАРТ",
      icon: Rocket,
      tariff: pricing.tariffs.start,
    },

    {
      key: "optimal",
      title: "ОПТИМАЛЬНЫЙ",
      icon: Crown,
      tariff: pricing.tariffs.optimal,
    },

    {
      key: "business",
      title: "БИЗНЕС",
      icon: Building2,
      tariff: pricing.tariffs.business,
    },
  ];

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
              CURRENT PRICING
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

                  <p>Стоимость тарифов и дополнительные возможности UyTap</p>
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

                <small>Стоимость и доступные возможности</small>
              </div>
            </div>

            <div className={styles.currentPricingGrid}>
              {tariffCards.map(({ key, title, icon: Icon, tariff }) => (
                <div key={key} className={styles.currentPriceCard}>
                  <div className={styles.currentPriceIcon}>
                    <Icon size={18} />
                  </div>

                  <div className={styles.currentPriceContent}>
                    <span>{title}</span>

                    <strong>{formatPrice(getTariffPrice(tariff))}</strong>

                    <small>в месяц</small>
                  </div>

                  <div className={styles.tariffLimits}>
                    <div className={styles.tariffLimit}>
                      <ListChecks size={14} />

                      <div>
                        <span>Активные</span>

                        <strong>
                          {formatNumber(
                            getTariffValue(tariff, "activeListings"),
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className={styles.tariffLimit}>
                      <Crown size={14} />

                      <div>
                        <span>VIP</span>

                        <strong>
                          {formatNumber(getTariffValue(tariff, "vipLifts"))}
                        </strong>
                      </div>
                    </div>

                    <div className={styles.tariffLimit}>
                      <ArrowUp size={14} />

                      <div>
                        <span>TOP</span>

                        <strong>
                          {formatNumber(getTariffValue(tariff, "topLifts"))}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* DEVELOPER */}

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Sparkles size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>ЗАСТРОЙЩИК</span>

                  <strong>{developerPrice}</strong>

                  <small>
                    {developerMode === "individual"
                      ? "особые условия"
                      : "в месяц"}
                  </small>
                </div>

                <div className={styles.tariffLimits}>
                  <div className={styles.tariffLimit}>
                    <ListChecks size={14} />

                    <div>
                      <span>Активные</span>

                      <strong>
                        {formatNumber(
                          getTariffValue(
                            pricing.tariffs.developer,
                            "activeListings",
                          ),
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className={styles.tariffLimit}>
                    <Crown size={14} />

                    <div>
                      <span>VIP</span>

                      <strong>
                        {formatNumber(
                          getTariffValue(pricing.tariffs.developer, "vipLifts"),
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className={styles.tariffLimit}>
                    <ArrowUp size={14} />

                    <div>
                      <span>TOP</span>

                      <strong>
                        {formatNumber(
                          getTariffValue(pricing.tariffs.developer, "topLifts"),
                        )}
                      </strong>
                    </div>
                  </div>
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

                  <strong>{formatServicePrice(pricing.services.vip)}</strong>

                  <small>в день</small>
                </div>
              </div>

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Zap size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>СРОЧНО</span>

                  <strong>{formatServicePrice(pricing.services.urgent)}</strong>

                  <small>в день</small>
                </div>
              </div>

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Rocket size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>ТОП</span>

                  <strong>{formatServicePrice(pricing.services.top)}</strong>

                  <small>в день</small>
                </div>
              </div>

              <div className={styles.currentPriceCard}>
                <div className={styles.currentPriceIcon}>
                  <Camera size={18} />
                </div>

                <div className={styles.currentPriceContent}>
                  <span>INSTAGRAM</span>

                  <strong>
                    {formatServicePrice(pricing.services.instagram)}
                  </strong>

                  <small>за публикацию</small>
                </div>
              </div>
            </div>

            <div className={styles.pricingPanelFooter}>
              <span>Цены и лимиты применяются к новым покупкам и услугам.</span>

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
                <CustomSelectBlack
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

                      <th />
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
                                {(payment.userEmail || "?")
                                  .charAt(0)
                                  .toUpperCase()}
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

                            {payment.type === "promotion" && (
                              <span className={styles.tariffSub}>
                                {payment.listingTitle || "Объявление удалено"}
                              </span>
                            )}
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
                              <strong>
                                {payment.type === "promotion"
                                  ? payment.serviceType === "instagram"
                                    ? "разово"
                                    : `${payment.days} дн.`
                                  : `${payment.months} мес.`}
                              </strong>
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
                      {(selectedPayment.userEmail || "?")
                        .charAt(0)
                        .toUpperCase()}
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

                      <strong>
                        {selectedPayment.type === "promotion"
                          ? selectedPayment.serviceType === "instagram"
                            ? "разово"
                            : `${selectedPayment.days} дн.`
                          : `${selectedPayment.months} мес.`}
                      </strong>
                    </div>

                    {selectedPayment.type === "promotion" && (
                      <div>
                        <span>Объявление</span>

                        <strong>
                          {selectedPayment.listingTitle || "Объявление удалено"}
                        </strong>
                      </div>
                    )}

                    {selectedPayment.type === "promotion" &&
                      selectedPayment.serviceType === "instagram" && (
                        <div>
                          <span>Публикация</span>

                          <strong>
                            {selectedPayment.fulfillmentStatus ===
                            "fulfillment_pending"
                              ? "Ожидает публикации"
                              : selectedPayment.fulfillmentStatus === "applied"
                                ? "Опубликовано"
                                : "—"}
                          </strong>
                        </div>
                      )}

                    <div>
                      <span>ID платежа</span>

                      <strong>{selectedPayment.orderId}</strong>
                    </div>

                    <div>
                      <span>Дата</span>

                      <strong>
                        {formatDate(
                          selectedPayment.paidAt || selectedPayment.createdAt,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Статус</span>

                      <strong>
                        {
                          (
                            STATUS_CONFIG[selectedPayment.status] ||
                            STATUS_CONFIG.pending
                          ).label
                        }
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

          {/* =====================================================
              HIDDEN RECEIPT
          ===================================================== */}

          {receiptData && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: "-9999px",
              }}
            >
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
