"use client";

import { Building2, User, Phone, Mail, MapPin, FileText } from "lucide-react";

import styles from "./Agency.module.css";

export default function Agency() {
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

        <textarea
          className={styles.textarea}
          placeholder="Расскажите об агентстве: опыт работы, направления, районы и преимущества"
        />

        <button className={styles.submit}>Создать профиль</button>
      </div>
    </div>
  );
}
