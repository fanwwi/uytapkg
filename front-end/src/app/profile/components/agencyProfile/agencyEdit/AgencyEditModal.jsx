"use client";

import { useState } from "react";

import {
  X,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Camera,
} from "lucide-react";

import styles from "./AgencyEditModal.module.css";

export default function AgencyEditModal({ close, user }) {
  const profile = user?.profile || {};

  const [form, setForm] = useState({
    company_name: profile.company_name || profile.agency_name || "",

    director_name: profile.director_name || "",

    phone: user?.phone || "",

    email: profile.email || "",

    address: profile.address || "",

    city: profile.city || "",

    website: profile.website || "",

    about: profile.about || "",
  });

  const logo = profile.logo_url || profile.avatar_url || "";

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function save() {
    console.log(form);

    // тут API
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={close}>
          <X />
        </button>

        <h2>Редактирование агентства</h2>

        <div className={styles.logoUpload}>
          {logo ? (
            <img src={logo} alt="" />
          ) : (
            <>
              <Camera />
              <span>Загрузить логотип</span>
            </>
          )}
        </div>

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
            placeholder="Адрес"
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
