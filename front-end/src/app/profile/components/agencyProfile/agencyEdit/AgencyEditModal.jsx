"use client";

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

export default function AgencyEditModal({ close }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={close}>
          <X />
        </button>

        <h2>Редактирование агентства</h2>

        <div className={styles.logoUpload}>
          <Camera />

          <span>Загрузить логотип</span>
        </div>

        <div className={styles.input}>
          <Building2 />
          <input placeholder="Название агентства" />
        </div>

        <div className={styles.input}>
          <User />
          <input placeholder="Имя руководителя" />
        </div>

        <div className={styles.input}>
          <Phone />
          <input placeholder="Телефон" />
        </div>

        <div className={styles.input}>
          <Mail />
          <input placeholder="Email" />
        </div>

        <div className={styles.input}>
          <MapPin />
          <input placeholder="Адрес" />
        </div>

        <div className={styles.input}>
          <Globe />
          <input placeholder="Сайт" />
        </div>

        <textarea placeholder="Описание агентства" />

        <button className={styles.save}>Сохранить изменения</button>
      </div>
    </div>
  );
}
