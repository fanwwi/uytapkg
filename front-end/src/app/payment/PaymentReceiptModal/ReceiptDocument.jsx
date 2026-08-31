"use client";

import { forwardRef } from "react";
import { Check, ShieldCheck } from "lucide-react";

import styles from "./PaymentReceiptModal.module.css";

// Визуальная разметка электронного чека UyTap. Вынесена отдельно от
// PaymentReceiptModal, чтобы её мог переиспользовать и админ-раздел
// «Оплаты» (скачивание чека по любому платежу) — оба места передают
// сюда ref и через generateReceiptPdf() рендерят этот DOM-узел в PDF.
//
// paymentData: { tariff, price, months, discount, total, paymentId, date }
const ReceiptDocument = forwardRef(function ReceiptDocument({ paymentData }, ref) {
  const formatMoney = (value) => {
    return `${Number(value).toLocaleString("ru-RU")} сом`;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getMonthsText = (months) => {
    if (months === 1) return "месяц";

    if (months >= 2 && months <= 4) return "месяца";

    return "месяцев";
  };

  return (
    <div ref={ref} className={styles.receipt}>
      <div className={styles.receiptGlow} />

      <div className={styles.receiptTop}>
        <div className={styles.brand}>
          <strong>UyTap</strong>

          <span>НЕДВИЖИМОСТЬ КЫРГЫЗСТАНА</span>
        </div>

        <div className={styles.paidStamp}>
          <Check size={15} />
          ОПЛАЧЕНО
        </div>
      </div>

      <div className={styles.receiptTitle}>
        <span>ЭЛЕКТРОННЫЙ ЧЕК</span>

        <strong>Оплата тарифа</strong>
      </div>

      <div className={styles.line} />

      <div className={styles.receiptRows}>
        <div className={styles.receiptRow}>
          <span>Тариф</span>

          <strong>{paymentData.tariff}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>Стоимость / месяц</span>

          <strong>{formatMoney(paymentData.price)}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>Период</span>

          <strong>
            {paymentData.months} {getMonthsText(paymentData.months)}
          </strong>
        </div>

        {paymentData.discount > 0 && (
          <div className={styles.receiptRow}>
            <span>Скидка</span>

            <strong className={styles.discount}>
              -{paymentData.discount}%
            </strong>
          </div>
        )}

        <div className={styles.receiptRow}>
          <span>ID платежа</span>

          <strong className={styles.mono}>{paymentData.paymentId}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>Дата оплаты</span>

          <strong>{formatDate(paymentData.date)}</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>Способ оплаты</span>

          <strong>QR / банковское приложение</strong>
        </div>

        <div className={styles.receiptRow}>
          <span>Валюта</span>

          <strong>KGS — Кыргызский сом</strong>
        </div>
      </div>

      <div className={styles.line} />

      <div className={styles.total}>
        <span>ИТОГО</span>

        <strong>{formatMoney(paymentData.total)}</strong>
      </div>

      <div className={styles.receiptFooter}>
        <ShieldCheck size={14} />

        <span>Платёж подтверждён системой UyTap</span>
      </div>

      <div className={styles.receiptNumber}>{paymentData.paymentId}</div>
    </div>
  );
});

export default ReceiptDocument;
