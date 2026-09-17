"use client";

import Link from "next/link";
import { CheckCircle, LogIn, Home } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./SuccessRegister.module.css";

export default function SuccessRegister() {
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <CheckCircle />
        </div>

        <h1>{t("successRegister.title")}</h1>

        <p>
          {t("successRegister.description")}
          <br />
          {t("successRegister.descriptionSecond")}
        </p>

        <div className={styles.actions}>
          <Link href="/login" className={styles.login}>
            <LogIn />
            {t("successRegister.login")}
          </Link>

          <Link href="/" className={styles.home}>
            <Home />
            {t("successRegister.home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
