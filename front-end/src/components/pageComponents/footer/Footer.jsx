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
  Laptop,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";
import { getMe } from "@/utils/api";

import styles from "./Footer.module.css";

const categories = [
  {
    key: "apartments",
    icon: Building2,
    value: "Квартира",
  },
  {
    key: "houses",
    icon: Home,
    value: "Дом",
  },
  {
    key: "land",
    icon: Trees,
    value: "Участок",
  },
  {
    key: "parking",
    icon: Car,
    value: "Паркинг/гараж",
  },
];

export default function Footer() {
  const router = useRouter();
  const { t } = useLanguage();

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
          setIsAuth(true);
        }
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
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
            <img src="/assets/logo.png" alt="UyTap" />
          </Link>

          <p>{t("footer.brand.description")}</p>

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
              <span>{t("footer.location")}</span>
            </div>
          </div>
        </div>

        {/* КАТЕГОРИИ */}

        <div className={styles.column}>
          <h3>{t("footer.categories.title")}</h3>

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
                {t(`footer.categories.items.${item.key}`)}
              </Link>
            );
          })}

          <button
            type="button"
            className={styles.linkButton}
            onClick={() => protectedRoute("/favorites")}
          >
            <Heart />
            {t("footer.categories.favorites")}
          </button>
        </div>

        {/* СЕРВИС */}

        <div className={styles.column}>
          <h3>{t("footer.service.title")}</h3>

          <Link href="/about">
            <Laptop />
            {t("footer.service.about")}
          </Link>

          <Link href="/safety">
            <ShieldCheck />
            {t("footer.service.safety")}
          </Link>

          <Link href="/all-products">
            <Search />
            {t("footer.service.search")}
          </Link>

          <button
            type="button"
            className={styles.linkButton}
            onClick={() => protectedRoute("/profile")}
          >
            <UserRound />
            {t("footer.service.profile")}
          </button>

          <button
            type="button"
            className={styles.linkButton}
            onClick={() => protectedRoute("/profile/ads")}
          >
            <Heart />
            {t("footer.service.myListings")}
          </button>
        </div>

        {/* ПРИЛОЖЕНИЕ */}

        <div className={styles.column}>
          <h3>{t("footer.app.title")}</h3>

          <div className={styles.appBox}>
            <Smartphone />

            <div>
              <strong>
                <span>UyTap</span> {t("footer.app.onYourPhone")}
              </strong>

              <p>{t("footer.app.description")}</p>
            </div>
          </div>

          <a
            href="#"
            className={styles.playStore}
            onClick={(e) => e.preventDefault()}
          >
            <div className={styles.playIcon}>▶</div>

            <div>
              <span>{t("footer.app.download")}</span>
              <strong>Google Play</strong>
            </div>
          </a>
        </div>
      </div>

      {/* BOTTOM */}

      <div className={styles.bottom}>
        © {new Date().getFullYear()} UyTap. {t("footer.copyright")}
      </div>
    </footer>
  );
}
