"use client";

import { useState, useRef } from "react";

import {
  X,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Camera,
  Hash,
} from "lucide-react";

import styles from "./AgencyEditModal.module.css";

import { updateMe, getMe, uploadAvatar } from "@/utils/api";

export default function AgencyEditModal({ close, user }) {
  const fileRef = useRef(null);
  const profile = user?.profile || {};
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  const [logoPreview, setLogoPreview] = useState(
    profile.avatar_url || profile.logo_url || null,
  );

  const [form, setForm] = useState({
    company_name: profile.company_name || "",

    director_name: profile.first_name || profile.director_name || "",

    inn: profile.inn || "",

    phone: user?.phone || "",

    email: user?.email || "",

    address: profile.office_address || "",

    website: profile.website || "",

    about: profile.about || "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function chooseLogo() {
    fileRef.current?.click();
  }

  function handleLogo(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setLogoFile(file);
    const preview = URL.createObjectURL(file);

    setLogoPreview(preview);
  }

  function getTokenFromCookie() {
    const match = document.cookie.match(/(^|;)\s*uytap_token=([^;]*)/);
    return match ? decodeURIComponent(match[2]) : null;
  }

  async function save() {
    if (loading) return;

    try {
      setLoading(true);

      const token = getTokenFromCookie() || localStorage.getItem("uytap_token");
      if (!token) {
        throw new Error("Сессия не найдена. Пожалуйста, войдите в аккаунт заново.");
      }

      if (logoFile) {
        await uploadAvatar(token, logoFile);
      }

      const payload = {
        companyName: form.company_name,
        directorName: form.director_name,
        inn: form.inn,
        officeAddress: form.address,
        about: form.about,
      };

      if (form.phone !== user?.phone) {
        payload.phone = form.phone;
      }

      await updateMe(token, payload);

      const freshUser = await getMe(token);
      localStorage.setItem("uytap_user", JSON.stringify(freshUser));
      try {
        window.dispatchEvent(new CustomEvent("uytap:user-updated", { detail: freshUser }));
      } catch (e) {
        console.warn("Could not dispatch user-updated event", e);
      }
      close();
    } catch (error) {
      console.error("AGENCY PROFILE SAVE ERROR:", error);
      alert(error.message || "Не удалось сохранить профиль");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <button className={styles.close} onClick={close}>
        <X />
      </button>

      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Редактирование агентства</h2>
        </div>

        <label className={styles.logoUpload} onClick={chooseLogo}>
          {logoPreview ? (
            <img src={logoPreview} className={styles.preview} alt="logo" />
          ) : (
            <>
              <Camera />

              <span>Загрузить логотип</span>
            </>
          )}
        </label>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleLogo}
        />

        <div className={styles.input}>
          <Building2 />

          <input
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            placeholder="Название агентства"
          />
        </div>

        <div className={styles.input}>
          <User />

          <input
            name="director_name"
            value={form.director_name}
            onChange={handleChange}
            placeholder="Руководитель"
          />
        </div>

        <div className={styles.input}>
          <Hash />

          <input
            name="inn"
            value={form.inn}
            onChange={handleChange}
            placeholder="ИНН"
          />
        </div>

        <div className={styles.input}>
          <Phone />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Телефон"
          />
        </div>

        <div className={styles.input}>
          <Mail />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>

        <div className={styles.input}>
          <MapPin />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Адрес офиса"
          />
        </div>

        <div className={styles.input}>
          <Globe />

          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Сайт"
          />
        </div>

        <textarea
          name="about"
          value={form.about}
          onChange={handleChange}
          placeholder="Описание агентства"
          className={styles.textarea}
        />

        <button className={styles.save} onClick={save}>
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}
