"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

import {
  ArrowLeft,
  Check,
  Clock3,
  Copy,
  FileCheck2,
  LoaderCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";


import styles from "./Payment.module.css";
import PaymentReceiptModal from "./PaymentReceiptModal/PaymentReceiptModal";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [paymentStatus, setPaymentStatus] = useState("waiting");
  const [showReceipt, setShowReceipt] = useState(false);
  const [copied, setCopied] = useState(false);

  const paymentData = useMemo(() => {
    const tariff = searchParams.get("tariff") || "СТАРТ";

    const price = Number(searchParams.get("price") || 390);

    const months = Number(searchParams.get("months") || 1);

    const discount = Number(searchParams.get("discount") || 0);

    const totalFromUrl = Number(searchParams.get("total"));

    const total =
      Number.isFinite(totalFromUrl) && totalFromUrl >= 0
        ? totalFromUrl
        : Math.round(price * months);

    const paymentId = `UT-${Date.now().toString().slice(-8)}`;

    return {
      tariff,
      price,
      months,
      discount,
      total,
      paymentId,
      date: new Date(),
    };
  }, [searchParams]);

  const qrValue = useMemo(() => {
    /*
     * MOCK PAYMENT PAYLOAD
     *
     * В production здесь должен быть payload,
     * который возвращает backend / платежный провайдер.
     *
     * Например:
     *
     * const payment = await createPayment(...)
     * payment.qrPayload
     */

    return JSON.stringify({
      merchant: "UyTap",
      paymentId: paymentData.paymentId,
      tariff: paymentData.tariff,
      amount: paymentData.total,
      currency: "KGS",
    });
  }, [paymentData]);

  /*
   * MOCK BACKEND POLLING
   *
   * Сейчас просто оставляем страницу
   * в состоянии ожидания.
   *
   * Потом здесь будет:
   *
   * const interval = setInterval(async () => {
   *   const response = await getPaymentStatus(
   *      paymentData.paymentId
   *   );
   *
   *   if (response.status === "paid") {
   *      setPaymentStatus("success");
   *      setShowReceipt(true);
   *      clearInterval(interval);
   *   }
   * }, 3000);
   */

  useEffect(() => {
    setPaymentStatus("waiting");
  }, [paymentData.paymentId]);

  const simulatePayment = () => {
    setPaymentStatus("checking");

    setTimeout(() => {
      setPaymentStatus("success");
      setShowReceipt(true);
    }, 1800);
  };

  const copyPaymentId = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.paymentId);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const formatMoney = (value) => {
    return `${Number(value).toLocaleString("ru-RU")} сом`;
  };

  const getMonthsText = (months) => {
    if (months === 1) return "месяц";

    if (months >= 2 && months <= 4) return "месяца";

    return "месяцев";
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
          Назад
        </button>

        <div className={styles.logo}>
          Uy<span>Tap</span>
        </div>

        <div className={styles.secure}>
          <ShieldCheck size={16} />
          Безопасная оплата
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.top}>
          <div>
            <div className={styles.badge}>
              <Sparkles size={13} />
              UyTap PRO
            </div>

            <h1>Оплата тарифа</h1>

            <p>
              Отсканируйте QR-код через приложение вашего банка. Сумма уже
              указана в платеже.
            </p>
          </div>

          <div className={styles.paymentId}>
            <span>ID платежа</span>

            <button type="button" onClick={copyPaymentId}>
              {paymentData.paymentId}

              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        <div className={styles.paymentLayout}>
          {/* QR */}

          <section className={styles.qrCard}>
            <div className={styles.qrHeader}>
              <div className={styles.qrIcon}>
                <Smartphone size={20} />
              </div>

              <div>
                <h2>Отсканируйте QR</h2>

                <p>Откройте банковское приложение</p>
              </div>
            </div>

            <div className={styles.qrWrapper}>
              <div className={styles.qr}>
                <QRCodeSVG value={qrValue} size={250} level="H" includeMargin />
              </div>
            </div>

            <div className={styles.amount}>
              <span>К оплате</span>

              <strong>{formatMoney(paymentData.total)}</strong>
            </div>

            <div
              className={`${styles.status} ${
                paymentStatus === "success"
                  ? styles.statusSuccess
                  : paymentStatus === "checking"
                    ? styles.statusChecking
                    : ""
              }`}
            >
              {paymentStatus === "checking" ? (
                <>
                  <LoaderCircle size={17} className={styles.spin} />
                  Проверяем оплату...
                </>
              ) : paymentStatus === "success" ? (
                <>
                  <Check size={17} />
                  Оплата подтверждена
                </>
              ) : (
                <>
                  <Clock3 size={17} />
                  Ожидаем оплату
                </>
              )}
            </div>

            {paymentStatus !== "success" && (
              <button
                type="button"
                className={styles.mockButton}
                onClick={simulatePayment}
                disabled={paymentStatus === "checking"}
              >
                {paymentStatus === "checking"
                  ? "Проверяем..."
                  : "Симулировать оплату"}
              </button>
            )}

            <p className={styles.mockHint}>
              Тестовый режим: кнопка имитирует успешное подтверждение платежа от
              backend.
            </p>
          </section>

          {/* SUMMARY */}

          <aside className={styles.summary}>
            <div className={styles.summaryHeader}>
              <span>Ваш заказ</span>

              <FileCheck2 size={18} />
            </div>

            <div className={styles.tariff}>
              <div className={styles.tariffIcon}>
                <Sparkles size={20} />
              </div>

              <div>
                <span>Тариф</span>

                <strong>{paymentData.tariff}</strong>
              </div>
            </div>

            <div className={styles.details}>
              <div>
                <span>Стоимость / месяц</span>

                <strong>{formatMoney(paymentData.price)}</strong>
              </div>

              <div>
                <span>Период</span>

                <strong>
                  {paymentData.months} {getMonthsText(paymentData.months)}
                </strong>
              </div>

              {paymentData.discount > 0 && (
                <div>
                  <span>Скидка</span>

                  <strong className={styles.discount}>
                    -{paymentData.discount}%
                  </strong>
                </div>
              )}
            </div>

            <div className={styles.total}>
              <span>Итого</span>

              <strong>{formatMoney(paymentData.total)}</strong>
            </div>

            <div className={styles.info}>
              <ShieldCheck size={17} />

              <p>
                После подтверждения оплаты тариф будет активирован
                автоматически.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <PaymentReceiptModal
        open={showReceipt}
        paymentData={paymentData}
        onClose={() => setShowReceipt(false)}
        onProfile={() => router.push("/profile")}
      />
    </main>
  );
}
