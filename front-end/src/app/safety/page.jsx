"use client";

import {
  AlertTriangle,
  Banknote,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  FileCheck,
  Info,
  KeyRound,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./Safety.module.css";
import Header from "@/components/pageComponents/header/Header";
import Footer from "@/components/pageComponents/footer/Footer";
import { useLanguage } from "@/context/LanguageContext";

const scams = [
  {
    key: "prepayment",
    icon: Banknote,
    danger: "high",
  },
  {
    key: "fakeLandlord",
    icon: KeyRound,
    danger: "high",
  },
  {
    key: "paymentLink",
    icon: CreditCard,
    danger: "high",
  },
  {
    key: "fakeDocuments",
    icon: FileCheck,
    danger: "high",
  },
  {
    key: "fakeRealtor",
    icon: BadgeCheck,
    danger: "medium",
  },
  {
    key: "tooGoodOffer",
    icon: AlertTriangle,
    danger: "medium",
  },
];

const rules = [
  {
    key: "listing",
    icon: Search,
  },
  {
    key: "person",
    icon: UserCheck,
  },
  {
    key: "documents",
    icon: FileCheck,
  },
  {
    key: "property",
    icon: Building2,
  },
  {
    key: "card",
    icon: CreditCard,
  },
  {
    key: "pressure",
    icon: Phone,
  },
];

const redFlags = [
  "lowPrice",
  "refusesViewing",
  "rushPayment",
  "paymentBeforeViewing",
  "suspiciousLink",
  "noDocuments",
  "paymentNameMismatch",
  "changingConditions",
  "stolenPhotos",
  "anonymousAccount",
];

const steps = [
  {
    number: "01",
    key: "listing",
  },
  {
    number: "02",
    key: "identity",
  },
  {
    number: "03",
    key: "documents",
  },
  {
    number: "04",
    key: "property",
  },
  {
    number: "05",
    key: "contract",
  },
  {
    number: "06",
    key: "payment",
  },
];

export default function Safety() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <Header />

      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGlowTwo} />

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerBadge}>
            <ShieldCheck size={17} />
            {t("safety.header.badge")}
          </div>

          <h1>
            {t("safety.header.title")}
            <span> {t("safety.header.titleAccent")}</span>
          </h1>

          <p>{t("safety.header.description")}</p>
        </header>

        <section className={styles.important}>
          <div className={styles.importantIcon}>
            <ShieldAlert />
          </div>

          <div>
            <span>{t("safety.important.label")}</span>

            <h2>{t("safety.important.title")}</h2>

            <p>{t("safety.important.description")}</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.headingIcon}>
              <ShieldCheck />
            </div>

            <div>
              <span>{t("safety.rules.eyebrow")}</span>
              <h2>{t("safety.rules.title")}</h2>
            </div>
          </div>

          <div className={styles.rulesGrid}>
            {rules.map((rule) => {
              const Icon = rule.icon;

              return (
                <article className={styles.ruleCard} key={rule.key}>
                  <div className={styles.ruleIcon}>
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3>{t(`safety.rules.items.${rule.key}.title`)}</h3>

                    <p>{t(`safety.rules.items.${rule.key}.text`)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.headingIcon}>
              <AlertTriangle />
            </div>

            <div>
              <span>{t("safety.scams.eyebrow")}</span>
              <h2>{t("safety.scams.title")}</h2>
            </div>
          </div>

          <div className={styles.scams}>
            {scams.map((scam) => {
              const Icon = scam.icon;

              return (
                <article className={styles.scamCard} key={scam.key}>
                  <div className={styles.scamTop}>
                    <div className={styles.scamIcon}>
                      <Icon size={22} />
                    </div>

                    <span className={styles.danger}>
                      {t(`safety.scams.danger.${scam.danger}`)}
                    </span>
                  </div>

                  <h3>{t(`safety.scams.items.${scam.key}.title`)}</h3>

                  <p>{t(`safety.scams.items.${scam.key}.description`)}</p>

                  <div className={styles.warning}>
                    <AlertTriangle size={17} />

                    <div>
                      <strong>{t("safety.scams.whatHappens")}</strong>

                      <span>{t(`safety.scams.items.${scam.key}.warning`)}</span>
                    </div>
                  </div>

                  <div className={styles.solution}>
                    <CheckCircle2 size={17} />

                    <div>
                      <strong>{t("safety.scams.howToProtect")}</strong>

                      <span>{t(`safety.scams.items.${scam.key}.action`)}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.headingIcon}>
              <XCircle />
            </div>

            <div>
              <span>{t("safety.redFlags.eyebrow")}</span>
              <h2>{t("safety.redFlags.title")}</h2>
            </div>
          </div>

          <div className={styles.redFlags}>
            <div className={styles.redFlagsIntro}>
              <AlertTriangle size={24} />

              <div>
                <h3>{t("safety.redFlags.introTitle")}</h3>

                <p>{t("safety.redFlags.introDescription")}</p>
              </div>
            </div>

            <div className={styles.redFlagsList}>
              {redFlags.map((flag) => (
                <div className={styles.redFlag} key={flag}>
                  <XCircle size={17} />

                  <span>{t(`safety.redFlags.items.${flag}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.headingIcon}>
              <FileCheck />
            </div>

            <div>
              <span>{t("safety.steps.eyebrow")}</span>
              <h2>{t("safety.steps.title")}</h2>
            </div>
          </div>

          <div className={styles.steps}>
            {steps.map((step) => (
              <div className={styles.step} key={step.number}>
                <span>{step.number}</span>

                <div>
                  <h3>{t(`safety.steps.items.${step.key}.title`)}</h3>

                  <p>{t(`safety.steps.items.${step.key}.text`)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.dataCard}>
          <div className={styles.dataIcon}>
            <CreditCard />
          </div>

          <div>
            <span>{t("safety.data.eyebrow")}</span>

            <h2>{t("safety.data.title")}</h2>

            <p>{t("safety.data.description")}</p>

            <div className={styles.dataGrid}>
              <div>
                <CheckCircle2 />

                <span>{t("safety.data.items.cardNumber")}</span>
              </div>

              <div>
                <XCircle />

                <span>{t("safety.data.items.cvvPin")}</span>
              </div>

              <div>
                <XCircle />

                <span>{t("safety.data.items.sms")}</span>
              </div>

              <div>
                <CheckCircle2 />

                <span>{t("safety.data.items.website")}</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ifScam}>
          <div className={styles.ifScamIcon}>
            <Info />
          </div>

          <div>
            <span>{t("safety.ifScam.eyebrow")}</span>

            <h2>{t("safety.ifScam.title")}</h2>

            <p>{t("safety.ifScam.description")}</p>

            <div className={styles.emergencyList}>
              <div>
                <strong>01</strong>

                <span>{t("safety.ifScam.items.blockCard")}</span>
              </div>

              <div>
                <strong>02</strong>

                <span>{t("safety.ifScam.items.contactBank")}</span>
              </div>

              <div>
                <strong>03</strong>

                <span>{t("safety.ifScam.items.saveEvidence")}</span>
              </div>

              <div>
                <strong>04</strong>

                <span>{t("safety.ifScam.items.contactAuthorities")}</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.bottomNote}>
          <ShieldCheck size={22} />

          <div>
            <strong>{t("safety.bottom.title")}</strong>

            <p>{t("safety.bottom.description")}</p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
