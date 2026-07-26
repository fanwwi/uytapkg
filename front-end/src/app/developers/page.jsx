"use client";

import { useState } from "react";
import Image from "next/image";

import { Search, Building2, Home, ArrowRight } from "lucide-react";

import styles from "./Developers.module.css";

import Footer from "@/pageComponents/footer/Footer";

const developers = [
  {
    id: 1,
    name: "BI Group",
    objects: 24,
    logo: "https://yt3.googleusercontent.com/dd6jiK-pM4c-OpIys_CbeZAnr1CgKBWOx9cUgHMx5yNTOKcfmnx_Cgmi53ucme32vcNm3MuETA=s900-c-k-c0x00ffffff-no-rj",
  },

  {
    id: 2,
    name: "Elite Development",
    objects: 12,
    logo: null,
  },

  {
    id: 3,
    name: "KG Build",
    objects: 18,
    logo: null,
  },

  {
    id: 4,
    name: "Nova Construction",
    objects: 9,
    logo: "https://cdn.house.kg/house/builders/356c70709b19646b81f69f869a383ca9.jpg",
  },

  {
    id: 5,
    name: "Ala-Archa Residence",
    objects: 7,
    logo: null,
  },
];

export default function Developers() {
  const [search, setSearch] = useState("");

  const filtered = developers.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <Building2 />
            Проверенные застройщики
          </span>

          <h1>
            Найдите надежного
            <br />
            застройщика для своего дома
          </h1>

          <p>
            Изучайте проекты ведущих строительных компаний Кыргызстана и
            выбирайте свой будущий дом.
          </p>

          <div className={styles.search}>
            <Search />

            <input
              placeholder="Поиск застройщика..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.heading}>
          <h2>Все застройщики</h2>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <Building2 />

            <h3>Ничего не найдено</h3>

            <p>Попробуйте изменить запрос</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((item) => (
              <div className={styles.card} key={item.id}>
                <div className={styles.logoBox}>
                  {item.logo ? (
                    <Image
                      src={item.logo}
                      width={90}
                      height={90}
                      alt={item.name}
                    />
                  ) : (
                    <Building2 />
                  )}
                </div>

                <h3>{item.name}</h3>

                <div className={styles.info}>
                  <Home />

                  <span>{item.objects} объектов</span>
                </div>

                <button>
                  Смотреть проекты
                  <ArrowRight />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
