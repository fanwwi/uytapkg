"use client";

import { useRef, useState } from "react";

import {
  X,
  Camera,
  Building2,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  FileText,
  Hash,
} from "lucide-react";

import styles from "./DeveloperEditModal.module.css";

export default function DeveloperEditModal({ close, user }) {
  const fileRef = useRef(null);

  const profile = user?.profile || {};

  const [logoPreview, setLogoPreview] = useState(profile.logo_url || null);

  const [form, setForm] = useState({
    company_name: profile.company_name || "",

    inn: profile.inn || "",

    phone: user?.phone || "",

    whatsapp: profile.whatsapp || user?.phone || "",

    website: profile.website || "",

    office_address: profile.office_address || "",

    about: profile.about || "",
  });

  function change(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function chooseLogo() {
    fileRef.current.click();
  }

  function uploadLogo(e) {
    const file = e.target.files[0];

    if (!file) return;

    setLogoPreview(URL.createObjectURL(file));
  }

  function save() {
    const data = {
      ...form,

      logo: logoPreview,
    };

    console.log(data);

    // PUT API
  }

  return (
    <div className={styles.overlay}>
      <button className={styles.close} onClick={close}>
        <X />
      </button>

      <div className={styles.modal}>
        <h2>Редактирование компании</h2>

        <div className={styles.logo} onClick={chooseLogo}>
          {logoPreview ? (
            <img src={logoPreview} alt="logo" />
          ) : (
            <>
              <Camera />
              <span>Логотип</span>
            </>
          )}
        </div>

        <input
          ref={fileRef}
          hidden
          type="file"
          accept="image/*"
          onChange={uploadLogo}
        />

        <div className={styles.form}>
          <div className={styles.input}>
            <Building2 />

            <input
              name="company_name"
              value={form.company_name}
              onChange={change}
              placeholder="Название компании"
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
              placeholder="Адрес офиса"
            />
          </div>

          <textarea
            className={styles.textarea}
            name="about"
            value={form.about}
            onChange={change}
            placeholder="О компании"
          />

          <button className={styles.save} onClick={save}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
