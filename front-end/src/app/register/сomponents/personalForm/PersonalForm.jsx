"use client";

import { User, Phone, Mail, Lock } from "lucide-react";

import styles from "./PersonalForm.module.css";
import InputField from "../inputField/InputField";

export default function PersonalForm() {
  return (
    <div className={styles.form}>
      <InputField icon={User} placeholder="Имя" />

      <InputField icon={User} placeholder="Фамилия" />

      <InputField icon={Phone} placeholder="+996 990 000 000" />

      <InputField icon={Mail} placeholder="Email" />

      <InputField icon={Lock} placeholder="Пароль" password />

      <button className={styles.submit}>Создать аккаунт</button>
    </div>
  );
}
