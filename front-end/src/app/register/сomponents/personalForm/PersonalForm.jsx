"use client";

import { useState } from "react";
import { User, Phone, Mail, Lock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./PersonalForm.module.css";
import InputField from "../inputField/InputField";
import { registerUser } from "@/utils/api";

function formatPhone(value) {
  // Оставляем только цифры
  let digits = value.replace(/\D/g, "");

  // Если пользователь вставил +996 — убираем код страны,
  // потому что он добавляется автоматически
  if (digits.startsWith("996")) {
    digits = digits.slice(3);
  }

  // Максимум 9 цифр после +996
  digits = digits.slice(0, 9);

  let formatted = "+996";

  if (digits.length > 0) {
    formatted += ` ${digits.slice(0, 3)}`;
  }

  if (digits.length > 3) {
    formatted += ` ${digits.slice(3, 6)}`;
  }

  if (digits.length > 6) {
    formatted += ` ${digits.slice(6, 9)}`;
  }

  return formatted;
}

function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, "");

  // На backend отправляем +996XXXXXXXXX
  return `+996${digits.slice(-9)}`;
}

export default function PersonalForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+996 ");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePhoneChange = (value) => {
    setPhone(formatPhone(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const normalizedPhone = normalizePhone(phone);

    // Проверяем, что введены все 9 цифр
    const phoneDigits = normalizedPhone.replace(/\D/g, "");

    if (phoneDigits.length !== 12) {
      setError("Введите полный номер телефона в формате +996 XXX XXX XXX");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        accountType: "personal",
        firstName,
        lastName,
        phone: normalizedPhone,
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem("uytap_token", data.token);
        localStorage.setItem("uytap_user", JSON.stringify(data.user));
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/success-register");
      }, 1200);
    } catch (err) {
      setError(err.message || "Ошибка при регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <InputField
        icon={User}
        placeholder="Имя"
        value={firstName}
        setValue={setFirstName}
      />

      <InputField
        icon={User}
        placeholder="Фамилия"
        value={lastName}
        setValue={setLastName}
      />

      <InputField
        icon={Phone}
        placeholder="+996 000 000 000"
        value={phone}
        setValue={handlePhoneChange}
        type="tel"
      />

      <InputField
        icon={Mail}
        placeholder="Email"
        type="email"
        value={email}
        setValue={setEmail}
      />

      <InputField
        icon={Lock}
        placeholder="Пароль"
        password
        value={password}
        setValue={setPassword}
      />

      {error && (
        <div
          style={{
            color: "#ef4444",
            fontSize: "14px",
            marginTop: "4px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div
          style={{
            color: "#10b981",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <CheckCircle2 size={18} />
          Аккаунт успешно создан! Перенаправление...
        </div>
      )}

      <button className={styles.submit} type="submit" disabled={loading}>
        {loading ? "Создание аккаунта..." : "Создать аккаунт"}
      </button>
    </form>
  );
}
