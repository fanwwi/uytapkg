"use client";

import { useEffect, useRef, useState } from "react";
import { CreditCard, CheckCircle2, Settings2 } from "lucide-react";

import styles from "./Payments.module.css";

import Sidebar from "../components/Sidebar/Sidebar";

import { getAdminPayments, getPricing, updatePricing } from "@/utils/api";

import { generateReceiptPdf } from "@/utils/generateReceiptPdf";

import ReceiptDocument from "@/app/payment/PaymentReceiptModal/ReceiptDocument";
import PricingEditModal from "./PricingModal/PricingModal";
import PaymentHistory from "./PricingHistory/PricingHistory";
import PricingSection from "./PricingSection/PricingSection";


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

const normalizePricing = (data) => {
  if (!data) {
    return DEFAULT_PRICING;
  }

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

  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.content}>
        <main className={styles.page}>
          {/* HEADER */}

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

          {/* STATS */}

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

          {/* PRICING */}

          <PricingSection
            pricing={pricing}
            onOpenPricingModal={() => setIsPricingModalOpen(true)}
          />

          {/* PAYMENT HISTORY */}

          <PaymentHistory
            payments={payments}
            loading={loading}
            loadError={loadError}
            receiptData={receiptData}
            receiptRef={receiptRef}
            isDownloading={isDownloading}
            onDownloadReceipt={downloadReceipt}
          />

          {/* HIDDEN RECEIPT */}

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

          {/* PRICING MODAL */}

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
