"use client";

import Link from "next/link";
import { LockKeyhole, ArrowLeft, LogIn } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./AuthRequired.module.css";

export default function AuthRequired() {
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <LockKeyhole />
        </div>

        <h1>{t("authRequired.title")}</h1>

        <p>{t("authRequired.description")}</p>

        <div className={styles.buttons}>
          <Link href="/login" className={styles.login}>
            <LogIn />
            {t("authRequired.login")}
          </Link>

          <Link href="/" className={styles.home}>
            <ArrowLeft />
            {t("authRequired.home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
