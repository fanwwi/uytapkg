"use client";

import { MessageCircle, Building2, ArrowLeft, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./Connect.module.css";

const WHATSAPP_NUMBER = "996553554541";

const message = `Здравствуйте! Мы строительная компания и хотели бы узнать подробнее о тарифах для застройщиков на UyTap. Хотели бы обсудить условия сотрудничества, доступные тарифы и возможности размещения наших объявлений. Будем рады получить подробную информацию. Спасибо!`;

export default function Connect() {
  const router = useRouter();

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
          <span>Назад</span>
        </button>

        <div className={styles.card}>
          <div className={styles.iconBox}>
            <Building2 size={32} strokeWidth={1.8} />
          </div>

          <span className={styles.badge}>ДЛЯ ЗАСТРОЙЩИКОВ</span>

          <h1 className={styles.title}>
            Свяжитесь с нами
            <span> по поводу тарифа</span>
          </h1>

          <p className={styles.description}>
            Хотите размещать объекты вашей строительной компании на UyTap?
            Свяжитесь с нами напрямую — расскажем о доступных тарифах, условиях
            размещения и возможностях продвижения ваших объявлений.
          </p>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>
              <Phone size={23} />
            </div>

            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>ТЕЛЕФОН / WHATSAPP</span>
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

            <span>Написать в WhatsApp</span>
          </a>

          <div className={styles.messagePreview}>
            <span className={styles.previewLabel}>ГОТОВЫЙ ТЕКСТ</span>

            <p>{message}</p>
          </div>

          <p className={styles.footerText}>
            Сообщение уже подготовлено — просто нажмите кнопку выше и отправьте
            его нам.
          </p>
        </div>
      </section>
    </main>
  );
}
