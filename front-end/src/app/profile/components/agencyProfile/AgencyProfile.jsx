"use client";

import { useState } from "react";

import {
  Building2,
  Pencil,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Mail,
  Home,
  Heart,
  CreditCard,
  LogOut,
} from "lucide-react";

import styles from "./AgencyProfile.module.css";
import AgencyEditModal from "./agencyEdit/AgencyEditModal";

export default function AgencyProfile({ user }) {
  const [openEdit, setOpenEdit] = useState(false);

  if (!user) return null;

  const profile = user.profile || {};

  const companyName =
    profile.company_name || profile.agency_name || "Агентство недвижимости";

  const whatsappNumber = user.phone?.replace(/\D/g, "") || "";

  function logout() {
    localStorage.removeItem("uytap_user");
    document.cookie = "uytap_token=; path=/; max-age=0";
    window.location.href = "/login";
  }

  return (
    <main className={styles.wrapper}>
      <section className={styles.profileCard}>
        <div className={styles.logoBlock}>
          <div className={styles.logo}>
            {profile.logo_url ? (
              <img src={profile.logo_url} alt={companyName} />
            ) : (
              <Building2 size={70} />
            )}
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h1>{companyName}</h1>

            <span className={styles.badge}>{user.tariff || "FREE"}</span>
          </div>

          <p className={styles.description}>
            {profile.about || "Агентство пока не добавило описание."}
          </p>

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

            {profile.email && (
              <div className={styles.contactCard}>
                <Mail />
                <div>
                  <small>Email</small>
                  <strong>{profile.email}</strong>
                </div>
              </div>
            )}

            {profile.address && (
              <div className={styles.contactCard}>
                <MapPin />
                <div>
                  <small>Адрес</small>
                  <strong>{profile.address}</strong>
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

            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactCard}
              >
                <MessageCircle />
                <div>
                  <small>WhatsApp</small>
                  <strong>Написать</strong>
                </div>
              </a>
            )}
          </div>
        </div>

        <button className={styles.edit} onClick={() => setOpenEdit(true)}>
          <Pencil />
        </button>
      </section>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <strong>{profile.ads_count || 0}</strong>
          <span>Объявлений</span>
        </div>

        <div className={styles.statCard}>
          <strong>{profile.favorites_count || 0}</strong>
          <span>Избранных</span>
        </div>

        <div className={styles.statCard}>
          <strong>{user.tariff || "FREE"}</strong>
          <span>Тариф</span>
        </div>
      </section>

      <section className={styles.menu}>
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

      {openEdit && (
        <AgencyEditModal user={user} close={() => setOpenEdit(false)} />
      )}
    </main>
  );
}
