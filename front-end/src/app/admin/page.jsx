"use client";

import Link from "next/link";
import { Users, CreditCard, Image, Scale, ArrowUpRight } from "lucide-react";

import styles from "./Admin.module.css";
import StatCard from "./components/StatCard/StatCard";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

const stats = [
  {
    title: "Новые пользователи",
    value: "1 284",
    icon: Users,
  },
  {
    title: "Оплаты",
    value: "324",
    icon: CreditCard,
  },
  {
    title: "Баннеры",
    value: "18",
    icon: Image,
  },
  {
    title: "Юристы",
    value: "12",
    icon: Scale,
  },
];

const sections = [
  {
    title: "Оплаты",
    description: "Тарифы, чеки и платежи",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Баннеры",
    description: "Управление рекламными баннерами",
    href: "/admin/banners",
    icon: Image,
  },
  {
    title: "Юристы",
    description: "Добавление и управление юристами",
    href: "/admin/lawyers",
    icon: Scale,
  },
];

export default function AdminPage() {
  return (
    <div className={styles.admin}>
      <Sidebar />

      <div className={styles.content}>
        <Header
          title="Dashboard"
          subtitle="Обзор работы UYTap за последние 30 дней"
        />

        <main className={styles.main}>
          <section className={styles.period}>
            <div>
              <span>Период статистики</span>
              <strong>Последние 30 дней</strong>
            </div>
          </section>

          <section className={styles.stats}>
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Управление</h2>
                <p>Основные разделы административной панели</p>
              </div>
            </div>

            <div className={styles.sectionGrid}>
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <Link
                    key={section.title}
                    href={section.href}
                    className={styles.sectionItem}
                  >
                    <div className={styles.sectionIcon}>
                      <Icon />
                    </div>

                    <div className={styles.sectionInfo}>
                      <strong>{section.title}</strong>
                      <span>{section.description}</span>
                    </div>

                    <ArrowUpRight className={styles.arrow} />
                  </Link>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
