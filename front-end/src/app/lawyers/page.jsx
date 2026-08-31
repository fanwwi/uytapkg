"use client";

import { useEffect, useState } from "react";
import {
  Scale,
  ShieldCheck,
  FileCheck2,
  SearchCheck,
  Phone,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  BadgeCheck,
  Clock3,
  Building2,
} from "lucide-react";

import styles from "./Lawyers.module.css";
import Header from "@/components/pageComponents/header/Header";
import Footer from "@/components/pageComponents/footer/Footer";
import { getLawyers } from "@/utils/api";

const benefits = [
  {
    icon: FileCheck2,
    title: "Проверка документов",
    text: "Юрист изучает документы, связанные с объектом и его владельцем.",
  },
  {
    icon: SearchCheck,
    title: "Поиск рисков",
    text: "Помогает выявить возможные юридические ограничения и спорные моменты.",
  },
  {
    icon: ShieldCheck,
    title: "Безопаснее сделка",
    text: "Вы получаете профессиональную оценку перед покупкой или арендой.",
  },
];

export default function Lawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLawyers()
      .then((res) => {
        if (res.success) setLawyers(res.data || []);
      })
      .catch((err) => console.error("Ошибка загрузки юристов:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      <div className={styles.container}>
        {/* HERO */}

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <Scale />
              Юридическая проверка
            </div>

            <h1>
              Проверьте недвижимость
              <span> перед сделкой</span>
            </h1>

            <p>
              Наши юристы помогут проверить объявление или жилой комплекс,
              изучить документы и обратить внимание на возможные юридические
              риски до заключения сделки.
            </p>

            <div className={styles.heroActions}>
              <a href="#lawyers" className={styles.primaryButton}>
                Выбрать юриста
                <ArrowRight />
              </a>

              <div className={styles.trust}>
                <BadgeCheck />
                <span>Проверка специалистом</span>
              </div>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroCardIcon}>
              <ShieldCheck />
            </div>

            <span className={styles.heroCardLabel}>UYТAP LEGAL</span>

            <h2>Юридическая проверка объекта</h2>

            <div className={styles.heroChecks}>
              <div>
                <CheckCircle2 />
                Проверка документов
              </div>

              <div>
                <CheckCircle2 />
                Анализ юридических рисков
              </div>

              <div>
                <CheckCircle2 />
                Консультация юриста
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}

        <section className={styles.infoSection}>
          <div className={styles.sectionHeading}>
            <span>01</span>

            <div>
              <h2>Как это работает</h2>
              <p>Получить юридическую консультацию можно прямо через UyTap.</p>
            </div>
          </div>

          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>01</div>

              <div>
                <h3>Выберите объект</h3>
                <p>
                  Откройте объявление или жилой комплекс, который хотите
                  проверить.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>02</div>

              <div>
                <h3>Запросите проверку</h3>
                <p>
                  Нажмите кнопку «Запросить проверку у юриста» и выберите
                  специалиста.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>03</div>

              <div>
                <h3>Свяжитесь с юристом</h3>
                <p>
                  Юрист получает информацию и связывается с вами для проведения
                  проверки.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}

        <section className={styles.infoSection}>
          <div className={styles.sectionHeading}>
            <span>02</span>

            <div>
              <h2>Что проверяет юрист</h2>
              <p>
                Перед сделкой важно смотреть не только на фотографию квартиры.
              </p>
            </div>
          </div>

          <div className={styles.benefits}>
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <article className={styles.benefit} key={item.title}>
                  <div className={styles.benefitIcon}>
                    <Icon />
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* LAWYERS */}

        <section id="lawyers" className={styles.lawyersSection}>
          <div className={styles.sectionHeading}>
            <span>03</span>

            <div>
              <h2>Наши юристы</h2>
              <p>Выберите специалиста и свяжитесь с ним для консультации.</p>
            </div>
          </div>

          {loading ? (
            <p className={styles.stateMessage}>Загружаем юристов...</p>
          ) : lawyers.length === 0 ? (
            <p className={styles.stateMessage}>
              Пока нет доступных юристов. Загляните позже.
            </p>
          ) : (
            <div className={styles.lawyersGrid}>
              {lawyers.map((lawyer) => {
                const fullName = [lawyer.lastName, lawyer.firstName]
                  .filter(Boolean)
                  .join(" ");

                const initials = `${lawyer.firstName?.[0] || ""}${
                  lawyer.lastName?.[0] || ""
                }`;

                return (
                  <article className={styles.lawyerCard} key={lawyer.id}>
                    <div className={styles.lawyerTop}>
                      <div className={styles.avatar}>{initials}</div>

                      <div className={styles.verified}>
                        <BadgeCheck />
                        Проверен
                      </div>
                    </div>

                    <div className={styles.lawyerInfo}>
                      <h3>{fullName}</h3>

                      <div className={styles.specialization}>
                        <Scale />
                        {lawyer.specialization}
                      </div>

                      {lawyer.description && <p>{lawyer.description}</p>}
                    </div>

                    <div className={styles.lawyerMeta}>
                      <div>
                        <Clock3 />
                        {lawyer.experience}
                      </div>
                    </div>

                    <div className={styles.contacts}>
                      {lawyer.phone && (
                        <a
                          href={`tel:${lawyer.phone.replace(/\s/g, "")}`}
                          className={styles.phone}
                        >
                          <Phone />
                          Позвонить
                        </a>
                      )}

                      {lawyer.whatsapp && (
                        <a
                          href={`https://wa.me/${lawyer.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.whatsapp}
                        >
                          <MessageCircle />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* CTA */}

        <section className={styles.bottomCta}>
          <div className={styles.bottomCtaIcon}>
            <Scale />
          </div>

          <div>
            <span>Нужна юридическая помощь?</span>

            <h2>
              Нашли объект, но сомневаетесь
              <br />
              перед сделкой?
            </h2>

            <p>
              Запросите проверку у юриста и получите профессиональную
              консультацию.
            </p>
          </div>

          <a href="#lawyers" className={styles.ctaButton}>
            Найти юриста
            <ArrowRight />
          </a>
        </section>
      </div>
      <Footer />
    </main>
  );
}
