"use client";

import { useState } from "react";

import {
  Building2,
  Phone,
  Mail,
  FileText,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import styles from "./RealtorForm.module.css";

export default function RealtorForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Building2 />

        <div>
          <h2>Профиль риэлтора</h2>
          <p>Расскажите о вашей деятельности</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.inputBox}>
          <FileText />

          <input placeholder="ФИО" />
        </div>

        <div className={styles.inputBox}>
          <Phone />

          <input placeholder="Номер телефона" type="tel" />
        </div>

        <div className={styles.inputBox}>
          <Mail />

          <input placeholder="Email" type="email" />
        </div>

        <div className={styles.inputBox}>
          <Building2 />

          <input placeholder="Название агентства" />
        </div>

        {/* Пароль */}

        <div className={styles.inputBox}>
          <Lock />

          <input
            placeholder="Пароль"
            type={showPassword ? "text" : "password"}
          />

          <button
            type="button"
            className={styles.eye}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <textarea
        className={styles.textarea}
        placeholder="О себе / опыт работы"
      />

      <button className={styles.submit}>Создать профиль риэлтора</button>
    </div>
  );
}
