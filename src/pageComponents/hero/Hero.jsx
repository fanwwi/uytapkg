"use client";

import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";

import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>

      <motion.div
        className={styles.content}
        initial={{
          opacity: 0,
          y: 60,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <div className={styles.location}>
          <MapPin />
          Бишкек • Кыргызстан
        </div>

        <h1 className={styles.title}>
          UyTap.kg —
          <span className={styles.highlight}> ваш надежный помощник</span>
          <br />в поиске недвижимости
        </h1>

        <p className={styles.description}>
          Находите квартиры, дома и коммерческую недвижимость от проверенных
          застройщиков, владельцев и риэлторов.
        </p>

        <div className={styles.buttons}>
          <button className={styles.primary}>
            <Search />
            Найти недвижимость
          </button>

          <button className={styles.secondary}>Разместить объявление</button>
        </div>
      </motion.div>
    </section>
  );
}
