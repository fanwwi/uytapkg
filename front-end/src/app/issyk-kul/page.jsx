"use client";

import {
  Search,
  Plus,
  Waves,
  MapPin,
  Home,
  Building2,
  TreePalm,
  Umbrella,
  TrendingUp,
  ShieldCheck,
  Mountain,
  CarFront,
  Sparkles,
  ArrowRight,
  Compass,
  BedDouble,
} from "lucide-react";

import styles from "./IssykKul.module.css";
import Footer from "@/components/pageComponents/footer/Footer";
import { useRouter } from "next/navigation";

const locations = [
  {
    title: "Чолпон-Ата",
    description: "Главный курортный город северного побережья.",
    icon: Umbrella,
  },
  {
    title: "Бостери",
    description: "Пляжи, туристическая инфраструктура и отдых у озера.",
    icon: Waves,
  },
  {
    title: "Кара-Ой",
    description: "Тихая курортная зона рядом с Чолпон-Атой.",
    icon: TreePalm,
  },
  {
    title: "Тамчы",
    description: "Спокойный район рядом с аэропортом и берегом.",
    icon: Mountain,
  },
];

const propertyTypes = [
  {
    title: "Дома и коттеджи",
    description:
      "Просторные дома для постоянного проживания, отдыха и семейных поездок.",
    icon: Home,
  },
  {
    title: "Гостевые дома",
    description:
      "Готовые объекты для туристического бизнеса и сезонной аренды.",
    icon: Building2,
  },
  {
    title: "Участки",
    description:
      "Земельные участки под строительство домов, коттеджей и коммерческих объектов.",
    icon: Compass,
  },
  {
    title: "Квартиры",
    description:
      "Квартиры и апартаменты в курортных комплексах рядом с озером.",
    icon: BedDouble,
  },
];

const benefits = [
  {
    title: "Курортная зона",
    description:
      "Недвижимость рядом с одним из главных туристических направлений Кыргызстана.",
    icon: Waves,
  },
  {
    title: "Для отдыха и жизни",
    description:
      "Можно подобрать объект как для личного проживания, так и для сезонного отдыха.",
    icon: Home,
  },
  {
    title: "Инвестиционный потенциал",
    description:
      "Туристический поток создаёт возможности для посуточной и сезонной аренды.",
    icon: TrendingUp,
  },
  {
    title: "Разные форматы",
    description:
      "От небольших квартир до больших коттеджей, гостевых домов и участков.",
    icon: Sparkles,
  },
];

export default function IssykKul() {
  const router = useRouter();

  return (
    <main className={styles.page}>
      {/* HERO */}

      <section className={styles.hero}>
        <div className={styles.heroOverlay} />

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
            Дома, коттеджи, квартиры, гостевые дома и земельные участки в
            курортных районах Иссык-Куля — для жизни, отдыха и инвестиций.
          </p>

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.homeButton}
              onClick={() => router.push("/")}
            >
              На главную
            </button>

            <button
              type="button"
              className={styles.mainButton}
              onClick={() => router.push("/all-issykkul-products")}
            >
              Смотреть объекты
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className={styles.whiteButton}
              onClick={() => router.push("/add-product")}
            >
              <span>
                <Plus size={19} />
              </span>
              Разместить объект
            </button>
          </div>
        </div>
      </section>

      {/* INTRO */}

      <section className={styles.intro}>
        <div className={styles.sectionHeading}>
          <span>КУРОРТНАЯ ЗОНА</span>
          <h2>Иссык-Куль — больше, чем место для отдыха</h2>
        </div>

        <div className={styles.introGrid}>
          <div className={styles.introText}>
            <p>
              Иссык-Куль — одно из самых популярных туристических направлений
              Кыргызстана. Здесь сочетаются озеро, горы, пляжи, чистый воздух и
              активно развивающаяся инфраструктура.
            </p>

            <p>
              Поэтому недвижимость здесь интересна не только для собственного
              отдыха. Дом, квартира или гостевой объект могут стать источником
              сезонного дохода и долгосрочной инвестицией.
            </p>

            <button
              type="button"
              className={styles.textButton}
              onClick={() => router.push("/all-issykkul-products")}
            >
              Найти недвижимость
              <ArrowRight size={18} />
            </button>
          </div>

          <div className={styles.introCard}>
            <Waves size={34} />

            <strong>Жизнь у озера</strong>

            <p>
              Просыпаться рядом с водой, проводить лето на берегу и при этом
              иметь собственную недвижимость.
            </p>
          </div>
        </div>
      </section>

      {/* PROPERTY TYPES */}

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>НЕДВИЖИМОСТЬ</span>
          <h2>Что можно найти на Иссык-Куле?</h2>

          <p>
            Подберите формат недвижимости под свои цели — от семейного отдыха до
            полноценного туристического бизнеса.
          </p>
        </div>

        <div className={styles.propertyGrid}>
          {propertyTypes.map((item) => {
            const Icon = item.icon;

            return (
              <div className={styles.propertyCard} key={item.title}>
                <div className={styles.cardIcon}>
                  <Icon size={23} />
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <button
                  type="button"
                  onClick={() => router.push("/all-issykkul-products")}
                >
                  Смотреть
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* BENEFITS */}

      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeading}>
          <span>ПОЧЕМУ ИССЫК-КУЛЬ</span>
          <h2>Место для жизни и инвестиций</h2>
        </div>

        <div className={styles.benefitsGrid}>
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div className={styles.benefit} key={item.title}>
                <div className={styles.benefitIcon}>
                  <Icon size={21} />
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* LOCATIONS */}

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>ЛОКАЦИИ</span>
          <h2>Популярные районы</h2>

          <p>
            Выбирайте район в зависимости от атмосферы, инфраструктуры, близости
            к озеру и инвестиционной цели.
          </p>
        </div>

        <div className={styles.locationsGrid}>
          {locations.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                className={styles.locationCard}
                key={item.title}
                onClick={() => router.push("/all-issykkul-products")}
              >
                <div className={styles.locationImage}>
                  <div className={styles.locationOverlay} />

                  <div className={styles.locationIcon}>
                    <Icon size={23} />
                  </div>

                  <div className={styles.locationInfo}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <ArrowRight className={styles.locationArrow} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* INVESTMENT */}

      <section className={styles.investment}>
        <div className={styles.investmentOverlay} />

        <div className={styles.investmentContent}>
          <div className={styles.investmentIcon}>
            <TrendingUp size={27} />
          </div>

          <span>ИНВЕСТИЦИИ</span>

          <h2>Недвижимость, которая может работать на вас</h2>

          <p>
            Курортная недвижимость может использоваться для собственного отдыха,
            долгосрочной аренды, посуточной сдачи или туристического бизнеса.
          </p>

          <button
            type="button"
            onClick={() => router.push("/all-issykkul-products")}
          >
            Посмотреть инвестиционные объекты
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* QUICK SEARCH */}

      <section className={styles.quickSearch}>
        <div>
          <div className={styles.quickIcon}>
            <Search size={22} />
          </div>

          <div>
            <span>ПОИСК</span>
            <h2>Найдите свой объект на Иссык-Куле</h2>
            <p>
              Дома, квартиры, участки и коммерческая недвижимость в популярных
              районах курортной зоны.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/all-issykkul-products")}
        >
          Смотреть все объекты
          <ArrowRight size={18} />
        </button>
      </section>

      {/* ADD OBJECT */}

      <section className={styles.addSection}>
        <div>
          <span>ДЛЯ СОБСТВЕННИКОВ</span>

          <h2>Есть недвижимость на Иссык-Куле?</h2>

          <p>
            Разместите объявление и покажите свой объект людям, которые ищут
            недвижимость для отдыха, жизни и инвестиций.
          </p>
        </div>

        <button type="button" onClick={() => router.push("/add-product")}>
          <Plus size={20} />
          Разместить объект
        </button>
      </section>

      <Footer />
    </main>
  );
}
