"use client";

import { forwardRef } from "react";
import { Check, ReceiptText, ShieldCheck } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./ServiceReceiptModal.module.css";

const ReceiptDocument = forwardRef(function ServicesReceiptDocument(
  { paymentData },
  ref,
) {
  const { t, language } = useLanguage();

  const locale = language === "ky" ? "ky-KG" : "ru-RU";

  const formatMoney = (value) => {
    return `${Number(value || 0).toLocaleString(locale)} ${t(
      "payment.currencyShort",
    )}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  };

  const serviceTitle =
    paymentData?.serviceTitle || t("payment.receipt.serviceDefault");

  const amount = Number(paymentData?.amount) || 0;

  const orderId = paymentData?.orderId || "—";

  const paidAt = paymentData?.paidAt || new Date();

  return (
    <div ref={ref} className={styles.receipt}>
      {/* DECORATION */}

      <div className={styles.receiptGlow} />

      <div className={styles.receiptBlueLine} />

      {/* HEADER */}

      <div className={styles.receiptTop}>
        <div className={styles.brand}>
          <strong>
            Uy<span>Tap</span>
          </strong>

          <span>{t("payment.receipt.brandSubtitle")}</span>
        </div>

        <div className={styles.paidStamp}>
          <Check size={14} />
          {t("payment.receipt.paid")}
        </div>
      </div>

      {/* TITLE */}

      <div className={styles.receiptTitle}>
        <span>{t("payment.receipt.electronicReceipt")}</span>

        <strong>{t("payment.receipt.servicePayment")}</strong>
      </div>

      {/* SERVICE */}

      <div className={styles.serviceBadge}>
        <div className={styles.serviceBadgeIcon}>
          <ReceiptText size={19} />
        </div>

        <div className={styles.serviceBadgeContent}>
          <span>{t("payment.receipt.paidService")}</span>

          <strong>{serviceTitle}</strong>
        </div>
      </div>

      <div className={styles.line} />

      {/* DETAILS */}

      <div className={styles.receiptRows}>
        <div className={styles.receiptRow}>
          <span>{t("payment.receipt.service")}</span>

          <strong>{serviceTitle}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>{t("payment.receipt.cost")}</span>

          <strong>{formatMoney(amount)}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>{t("payment.receipt.paymentId")}</span>

          <strong className={styles.mono}>{orderId}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>{t("payment.receipt.paymentDate")}</span>

          <strong>{formatDate(paidAt)}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>{t("payment.receipt.paymentMethod")}</span>

          <strong>{t("payment.receipt.qrPayment")}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>{t("payment.receipt.currency")}</span>

          <strong>{t("payment.receipt.currencyFull")}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>{t("payment.receipt.status")}</span>

          <strong className={styles.statusSuccess}>
            {t("payment.receipt.paymentConfirmed")}
          </strong>
        </div>
      </div>

      <div className={styles.line} />

      {/* TOTAL */}

      <div className={styles.total}>
        <span>{t("payment.receipt.total")}</span>

        <strong>{formatMoney(amount)}</strong>
      </div>

      {/* FOOTER */}

      <div className={styles.receiptFooter}>
        <ShieldCheck size={15} />

        <span>{t("payment.receipt.systemConfirmed")}</span>
      </div>

      <div className={styles.receiptNumber}>
        {t("payment.receipt.receiptNumber")} {orderId}
      </div>
    </div>
  );
});

export default ReceiptDocument;
