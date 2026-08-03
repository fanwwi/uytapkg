"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie.includes("uytap_token");
      const user = localStorage.getItem("uytap_user");

      setIsAuth(Boolean(token && user));
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setOpenMenu(null);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
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
          <div className={styles.dropdown}>
            <button onClick={() => toggleMenu("location")}>
              <MapPin />
              Локации
              <ChevronDown />
            </button>

            {openMenu === "location" && (
              <div className={styles.menu}>
                <Link href="/issyk-kul">Иссык-Куль</Link>
              </div>
            )}
          </div>

          <div className={styles.dropdown}>
            <button onClick={() => toggleMenu("new")}>
              <Building2 />
              Новостройки
              <ChevronDown />
            </button>

            {openMenu === "new" && (
              <div className={styles.menu}>
                <Link href="/complexes">Жилые комплексы</Link>

                <Link href="/developers">Застройщики</Link>
              </div>
            )}
          </div>

          <div className={styles.dropdown}>
            <button onClick={() => toggleMenu("more")}>
              <Users />
              Еще
              <ChevronDown />
            </button>

            {openMenu === "more" && (
              <div className={styles.menu}>
                <Link href="/agents">Риэлторы</Link>

                <Link href="/pricing">Тарифы</Link>
              </div>
            )}
          </div>

          <button
            className={styles.favorite}
            onClick={() => protectedRoute("/profile/favorites")}
          >
            <Heart />
            Избранное
          </button>
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.add}
            onClick={() => protectedRoute("/create")}
          >
            <PlusCircle />
            <span>Добавить объявление</span>
          </button>

          <button
            className={styles.free}
            onClick={() => protectedRoute("/create")}
          >
            <Flame />
            <span>Разместить за 0 сом</span>
          </button>

          {isAuth ? (
            <Link href="/profile" className={styles.login}>
              <User />
              <span>Профиль</span>
            </Link>
          ) : (
            <Link href="/login" className={styles.login}>
              <LogIn />
              <span>Войти</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
