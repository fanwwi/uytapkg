"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getMe } from "@/utils/api";

import {
  ChevronDown,
  Heart,
  Flame,
  MapPin,
  Building2,
  Users,
  PlusCircle,
  LogIn,
  User,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./Header.module.css";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher/LanguageSwitcher";

export default function Header() {
  const router = useRouter();

  const { t } = useLanguage();

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
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

    const handleUserUpdated = () => {
      checkAuth();
    };

    window.addEventListener("uytap:user-updated", handleUserUpdated);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setOpenMenu(null);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("uytap:user-updated", handleUserUpdated);
    };
  }, []);

  function toggleMenu(menu) {
    setOpenMenu(openMenu === menu ? null : menu);
  }

  function protectedRoute(path) {
    if (!isAuth) {
      router.push("/auth-required");
      return;
    }

    router.push(path);
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src={scrolled ? "/assets/logo.png" : "/assets/logo2.png"}
            width={140}
            height={80}
            alt="UyTap"
            priority
          />
        </Link>

        <nav className={styles.nav}>
          {/* LOCATIONS */}

          <div className={styles.dropdown}>
            <button onClick={() => toggleMenu("location")}>
              <MapPin />

              {t("header.locations")}

              <ChevronDown />
            </button>

            {openMenu === "location" && (
              <div className={styles.menu}>
                <Link href="/issyk-kul">Иссык-Куль</Link>

                <Link href="/search-map">{t("header.searchOnMap")}</Link>
              </div>
            )}
          </div>

          {/* NEW BUILDINGS */}

          <div className={styles.dropdown}>
            <button onClick={() => toggleMenu("new")}>
              <Building2 />

              {t("header.newBuildings")}

              <ChevronDown />
            </button>

            {openMenu === "new" && (
              <div className={styles.menu}>
                <Link href="/complexes">
                  {t("header.residentialComplexes")}
                </Link>

                <Link href="/developers">{t("header.developers")}</Link>
              </div>
            )}
          </div>

          {/* MORE */}

          <div className={styles.dropdown}>
            <button onClick={() => toggleMenu("more")}>
              <Users />

              {t("header.more")}

              <ChevronDown />
            </button>

            {openMenu === "more" && (
              <div className={styles.menu}>
                <Link href="/pricing">{t("header.pricing")}</Link>

                <Link href="/all-products">{t("header.allListings")}</Link>

                <Link href="/lawyers">{t("header.lawyers")}</Link>
              </div>
            )}
          </div>

          {/* FAVORITES */}

          <button
            className={styles.favorite}
            onClick={() => protectedRoute("/favorites")}
          >
            <Heart />

            {t("header.favorites")}
          </button>
        </nav>

        {/* ACTIONS */}

        <div className={styles.actions}>
          <LanguageSwitcher />

          <button
            className={styles.add}
            onClick={() => protectedRoute("/add-product")}
          >
            <PlusCircle />

            <span>{t("header.addListing")}</span>
          </button>

          <button
            className={styles.free}
            onClick={() => protectedRoute("/add-product")}
          >
            <Flame />

            <span>{t("header.freeListing")}</span>
          </button>

          {isAuth ? (
            <Link href="/profile" className={styles.login}>
              <User />

              <span>{t("header.profile")}</span>
            </Link>
          ) : (
            <Link href="/login" className={styles.login}>
              <LogIn />

              <span>{t("header.login")}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
