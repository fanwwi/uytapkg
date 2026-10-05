"use client";

import { useState } from "react";
import {
  Building2,
  Phone,
  Mail,
  FileText,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "./RealtorForm.module.css";
import { registerUser } from "@/utils/api";

function formatPhone(value) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("996")) {
    digits = digits.slice(3);
  }

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

export default function RealtorForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+996 ");
  const [email, setEmail] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [about, setAbout] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!privacyAccepted || !termsAccepted) {
      setError(
        "Необходимо принять Политику конфиденциальности и Пользовательское соглашение.",
      );
      return;
    }

    const normalizedPhone = normalizePhone(phone);
    const phoneDigits = normalizedPhone.replace(/\D/g, "");

    if (phoneDigits.length !== 12) {
      setError("Введите полный номер телефона в формате +996 XXX XXX XXX");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        accountType: "realtor",
        fullName,
        phone: normalizedPhone,
        email,
        agencyName,
        about,
        password,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/auth-code");
      }, 1200);
    } catch (err) {
      setError(err.message || "Ошибка при регистрации профиля риэлтора");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
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

          <input
            placeholder="ФИО"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
            onChange={(e) => setPhone(formatPhone(e.target.value))}
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
          <Building2 />

          <input
            placeholder="Название агентства (опционально)"
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
          />
        </div>

        <div className={styles.inputBox}>
          <Lock />

          <input
            placeholder="Пароль"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className={styles.eye}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <textarea
        className={styles.textarea}
        placeholder="О себе / опыт работы"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
      />

      <div className={styles.policyBlock}>
        <div className={styles.policyHeader}>
          <ShieldCheck />

          <span>
            Перед созданием аккаунта ознакомьтесь с условиями использования
            UyTap
          </span>
        </div>

        <div className={styles.checkboxRow}>
          <input
            id="realtor-privacy"
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
          />

          <label htmlFor="realtor-privacy" className={styles.checkbox}>
            {privacyAccepted && <CheckCircle2 />}
          </label>

          <span className={styles.checkboxText}>
            Я принимаю{" "}
            <Link
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Политику конфиденциальности
            </Link>
          </span>
        </div>

        <div className={styles.checkboxRow}>
          <input
            id="realtor-terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />

          <label htmlFor="realtor-terms" className={styles.checkbox}>
            {termsAccepted && <CheckCircle2 />}
          </label>

          <span className={styles.checkboxText}>
            Я принимаю{" "}
            <Link href="/terms" target="_blank" rel="noopener noreferrer">
              Пользовательское соглашение
            </Link>
          </span>
        </div>
      </div>

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
          Профиль риэлтора создан! Перенаправление...
        </div>
      )}

      <button
        className={styles.submit}
        type="submit"
        disabled={loading || !privacyAccepted || !termsAccepted}
      >
        {loading ? "Создание профиля..." : "Создать профиль риэлтора"}
      </button>
    </form>
  );
}
