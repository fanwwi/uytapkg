"use client";

import { motion } from "framer-motion";
import { Sparkles, Home, Building2, MapPin } from "lucide-react";

import styles from "./SearchPage.module.css";
import SearchFilter from "./SearchFilter/SerachFilter";

export default function SearchPage() {
  return (
    <section className={styles.page} id="search">
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />
      <div className={styles.grid} />

      <motion.div
        className={styles.hero}
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
      >
        <div className={styles.badge}>
          <Sparkles />
          Умный поиск недвижимости
        </div>

        <h1 className={styles.title}>
          Найдите место,
          <br />
          которое станет
          <span>вашим домом</span>
        </h1>

        <p className={styles.subtitle}>
          Тысячи квартир, домов и коммерческих объектов. Используйте умные
          фильтры UyTap и найдите недвижимость мечты быстрее.
        </p>

        <SearchFilter
          onSearch={(filters) => {
            console.log("Отправляем на backend:", filters);
          }}
        />
      </motion.div>
    </section>
  );
}
