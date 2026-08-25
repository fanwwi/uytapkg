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

import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();

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
      // Re-run auth check when profile updates in the same window
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
            src={scrolled ? "/assets/uytap.png" : "/assets/uytap2.png"}
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
                <Link href="/pricing">Тарифы</Link>

                <Link href="/all-products">Все объявления</Link>

                <Link href="/lawyers">Юристы</Link>
              </div>
            )}
          </div>

          <button
            className={styles.favorite}
            onClick={() => protectedRoute("/favorites")}
          >
            <Heart />
            Избранное
          </button>
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.add}
            onClick={() => protectedRoute("/add-product")}
          >
            <PlusCircle />
            <span>Добавить объявление</span>
          </button>

          <button
            className={styles.free}
            onClick={() => protectedRoute("/add-product")}
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
