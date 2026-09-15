"use client";

import { motion } from "framer-motion";
import { Search, MapPin, ShieldCheck, ArrowUpRight, Map } from "lucide-react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./Hero.module.css";

export default function Hero() {
  const router = useRouter();
  const { t } = useLanguage();

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
          {t("hero.location")}
        </div>

        <h1 className={styles.title}>
          UyTap.kg —
          <span className={styles.highlight}> {t("hero.titleAccent")}</span>
          <br />
          {t("hero.title")}
        </h1>

        <p className={styles.description}>{t("hero.description")}</p>

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.primary}
            onClick={() => {
              window.location.href = "/all-products";
            }}
          >
            <Search />
            {t("hero.findProperty")}
          </button>

          <button
            type="button"
            className={styles.secondary}
            onClick={() => router.push("/all-products")}
          >
            {t("hero.allListings")}
          </button>
        </div>

        <button
          type="button"
          className={styles.mapButton}
          onClick={() => router.push("/search-map")}
          aria-label={t("hero.map.ariaLabel")}
        >
          <span className={styles.mapIcon}>
            <Map />
          </span>

          <span className={styles.mapText}>
            <strong>{t("hero.map.title")}</strong>
            <small>{t("hero.map.description")}</small>
          </span>

          <ArrowUpRight className={styles.mapArrow} />
        </button>

        <button
          type="button"
          className={styles.safetyButton}
          onClick={() => router.push("/safety")}
          aria-label={t("hero.safety.ariaLabel")}
        >
          <span className={styles.safetyIcon}>
            <ShieldCheck />
          </span>

          <span className={styles.safetyText}>
            <strong>{t("hero.safety.title")}</strong>
            <small>{t("hero.safety.description")}</small>
          </span>

          <ArrowUpRight className={styles.safetyArrow} />
        </button>
      </motion.div>
    </section>
  );
}
