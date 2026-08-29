"use client";


import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "./Users.module.css";

export default function UsersPage() {
  return (
    <div className={styles.page}>
      <Sidebar />

      <div className={styles.content}>
        <Header
          title="Пользователи"
          subtitle="Управление пользователями UYTap"
        />

        <main className={styles.main}>
          <div className={styles.placeholder}>
            Здесь будет список пользователей
          </div>
        </main>
      </div>
    </div>
  );
}
