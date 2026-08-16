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

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getMe } from "@/utils/api";

import styles from "./Footer.module.css";

const categories = [
  {
    title: "Квартиры",
    icon: Building2,
    value: "Квартира",
  },
  {
    title: "Дома",
    icon: Home,
    value: "Дом",
  },
  {
    title: "Участки",
    icon: Trees,
    value: "Участок",
  },
  {
    title: "Паркинг",
    icon: Car,
    value: "Паркинг/гараж",
  },
];

export default function Footer() {
  const router = useRouter();

  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("uytap_token");
        const storedUser = localStorage.getItem("uytap_user");

        if (!token || !storedUser) {
          setIsAuth(false);
          return;
        }

        try {
          const user = await getMe(token);
          setIsAuth(Boolean(user));
        } catch {
          // Такая же логика, как в Header:
          // если токен + сохранённый пользователь есть,
          // считаем пользователя авторизованным,
          // даже если getMe временно не ответил.
          setIsAuth(true);
        }
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();

    // Если пользователь вошёл/вышел в другой вкладке
    window.addEventListener("storage", checkAuth);

    // Если авторизация изменилась внутри этой вкладки
    window.addEventListener("uytap:user-updated", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("uytap:user-updated", checkAuth);
    };
  }, []);

  const protectedRoute = (path) => {
    if (!isAuth) {
      router.push("/auth-required");
      return;
    }

    router.push(path);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* БРЕНД */}

        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <img src="/assets/logo2.png" alt="UyTap" />
          </Link>

          <p>
            Современный сервис поиска недвижимости. Найдите место, которое
            станет вашим домом.
          </p>

          <div className={styles.contacts}>
            <div>
              <Phone />
              <span>+996 555 000 000</span>
            </div>

            <div>
              <Mail />
              <span>uytap.official@gmail.com</span>
            </div>

            <div>
              <MapPin />
              <span>Бишкек, Кыргызстан</span>
            </div>
          </div>
        </div>

        {/* КАТЕГОРИИ */}

        <div className={styles.column}>
          <h3>Категории</h3>

          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.value}
                href={`/all-products?category=${encodeURIComponent(
                  item.value,
                )}`}
              >
                <Icon />
                {item.title}
              </Link>
            );
          })}

          <button
            type="button"
            className={styles.linkButton}
            onClick={() => protectedRoute("/favorites")}
          >
            <Heart />
            Избранное
          </button>
        </div>

        {/* СЕРВИС */}

        <div className={styles.column}>
          <h3>Сервис</h3>

          <Link href="/all-products">
            <Search />
            Поиск недвижимости
          </Link>

          <button
            type="button"
            className={styles.linkButton}
            onClick={() => protectedRoute("/profile")}
          >
            <UserRound />
            Личный кабинет
          </button>

          <button
            type="button"
            className={styles.linkButton}
            onClick={() => protectedRoute("/profile/ads")}
          >
            <Heart />
            Мои объявления
          </button>
        </div>

        {/* ПРИЛОЖЕНИЕ */}

        <div className={styles.column}>
          <h3>Мобильное приложение</h3>

          <div className={styles.appBox}>
            <Smartphone />

            <div>
              <strong>
                <span>UyTap</span> в вашем телефоне
              </strong>

              <p>Ищите недвижимость где угодно</p>
            </div>
          </div>

          <a
            href="#"
            className={styles.playStore}
            onClick={(e) => e.preventDefault()}
          >
            <div className={styles.playIcon}>▶</div>

            <div>
              <span>Скачайте в</span>
              <strong>Google Play</strong>
            </div>
          </a>
        </div>
      </div>

      {/* BOTTOM */}

      <div className={styles.bottom}>
        © {new Date().getFullYear()} UyTap. Все права защищены.
      </div>
    </footer>
  );
}
