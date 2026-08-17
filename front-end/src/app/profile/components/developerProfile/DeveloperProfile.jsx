"use client";

import { useState, useEffect } from "react";
import { getMyComplexes } from "@/utils/api";

import {
  Pencil,
  Building2,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Home,
  Heart,
  CreditCard,
  LogOut,
  Landmark,
  CheckCircle,
  Mail,
  House,
  Hash,
  ArrowUpRight,
  Plus,
  Map,
  CalendarDays,
  Layers3,
} from "lucide-react";

import styles from "./DeveloperProfile.module.css";

import DeveloperEditModal from "./developerEdit/DeveloperEditModal";

export default function DeveloperProfile({ user, adsCount = 0 }) {
  const [edit, setEdit] = useState(false);

  if (!user) return null;

  const profile = user.profile || {};

  const company =
    profile.company_name || profile.company || "Строительная компания";

  const firstName = profile.first_name || "";
  const lastName = profile.last_name || "";

  const fullName =
    `${firstName} ${lastName}`.trim() || "Представитель компании";

  const avatar =
    profile.avatar_url ||
    profile.avatar ||
    user.avatar_url ||
    user.avatar ||
    "/assets/DeveloperImage.png";

  const whatsapp = user.phone?.replace(/\D/g, "") || "";

  /*
   * ЖК.
   *
   * Backend может вернуть:
   * profile.projects
   * profile.residential_complexes
   * profile.complexes
   *
   * Поэтому делаем компонент устойчивым.
   */
  const [dbProjects, setDbProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("uytap_token");
    if (!token) return;

    getMyComplexes(token)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((item) => ({
            id: item.id,
            name: item.name,
            address: item.address,
            image_url: item.cover_photo || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85",
            completion_status: item.completion_status,
            completion_date: item.completion_date,
            apartments: item.features?.apartments || 0,
          }));
          setDbProjects(mapped);
        }
      })
      .catch((err) => console.error("Error fetching developer profile projects:", err))
      .finally(() => setLoadingProjects(false));
  }, []);

  const projects = dbProjects.length > 0 ? dbProjects : (
    profile.projects ||
    profile.residential_complexes ||
    profile.complexes ||
    []
  );

  function logout() {
    localStorage.removeItem("uytap_user");

    document.cookie = "uytap_token=; path=/; max-age=0";

    window.location.href = "/login";
  }

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

  return (
    <main className={styles.page}>
      {/* =====================================================
          MAIN PROFILE
      ===================================================== */}

      <section className={styles.profileCard}>
        <div className={styles.glow} />

        <div className={styles.header}>
          {/* AVATAR */}

          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              <img src={avatar} alt={company} />
            </div>

            {user.isVerified && (
              <div className={styles.avatarVerified}>
                <CheckCircle />
              </div>
            )}
          </div>

          {/* INFO */}

          <div className={styles.info}>
            <div className={styles.badge}>
              <Building2 size={14} />
              Застройщик
            </div>

            <div className={styles.titleRow}>
              <h1>{company}</h1>

              {user.isVerified && <CheckCircle className={styles.verify} />}
            </div>

            <p className={styles.person}>
              <UserIcon />

              {fullName}
            </p>

            <p className={styles.companyType}>
              <Landmark />
              Застройщик и девелопер
            </p>

            <p className={styles.description}>
              {profile.about || "Компания пока не добавила описание."}
            </p>
          </div>

          {/* EDIT */}

          <button
            type="button"
            className={styles.edit}
            onClick={() => setEdit(true)}
          >
            <Pencil />
          </button>
        </div>

        {/* ===================================================
            CONTACTS
        =================================================== */}

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

          {user.email && (
            <div className={styles.contactCard}>
              <Mail />

              <div>
                <small>Email</small>
                <strong>{user.email}</strong>
              </div>
            </div>
          )}

          {profile.inn && (
            <div className={styles.contactCard}>
              <Hash />

              <div>
                <small>ИНН</small>
                <strong>{profile.inn}</strong>
              </div>
            </div>
          )}

          {profile.office_address && (
            <div className={styles.contactCard}>
              <MapPin />

              <div>
                <small>Офис</small>
                <strong>{profile.office_address}</strong>
              </div>
            </div>
          )}

          {profile.website && (
            <a
              className={styles.contactCard}
              href={
                profile.website.startsWith("http")
                  ? profile.website
                  : `https://${profile.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe />

              <div>
                <small>Сайт</small>

                <strong>{profile.website.replace(/^https?:\/\//, "")}</strong>
              </div>

              <ArrowUpRight className={styles.external} />
            </a>
          )}
        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className={styles.actions}>
          {whatsapp && (
            <a
              className={styles.whatsapp}
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle />
              Написать в WhatsApp
            </a>
          )}

          {profile.website && (
            <a
              className={styles.website}
              href={
                profile.website.startsWith("http")
                  ? profile.website
                  : `https://${profile.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe />
              Перейти на сайт
              <ArrowUpRight />
            </a>
          )}
        </div>
      </section>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

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
            <strong>
              {dbProjects.length > 0
                ? dbProjects.reduce((sum, p) => sum + (Number(p.apartments) || 0), 0)
                : (profile.apartments_count || 0)}
            </strong>

            <span>квартир</span>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statIcon}>
            <Layers3 />
          </div>

          <div>
            <strong>{adsCount}</strong>

            <span>объявлений</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          MY ЖК
      ===================================================== */}

      <section className={styles.projectsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionLabel}>
              <Building2 size={15} />
              Портфолио
            </div>

            <h2>Мои жилые комплексы</h2>

            <p>
              Управляйте проектами и показывайте покупателям, какие ЖК строит
              ваша компания.
            </p>
          </div>

          <a href="/add-residential-complex" className={styles.addProject}>
            <Plus />
            Добавить ЖК
          </a>
        </div>

        {projects.length > 0 ? (
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => {
              const name = getProjectName(project);
              const address = getProjectAddress(project);
              const image = getProjectImage(project);
              const status = getProjectStatus(project);
              const apartments = getProjectApartments(project);

              return (
                <article
                  className={styles.projectCard}
                  key={project.id || project._id || index}
                >
                  <div className={styles.projectImage}>
                    <img src={image} alt={name} />

                    <span className={styles.projectStatus}>{status}</span>
                  </div>

                  <div className={styles.projectContent}>
                    <h3>{name}</h3>

                    <p className={styles.projectAddress}>
                      <MapPin />
                      {address}
                    </p>

                    <div className={styles.projectMeta}>
                      <span>
                        <Home />
                        {apartments} квартир
                      </span>

                      {project.completion_date && (
                        <span>
                          <CalendarDays />

                          {project.completion_date}
                        </span>
                      )}
                    </div>

                    <a
                      href={
                        project.id
                          ? `/profile/projects/${project.id}`
                          : "/profile/projects"
                      }
                      className={styles.projectLink}
                    >
                      Подробнее
                      <ArrowUpRight />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyProjects}>
            <div className={styles.emptyIcon}>
              <Building2 />
            </div>

            <h3>У вас пока нет ЖК</h3>

            <p>
              Добавьте первый жилой комплекс, чтобы покупатели могли увидеть
              ваши проекты прямо в профиле.
            </p>

            <a href="/add-residential-complex" className={styles.emptyButton}>
              <Plus />
              Добавить первый ЖК
            </a>
          </div>
        )}
      </section>

      {/* =====================================================
          MENU
      ===================================================== */}

      <section className={styles.menu}>
        <a href="/">
          <House />
          Главная
        </a>

        <a href="/profile/projects">
          <Building2 />
          Мои ЖК
        </a>

        <a href="/profile/ads">
          <Home />
          Мои объявления
        </a>

        <a href="/favorites">
          <Heart />
          Избранное
        </a>

        <a href="/profile/tariff">
          <CreditCard />
          Мой тариф
        </a>

        <button type="button" onClick={logout}>
          <LogOut />
          Выйти
        </button>
      </section>

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {edit && <DeveloperEditModal user={user} close={() => setEdit(false)} />}
    </main>
  );
}

/*
 * Маленькая обёртка вместо импорта User,
 * чтобы не конфликтовать с переменной user.
 */
function UserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
