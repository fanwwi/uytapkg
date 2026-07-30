"use client";

import { useState } from "react";
import { Building, Phone, Mail, FileCheck, MapPin, Lock, EyeOff, Eye, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./DeveloperForm.module.css";
import { registerUser } from "@/utils/api";

export default function DeveloperForm() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [inn, setInn] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
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
        accountType: "developer",
        companyName,
        inn,
        phone,
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
        router.push("/main");
      }, 1500);
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
            placeholder="Телефон"
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
        <div style={{ color: "#ef4444", fontSize: "14px" }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{ color: "#10b981", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
          <CheckCircle2 size={18} /> Профиль застройщика создан! Перенаправление...
        </div>
      )}

      <button className={styles.submit} type="submit" disabled={loading}>
        {loading ? "Создание профиля..." : "Создать профиль"}
      </button>
    </form>
  );
}
