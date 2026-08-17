"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  Building2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Globe,
  User,
  Check,
  ArrowUpRight,
  Home,
} from "lucide-react";

import ListingCard from "@/components/ui/ListingCard/ListingCard";
import { mapListingData } from "@/utils/mapListingData";

import styles from "./AgencyPublicProfile.module.css";

export default function AgencyPublicProfile({ profile, favIds = new Set(), onFavoriteClick }) {
  if (!profile) return null;

  const data = profile.profile || {};

  const logoUrl =
    data.avatar_url ||
    data.logo_url ||
    data.avatar ||
    profile.avatar_url ||
    profile.avatar ||
    "/assets/AgencyImage.png";

  const companyName =
    data.company_name || data.company || "Агентство недвижимости";

  const director =
    `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Руководитель";

  const phone = profile.phone || "";
  const email = profile.email || "";
  const whatsappNumber = phone.replace(/\D/g, "");

  const website = data.website || "";
  const officeAddress = data.office_address || "";

  const ads = profile.ads || data.ads || data.listings || data.properties || [];

  const activeAds = profile.ads_count ?? ads.length;

  const properties = data.properties_count ?? data.objects_count ?? ads.length;

  return (
    <main className={styles.page}>
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      {/* PROFILE */}

      <motion.section
        className={styles.profile}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className={styles.profileAccent} />

        {/* LOGO */}

        <div className={styles.logoSide}>
          <div className={styles.logoFrame}>
            <img src={logoUrl} alt={companyName} className={styles.logo} />
          </div>
        </div>

        {/* CONTENT */}

        <div className={styles.profileContent}>
          <div className={styles.profileTop}>
            <span className={styles.profileType}>
              <Building2 />
              Агентство недвижимости
            </span>

            {profile.isVerified && (
              <span className={styles.verified} title="Проверенное агентство">
                <Check />
                Проверено
              </span>
            )}
          </div>

          <h1>{companyName}</h1>

          <div className={styles.director}>
            <User />

            <span>Руководитель</span>

            <strong>{director}</strong>
          </div>

          <div className={styles.actions}>
            {phone && (
              <a href={`tel:${phone}`} className={styles.callButton}>
                <Phone />
                Позвонить
              </a>
            )}

            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionButton}
              >
                <MessageCircle />
                WhatsApp
                <ArrowUpRight />
              </a>
            )}

            {email && (
              <a href={`mailto:${email}`} className={styles.actionButton}>
                <Mail />
                Email
              </a>
            )}
          </div>
        </div>
      </motion.section>

      {/* ABOUT */}

      <section className={styles.about}>
        <div className={styles.blockHeading}>
          <span>01</span>
          <div>
            <h2>О компании</h2>
            <p>Информация об агентстве</p>
          </div>
        </div>

        <p className={styles.aboutText}>
          {data.about ||
            "Агентство пока не добавило описание своей деятельности."}
        </p>
      </section>

      {/* DETAILS */}

      {(officeAddress || website) && (
        <section className={styles.details}>
          {officeAddress && (
            <div className={styles.detailCard}>
              <div className={styles.detailIcon}>
                <MapPin />
              </div>

              <div className={styles.detailContent}>
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
              className={styles.detailCard}
            >
              <div className={styles.detailIcon}>
                <Globe />
              </div>

              <div className={styles.detailContent}>
                <span>Сайт</span>

                <strong>{website.replace(/^https?:\/\//, "")}</strong>
              </div>

              <ArrowUpRight className={styles.externalIcon} />
            </a>
          )}
        </section>
      )}

      {/* STATS */}

      <section className={styles.stats}>
        <div className={styles.stat}>
          <Home />

          <div>
            <strong>{activeAds}</strong>
            <span>активных объявлений</span>
          </div>
        </div>

        <div className={styles.stat}>
          <Building2 />

          <div>
            <strong>{properties}</strong>
            <span>объектов всего</span>
          </div>
        </div>
      </section>

      <section className={styles.listingsSection} style={{ maxWidth: "1200px", margin: "40px auto 0", padding: "0 20px", width: "100%" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "20px", color: "#fff" }}>
          Объявления агентства ({ads.length})
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
            У агентства пока нет активных объявлений.
          </div>
        )}
      </section>
    </main>
  );
}
