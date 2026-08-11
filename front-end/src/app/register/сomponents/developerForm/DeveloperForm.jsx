"use client";

import { useState } from "react";
import {
  Building,
  Phone,
  Mail,
  FileCheck,
  MapPin,
  Lock,
  EyeOff,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./DeveloperForm.module.css";
import { registerUser } from "@/utils/api";

function formatPhone(value) {
  // Оставляем только цифры
  let digits = value.replace(/\D/g, "");

  // Если вставили 996XXXXXXXXX — убираем 996
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

  return `+996${digits.slice(-9)}`;
}

export default function DeveloperForm() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [inn, setInn] = useState("");
  const [phone, setPhone] = useState("+996 ");
  const [email, setEmail] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [about, setAbout] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    const phoneDigits = normalizedPhone.replace(/\D/g, "");

    // +996 + 9 цифр = 12 цифр
    if (phoneDigits.length !== 12) {
      setError("Введите полный номер телефона в формате +996 XXX XXX XXX");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        accountType: "developer",
        companyName,
        inn,
        phone: normalizedPhone,
        email,
        officeAddress,
        about,
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
      setError(err.message || "Ошибка при регистрации застройщика");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
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

          <input
            placeholder="Название компании"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputBox}>
          <FileCheck />

          <input
            placeholder="ИНН компании"
            value={inn}
            onChange={(e) => setInn(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputBox}>
          <Phone />

          <input
            type="tel"
            placeholder="+996 000 000 000"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            inputMode="numeric"
            required
          />
        </div>

        <div className={styles.inputBox}>
          <Mail />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputBox}>
          <MapPin />

          <input
            placeholder="Адрес офиса"
            value={officeAddress}
            onChange={(e) => setOfficeAddress(e.target.value)}
          />
        </div>

        <div className={styles.inputBox}>
          <Lock />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className={styles.eye}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Описание компании"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
      />

      {error && (
        <div
          style={{
            color: "#ef4444",
            fontSize: "14px",
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
          Профиль застройщика создан! Перенаправление...
        </div>
      )}

      <button className={styles.submit} type="submit" disabled={loading}>
        {loading ? "Создание профиля..." : "Создать профиль"}
      </button>
    </form>
  );
}
