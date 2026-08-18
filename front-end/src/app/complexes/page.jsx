"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Building2, MapPin, Search, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./Complexes.module.css";
import Footer from "@/components/pageComponents/footer/Footer";
import { getComplexes } from "@/utils/api";
import { mapComplexData } from "@/utils/mapComplexData";

export default function Complexes() {
  const router = useRouter();

  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadComplexes() {
      try {
        setLoading(true);
        setError("");
        const res = await getComplexes();
        if (res && res.success && Array.isArray(res.data)) {
          const mapped = res.data.map(mapComplexData);
          setComplexes(mapped);
        } else {
          setComplexes([]);
        }
      } catch (err) {
        console.error("Failed to load complexes:", err);
        setError(err.message || "Ошибка при загрузке жилых комплексов");
      } finally {
        setLoading(false);
      }
    }

    loadComplexes();
  }, []);

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
        item.class
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [complexes, search]);

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

          <button
            type="button"
            className={styles.homeButton}
            onClick={() => router.push("/")}
          >
            На главную
          </button>

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

        {/* LOADING & ERROR */}
        {loading && (
          <div className={styles.empty}>
            <p>Загрузка жилых комплексов...</p>
          </div>
        )}

        {error && (
          <div className={styles.empty}>
            <p style={{ color: "#e53e3e" }}>{error}</p>
          </div>
        )}

        {/* GRID */}

        {!loading && !error && filteredComplexes.length > 0 ? (
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
                    {item.housingClass}
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
