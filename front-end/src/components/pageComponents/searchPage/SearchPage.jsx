"use client";

import { motion } from "framer-motion";
import { Sparkles, Home, Search, Building2, MapPin } from "lucide-react";

import SearchFilter from "../searchFilter/SearchFilter";

import styles from "./SearchPage.module.css";

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

        <div className={styles.stats}>
          <div className={styles.stat}>
            <Home />
            <div>
              <strong>10 000+</strong>
              <span>объектов</span>
            </div>
          </div>

          <div className={styles.stat}>
            <Building2 />
            <div>
              <strong>500+</strong>
              <span>застройщиков</span>
            </div>
          </div>

          <div className={styles.stat}>
            <MapPin />
            <div>
              <strong>8 регионов</strong>
              <span>Кыргызстана</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className={styles.filterWrapper}
        initial={{
          opacity: 0,
          y: 80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
          duration: 0.7,
        }}
      >
        <SearchFilter />
      </motion.div>
    </section>
  );
}
