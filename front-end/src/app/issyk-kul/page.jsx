"use client";

import {
  MapPin,
  Home,
  Building2,
  Hotel,
  Trees,
  Search,
  Plus,
  Waves,
  Sun,
  Mountain,
  TrendingUp,
  Umbrella,
  ArrowRight,
} from "lucide-react";

import styles from "./IssykKul.module.css";

import IssykKulFilter from "./issykKulFilters/IssykKulFilter";
import Footer from "@/pageComponents/footer/Footer";

const zones = [
  {
    name: "Чолпон-Ата",
    count: "325 объектов",
    image: "/images/issyk/cholpon.jpg",
    text: "Центр отдыха, инфраструктура, пляжи",
  },
  {
    name: "Бостери",
    count: "214 объектов",
    image: "/images/issyk/bosteri.jpg",
    text: "Популярная курортная зона",
  },
  {
    name: "Кара-Ой",
    count: "187 объектов",
    image: "/images/issyk/karaoy.jpg",
    text: "Тихое место рядом с озером",
  },
  {
    name: "Тамчы",
    count: "132 объекта",
    image: "/images/issyk/tamchy.jpg",
    text: "Близость к аэропорту",
  },
];

const categories = [
  {
    icon: Home,
    title: "Дома и дачи",
    count: "450+ объектов",
  },
  {
    icon: Building2,
    title: "Коттеджи",
    count: "280+ объектов",
  },
  {
    icon: Hotel,
    title: "Гостевые дома",
    count: "170+ объектов",
  },
  {
    icon: Trees,
    title: "Участки",
    count: "320+ объектов",
  },
];

const benefits = [
  {
    icon: Sun,
    title: "300 солнечных дней",
    text: "Комфортный климат для жизни и отдыха",
  },
  {
    icon: Mountain,
    title: "Горы + озеро",
    text: "Уникальная природа региона",
  },
  {
    icon: TrendingUp,
    title: "Рост цены",
    text: "Перспективный рынок недвижимости",
  },
  {
    icon: Umbrella,
    title: "Туризм",
    text: "Высокий спрос на аренду",
  },
];

export default function IssykKul() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>

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
            <a className={styles.mainButton} href="#searchIssykKul">
              <span>
                <Search />
              </span>
              Найти объект
            </a>

            <button className={styles.whiteButton}>
              <span>
                <Plus />
              </span>
              Разместить объект
            </button>
          </div>
        </div>
      </section>

      <section className={styles.filter} id="searchIssykKul">
        <IssykKulFilter />
      </section>

      <Footer />
    </main>
  );
}
