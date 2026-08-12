"use client";

import { useState } from "react";

import {
  Pencil,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Mail,
  Heart,
  Home,
  CreditCard,
  LogOut,
  Building2,
  CheckCircle,
  House,
} from "lucide-react";

import styles from "./RealtorProfile.module.css";

import RealtorEditModal from "./realtorEdit/RealtorEditModal";

export default function RealtorProfile({ user }) {
  const [edit, setEdit] = useState(false);

  if (!user) return null;

  const profile = user.profile || {};
  const avatarUrl = profile.avatar_url || profile.avatar || user.avatar_url || user.avatar || "/assets/realtorImage.png";

  const name =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    "Риэлтор";

  const company = profile.company_name || "Агентство недвижимости";

  const whatsapp = user.phone?.replace(/\D/g, "");

  function logout() {
    localStorage.removeItem("uytap_user");

    document.cookie = "uytap_token=; path=/; max-age=0";

    window.location.href = "/login";
  }

  return (
    <main className={styles.page}>
      <section className={styles.profileCard}>
        <div className={styles.glow} />

        <div className={styles.top}>
          <div className={styles.avatar}>
            <img src={avatarUrl} alt={name} />
          </div>

          <div className={styles.info}>
            <div className={styles.badge}>Риэлтор</div>

            <div className={styles.nameRow}>
              <h1>{name}</h1>

              {user.isVerified && <CheckCircle className={styles.verify} />}
            </div>

            <div className={styles.company}>
              <Building2 />
              {company}
            </div>

            <p className={styles.description}>
              {profile.about || "Риэлтор пока не добавил описание"}
            </p>
          </div>

          <button className={styles.edit} onClick={() => setEdit(true)}>
            <Pencil />
          </button>
        </div>

        <div className={styles.contacts}>
          {user.phone && (
            <div className={styles.contactCard}>
              <Phone />

              <div>
                <small>Телефон</small>
                <strong>{user.phone}</strong>
              </div>
            </div>
          )}

          {user.email && (
            <div className={styles.contactCard}>
              <Mail />

              <div>
                <small>Email</small>
                <strong>{user.email}</strong>
              </div>
            </div>
          )}

          {profile.office_address && (
            <div className={styles.contactCard}>
              <MapPin />

              <div>
                <small>Адрес компании</small>
                <strong>{profile.office_address}</strong>
              </div>
            </div>
          )}

          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
            >
              <Globe />

              <div>
                <small>Сайт</small>
                <strong>{profile.website}</strong>
              </div>
            </a>
          )}
        </div>

        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsapp}
          >
            <MessageCircle />
            Написать в WhatsApp
          </a>
        )}
      </section>

      <section className={styles.stats}>
        <div>
          <strong>{profile.ads_count || 0}</strong>
          <span>объявлений</span>
        </div>

        <div>
          <strong>{profile.clients_count || 0}</strong>
          <span>клиентов</span>
        </div>
      </section>

      <section className={styles.menu}>
        <a href="/">
          <House />
          Главная
        </a>

        <a href="/profile/ads">
          <Home />
          Мои объявления
        </a>

        <a href="/profile/favorites">
          <Heart />
          Избранное
        </a>

        <a href="/profile/tariff">
          <CreditCard />
          Мой тариф
        </a>

        <button onClick={logout}>
          <LogOut />
          Выйти
        </button>
      </section>

      {edit && <RealtorEditModal user={user} close={() => setEdit(false)} />}
    </main>
  );
}
