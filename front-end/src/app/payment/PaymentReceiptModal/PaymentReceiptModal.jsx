"use client";

import { useRef, useState } from "react";

import { Check, Download, LoaderCircle, X } from "lucide-react";

import styles from "./PaymentReceiptModal.module.css";
import { generateReceiptPdf } from "@/utils/generateReceiptPdf";
import ReceiptDocument from "./ReceiptDocument";

export default function PaymentReceiptModal({
  open,
  paymentData,
  onClose,
  onProfile,
}) {
  const receiptRef = useRef(null);

  const [isDownloading, setIsDownloading] = useState(false);

  if (!open) return null;

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
          aria-label="Закрыть"
        >
          <X size={19} />
        </button>

        <div className={styles.successIcon}>
          <Check size={30} />
        </div>

        <span className={styles.modalLabel}>Оплата подтверждена</span>

        <h2>Спасибо за оплату!</h2>

        <p className={styles.modalDescription}>
          Ваш тариф успешно активирован. Ниже находится электронный чек.
        </p>

        {/*
          Этот блок одновременно:
          1. показывается пользователю;
          2. используется как источник для PDF.
        */}
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
              Формируем PDF...
            </>
          ) : (
            <>
              <Download size={18} />
              Скачать чек PDF
            </>
          )}
        </button>

        <button
          type="button"
          className={styles.profileButton}
          onClick={onProfile}
        >
          Перейти в личный кабинет
        </button>
      </div>
    </div>
  );
}
