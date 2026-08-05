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
  Check,
  User,
  House
} from "lucide-react";

import styles from "./AgencyProfile.module.css";
import AgencyEditModal from "./agencyEdit/AgencyEditModal";

export default function AgencyProfile({ user }) {
  const [openEdit, setOpenEdit] = useState(false);

  if (!user) return null;

  const profile = user.profile || {};

  const companyName = profile.company_name || "Агентство недвижимости";

  const director = profile.first_name || "Руководитель";

  const phone = user.phone || "";

  const whatsapp = phone.replace(/\D/g, "");

  function logout() {
    localStorage.removeItem("uytap_user");

    document.cookie = "uytap_token=; path=/; max-age=0";

    window.location.href = "/login";
  }

  return (
    <main className={styles.wrapper}>
      <section className={styles.profileCard}>
        <div className={styles.logoBox}>
          {profile.logo_url ? (
            <img src={profile.logo_url} alt={companyName} />
          ) : (
            <Building2 />
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.title}>
            <h1>{companyName}</h1>

            {user.isVerified && (
              <span className={styles.verify}>
                <Check />
              </span>
            )}

            <span className={styles.type}>Агентство</span>
          </div>

          <div className={styles.director}>
            <User /> Руководитель: {director}
          </div>

          <p className={styles.about}>
            {profile.about || "Описание агентства отсутствует"}
          </p>

          <div className={styles.contacts}>
            {phone && (
              <div className={styles.card}>
                <Phone />
                <div>
                  <small>Телефон</small>
                  <b>{phone}</b>
                </div>
              </div>
            )}

            {user.email && (
              <div className={styles.card}>
                <Mail />
                <div>
                  <small>Email</small>
                  <b>{user.email}</b>
                </div>
              </div>
            )}

            {profile.office_address && (
              <div className={styles.card}>
                <MapPin />
                <div>
                  <small>Адрес</small>
                  <b>{profile.office_address}</b>
                </div>
              </div>
            )}

            {profile.website && (
              <a href={profile.website} target="_blank" className={styles.card}>
                <Globe />

                <div>
                  <small>Сайт</small>
                  <b>{profile.website}</b>
                </div>
              </a>
            )}

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
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
      </section>

      <section className={styles.stats}>
        <div>
          <strong>{profile.ads_count || 0}</strong>
          <span>Объявлений</span>
        </div>

        <div>
          <strong>{profile.favorites_count || 0}</strong>
          <span>Избранных</span>
        </div>

        <div>
          <strong>{user.tariff || "FREE"}</strong>

          <span>Тариф</span>
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
          Тариф
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
