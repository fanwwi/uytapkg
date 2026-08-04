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
  CreditCard,
  Hash,
} from "lucide-react";

import styles from "./AgencyEditModal.module.css";

export default function AgencyEditModal({ close, user }) {
  const fileRef = useRef(null);

  const profile = user?.profile || {};

  const [logoPreview, setLogoPreview] = useState(
    profile.logo_url || profile.avatar_url || null,
  );

  const [form, setForm] = useState({
    company_name: profile.company_name || "",

    director_name: profile.first_name || "",

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
    fileRef.current.click();
  }

  function handleLogo(e) {
    const file = e.target.files[0];

    if (!file) return;

    const image = URL.createObjectURL(file);

    setLogoPreview(image);
  }

  async function save() {
    const data = {
      ...form,
      logo: logoPreview,
    };

    console.log("SAVE:", data);

    // API PUT /profile/update
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={close}>
          <X />
        </button>

        <h2>Редактирование агентства</h2>

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
            placeholder="Имя руководителя"
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
        />

        <button className={styles.save} onClick={save}>
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}
