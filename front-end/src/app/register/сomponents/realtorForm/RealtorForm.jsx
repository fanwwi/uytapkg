"use client";

import { Building2, Phone, Mail, FileText } from "lucide-react";

import styles from "./RealtorForm.module.css";

export default function RealtorForm() {
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
          <input placeholder="Номер телефона" />
        </div>

        <div className={styles.inputBox}>
          <Mail />
          <input placeholder="Email" />
        </div>

        <div className={styles.inputBox}>
          <Building2 />
          <input placeholder="Название агентства" />
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
