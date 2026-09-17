"use client";

import { forwardRef } from "react";
import { Check, ShieldCheck } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./PaymentReceiptModal.module.css";

const ReceiptDocument = forwardRef(function ReceiptDocument(
  { paymentData },
  ref,
) {
  const { t, language } = useLanguage();

  const formatMoney = (value) => {
    return `${Number(value).toLocaleString(
      language === "ky" ? "ky-KG" : "ru-RU",
    )} сом`;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat(language === "ky" ? "ky-KG" : "ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getMonthsText = (months) => {
    if (months === 1) {
      return t("paymentReceipt.month.one");
    }

    if (months >= 2 && months <= 4) {
      return t("paymentReceipt.month.few");
    }

    return t("paymentReceipt.month.many");
  };

  return (
    <div ref={ref} className={styles.receipt}>
      <div className={styles.receiptGlow} />

      <div className={styles.receiptTop}>
        <div className={styles.brand}>
          <strong>UyTap</strong>

          <span>{t("paymentReceipt.brandSubtitle")}</span>
        </div>

        <div className={styles.paidStamp}>
          <Check size={15} />

          {t("paymentReceipt.paid")}
        </div>
      </div>

      <div className={styles.receiptTitle}>
        <span>{t("paymentReceipt.electronicReceipt")}</span>

        <strong>
          {paymentData.heading || t("paymentReceipt.tariffPayment")}
        </strong>
      </div>

      <div className={styles.line} />

      <div className={styles.receiptRows}>
        <div className={styles.receiptRow}>
          <span>{paymentData.tariffLabel || t("paymentReceipt.tariff")}</span>

          <strong>{paymentData.tariff}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>
            {paymentData.priceLabel || t("paymentReceipt.pricePerMonth")}
          </span>

          <strong>{formatMoney(paymentData.price)}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>{t("paymentReceipt.period")}</span>

          <strong>
            {paymentData.periodLabel ||
              `${paymentData.months} ${getMonthsText(paymentData.months)}`}
          </strong>
        </div>

        {paymentData.discount > 0 && (
          <div className={styles.receiptRow}>
            <span>{t("paymentReceipt.discount")}</span>

            <strong className={styles.discount}>
              -{paymentData.discount}%
            </strong>
          </div>
        )}

        <div className={styles.receiptRow}>
          <span>{t("paymentReceipt.paymentId")}</span>

          <strong className={styles.mono}>{paymentData.paymentId}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>{t("paymentReceipt.paymentDate")}</span>

          <strong>{formatDate(paymentData.date)}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>{t("paymentReceipt.paymentMethod")}</span>

          <strong>{t("paymentReceipt.qrBankApp")}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>{t("paymentReceipt.currency")}</span>

          <strong>KGS — Кыргызский сом</strong>
        </div>
      </div>

      <div className={styles.line} />

      <div className={styles.total}>
        <span>{t("paymentReceipt.total")}</span>

        <strong>{formatMoney(paymentData.total)}</strong>
      </div>

      <div className={styles.receiptFooter}>
        <ShieldCheck size={14} />

        <span>{t("paymentReceipt.systemConfirmed")}</span>
      </div>

      <div className={styles.receiptNumber}>{paymentData.paymentId}</div>
    </div>
  );
});

export default ReceiptDocument;
