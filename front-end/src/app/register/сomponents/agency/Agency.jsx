"use client";

import { useState } from "react";
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./Agency.module.css";
import { registerUser } from "@/utils/api";

function formatPhone(value) {
  // Оставляем только цифры
  let digits = value.replace(/\D/g, "");

  // Убираем +996, если пользователь вставил его сам
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

export default function Agency() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [phone, setPhone] = useState("+996 ");
  const [email, setEmail] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [inn, setInn] = useState("");
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

    // +996 + 9 цифр
    if (phoneDigits.length !== 12) {
      setError("Введите полный номер телефона в формате +996 XXX XXX XXX");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        accountType: "agency",
        companyName,
        directorName,
        phone: normalizedPhone,
        email,
        officeAddress,
        inn,
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
      setError(err.message || "Ошибка при регистрации агентства");
    } finally {
      setLoading(false);
    }
  };

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

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputBox}>
          <Building2 />

          <input
            placeholder="Название агентства"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputBox}>
          <User />

          <input
            placeholder="Имя руководителя"
            value={directorName}
            onChange={(e) => setDirectorName(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputBox}>
          <Phone />

          <input
            placeholder="+996 000 000 000"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
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
          <FileText />

          <input
            placeholder="ИНН агентства"
            value={inn}
            onChange={(e) => setInn(e.target.value)}
            required
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

        <textarea
          className={styles.textarea}
          placeholder="Расскажите об агентстве: опыт работы, направления, районы и преимущества"
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
            Профиль агентства создан! Перенаправление...
          </div>
        )}

        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? "Создание профиля..." : "Создать профиль"}
        </button>
      </form>
    </div>
  );
}
