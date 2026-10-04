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
  Menu,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./Header.module.css";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher/LanguageSwitcher";

export default function Header() {
  const router = useRouter();
  const { t } = useLanguage();

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    const handleUserUpdated = () => checkAuth();
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

  // Блокировка скролла страницы при открытом мобильном меню
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  function toggleMenu(menu) {
    setOpenMenu(openMenu === menu ? null : menu);
  }

  function protectedRoute(path) {
    setMobileMenuOpen(false);
    if (!isAuth) {
      router.push("/auth-required");
      return;
    }
    router.push(path);
  }

  function handleNavClick(path) {
    setMobileMenuOpen(false);
    router.push(path);
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link
          href="/"
          className={styles.logo}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Image
            src={scrolled ? "/assets/logo.png" : "/assets/logo2.png"}
            width={140}
            height={80}
            alt="UyTap"
            priority
          />
        </Link>

        {/* ДЕСКТОПНАЯ НАВИГАЦИЯ */}
        <nav className={styles.nav}>
          <div className={styles.dropdown}>
            <button onClick={() => toggleMenu("location")}>
              <MapPin />
              {t("header.locations")}
              <ChevronDown />
            </button>
            {openMenu === "location" && (
              <div className={styles.menu}>
                <Link href="/issyk-kul" onClick={() => setOpenMenu(null)}>
                  Иссык-Куль
                </Link>
                <Link href="/search-map" onClick={() => setOpenMenu(null)}>
                  {t("header.searchOnMap")}
                </Link>
              </div>
            )}
          </div>

          <div className={styles.dropdown}>
            <button onClick={() => toggleMenu("new")}>
              <Building2 />
              {t("header.newBuildings")}
              <ChevronDown />
            </button>
            {openMenu === "new" && (
              <div className={styles.menu}>
                <Link href="/complexes" onClick={() => setOpenMenu(null)}>
                  {t("header.residentialComplexes")}
                </Link>
                <Link href="/developers" onClick={() => setOpenMenu(null)}>
                  {t("header.developers")}
                </Link>
              </div>
            )}
          </div>

          <div className={styles.dropdown}>
            <button onClick={() => toggleMenu("more")}>
              <Users />
              {t("header.more")}
              <ChevronDown />
            </button>
            {openMenu === "more" && (
              <div className={styles.menu}>
                <Link href="/pricing" onClick={() => setOpenMenu(null)}>
                  {t("header.pricing")}
                </Link>
                <Link href="/all-products" onClick={() => setOpenMenu(null)}>
                  {t("header.allListings")}
                </Link>
                <Link href="/lawyers" onClick={() => setOpenMenu(null)}>
                  {t("header.lawyers")}
                </Link>
              </div>
            )}
          </div>

          <button
            className={styles.favorite}
            onClick={() => protectedRoute("/favorites")}
          >
            <Heart />
            {t("header.favorites")}
          </button>
        </nav>

        {/* ДЕСКТОПНЫЕ ДЕЙСТВИЯ */}
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

          {/* КНОПКА БУРГЕР МЕНЮ */}
          <button
            className={styles.burgerButton}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* МОБИЛЬНЫЙ САЙДБАР */}
      <div
        className={`${styles.mobileOverlay} ${mobileMenuOpen ? styles.open : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div
        className={`${styles.mobileSidebar} ${mobileMenuOpen ? styles.open : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <Link
            href="/"
            className={styles.logo}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image src="/assets/logo.png" width={120} height={70} alt="UyTap" />
          </Link>
          <button
            className={styles.closeButton}
            onClick={() => setMobileMenuOpen(false)}
          >
            <X />
          </button>
        </div>

        <div className={styles.sidebarContent}>
          <div className={styles.sidebarSection}>
            <span className={styles.sidebarTitle}>{t("header.locations")}</span>
            <button onClick={() => handleNavClick("/issyk-kul")}>
              <MapPin /> Иссык-Куль
            </button>
            <button onClick={() => handleNavClick("/search-map")}>
              <MapPin /> {t("header.searchOnMap")}
            </button>
          </div>

          <div className={styles.sidebarSection}>
            <span className={styles.sidebarTitle}>
              {t("header.newBuildings")}
            </span>
            <button onClick={() => handleNavClick("/complexes")}>
              <Building2 /> {t("header.residentialComplexes")}
            </button>
            <button onClick={() => handleNavClick("/developers")}>
              <Building2 /> {t("header.developers")}
            </button>
          </div>

          <div className={styles.sidebarSection}>
            <span className={styles.sidebarTitle}>{t("header.more")}</span>
            <button onClick={() => handleNavClick("/all-products")}>
              <Users /> {t("header.allListings")}
            </button>
            <button onClick={() => handleNavClick("/pricing")}>
              <Users /> {t("header.pricing")}
            </button>
            <button onClick={() => handleNavClick("/lawyers")}>
              <Users /> {t("header.lawyers")}
            </button>
            <button onClick={() => protectedRoute("/favorites")}>
              <Heart /> {t("header.favorites")}
            </button>
          </div>

          <div className={styles.sidebarActions}>
            <button
              className={styles.sidebarAdd}
              onClick={() => protectedRoute("/add-product")}
            >
              <PlusCircle />
              {t("header.addListing")}
            </button>
            <button
              className={styles.sidebarFree}
              onClick={() => protectedRoute("/add-product")}
            >
              <Flame />
              {t("header.freeListing")}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
