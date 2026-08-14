"use client";

import {
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Mail,
  Home,
  Building2,
  CheckCircle,
} from "lucide-react";

import styles from "./RealtorPublicProfile.module.css";

export default function RealtorPublicProfile({ user }) {
  if (!user) return null;

  const profile = user.profile || {};

  const avatarUrl =
    profile.avatar_url ||
    profile.avatar ||
    user.avatar_url ||
    user.avatar ||
    "/assets/realtorImage.png";

  const name =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    "Риэлтор";

  const company = profile.company_name || "";

  const phone = user.phone || "";
  const email = user.email || "";
  const whatsapp = phone.replace(/\D/g, "");

  const userId = user.id || user.user_id;

  const website = profile.website || "";
  const officeAddress = profile.office_address || "";

  const ads = profile.ads || profile.listings || profile.properties || [];

  const adsCount = profile.ads_count ?? ads.length;
  const clientsCount = profile.clients_count ?? 0;

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGlowTwo} />

      {/* =========================
          PROFILE
      ========================= */}

      <section className={styles.profileCard}>
        <div className={styles.cardAccent} />

        <div className={styles.profileTop}>
          {/* AVATAR */}

          <div className={styles.avatarColumn}>
            <div className={styles.avatarRing}>
              <div className={styles.avatar}>
                <img src={avatarUrl} alt={name} />
              </div>
            </div>
          </div>

          {/* INFO */}

          <div className={styles.info}>
            <span className={styles.badge}>Риэлтор</span>

            <div className={styles.nameRow}>
              <h1>{name}</h1>

              {user.isVerified && (
                <span className={styles.verified} title="Проверенный профиль">
                  <CheckCircle />
                </span>
              )}
            </div>

            {company && (
              <div className={styles.company}>
                <Building2 />
                <span>{company}</span>
              </div>
            )}

            <p className={styles.description}>
              {profile.about ||
                "Риэлтор пока не добавил описание своей деятельности."}
            </p>

            {/* ACTIONS */}

            <div className={styles.actions}>
              {phone && (
                <a href={`tel:${phone}`} className={styles.primaryAction}>
                  <Phone />
                  Позвонить
                </a>
              )}

              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappAction}
                >
                  <MessageCircle />
                  WhatsApp
                </a>
              )}

              {email && (
                <a href={`mailto:${email}`} className={styles.secondaryAction}>
                  <Mail />
                  Email
                </a>
              )}
            </div>
          </div>
        </div>

        {/* CONTACT INFORMATION */}

        {(officeAddress || website) && (
          <div className={styles.details}>
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
                href={
                  website.startsWith("http") ? website : `https://${website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className={styles.detail}
              >
                <div className={styles.detailIcon}>
                  <Globe />
                </div>

                <div>
                  <span>Сайт</span>
                  <strong>{website.replace(/^https?:\/\//, "")}</strong>
                </div>
              </a>
            )}
          </div>
        )}
      </section>

      {/* =========================
          STATS
      ========================= */}

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <strong>{adsCount}</strong>
          <span>Объявлений</span>

          <Home className={styles.statBackgroundIcon} />
        </div>

        <div className={styles.statCard}>
          <strong>{clientsCount}</strong>
          <span>Клиентов</span>

          <Building2 className={styles.statBackgroundIcon} />
        </div>
      </section>

      {userId && (
        <section className={styles.listingsLinkSection}>
          <a href={`/profile/${userId}/ads`} className={styles.allAdsButton}>
            <div className={styles.allAdsIcon}>
              <Home />
            </div>

            <div className={styles.allAdsText}>
              <strong>Смотреть объявления риэлтора</strong>
              <span>Все объекты недвижимости и актуальные предложения</span>
            </div>

            <span className={styles.allAdsArrow}>→</span>
          </a>
        </section>
      )}
    </main>
  );
}
