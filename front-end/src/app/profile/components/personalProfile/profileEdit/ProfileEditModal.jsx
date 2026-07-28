"use client";

import { useState } from "react";

import {
  X,
  Camera,
  Phone,
  User,
  MessageCircle,
  UserRoundCog,
  Check,
} from "lucide-react";

import styles from "./ProfileEditModal.module.css";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

export default function ProfileEditModal({ close }) {
  const [type, setType] = useState("Частное лицо");

  const accountTypes = ["Частное лицо", "Риэлтор", "Агентство", "Застройщик"];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={close}>
          <X />
        </button>

        <div className={styles.scroll}>
          <div className={styles.header}>
            <h2>Редактирование профиля</h2>

            <p>Измените данные вашего аккаунта</p>
          </div>

          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              <Camera />
            </div>

            <button className={styles.upload}>Загрузить фото</button>
          </div>

          <div className={styles.fields}>
            <div className={styles.inputBox}>
              <User />

              <input placeholder="ФИО" />
            </div>

            <div className={styles.inputBox}>
              <Phone />

              <input placeholder="Номер телефона" />
            </div>

            <div className={styles.inputBox}>
              <MessageCircle />

              <input placeholder="WhatsApp" />
            </div>

            <CustomSelect
              icon={UserRoundCog}
              title="Тип аккаунта"
              options={accountTypes}
              value={type}
              setValue={setType}
            />
          </div>

          <button className={styles.save}>
            <Check />
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}
