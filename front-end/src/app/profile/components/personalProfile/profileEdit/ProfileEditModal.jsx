"use client";

import { useState } from "react";

import { getMe, updateMe } from "@/utils/api";

import {
  X,
  Camera,
  Phone,
  User,
  FileText,
  Check,
  Trash2,
  UserRoundCog,
  Building,
  Hash,
  Globe,
  MapPin,
  Briefcase,
} from "lucide-react";

import styles from "./ProfileEditModal.module.css";
import CustomSelectBlack from "@/components/ui/customSelectBlack/CustomSelectBlack";


export default function ProfileEditModal({ user, close }) {
  const profile = user?.profile || {};

  const initialAvatar =
    profile.avatar_url ||
    profile.avatar ||
    user?.avatar_url ||
    user?.avatar ||
    null;

  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState(profile.first_name || "");

  const [lastName, setLastName] = useState(profile.last_name || "");

  const [phone, setPhone] = useState(user?.phone || "");

  const [about, setAbout] = useState(profile.about || "");

  const [inn, setInn] = useState(profile.inn || "");
  const [officeAddress, setOfficeAddress] = useState(profile.office_address || "");
  const [actualAddress, setActualAddress] = useState(profile.actualAddress || "");
  const [website, setWebsite] = useState(profile.website || "");
  const [region, setRegion] = useState(profile.region || "");
  const [companyName, setCompanyName] = useState(profile.company_name || "");
  const [fullName, setFullName] = useState(profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : profile.first_name || "");

  const DEFAULT_AVATAR = "/assets/personalImage.png";

  const [avatar, setAvatar] = useState(
    profile.avatar_url || profile.avatar || DEFAULT_AVATAR,
  );

  const [avatarFile, setAvatarFile] = useState(null);

  // true только если пользователь специально удалил аватар
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  const typeMapReverse = {
    personal: "Частное лицо",
    realtor: "Риэлтор",
    agency: "Агентство",
    developer: "Застройщик",
  };

  const accountMap = {
    personal: "Частное лицо",
    realtor: "Риэлтор",
    agency: "Агентство",
    developer: "Застройщик",
  };

  const [type, setType] = useState(
    accountMap[user?.accountType] || "Частное лицо",
  );

  const accountTypes = ["Частное лицо", "Риэлтор", "Агентство", "Застройщик"];

  const reverseMap = {
    "Частное лицо": "personal",
    "Риэлтор": "realtor",
    "Агентство": "agency",
    "Застройщик": "developer",
  };
  const selectedRole = reverseMap[type] || "personal";

  /*
   * =========================================================
   * ВЫБРАТЬ НОВЫЙ АВАТАР
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

    // Если выбрали новое фото после удаления —
    // отменяем состояние удаления
    setAvatarRemoved(false);

    setAvatar(URL.createObjectURL(file));
  }

  /*
   * =========================================================
   * УДАЛИТЬ АВАТАР
   * =========================================================
   */

  function removeAvatar() {
    setAvatar(null);
    setAvatarFile(null);

    // ВАЖНО:
    // save() теперь отправит personalImage.png
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
    /*
     * -------------------------------------------------------
     * 1. ПОЛЬЗОВАТЕЛЬ УДАЛИЛ АВАТАР
     *
     * Всегда отправляем дефолтную картинку.
     * -------------------------------------------------------
     */

    if (avatarRemoved) {
      return await fileFromUrl(
        "/assets/personalImage.png",
        "personalImage.png",
      );
    }

    /*
     * -------------------------------------------------------
     * 2. ПОЛЬЗОВАТЕЛЬ ВЫБРАЛ НОВЫЙ АВАТАР
     * -------------------------------------------------------
     */

    if (avatarFile) {
      return avatarFile;
    }

    /*
     * -------------------------------------------------------
     * 3. АВАТАР НЕ МЕНЯЛИ
     *
     * Берём существующую картинку
     * и отправляем её заново.
     * -------------------------------------------------------
     */

    if (initialAvatar) {
      return await fileFromUrl(initialAvatar, "current-avatar.jpg");
    }

    /*
     * -------------------------------------------------------
     * 4. АВАТАРА ИЗНАЧАЛЬНО НЕ БЫЛО
     * -------------------------------------------------------
     */

    return await fileFromUrl("/assets/personalImage.png", "personalImage.png");
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
       * -----------------------------------------------------
       * Получаем файл аватара
       * -----------------------------------------------------
       */

      const finalAvatarFile = await getAvatarFile();

      /*
       * -----------------------------------------------------
       * FormData
       * -----------------------------------------------------
       */

      const form = new FormData();

      form.append("first_name", firstName.trim());

      form.append("last_name", lastName.trim());

      form.append("phone", phone.trim());

      form.append("about", about.trim());

      /*
       * Аватар ВСЕГДА отправляем.
       *
       * Если удалили:
       * personalImage.png
       *
       * Если заменили:
       * новый файл
       *
       * Если не меняли:
       * старый файл
       */

      form.append("avatar", finalAvatarFile);

      /*
       * -----------------------------------------------------
       * Отправляем профиль + аватар
       * -----------------------------------------------------
       */

      const response = await fetch("/api/auth/avatar", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: form,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Не удалось сохранить профиль");
      }

      /*
       * -----------------------------------------------------
       * Аватар после сохранения
       * -----------------------------------------------------
       */

      const refreshedProfile = result.profile || {};

      let savedAvatar;

      /*
       * Если пользователь удалил аватар,
       * показываем именно дефолтную картинку.
       */

      if (avatarRemoved) {
        savedAvatar =
          refreshedProfile.avatar_url ||
          refreshedProfile.avatar ||
          "/assets/personalImage.png";
      } else {
        savedAvatar =
          refreshedProfile.avatar_url ||
          refreshedProfile.avatar ||
          avatar ||
          initialAvatar ||
          "/assets/personalImage.png";
      }

      /*
       * -----------------------------------------------------
       * Обновляем локального пользователя
       * -----------------------------------------------------
       */

      const updatedUser = {
        ...user,

        phone,

        profile: {
          ...(user?.profile || {}),

          ...refreshedProfile,

          first_name: firstName,
          last_name: lastName,
          about,

          avatar_url: savedAvatar,
          avatar: savedAvatar,
        },
      };

      localStorage.setItem("uytap_user", JSON.stringify(updatedUser));

      /*
       * -----------------------------------------------------
       * Notify app
       * -----------------------------------------------------
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
       * -----------------------------------------------------
       * Обновляем остальные данные пользователя
       * -----------------------------------------------------
       */

      const reverseMap = {
        "Частное лицо": "personal",
        "Риэлтор": "realtor",
        "Агентство": "agency",
        "Застройщик": "developer",
      };
      const selectedRole = reverseMap[type] || "personal";

      const payload = {
        firstName,
        lastName,
        phone,
        about,
        accountType: selectedRole,
      };

      if (selectedRole === "realtor") {
        payload.fullName = fullName;
        payload.inn = inn;
        payload.region = region;
      } else if (selectedRole === "agency" || selectedRole === "developer") {
        payload.companyName = companyName;
        payload.inn = inn;
        payload.officeAddress = officeAddress;
        payload.actualAddress = actualAddress;
        payload.website = website;
      }

      await updateMe(token, payload);

      /*
       * -----------------------------------------------------
       * Получаем полностью свежего пользователя
       * -----------------------------------------------------
       */

      const freshUser = await getMe(token);

      /*
       * Если backend почему-то не вернул
       * дефолтный avatar после удаления,
       * сохраняем его на фронте.
       */

      if (avatarRemoved) {
        freshUser.profile = {
          ...(freshUser.profile || {}),

          avatar_url: freshUser?.profile?.avatar_url || "/assets/personalImage.png",

          avatar: freshUser?.profile?.avatar || "/assets/personalImage.png",
        };
      }

      localStorage.setItem("uytap_user", JSON.stringify(freshUser));

      /*
       * -----------------------------------------------------
       * Успешно
       * -----------------------------------------------------
       */

      close();

      // reload ТОЛЬКО если всё успешно
      window.location.reload();
    } catch (error) {
      console.error("PROFILE SAVE ERROR:", error);

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
          <header className={styles.header}>
            <h2>Редактирование профиля</h2>

            <p>Обновите личные данные</p>
          </header>

          {/* =================================================
              AVATAR
          ================================================= */}

          <div className={styles.avatarBlock}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {avatar ? (
                  <img src={avatar} alt="Аватар пользователя" />
                ) : (
                  <User />
                )}
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
            {user?.accountType === "personal" && (
              <CustomSelectBlack
                icon={UserRoundCog}
                title="Тип аккаунта"
                options={accountTypes}
                value={type}
                setValue={setType}
              />
            )}

            {/* Персональный профиль */}
            {selectedRole === "personal" && (
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
            )}

            {/* Риэлтор */}
            {selectedRole === "realtor" && (
              <>
                <div className={styles.inputBox}>
                  <User />
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ФИО (обязательно)"
                    disabled={loading}
                  />
                </div>

                <div className={styles.inputBox}>
                  <Hash />
                  <input
                    value={inn}
                    onChange={(e) => setInn(e.target.value)}
                    placeholder="ИНН (обязательно)"
                    disabled={loading}
                  />
                </div>

                <div className={styles.inputBox}>
                  <MapPin />
                  <input
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Регион работы"
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {/* Агентство или Застройщик */}
            {(selectedRole === "agency" || selectedRole === "developer") && (
              <>
                <div className={styles.inputBox}>
                  <Building />
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={selectedRole === "agency" ? "Название агентства (обязательно)" : "Название компании (обязательно)"}
                    disabled={loading}
                  />
                </div>

                <div className={styles.inputBox}>
                  <Hash />
                  <input
                    value={inn}
                    onChange={(e) => setInn(e.target.value)}
                    placeholder="ИНН (обязательно)"
                    disabled={loading}
                  />
                </div>

                <div className={styles.inputBox}>
                  <MapPin />
                  <input
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    placeholder="Юридический адрес (обязательно)"
                    disabled={loading}
                  />
                </div>

                <div className={styles.inputBox}>
                  <MapPin />
                  <input
                    value={actualAddress}
                    onChange={(e) => setActualAddress(e.target.value)}
                    placeholder="Фактический адрес"
                    disabled={loading}
                  />
                </div>

                <div className={styles.inputBox}>
                  <Globe />
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Сайт компании"
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <div className={styles.inputBox}>
              <Phone />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Рабочий телефон (обязательно)"
                disabled={loading}
              />
            </div>

            <div className={styles.textarea}>
              <FileText />

              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder={selectedRole === "personal" ? "Расскажите о себе" : "Описание деятельности (обязательно)"}
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
