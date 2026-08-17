"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import ListingCard from "@/components/ui/ListingCard/ListingCard";
import { mapListingData } from "@/utils/mapListingData";

import styles from "./PersonalPublicProfile.module.css";

export default function PersonalPublicProfile({ user, favIds = new Set(), onFavoriteClick }) {
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

  const userId = user.id || user.user_id;
  const ads = user.ads || [];

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.homeButton}>
          ← <span>На главную</span>
        </Link>
      </div>

      <motion.section
        className={styles.profileCard}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className={styles.topGlow} />

        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} />
            ) : (
              <span>👤</span>
            )}
          </div>
        </div>

        <div className={styles.info}>
          <h1>{fullName}</h1>

          <span className={styles.type}>{profileType.label}</span>

          {phone && (
            <div className={styles.contacts}>
              <div className={styles.phone}>
                ☎ <span>{phone}</span>
              </div>

              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsapp}
                >
                  WhatsApp ↗
                </a>
              )}
            </div>
          )}
        </div>
      </motion.section>

      <section className={styles.about}>
        <h3>{profileType.aboutTitle}</h3>

        <p>{profile.about || profileType.defaultAbout}</p>
      </section>

      <section className={styles.listingsSection} style={{ maxWidth: "1200px", margin: "40px auto 0", padding: "0 20px", width: "100%" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "20px", color: "#fff" }}>
          Объявления пользователя ({ads.length})
        </h2>
        {ads.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", width: "100%" }}>
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
          <div style={{ textAlign: "center", padding: "40px", color: "#a0aec0", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.15)" }}>
            У пользователя пока нет активных объявлений.
          </div>
        )}
      </section>
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
    };
  }

  return {
    label: "Частное лицо",
    aboutTitle: "О себе",
    defaultAbout: "Пользователь пока не добавил описание.",
    adsDescription: "Объявления пользователя",
  };
}
