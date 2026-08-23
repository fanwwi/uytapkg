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
        <h1 className={styles.title} id="search">
          Умный поиск
          <br />
          <span>недвижимости</span>
        </h1>

        <SearchFilter
          onSearch={(filters) => {
            console.log("Отправляем на backend:", filters);
          }}
        />
      </motion.div>
    </section>
  );
}
