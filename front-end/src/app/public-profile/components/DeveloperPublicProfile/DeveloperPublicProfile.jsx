"use client";

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
  Map,
  CalendarDays,
  Layers3,
  User,
} from "lucide-react";

import styles from "./DeveloperPublicProfile.module.css";

export default function DeveloperPublicProfile({ user }) {
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

  const whatsapp = user.phone?.replace(/\D/g, "") || "";

  const projects =
    profile.projects ||
    profile.residential_complexes ||
    profile.complexes ||
    [];

  function getProjectName(project) {
    return (
      project.name || project.title || project.project_name || "Жилой комплекс"
    );
  }

  function getProjectAddress(project) {
    return (
      project.address ||
      project.location ||
      project.office_address ||
      "Адрес не указан"
    );
  }

  function getProjectImage(project) {
    return (
      project.image_url ||
      project.image ||
      project.cover ||
      project.photo ||
      "/assets/DeveloperImage.png"
    );
  }

  function getProjectStatus(project) {
    return project.status || project.construction_status || "Строительство";
  }

  function getProjectApartments(project) {
    return (
      project.apartments_count || project.apartments || project.units_count || 0
    );
  }

  const websiteUrl = profile.website
    ? profile.website.startsWith("http")
      ? profile.website
      : `https://${profile.website}`
    : "";

  return (
    <main className={styles.page}>
      <section className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              <img src={avatar} alt={company} />
            </div>

            {user.isVerified && (
              <span className={styles.avatarVerified}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12.5 9.5 17 19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.profileNameRow}>
              <h1>{company}</h1>

              {user.isVerified && (
                <span className={styles.verified}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12.5 9.5 17 19 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>

            <div className={styles.role}>
              <Building2 />
              Застройщик
            </div>

            <div className={styles.person}>
              <User />
              {fullName}
            </div>

            <p className={styles.description}>
              {profile.about || "Компания пока не добавила описание."}
            </p>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.contacts}>
          {user.phone && (
            <div className={styles.contact}>
              <div className={styles.contactIcon}>
                <Phone />
              </div>

              <div>
                <span>Телефон</span>
                <strong>{user.phone}</strong>
              </div>
            </div>
          )}

          {user.email && (
            <div className={styles.contact}>
              <div className={styles.contactIcon}>
                <Mail />
              </div>

              <div>
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
            </div>
          )}

          {profile.office_address && (
            <div className={styles.contact}>
              <div className={styles.contactIcon}>
                <MapPin />
              </div>

              <div>
                <span>Офис</span>
                <strong>{profile.office_address}</strong>
              </div>
            </div>
          )}

          {profile.inn && (
            <div className={styles.contact}>
              <div className={styles.contactIcon}>
                <Hash />
              </div>

              <div>
                <span>ИНН</span>
                <strong>{profile.inn}</strong>
              </div>
            </div>
          )}

          {websiteUrl && (
            <a
              className={styles.contact}
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.contactIcon}>
                <Globe />
              </div>

              <div>
                <span>Сайт</span>
                <strong>{profile.website.replace(/^https?:\/\//, "")}</strong>
              </div>

              <ArrowUpRight className={styles.external} />
            </a>
          )}
        </div>

        {(whatsapp || websiteUrl) && (
          <div className={styles.actions}>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsapp}
              >
                <MessageCircle />
                Написать в WhatsApp
              </a>
            )}

            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.website}
              >
                <Globe />
                Перейти на сайт
                <ArrowUpRight />
              </a>
            )}
          </div>
        )}
      </section>

      <section className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statIcon}>
            <Building2 />
          </div>

          <div>
            <strong>{profile.projects_count || projects.length || 0}</strong>
            <span>ЖК</span>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statIcon}>
            <Home />
          </div>

          <div>
            <strong>{profile.apartments_count || 0}</strong>
            <span>квартир</span>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statIcon}>
            <Layers3 />
          </div>

          <div>
            <strong>{profile.ads_count || 0}</strong>
            <span>объявлений</span>
          </div>
        </div>
      </section>

      <nav className={styles.menu}>
        <a href="/ads">
          <Building2 />
          Все ЖК
        </a>

        <a href="/ads">
          <Home />
          Объявления
        </a>
      </nav>
    </main>
  );
}
