"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  Building2,
  Pencil,
  Phone,
  MessageCircle,
  Heart,
  Home,
  CreditCard,
  LogOut,
  ArrowLeft,
  Mail,
  MapPin,
  Globe,
  User,
  Check,
} from "lucide-react";

import styles from "./AgencyProfile.module.css";
import AgencyEditModal from "./agencyEdit/AgencyEditModal";

export default function AgencyProfile({ user }) {
  const [openEdit, setOpenEdit] = useState(false);

  if (!user) return null;

  const profile = user.profile || {};

  const logoUrl =
    profile.avatar_url ||
    profile.logo_url ||
    profile.avatar ||
    user.avatar_url ||
    user.avatar ||
    "/assets/AgencyImage.png";

  const companyName = profile.company_name || "Агентство недвижимости";

  const director =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    "Руководитель";

  const phone = user.phone || "";
  const whatsappNumber = phone.replace(/\D/g, "");

  const website = profile.website || "";
  const officeAddress = profile.office_address || "";
  const email = user.email || "";

  function logout() {
    localStorage.removeItem("uytap_user");

    document.cookie = "uytap_token=; path=/; max-age=0";

    window.location.href = "/login";
  }

  return (
    <main className={styles.page}>
      {/* TOP BAR */}

      <div className={styles.topBar}>
        <Link href="/" className={styles.homeButton}>
          <ArrowLeft />
          На главную
        </Link>
      </div>

      {/* MAIN PROFILE */}

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
          duration: 0.45,
          ease: "easeOut",
        }}
      >
        <div className={styles.topGlow} />

        {/* LOGO */}

        <div className={styles.logoWrapper}>
          <div className={styles.logo}>
            <img src={logoUrl} alt={companyName} />
          </div>
        </div>

        {/* INFO */}

        <div className={styles.info}>
          <div className={styles.heading}>
            <h1>{companyName}</h1>

            {user.isVerified && (
              <span className={styles.verified} title="Подтверждено">
                <Check />
              </span>
            )}
          </div>

          <span className={styles.type}>
            <Building2 />
            Агентство недвижимости
          </span>

          <div className={styles.director}>
            <User />

            <span>
              Руководитель: <strong>{director}</strong>
            </span>
          </div>

          <div className={styles.contacts}>
            {phone && (
              <div className={styles.contact}>
                <Phone />

                <span>{phone}</span>
              </div>
            )}

            {email && (
              <div className={styles.contact}>
                <Mail />

                <span>{email}</span>
              </div>
            )}

            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.contact} ${styles.whatsapp}`}
              >
                <MessageCircle />
                WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* EDIT */}

        <button
          type="button"
          className={styles.edit}
          onClick={() => setOpenEdit(true)}
          aria-label="Редактировать профиль"
        >
          <Pencil />
        </button>
      </motion.section>

      {/* ABOUT */}

      <section className={styles.about}>
        <div className={styles.sectionTitle}>
          <Building2 />
          <h3>Об агентстве</h3>
        </div>

        <p>{profile.about || "Агентство пока не добавило описание."}</p>
      </section>

      {/* COMPANY DETAILS */}

      {(officeAddress || website) && (
        <section className={styles.details}>
          {officeAddress && (
            <div className={styles.detail}>
              <div className={styles.detailIcon}>
                <MapPin />
              </div>

              <div>
                <span>Офис</span>
                <strong>{officeAddress}</strong>
              </div>
            </div>
          )}

          {website && (
            <a
              href={website.startsWith("http") ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.detail}
            >
              <div className={styles.detailIcon}>
                <Globe />
              </div>

              <div>
                <span>Веб-сайт</span>
                <strong>{website}</strong>
              </div>
            </a>
          )}
        </section>
      )}

      {/* STATS */}

      <section className={styles.stats}>
        <div className={styles.stat}>
          <strong>{profile.ads_count || 0}</strong>
          <span>Объявлений</span>
        </div>

        <div className={styles.stat}>
          <strong>{profile.favorites_count || 0}</strong>
          <span>Избранных</span>
        </div>

        <div className={styles.stat}>
          <strong>{user.tariff || "FREE"}</strong>
          <span>Тариф</span>
        </div>
      </section>

      {/* ACTIONS */}

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

        <Link href="/profile/favorites">
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

      {/* EDIT MODAL */}

      {openEdit && (
        <AgencyEditModal user={user} close={() => setOpenEdit(false)} />
      )}
    </main>
  );
}
