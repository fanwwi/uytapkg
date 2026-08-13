"use client";

import { Search, Plus, Waves } from "lucide-react";

import styles from "./IssykKul.module.css";

import Footer from "@/components/pageComponents/footer/Footer";
import IssykKulSearchFilter from "./issyKulFilters/IssykKulFilters";
import { useRouter } from "next/navigation";

export default function IssykKul() {
  const router = useRouter();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Waves />
            Недвижимость Иссык-Куля
          </div>

          <h1>
            Ваш дом
            <br />у самого озера
          </h1>

          <p>
            Покупка, аренда и инвестиции. Дома, коттеджи, гостевые дома и
            участки в лучших районах Кыргызстана.
          </p>

          <div className={styles.buttons}>
            <a
              type="button"
              className={styles.mainButton}
              onClick={() => router.push("/all-issykkul-products")}
            >
              Смотреть объекты Иссык-Куля
            </a>

            <button
              type="button"
              className={styles.whiteButton}
              onClick={() => router.push("/add-product")}
            >
              <span>
                <Plus />
              </span>
              Разместить объект
            </button>
          </div>
        </div>
      </section>

      <section className={styles.filter} id="searchIssykKul">
        <IssykKulSearchFilter />
      </section>

      <Footer />
    </main>
  );
}
