"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  User,
  Pencil,
  Phone,
  MessageCircle,
  Heart,
  Home,
  CreditCard,
  LogOut,
  ArrowLeft,
} from "lucide-react";

import styles from "./PersonalProfile.module.css";

import ProfileEditModal from "./profileEdit/ProfileEditModal";

export default function PersonalProfile({ user, adsCount = 0, favoritesCount = 0 }) {
  const [openEdit, setOpenEdit] = useState(false);

  if (!user) return null;

  const profile = user.profile || {};
  const avatarUrl = profile.avatar_url || profile.avatar || user.avatar_url || user.avatar || null;

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

  const whatsappNumber = user.phone?.replace(/\D/g, "") || "";

  function logout() {
    localStorage.removeItem("uytap_user");

    document.cookie = "uytap_token=; path=/; max-age=0";

    window.location.href = "/login";
  }

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.homeButton}>
          <ArrowLeft />
          На главную
        </Link>
      </div>

      <motion.section
        className={styles.profileCard}
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <div className={styles.topGlow} />

        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" />
            ) : (
              <User />
            )}
          </div>
        </div>

        <div className={styles.info}>
          <h1>{fullName || "Пользователь"}</h1>

          <span className={styles.type}>Частное лицо</span>

          <div className={styles.contacts}>
            <div className={styles.phone}>
              <Phone />

              <span>{user.phone || "Нет телефона"}</span>
            </div>

            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                className={styles.whatsapp}
              >
                <MessageCircle />
                WhatsApp
              </a>
            )}
          </div>
        </div>

        <button className={styles.edit} onClick={() => setOpenEdit(true)}>
          <Pencil />
        </button>
      </motion.section>

      <section className={styles.about}>
        <h3>О себе</h3>

        <p>{profile.about || "Пользователь пока не добавил описание"}</p>
      </section>

      <section className={styles.actions}>
        <Link href="/profile/ads">
          <div className={styles.icon}>
            <Home />
          </div>

          <div>
            <h3>Мои объявления</h3>

            <p>Управление объектами</p>
          </div>
        </Link>

        <Link href="/favorites">
          <div className={styles.icon}>
            <Heart />
          </div>

          <div>
            <h3>Избранное</h3>

            <p>Сохраненные объекты</p>
          </div>
        </Link>

        <Link href="/profile/tariff">
          <div className={styles.icon}>
            <CreditCard />
          </div>

          <div>
            <h3>Мой тариф</h3>

            <p>Управление подпиской</p>
          </div>
        </Link>

        <button className={styles.logout} onClick={logout}>
          <div className={styles.icon}>
            <LogOut />
          </div>

          <div>
            <h3>Выйти</h3>

            <p>Завершить сессию</p>
          </div>
        </button>
      </section>

      {openEdit && (
        <ProfileEditModal user={user} close={() => setOpenEdit(false)} />
      )}
    </main>
  );
}
