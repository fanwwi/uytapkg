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
} from "lucide-react";

import styles from "./ProfileEditModal.module.css";

import CustomSelect from "@/components/ui/customSelect/CustomSelect";

export default function ProfileEditModal({ user, close }) {
  const profile = user?.profile || {};
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState(profile.first_name || "");

  const [lastName, setLastName] = useState(profile.last_name || "");

  const [phone, setPhone] = useState(user?.phone || "");

  const [about, setAbout] = useState(profile.about || "");

  const [avatar, setAvatar] = useState(profile.avatar_url || null);

  const [avatarFile, setAvatarFile] = useState(null);

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

  function uploadAvatar(e) {
    const file = e.target.files[0];

    if (!file) return;

    setAvatarFile(file);

    setAvatar(URL.createObjectURL(file));
  }

  function removeAvatar() {
    setAvatar(null);

    setAvatarFile(null);
  }

  async function save() {
    if (loading) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("uytap_token");
      if (!token) {
        throw new Error("Сначала войдите в аккаунт");
      }

      const form = new FormData();
      form.append("first_name", firstName);
      form.append("last_name", lastName);
      form.append("phone", phone);
      form.append("about", about);

      if (avatarFile) {
        form.append("avatar", avatarFile);
      }

      const response = await fetch("/api/auth/avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Не удалось сохранить аватар");
      }

      const refreshedProfile = result.profile || {};
      const updatedUser = {
        ...user,
        profile: {
          ...(user?.profile || {}),
          ...refreshedProfile,
          avatar_url: refreshedProfile.avatar_url || refreshedProfile.avatar || user?.profile?.avatar_url || user?.profile?.avatar || null,
          avatar: refreshedProfile.avatar_url || refreshedProfile.avatar || user?.profile?.avatar_url || user?.profile?.avatar || null,
        },
      };
      localStorage.setItem("uytap_user", JSON.stringify(updatedUser));
      // Notify other parts of the app (same window) that the user was updated
      try {
        window.dispatchEvent(new CustomEvent("uytap:user-updated", { detail: updatedUser }));
      } catch (e) {
        console.warn("Could not dispatch user-updated event", e);
      }

      const payload = {
        firstName,
        lastName,
        phone,
        about,
      };

      console.log("UpdateMe payload:", payload);
      const updateResult = await updateMe(token, payload).catch((e) => {
        console.error("updateMe error:", e);
        throw e;
      });
      console.log("updateMe result:", updateResult);
      const freshUser = await getMe(token);
      console.log("getMe after update:", freshUser);
      localStorage.setItem("uytap_user", JSON.stringify(freshUser));
      close();
    } catch (error) {
      console.error("PROFILE SAVE ERROR:", error);
      alert(error.message || "Не удалось сохранить профиль");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={close}>
          <X />
        </button>

        <div className={styles.scroll}>
          <header className={styles.header}>
            <h2>Редактирование профиля</h2>

            <p>Обновите личные данные</p>
          </header>

          <div className={styles.avatarBlock}>
            <div className={styles.avatar}>
              {avatar ? <img src={avatar} alt="avatar" /> : <User />}
            </div>

            <label className={styles.upload}>
              <Camera />
              Изменить фото
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
              />
            </label>

            {avatar && (
              <button className={styles.remove} onClick={removeAvatar}>
                <Trash2 />
                Удалить
              </button>
            )}
          </div>

          <div className={styles.fields}>
            <div className={styles.row}>
              <div className={styles.inputBox}>
                <User />

                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Имя"
                />
              </div>

              <div className={styles.inputBox}>
                <User />

                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Фамилия"
                />
              </div>
            </div>

            <div className={styles.inputBox}>
              <Phone />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Телефон"
              />
            </div>

            <div className={styles.textarea}>
              <FileText />

              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Расскажите о себе"
              />
            </div>

            {user?.accountType === "personal" && (
              <CustomSelect
                icon={UserRoundCog}
                title="Тип аккаунта"
                options={accountTypes}
                value={type}
                setValue={setType}
              />
            )}
          </div>

          <button className={styles.save} onClick={save} disabled={loading}>
            <Check />
            {loading ? "Сохраняем..." : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </div>
  );
}
