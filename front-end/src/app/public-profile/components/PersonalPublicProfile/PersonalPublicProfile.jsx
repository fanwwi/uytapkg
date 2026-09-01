"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Home,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";

import { mapListingData } from "@/utils/mapListingData";

import styles from "./PersonalPublicProfile.module.css";
import ListingCard from "@/components/ui/ListingCard/ListingCard";

export default function PersonalPublicProfile({
  user,
  favIds = new Set(),
  onFavoriteClick,
}) {
  if (!user) return null;

  const profile = user.profile || {};

  const avatarUrl =
    profile.avatar_url ||
    profile.avatar ||
    user.avatar_url ||
    user.avatar ||
    "";

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    "Пользователь";

  const phone = user.phone || "";

  const whatsappNumber = phone.replace(/\D/g, "");

  const role =
    user.role || user.user_type || profile.role || profile.user_type || "user";

  const profileType = getProfileType(role);

  const ads = user.ads || [];

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />

      <div className={styles.container}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={17} />
          <span>На главную</span>
        </Link>

        {/* PROFILE */}

        <motion.section
          className={styles.profileCard}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
        >
          <div className={styles.profileAccent} />

          <div className={styles.profileTop}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} />
                ) : (
                  <User size={48} />
                )}
              </div>
            </div>

            <div className={styles.profileInfo}>
              <div className={styles.badge}>
                {profileType.icon}
                {profileType.label}
              </div>

              <h1>{fullName}</h1>

              <div className={styles.profileRole}>
                <span>{profileType.aboutTitle}</span>
              </div>

              {phone && (
                <div className={styles.contacts}>
                  <div className={styles.phone}>
                    <Phone size={17} />
                    <span>{phone}</span>
                  </div>

                  {whatsappNumber && (
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsapp}
                    >
                      <MessageCircle size={17} />
                      <span>WhatsApp</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* ABOUT */}

        <motion.section
          className={styles.aboutCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.08,
          }}
        >
          <div className={styles.aboutHeader}>
            <span className={styles.aboutEyebrow}>Профиль</span>

            <h2>{profileType.aboutTitle}</h2>
          </div>

          <p>{profile.about || profileType.defaultAbout}</p>
        </motion.section>

        {/* LISTINGS */}

        <motion.section
          className={styles.listingsSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.14,
          }}
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Недвижимость</span>

              <h2>{profileType.adsDescription}</h2>
            </div>

            <span className={styles.count}>{ads.length}</span>
          </div>

          {ads.length > 0 ? (
            <div className={styles.listingGrid}>
              {ads.map((item) => (
                <ListingCard
                  key={item.id}
                  item={mapListingData(item)}
                  isFavorite={favIds.has(item.id)}
                  onFavoriteClick={onFavoriteClick}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Home size={25} />
              </div>

              <h3>Пока нет объявлений</h3>

              <p>
                У пользователя пока нет активных объявлений о продаже
                недвижимости.
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
}

function getProfileType(role) {
  const normalized = String(role).toLowerCase().trim();

  if (
    normalized === "developer" ||
    normalized === "builder" ||
    normalized === "застройщик"
  ) {
    return {
      label: "Застройщик",
      aboutTitle: "О компании",
      defaultAbout: "Застройщик пока не добавил описание.",
      adsDescription: "Объекты и предложения застройщика",
      icon: <Building2 size={14} />,
    };
  }

  if (
    normalized === "agency" ||
    normalized === "real_estate_agency" ||
    normalized === "агентство"
  ) {
    return {
      label: "Агентство недвижимости",
      aboutTitle: "Об агентстве",
      defaultAbout: "Агентство пока не добавило описание.",
      adsDescription: "Объекты агентства",
      icon: <Building2 size={14} />,
    };
  }

  if (
    normalized === "realtor" ||
    normalized === "agent" ||
    normalized === "риэлтор"
  ) {
    return {
      label: "Риэлтор",
      aboutTitle: "О риэлторе",
      defaultAbout: "Риэлтор пока не добавил описание.",
      adsDescription: "Объекты риэлтора",
      icon: <User size={14} />,
    };
  }

  return {
    label: "Частное лицо",
    aboutTitle: "О себе",
    defaultAbout: "Пользователь пока не добавил описание.",
    adsDescription: "Объявления пользователя",
    icon: <User size={14} />,
  };
}
