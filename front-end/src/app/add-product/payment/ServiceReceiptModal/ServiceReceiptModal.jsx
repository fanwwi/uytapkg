"use client";

import { useRef, useState } from "react";
import { Check, Download, LoaderCircle, X } from "lucide-react";

import styles from "./ServiceReceiptModal.module.css";
import ReceiptDocument from "./ServicesReceiptDocument";
import { generateServicesReceiptPdf } from "@/utils/generateServicesReceiptModal";

export default function ServiceReceiptModal({
  open,
  paymentData,
  onClose,
  onContinue,
}) {
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!open || !paymentData) {
    return null;
  }

  const receiptData = {
    serviceTitle:
      paymentData.serviceTitle || paymentData.service || "Услуга размещения",

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
          aria-label="Закрыть"
        >
          <X size={19} />
        </button>

        {/* SUCCESS */}

        <div className={styles.successIcon}>
          <Check size={28} strokeWidth={2.5} />
        </div>

        <span className={styles.modalLabel}>ОПЛАТА ПОДТВЕРЖДЕНА</span>

        <h2>Услуга оплачена</h2>

        <p className={styles.modalDescription}>
          Платёж успешно получен. Электронный чек сформирован автоматически.
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
              Формируем чек...
            </>
          ) : (
            <>
              <Download size={18} />
              Скачать чек PDF
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
          Продолжить публикацию
        </button>

        {/* INFO */}

        <div className={styles.modalHint}>
          <Check size={14} />

          <span>
            После продолжения вы сможете опубликовать объявление с оплаченной
            услугой.
          </span>
        </div>
      </div>
    </div>
  );
}
