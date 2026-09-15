"use client";

import { useRef, useState } from "react";
import { Check, Download, LoaderCircle, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./ServiceReceiptModal.module.css";
import ReceiptDocument from "./ServicesReceiptDocument";
import { generateServicesReceiptPdf } from "@/utils/generateServicesReceiptModal";

export default function ServiceReceiptModal({
  open,
  paymentData,
  onClose,
  onContinue,
}) {
  const { t } = useLanguage();

  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!open || !paymentData) {
    return null;
  }

  const receiptData = {
    serviceTitle:
      paymentData.serviceTitle ||
      paymentData.service ||
      t("payment.receipt.serviceDefault"),

    amount:
      Number(paymentData.amount) ||
      Number(paymentData.total) ||
      Number(paymentData.price) ||
      0,

    orderId: paymentData.orderId || paymentData.paymentId || "—",

    paidAt:
      paymentData.paidAt ||
      paymentData.date ||
      paymentData.createdAt ||
      new Date(),

    status: paymentData.status || "approved",
  };

  const downloadReceipt = async () => {
    if (!receiptRef.current || isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);

      await generateServicesReceiptPdf(receiptRef.current, receiptData);
    } catch (error) {
      console.error("Ошибка создания PDF-чека:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClose = () => {
    if (isDownloading) return;

    onClose?.();
  };

  const handleContinue = () => {
    if (isDownloading) return;

    onContinue?.();
  };

  return (
    <div className={styles.overlay} onMouseDown={handleClose}>
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* CLOSE */}

        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          disabled={isDownloading}
          aria-label={t("payment.receipt.close")}
        >
          <X size={19} />
        </button>

        {/* SUCCESS */}

        <div className={styles.successIcon}>
          <Check size={28} strokeWidth={2.5} />
        </div>

        <span className={styles.modalLabel}>
          {t("payment.receipt.paymentConfirmedLabel")}
        </span>

        <h2>{t("payment.receipt.paidTitle")}</h2>

        <p className={styles.modalDescription}>
          {t("payment.receipt.description")}
        </p>

        {/* RECEIPT */}

        <div className={styles.receiptWrapper}>
          <ReceiptDocument ref={receiptRef} paymentData={receiptData} />
        </div>

        {/* DOWNLOAD */}

        <button
          type="button"
          className={styles.downloadButton}
          onClick={downloadReceipt}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <LoaderCircle size={18} className={styles.spin} />
              {t("payment.receipt.generating")}
            </>
          ) : (
            <>
              <Download size={18} />
              {t("payment.receipt.downloadPdf")}
            </>
          )}
        </button>

        {/* CONTINUE */}

        <button
          type="button"
          className={styles.continueButton}
          onClick={handleContinue}
          disabled={isDownloading}
        >
          {t("payment.receipt.continuePublication")}
        </button>

        {/* INFO */}

        <div className={styles.modalHint}>
          <Check size={14} />

          <span>{t("payment.receipt.continueHint")}</span>
        </div>
      </div>
    </div>
  );
}
