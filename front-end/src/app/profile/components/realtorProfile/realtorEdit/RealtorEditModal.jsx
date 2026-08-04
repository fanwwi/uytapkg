"use client";

import { useState, useRef } from "react";

import {
  Camera,
  User,
  Building2,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  X,
  FileText,
  Hash,
} from "lucide-react";

import styles from "./RealtorEditModal.module.css";

export default function RealtorEditModal({ close, user }) {
  const fileRef = useRef(null);

  const profile = user?.profile || {};

  const [preview, setPreview] = useState(
    profile.avatar_url || profile.logo_url || "",
  );

  const [form, setForm] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",

    company_name: profile.company_name || "",

    phone: user?.phone || "",

    whatsapp: profile.whatsapp || user?.phone || "",

    email: user?.email || profile.email || "",

    website: profile.website || "",

    office_address: profile.office_address || "",

    inn: profile.inn || "",

    about: profile.about || "",
  });

  function change(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function uploadLogo(e) {
    const file = e.target.files[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreview(url);
  }

  async function save() {
    console.log({
      ...form,
      logo: preview,
    });

    // API PUT /profile/update
  }

  return (
    <div className={styles.overlay}>
      <button className={styles.overlayClose} onClick={close}>
        <X />
      </button>

      <div className={styles.modal}>
        <h2>Редактирование профиля</h2>

        <div className={styles.avatar} onClick={() => fileRef.current.click()}>
          {preview ? <img src={preview} alt="avatar" /> : <Camera />}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={uploadLogo}
          />
        </div>

        <div className={styles.form}>
          <div className={styles.row}>
            <div className={styles.input}>
              <User />

              <input
                name="first_name"
                value={form.first_name}
                onChange={change}
                placeholder="Имя"
              />
            </div>

            <div className={styles.input}>
              <User />

              <input
                name="last_name"
                value={form.last_name}
                onChange={change}
                placeholder="Фамилия"
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
            />
          </div>

          <div className={styles.input}>
            <Phone />

            <input
              name="phone"
              value={form.phone}
              onChange={change}
              placeholder="Телефон"
            />
          </div>

          <div className={styles.input}>
            <MessageCircle />

            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={change}
              placeholder="WhatsApp"
            />
          </div>

          <div className={styles.input}>
            <Hash />

            <input
              name="inn"
              value={form.inn}
              onChange={change}
              placeholder="ИНН"
            />
          </div>

          <div className={styles.input}>
            <Globe />

            <input
              name="website"
              value={form.website}
              onChange={change}
              placeholder="Сайт"
            />
          </div>

          <div className={styles.input}>
            <MapPin />

            <input
              name="office_address"
              value={form.office_address}
              onChange={change}
              placeholder="Адрес компании"
            />
          </div>

          <textarea
            className={styles.textarea}
            name="about"
            value={form.about}
            onChange={change}
            placeholder="Описание"
          />

          <button className={styles.save} onClick={save}>
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}
