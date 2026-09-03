"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Building2, CheckCircle2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getDevelopers } from "@/utils/api";

import styles from "./Developers.module.css";
import Footer from "@/components/pageComponents/footer/Footer";
import Header from "@/components/pageComponents/header/Header";

export default function Developers() {
  const router = useRouter();

  const [developersList, setDevelopersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getDevelopers();

        console.log("========== DEVELOPERS API ==========");
        console.log("FULL RESPONSE:", res);
        console.log("DATA:", res?.data);

        if (!mounted) return;

        if (res?.success && Array.isArray(res?.data)) {
          const mapped = res.data
            .map((dev) => ({
              id: dev?.user_id || dev?.id,
              nameRu: dev?.company_name || "Застройщик",
              nameEn: dev?.company_name || "Застройщик",

              objects: Array.isArray(dev?.residential_complexes)
                ? dev.residential_complexes.length
                : 0,

              logo: dev?.avatarUrl || dev?.logo_url || "/assets/DeveloperImage.png",

              isVerified: dev?.verificationStatus === "approved",
            }))
            .filter((dev) => dev.id);

          setDevelopersList(mapped);
        } else {
          setError(res?.message || "Ошибка загрузки застройщиков");
        }
      } catch (err) {
        console.error("Fetch developers error:", err);

        if (mounted) {
          setError("Ошибка при получении списка застройщиков");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDevelopers();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return developersList;
    }

    return developersList.filter(
      (item) =>
        item.nameRu?.toLowerCase().includes(query) ||
        item.nameEn?.toLowerCase().includes(query),
    );
  }, [search, developersList]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.loadingIcon}>
            <Building2 />
          </div>

          <h2>Загрузка списка застройщиков...</h2>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.errorIcon}>
            <Building2 />
          </div>

          <h2>Ошибка загрузки застройщиков</h2>

          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Header />

      <section className={styles.header}>
        <div className={styles.headerGlow} />

        <div className={styles.headerContent}>
          <div className={styles.headerMain}>
            <div className={styles.btns}>
              <span className={styles.eyebrow}>
                <Building2 />
                Застройщики Кыргызстана
              </span>
            </div>

            <h1>
              Найдите своего
              <span> застройщика</span>
            </h1>

            <p>
              Изучайте строительные компании, их проекты и выбирайте надежного
              застройщика для будущего дома.
            </p>
          </div>

          <div className={styles.headerStat}>
            <div className={styles.statNumber}>{developersList.length}</div>

            <div className={styles.statText}>
              <span>застройщиков</span>
              <small>на UyTap</small>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarTitle}>
            <span>КАТАЛОГ</span>

            <h2>Застройщики</h2>
          </div>

          <div className={styles.search}>
            <Search />

            <input
              type="text"
              placeholder="Поиск застройщика..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                className={styles.clear}
                onClick={() => setSearch("")}
                aria-label="Очистить поиск"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className={styles.result}>
          <span>Найдено</span>

          <strong>{filtered.length}</strong>

          <span>
            {filtered.length === 1
              ? "застройщик"
              : filtered.length >= 2 && filtered.length <= 4
                ? "застройщика"
                : "застройщиков"}
          </span>
        </div>

        {filtered.length > 0 ? (
          <section className={styles.grid}>
            {filtered.map((item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.cardMain}>
                  <div className={styles.logoBox}>
                    {item.logo ? (
                      <Image
                        src={item.logo}
                        fill
                        sizes="64px"
                        alt={item.nameEn}
                        className={styles.logoImage}
                      />
                    ) : (
                      <Building2 />
                    )}
                  </div>

                  <div className={styles.cardTitle}>
                    <h2>
                      {item.nameEn}

                      {item.isVerified && (
                        <CheckCircle2
                          className={styles.verifiedIcon}
                          aria-label="Проверенный застройщик"
                        />
                      )}
                    </h2>

                    {item.nameRu !== item.nameEn && <p>{item.nameRu}</p>}
                  </div>
                </div>

                <div className={styles.cardBottom}>
                  <span>
                    {item.objects}{" "}
                    {item.objects === 1
                      ? "жилой проект"
                      : item.objects >= 2 && item.objects <= 4
                        ? "жилых проекта"
                        : "жилых проектов"}
                  </span>

                  <button
                    type="button"
                    className={styles.projects}
                    onClick={() => router.push(`/public-profile/${item.id}`)}
                    aria-label={`Открыть профиль ${item.nameEn}`}
                  >
                    <ArrowRight />
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Search />
            </div>

            <span className={styles.sectionLabel}>NO RESULTS</span>

            <h2>Застройщик не найден</h2>

            <p>Попробуйте изменить поисковый запрос.</p>

            {search && (
              <button type="button" onClick={() => setSearch("")}>
                Показать всех застройщиков
              </button>
            )}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
