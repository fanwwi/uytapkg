"use client";

import { useState } from "react";

import {
  User,
  Building2,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  X,
  Hash,
} from "lucide-react";

import styles from "./RealtorEditModal.module.css";

import { updateMe, getMe } from "@/utils/api";

export default function RealtorEditModal({ close, user }) {
  const profile = user?.profile || {};

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",

    company_name: profile.company_name || "",

    phone: user?.phone || "",

    email: user?.email || profile.email || "",

    website: profile.website || "",

    office_address: profile.office_address || "",

    inn: profile.inn || "",

    about: profile.about || "",
  });

  function change(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function getTokenFromCookie() {
    const cookies = document.cookie.split("; ");

    const tokenCookie = cookies.find((cookie) =>
      cookie.startsWith("uytap_token="),
    );

    if (!tokenCookie) return null;

    return decodeURIComponent(tokenCookie.substring("uytap_token=".length));
  }

  async function save() {
    if (loading) return;

    try {
      setLoading(true);

      const token = getTokenFromCookie();

      if (!token) {
        throw new Error(
          "Сессия не найдена. Пожалуйста, войдите в аккаунт заново.",
        );
      }

      const payload = {
        firstName: form.first_name,
        lastName: form.last_name,
        companyName: form.company_name,
        officeAddress: form.office_address,
        about: form.about,
        website: form.website,
        inn: form.inn,
      };

      // Отправляем телефон только если он реально изменился
      if (form.phone !== user?.phone) {
        payload.phone = form.phone;
      }

      console.log("PROFILE UPDATE PAYLOAD:", payload);

      // Обновляем профиль на backend
      await updateMe(token, payload);

      // Получаем свежие данные
      const freshUser = await getMe(token);

      console.log("UPDATED USER:", freshUser);

      // Обновляем локального пользователя
      localStorage.setItem("uytap_user", JSON.stringify(freshUser));

      close();

      // Обновляем страницу профиля
      window.location.reload();
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
