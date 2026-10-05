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
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "./Agency.module.css";
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

  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    /*
    |--------------------------------------------------------------------------
    | POLICY VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!privacyAccepted || !termsAccepted) {
      setError(
        "Необходимо принять Политику конфиденциальности и Пользовательское соглашение.",
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | PHONE VALIDATION
    |--------------------------------------------------------------------------
    */

    const normalizedPhone = normalizePhone(phone);
    const phoneDigits = normalizedPhone.replace(/\D/g, "");

    if (phoneDigits.length !== 12) {
      setError("Введите полный номер телефона в формате +996 XXX XXX XXX");

      return;
    }

    setLoading(true);

    try {
      await registerUser({
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

      // token и user сохраняются внутри registerUser()

      setSuccess(true);

      setTimeout(() => {
        router.push("/auth-code");
      }, 1200);
    } catch (err) {
      setError(err.message || "Ошибка при регистрации агентства");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}

      <div className={styles.header}>
        <div className={styles.logo}>
          <Building2 />
        </div>

        <div>
          <h2>Агентство недвижимости</h2>
          <p>Создайте профиль компании</p>
        </div>
      </div>

      {/* FORM */}

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* COMPANY NAME */}

        <div className={styles.inputBox}>
          <Building2 />

          <input
            placeholder="Название агентства"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        {/* DIRECTOR */}

        <div className={styles.inputBox}>
          <User />

          <input
            placeholder="Имя руководителя"
            value={directorName}
            onChange={(e) => setDirectorName(e.target.value)}
            required
          />
        </div>

        {/* PHONE */}

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

        {/* EMAIL */}

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

        {/* OFFICE ADDRESS */}

        <div className={styles.inputBox}>
          <MapPin />

          <input
            placeholder="Адрес офиса"
            value={officeAddress}
            onChange={(e) => setOfficeAddress(e.target.value)}
          />
        </div>

        {/* INN */}

        <div className={styles.inputBox}>
          <FileText />

          <input
            placeholder="ИНН агентства"
            value={inn}
            onChange={(e) => setInn(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD */}

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
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* ABOUT */}

        <textarea
          className={styles.textarea}
          placeholder="Расскажите об агентстве: опыт работы, направления, районы и преимущества"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />

        {/* POLICIES */}

        <div className={styles.policyBlock}>
          <div className={styles.policyHeader}>
            <ShieldCheck />

            <span>
              Перед созданием профиля ознакомьтесь с условиями использования
              UyTap
            </span>
          </div>

          {/* PRIVACY */}

          <div className={styles.checkboxRow}>
            <input
              id="agency-privacy"
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
            />

            <label htmlFor="agency-privacy" className={styles.checkbox}>
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

          {/* TERMS */}

          <div className={styles.checkboxRow}>
            <input
              id="agency-terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />

            <label htmlFor="agency-terms" className={styles.checkbox}>
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

        {/* ERROR */}

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

        {/* SUCCESS */}

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

        {/* SUBMIT */}

        <button
          className={styles.submit}
          type="submit"
          disabled={loading || !privacyAccepted || !termsAccepted}
        >
          {loading ? "Создание профиля..." : "Создать профиль"}
        </button>
      </form>
    </div>
  );
}
