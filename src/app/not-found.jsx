"use client";

import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, Sparkles } from "lucide-react";

import styles from "./not-found.module.css";
import Link from "next/link";

export default function NotFound() {
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
          UyTap
        </div>

        <h1 className={styles.number}>404</h1>

        <h2 className={styles.title}>
          Такой страницы
          <span> не существует</span>
        </h2>

        <p className={styles.description}>
          Возможно, объявление было удалено или ссылка больше не существует. Но
          ваш новый дом всё ещё ждёт вас.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            <Home />
            На главную
          </Link>

          <Link href="/main/#search" className={styles.secondaryButton}>
            <Search />
            Найти жильё
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
