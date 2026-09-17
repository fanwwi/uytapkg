"use client";

import { motion } from "framer-motion";
import { Home, Search, Sparkles } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./not-found.module.css";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      <motion.div
        className={styles.card}
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
      >
        <div className={styles.iconBox}>
          <Home />
        </div>

        <div className={styles.badge}>
          <Sparkles />
          {t("notFound.badge")}
        </div>

        <h1 className={styles.number}>404</h1>

        <h2 className={styles.title}>
          {t("notFound.title")}
          <span>{t("notFound.titleAccent")}</span>
        </h2>

        <p className={styles.description}>{t("notFound.description")}</p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            <Home />
            {t("notFound.home")}
          </Link>

          <Link href="/main/#search" className={styles.secondaryButton}>
            <Search />
            {t("notFound.search")}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
