"use client";

import { useState } from "react";
import ListingCard from "@/components/ui/ListingCard/ListingCard";
import { mapListingData } from "@/utils/mapListingData";
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
} from "lucide-react";

import styles from "./DeveloperPublicProfile.module.css";

export default function DeveloperPublicProfile({ user, favIds = new Set(), onFavoriteClick }) {
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

  const whatsapp = user.phone?.replace(/\D/g, "") || "";

  const projects =
    user.complexes ||
    profile.projects ||
    profile.residential_complexes ||
    profile.complexes ||
    [];

  const ads = user.ads || profile.ads || [];

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
      project.cover_photo ||
      project.image_url ||
      project.image ||
      project.cover ||
      project.photo ||
      "/assets/DeveloperImage.png"
    );
  }

  function getProjectStatus(project) {
    const status = project.completion_status || project.status || "building";
    if (status === "completed") return "Сдан";
    return "Строится";
  }

  function getProjectApartments(project) {
    return (
      project.features?.apartments ||
      project.apartments_count || 
      project.apartments || 
      project.units_count || 
      0
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </div>

          <div className={styles.profileInfo}>
            <span className={styles.typeBadge}>Застройщик</span>

            <h1>{company}</h1>

            <div className={styles.representative}>
              <User />
              <span>Представитель:</span>
              <strong>{fullName}</strong>
            </div>
          </div>
        </div>

        <p className={styles.description}>
          {profile.about ||
            "Компания пока не добавила описание своей деятельности."}
        </p>

        <div className={styles.contactsGrid}>
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
        <div className={styles.stat} onClick={() => setActiveTab("complexes")} style={{ cursor: "pointer", borderBottom: activeTab === "complexes" ? "2px solid #3182ce" : "none" }}>
          <div className={styles.statIcon}>
            <Building2 />
          </div>

          <div>
            <strong>{projects.length}</strong>
            <span>Жилых Комплексов</span>
          </div>
        </div>

        <div className={styles.stat} onClick={() => setActiveTab("listings")} style={{ cursor: "pointer", borderBottom: activeTab === "listings" ? "2px solid #3182ce" : "none" }}>
          <div className={styles.statIcon}>
            <Home />
          </div>

          <div>
            <strong>{ads.length}</strong>
            <span>Объявлений</span>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: "1200px", margin: "30px auto", padding: "0 20px", width: "100%" }}>
        {activeTab === "complexes" ? (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px", color: "#fff" }}>
              Жилые комплексы ({projects.length})
            </h2>
            {projects.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px", width: "100%" }}>
                {projects.map((item) => (
                  <a href={`/complexes/${item.id}`} key={item.id} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden", transition: "transform 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseOut={(e) => e.currentTarget.style.transform = "none"}>
                      <div style={{ height: "180px", position: "relative", background: "#1a202c" }}>
                        <img src={getProjectImage(item)} alt={getProjectName(item)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", color: "#fff" }}>
                          {getProjectStatus(item)}
                        </div>
                      </div>
                      <div style={{ padding: "16px" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "#fff" }}>{getProjectName(item)}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#a0aec0", fontSize: "14px", marginBottom: "12px" }}>
                          <MapPin size={14} />
                          <span>{getProjectAddress(item)}</span>
                        </div>
                        {getProjectApartments(item) > 0 && (
                          <div style={{ fontSize: "14px", color: "#e2e8f0" }}>
                            Квартир в комплексе: <strong>{getProjectApartments(item)}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "#a0aec0", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.15)" }}>
                У застройщика пока нет зарегистрированных жилых комплексов.
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px", color: "#fff" }}>
              Объявления застройщика ({ads.length})
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
                У застройщика пока нет активных объявлений о продаже недвижимости.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
