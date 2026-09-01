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
  BriefcaseBusiness,
  ArrowLeft,
} from "lucide-react";

import { mapListingData } from "@/utils/mapListingData";

import styles from "./AgencyPublicProfile.module.css";
import ListingCard from "@/components/ui/ListingCard/ListingCard";

export default function AgencyPublicProfile({
  profile,
  favIds = new Set(),
  onFavoriteClick,
}) {
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
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGlowSecondary} />

      <div className={styles.container}>
        {/* =====================================================
            HERO
        ===================================================== */}
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={17} />
          <span>На главную</span>
        </Link>

        {/* =====================================================
      HERO
  ===================================================== */}

        <motion.section
          className={styles.hero}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className={styles.heroGlow} />

          <div className={styles.heroTopLine}>
            <span className={styles.heroLabel}>
              <Building2 size={14} />
              Агентство недвижимости
            </span>

            {profile.isVerified && (
              <span className={styles.verified}>
                <Check size={14} />
                Проверено
              </span>
            )}
          </div>

          <div className={styles.heroMain}>
            {/* LOGO */}

            <div className={styles.logoColumn}>
              <div className={styles.logoFrame}>
                <img src={logoUrl} alt={companyName} className={styles.logo} />
              </div>

              <span className={styles.logoCaption}>UyTap.kg</span>
            </div>

            {/* INFO */}

            <div className={styles.heroContent}>
              <h1>{companyName}</h1>

              <div className={styles.director}>
                <span className={styles.directorIcon}>
                  <User size={15} />
                </span>

                <span className={styles.directorLabel}>Руководитель</span>

                <strong>{director}</strong>
              </div>

              <p className={styles.heroDescription}>
                {data.about ||
                  "Профессиональное агентство недвижимости. Подбор, продажа и аренда объектов недвижимости."}
              </p>

              <div className={styles.actions}>
                {phone && (
                  <a href={`tel:${phone}`} className={styles.primaryButton}>
                    <Phone size={16} />
                    Позвонить
                  </a>
                )}

                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryButton}
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                    <ArrowUpRight size={14} />
                  </a>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className={styles.secondaryButton}
                  >
                    <Mail size={16} />
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* STATS */}

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatIcon}>
                <Home size={17} />
              </div>

              <div>
                <strong>{activeAds}</strong>
                <span>Активных объявлений</span>
              </div>
            </div>

            <div className={styles.statDivider} />

            <div className={styles.heroStat}>
              <div className={styles.heroStatIcon}>
                <BriefcaseBusiness size={17} />
              </div>

              <div>
                <strong>{properties}</strong>
                <span>Объектов всего</span>
              </div>
            </div>

            {officeAddress && (
              <>
                <div className={styles.statDivider} />

                <div className={styles.heroStatLocation}>
                  <MapPin size={17} />

                  <div>
                    <span>Офис</span>
                    <strong>{officeAddress}</strong>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.section>

        {/* =====================================================
            DETAILS
        ===================================================== */}

        {(officeAddress || website) && (
          <motion.section
            className={styles.details}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            {officeAddress && (
              <div className={styles.detailCard}>
                <div className={styles.detailIcon}>
                  <MapPin size={18} />
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
                className={styles.detailCard}
              >
                <div className={styles.detailIcon}>
                  <Globe size={18} />
                </div>

                <div>
                  <span>Веб-сайт</span>
                  <strong>{website.replace(/^https?:\/\//, "")}</strong>
                </div>

                <ArrowUpRight size={16} className={styles.externalIcon} />
              </a>
            )}
          </motion.section>
        )}

        {/* =====================================================
            LISTINGS
        ===================================================== */}

        <section className={styles.listingsSection}>
          <div className={styles.listingsHeading}>
            <div>
              <span className={styles.sectionNumber}>02</span>

              <h2>Объявления агентства</h2>

              <p>Актуальные объекты недвижимости от {companyName}</p>
            </div>

            <span className={styles.count}>
              {ads.length}
              <small>объектов</small>
            </span>
          </div>

          {ads.length > 0 ? (
            <motion.div
              className={styles.listingsGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.06,
                  },
                },
              }}
            >
              {ads.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 15,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ListingCard
                    item={mapListingData(item)}
                    isFavorite={favIds.has(item.id)}
                    onFavoriteClick={onFavoriteClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <Building2 size={24} />
              </div>

              <h3>Пока нет активных объявлений</h3>

              <p>Агентство ещё не разместило объекты недвижимости.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
