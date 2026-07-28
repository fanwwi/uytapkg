"use client";

import {
  X,
  Camera,
  Building2,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  FileText,
} from "lucide-react";

import { useState } from "react";

import styles from "./DeveloperEditModal.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

export default function DeveloperEditModal({ close }) {
  const [type, setType] = useState("Застройщик");

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={close}>
          <X />
        </button>

        <h2>Редактирование компании</h2>

        <div className={styles.logo}>
          <Camera />
        </div>

        <div className={styles.form}>
          <div className={styles.input}>
            <Building2 />
            <input placeholder="Название компании" />
          </div>

          <div className={styles.input}>
            <FileText />
            <input placeholder="Описание" />
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
            <input placeholder="Адрес офиса" />
          </div>

          <textarea placeholder="О компании" />

          <button className={styles.save}>Сохранить</button>
        </div>
      </div>
    </div>
  );
}
