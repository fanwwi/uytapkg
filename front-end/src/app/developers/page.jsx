"use client";

import { useState } from "react";
import Image from "next/image";

import { Search, Building2, Home, ArrowRight } from "lucide-react";

import styles from "./Developers.module.css";

import Footer from "@/components/pageComponents/footer/Footer";

const developers = [
  {
    id: 1,
    nameRu: "CAPSTROY KG",
    nameEn: "CAPSTROY KG",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxLQa8J3uVN048wbko7vpDXv3ixaPxQFffGPG7R-hi-beZLKzCXkFDSvI&s=10",
  },
  {
    id: 2,
    nameRu: "Нурзаман",
    nameEn: "Nurzaman",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRvlvpnTUQZiY-G-t90wbeth2xgaUuz2t4sgguwljBkL7wAvjnwo1zImo&s=10",
  },
  {
    id: 3,
    nameRu: "Имарат Строй",
    nameEn: "Imarat Stroy",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3752ubrPQIcq1CWrF54abmKEr5KmD7QkItzSst5bQrImzkY3GU2BzmZ44&s=10",
  },
  {
    id: 4,
    nameRu: "Авангард Стиль",
    nameEn: "Avangard Style",
    objects: null,
    logo: "https://elitka.kg/_next/image?url=https%3A%2F%2Felitka.kg%2Fuploads%2F%2Fbuilder%2F61890e864e5d1.png&w=1920&q=75",
  },
  {
    id: 5,
    nameRu: "Элит Хаус",
    nameEn: "Elite House",
    objects: null,
    logo: "https://storage.ghost.io/c/c3/a6/c3a66635-73fd-4349-a382-8bf5c41013f8/content/images/wp-content/uploads/2021/05/economist.kg-53.png",
  },
  {
    id: 6,
    nameRu: "Ихлас",
    nameEn: "Ihlas",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOX5WfR2KZhxdbjgRXzMhDKKTFOoEfytaGuyqbyACkSpQjpY6QfeIZ-VM&s=10",
  },
  {
    id: 7,
    nameRu: "KG Групп",
    nameEn: "KG Group",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvDAg0bNYZG04wU-MFmkGAhoi6cT6_FRTbgWnGmUNvBzQijjO7XGZn4E_u&s=10",
  },
  {
    id: 8,
    nameRu: "Альфа Строй",
    nameEn: "Alpha Stroy",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcRUsNTiuOXaubRUMZVvH_MCAf0hU8BLnWzgQFtlXzVqvq4puih-eFA_1Q&s=10",
  },
  {
    id: 9,
    nameRu: "Роял Констракшин",
    nameEn: "Royal Construction",
    objects: null,
    logo: "https://elitka.kg/uploads/builder/618e8e535b99b.jpg",
  },
  {
    id: 10,
    nameRu: "Памир Строй",
    nameEn: "Pamir Stroy",
    objects: null,
    logo: "https://static.tildacdn.one/tild3836-3833-4765-a236-346133626330/image.png",
  },
  {
    id: 11,
    nameRu: "Нур Строй Монтаж",
    nameEn: "Nur Stroy Montazh",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-MkomHMmUYQ4U11njD35hmk1v2kryFSBKkc-EB56MMw&s",
  },
  {
    id: 12,
    nameRu: "Борсан Констракшн",
    nameEn: "Borsan Construction",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmXpDIK7zMbB1Yq30pnyV_72m_USFoCT53LU-9MpUUSE55UXUnTqiQIeI&s=10",
  },
  {
    id: 13,
    nameRu: "Аалам Строй",
    nameEn: "Aalam Stroy",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRayPWU6-_kcZc7LC-sql027CONvWbeDEZZL0V89thLsc2YQASpH3OTNwW6&s=10",
  },
  {
    id: 14,
    nameRu: "Делмар Групп",
    nameEn: "Delmar Group",
    objects: null,
    logo: "https://cdn.house.kg/house/builders/131100502ca89ac30f3ceac291eec59a.jpg",
  },
  {
    id: 15,
    nameRu: "Голден Строй",
    nameEn: "Golden Stroy",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuqTE3CukzUZBTGXqoIEIKKuB-GgWmEi2YFfyrH6qwX9vZBlzVqXdZemM&s=10",
  },
  {
    id: 16,
    nameRu: "Айкон",
    nameEn: "Icon",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUxyDSN9hZ5xNSGAVgldSZFUTYgInpX2UlerC-ggwWHUM5d3Y3Ur1Aasxo&s=10",
  },
  {
    id: 17,
    nameRu: "Елизавета",
    nameEn: "Elizaveta",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiQqG673B6HndjPXNKu2ryHBHJ96rRFSH269Sw6dFFw00mHaws1mu1J3s&s=10",
  },
  {
    id: 18,
    nameRu: "ТС Групп",
    nameEn: "TS-Group",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN4VSN2joxmtpb__k1pmMypcLpQ0JLGRlkUmKd3lL4hh3k1OBSTMkvnZc&s=10",
  },
  {
    id: 19,
    nameRu: "АРТВИН",
    nameEn: "ARTWIN",
    objects: null,
    logo: "https://elitka.kg/uploads/builder/64367e4d2cb5a.jpg",
  },
  {
    id: 20,
    nameRu: "БРК Групп",
    nameEn: "BRK Group",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN8_YyP-maWsyAoyrVHXAtkIzsh9ayjemPVRREaAEb08YRvteaQPGfnTzJ&s=10",
  },
  {
    id: 21,
    nameRu: "Арзы Групп",
    nameEn: "Arzy Group",
    objects: null,
    logo: "https://www.amcham.kg/wp-content/uploads/company-logo_ru_2026-04-10_165519_0858-1024x647.png",
  },
  {
    id: 23,
    nameRu: "Аманат Сити",
    nameEn: "Amanat City",
    objects: null,
    logo: "https://elitka.kg/_next/image?url=https%3A%2F%2Felitka.kg%2Fuploads%2F%2Fbuilder%2F1761015858121-241638554.jpg&w=1920&q=75",
  },
  {
    id: 24,
    nameRu: "Танар Групп",
    nameEn: "Tanar Group",
    objects: null,
    logo: "https://elitka.kg/_next/image?url=https%3A%2F%2Felitka.kg%2Fuploads%2F%2Fbuilder%2F1785475712764-820106467.jpg&w=1920&q=75",
  },
  {
    id: 25,
    nameRu: "Элеганс",
    nameEn: "Elegance",
    objects: null,
    logo: "https://elitka.kg/_next/image?url=https%3A%2F%2Felitka.kg%2Fuploads%2F%2Fbuilder%2F642bc98ac2682.jpg&w=1920&q=75",
  },
  {
    id: 27,
    nameRu: "Энесай Девелопмент",
    nameEn: "Enesai Development",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAZFIy4DW_zKizsN-pU4RwJ77vP_tb1qFJA7CmgemaYU-_KIViG1CQdQ1A&s=10",
  },
  {
    id: 28,
    nameRu: "Тундук Инвест",
    nameEn: "Tunduk Invest",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHknxtWGcK5E6PN-uiu30gJ9B5VLWWKjSE4SyJgpVYjXHjY77H1o_yw1sZ&s=10",
  },
  {
    id: 29,
    nameRu: "Кут Курулуш",
    nameEn: "Kut Kurulush",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqs3ltO3P7Yb1k3mqrzOSvXtvKUcW3NWJILzFRVAe5YqdzN-HwRfTIuaM&s=10",
  },
  {
    id: 30,
    nameRu: "Экспострой",
    nameEn: "Expostroy",
    objects: null,
    logo: "https://cdn.house.kg/house/builders/e1ee4b0b13e64e3d3d2481be5b5c4ab0.jpg",
  },
  {
    id: 31,
    nameRu: "Пик Курулуш",
    nameEn: "Pik Kurulush",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtkg4zwg_qdReSxF90rFIW3soO-lHZWnM8PmwRM4VlPeCLEXwZqaUYgls&s=10",
  },
  {
    id: 33,
    nameRu: "Девинвест",
    nameEn: "DevInvest",
    objects: null,
    logo: "https://scontent.fppk1-1.fna.fbcdn.net/v/t39.30808-6/299986841_131156789630808_2553741084236524556_n.jpg?stp=dst-jpg_tt6&cstp=mx648x648&ctp=s648x648&_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=e5Tvvawyu4sQ7kNvwG4J0v4&_nc_oc=AdryMcU6FIWvoanF-_YZK6Zd5AGJ1t0o4qhVnf_FcU1o8wwAuEplfVxcO2K1hd7U8M4&_nc_zt=23&_nc_ht=scontent.fppk1-1.fna&_nc_gid=FZNuBvg-eRmZn4PkwkcgKw&_nc_ss=7b289&oh=00_AQGKvy5IQciGK2MIDHQleVKJnuX1UG05T9CrCjGKbxmEIQ&oe=6A80A581",
  },
  {
    id: 34,
    nameRu: "Фаворит Строй Групп",
    nameEn: "Favorit Stroy Group",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkjmGTQUXAEYrMJDM1BC7YRcCS2VDOj0mfOiJYAZBDFw&s",
  },
  {
    id: 35,
    nameRu: "Креавит Инвест",
    nameEn: "Kreavit Invest",
    objects: null,
    logo: "https://cdn.house.kg/house/builders/b21688dd8ed13e72f8c7c5f0b3995519.jpg",
  },
  {
    id: 36,
    nameRu: "Вилар",
    nameEn: "VILAR",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkN4SdN3guN3CFD1kYcf-r_jsmBVMFbnUIkIdMO_C9WRZX9q21Fkn22Mg&s=10",
  },
  {
    id: 39,
    nameRu: "Ньюстар",
    nameEn: "NEWSTAR",
    objects: null,
    logo: "https://elitka.kg/_next/image?url=https%3A%2F%2Felitka.kg%2Fuploads%2F%2Fbuilder%2F1761366334767-33837373.png&w=1920&q=75",
  },
  {
    id: 40,
    nameRu: "Голден Хаус",
    nameEn: "Golden House",
    objects: null,
    logo: "https://elitka.kg/uploads/builder/6482ba0528e64.jpg",
  },
  {
    id: 41,
    nameRu: "CA Инвест строй",
    nameEn: "CA Invest Stroy",
    objects: null,
    logo: "https://play-lh.googleusercontent.com/kJWL-S2fPslk_WQ5ZluiGG0G2KhicuPkoWhGOeWvwiMhw-kD_5ztz5BAZz2buNDVqk-7gOMvB8nKEQtJ5rS2",
  },
  {
    id: 42,
    nameRu: "Турпан строй",
    nameEn: "Turpan Stroy",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-_uOYSdWRTKM_10wQ4c_p3a0jKUymgBr5n1StVX_HhA&s",
  },
  {
    id: 43,
    nameRu: "Башат Курулуш",
    nameEn: "Bashat Kurulush",
    objects: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0n-dKzw3t2RFaU5gIrTLvxbnC4smmYfkIIShS0YPrTMLJ-c_dwpGlh8E&s=10",
  },
  {
    id: 45,
    nameRu: "А Плюс Девеломпент",
    nameEn: "A Plus Development",
    objects: null,
    logo: "https://elitka.kg/uploads/builder/67e4c6de1843e.jpg",
  },
  {
    id: 46,
    nameRu: "Ван Констракшин",
    nameEn: "One Construction",
    objects: null,
    logo: "https://elitka.kg/_next/image?url=https%3A%2F%2Felitka.kg%2Fuploads%2F%2Fbuilder%2F66af41809d087.jpg&w=1920&q=75",
  },
  {
    id: 47,
    nameRu: "Новатек Констракшин",
    nameEn: "Novatech Construction",
    objects: null,
    logo: "https://elitka.kg/_next/image?url=https%3A%2F%2Felitka.kg%2Fuploads%2F%2Fbuilder%2F664f5af230f10.jpg&w=1920&q=75",
  },
  {
    id: 48,
    nameRu: "АСТ Билдинг",
    nameEn: "AST Building",
    objects: null,
    logo: "https://elitka.kg/uploads/builder/63dbef11c25d7.jpg",
  },
  {
    id: 49,
    nameRu: "Алмаз Билдинг",
    nameEn: "Almaz Building",
    objects: null,
    logo: "https://elitka.kg/uploads/builder/633c1b98ad365.jpg",
  },
];

export default function Developers() {
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  const filtered = developers.filter((item) => {
    if (!query) return true;

    return (
      item.nameRu.toLowerCase().includes(query) ||
      item.nameEn.toLowerCase().includes(query)
    );
  });

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
                      alt={item.nameEn}
                    />
                  ) : (
                    <Building2 />
                  )}
                </div>

                <h3>{item.nameEn}</h3>

                <div className={styles.info}>
                  <Home />

                  <span>{item.objects} Застройщик</span>
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
