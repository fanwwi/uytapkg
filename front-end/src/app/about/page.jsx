"use client";

import {
  ArrowRight,
  BrainCircuit,
  Building2,
  Check,
  ChevronRight,
  Home,
  LifeBuoy,
  MapPin,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { useRouter } from "next/navigation";
import styles from "./About.module.css";
import Header from "@/components/pageComponents/header/Header";
import Footer from "@/components/pageComponents/footer/Footer";

const features = [
  {
    number: "01",
    icon: Mic,
    title: "Голосовой умный поиск",
    description:
      "Просто скажите, что ищете. UyTap распознаёт речь, понимает параметры запроса и автоматически подбирает подходящую недвижимость.",
    example: "«Найди дом у Иссык-Куля до $120 000»",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Подходящие рекомендации",
    description:
      "UyTap анализирует ваши запросы и сохранённые объекты, чтобы показывать недвижимость, которая действительно может вам подойти.",
    example: "Подборка объектов специально для вас",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Проверка и прозрачность",
    description:
      "Мы внедряем инструменты верификации продавцов и дополнительные механизмы доверия, чтобы сделать рынок безопаснее.",
    example: "Верифицированный продавец",
  },
  {
    number: "04",
    icon: Building2,
    title: "Фильтры под объект",
    description:
      "Для каждой категории недвижимости свои параметры. Квартиры, дома, участки, коммерция и паркинги имеют собственный набор характеристик, чтобы вы смогли найти именно то, что подходит именно вам.",
    example: "Квартира → этаж, серия, отопление, ремонт...",
  },
];

const principles = [
  {
    icon: Search,
    title: "Просто",
    text: "Человек должен найти недвижимость, а не разобраться в интерфейсе.",
  },
  {
    icon: ShieldCheck,
    title: "Прозрачно",
    text: "Понятные данные, единые правила и в будущем — верификация продавцов.",
  },
  {
    icon: BrainCircuit,
    title: "Умно",
    text: "AI работает там, где он действительно экономит время пользователя.",
  },
  {
    icon: Users,
    title: "Для людей",
    text: "UyTap соединяет тех, кто ищет недвижимость, с теми, кто её продаёт или сдаёт.",
  },
];

const roadmap = [
  "Умный поиск недвижимости",
  "Голосовой ввод",
  "Верификация продавцов",
  "Каталог новостроек",
  "Новые регионы и страны",
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className={styles.page}>
      <Header />

      <div className={styles.noise} />
      <div className={`${styles.glow} ${styles.glowOne}`} />
      <div className={`${styles.glow} ${styles.glowTwo}`} />

      {/* =========================
          HERO
      ========================= */}

      <section className={styles.hero}>
        <div className={styles.heroGrid} />

        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.liveDot} />О проекте UyTap
          </div>

          <h1>
            Недвижимость
            <span> должна быть проще.</span>
          </h1>

          <p className={styles.heroText}>
            UyTap — современная платформа недвижимости, созданная для того,
            чтобы поиск, продажа и аренда жилья были понятными, быстрыми и
            удобными.
          </p>

          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => router.push("/all-products")}
            >
              Найти недвижимость
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => router.push("/add-product")}
            >
              Разместить объявление
            </button>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.visualCard}>
            <div className={styles.visualTop}>
              <span>UyTap.kg</span>

              <div>
                <span className={styles.statusDot} />
                AI SEARCH
              </div>
            </div>

            <div className={styles.searchDemo}>
              <Search size={20} />

              <span>
                квартира у озера до <b>$100 000</b>
              </span>
            </div>

            <div className={styles.demoResult}>
              <div className={styles.demoImage}>
                <Building2 size={26} />
              </div>

              <div>
                <strong>Найдено 24 объекта</strong>
                <span>Иссык-Куль · квартиры</span>
              </div>

              <ChevronRight size={18} />
            </div>

            <div className={styles.aiBadge}>
              <Sparkles size={14} />
              AI понял ваш запрос
            </div>
          </div>

          <div className={styles.floatingCard}>
            <span>01</span>
            <strong>Простой поиск</strong>
            <small>без лишних фильтров</small>
          </div>
        </div>
      </section>

      {/* =========================
          INTRO
      ========================= */}

      <section className={styles.intro}>
        <div className={styles.sectionLabel}>
          <span>01</span>
          <span>Почему UyTap</span>
        </div>

        <div className={styles.introContent}>
          <h2>
            Мы убираем всё,
            <br />
            <span>что мешает найти свой дом.</span>
          </h2>

          <div className={styles.introText}>
            <p>
              Рынок недвижимости часто заставляет пользователя заполнять длинные
              формы, изучать десятки фильтров и разбираться в сложных
              интерфейсах.
            </p>

            <p>
              UyTap строится вокруг обратного подхода: технология должна
              адаптироваться к человеку, а не человек к технологии.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================= */}

      <section className={styles.featuresSection}>
        <div className={styles.sectionHeading}>
          <div>
            <div className={styles.sectionLabel}>
              <span>02</span>
              <span>Что умеет UyTap</span>
            </div>

            <h2>
              Меньше действий.
              <br />
              <span>Больше результата.</span>
            </h2>
          </div>

          <p>
            Мы используем искусственный интеллект не ради красивого слова «AI»,
            а там, где он действительно делает продукт удобнее.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.number} className={styles.featureCard}>
                <div className={styles.featureTop}>
                  <span className={styles.featureNumber}>{feature.number}</span>

                  <div className={styles.featureIcon}>
                    <Icon size={21} />
                  </div>
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <div className={styles.featureExample}>
                  <span />
                  {feature.example}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section className={styles.workflow}>
        <div className={styles.workflowHeader}>
          <div className={styles.sectionLabel}>
            <span>03</span>
            <span>Как это работает</span>
          </div>

          <h2>
            От идеи до
            <span> объявления — несколько секунд.</span>
          </h2>
        </div>

        <div className={styles.workflowSteps}>
          <div className={styles.workflowLine} />

          <div className={styles.workflowStep}>
            <div className={styles.workflowNumber}>01</div>

            <h3>Расскажите</h3>

            <p>
              Напишите или расскажите голосом, какую недвижимость вы ищете.
            </p>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.workflowNumber}>02</div>

            <h3>UyTap понимает</h3>

            <p>
              AI анализирует запрос, выделяет параметры и превращает обычную
              речь в понятные данные.
            </p>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.workflowNumber}>03</div>

            <h3>Вы получаете результат</h3>

            <p>
              Подходящие объекты появляются без лишней
              ручной работы.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          REGIONS
      ========================= */}

      <section className={styles.regions}>
        <div className={styles.regionCard}>
          <div className={styles.regionVisual}>
            <MapPin size={32} />

            <div className={styles.regionRing} />
            <div className={`${styles.regionRing} ${styles.regionRingTwo}`} />
          </div>

          <div className={styles.regionContent}>
            <div className={styles.sectionLabel}>
              <span>04</span>
              <span>География</span>
            </div>

            <h2>
              Начинаем с Кыргызстана.
              <br />
              <span>Дальше — больше.</span>
            </h2>

            <p>
              UyTap объединяет недвижимость разных регионов в одной системе.
              Бишкек, Иссык-Куль, другие области Кыргызстана — и постепенно
              зарубежные направления.
            </p>

            <div className={styles.regionTags}>
              <span>Бишкек</span>
              <span>Иссык-Куль</span>
              <span>Кыргызстан</span>
              <span>Турция</span>
              <span>+</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          PRINCIPLES
      ========================= */}

      <section className={styles.principles}>
        <div className={styles.sectionHeading}>
          <div>
            <div className={styles.sectionLabel}>
              <span>05</span>
              <span>Наш подход</span>
            </div>

            <h2>
              Четыре принципа,
              <br />
              <span>на которых всё держится.</span>
            </h2>
          </div>
        </div>

        <div className={styles.principleGrid}>
          {principles.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className={styles.principleCard}>
                <Icon size={22} />

                <h3>{item.title}</h3>

                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================
          ROADMAP
      ========================= */}

      <section className={styles.roadmap}>
        <div className={styles.roadmapIntro}>
          <div className={styles.sectionLabel}>
            <span>06</span>
            <span>Что дальше</span>
          </div>

          <h2>
            Это только
            <br />
            <span>начало.</span>
          </h2>

          <p>
            UyTap развивается как единая экосистема недвижимости, а не просто
            каталог объявлений.
          </p>
        </div>

        <div className={styles.roadmapList}>
          {roadmap.map((item, index) => (
            <div key={item} className={styles.roadmapItem}>
              <div className={styles.roadmapCheck}>
                <Check size={14} />
              </div>

              <span>0{index + 1}</span>

              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================= */}

      <section className={styles.final}>
        <div className={styles.finalGlow} />

        <div className={styles.finalContent}>
          <span className={styles.finalBadge}>
            <Home size={14} />
            UyTap
          </span>

          <h2>
            Найдите место,
            <br />
            <span>которое станет вашим.</span>
          </h2>

          <p>
            Ищете квартиру, продаёте дом или хотите разместить новый объект?
            Начните с UyTap.
          </p>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => router.push("/all-products")}
          >
            Перейти к недвижимости
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
