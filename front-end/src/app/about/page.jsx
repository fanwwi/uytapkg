"use client";

import {
  ArrowRight,
  BrainCircuit,
  Building2,
  Check,
  ChevronRight,
  Home,
  MapPin,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./About.module.css";
import Header from "@/components/pageComponents/header/Header";
import Footer from "@/components/pageComponents/footer/Footer";

export default function AboutPage() {
  const router = useRouter();

  const { t } = useLanguage();

  const features = [
    {
      number: "01",
      icon: Mic,
      title: t("about.features.voiceSearch.title"),
      description: t("about.features.voiceSearch.description"),
      example: t("about.features.voiceSearch.example"),
    },
    {
      number: "02",
      icon: BrainCircuit,
      title: t("about.features.recommendations.title"),
      description: t("about.features.recommendations.description"),
      example: t("about.features.recommendations.example"),
    },
    {
      number: "03",
      icon: ShieldCheck,
      title: t("about.features.verification.title"),
      description: t("about.features.verification.description"),
      example: t("about.features.verification.example"),
    },
    {
      number: "04",
      icon: Building2,
      title: t("about.features.filters.title"),
      description: t("about.features.filters.description"),
      example: t("about.features.filters.example"),
    },
  ];

  const principles = [
    {
      icon: Search,
      title: t("about.principles.simple.title"),
      text: t("about.principles.simple.text"),
    },
    {
      icon: ShieldCheck,
      title: t("about.principles.transparent.title"),
      text: t("about.principles.transparent.text"),
    },
    {
      icon: BrainCircuit,
      title: t("about.principles.smart.title"),
      text: t("about.principles.smart.text"),
    },
    {
      icon: Users,
      title: t("about.principles.people.title"),
      text: t("about.principles.people.text"),
    },
  ];

  const roadmap = [
    t("about.roadmap.smartSearch"),
    t("about.roadmap.voiceInput"),
    t("about.roadmap.verification"),
    t("about.roadmap.newBuildings"),
    t("about.roadmap.newRegions"),
  ];

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
            <span className={styles.liveDot} />
            {t("about.hero.eyebrow")}
          </div>

          <h1>
            {t("about.hero.title")}
            <span> {t("about.hero.titleAccent")}</span>
          </h1>

          <p className={styles.heroText}>{t("about.hero.description")}</p>

          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => router.push("/all-products")}
            >
              {t("about.hero.findProperty")}
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => router.push("/add-product")}
            >
              {t("about.hero.addListing")}
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
                {t("about.demo.searchText")} <b>$100 000</b>
              </span>
            </div>

            <div className={styles.demoResult}>
              <div className={styles.demoImage}>
                <Building2 size={26} />
              </div>

              <div>
                <strong>{t("about.demo.found")}</strong>
                <span>{t("about.demo.location")}</span>
              </div>

              <ChevronRight size={18} />
            </div>

            <div className={styles.aiBadge}>
              <Sparkles size={14} />
              {t("about.demo.aiUnderstood")}
            </div>
          </div>

          <div className={styles.floatingCard}>
            <span>01</span>
            <strong>{t("about.demo.simpleSearch")}</strong>
            <small>{t("about.demo.withoutFilters")}</small>
          </div>
        </div>
      </section>

      {/* =========================
          INTRO
      ========================= */}

      <section className={styles.intro}>
        <div className={styles.sectionLabel}>
          <span>01</span>
          <span>{t("about.intro.label")}</span>
        </div>

        <div className={styles.introContent}>
          <h2>
            {t("about.intro.title")}
            <br />
            <span>{t("about.intro.titleAccent")}</span>
          </h2>

          <div className={styles.introText}>
            <p>{t("about.intro.paragraph1")}</p>

            <p>{t("about.intro.paragraph2")}</p>
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
              <span>{t("about.featuresSection.label")}</span>
            </div>

            <h2>
              {t("about.featuresSection.title")}
              <br />
              <span>{t("about.featuresSection.titleAccent")}</span>
            </h2>
          </div>

          <p>{t("about.featuresSection.description")}</p>
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
            <span>{t("about.workflow.label")}</span>
          </div>

          <h2>
            {t("about.workflow.title")}
            <span> {t("about.workflow.titleAccent")}</span>
          </h2>
        </div>

        <div className={styles.workflowSteps}>
          <div className={styles.workflowLine} />

          <div className={styles.workflowStep}>
            <div className={styles.workflowNumber}>01</div>

            <h3>{t("about.workflow.step1.title")}</h3>

            <p>{t("about.workflow.step1.text")}</p>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.workflowNumber}>02</div>

            <h3>{t("about.workflow.step2.title")}</h3>

            <p>{t("about.workflow.step2.text")}</p>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.workflowNumber}>03</div>

            <h3>{t("about.workflow.step3.title")}</h3>

            <p>{t("about.workflow.step3.text")}</p>
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
              <span>{t("about.regions.label")}</span>
            </div>

            <h2>
              {t("about.regions.title")}
              <br />
              <span>{t("about.regions.titleAccent")}</span>
            </h2>

            <p>{t("about.regions.description")}</p>

            <div className={styles.regionTags}>
              <span>{t("about.regions.bishkek")}</span>
              <span>{t("about.regions.issykKul")}</span>
              <span>{t("about.regions.kyrgyzstan")}</span>
              <span>{t("about.regions.turkey")}</span>
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
              <span>{t("about.principlesSection.label")}</span>
            </div>

            <h2>
              {t("about.principlesSection.title")}
              <br />
              <span>{t("about.principlesSection.titleAccent")}</span>
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
            <span>{t("about.roadmapSection.label")}</span>
          </div>

          <h2>
            {t("about.roadmapSection.title")}
            <br />
            <span>{t("about.roadmapSection.titleAccent")}</span>
          </h2>

          <p>{t("about.roadmapSection.description")}</p>
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
            {t("about.final.title")}
            <br />
            <span>{t("about.final.titleAccent")}</span>
          </h2>

          <p>{t("about.final.description")}</p>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => router.push("/all-products")}
          >
            {t("about.final.button")}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
