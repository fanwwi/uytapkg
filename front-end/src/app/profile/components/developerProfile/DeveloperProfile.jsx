"use client";

import { useState } from "react";

import {
  Pencil,
  Building2,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Home,
  Heart,
  CreditCard,
  LogOut,
  Landmark,
  CheckCircle,
  Mail,
  House,
} from "lucide-react";

import styles from "./DeveloperProfile.module.css";

import DeveloperEditModal from "./developerEdit/DeveloperEditModal";

export default function DeveloperProfile({ user }) {
  const [edit, setEdit] = useState(false);

  if (!user) return null;

  const profile = user.profile || {};

  const company = profile.company_name || "Строительная компания";

  const whatsapp = user.phone?.replace(/\D/g, "") || "";

  function logout() {
    localStorage.removeItem("uytap_user");

    document.cookie = "uytap_token=; path=/; max-age=0";

    window.location.href = "/login";
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.glow} />

        <div className={styles.header}>
          <div className={styles.logo}>
            {profile.logo_url ? (
              <img src={profile.logo_url} alt={company} />
            ) : (
              <img
                src={profile.logo_url || "/assets/DeveloperImage.png"}
                alt={company}
              />
            )}
          </div>

          <div className={styles.info}>
            <div className={styles.badge}>Застройщик</div>

            <div className={styles.titleRow}>
              <h1>{company}</h1>

              {user.isVerified && <CheckCircle className={styles.verify} />}
            </div>

            <p className={styles.company}>
              <Landmark />
              Строительная компания
            </p>

            <p className={styles.description}>
              {profile.about || "Компания пока не добавила описание"}
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
                <small>Адрес офиса</small>

                <strong>{profile.office_address}</strong>
              </div>
            </div>
          )}

          {profile.website && (
            <a
              className={styles.contactCard}
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
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
          <div className={styles.whatsappWrapper}>
            <a
              className={styles.whatsapp}
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle />
              Написать в WhatsApp
            </a>
          </div>
        )}
      </section>

      <section className={styles.stats}>
        <div>
          <strong>{profile.projects_count || 0}</strong>

          <span>ЖК построено</span>
        </div>

        <div>
          <strong>{profile.apartments_count || 0}</strong>

          <span>квартир</span>
        </div>

        <div>
          <strong>{profile.ads_count || 0}</strong>

          <span>объявлений</span>
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

      {edit && <DeveloperEditModal user={user} close={() => setEdit(false)} />}
    </main>
  );
}
