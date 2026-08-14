"use client";

import { useState } from "react";

import {
  X,
  Camera,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Hash,
  FileText,
  Check,
  Trash2,
} from "lucide-react";

import styles from "./AgencyEditModal.module.css";

import { getMe, updateMe } from "@/utils/api";

export default function AgencyEditModal({ user, close }) {
  const profile = user?.profile || {};

  const DEFAULT_LOGO = "/assets/AgencyImage.png";

  /*
   * =========================================================
   * INITIAL LOGO
   * =========================================================
   */

  const initialLogo =
    profile.avatar_url ||
    profile.logo_url ||
    profile.avatar ||
    profile.logo ||
    null;

  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [loading, setLoading] = useState(false);

  const [companyName, setCompanyName] = useState(profile.company_name || "");

  const [directorName, setDirectorName] = useState(
    profile.first_name || profile.director_name || "",
  );

  const [inn, setInn] = useState(profile.inn || "");

  const [phone, setPhone] = useState(user?.phone || "");

  const [email, setEmail] = useState(user?.email || "");

  const [address, setAddress] = useState(profile.office_address || "");

  const [website, setWebsite] = useState(profile.website || "");

  const [about, setAbout] = useState(profile.about || "");

  /*
   * Дефолтная картинка показывается сразу.
   */

  const [logo, setLogo] = useState(initialLogo || DEFAULT_LOGO);

  /*
   * Реальный выбранный файл.
   */

  const [logoFile, setLogoFile] = useState(null);

  /*
   * true только если пользователь нажал
   * "Удалить логотип".
   */

  const [logoRemoved, setLogoRemoved] = useState(false);

  /*
   * =========================================================
   * НУЖНО ЛИ ПОКАЗЫВАТЬ КНОПКУ "УДАЛИТЬ"
   * =========================================================
   *
   * Если стоит AgencyImage.png — кнопки нет.
   *
   * Если пользовательский логотип — кнопка есть.
   */

  const hasCustomLogo =
    Boolean(initialLogo) &&
    initialLogo !== DEFAULT_LOGO &&
    logo !== DEFAULT_LOGO &&
    !logoRemoved;

  /*
   * =========================================================
   * CHOOSE LOGO
   * =========================================================
   */

  function uploadLogo(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Размер изображения не должен превышать 5 МБ");
      return;
    }

    setLogoFile(file);

    setLogoRemoved(false);

    setLogo(URL.createObjectURL(file));
  }

  /*
   * =========================================================
   * REMOVE LOGO
   * =========================================================
   */

  function removeLogo() {
    setLogoFile(null);

    setLogoRemoved(true);

    /*
     * Сразу показываем дефолтную картинку.
     */

    setLogo(DEFAULT_LOGO);
  }

  /*
   * =========================================================
   * URL -> FILE
   * =========================================================
   */

  async function fileFromUrl(url, fileName) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Не удалось получить изображение");
    }

    const blob = await response.blob();

    return new File([blob], fileName, {
      type: blob.type || "image/png",
    });
  }

  /*
   * =========================================================
   * GET LOGO FILE
   * =========================================================
   */

  async function getLogoFile() {
    /*
     * -------------------------------------------------------
     * 1. ПОЛЬЗОВАТЕЛЬ УДАЛИЛ ЛОГОТИП
     * -------------------------------------------------------
     *
     * Всегда отправляем AgencyImage.png
     */

    if (logoRemoved) {
      return await fileFromUrl(DEFAULT_LOGO, "AgencyImage.png");
    }

    /*
     * -------------------------------------------------------
     * 2. ВЫБРАЛ НОВЫЙ ЛОГОТИП
     * -------------------------------------------------------
     */

    if (logoFile) {
      return logoFile;
    }

    /*
     * -------------------------------------------------------
     * 3. ЛОГОТИП НЕ МЕНЯЛИ
     * -------------------------------------------------------
     *
     * Повторно отправляем существующий.
     */

    if (initialLogo && initialLogo !== DEFAULT_LOGO) {
      return await fileFromUrl(initialLogo, "current-agency-logo.jpg");
    }

    /*
     * -------------------------------------------------------
     * 4. ЛОГОТИПА ИЗНАЧАЛЬНО НЕ БЫЛО
     * -------------------------------------------------------
     */

    return await fileFromUrl(DEFAULT_LOGO, "AgencyImage.png");
  }

  /*
   * =========================================================
   * GET TOKEN
   * =========================================================
   */

  function getToken() {
    const cookieMatch = document.cookie.match(/(^|;)\s*uytap_token=([^;]*)/);

    return (
      (cookieMatch ? decodeURIComponent(cookieMatch[2]) : null) ||
      localStorage.getItem("uytap_token")
    );
  }

  /*
   * =========================================================
   * SAVE
   * =========================================================
   */

  async function save() {
    if (loading) return;

    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Сессия не найдена. Пожалуйста, войдите в аккаунт заново.",
        );
      }

      /*
       * =====================================================
       * 1. ВСЕГДА ПОЛУЧАЕМ ФАЙЛ ЛОГОТИПА
       * =====================================================
       */

      const finalLogoFile = await getLogoFile();

      /*
       * =====================================================
       * 2. UPLOAD LOGO
       * =====================================================
       */

      const form = new FormData();

      form.append("first_name", directorName.trim());

      form.append("phone", phone.trim());

      form.append("about", about.trim());

      /*
       * Логотип отправляем ВСЕГДА.
       */

      form.append("avatar", finalLogoFile);

      const avatarResponse = await fetch("/api/auth/avatar", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: form,
      });

      const avatarResult = await avatarResponse.json().catch(() => ({}));

      if (!avatarResponse.ok || !avatarResult.success) {
        throw new Error(avatarResult.message || "Не удалось сохранить логотип");
      }

      /*
       * =====================================================
       * 3. UPDATE PROFILE DATA
       * =====================================================
       */

      const payload = {
        companyName: companyName.trim(),

        directorName: directorName.trim(),

        inn: inn.trim(),

        officeAddress: address.trim(),

        website: website.trim(),

        about: about.trim(),
      };

      /*
       * Телефон обновляем только если изменился.
       */

      if (phone !== user?.phone) {
        payload.phone = phone.trim();
      }

      /*
       * Email тоже отправляем, если backend поддерживает
       * это поле.
       */

      if (email !== user?.email) {
        payload.email = email.trim();
      }

      await updateMe(token, payload);

      /*
       * =====================================================
       * 4. GET FRESH USER
       * =====================================================
       */

      const freshUser = await getMe(token);

      /*
       * =====================================================
       * 5. НОРМАЛИЗУЕМ ЛОГОТИП НА FRONTEND
       * =====================================================
       *
       * Если backend не вернул картинку после удаления,
       * всё равно оставляем AgencyImage.png.
       */

      const freshProfile = freshUser?.profile || {};

      let savedLogo;

      if (logoRemoved) {
        savedLogo =
          freshProfile.avatar_url ||
          freshProfile.logo_url ||
          freshProfile.avatar ||
          freshProfile.logo ||
          DEFAULT_LOGO;
      } else {
        savedLogo =
          freshProfile.avatar_url ||
          freshProfile.logo_url ||
          freshProfile.avatar ||
          freshProfile.logo ||
          logo ||
          DEFAULT_LOGO;
      }

      const normalizedUser = {
        ...freshUser,

        profile: {
          ...freshProfile,

          company_name: companyName.trim(),

          first_name: directorName.trim(),

          director_name: directorName.trim(),

          inn: inn.trim(),

          office_address: address.trim(),

          website: website.trim(),

          about: about.trim(),

          avatar_url: savedLogo,

          avatar: savedLogo,

          logo_url: savedLogo,

          logo: savedLogo,
        },
      };

      /*
       * =====================================================
       * 6. LOCAL STORAGE
       * =====================================================
       */

      localStorage.setItem("uytap_user", JSON.stringify(normalizedUser));

      /*
       * =====================================================
       * 7. EVENT
       * =====================================================
       */

      try {
        window.dispatchEvent(
          new CustomEvent("uytap:user-updated", {
            detail: normalizedUser,
          }),
        );
      } catch (error) {
        console.warn("Could not dispatch user-updated event", error);
      }

      /*
       * =====================================================
       * 8. CLOSE + RELOAD
       * =====================================================
       */

      close();

      window.location.reload();
    } catch (error) {
      console.error("AGENCY PROFILE SAVE ERROR:", error);

      alert(error?.message || "Не удалось сохранить изменения");
    } finally {
      setLoading(false);
    }
  }

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.close}
          onClick={close}
          disabled={loading}
        >
          <X />
        </button>

        <div className={styles.scroll}>
          <header className={styles.header}>
            <h2>Редактирование профиля</h2>

            <p>Обновите данные вашего агентства</p>
          </header>

          {/* =================================================
              LOGO
          ================================================= */}

          <div className={styles.avatarBlock}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                <img
                  src={logo || DEFAULT_LOGO}
                  alt={companyName || "Логотип агентства"}
                />
              </div>
            </div>

            <div className={styles.avatarActions}>
              <label className={styles.upload}>
                <Camera size={17} />

                <span>Изменить логотип</span>

                <input
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={uploadLogo}
                  disabled={loading}
                />
              </label>

              {hasCustomLogo && (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={removeLogo}
                  disabled={loading}
                >
                  <Trash2 size={17} />

                  <span>Удалить логотип</span>
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              FIELDS
          ================================================= */}

          <div className={styles.fields}>
            <div className={styles.inputBox}>
              <Building2 />

              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Название агентства"
                disabled={loading}
              />
            </div>

            <div className={styles.inputBox}>
              <User />

              <input
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                placeholder="Руководитель"
                disabled={loading}
              />
            </div>

            <div className={styles.inputBox}>
              <Hash />

              <input
                value={inn}
                onChange={(e) => setInn(e.target.value)}
                placeholder="ИНН"
                disabled={loading}
              />
            </div>

            <div className={styles.inputBox}>
              <Phone />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Телефон"
                disabled={loading}
              />
            </div>

            <div className={styles.inputBox}>
              <Mail />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                disabled={loading}
              />
            </div>

            <div className={styles.inputBox}>
              <MapPin />

              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Адрес офиса"
                disabled={loading}
              />
            </div>

            <div className={styles.inputBox}>
              <Globe />

              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Сайт"
                disabled={loading}
              />
            </div>

            <div className={styles.textarea}>
              <FileText />

              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Описание агентства"
                disabled={loading}
              />
            </div>
          </div>

          {/* =================================================
              SAVE
          ================================================= */}

          <button
            type="button"
            className={styles.save}
            onClick={save}
            disabled={loading}
          >
            <Check size={18} />

            {loading ? "Сохраняем..." : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </div>
  );
}
