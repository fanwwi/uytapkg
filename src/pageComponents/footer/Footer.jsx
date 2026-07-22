"use client";

import {
  Building2,
  Home,
  Trees,
  Car,
  Heart,
  MapPin,
  Phone,
  Mail,
  Search,
  UserRound,
  Smartphone,
} from "lucide-react";

import styles from "./Footer.module.css";

export default function Footer() {
  const categories = [
    {
      title: "Квартиры",
      icon: Building2,
    },
    {
      title: "Дома",
      icon: Home,
    },
    {
      title: "Участки",
      icon: Trees,
    },
    {
      title: "Паркинг",
      icon: Car,
    },
    {
      title: "Избранное",
      icon: Heart,
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Бренд */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <img src="/assets/logo.png" alt="UyTap" />
          </div>

          <p>
            Современный сервис поиска недвижимости. Найдите место, которое
            станет вашим домом.
          </p>

          <div className={styles.contacts}>
            <div>
              <Phone />
              +996 555 000 000
            </div>

            <div>
              <Mail />
              support@uytap.kg
            </div>

            <div>
              <MapPin />
              Бишкек, Кыргызстан
            </div>
          </div>
        </div>

        {/* Категории */}
        <div className={styles.column}>
          <h3>Категории</h3>

          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <a key={item.title}>
                <Icon />

                {item.title}
              </a>
            );
          })}
        </div>

        {/* Сервис */}
        <div className={styles.column}>
          <h3>Сервис</h3>

          <a>
            <Search />
            Поиск недвижимости
          </a>

          <a>
            <UserRound />
            Личный кабинет
          </a>

          <a>
            <Heart />
            Мои объявления
          </a>
        </div>

        {/* Приложение */}
        <div className={styles.column}>
          <h3>Мобильное приложение</h3>

          <div className={styles.appBox}>
            <Smartphone />

            <div>
              <strong><span>UyTap</span> в вашем телефоне</strong>

              <p>Ищите недвижимость где угодно</p>
            </div>
          </div>

          <a className={styles.playStore}>
            <div className={styles.playIcon}>▶</div>

            <div>
              <span>Скачайте в</span>

              <strong>Google Play</strong>
            </div>
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} UyTap. Все права защищены.
      </div>
    </footer>
  );
}
