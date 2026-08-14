"use client";

import { useState } from "react";

import {
  X,
  Camera,
  Phone,
  User,
  FileText,
  Check,
  Trash2,
  Building2,
  Globe,
  MapPin,
  Hash,
} from "lucide-react";

import styles from "./RealtorEditModal.module.css";

import { getMe, updateMe } from "@/utils/api";

export default function RealtorEditModal({ user, close }) {
  const profile = user?.profile || {};

  const initialAvatar =
    profile.avatar_url ||
    profile.avatar ||
    user?.avatar_url ||
    user?.avatar ||
    null;

  const DEFAULT_AVATAR = "/assets/realtorImage.png";

  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState(profile.first_name || "");

  const [lastName, setLastName] = useState(profile.last_name || "");

  const [phone, setPhone] = useState(user?.phone || "");

  const [companyName, setCompanyName] = useState(profile.company_name || "");

  const [inn, setInn] = useState(profile.inn || "");

  const [website, setWebsite] = useState(profile.website || "");

  const [officeAddress, setOfficeAddress] = useState(
    profile.office_address || "",
  );

  const [about, setAbout] = useState(profile.about || "");

  const [avatar, setAvatar] = useState(initialAvatar || DEFAULT_AVATAR);

  const [avatarFile, setAvatarFile] = useState(null);

  // true только если пользователь реально нажал "Удалить фото"
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  /*
   * =========================================================
   * AVATAR
   * =========================================================
   */

  function uploadAvatar(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Размер изображения не должен превышать 5 МБ");
      return;
    }

    setAvatarFile(file);
    setAvatarRemoved(false);

    setAvatar(URL.createObjectURL(file));
  }

  function removeAvatar() {
    setAvatar(null);
    setAvatarFile(null);
    setAvatarRemoved(true);
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
   * ПОЛУЧИТЬ АВАТАР ДЛЯ ОТПРАВКИ
   * =========================================================
   */

  async function getAvatarFile() {
    // Пользователь удалил фото
    if (avatarRemoved) {
      return await fileFromUrl(DEFAULT_AVATAR, "realtorImage.png");
    }

    // Пользователь выбрал новое фото
    if (avatarFile) {
      return avatarFile;
    }

    // Фото существовало и пользователь его не менял
    if (initialAvatar) {
      return await fileFromUrl(initialAvatar, "current-avatar.jpg");
    }

    // Фото не было вообще
    return await fileFromUrl(DEFAULT_AVATAR, "realtorImage.png");
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

      const token = localStorage.getItem("uytap_token");

      if (!token) {
        throw new Error("Сначала войдите в аккаунт");
      }

      /*
       * Получаем финальный avatar file
       */
      const finalAvatarFile = await getAvatarFile();

      /*
       * FormData
       *
       * Используем тот же endpoint,
       * который уже работает для PersonalProfile.
       */

      const formData = new FormData();

      formData.append("first_name", firstName.trim());

      formData.append("last_name", lastName.trim());

      formData.append("phone", phone.trim());

      formData.append("company_name", companyName.trim());

      formData.append("inn", inn.trim());

      formData.append("website", website.trim());

      formData.append("office_address", officeAddress.trim());

      formData.append("about", about.trim());

      /*
       * Аватар отправляем ВСЕГДА.
       */

      formData.append("avatar", finalAvatarFile);

      /*
       * Отправляем профиль + avatar
       */

      const response = await fetch("/api/auth/avatar", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Не удалось сохранить профиль");
      }

      /*
       * Профиль, который вернул backend
       */

      const refreshedProfile = result.profile || {};

      let savedAvatar;

      if (avatarRemoved) {
        savedAvatar =
          refreshedProfile.avatar_url ||
          refreshedProfile.avatar ||
          DEFAULT_AVATAR;
      } else {
        savedAvatar =
          refreshedProfile.avatar_url ||
          refreshedProfile.avatar ||
          avatar ||
          initialAvatar ||
          DEFAULT_AVATAR;
      }

      /*
       * Собираем локального пользователя
       */

      const updatedUser = {
        ...user,

        phone,

        profile: {
          ...(user?.profile || {}),

          ...refreshedProfile,

          first_name: firstName,
          last_name: lastName,

          company_name: companyName,
          inn,
          website,
          office_address: officeAddress,

          about,

          avatar_url: savedAvatar,
          avatar: savedAvatar,
        },
      };

      /*
       * Сохраняем локально
       */

      localStorage.setItem("uytap_user", JSON.stringify(updatedUser));

      /*
       * Сообщаем всему приложению,
       * что пользователь обновился
       */

      try {
        window.dispatchEvent(
          new CustomEvent("uytap:user-updated", {
            detail: updatedUser,
          }),
        );
      } catch (error) {
        console.warn("Could not dispatch user-updated event", error);
      }

      /*
       * Обновляем обычные данные пользователя.
       *
       * Если backend updateMe принимает
       * только эти поля — оставляем их здесь.
       */

      await updateMe(token, {
        firstName,
        lastName,
        phone,
        companyName,
        inn,
        website,
        officeAddress,
        about,
      });

      /*
       * Получаем полностью свежего пользователя
       */

      const freshUser = await getMe(token);

      /*
       * Если аватар удалён,
       * гарантируем fallback на фронте.
       */

      if (avatarRemoved) {
        freshUser.profile = {
          ...(freshUser.profile || {}),

          avatar_url: freshUser?.profile?.avatar_url || DEFAULT_AVATAR,

          avatar: freshUser?.profile?.avatar || DEFAULT_AVATAR,
        };
      }

      localStorage.setItem("uytap_user", JSON.stringify(freshUser));

      /*
       * Закрываем modal
       */

      close();

      /*
       * Перезагружаем страницу,
       * как в PersonalProfile.
       */

      window.location.reload();
    } catch (error) {
      console.error("REALTOR PROFILE SAVE ERROR:", error);

      alert(error?.message || "Не удалось сохранить изменения");
    } finally {
      setLoading(false);
    }
  }

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
          {/* =================================================
              HEADER
          ================================================= */}

          <header className={styles.header}>
            <h2>Редактирование профиля</h2>

            <p>Обновите данные риэлтора</p>
          </header>

          {/* =================================================
              AVATAR
          ================================================= */}

          <div className={styles.avatarBlock}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {avatar ? <img src={avatar} alt="Аватар риэлтора" /> : <User />}
              </div>
            </div>

            <div className={styles.avatarActions}>
              <label className={styles.upload}>
                <Camera size={17} />

                <span>{avatar ? "Изменить фото" : "Добавить фото"}</span>

                <input
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={uploadAvatar}
                  disabled={loading}
                />
              </label>

              {avatar && (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={removeAvatar}
                  disabled={loading}
                >
                  <Trash2 size={17} />

                  <span>Удалить фото</span>
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              FIELDS
          ================================================= */}

          <div className={styles.fields}>
            {/* Имя + фамилия */}

            <div className={styles.row}>
              <div className={styles.inputBox}>
                <User />

                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Имя"
                  disabled={loading}
                />
              </div>

              <div className={styles.inputBox}>
                <User />

                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Фамилия"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Агентство */}

            <div className={styles.inputBox}>
              <Building2 />

              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Название агентства"
                disabled={loading}
              />
            </div>

            {/* Телефон */}

            <div className={styles.inputBox}>
              <Phone />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Телефон"
                disabled={loading}
              />
            </div>

            {/* ИНН */}

            <div className={styles.inputBox}>
              <Hash />

              <input
                value={inn}
                onChange={(e) => setInn(e.target.value)}
                placeholder="ИНН"
                disabled={loading}
              />
            </div>

            {/* Сайт */}

            <div className={styles.inputBox}>
              <Globe />

              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Сайт"
                disabled={loading}
              />
            </div>

            {/* Адрес */}

            <div className={styles.inputBox}>
              <MapPin />

              <input
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                placeholder="Адрес офиса"
                disabled={loading}
              />
            </div>

            {/* =================================================
                ABOUT / TEXTAREA
            ================================================= */}

            <div className={styles.textarea}>
              <FileText />

              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Расскажите о себе и своей работе"
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
