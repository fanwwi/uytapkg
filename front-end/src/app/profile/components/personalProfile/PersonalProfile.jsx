"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import {
  User,
  Pencil,
  Phone,
  MessageCircle,
  Heart,
  Home,
  CreditCard,
  LogOut,
  ExternalLink,
} from "lucide-react";

import styles from "./PersonalProfile.module.css";

import ProfileEditModal from "./profileEdit/ProfileEditModal";

export default function PersonalProfile({ user }) {
  const [openEdit, setOpenEdit] = useState(false);

  if (!user) {
    return null;
  }

  const profile = user.profile || {};

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
        transition={{
          duration: 0.4,
        }}
      >
        <div className={styles.topGlow} />

        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" />
            ) : (
              <User />
            )}
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h1>{fullName || "Пользователь"}</h1>
          </div>

          <span className={styles.type}>Частное лицо</span>

          <div className={styles.contacts}>
            <div className={styles.phoneContact}>
              <Phone />

              <span>{user.phone || "Нет телефона"}</span>
            </div>

            {whatsappNumber && (
              <a
                className={styles.whatsapp}
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle />

                <span>WhatsApp</span>

                <ExternalLink />
              </a>
            )}
          </div>
        </div>

        <button
          type="button"
          className={styles.edit}
          onClick={() => {
            setOpenEdit(true);
          }}
        >
          <Pencil />
        </button>
      </motion.section>

      <section className={styles.about}>
        <h3>О себе</h3>

        <p>{profile.about || "Пользователь пока не добавил описание"}</p>
      </section>

      <section className={styles.actions}>
        <a href="/profile/ads">
          <div className={styles.icon}>
            <Home />
          </div>

          <div>
            <h3>Мои объявления</h3>

            <p>Управление объектами</p>
          </div>
        </a>

        <a href="/profile/favorites">
          <div className={styles.icon}>
            <Heart />
          </div>

          <div>
            <h3>Избранное</h3>

            <p>Сохраненные объекты</p>
          </div>
        </a>

        <a href="/profile/tariff">
          <div className={styles.icon}>
            <CreditCard />
          </div>

          <div>
            <h3>Мой тариф</h3>

            <p>Управление подпиской</p>
          </div>
        </a>

        <button type="button" className={styles.logout} onClick={logout}>
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
