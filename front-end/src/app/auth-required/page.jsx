"use client";

import Link from "next/link";
import { LockKeyhole, ArrowLeft, LogIn } from "lucide-react";

import styles from "./AuthRequired.module.css";

export default function AuthRequired() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <LockKeyhole />
        </div>

        <h1>Требуется вход</h1>

        <p>
          Чтобы пользоваться избранным, добавлять объявления и управлять
          профилем, необходимо войти в аккаунт.
        </p>

        <div className={styles.buttons}>
          <Link href="/login" className={styles.login}>
            <LogIn />
            Войти в аккаунт
          </Link>

          <Link href="/" className={styles.home}>
            <ArrowLeft />
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
