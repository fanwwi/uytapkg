"use client";

import {
  X,
  Camera,
  User,
  Building2,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
} from "lucide-react";

import { useState } from "react";

import styles from "./RealtorEditModal.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

export default function RealtorEditModal({ close }) {
  const [type, setType] = useState("Риэлтор");

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={close}>
          <X />
        </button>

        <h2>Редактирование профиля</h2>

        <div className={styles.avatar}>
          <Camera />
        </div>

        <div className={styles.form}>
          <div className={styles.input}>
            <User />
            <input placeholder="ФИО" />
          </div>

          <div className={styles.input}>
            <Building2 />
            <input placeholder="Название агентства" />
          </div>

          <div className={styles.input}>
            <Phone />
            <input placeholder="Телефон" />
          </div>

          <div className={styles.input}>
            <MessageCircle />
            <input placeholder="WhatsApp" />
          </div>

          <div className={styles.input}>
            <Globe />
            <input placeholder="Сайт" />
          </div>

          <div className={styles.input}>
            <MapPin />
            <input placeholder="Адрес" />
          </div>

          <textarea placeholder="Описание" />

          <button className={styles.save}>Сохранить изменения</button>
        </div>
      </div>
    </div>
  );
}
