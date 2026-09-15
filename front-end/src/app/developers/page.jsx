"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Building2, CheckCircle2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getDevelopers } from "@/utils/api";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./Developers.module.css";
import Footer from "@/components/pageComponents/footer/Footer";
import Header from "@/components/pageComponents/header/Header";
import AdBanner from "@/components/pageComponents/addBanner/AdBanner";

export default function Developers() {
  const router = useRouter();
  const { t } = useLanguage();

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
            .filter((dev) => dev?.verificationStatus === "approved")
            .map((dev) => ({
              id: dev?.user_id || dev?.id,
              name: dev?.company_name || "",
              objects: Array.isArray(dev?.residential_complexes)
                ? dev.residential_complexes.length
                : 0,
              logo:
                dev?.avatarUrl || dev?.logo_url || "/assets/DeveloperImage.png",
              isVerified: true,
            }))
            .filter((dev) => dev.id);

          setDevelopersList(mapped);
        } else {
          setError(res?.message || null);
        }
      } catch (err) {
        console.error("Fetch developers error:", err);

        if (mounted) {
          setError(null);
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

    return developersList.filter((item) =>
      item.name?.toLowerCase().includes(query),
    );
  }, [search, developersList]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.loadingIcon}>
            <Building2 />
          </div>

          <h2>{t("developers.loading")}</h2>
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

          <h2>{t("developers.errorTitle")}</h2>

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
                {t("developers.eyebrow")}
              </span>
            </div>

            <h1>
              {t("developers.title")}
              <span> {t("developers.titleAccent")}</span>
            </h1>

            <p>{t("developers.description")}</p>
          </div>

          <div className={styles.headerStat}>
            <div className={styles.statNumber}>{developersList.length}</div>

            <div className={styles.statText}>
              <span>{t("developers.developers")}</span>
              <small>{t("developers.onUyTap")}</small>
            </div>
          </div>
        </div>
      </section>

      <AdBanner />

      <section className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarTitle}>
            <span>{t("developers.catalog")}</span>

            <h2>{t("developers.titleShort")}</h2>
          </div>

          <div className={styles.search}>
            <Search />

            <input
              type="text"
              placeholder={t("developers.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                className={styles.clear}
                onClick={() => setSearch("")}
                aria-label={t("developers.clearSearch")}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className={styles.result}>
          <span>{t("developers.found")}</span>

          <strong>{filtered.length}</strong>

          <span>
            {filtered.length === 1
              ? t("developers.developer.one")
              : filtered.length >= 2 && filtered.length <= 4
                ? t("developers.developer.few")
                : t("developers.developer.many")}
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
                        alt={item.name || t("developers.defaultName")}
                        className={styles.logoImage}
                      />
                    ) : (
                      <Building2 />
                    )}
                  </div>

                  <div className={styles.cardTitle}>
                    <h2>
                      {item.name || t("developers.defaultName")}

                      {item.isVerified && (
                        <CheckCircle2
                          className={styles.verifiedIcon}
                          aria-label={t("developers.verified")}
                          color="#0d00ff"
                        />
                      )}
                    </h2>
                  </div>
                </div>

                <div className={styles.cardBottom}>
                  <span>
                    {item.objects}{" "}
                    {item.objects === 1
                      ? t("developers.project.one")
                      : item.objects >= 2 && item.objects <= 4
                        ? t("developers.project.few")
                        : t("developers.project.many")}
                  </span>

                  <button
                    type="button"
                    className={styles.projects}
                    onClick={() => router.push(`/public-profile/${item.id}`)}
                    aria-label={`${t("developers.openProfile")} ${
                      item.name || t("developers.defaultName")
                    }`}
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

            <span className={styles.sectionLabel}>
              {t("developers.noResultsLabel")}
            </span>

            <h2>{t("developers.notFound")}</h2>

            <p>{t("developers.changeQuery")}</p>

            {search && (
              <button type="button" onClick={() => setSearch("")}>
                {t("developers.showAll")}
              </button>
            )}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
