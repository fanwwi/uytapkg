"use client";

import { MessageCircle, Building2, ArrowLeft, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./Connect.module.css";

const WHATSAPP_NUMBER = "996553554541";

export default function Connect() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const message =
    language === "ky"
      ? "Саламатсызбы! Биз курулуш компаниябыз жана UyTap платформасында куруучулар үчүн тарифтер тууралуу кененирээк маалымат алгыбыз келет. Кызматташуу шарттарын, жеткиликтүү тарифтерди жана жарыяларыбызды жайгаштыруу мүмкүнчүлүктөрүн талкуулагыбыз келет. Толук маалымат берсеңиздер кубанычта болобуз. Рахмат!"
      : "Здравствуйте! Мы строительная компания и хотели бы узнать подробнее о тарифах для застройщиков на UyTap. Хотели бы обсудить условия сотрудничества, доступные тарифы и возможности размещения наших объявлений. Будем рады получить подробную информацию. Спасибо!";

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />

      <section className={styles.container}>
        <button
          className={styles.backButton}
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft size={21} />
          <span>{t("common.back")}</span>
        </button>

        <div className={styles.card}>
          <div className={styles.iconBox}>
            <Building2 size={32} strokeWidth={1.8} />
          </div>

          <span className={styles.badge}>{t("connect.forDevelopers")}</span>

          <h1 className={styles.title}>
            {t("connect.title")}
            <span> {t("connect.titleAccent")}</span>
          </h1>

          <p className={styles.description}>{t("connect.description")}</p>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>
              <Phone size={23} />
            </div>

            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>
                {t("connect.phoneLabel")}
              </span>

              <span className={styles.phone}>+996 (553) 55-45-41</span>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            <MessageCircle size={24} strokeWidth={2.2} />

            <span>{t("connect.whatsappButton")}</span>
          </a>

          <div className={styles.messagePreview}>
            <span className={styles.previewLabel}>
              {t("connect.readyMessage")}
            </span>

            <p>{message}</p>
          </div>

          <p className={styles.footerText}>{t("connect.footer")}</p>
        </div>
      </section>
    </main>
  );
}
