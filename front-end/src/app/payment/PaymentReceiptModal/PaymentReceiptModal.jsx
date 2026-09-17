"use client";

import { useRef, useState } from "react";

import { Check, Download, LoaderCircle, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./PaymentReceiptModal.module.css";
import { generateReceiptPdf } from "@/utils/generateReceiptPdf";
import ReceiptDocument from "./ReceiptDocument";

export default function PaymentReceiptModal({
  open,
  paymentData,
  onClose,
  onProfile,
  description,
  profileButtonLabel,
}) {
  const { t } = useLanguage();

  const receiptRef = useRef(null);

  const [isDownloading, setIsDownloading] = useState(false);

  if (!open) return null;

  const finalDescription =
    description || t("paymentReceipt.defaultDescription");

  const finalProfileButtonLabel =
    profileButtonLabel || t("paymentReceipt.profileButton");

  const downloadReceipt = async () => {
    if (!receiptRef.current || isDownloading) return;

    try {
      setIsDownloading(true);

      await generateReceiptPdf(receiptRef.current, paymentData);
    } catch (error) {
      console.error("Ошибка создания PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={t("paymentReceipt.close")}
        >
          <X size={19} />
        </button>

        <div className={styles.successIcon}>
          <Check size={30} />
        </div>

        <span className={styles.modalLabel}>
          {t("paymentReceipt.paymentConfirmed")}
        </span>

        <h2>{t("paymentReceipt.thanks")}</h2>

        <p className={styles.modalDescription}>{finalDescription}</p>

        <ReceiptDocument ref={receiptRef} paymentData={paymentData} />

        <button
          type="button"
          className={styles.downloadButton}
          onClick={downloadReceipt}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <LoaderCircle size={18} className={styles.spin} />
              {t("paymentReceipt.generatingPdf")}
            </>
          ) : (
            <>
              <Download size={18} />
              {t("paymentReceipt.downloadPdf")}
            </>
          )}
        </button>

        <button
          type="button"
          className={styles.profileButton}
          onClick={onProfile}
        >
          {finalProfileButtonLabel}
        </button>
      </div>
    </div>
  );
}
