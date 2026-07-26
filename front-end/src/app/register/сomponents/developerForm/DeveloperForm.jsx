"use client";

import { Building, Phone, Mail, FileCheck, MapPin, Lock, EyeOff, Eye } from "lucide-react";

import styles from "./DeveloperForm.module.css";
import { useState } from "react";

export default function DeveloperForm() {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Building />

        <div>
          <h2>Профиль застройщика</h2>

          <p>Создайте страницу вашей компании</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.inputBox}>
          <Building />
          <input placeholder="Название компании" />
        </div>

        <div className={styles.inputBox}>
          <FileCheck />
          <input placeholder="ИНН компании" />
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

        <div className={styles.inputBox}>
          <MapPin />
          <input placeholder="Адрес офиса" />
        </div>
      </div>

      <textarea className={styles.textarea} placeholder="Описание компании" />

      <button className={styles.submit}>Создать профиль</button>
    </div>
  );
}
