"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Check, Download, LoaderCircle, X, ShieldCheck } from "lucide-react";

import styles from "./PaymentReceiptModal.module.css";

export default function PaymentReceiptModal({
  open,
  paymentData,
  onClose,
  onProfile,
}) {
  const receiptRef = useRef(null);

  const [isDownloading, setIsDownloading] = useState(false);

  if (!open) return null;

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

  const downloadReceipt = async () => {
    if (!receiptRef.current || isDownloading) return;

    try {
      setIsDownloading(true);

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#0b0b10",
        logging: false,
      });

      const imageData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      /*
       * Фиолетовый фон страницы.
       *
       * Делаем несколько полупрозрачных
       * больших кругов, чтобы создать glow.
       */
      pdf.setFillColor(7, 7, 11);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      pdf.setFillColor(91, 33, 182);
      pdf.circle(18, 20, 38, "F");

      pdf.setFillColor(76, 29, 149);
      pdf.circle(pageWidth - 5, 80, 32, "F");

      pdf.setFillColor(109, 40, 217);
      pdf.circle(pageWidth / 2, pageHeight - 5, 45, "F");

      /*
       * Сам чек.
       */
      const margin = 14;

      const availableWidth = pageWidth - margin * 2;

      const imageRatio = canvas.height / canvas.width;

      const imageHeight = availableWidth * imageRatio;

      let y = 17;

      /*
       * Белая/тёмная основа под чек.
       */
      pdf.setFillColor(17, 17, 22);

      pdf.roundedRect(
        margin - 2,
        y - 2,
        availableWidth + 4,
        Math.min(imageHeight + 4, pageHeight - 30),
        6,
        6,
        "F",
      );

      pdf.addImage(imageData, "PNG", margin, y, availableWidth, imageHeight);

      /*
       * Дополнительная декоративная рамка.
       */
      pdf.setDrawColor(139, 92, 246);
      pdf.setLineWidth(0.5);

      pdf.roundedRect(
        margin - 2,
        y - 2,
        availableWidth + 4,
        Math.min(imageHeight + 4, pageHeight - 30),
        6,
        6,
      );

      pdf.save(`uytap-receipt-${paymentData.paymentId}.pdf`);
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
        <div ref={receiptRef} className={styles.receipt}>
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
