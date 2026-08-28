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
        {/* LOCATION */}

        <div className={styles.location}>
          <MapPin />
          Бишкек • Кыргызстан
        </div>

        {/* TITLE */}

        <h1 className={styles.title}>
          UyTap.kg —
          <span className={styles.highlight}> ваш надежный помощник</span>
          <br />в поиске недвижимости
        </h1>

        {/* DESCRIPTION */}

        <p className={styles.description}>
          Находите квартиры, дома и коммерческую недвижимость от проверенных
          застройщиков, владельцев и риэлторов.
        </p>

        {/* BUTTONS */}

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.primary}
            onClick={() => {
              window.location.href = "/#search";
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

        {/* MAP BUTTON */}

        <button
          type="button"
          className={styles.mapButton}
          onClick={() => router.push("/search-map")}
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

        {/* SAFETY */}

        <button
          type="button"
          className={styles.safetyButton}
          onClick={() => router.push("/safety")}
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
