"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  Check,
  Clock3,
  Copy,
  ExternalLink,
  FileCheck2,
  LoaderCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  XCircle,
} from "lucide-react";

import styles from "./Payment.module.css";
import PaymentReceiptModal from "./PaymentReceiptModal/PaymentReceiptModal";
import { createPayment, getPaymentStatus, cancelPayment } from "@/utils/api";

const POLL_INTERVAL_MS = 3000;

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tariffId = searchParams.get("tariffId");
  const months = Number(searchParams.get("months") || 1);

  // loading -> создаём счёт в O!Dengi | ready -> счёт создан, ждём/показываем оплату | error
  const [loadState, setLoadState] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [payment, setPayment] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const pollRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("uytap_token");

    if (!token) {
      router.replace("/auth-required");
      return undefined;
    }

    if (!tariffId || !months) {
      setLoadState("error");
      setErrorMessage("Не удалось определить тариф. Вернитесь на страницу тарифов.");
      return undefined;
    }

    let cancelled = false;

    const init = async () => {
      try {
        const data = await createPayment(token, { tariffId, months });

        if (cancelled) return;

        setPayment(data);
        setLoadState("ready");

        if (data.status === "approved") {
          setShowReceipt(true);
          return;
        }

        pollRef.current = setInterval(async () => {
          try {
            const fresh = await getPaymentStatus(token, data.orderId);

            if (cancelled) return;

            setPayment((prev) => (prev ? { ...prev, ...fresh } : fresh));

            if (fresh.status === "approved") {
              setShowReceipt(true);
              stopPolling();
            } else if (fresh.status === "canceled") {
              stopPolling();
            }
          } catch (pollError) {
            console.error("Ошибка проверки статуса платежа:", pollError);
          }
        }, POLL_INTERVAL_MS);
      } catch (error) {
        if (cancelled) return;

        setLoadState("error");
        setErrorMessage(error.message || "Не удалось создать платёж. Попробуйте позже.");
      }
    };

    init();

    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [tariffId, months, router, stopPolling]);

  const copyPaymentId = async () => {
    if (!payment) return;

    try {
      await navigator.clipboard.writeText(payment.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleCancel = async () => {
    if (!payment || canceling) return;

    const token = localStorage.getItem("uytap_token");

    setCanceling(true);

    try {
      await cancelPayment(token, payment.orderId);
    } catch (error) {
      console.error("Ошибка отмены платежа:", error);
    } finally {
      stopPolling();
      router.push("/pricing");
    }
  };

  const formatMoney = (value) => {
    return `${Number(value).toLocaleString("ru-RU")} сом`;
  };

  const getMonthsText = (value) => {
    if (value === 1) return "месяц";

    if (value >= 2 && value <= 4) return "месяца";

    return "месяцев";
  };

  const paymentData = payment
    ? {
        tariff: payment.tariffTitle || payment.tariffId,
        price: payment.pricePerMonth ?? payment.amount,
        months: payment.months,
        discount: payment.discountPercent || 0,
        total: payment.amount,
        paymentId: payment.orderId,
        date: payment.paidAt ? new Date(payment.paidAt) : new Date(),
      }
    : null;

  const isPending = payment && (payment.status === "pending" || payment.status === "processing");
  const isApproved = payment?.status === "approved";
  const isCanceled = payment?.status === "canceled" || payment?.status === "failed";

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
        {loadState === "loading" && (
          <div className={styles.qrCard} style={{ maxWidth: 420, margin: "0 auto" }}>
            <div className={styles.qrHeader}>
              <div className={styles.qrIcon}>
                <LoaderCircle size={20} className={styles.spin} />
              </div>
              <div>
                <h2>Создаём счёт</h2>
                <p>Подключаемся к O!Dengi...</p>
              </div>
            </div>
          </div>
        )}

        {loadState === "error" && (
          <div className={styles.qrCard} style={{ maxWidth: 420, margin: "0 auto" }}>
            <div className={styles.qrHeader}>
              <div className={styles.qrIcon}>
                <XCircle size={20} />
              </div>
              <div>
                <h2>Не удалось начать оплату</h2>
                <p>{errorMessage}</p>
              </div>
            </div>

            <button
              type="button"
              className={styles.actionButton}
              onClick={() => router.push("/pricing")}
            >
              Вернуться к тарифам
            </button>
          </div>
        )}

        {loadState === "ready" && payment && (
          <>
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
                  {payment.orderId}

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
                    {payment.qrUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={payment.qrUrl} alt="QR-код для оплаты" width={250} height={250} />
                    ) : (
                      <div className={styles.qrSkeleton}>
                        <LoaderCircle size={28} />
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.amount}>
                  <span>К оплате</span>

                  <strong>{formatMoney(payment.amount)}</strong>
                </div>

                <div
                  className={`${styles.status} ${
                    isApproved
                      ? styles.statusSuccess
                      : isPending
                        ? styles.statusChecking
                        : ""
                  }`}
                >
                  {isApproved ? (
                    <>
                      <Check size={17} />
                      Оплата подтверждена
                    </>
                  ) : isCanceled ? (
                    <>
                      <XCircle size={17} />
                      Счёт отменён
                    </>
                  ) : (
                    <>
                      <Clock3 size={17} />
                      Ожидаем оплату
                    </>
                  )}
                </div>

                {isPending && payment.linkApp && (
                  <a
                    href={payment.linkApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionButton}
                  >
                    <ExternalLink size={16} />
                    Открыть в приложении O!
                  </a>
                )}

                {isPending && (
                  <button
                    type="button"
                    className={styles.cancelLink}
                    onClick={handleCancel}
                    disabled={canceling}
                  >
                    {canceling ? "Отменяем..." : "Отменить платёж"}
                  </button>
                )}

                {isCanceled && (
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => router.push("/pricing")}
                  >
                    Вернуться к тарифам
                  </button>
                )}

                <p className={styles.hint}>
                  Статус оплаты обновляется автоматически, дополнительно
                  обновлять страницу не нужно.
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
          </>
        )}
      </section>

      {paymentData && (
        <PaymentReceiptModal
          open={showReceipt}
          paymentData={paymentData}
          onClose={() => setShowReceipt(false)}
          onProfile={() => router.push("/profile")}
        />
      )}
    </main>
  );
}
