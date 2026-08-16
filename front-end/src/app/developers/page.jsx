"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Building2, Home, Search } from "lucide-react";
import { getDevelopers } from "@/utils/api";

import styles from "./Developers.module.css";

import Footer from "@/components/pageComponents/footer/Footer";

/*
const developers = [
  {
    id: 1,
    nameRu: "CAPSTROY KG",
    nameEn: "CAPSTROY KG",
    objects: 12,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxLQa8J3uVN048wbko7vpDXv3ixaPxQFffGPG7R-hi-beZLKzCXkFDSvI&s=10",
  },
  {
    id: 2,
    nameRu: "Нурзаман",
    nameEn: "Nurzaman",
    objects: 8,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRvlvpnTUQZiY-G-t90wbeth2xgaUuz2t4sgguwljBkL7wAvjnwo1zImo&s=10",
  },
  {
    id: 3,
    nameRu: "Имарат Строй",
    nameEn: "Imarat Stroy",
    objects: 15,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3752ubrPQIcq1CWrF54abmKEr5KmD7QkItzSst5bQrImzkY3GU2BzmZ44&s=10",
  },
  {
    id: 4,
    nameRu: "Авангард Стиль",
    nameEn: "Avangard Style",
    objects: 7,
    logo: "https://elitka.kg/_next/image?url=https%3A%2F%2Felitka.kg%2Fuploads%2F%2Fbuilder%2F61890e864e5d1.png&w=1920&q=75",
  },
  {
    id: 5,
    nameRu: "Элит Хаус",
    nameEn: "Elite House",
    objects: 21,
    logo: "https://storage.ghost.io/c/c3/a6/c3a66635-73fd-4349-a382-8bf5c41013f8/content/images/wp-content/uploads/2021/05/economist.kg-53.png",
  },
  {
    id: 6,
    nameRu: "Ихлас",
    nameEn: "Ihlas",
    objects: 9,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOX5WfR2KZhxdbjgRXzMhDKKTFOoEfytaGuyqbyACkSpQjpY6QfeIZ-VM&s=10",
  },
  {
    id: 7,
    nameRu: "KG Групп",
    nameEn: "KG Group",
    objects: 18,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvDAg0bNYZG04wU-MFmkGAhoi6cT6_FRTbgWnGmUNvBzQijjO7XGZn4E_u&s=10",
  },
  {
    id: 8,
    nameRu: "Альфа Строй",
    nameEn: "Alpha Stroy",
    objects: 11,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcRUsNTiuOXaubRUMZVvH_MCAf0hU8BLnWzgQFtlXzVqvq4puih-eFA_1Q&s=10",
  },
  {
    id: 9,
    nameRu: "Роял Констракшин",
    nameEn: "Royal Construction",
    objects: 6,
    logo: "https://elitka.kg/uploads/builder/618e8e535b99b.jpg",
  },
  {
    id: 10,
    nameRu: "Памир Строй",
    nameEn: "Pamir Stroy",
    objects: 13,
    logo: "https://static.tildacdn.one/tild3836-3833-4765-a236-346133626330/image.png",
  },
];
*/

export default function Developers() {
  const [developersList, setDevelopersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    getDevelopers()
      .then((res) => {
        if (res.success && res.data) {
          const mapped = res.data.map((dev) => ({
            id: dev.id,
            nameRu: dev.company_name,
            nameEn: dev.company_name,
            objects: dev.residential_complexes?.length || 0,
            logo: dev.logo_url || null,
          }));
          setDevelopersList(mapped);
        } else {
          setError(res.message || "Ошибка загрузки застройщиков");
        }
      })
      .catch((err) => {
        console.error("Fetch developers error:", err);
        setError("Ошибка при получении списка застройщиков");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return developersList;

    return developersList.filter(
      (item) =>
        item.nameRu?.toLowerCase().includes(query) ||
        item.nameEn?.toLowerCase().includes(query),
    );
  }, [search, developersList]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container} style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Загрузка списка застройщиков...</h2>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.container} style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Ошибка загрузки застройщиков</h2>
          <p style={{ marginTop: "10px", color: "#666" }}>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <span className={styles.eyebrow}>
              <Building2 />
              Застройщики Кыргызстана
            </span>

            <h1>Найдите своего застройщика</h1>

            <p>
              Изучайте строительные компании, их проекты и выбирайте надежного
              застройщика для будущего дома.
            </p>
          </div>

          <div className={styles.headerStat}>
            <strong>{developersList.length}</strong>
            <span>застройщиков</span>
          </div>
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <Search />

            <input
              type="text"
              placeholder="Поиск застройщика..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.result}>
          <span>Найдено застройщиков:</span>

          <strong>{filtered.length}</strong>
        </div>

        {filtered.length > 0 ? (
          <section className={styles.grid}>
            {filtered.map((item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.logoBox}>
                  {item.logo ? (
                    <Image
                      src={item.logo}
                      width={110}
                      height={110}
                      alt={item.nameEn}
                    />
                  ) : (
                    <Building2 />
                  )}
                </div>

                <div className={styles.cardContent}>
                  <span className={styles.companyType}>Застройщик</span>

                  <h2>{item.nameEn}</h2>

                  <p className={styles.nameRu}>{item.nameRu}</p>

                  <div className={styles.info}>
                    <span>
                      <Home />
                      {item.objects}{" "}
                      {item.objects === 1
                        ? "проект"
                        : item.objects >= 2 && item.objects <= 4
                          ? "проекта"
                          : "проектов"}
                    </span>
                  </div>

                  <button type="button" className={styles.projects}>
                    Смотреть проекты
                    <ArrowRight />
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className={styles.empty}>
            <Building2 />

            <h2>Застройщик не найден</h2>

            <p>Попробуйте изменить поисковый запрос.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
