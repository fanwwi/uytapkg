"use client";

import { useState } from "react";

import {
  User,
  Pencil,
  Phone,
  MessageCircle,
  Heart,
  Home,
  CreditCard,
  LogOut,
  BadgeCheck,
} from "lucide-react";

import styles from "./PersonalProfile.module.css";
import ProfileEditModal from "./profileEdit/ProfileEditModal";

export default function PersonalProfile() {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <main className={styles.page}>
      <section className={styles.profileCard}>
        <div className={styles.topGlow}></div>

        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            <User />
          </div>

          <button className={styles.editAvatar}>Изменить фото</button>
        </div>

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h1>Фарангиз Анваржанова</h1>

          </div>

          <span className={styles.type}>Частное лицо</span>

          <div className={styles.contacts}>
            <div>
              <Phone />

              <span>+996 555 555 555</span>
            </div>

            <div>
              <MessageCircle />

              <span>WhatsApp</span>
            </div>
          </div>
        </div>

        <button className={styles.edit} onClick={() => setOpenEdit(true)}>
          <Pencil />
        </button>
      </section>

      <section className={styles.actions}>
        <a href="/profile/ads">
          <div className={styles.icon}>
            <Home />
          </div>

          <section>
            <h3>Мои объявления</h3>

            <p>Управление объектами</p>
          </section>
        </a>

        <a href="/profile/favorites">
          <div className={styles.icon}>
            <Heart />
          </div>

          <section>
            <h3>Избранное</h3>

            <p>Сохраненные объекты</p>
          </section>
        </a>

        <a href="/profile/tariff">
          <div className={styles.icon}>
            <CreditCard />
          </div>

          <section>
            <h3>Мой тариф</h3>

            <p>Управление подпиской</p>
          </section>
        </a>

        <button className={styles.logout}>
          <div className={styles.icon}>
            <LogOut />
          </div>

          <section>
            <h3>Выйти</h3>

            <p>Завершить сессию</p>
          </section>
        </button>
      </section>

      {openEdit && <ProfileEditModal close={() => setOpenEdit(false)} />}
    </main>
  );
}
