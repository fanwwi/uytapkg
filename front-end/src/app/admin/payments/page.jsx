"use client";

import { useMemo, useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Eye,
  Download,
  CalendarDays,
} from "lucide-react";


import styles from "./Payments.module.css";
import CustomSelectBlack from "@/components/ui/customSelectBlack/CustomSelectBlack";
import Sidebar from "../components/Sidebar/Sidebar";

const PAYMENTS = [
  {
    id: "PAY-00124",
    user: "Айбек Токтогулов",
    email: "aibek@gmail.com",
    tariff: "Premium",
    price: 2990,
    period: "30 дней",
    startDate: "20.08.2026",
    endDate: "19.09.2026",
    status: "paid",
    receipt: true,
  },
  {
    id: "PAY-00123",
    user: "Нурсултан Б.",
    email: "nursultan@gmail.com",
    tariff: "Business",
    price: 5990,
    period: "30 дней",
    startDate: "19.08.2026",
    endDate: "18.09.2026",
    status: "paid",
    receipt: true,
  },
  {
    id: "PAY-00122",
    user: "ОсОО СтройДом",
    email: "stroydom@gmail.com",
    tariff: "Developer",
    price: 9990,
    period: "90 дней",
    startDate: "18.08.2026",
    endDate: "16.11.2026",
    status: "paid",
    receipt: true,
  },
  {
    id: "PAY-00121",
    user: "Алина К.",
    email: "alina@gmail.com",
    tariff: "Premium",
    price: 2990,
    period: "30 дней",
    startDate: "17.08.2026",
    endDate: "16.09.2026",
    status: "paid",
    receipt: true,
  },
  {
    id: "PAY-00120",
    user: "Эльдар С.",
    email: "eldar@gmail.com",
    tariff: "Basic",
    price: 990,
    period: "30 дней",
    startDate: "16.08.2026",
    endDate: "15.09.2026",
    status: "paid",
    receipt: true,
  },
  {
    id: "PAY-00119",
    user: "Марат Абдрахманов",
    email: "marat@gmail.com",
    tariff: "Business",
    price: 5990,
    period: "30 дней",
    startDate: "15.08.2026",
    endDate: "14.09.2026",
    status: "paid",
    receipt: true,
  },
];

const STATUS_CONFIG = {
  paid: {
    label: "Оплачено",
    icon: CheckCircle2,
  },
};

const formatPrice = (price) => {
  return `${price.toLocaleString("ru-RU")} сом`;
};

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [tariffFilter, setTariffFilter] = useState("Все тарифы");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return PAYMENTS.filter((payment) => {
      const matchesSearch =
        !query ||
        payment.user.toLowerCase().includes(query) ||
        payment.email.toLowerCase().includes(query);

      const matchesTariff =
        tariffFilter === "Все тарифы" || payment.tariff === tariffFilter;

      return matchesSearch && matchesTariff;
    });
  }, [search, tariffFilter]);

  const totalRevenue = PAYMENTS.reduce(
    (sum, payment) => sum + payment.price,
    0,
  );

  const paidCount = PAYMENTS.length;

  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.content}>
        <main className={styles.page}>
          {/* HEADER */}
          <div className={styles.pageHeader}>
            <div className={styles.titleRow}>
              <div className={styles.titleIcon}>
                <CreditCard />
              </div>

              <div>
                <h1>Оплаты</h1>
                <p>Управление платежами и чеками</p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <section className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <span>Выручка</span>

                <div className={styles.statIcon}>
                  <CreditCard />
                </div>
              </div>

              <strong>{formatPrice(totalRevenue)}</strong>

              <small>За последние 30 дней</small>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <span>Оплаты</span>

                <div className={styles.statIcon}>
                  <CheckCircle2 />
                </div>
              </div>

              <strong>{paidCount}</strong>

              <small>За последние 30 дней</small>
            </div>
          </section>

          {/* TABLE */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>История платежей</h2>

                <p>
                  За последние 30 дней: <b>{filteredPayments.length}</b>
                </p>
              </div>
            </div>

            {/* FILTERS */}
            <div className={styles.filters}>
              <div className={styles.search}>
                <Search />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Поиск по пользователю..."
                />
              </div>

              <div className={styles.customSelect}>
                <CustomSelectBlack
                  icon={Filter}
                  title="Тариф"
                  options={[
                    "Все тарифы",
                    "Basic",
                    "Premium",
                    "Business",
                    "Developer",
                  ]}
                  value={tariffFilter}
                  setValue={setTariffFilter}
                />
              </div>
            </div>

            {/* TABLE */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Пользователь</th>
                    <th>Тариф</th>
                    <th>Сумма</th>
                    <th>Период</th>
                    <th>Дата</th>
                    <th>Чек</th>
                    <th>Статус</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map((payment) => {
                    const status = STATUS_CONFIG[payment.status];
                    const StatusIcon = status.icon;

                    return (
                      <tr key={payment.id}>
                        {/* USER */}
                        <td>
                          <div className={styles.user}>
                            <div className={styles.avatar}>
                              {payment.user.charAt(0)}
                            </div>

                            <div>
                              <strong>{payment.user}</strong>
                              <span>{payment.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* TARIFF */}
                        <td>
                          <span className={styles.tariff}>
                            {payment.tariff}
                          </span>
                        </td>

                        {/* PRICE */}
                        <td>
                          <strong className={styles.price}>
                            {formatPrice(payment.price)}
                          </strong>
                        </td>

                        {/* PERIOD */}
                        <td>
                          <div className={styles.period}>
                            <strong>{payment.period}</strong>

                            <span>
                              {payment.startDate} — {payment.endDate}
                            </span>
                          </div>
                        </td>

                        {/* DATE */}
                        <td>
                          <span className={styles.date}>
                            {payment.startDate}
                          </span>
                        </td>

                        {/* RECEIPT */}
                        <td>
                          <button
                            type="button"
                            className={styles.receiptButton}
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye />
                            Посмотреть
                          </button>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className={`${styles.status} ${styles.status_paid}`}
                          >
                            <StatusIcon />
                            {status.label}
                          </span>
                        </td>

                        {/* MORE */}
                        <td>
                          <button
                            type="button"
                            className={styles.moreButton}
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {!filteredPayments.length && (
                <div className={styles.empty}>
                  <CreditCard />

                  <strong>Платежи не найдены</strong>

                  <span>Попробуйте изменить параметры поиска.</span>
                </div>
              )}
            </div>
          </section>

          {/* MODAL */}
          {selectedPayment && (
            <div
              className={styles.overlay}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setSelectedPayment(null);
                }
              }}
            >
              <div className={styles.modal}>
                <div className={styles.modalHeader}>
                  <div>
                    <span>Платёж</span>

                    <h2>{selectedPayment.user}</h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPayment(null)}
                    className={styles.modalClose}
                  >
                    ×
                  </button>
                </div>

                <div className={styles.modalBody}>
                  {/* USER */}
                  <div className={styles.modalUser}>
                    <div className={styles.modalAvatar}>
                      {selectedPayment.user.charAt(0)}
                    </div>

                    <div>
                      <strong>{selectedPayment.user}</strong>
                      <span>{selectedPayment.email}</span>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className={styles.detailsGrid}>
                    <div>
                      <span>Тариф</span>
                      <strong>{selectedPayment.tariff}</strong>
                    </div>

                    <div>
                      <span>Стоимость</span>
                      <strong>{formatPrice(selectedPayment.price)}</strong>
                    </div>

                    <div>
                      <span>Период</span>
                      <strong>{selectedPayment.period}</strong>
                    </div>

                    <div>
                      <span>Начало</span>
                      <strong>{selectedPayment.startDate}</strong>
                    </div>

                    <div>
                      <span>Окончание</span>
                      <strong>{selectedPayment.endDate}</strong>
                    </div>

                    <div>
                      <span>Статус</span>

                      <strong>Оплачено</strong>
                    </div>
                  </div>

                  {/* RECEIPT */}
                  <div className={styles.receiptPreview}>
                    <div className={styles.receiptHeader}>
                      <div>
                        <CalendarDays />

                        <span>Чек об оплате</span>
                      </div>

                      <button type="button">
                        <Download />
                        Скачать
                      </button>
                    </div>

                    <div className={styles.receiptImage}>
                      <div>
                        <CreditCard />

                        <span>Здесь будет изображение чека</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
