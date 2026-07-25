"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  ChevronDown,
  Heart,
  Flame,
  MapPin,
  Building2,
  Users,
  PlusCircle,
  LogIn,
} from "lucide-react";

import styles from "./Header.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setOpenMenu(null);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

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
          {/* Локации */}

          <div className={styles.dropdown}>
            <button type="button" onClick={() => toggleMenu("location")}>
              <MapPin />
              Локации
              <ChevronDown
                className={openMenu === "location" ? styles.rotate : ""}
              />
            </button>

            {openMenu === "location" && (
              <div className={styles.menu}>
                <Link href="/bishkek">Бишкек</Link>

                <Link href="/issyk-kul">Иссык-Куль</Link>
              </div>
            )}
          </div>

          {/* Новостройки */}

          <div className={styles.dropdown}>
            <button type="button" onClick={() => toggleMenu("new")}>
              <Building2 />
              Новостройки
              <ChevronDown
                className={openMenu === "new" ? styles.rotate : ""}
              />
            </button>

            {openMenu === "new" && (
              <div className={styles.menu}>
                <Link href="/complexes">Жилые комплексы</Link>

                <Link href="/developers">Застройщики</Link>
              </div>
            )}
          </div>

          {/* Еще */}

          <div className={styles.dropdown}>
            <button type="button" onClick={() => toggleMenu("more")}>
              <Users />
              Еще
              <ChevronDown
                className={openMenu === "more" ? styles.rotate : ""}
              />
            </button>

            {openMenu === "more" && (
              <div className={styles.menu}>
                <Link href="/agents">Риэлторы</Link>

                <Link href="/pricing">Тарифы</Link>
              </div>
            )}
          </div>

          <Link href="/favorites" className={styles.favorite}>
            <Heart />
            Избранное
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link href="/create" className={styles.add}>
            <PlusCircle />
            Добавить объявление
          </Link>

          <Link href="/create" className={styles.free}>
            <Flame />
            Разместить за 0 сом
          </Link>

          <Link href="/login" className={styles.login}>
            <LogIn />
            Войти
          </Link>
        </div>
      </div>
    </header>
  );
}
