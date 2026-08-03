"use client";

import Link from "next/link";
import { CheckCircle, LogIn, Home } from "lucide-react";

import styles from "./SuccessRegister.module.css";

export default function SuccessRegister() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <CheckCircle />
        </div>

        <h1>Регистрация успешно завершена 🎉</h1>

        <p>
          Ваш аккаунт был успешно создан.
          <br />
          Теперь войдите в профиль, чтобы получить доступ ко всем функциям
          UyTap.
        </p>

        <div className={styles.actions}>
          <Link href="/login" className={styles.login}>
            <LogIn />
            Войти в профиль
          </Link>

          <Link href="/" className={styles.home}>
            <Home />
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
