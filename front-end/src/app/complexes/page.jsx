"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Building2, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./Complexes.module.css";
import Footer from "@/components/pageComponents/footer/Footer";
import Header from "@/components/pageComponents/header/Header";
import AdBanner from "@/components/pageComponents/addBanner/AdBanner";

import { getComplexes } from "@/utils/api";
import { mapComplexData } from "@/utils/mapComplexData";

const DEFAULT_DEVELOPER_LOGO = "/assets/DeveloperImage.png";

const DEFAULT_COMPLEX_IMAGE = "/assets/ComplexImage.png";

export default function Complexes() {
  const router = useRouter();
  const { t } = useLanguage();

  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadComplexes() {
      try {
        setLoading(true);
        setError("");

        const res = await getComplexes();

        console.log("========== COMPLEXES API ==========");
        console.log("FULL RESPONSE:", res);
        console.log("DATA:", res?.data);

        if (!mounted) return;

        if (res?.success && Array.isArray(res?.data)) {
          const mapped = res.data
            .map((item) => {
              const complex = mapComplexData(item);

              /*
               * На случай, если mapComplexData
               * не возвращает logo.
               *
               * Пробуем несколько возможных
               * полей API.
               */
              const developerLogo =
                item?.avatarUrl ||
                item?.logo_url ||
                item?.developer?.avatarUrl ||
                item?.developer?.logo_url ||
                complex?.logo ||
                DEFAULT_DEVELOPER_LOGO;

              return {
                ...complex,

                image:
                  complex?.image ||
                  item?.image ||
                  item?.imageUrl ||
                  item?.image_url ||
                  DEFAULT_COMPLEX_IMAGE,

                logo: developerLogo,
              };
            })
            .filter((item) => item?.id);

          console.log("========== MAPPED COMPLEXES ==========");
          console.log(mapped);

          setComplexes(mapped);
        } else {
          setComplexes([]);
        }
      } catch (err) {
        console.error("Failed to load complexes:", err);

        if (mounted) {
          setError(err?.message || t("complexes.errors.load"));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadComplexes();

    return () => {
      mounted = false;
    };
  }, [t]);

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
        item.class,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [complexes, search]);

  const handleImageError = (event, fallback) => {
    const image = event.currentTarget;

    /*
     * Если уже пытаемся загрузить fallback,
     * ничего больше не делаем.
     */
    if (image.src.includes(fallback)) {
      return;
    }

    image.src = fallback;
  };

  return (
    <main className={styles.page}>
      <Header />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className={styles.hero}>
        <div className={styles.heroImage} />

        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowIcon}>
              <Building2 />
            </span>

            <span>{t("complexes.eyebrow")}</span>
          </div>

          <h1>
            {t("complexes.heroTitle")}
            <br />

            <span>{t("complexes.heroTitleAccent")}</span>
          </h1>

          <p className={styles.heroDescription}>
            {t("complexes.heroDescription")}
          </p>

          {/* SEARCH */}

          <div className={styles.searchBox}>
            <Search />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("complexes.searchPlaceholder")}
            />

            {search && (
              <button
                type="button"
                className={styles.clear}
                onClick={() => setSearch("")}
                aria-label={t("complexes.reset")}
              >
                ×
              </button>
            )}
          </div>

          <div className={styles.heroMeta}>
            <span>
              <i />

              {t("complexes.meta.premium")}
            </span>

            <span>
              <i />

              {t("complexes.meta.verified")}
            </span>
          </div>
        </div>

        <div className={styles.heroBottomFade} />
      </section>

      <AdBanner />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className={styles.wrapper}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionLabel}>
              {t("complexes.collection")}
            </span>

            <h2>{t("complexes.title")}</h2>

            <p>{t("complexes.subtitle")}</p>
          </div>

          <div className={styles.counter}>
            <strong>{filteredComplexes.length}</strong>

            <span>{t("complexes.projects")}</span>
          </div>
        </div>

        {/* =================================================
            SEARCH RESULT
        ================================================= */}

        {search && (
          <div className={styles.searchResult}>
            <Search />

            <span>
              {t("complexes.searchResult")} <strong>«{search}»</strong>
            </span>

            <button type="button" onClick={() => setSearch("")}>
              {t("complexes.reset")}
            </button>
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className={styles.empty}>
            <p>{t("complexes.loading")}</p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className={styles.empty}>
            <p
              style={{
                color: "#e53e3e",
              }}
            >
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            GRID
        ================================================= */}

        {!loading && !error && filteredComplexes.length > 0 && (
          <div className={styles.grid}>
            {filteredComplexes.map((item, index) => (
              <article
                className={styles.card}
                key={item.id}
                onClick={() => router.push(`/complexes/${item.id}`)}
              >
                {/* =====================================
                        COMPLEX IMAGE
                    ===================================== */}

                <div className={styles.photo}>
                  <Image
                    src={item.image || DEFAULT_COMPLEX_IMAGE}
                    alt={item.name || "Жилой комплекс"}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px"
                    onError={(event) =>
                      handleImageError(event, DEFAULT_COMPLEX_IMAGE)
                    }
                  />

                  <div className={styles.photoOverlay} />

                  <div className={styles.projectNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className={styles.premiumBadge}>
                    <span />

                    {item.housingClass}
                  </div>
                </div>

                {/* =====================================
                        CONTENT
                    ===================================== */}

                <div className={styles.content}>
                  <div className={styles.titleRow}>
                    <div>
                      <span className={styles.projectType}>
                        {t("complexes.projectType")}
                      </span>

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

                  {/* =================================
                          DEVELOPER
                      ================================= */}

                  <div className={styles.developer}>
                    <div className={styles.logo}>
                      <Image
                        src={item.logo || DEFAULT_DEVELOPER_LOGO}
                        width={52}
                        height={52}
                        alt={item.developer || "Developer"}
                        unoptimized
                        onError={(event) =>
                          handleImageError(event, DEFAULT_DEVELOPER_LOGO)
                        }
                      />
                    </div>

                    <div>
                      <span>{t("complexes.developer")}</span>

                      <strong>{item.developer}</strong>
                    </div>
                  </div>

                  {/* =================================
                          BUTTON
                      ================================= */}

                  <button
                    type="button"
                    className={styles.more}
                    onClick={(e) => {
                      e.stopPropagation();

                      router.push(`/complexes/${item.id}`);
                    }}
                  >
                    <span>{t("complexes.more")}</span>

                    <span className={styles.arrow}>
                      <ArrowRight />
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading && !error && filteredComplexes.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Search />
            </div>

            <span className={styles.sectionLabel}>
              {t("complexes.noResults")}
            </span>

            <h3>{t("complexes.empty.title")}</h3>

            <p>{t("complexes.empty.description")}</p>

            <button type="button" onClick={() => setSearch("")}>
              {t("complexes.showAll")}
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
