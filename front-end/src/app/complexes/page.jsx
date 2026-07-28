"use client";

import { useState } from "react";
import Image from "next/image";

import { Search, MapPin, Wallet, ArrowRight, Building2 } from "lucide-react";

import styles from "./Complexes.module.css";
import Footer from "@/pageComponents/footer/Footer";

const complexes = [
  {
    id: 1,
    name: "Avenue Residence",
    developer: "BI Group",
    address: "Бишкек, Асанбай",
    priceFrom: "120 000 $",
    priceTo: "350 000 $",
    image:
      "https://storage.googleapis.com/bd-kg-02/buildings-v2/800x630/2336.jpg",
    logo: "https://yt3.googleusercontent.com/dd6jiK-pM4c-OpIys_CbeZAnr1CgKBWOx9cUgHMx5yNTOKcfmnx_Cgmi53ucme32vcNm3MuETA=s900-c-k-c0x00ffffff-no-rj",
  },

  {
    id: 2,
    name: "Royal Park",
    developer: "Elite Development",
    address: "Бишкек, центр",
    priceFrom: "150 000 $",
    priceTo: "500 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3bLPug9XO4Cc_IQLfIZqk6TW2SyltDnPMWbp5Lc7_S-FhvDYWeIkfRQ8&s=10",
    logo: "https://media.licdn.com/dms/image/v2/D4D0BAQED2Dra3BJ-Dw/company-logo_200_200/company-logo_200_200/0/1667350407993/elitemd_logo?e=2147483647&v=beta&t=BzMu9fKnwHvGTL-Rgy1aoIzEXJUGWOyivkYbbH3cmT4",
  },

  {
    id: 3,
    name: "Issyk Lake Villas",
    developer: "Lake Group",
    address: "Иссык-Куль",
    priceFrom: "200 000 $",
    priceTo: "700 000 $",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxvLQC1rlyl1Ft34HMpKfUyVPRX8a4AIyTmKAsjnzL1jDPReKX4eORR_Qc&s=10",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGesScTZwcv1HweHeROAtnssGSDz8gzFxYJxF7AJd_vWSaZT_QABekZ-c&s=10",
  },
];

export default function Complexes() {
  const [search, setSearch] = useState("");

  const filtered = complexes.filter((item) =>
    `${item.name} ${item.developer}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroImage} />

        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <Building2 />
            Новостройки Кыргызстана
          </span>

          <h1>
            Найдите пространство,
            <br />
            которое станет вашим
          </h1>

          <p>
            Премиальные жилые комплексы и современные пространства от лучших
            застройщиков Кыргызстана.
          </p>

          <div className={styles.searchBox}>
            <Search />

            <input
              placeholder="Поиск ЖК или застройщика"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.wrapper}>
        <div className={styles.heading}>
          <h2>Жилые комплексы</h2>
        </div>

        <div className={styles.grid}>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div className={styles.card} key={item.id}>
                <div className={styles.photo}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                  />

                  <div className={styles.photoGradient} />
                </div>

                <div className={styles.content}>
                  <h3>{item.name}</h3>

                  <div className={styles.location}>
                    <MapPin />
                    {item.address}
                  </div>

                  <div className={styles.price}>
                    <Wallet />

                    <div>
                      <span>Цена квартиры</span>

                      <strong>
                        {item.priceFrom} - {item.priceTo}
                      </strong>
                    </div>
                  </div>

                  <div className={styles.developer}>
                    <Image
                      src={item.logo}
                      width={55}
                      height={55}
                      alt={item.developer}
                    />

                    <div>
                      <small>Застройщик</small>
                      <p>{item.developer}</p>
                    </div>
                  </div>

                  <button>
                    Подробнее
                    <ArrowRight />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>
              <Search />

              <h3>Ничего не найдено</h3>

              <p>
                По вашему запросу нет жилых комплексов.
                <br />
                Попробуйте изменить название ЖК или застройщика.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
