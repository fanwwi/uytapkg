"use client";

import { useState } from "react";

import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import styles from "./Agency.module.css";

export default function Agency() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Building2 />
        </div>

        <div>
          <h2>Агентство недвижимости</h2>

          <p>Создайте профиль компании</p>
        </div>
      </div>

      <div className={styles.form}>
        <div className={styles.inputBox}>
          <Building2 />

          <input placeholder="Название агентства" />
        </div>

        <div className={styles.inputBox}>
          <User />

          <input placeholder="Имя руководителя" />
        </div>

        <div className={styles.inputBox}>
          <Phone />

          <input placeholder="Телефон" />
        </div>

        <div className={styles.inputBox}>
          <Mail />

          <input placeholder="Email" />
        </div>

        <div className={styles.inputBox}>
          <MapPin />

          <input placeholder="Адрес офиса" />
        </div>

        <div className={styles.inputBox}>
          <FileText />

          <input placeholder="ИНН агентства" />
        </div>

        {/* Пароль */}

        <div className={styles.inputBox}>
          <Lock />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
          />

          <button
            type="button"
            className={styles.eye}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Расскажите об агентстве: опыт работы, направления, районы и преимущества"
        />

        <button className={styles.submit}>Создать профиль</button>
      </div>
    </div>
  );
}
