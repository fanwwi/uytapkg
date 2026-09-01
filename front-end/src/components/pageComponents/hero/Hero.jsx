"use client";

import { motion } from "framer-motion";
import { Search, MapPin, ShieldCheck, ArrowUpRight, Map } from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./Hero.module.css";

export default function Hero() {
  const router = useRouter();

  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.glow} />

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
          <button
            type="button"
            className={styles.primary}
            onClick={() => {
              window.location.href = "/all-products";
            }}
          >
            <Search />
            Найти недвижимость
          </button>

          <button
            type="button"
            className={styles.secondary}
            onClick={() => router.push("/all-products")}
          >
            Смотреть все объявления
          </button>
        </div>

        <button
          type="button"
          className={styles.mapButton}
          onClick={() => router.push("/search-map")}
          aria-label="Искать объекты на карте"
        >
          <span className={styles.mapIcon}>
            <Map />
          </span>

          <span className={styles.mapText}>
            <strong>Искать объекты на карте</strong>
            <small>Найдите недвижимость рядом с вами</small>
          </span>

          <ArrowUpRight className={styles.mapArrow} />
        </button>

        <button
          type="button"
          className={styles.safetyButton}
          onClick={() => router.push("/safety")}
          aria-label="Безопасность при покупке недвижимости"
        >
          <span className={styles.safetyIcon}>
            <ShieldCheck />
          </span>

          <span className={styles.safetyText}>
            <strong>Безопасность</strong>
            <small>Как не стать жертвой мошенников</small>
          </span>

          <ArrowUpRight className={styles.safetyArrow} />
        </button>
      </motion.div>
    </section>
  );
}
