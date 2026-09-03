"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock3,
  Crown,
  Download,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import styles from "./Payment.module.css";
import ServiceReceiptModal from "./ServiceReceiptModal/ServiceReceiptModal";

const SERVICES = {
  vip: {
    id: "vip",
    title: "VIP-размещение",
    description:
      "Объявление будет выделено среди других и получит повышенную видимость.",
    price: 500,
    icon: Crown,
  },

  urgent: {
    id: "urgent",
    title: "Срочная публикация",
    description:
      "Добавьте отметку о срочности, чтобы быстрее привлечь внимание покупателей.",
    price: 300,
    icon: Zap,
  },

  top: {
    id: "top",
    title: "Поднять в ТОП",
    description:
      "Поднимите объявление выше других объявлений и получите больше просмотров.",
    price: 200,
    icon: TrendingUp,
  },
};

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceId = searchParams.get("service") || "vip";

  const service = SERVICES[serviceId] || SERVICES.vip;
  const ServiceIcon = service.icon;

  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [showReceipt, setShowReceipt] = useState(false);

  const payment = useMemo(
    () => ({
      orderId: `UT-${Date.now().toString().slice(-8)}`,
      serviceId: service.id,
      serviceTitle: service.title,
      amount: service.price,
      status: paymentStatus,
      createdAt: new Date(),
      paidAt: paymentStatus === "approved" ? new Date() : null,
    }),
    [service, paymentStatus],
  );

  const handleMockPayment = () => {
    setPaymentStatus("approved");
    setShowReceipt(true);
  };

  const handleContinue = () => {
    router.back();
  };

  const formatMoney = (value) => {
    return `${Number(value).toLocaleString("ru-RU")} сом`;
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
              Услуга UyTap
            </div>

            <h1>Оплата услуги</h1>

            <p>
              Оплатите выбранную услугу, чтобы продолжить публикацию объявления.
            </p>
          </div>

          <div className={styles.paymentId}>
            <span>ID платежа</span>

            <strong>{payment.orderId}</strong>
          </div>
        </div>

        <div className={styles.paymentLayout}>
          {/* PAYMENT */}

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
                {/* MOCK QR */}
                <div className={styles.mockQr}>
                  <div className={styles.qrPattern} />
                  <span>UyTap</span>
                </div>
              </div>
            </div>

            <div className={styles.amount}>
              <span>К оплате</span>

              <strong>{formatMoney(service.price)}</strong>
            </div>

            <div
              className={`${styles.status} ${
                paymentStatus === "approved"
                  ? styles.statusSuccess
                  : styles.statusChecking
              }`}
            >
              {paymentStatus === "approved" ? (
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

            {paymentStatus === "pending" && (
              <button
                type="button"
                className={styles.actionButton}
                onClick={handleMockPayment}
              >
                <Check size={17} />
                Имитировать оплату
              </button>
            )}

            {paymentStatus === "approved" && (
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => setShowReceipt(true)}
              >
                <Download size={17} />
                Открыть чек
              </button>
            )}

            <p className={styles.hint}>
              Это тестовая страница. Кнопка выше имитирует успешную оплату.
            </p>
          </section>

          {/* SUMMARY */}

          <aside className={styles.summary}>
            <div className={styles.summaryHeader}>
              <span>Ваша услуга</span>
              <ShieldCheck size={18} />
            </div>

            <div className={styles.service}>
              <div className={styles.serviceIcon}>
                <ServiceIcon size={21} />
              </div>

              <div>
                <span>Размещение</span>
                <strong>{service.title}</strong>
              </div>
            </div>

            <div className={styles.description}>{service.description}</div>

            <div className={styles.details}>
              <div>
                <span>Стоимость услуги</span>

                <strong>{formatMoney(service.price)}</strong>
              </div>

              <div>
                <span>Статус</span>

                <strong>
                  {paymentStatus === "approved" ? "Оплачено" : "Ожидает оплаты"}
                </strong>
              </div>
            </div>

            <div className={styles.total}>
              <span>Итого</span>

              <strong>{formatMoney(service.price)}</strong>
            </div>

            <div className={styles.info}>
              <ShieldCheck size={17} />

              <p>
                После подтверждения оплаты вы сможете продолжить публикацию
                объявления.
              </p>
            </div>
          </aside>
        </div>

        {paymentStatus === "approved" && (
          <div className={styles.continueWrapper}>
            <button
              type="button"
              className={styles.continueButton}
              onClick={handleContinue}
            >
              Продолжить публикацию
              <ArrowLeft size={17} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>
        )}
      </section>

      <ServiceReceiptModal
        open={showReceipt}
        paymentData={payment}
        onClose={() => setShowReceipt(false)}
        onContinue={handleContinue}
      />
    </main>
  );
}
