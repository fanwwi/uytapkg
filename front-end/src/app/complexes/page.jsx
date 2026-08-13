"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Building2, MapPin, Search, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./Complexes.module.css";
import Footer from "@/components/pageComponents/footer/Footer";

const complexes = [
  {
    id: 1,
    name: "Avenue Residence",
    developer: "BI Group",
    address: "Бишкек, Асанбай",
    priceFrom: "120 000 $",
    priceTo: "350 000 $",
    description:
      "Современный жилой комплекс премиального класса с закрытой территорией, благоустроенным двором и развитой инфраструктурой.",
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
    description:
      "Элегантный городской комплекс в центральной части Бишкека с просторными квартирами и высоким уровнем приватности.",
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
    description:
      "Коллекция приватных вилл у Иссык-Куля для тех, кто ценит простор, природу и архитектуру премиального уровня.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxvLQC1rlyl1Ft34HMpKfUyVPRX8a4AIyTmKAsjnzL1jDPReKX4eORR_Qc&s=10",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGesScTZwcv1HweHeROAtnssGSDz8gzFxYJxF7AJd_vWSaZT_QABekZ-c&s=10",
  },
];

export default function Complexes() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const filteredComplexes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return complexes;
    }

    return complexes.filter((item) =>
      [
        item.name,
        item.developer,
        item.address,
        item.description,
        item.priceFrom,
        item.priceTo,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  return (
    <main className={styles.page}>
      {/* HERO */}

      <section className={styles.hero}>
        <div className={styles.heroImage} />

        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowIcon}>
              <Building2 />
            </span>

            <span>PREMIUM REAL ESTATE · KYRGYZSTAN</span>
          </div>

          <h1>
            Жилые комплексы,
            <br />
            <span>которые выбирают</span>
          </h1>

          <p className={styles.heroDescription}>
            Премиальные жилые комплексы от ведущих застройщиков Кыргызстана.
            Найдите пространство, которое соответствует вашему стилю жизни.
          </p>

          {/* SEARCH */}

          <div className={styles.searchBox}>
            <Search />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Название ЖК, застройщик, район..."
            />

            {search && (
              <button
                type="button"
                className={styles.clear}
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>

          <div className={styles.heroMeta}>
            <span>
              <i />
              Премиальные проекты
            </span>

            <span>
              <i />
              Проверенные застройщики
            </span>
          </div>
        </div>

        <div className={styles.heroBottomFade} />
      </section>

      {/* CONTENT */}

      <section className={styles.wrapper}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionLabel}>OUR COLLECTION</span>

            <h2>Жилые комплексы</h2>

            <p>Подобрали лучшие проекты недвижимости в Кыргызстане</p>
          </div>

          <div className={styles.counter}>
            <strong>{filteredComplexes.length}</strong>
            <span>проекта</span>
          </div>
        </div>

        {/* SEARCH RESULT */}

        {search && (
          <div className={styles.searchResult}>
            <Search />

            <span>
              Результаты поиска для <strong>«{search}»</strong>
            </span>

            <button type="button" onClick={() => setSearch("")}>
              Сбросить
            </button>
          </div>
        )}

        {/* GRID */}

        {filteredComplexes.length > 0 ? (
          <div className={styles.grid}>
            {filteredComplexes.map((item, index) => (
              <article
                className={styles.card}
                key={item.id}
                onClick={() => router.push(`/complexes/${item.id}`)}
              >
                {/* IMAGE */}

                <div className={styles.photo}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px"
                  />

                  <div className={styles.photoOverlay} />

                  <div className={styles.projectNumber}>0{index + 1}</div>

                  <div className={styles.premiumBadge}>
                    <span />
                    PREMIUM
                  </div>
                </div>

                {/* CONTENT */}

                <div className={styles.content}>
                  <div className={styles.titleRow}>
                    <div>
                      <span className={styles.projectType}>RESIDENTIAL</span>

                      <h3>{item.name}</h3>
                    </div>
                  </div>

                  {/* LOCATION */}

                  <div className={styles.location}>
                    <MapPin />

                    <span>{item.address}</span>
                  </div>

                  {/* DESCRIPTION */}

                  <p className={styles.description}>{item.description}</p>

                  {/* PRICE */}

                  <div className={styles.priceBlock}>
                    <div className={styles.priceIcon}>
                      <Wallet />
                    </div>

                    <div>
                      <span>Стоимость квартир</span>

                      <strong>
                        {item.priceFrom}
                        <small> — </small>
                        {item.priceTo}
                      </strong>
                    </div>
                  </div>

                  {/* DEVELOPER */}

                  <div className={styles.developer}>
                    <div className={styles.logo}>
                      <Image
                        src={item.logo}
                        width={52}
                        height={52}
                        alt={item.developer}
                      />
                    </div>

                    <div>
                      <span>Застройщик</span>

                      <strong>{item.developer}</strong>
                    </div>
                  </div>

                  {/* BUTTON */}

                  <button
                    type="button"
                    className={styles.more}
                    onClick={(e) => {
                      e.stopPropagation();

                      router.push(`/complexes/${item.id}`);
                    }}
                  >
                    <span>Подробнее о проекте</span>

                    <span className={styles.arrow}>
                      <ArrowRight />
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Search />
            </div>

            <span className={styles.sectionLabel}>NO RESULTS</span>

            <h3>Ничего не найдено</h3>

            <p>
              Мы не нашли жилые комплексы по вашему запросу. Попробуйте изменить
              название, район или застройщика.
            </p>

            <button type="button" onClick={() => setSearch("")}>
              Показать все проекты
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
