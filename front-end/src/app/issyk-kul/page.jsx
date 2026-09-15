"use client";

import {
  Search,
  Plus,
  Waves,
  Home,
  Building2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Compass,
  BedDouble,
} from "lucide-react";

import styles from "./IssykKul.module.css";
import Footer from "@/components/pageComponents/footer/Footer";
import { useRouter } from "next/navigation";
import AdBanner from "@/components/pageComponents/addBanner/AdBanner";

import { useLanguage } from "@/context/LanguageContext";

const propertyTypes = [
  {
    key: "houses",
    icon: Home,
  },
  {
    key: "guestHouses",
    icon: Building2,
  },
  {
    key: "land",
    icon: Compass,
  },
  {
    key: "apartments",
    icon: BedDouble,
  },
];

const benefits = [
  {
    key: "resortZone",
    icon: Waves,
  },
  {
    key: "restAndLife",
    icon: Home,
  },
  {
    key: "investmentPotential",
    icon: TrendingUp,
  },
  {
    key: "differentFormats",
    icon: Sparkles,
  },
];

export default function IssykKul() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div>
      <main className={styles.page}>
        {/* HERO */}

        <section className={styles.hero}>
          <div className={styles.heroOverlay} />

          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <Waves />
              {t("issykKul.hero.badge")}
            </div>

            <h1>
              {t("issykKul.hero.title")}
              <br />
              {t("issykKul.hero.titleAccent")}
            </h1>

            <p>{t("issykKul.hero.description")}</p>

            <div className={styles.buttons}>
              <button
                type="button"
                className={styles.homeButton}
                onClick={() => router.push("/")}
              >
                {t("issykKul.hero.home")}
              </button>

              <button
                type="button"
                className={styles.mainButton}
                onClick={() => router.push("/all-issykkul-products")}
              >
                {t("issykKul.hero.viewObjects")}
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

                {t("issykKul.hero.addObject")}
              </button>
            </div>
          </div>
        </section>

        <AdBanner />

        {/* INTRO */}

        <section className={styles.intro}>
          <div className={styles.sectionHeading}>
            <span>{t("issykKul.intro.eyebrow")}</span>

            <h2>{t("issykKul.intro.title")}</h2>
          </div>

          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <p>{t("issykKul.intro.paragraphOne")}</p>

              <p>{t("issykKul.intro.paragraphTwo")}</p>

              <button
                type="button"
                className={styles.textButton}
                onClick={() => router.push("/all-issykkul-products")}
              >
                {t("issykKul.intro.findProperty")}
                <ArrowRight size={18} />
              </button>
            </div>

            <div className={styles.introCard}>
              <Waves size={34} />

              <strong>{t("issykKul.intro.cardTitle")}</strong>

              <p>{t("issykKul.intro.cardText")}</p>
            </div>
          </div>
        </section>

        {/* PROPERTY TYPES */}

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span>{t("issykKul.propertyTypes.eyebrow")}</span>

            <h2>{t("issykKul.propertyTypes.title")}</h2>

            <p>{t("issykKul.propertyTypes.description")}</p>
          </div>

          <div className={styles.propertyGrid}>
            {propertyTypes.map((item) => {
              const Icon = item.icon;

              return (
                <div className={styles.propertyCard} key={item.key}>
                  <div className={styles.cardIcon}>
                    <Icon size={23} />
                  </div>

                  <h3>{t(`issykKul.propertyTypes.items.${item.key}.title`)}</h3>

                  <p>
                    {t(`issykKul.propertyTypes.items.${item.key}.description`)}
                  </p>

                  <button
                    type="button"
                    onClick={() => router.push("/all-issykkul-products")}
                  >
                    {t("issykKul.propertyTypes.view")}
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
            <span>{t("issykKul.benefits.eyebrow")}</span>

            <h2>{t("issykKul.benefits.title")}</h2>
          </div>

          <div className={styles.benefitsGrid}>
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div className={styles.benefit} key={item.key}>
                  <div className={styles.benefitIcon}>
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3>{t(`issykKul.benefits.items.${item.key}.title`)}</h3>

                    <p>
                      {t(`issykKul.benefits.items.${item.key}.description`)}
                    </p>
                  </div>
                </div>
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

            <span>{t("issykKul.investment.eyebrow")}</span>

            <h2>{t("issykKul.investment.title")}</h2>

            <p>{t("issykKul.investment.description")}</p>

            <button
              type="button"
              onClick={() => router.push("/all-issykkul-products")}
            >
              {t("issykKul.investment.button")}
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
              <span>{t("issykKul.quickSearch.eyebrow")}</span>

              <h2>{t("issykKul.quickSearch.title")}</h2>

              <p>{t("issykKul.quickSearch.description")}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/all-issykkul-products")}
          >
            {t("issykKul.quickSearch.button")}
            <ArrowRight size={18} />
          </button>
        </section>

        {/* ADD OBJECT */}

        <section className={styles.addSection}>
          <div>
            <span>{t("issykKul.addObject.eyebrow")}</span>

            <h2>{t("issykKul.addObject.title")}</h2>

            <p>{t("issykKul.addObject.description")}</p>
          </div>

          <button type="button" onClick={() => router.push("/add-product")}>
            <Plus size={20} />
            {t("issykKul.addObject.button")}
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
