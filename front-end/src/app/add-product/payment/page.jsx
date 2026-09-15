"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock3,
  Crown,
  Download,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./Payment.module.css";
import ServiceReceiptModal from "./ServiceReceiptModal/ServiceReceiptModal";

const SERVICES = {
  vip: {
    id: "vip",
    price: 500,
    icon: Crown,
  },

  urgent: {
    id: "urgent",
    price: 300,
    icon: Zap,
  },

  top: {
    id: "top",
    price: 200,
    icon: TrendingUp,
  },
};

export default function PaymentPage() {
  const { t, language } = useLanguage();

  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceId = searchParams.get("service") || "vip";

  const service = SERVICES[serviceId] || SERVICES.vip;
  const ServiceIcon = service.icon;

  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [showReceipt, setShowReceipt] = useState(false);

  const serviceTitle = t(`payment.services.${service.id}.title`);
  const serviceDescription = t(`payment.services.${service.id}.description`);

  const payment = useMemo(
    () => ({
      orderId: `UT-${Date.now().toString().slice(-8)}`,
      serviceId: service.id,
      serviceTitle,
      amount: service.price,
      status: paymentStatus,
      createdAt: new Date(),
      paidAt: paymentStatus === "approved" ? new Date() : null,
    }),
    [service, serviceTitle, paymentStatus],
  );

  const handleMockPayment = () => {
    setPaymentStatus("approved");
    setShowReceipt(true);
  };

  const handleContinue = () => {
    router.back();
  };

  const formatMoney = (value) => {
    return `${Number(value).toLocaleString(
      language === "ky" ? "ky-KG" : "ru-RU",
    )} ${t("payment.currencyShort")}`;
  };

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />

      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.back()}
        >
          <ArrowLeft size={17} />
          {t("payment.back")}
        </button>

        <div className={styles.logo}>
          Uy<span>Tap</span>
        </div>

        <div className={styles.secure}>
          <ShieldCheck size={16} />
          {t("payment.securePayment")}
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.top}>
          <div>
            <div className={styles.badge}>
              <Sparkles size={13} />
              {t("payment.badge")}
            </div>

            <h1>{t("payment.title")}</h1>

            <p>{t("payment.description")}</p>
          </div>

          <div className={styles.paymentId}>
            <span>{t("payment.paymentId")}</span>

            <strong>{payment.orderId}</strong>
          </div>
        </div>

        <div className={styles.paymentLayout}>
          {/* PAYMENT */}

          <section className={styles.qrCard}>
            <div className={styles.qrHeader}>
              <div className={styles.qrIcon}>
                <Smartphone size={20} />
              </div>

              <div>
                <h2>{t("payment.qr.title")}</h2>
                <p>{t("payment.qr.description")}</p>
              </div>
            </div>

            <div className={styles.qrWrapper}>
              <div className={styles.qr}>
                <div className={styles.mockQr}>
                  <div className={styles.qrPattern} />
                  <span>UyTap</span>
                </div>
              </div>
            </div>

            <div className={styles.amount}>
              <span>{t("payment.toPay")}</span>

              <strong>{formatMoney(service.price)}</strong>
            </div>

            <div
              className={`${styles.status} ${
                paymentStatus === "approved"
                  ? styles.statusSuccess
                  : styles.statusChecking
              }`}
            >
              {paymentStatus === "approved" ? (
                <>
                  <Check size={17} />
                  {t("payment.status.approved")}
                </>
              ) : (
                <>
                  <Clock3 size={17} />
                  {t("payment.status.pending")}
                </>
              )}
            </div>

            {paymentStatus === "pending" && (
              <button
                type="button"
                className={styles.actionButton}
                onClick={handleMockPayment}
              >
                <Check size={17} />
                {t("payment.mockPayment")}
              </button>
            )}

            {paymentStatus === "approved" && (
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => setShowReceipt(true)}
              >
                <Download size={17} />
                {t("payment.openReceipt")}
              </button>
            )}

            <p className={styles.hint}>{t("payment.testHint")}</p>
          </section>

          {/* SUMMARY */}

          <aside className={styles.summary}>
            <div className={styles.summaryHeader}>
              <span>{t("payment.summary.title")}</span>
              <ShieldCheck size={18} />
            </div>

            <div className={styles.service}>
              <div className={styles.serviceIcon}>
                <ServiceIcon size={21} />
              </div>

              <div>
                <span>{t("payment.summary.placement")}</span>
                <strong>{serviceTitle}</strong>
              </div>
            </div>

            <div className={styles.description}>{serviceDescription}</div>

            <div className={styles.details}>
              <div>
                <span>{t("payment.summary.serviceCost")}</span>

                <strong>{formatMoney(service.price)}</strong>
              </div>

              <div>
                <span>{t("payment.summary.status")}</span>

                <strong>
                  {paymentStatus === "approved"
                    ? t("payment.summary.paid")
                    : t("payment.summary.awaitingPayment")}
                </strong>
              </div>
            </div>

            <div className={styles.total}>
              <span>{t("payment.summary.total")}</span>

              <strong>{formatMoney(service.price)}</strong>
            </div>

            <div className={styles.info}>
              <ShieldCheck size={17} />

              <p>{t("payment.summary.info")}</p>
            </div>
          </aside>
        </div>

        {paymentStatus === "approved" && (
          <div className={styles.continueWrapper}>
            <button
              type="button"
              className={styles.continueButton}
              onClick={handleContinue}
            >
              {t("payment.continuePublication")}

              <ArrowLeft size={17} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>
        )}
      </section>

      <ServiceReceiptModal
        open={showReceipt}
        paymentData={payment}
        onClose={() => setShowReceipt(false)}
        onContinue={handleContinue}
      />
    </main>
  );
}
