"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Home,
  Building2,
  Mail,
  Hash,
  ArrowUpRight,
  User,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

import ListingCard from "@/components/ui/ListingCard/ListingCard";
import { mapListingData } from "@/utils/mapListingData";

import styles from "./DeveloperPublicProfile.module.css";
import ListingCardBlack from "@/components/ui/ListingCardBlack/ListingCardBlack";

export default function DeveloperPublicProfile({
  user,
  favIds = new Set(),
  onFavoriteClick,
}) {
  const [activeTab, setActiveTab] = useState("complexes");

  if (!user) return null;

  const profile = user.profile || {};

  const company =
    profile.company_name || profile.company || "Строительная компания";

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    "Представитель компании";

  const avatar =
    profile.avatar_url ||
    profile.avatar ||
    user.avatar_url ||
    user.avatar ||
    "/assets/DeveloperImage.png";

  const phone = user.phone || "";
  const email = user.email || "";

  const whatsapp = phone.replace(/\D/g, "");

  const projects =
    user.complexes ||
    profile.projects ||
    profile.residential_complexes ||
    profile.complexes ||
    [];

  const ads = user.ads || profile.ads || [];

  const websiteUrl = profile.website
    ? profile.website.startsWith("http")
      ? profile.website
      : `https://${profile.website}`
    : "";

  const getProjectName = (project) =>
    project.name || project.title || project.project_name || "Жилой комплекс";

  const getProjectAddress = (project) =>
    project.address ||
    project.location ||
    project.office_address ||
    "Адрес не указан";

  const getProjectImage = (project) =>
    project.cover_photo ||
    project.image_url ||
    project.image ||
    project.cover ||
    project.photo ||
    "/assets/DeveloperImage.png";

  const getProjectStatus = (project) => {
    const status = project.completion_status || project.status || "building";

    if (
      status === "completed" ||
      status === "complete" ||
      status === "finished"
    ) {
      return "Сдан";
    }

    return "Строится";
  };

  const getProjectApartments = (project) =>
    project.features?.apartments ||
    project.apartments_count ||
    project.apartments ||
    project.units_count ||
    0;

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlowOne} />
      <div className={styles.backgroundGlowTwo} />

      <Link href="/" className={styles.backButton}>
        <ArrowLeft size={17} />
        <span>На главную</span>
      </Link>

      <section className={styles.profileCard}>
        <div className={styles.profileAccent} />

        <div className={styles.profileMain}>
          {/* AVATAR */}

          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              <img src={avatar} alt={company} />
            </div>

            {user.isVerified && (
              <div
                className={styles.avatarVerified}
                title="Проверенная компания"
              >
                <CheckCircle2 />
              </div>
            )}
          </div>

          {/* INFO */}

          <div className={styles.profileInfo}>
            <div className={styles.badges}>
              <span className={styles.typeBadge}>
                <Building2 />
                Застройщик
              </span>

              {user.isVerified && (
                <span className={styles.verifiedBadge}>
                  <CheckCircle2 />
                  Проверено
                </span>
              )}
            </div>

            <h1>{company}</h1>

            <div className={styles.representative}>
              <User />

              <span>Представитель</span>

              <strong>{fullName}</strong>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}

        <div className={styles.descriptionBlock}>
          <span className={styles.sectionNumber}>01</span>

          <div>
            <span className={styles.sectionCaption}>О компании</span>

            <p className={styles.description}>
              {profile.about ||
                "Компания пока не добавила описание своей деятельности."}
            </p>
          </div>
        </div>

        {/* CONTACTS */}

        <div className={styles.contactsGrid}>
          {phone && (
            <a href={`tel:${phone}`} className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <Phone />
              </div>

              <div className={styles.contactContent}>
                <span>Телефон</span>
                <strong>{phone}</strong>
              </div>

              <ArrowUpRight className={styles.contactArrow} />
            </a>
          )}

          {email && (
            <a href={`mailto:${email}`} className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <Mail />
              </div>

              <div className={styles.contactContent}>
                <span>Email</span>
                <strong>{email}</strong>
              </div>

              <ArrowUpRight className={styles.contactArrow} />
            </a>
          )}

          {profile.office_address && (
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <MapPin />
              </div>

              <div className={styles.contactContent}>
                <span>Офис</span>
                <strong>{profile.office_address}</strong>
              </div>
            </div>
          )}

          {profile.inn && (
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <Hash />
              </div>

              <div className={styles.contactContent}>
                <span>ИНН</span>
                <strong>{profile.inn}</strong>
              </div>
            </div>
          )}

          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
            >
              <div className={styles.contactIcon}>
                <Globe />
              </div>

              <div className={styles.contactContent}>
                <span>Сайт</span>

                <strong>{profile.website.replace(/^https?:\/\//, "")}</strong>
              </div>

              <ArrowUpRight className={styles.contactArrow} />
            </a>
          )}
        </div>

        {/* ACTIONS */}

        {(whatsapp || websiteUrl) && (
          <div className={styles.actions}>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryAction}
              >
                <MessageCircle />
                Написать в WhatsApp
                <ArrowUpRight />
              </a>
            )}

            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryAction}
              >
                <Globe />
                Перейти на сайт
                <ArrowUpRight />
              </a>
            )}
          </div>
        )}
      </section>

      {/* =====================================================
          STATS / TABS
      ===================================================== */}

      <section className={styles.stats}>
        <button
          type="button"
          className={`${styles.stat} ${
            activeTab === "complexes" ? styles.statActive : ""
          }`}
          onClick={() => setActiveTab("complexes")}
        >
          <div className={styles.statIcon}>
            <Building2 />
          </div>

          <div className={styles.statContent}>
            <strong>{projects.length}</strong>
            <span>Жилых комплексов</span>
          </div>

          <ChevronRight className={styles.statArrow} />
        </button>

        <button
          type="button"
          className={`${styles.stat} ${
            activeTab === "listings" ? styles.statActive : ""
          }`}
          onClick={() => setActiveTab("listings")}
        >
          <div className={styles.statIcon}>
            <Home />
          </div>

          <div className={styles.statContent}>
            <strong>{ads.length}</strong>
            <span>Объявлений</span>
          </div>

          <ChevronRight className={styles.statArrow} />
        </button>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className={styles.contentSection}>
        {/* SECTION HEADER */}

        <div className={styles.contentHeader}>
          <div>
            <span className={styles.contentEyebrow}>
              {activeTab === "complexes" ? "02 / ПРОЕКТЫ" : "02 / НЕДВИЖИМОСТЬ"}
            </span>

            <h2>
              {activeTab === "complexes"
                ? "Жилые комплексы"
                : "Объявления застройщика"}
            </h2>

            <p>
              {activeTab === "complexes"
                ? "Проекты, которые развивает компания"
                : "Актуальные предложения компании"}
            </p>
          </div>

          <div className={styles.contentCount}>
            {activeTab === "complexes" ? projects.length : ads.length}
            <span>объектов</span>
          </div>
        </div>

        {/* =================================================
            COMPLEXES
        ================================================= */}

        {activeTab === "complexes" && (
          <>
            {projects.length > 0 ? (
              <div className={styles.projectsGrid}>
                {projects.map((project) => (
                  <Link
                    href={`/complexes/${project.id}`}
                    key={project.id}
                    className={styles.projectCard}
                  >
                    <div className={styles.projectImage}>
                      <img
                        src={getProjectImage(project)}
                        alt={getProjectName(project)}
                      />

                      <div
                        className={`${styles.projectStatus} ${
                          getProjectStatus(project) === "Сдан"
                            ? styles.completed
                            : styles.building
                        }`}
                      >
                        <span />
                        {getProjectStatus(project)}
                      </div>

                      <div className={styles.projectOverlay} />

                      <div className={styles.projectImageTitle}>
                        {getProjectName(project)}
                      </div>
                    </div>

                    <div className={styles.projectContent}>
                      <h3>{getProjectName(project)}</h3>

                      <div className={styles.projectAddress}>
                        <MapPin />

                        <span>{getProjectAddress(project)}</span>
                      </div>

                      {getProjectApartments(project) > 0 && (
                        <div className={styles.projectMeta}>
                          <Home />

                          <span>{getProjectApartments(project)} квартир</span>
                        </div>
                      )}

                      <div className={styles.projectLink}>
                        <span>Подробнее о комплексе</span>
                        <ArrowUpRight />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <Building2 />
                </div>

                <h3>Пока нет жилых комплексов</h3>

                <p>У этой компании пока нет зарегистрированных проектов.</p>
              </div>
            )}
          </>
        )}

        {/* =================================================
            LISTINGS
        ================================================= */}

        {activeTab === "listings" && (
          <>
            {ads.length > 0 ? (
              <div className={styles.listingsGrid}>
                {ads.map((item) => (
                  <ListingCardBlack
                    key={item.id}
                    item={mapListingData(item)}
                    isFavorite={favIds.has(item.id)}
                    onFavoriteClick={onFavoriteClick}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <Home />
                </div>

                <h3>Пока нет активных объявлений</h3>

                <p>У застройщика пока нет опубликованных предложений.</p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
