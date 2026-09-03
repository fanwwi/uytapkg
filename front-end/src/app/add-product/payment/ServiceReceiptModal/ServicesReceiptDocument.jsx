"use client";

import { forwardRef } from "react";
import { Check, ReceiptText, ShieldCheck } from "lucide-react";

import styles from "./ServiceReceiptModal.module.css";

const ReceiptDocument = forwardRef(function ServicesReceiptDocument(
  { paymentData },
  ref,
) {
  const formatMoney = (value) => {
    return `${Number(value || 0).toLocaleString("ru-RU")} сом`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  };

  const serviceTitle = paymentData?.serviceTitle || "Услуга размещения";

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

          <span>НЕДВИЖИМОСТЬ КЫРГЫЗСТАНА</span>
        </div>

        <div className={styles.paidStamp}>
          <Check size={14} />
          ОПЛАЧЕНО
        </div>
      </div>

      {/* TITLE */}

      <div className={styles.receiptTitle}>
        <span>ЭЛЕКТРОННЫЙ ЧЕК</span>

        <strong>Оплата услуги</strong>
      </div>

      {/* SERVICE */}

      <div className={styles.serviceBadge}>
        <div className={styles.serviceBadgeIcon}>
          <ReceiptText size={19} />
        </div>

        <div className={styles.serviceBadgeContent}>
          <span>ОПЛАЧЕННАЯ УСЛУГА</span>

          <strong>{serviceTitle}</strong>
        </div>
      </div>

      <div className={styles.line} />

      {/* DETAILS */}

      <div className={styles.receiptRows}>
        <div className={styles.receiptRow}>
          <span>Услуга</span>

          <strong>{serviceTitle}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>Стоимость</span>

          <strong>{formatMoney(amount)}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>ID платежа</span>

          <strong className={styles.mono}>{orderId}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>Дата оплаты</span>

          <strong>{formatDate(paidAt)}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>Способ оплаты</span>

          <strong>QR / банковское приложение</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>Валюта</span>

          <strong>KGS — Кыргызский сом</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>Статус</span>

          <strong className={styles.statusSuccess}>Оплата подтверждена</strong>
        </div>
      </div>

      <div className={styles.line} />

      {/* TOTAL */}

      <div className={styles.total}>
        <span>ИТОГО</span>

        <strong>{formatMoney(amount)}</strong>
      </div>

      {/* FOOTER */}

      <div className={styles.receiptFooter}>
        <ShieldCheck size={15} />

        <span>Платёж подтверждён системой UyTap</span>
      </div>

      <div className={styles.receiptNumber}>ЧЕК № {orderId}</div>
    </div>
  );
});

export default ReceiptDocument;
