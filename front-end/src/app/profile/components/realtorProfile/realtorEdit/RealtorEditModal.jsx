"use client";

import { useState, useEffect } from "react";
import {
  User,
  Building2,
  Phone,
  Globe,
  MapPin,
  X,
  Hash,
  Camera,
} from "lucide-react";
import styles from "./RealtorEditModal.module.css";
import { updateMe, getMe, uploadAvatar } from "@/utils/api";

export default function RealtorEditModal({ close, user }) {
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "/assets/realtorImage.png",
  );

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    phone: "",
    email: "",
    website: "",
    office_address: "",
    inn: "",
    about: "",
  });

  useEffect(() => {
    if (user) {
      const profile = user.profile || {};
      setForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        company_name: profile.company_name || "",
        phone: user.phone || "",
        email: user.email || "",
        website: profile.website || "",
        office_address: profile.office_address || "",
        inn: profile.inn || "",
        about: profile.about || "",
      });
      setAvatarPreview(profile.avatar_url || profile.avatar || "/assets/realtorImage.png");
    }
  }, [user]);

  function change(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
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
        throw new Error(
          "Сессия не найдена. Пожалуйста, войдите в аккаунт заново.",
        );
      }

      if (avatarFile) {
        await uploadAvatar(token, avatarFile);
      }

      const payload = {
        firstName: form.first_name,
        lastName: form.last_name,
        companyName: form.company_name,
        officeAddress: form.office_address,
        about: form.about,
        inn: form.inn,
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
      console.error("PROFILE UPDATE ERROR:", error);
      alert(error?.message || "Не удалось сохранить изменения");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <button
        className={styles.overlayClose}
        onClick={close}
        disabled={loading}
      >
        <X />
      </button>

      <div className={styles.modal}>
        <h2>Редактирование профиля</h2>

        <div className={styles.form}>
          {/* Выбор аватара */}
          <label className={styles.avatar}>
            <img src={avatarPreview} alt="Avatar preview" />
            <div className={styles.camera}>
              <Camera size={18} />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
              disabled={loading}
            />
          </label>

          <div className={styles.row}>
            <div className={styles.input}>
              <User />
              <input
                name="first_name"
                value={form.first_name}
                onChange={change}
                placeholder="Имя"
                disabled={loading}
              />
            </div>

            <div className={styles.input}>
              <User />
              <input
                name="last_name"
                value={form.last_name}
                onChange={change}
                placeholder="Фамилия"
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.input}>
            <Building2 />
            <input
              name="company_name"
              value={form.company_name}
              onChange={change}
              placeholder="Название агентства"
              disabled={loading}
            />
          </div>

          <div className={styles.input}>
            <Phone />
            <input
              name="phone"
              value={form.phone}
              onChange={change}
              placeholder="Телефон"
              disabled={loading}
            />
          </div>

          <div className={styles.input}>
            <Hash />
            <input
              name="inn"
              value={form.inn}
              onChange={change}
              placeholder="ИНН"
              disabled={loading}
            />
          </div>

          <div className={styles.input}>
            <Globe />
            <input
              name="website"
              value={form.website}
              onChange={change}
              placeholder="Сайт"
              disabled={loading}
            />
          </div>

          <div className={styles.input}>
            <MapPin />
            <input
              name="office_address"
              value={form.office_address}
              onChange={change}
              placeholder="Адрес компании"
              disabled={loading}
            />
          </div>

          <textarea
            className={styles.textarea}
            name="about"
            value={form.about}
            onChange={change}
            placeholder="Описание"
            disabled={loading}
          />

          <button className={styles.save} onClick={save} disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </div>
  );
}
