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
} from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./RealtorForm.module.css";
import { registerUser } from "@/utils/api";

export default function RealtorForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [about, setAbout] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser({
        accountType: "realtor",
        fullName,
        phone,
        email,
        agencyName,
        about,
        password,
      });

      if (data.token) {
        localStorage.setItem("uytap_token", data.token);
        localStorage.setItem("uytap_user", JSON.stringify(data.user));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/main");
      }, 1500);
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
            placeholder="Номер телефона"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

        {/* Пароль */}
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
            onClick={() => setShowPassword(!showPassword)}
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

      {error && (
        <div style={{ color: "#ef4444", fontSize: "14px" }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{ color: "#10b981", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
          <CheckCircle2 size={18} /> Профиль риэлтора создан! Перенаправление...
        </div>
      )}

      <button className={styles.submit} type="submit" disabled={loading}>
        {loading ? "Создание профиля..." : "Создать профиль риэлтора"}
      </button>
    </form>
  );
}
