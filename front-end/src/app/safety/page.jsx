"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  FileCheck,
  Info,
  KeyRound,
  MapPin,
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

const scams = [
  {
    icon: Banknote,
    title: "Просьба перевести предоплату",
    danger: "Высокий риск",
    description:
      "Мошенник предлагает очень выгодную квартиру и просит срочно перевести задаток или бронь до просмотра объекта.",
    warning:
      "После получения денег объявление удаляется, а продавец перестаёт выходить на связь.",
    action:
      "Не переводите деньги до проверки объекта, документов и личности собственника.",
  },
  {
    icon: KeyRound,
    title: "Фальшивый арендодатель",
    danger: "Высокий риск",
    description:
      "Человек выдаёт себя за владельца квартиры, хотя на самом деле не имеет отношения к недвижимости.",
    warning:
      "Он может использовать чужие фотографии, документы или фотографии паспорта.",
    action:
      "Попросите подтвердить право собственности и лично встретиться с владельцем.",
  },
  {
    icon: CreditCard,
    title: "Ссылка на оплату",
    danger: "Высокий риск",
    description:
      "Вам отправляют ссылку якобы для бронирования, оплаты комиссии или получения денег.",
    warning:
      "Ссылка может вести на фишинговый сайт, который крадёт данные банковской карты.",
    action:
      "Не вводите данные карты, SMS-коды и пароли на подозрительных сайтах.",
  },
  {
    icon: FileCheck,
    title: "Поддельные документы",
    danger: "Высокий риск",
    description:
      "Мошенник показывает договор, свидетельство или другой документ, который выглядит убедительно.",
    warning:
      "Документ может быть поддельным, просроченным или относиться к другому объекту.",
    action: "Проверяйте документы через официальные государственные источники.",
  },
  {
    icon: BadgeCheck,
    title: "Фальшивый риэлтор",
    danger: "Средний риск",
    description:
      "Человек представляется агентом недвижимости и требует комиссию за несуществующую услугу.",
    warning:
      "Он может использовать логотипы настоящего агентства и чужие фотографии.",
    action: "Проверьте агентство, его контакты и договор до передачи денег.",
  },
  {
    icon: AlertTriangle,
    title: "Слишком выгодное предложение",
    danger: "Средний риск",
    description:
      "Цена значительно ниже рынка, а продавец объясняет это срочностью продажи.",
    warning:
      "Срочность часто используется, чтобы заставить вас отказаться от проверки.",
    action:
      "Сравните цену с похожими объектами и не принимайте решение под давлением.",
  },
];

const rules = [
  {
    icon: Search,
    title: "Проверяйте объявление",
    text: "Сравните фотографии, описание, адрес и цену с другими предложениями.",
  },
  {
    icon: UserCheck,
    title: "Проверяйте человека",
    text: "Уточните, кто перед вами: собственник, представитель собственника или риэлтор.",
  },
  {
    icon: FileCheck,
    title: "Проверяйте документы",
    text: "Не ограничивайтесь фотографией документа. Проверяйте информацию через официальные источники.",
  },
  {
    icon: Building2,
    title: "Посмотрите объект лично",
    text: "Не переводите деньги только после переписки и просмотра фотографий.",
  },
  {
    icon: CreditCard,
    title: "Не передавайте данные карты",
    text: "Никому не сообщайте CVV, PIN, SMS-коды и пароли от банковских приложений.",
  },
  {
    icon: Phone,
    title: "Не поддавайтесь давлению",
    text: "Фразы «нужно оплатить прямо сейчас» или «ещё пять покупателей» — повод остановиться.",
  },
];

const redFlags = [
  "Цена значительно ниже аналогичных предложений.",
  "Продавец отказывается показать объект лично.",
  "Вас торопят с переводом денег.",
  "Просят оплатить до просмотра недвижимости.",
  "Просят перейти по подозрительной ссылке.",
  "Отказываются предоставить документы.",
  "Имя получателя платежа не совпадает с продавцом.",
  "Продавец постоянно меняет условия сделки.",
  "Фотографии выглядят украденными или слишком профессиональными для частного объявления.",
  "Общение ведётся только через анонимный аккаунт.",
];

export default function Safety() {
  const router = useRouter();

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGlowTwo} />

      <div className={styles.container}>
        {/* HEADER */}

        <header className={styles.header}>
          <div className={styles.headerBadge}>
            <ShieldCheck size={17} />
            БЕЗОПАСНОСТЬ UYTAP.KG
          </div>

          <h1>
            Как не стать жертвой
            <span> мошенников</span>
          </h1>

          <p>
            Покупка или аренда недвижимости — серьёзная сделка. Узнайте, какие
            схемы используют мошенники и как защитить свои деньги и документы.
          </p>
        </header>

        {/* IMPORTANT */}

        <section className={styles.important}>
          <div className={styles.importantIcon}>
            <ShieldAlert />
          </div>

          <div>
            <span>ГЛАВНОЕ ПРАВИЛО</span>

            <h2>
              Не переводите деньги, пока не проверили человека, объект и
              документы.
            </h2>

            <p>
              Даже если объявление выглядит идеально, цена кажется выгодной, а
              собеседник убедительно рассказывает о себе.
            </p>
          </div>
        </section>

        {/* QUICK RULES */}

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.headingIcon}>
              <ShieldCheck />
            </div>

            <div>
              <span>ПЕРЕД СДЕЛКОЙ</span>
              <h2>6 правил безопасности</h2>
            </div>
          </div>

          <div className={styles.rulesGrid}>
            {rules.map((rule) => {
              const Icon = rule.icon;

              return (
                <article className={styles.ruleCard} key={rule.title}>
                  <div className={styles.ruleIcon}>
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3>{rule.title}</h3>
                    <p>{rule.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SCAMS */}

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.headingIcon}>
              <AlertTriangle />
            </div>

            <div>
              <span>ОПАСНЫЕ СХЕМЫ</span>
              <h2>Как работают мошенники</h2>
            </div>
          </div>

          <div className={styles.scams}>
            {scams.map((scam) => {
              const Icon = scam.icon;

              return (
                <article className={styles.scamCard} key={scam.title}>
                  <div className={styles.scamTop}>
                    <div className={styles.scamIcon}>
                      <Icon size={22} />
                    </div>

                    <span className={styles.danger}>{scam.danger}</span>
                  </div>

                  <h3>{scam.title}</h3>

                  <p>{scam.description}</p>

                  <div className={styles.warning}>
                    <AlertTriangle size={17} />

                    <div>
                      <strong>Что происходит</strong>
                      <span>{scam.warning}</span>
                    </div>
                  </div>

                  <div className={styles.solution}>
                    <CheckCircle2 size={17} />

                    <div>
                      <strong>Как защититься</strong>
                      <span>{scam.action}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* RED FLAGS */}

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.headingIcon}>
              <XCircle />
            </div>

            <div>
              <span>КРАСНЫЕ ФЛАГИ</span>
              <h2>Когда стоит остановиться</h2>
            </div>
          </div>

          <div className={styles.redFlags}>
            <div className={styles.redFlagsIntro}>
              <AlertTriangle size={24} />

              <div>
                <h3>Заметили несколько признаков?</h3>

                <p>
                  Не продолжайте сделку, пока не получите подтверждение
                  информации.
                </p>
              </div>
            </div>

            <div className={styles.redFlagsList}>
              {redFlags.map((flag) => (
                <div className={styles.redFlag} key={flag}>
                  <XCircle size={17} />
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRANSACTION */}

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.headingIcon}>
              <FileCheck />
            </div>

            <div>
              <span>БЕЗОПАСНАЯ СДЕЛКА</span>
              <h2>Проверяйте всё по шагам</h2>
            </div>
          </div>

          <div className={styles.steps}>
            <div className={styles.step}>
              <span>01</span>
              <div>
                <h3>Проверьте объявление</h3>
                <p>
                  Адрес, фотографии, описание, цену и историю общения с
                  продавцом.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span>02</span>
              <div>
                <h3>Установите личность</h3>
                <p>
                  Убедитесь, что человек действительно является собственником
                  или имеет право представлять собственника.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span>03</span>
              <div>
                <h3>Проверьте документы</h3>
                <p>
                  Сверьте данные человека, объекта и документы на недвижимость.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span>04</span>
              <div>
                <h3>Осмотрите объект</h3>
                <p>
                  Посетите квартиру или дом лично. Не принимайте решение только
                  по фотографиям.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span>05</span>
              <div>
                <h3>Изучите договор</h3>
                <p>
                  Не подписывайте документы, которые не прочитали и не
                  понимаете.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span>06</span>
              <div>
                <h3>Только после проверки — оплата</h3>
                <p>
                  Передача денег должна происходить после проверки всех ключевых
                  условий сделки.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PERSONAL DATA */}

        <section className={styles.dataCard}>
          <div className={styles.dataIcon}>
            <CreditCard />
          </div>

          <div>
            <span>ЗАЩИТА ДАННЫХ</span>

            <h2>Никому не передавайте банковские данные</h2>

            <p>
              Сотрудники банков, UyTap.kg и других сервисов не должны просить у
              вас пароль, PIN-код, CVV или код подтверждения из SMS для
              получения платежа или «подтверждения личности».
            </p>

            <div className={styles.dataGrid}>
              <div>
                <CheckCircle2 />
                <span>
                  Номер карты — только там, где это необходимо для оплаты
                </span>
              </div>

              <div>
                <XCircle />
                <span>CVV и PIN нельзя сообщать другим людям</span>
              </div>

              <div>
                <XCircle />
                <span>SMS-коды нельзя диктовать собеседнику</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Проверяйте адрес сайта перед вводом данных</span>
              </div>
            </div>
          </div>
        </section>

        {/* IF SCAM */}

        <section className={styles.ifScam}>
          <div className={styles.ifScamIcon}>
            <Info />
          </div>

          <div>
            <span>ЕСЛИ ВЫ УЖЕ СТОЛКНУЛИСЬ С МОШЕННИКОМ</span>

            <h2>Не продолжайте общение и сохраните доказательства</h2>

            <p>
              Сохраните переписку, фотографии объявления, номера телефонов,
              реквизиты платежей и другие материалы. Если вы уже передали деньги
              или банковские данные — как можно скорее обратитесь в свой банк и
              в правоохранительные органы.
            </p>

            <div className={styles.emergencyList}>
              <div>
                <strong>01</strong>
                <span>Заблокируйте карту, если раскрыли её данные.</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Свяжитесь с банком через официальный номер.</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Сохраните все доказательства.</span>
              </div>

              <div>
                <strong>04</strong>
                <span>Обратитесь в правоохранительные органы.</span>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER NOTE */}

        <section className={styles.bottomNote}>
          <ShieldCheck size={22} />

          <div>
            <strong>Безопасность начинается с проверки.</strong>

            <p>
              UyTap.kg помогает находить недвижимость, но решение о сделке
              всегда требует самостоятельной проверки документов и участников.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
